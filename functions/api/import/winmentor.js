/**
 * POST /api/import/winmentor
 *
 * Acceptă CSV FormData cu coloane WinMentor standard:
 *   CodClient, Denumire, CUI, Adresa, Localitate, Tara, Email, Telefon
 *
 * Acceptă și variante cu lowercase sau cu diacritice.
 * Returns: { imported: N, skipped: N, errors: [] }
 */

import { json, err, nextSeq, now, today } from '../_helpers.js';

// Mapare câmpuri WinMentor (cheie → variante posibile în CSV)
const WM_MAP = {
    winmentor_code: ['codclient', 'cod_client', 'cod client', 'code', 'id'],
    company: ['denumire', 'denumire client', 'firma', 'company', 'name'],
    vat_code: ['cui', 'cif', 'vat', 'vat_code', 'cod fiscal', 'codfiscal'],
    city: ['localitate', 'oras', 'city', 'loc'],
    address: ['adresa', 'address', 'strada'],
    country: ['tara', 'country', 'tară'],
    email: ['email', 'e-mail', 'mail'],
    phone: ['telefon', 'phone', 'tel', 'mobil'],
    contact_name: ['persoana contact', 'contact', 'contact_name', 'persoana'],
};

function mapWMField(row, fieldKey) {
    const variants = WM_MAP[fieldKey] || [fieldKey];
    for (const v of variants) {
        const found = Object.keys(row).find(k => k.toLowerCase().trim() === v.toLowerCase());
        if (found && row[found] !== undefined && row[found].trim() !== '') return row[found].trim();
    }
    return '';
}

function parseCSV(text) {
    // Gestionăm BOM UTF-8 (WinMentor exportă cu BOM)
    const cleaned = text.replace(/^﻿/, '').trim();
    const lines = cleaned.split('\n');
    if (lines.length < 2) return [];

    // Detectăm delimitatorul (virgulă sau punct și virgulă)
    const firstLine = lines[0];
    const delimiter = firstLine.includes(';') ? ';' : ',';

    const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());

    return lines.slice(1).map(line => {
        const vals = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));
        const row = {};
        headers.forEach((h, i) => { row[h] = vals[i] || ''; });
        return row;
    }).filter(row => Object.values(row).some(v => v));
}

async function importClient(DB, row, ts) {
    const company = mapWMField(row, 'company');
    if (!company) return { skipped: true, reason: 'no_company' };

    const winmentorCode = mapWMField(row, 'winmentor_code');
    const vatCode = mapWMField(row, 'vat_code');

    // Verificăm duplicate după cod WinMentor
    if (winmentorCode) {
        const existing = await DB
            .prepare('SELECT id FROM clients WHERE winmentor_code = ?')
            .bind(winmentorCode)
            .first();
        if (existing) return { skipped: true, reason: 'duplicate_winmentor_code', id: existing.id };
    }

    // Verificăm duplicate după VAT code
    if (vatCode) {
        const existing = await DB
            .prepare('SELECT id FROM clients WHERE vat_code = ? AND vat_code != ""')
            .bind(vatCode)
            .first();
        if (existing) return { skipped: true, reason: 'duplicate_vat', id: existing.id };
    }

    // Verificăm duplicate după denumire exactă
    const byName = await DB
        .prepare('SELECT id FROM clients WHERE LOWER(TRIM(company)) = LOWER(TRIM(?))')
        .bind(company)
        .first();
    if (byName) return { skipped: true, reason: 'duplicate_company', id: byName.id };

    const cod = await nextSeq(DB, 'clients', 'GE');
    const city = mapWMField(row, 'city');
    const country = mapWMField(row, 'country') || 'România';
    const email = mapWMField(row, 'email');
    const phone = mapWMField(row, 'phone');
    const contactName = mapWMField(row, 'contact_name');

    await DB.prepare(`
        INSERT INTO clients
            (cod, alias, company, type, country, city, vat_code,
             opportunity, stage, products, priority, source, tags, intel,
             winmentor_code, created_at, last_activity, updated_at)
        VALUES (?, ?, ?, 'Client', ?, ?, ?, 0, 'comanda', '[]', 'normal', 'WinMentor', '[]', '', ?, ?, ?, ?)
    `).bind(
        cod, cod, company, country, city, vatCode,
        winmentorCode || null,
        ts, today(), ts,
    ).run();

    const newClient = await DB
        .prepare('SELECT id FROM clients WHERE cod = ?')
        .bind(cod)
        .first();

    // Inserăm contactul dacă există email sau telefon
    if (newClient && (contactName || email || phone)) {
        await DB.prepare(`
            INSERT INTO contacts (client_id, name, email, phone, is_primary, created_at)
            VALUES (?, ?, ?, ?, 1, ?)
        `).bind(
            newClient.id,
            contactName || company,
            email,
            phone,
            ts,
        ).run();
    }

    return { imported: true, cod, id: newClient?.id };
}

export async function onRequestPost(context) {
    const { DB } = context.env;
    const request = context.request;
    const contentType = request.headers.get('Content-Type') || '';

    let csvText = '';

    try {
        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file') || formData.get('csv');
            if (!file) return err('Lipsește câmpul "file" în FormData');
            csvText = typeof file === 'string' ? file : await file.text();
        } else if (contentType.includes('text/csv') || contentType.includes('text/plain')) {
            csvText = await request.text();
        } else {
            // Încearcă text direct
            try {
                csvText = await request.text();
            } catch {
                return err('Content-Type nesuportat. Folosiți multipart/form-data cu câmpul "file".');
            }
        }
    } catch (e) {
        return err('Eroare la citirea request-ului: ' + e.message);
    }

    if (!csvText.trim()) return err('Fișierul CSV este gol');

    const rows = parseCSV(csvText);
    if (!rows.length) return err('Nu s-au găsit rânduri valide în CSV');

    const ts = now();
    let imported = 0;
    let skipped = 0;
    const errors = [];

    for (const row of rows) {
        try {
            const result = await importClient(DB, row, ts);
            if (result.imported) imported++;
            else skipped++;
        } catch (e) {
            skipped++;
            errors.push({
                row: row.denumire || row.company || '?',
                error: e.message,
            });
        }
    }

    return json({ imported, skipped, errors, total: rows.length });
}
