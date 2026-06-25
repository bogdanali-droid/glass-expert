/**
 * PUT    /api/clients/:id/tasks/:taskId — update task (toggle done, edit text/due_date)
 * DELETE /api/clients/:id/tasks/:taskId — ștergere task
 */

import { json, err, now } from '../../../_helpers.js';

export async function onRequestPut(context) {
    const { DB } = context.env;
    const { id, taskId } = context.params;

    let body;
    try {
        body = await context.request.json();
    } catch {
        return err('Invalid JSON body');
    }

    try {
        const task = await DB
            .prepare('SELECT * FROM tasks WHERE id = ? AND client_id = ?')
            .bind(taskId, id)
            .first();
        if (!task) return err('Task-ul nu există', 404);

        const sets = [];
        const params = [];

        if ('done' in body) {
            sets.push('done = ?');
            params.push(body.done ? 1 : 0);
        }
        if ('text' in body && body.text?.trim()) {
            sets.push('text = ?');
            params.push(body.text.trim());
        }
        if ('due_date' in body) {
            sets.push('due_date = ?');
            params.push(body.due_date || null);
        }

        if (sets.length === 0) return err('Niciun câmp de actualizat');

        params.push(taskId, id);

        await DB
            .prepare(`UPDATE tasks SET ${sets.join(', ')} WHERE id = ? AND client_id = ?`)
            .bind(...params)
            .run();

        const updated = await DB
            .prepare('SELECT * FROM tasks WHERE id = ?')
            .bind(taskId)
            .first();

        return json({ task: updated });
    } catch (e) {
        return err('Database error: ' + e.message, 500);
    }
}

export async function onRequestDelete(context) {
    const { DB } = context.env;
    const { id, taskId } = context.params;

    try {
        const task = await DB
            .prepare('SELECT id FROM tasks WHERE id = ? AND client_id = ?')
            .bind(taskId, id)
            .first();
        if (!task) return err('Task-ul nu există', 404);

        await DB
            .prepare('DELETE FROM tasks WHERE id = ? AND client_id = ?')
            .bind(taskId, id)
            .run();

        return json({ success: true, deleted_id: parseInt(taskId) });
    } catch (e) {
        return err('Database error: ' + e.message, 500);
    }
}
