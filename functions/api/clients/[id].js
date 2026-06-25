/**
 * GET    /api/clients/:id — client complet (cu contacts, notes, tasks)
 * PUT    /api/clients/:id — update câmpuri
 * DELETE /api/clients/:id — ștergere cu cascade
 */

import { json, err, getClientWithDetails, now, safeJsonParse } from '../_helpers.js';

export async function onRequestGet(context) {
    const { DB } = context.env;
    const { id } = context.params;

    try {
        const client = await getClientWithDetails(DB, id);
        if (!client) return err('Clientul nu există', 404);
        return json({ client });
    } catch (e) {
        return err('Database error: ' + e.message, 500);
    }
}

export async function onRequestPut(context) {
    const { DB } = context.env;
    const { id } = context.params;

    let body;
    try {
        body = await context.request.json();
    } catch {
        return err('Invalid JSON body');
    }

    try {
        const existing = await DB
            .prepare('SELECT id FROM clients WHERE id = ?')
            .bind(id)
            .first();
        if (!existing) return err('Clientul nu există', 404);

        // Câmpurile permise la update (nu cod, nu created_at)
        const allowed = [
            'alias', 'company', 'type', 'country', 'city', 'vat_code',
            'opportunity', 'stage', 'products', 'priority', 'source',
            'tags', 'intel', 'pipedrive_id', 'winmentor_code',
            'last_activity',
        ];

        const sets = [];
        const params = [];

        for (const field of allowed) {
            if (field in body) {
                sets.push(`${field} = ?`);
                const val = body[field];
                // Serializăm array-urile
                if (Array.isArray(val)) {
                    params.push(JSON.stringify(val));
                } else {
                    params.push(val);
                }
            }
        }

        if (sets.length === 0) return err('Niciun câmp de actualizat');

        sets.push('updated_at = ?');
        params.push(now());
        params.push(id);

        await DB
            .prepare(`UPDATE clients SET ${sets.join(', ')} WHERE id = ?`)
            .bind(...params)
            .run();

        const client = await getClientWithDetails(DB, id);
        return json({ client });
    } catch (e) {
        return err('Database error: ' + e.message, 500);
    }
}

export async function onRequestDelete(context) {
    const { DB } = context.env;
    const { id } = context.params;

    try {
        const existing = await DB
            .prepare('SELECT id, cod, company FROM clients WHERE id = ?')
            .bind(id)
            .first();
        if (!existing) return err('Clientul nu există', 404);

        // CASCADE șterge contacts, notes, tasks automat (FK ON DELETE CASCADE)
        await DB
            .prepare('DELETE FROM clients WHERE id = ?')
            .bind(id)
            .run();

        return json({ success: true, deleted: { id: existing.id, cod: existing.cod, company: existing.company } });
    } catch (e) {
        return err('Database error: ' + e.message, 500);
    }
}
