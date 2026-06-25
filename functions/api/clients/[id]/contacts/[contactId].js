/**
 * PUT    /api/clients/:id/contacts/:contactId — update contact
 * DELETE /api/clients/:id/contacts/:contactId — ștergere contact
 */

import { json, err, now } from '../../../_helpers.js';

export async function onRequestPut(context) {
    const { DB } = context.env;
    const { id, contactId } = context.params;

    let body;
    try {
        body = await context.request.json();
    } catch {
        return err('Invalid JSON body');
    }

    try {
        const contact = await DB
            .prepare('SELECT * FROM contacts WHERE id = ? AND client_id = ?')
            .bind(contactId, id)
            .first();
        if (!contact) return err('Contactul nu există', 404);

        const sets = [];
        const params = [];

        const allowed = ['name', 'role', 'email', 'phone', 'is_primary'];
        for (const field of allowed) {
            if (field in body) {
                sets.push(`${field} = ?`);
                if (field === 'is_primary') {
                    params.push(body[field] ? 1 : 0);
                } else {
                    params.push(body[field]);
                }
            }
        }

        if (sets.length === 0) return err('Niciun câmp de actualizat');

        // Dacă setăm ca primar, resetăm ceilalți
        if (body.is_primary) {
            await DB
                .prepare('UPDATE contacts SET is_primary = 0 WHERE client_id = ? AND id != ?')
                .bind(id, contactId)
                .run();
        }

        params.push(contactId, id);
        await DB
            .prepare(`UPDATE contacts SET ${sets.join(', ')} WHERE id = ? AND client_id = ?`)
            .bind(...params)
            .run();

        const updated = await DB
            .prepare('SELECT * FROM contacts WHERE id = ?')
            .bind(contactId)
            .first();

        return json({ contact: updated });
    } catch (e) {
        return err('Database error: ' + e.message, 500);
    }
}

export async function onRequestDelete(context) {
    const { DB } = context.env;
    const { id, contactId } = context.params;

    try {
        const contact = await DB
            .prepare('SELECT id FROM contacts WHERE id = ? AND client_id = ?')
            .bind(contactId, id)
            .first();
        if (!contact) return err('Contactul nu există', 404);

        await DB
            .prepare('DELETE FROM contacts WHERE id = ? AND client_id = ?')
            .bind(contactId, id)
            .run();

        return json({ success: true, deleted_id: parseInt(contactId) });
    } catch (e) {
        return err('Database error: ' + e.message, 500);
    }
}
