/**
 * POST /api/import/pipedrive
 *
 * Acceptă:
 *   - JSON array de deals Pipedrive (Content-Type: application/json)
 *   - FormData cu CSV file (Content-Type: multipart/form-data)
 *
 * Mapare Pipedrive → clients:
 *   org_name / organization_name → company
 *   person_name / contact_name   → contacts[0].name
 *   person email                 → contacts[0].email
 *   person phone                 → contacts[0].phone
 *   value                        → opportunity
 *   stage_name / status          → stage (mapat)
 *   id                           → pipedrive_id
 *
 * Returns: { imported: N, skipped: N, errors: [] }
 */

import { json, err, nextSeq, now, today, mapPipedriveStage } from '../_helpers.js';

// Câmpuri CSV acceptate (case-insensitive, variante multiple)
const CSV_MAP = {
    company: ['org_name', 'organization_name', 'company', 'denumire'],
    contact_name: ['person_name', 'contact_name', 'name', 'nume'],
    contact_email: ['email', 'person_email', 'contact_email'],
    contact_phone: ['phone', 'person_phone', 'contact_phone', 'telefon'],
    value: ['value', 'valoare', 'deal_value'],
    stage: ['stage_name', 'stage', 'status', 'etapa'],
    pipedrive_id: ['id', 'deal_id', 'pipedrive_id'],
    country: ['country', 'tara', 'org_country'],
    city: ['city', 'oras', 'org_city'],
};

function mapField(row, fieldKey) {
    const variants = CSV_MAP[fieldKey] || [fieldKey];
    for (const v of variants) {
        // Căutare case-insensitive în cheile rândului
        const found = Object.keys(row).find(k => k.toLowerCase().trim() === v.toLowerCase());
        if (found && row[found] !== undefined && row[found] !== '') return row[found];
    }
    return null;
}

function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    return lines.slice(1).map(line => {
        // Split CSV simplu (nu gestionează câmpuri cu virgule în interior între ghilimele)
        const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const row = {};
        headers.forEach((h, i) => { row[h] = vals[i] || ''; });
        return row;
    }).filter(row => Object.values(row).some(v => v));
}

async function importDeal(DB, deal, ts) {
    const company = mapField(deal, 'company') || deal.title || '';
    if (!company) return { skipped: true, reason: 'no_company' };

    const pipedriveId = String(mapField(deal, 'pipedrive_id') || deal.id || '');
    const stageName = mapField(deal, 'stage') || '';
    const stage = mapPipedriveStage(stageName);

    // Verificăm dacă există deja după pipedrive_id
    if (pipedriveId) {
        const existing = await DB
            .prepare('SELECT id FROM clients WHERE pipedrive_id = ?')
            .bind(pipedriveId)
            .first();
        if (existing) return { skipped: true, reason: 'duplicate_pipedrive_id', id: existing.id };
    }

    // Verificăm dacă există după company (fuzzy)
    const byCompany = await DB
        .prepare('SELECT id FROM clients WHERE LOWER(TRIM(company)) = LOWER(TRIM(?))')
        .bind(company)
        .first();
    if (byCompany) return { skipped: true, reason: 'duplicate_company', id: byCompany.id };

    const cod = await nextSeq(DB, 'clients', 'GE');
    const contactName = mapField(deal, 'contact_name') || '';
    const contactEmail = mapField(deal, 'contact_email') || '';
    const contactPhone = mapField(deal, 'contact_phone') || '';
    const opportunity = parseFloat(mapField(deal, 'value') || 0) || 0;
    const country = mapField(deal, 'country') || 'România';
    const city = mapField(deal, 'city') || '';

    await DB.prepare(`
        INSERT INTO clients
            (cod, alias, company, type, country, city,
             opportunity, stage, products, priority, source, tags, intel,
             pipedrive_id, created_at, last_activity, updated_at)
        VALUES (?, ?, ?, 'Altul', ?, ?, ?, ?, '[]', 'normal', 'Pipedrive', '[]', '', ?, ?, ?, ?)
    `).bind(
        cod, cod, company, country, city,
        opportunity, stage,
        pipedriveId || null,
        ts, today(), ts,
    ).run();

    const newClient = await DB
        .prepare('SELECT id FROM clients WHERE cod = ?')
        .bind(cod)
        .first();

    if (contactName && newClient) {
        await DB.prepare(`
            INSERT INTO contacts (client_id, name, email, phone, is_primary, created_at)
            VALUES (?, ?, ?, ?, 1, ?)
        `).bind(newClient.id, contactName, contactEmail, contactPhone, ts).run();
    }

    return { imported: true, cod, id: newClient?.id };
}

export async function onRequestPost(context) {
    const { DB } = context.env;
    const request = context.request;
    const contentType = request.headers.get('Content-Type') || '';

    let deals = [];

    try {
        if (contentType.includes('application/json')) {
            const body = await request.json();
            deals = Array.isArray(body) ? body : (body.deals || body.data || []);
        } else if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file') || formData.get('csv');
            if (!file) return err('Lipsește câmpul "file" în FormData');
            const text = typeof file === 'string' ? file : await file.text();
            deals = parseCSV(text);
        } else {
            // Încearcă JSON oricum
            try {
                const body = await request.json();
                deals = Array.isArray(body) ? body : [];
            } catch {
                return err('Content-Type nesuportat. Folosiți application/json sau multipart/form-data.');
            }
        }
    } catch (e) {
        return err('Eroare la parsarea request-ului: ' + e.message);
    }

    if (!deals.length) return err('Nu s-au găsit deal-uri de importat');

    const ts = now();
    let imported = 0;
    let skipped = 0;
    const errors = [];

    for (const deal of deals) {
        try {
            const result = await importDeal(DB, deal, ts);
            if (result.imported) imported++;
            else skipped++;
        } catch (e) {
            skipped++;
            errors.push({ deal: deal.id || deal.org_name || '?', error: e.message });
        }
    }

    return json({ imported, skipped, errors, total: deals.length });
}
