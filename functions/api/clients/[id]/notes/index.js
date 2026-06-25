/**
 * GET  /api/clients/:id/notes — listare note
 * POST /api/clients/:id/notes — adaugă notă
 */

import { json, err, now, today } from '../../../_helpers.js';

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
            .prepare('SELECT * FROM notes WHERE client_id = ? ORDER BY note_date DESC, id DESC')
            .bind(id)
            .all();

        return json({ notes: result.results, total: result.results.length });
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

    const { text, note_date } = body;
    if (!text || !text.trim()) return err('text este obligatoriu');

    try {
        const client = await DB
            .prepare('SELECT id FROM clients WHERE id = ?')
            .bind(id)
            .first();
        if (!client) return err('Clientul nu există', 404);

        const ts = now();
        const noteDate = note_date || today();

        const result = await DB.prepare(`
            INSERT INTO notes (client_id, text, note_date, created_at)
            VALUES (?, ?, ?, ?)
        `).bind(id, text.trim(), noteDate, ts).run();

        // Actualizăm last_activity pe client
        await DB
            .prepare('UPDATE clients SET last_activity = ?, updated_at = ? WHERE id = ?')
            .bind(today(), ts, id)
            .run();

        const note = await DB
            .prepare('SELECT * FROM notes WHERE id = ?')
            .bind(result.meta.last_row_id)
            .first();

        return json({ note }, 201);
    } catch (e) {
        return err('Database error: ' + e.message, 500);
    }
}
