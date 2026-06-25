/**
 * GET  /api/clients/:id/contacts — listare contacte
 * POST /api/clients/:id/contacts — adaugă contact
 */

import { json, err, now } from '../../../_helpers.js';

export async function onRequestGet(context) {
    const { DB } = context.env;
    const { id } = context.params;

    try {
        const client = await DB
            .prepare('SELECT id FROM clients WHERE id = ?')
            .bind(id)
            .first();
        if (!client) return err('Clientul nu există', 404);

        const result = await DB
            .prepare('SELECT * FROM contacts WHERE client_id = ? ORDER BY is_primary DESC, id ASC')
            .bind(id)
            .all();

        return json({ contacts: result.results, total: result.results.length });
    } catch (e) {
        return err('Database error: ' + e.message, 500);
    }
}

export async function onRequestPost(context) {
    const { DB } = context.env;
    const { id } = context.params;

    let body;
    try {
        body = await context.request.json();
    } catch {
        return err('Invalid JSON body');
    }

    const { name, role, email, phone, is_primary } = body;
    if (!name || !name.trim()) return err('name este obligatoriu');

    try {
        const client = await DB
            .prepare('SELECT id FROM clients WHERE id = ?')
            .bind(id)
            .first();
        if (!client) return err('Clientul nu există', 404);

        const ts = now();

        // Dacă noul contact e primar, resetăm ceilalți
        if (is_primary) {
            await DB
                .prepare('UPDATE contacts SET is_primary = 0 WHERE client_id = ?')
                .bind(id)
                .run();
        }

        const result = await DB.prepare(`
            INSERT INTO contacts (client_id, name, role, email, phone, is_primary, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
            id,
            name.trim(),
            role || '',
            email || '',
            phone || '',
            is_primary ? 1 : 0,
            ts,
        ).run();

        const contact = await DB
            .prepare('SELECT * FROM contacts WHERE id = ?')
            .bind(result.meta.last_row_id)
            .first();

        return json({ contact }, 201);
    } catch (e) {
        return err('Database error: ' + e.message, 500);
    }
}
