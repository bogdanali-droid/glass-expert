/**
 * GET  /api/clients — listă clienți cu filtre
 * POST /api/clients — creare client nou
 *
 * Query params GET: ?stage=&q=&type=&country=&product=&page=&limit=
 */

import { json, err, nextSeq, now, today, safeJsonParse } from '../_helpers.js';

export async function onRequestGet(context) {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const q = url.searchParams.get('q') || '';
    const stage = url.searchParams.get('stage') || '';
    const type = url.searchParams.get('type') || '';
    const country = url.searchParams.get('country') || '';
    const product = url.searchParams.get('product') || '';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(200, parseInt(url.searchParams.get('limit') || '50'));
    const offset = (page - 1) * limit;

    try {
        let where = [];
        let params = [];

        if (q) {
            where.push('(c.company LIKE ? OR c.alias LIKE ? OR c.cod LIKE ? OR c.city LIKE ?)');
            const like = `%${q}%`;
            params.push(like, like, like, like);
        }
        if (stage) { where.push('c.stage = ?'); params.push(stage); }
        if (type) { where.push('c.type = ?'); params.push(type); }
        if (country) { where.push('c.country = ?'); params.push(country); }
        if (product) { where.push('c.products LIKE ?'); params.push(`%${product}%`); }

        const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

        // Count total pentru paginare
        const countRow = await DB
            .prepare(`SELECT COUNT(*) as total FROM clients c ${whereClause}`)
            .bind(...params)
            .first();

        // Date clienți
        const result = await DB
            .prepare(`SELECT c.* FROM clients c ${whereClause} ORDER BY c.last_activity DESC, c.created_at DESC LIMIT ? OFFSET ?`)
            .bind(...params, limit, offset)
            .all();

        // Atașăm contactul primar la fiecare client (fără N+1 complet — un query per client e acceptabil pentru CRM mic)
        const clients = await Promise.all(result.results.map(async (client) => {
            const primaryContact = await DB
                .prepare('SELECT * FROM contacts WHERE client_id = ? AND is_primary = 1 LIMIT 1')
                .bind(client.id)
                .first();
            const pendingTasks = await DB
                .prepare('SELECT COUNT(*) as cnt FROM tasks WHERE client_id = ? AND done = 0')
                .bind(client.id)
                .first();
            return {
                ...client,
                products: safeJsonParse(client.products, []),
                tags: safeJsonParse(client.tags, []),
                primary_contact: primaryContact || null,
                pending_tasks: pendingTasks?.cnt || 0,
            };
        }));

        return json({
            clients,
            total: countRow?.total || 0,
            page,
            limit,
            pages: Math.ceil((countRow?.total || 0) / limit),
        });
    } catch (e) {
        return err('Database error: ' + e.message, 500);
    }
}

export async function onRequestPost(context) {
    const { DB } = context.env;

    let body;
    try {
        body = await context.request.json();
    } catch {
        return err('Invalid JSON body');
    }

    const { company, contacts = [], type, country, city, vat_code,
            opportunity, stage, products, priority, source, tags, intel,
            alias: aliasOverride } = body;

    if (!company || !company.trim()) return err('company este obligatoriu');

    try {
        const cod = await nextSeq(DB, 'clients', 'GE');
        const alias = aliasOverride || cod;
        const ts = now();

        await DB.prepare(`
            INSERT INTO clients
                (cod, alias, company, type, country, city, vat_code,
                 opportunity, stage, products, priority, source, tags, intel,
                 created_at, last_activity, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            cod,
            alias,
            company.trim(),
            type || 'Altul',
            country || 'România',
            city || '',
            vat_code || '',
            opportunity || 0,
            stage || 'prospect',
            JSON.stringify(products || []),
            priority || 'normal',
            source || 'Altul',
            JSON.stringify(tags || []),
            intel || '',
            ts,
            today(),
            ts,
        ).run();

        const client = await DB
            .prepare('SELECT * FROM clients WHERE cod = ?')
            .bind(cod)
            .first();

        // Inserăm contactele dacă există
        if (contacts.length > 0) {
            for (const ct of contacts) {
                if (!ct.name) continue;
                await DB.prepare(`
                    INSERT INTO contacts (client_id, name, role, email, phone, is_primary, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `).bind(
                    client.id,
                    ct.name,
                    ct.role || '',
                    ct.email || '',
                    ct.phone || '',
                    ct.is_primary ? 1 : 0,
                    ts,
                ).run();
            }
        }

        return json({ client, cod }, 201);
    } catch (e) {
        if (e.message?.includes('UNIQUE')) return err('Codul clientului există deja', 409);
        return err('Database error: ' + e.message, 500);
    }
}
