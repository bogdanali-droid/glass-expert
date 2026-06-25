/**
 * GET  /api/clients/:id/tasks — listare task-uri
 * POST /api/clients/:id/tasks — creare task
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
            .prepare('SELECT * FROM tasks WHERE client_id = ? ORDER BY done ASC, due_date ASC, id ASC')
            .bind(id)
            .all();

        return json({ tasks: result.results, total: result.results.length });
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

    const { text, due_date } = body;
    if (!text || !text.trim()) return err('text este obligatoriu');

    try {
        const client = await DB
            .prepare('SELECT id FROM clients WHERE id = ?')
            .bind(id)
            .first();
        if (!client) return err('Clientul nu există', 404);

        const ts = now();

        const result = await DB.prepare(`
            INSERT INTO tasks (client_id, text, due_date, done, created_at)
            VALUES (?, ?, ?, 0, ?)
        `).bind(id, text.trim(), due_date || null, ts).run();

        const task = await DB
            .prepare('SELECT * FROM tasks WHERE id = ?')
            .bind(result.meta.last_row_id)
            .first();

        return json({ task }, 201);
    } catch (e) {
        return err('Database error: ' + e.message, 500);
    }
}
