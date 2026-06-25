/**
 * PUT /api/orders/:id/stage — avansează stage comandă
 *
 * Body: { stage: "productie" }
 * Stage-uri valide: nou → confirmat → productie → expediat → livrat → anulat
 */

import { json, err, now, today } from '../../_helpers.js';

const VALID_STAGES = ['nou', 'confirmat', 'productie', 'expediat', 'livrat', 'anulat'];

const STAGE_LABELS = {
    nou: 'Nou',
    confirmat: 'Confirmat',
    productie: 'În producție',
    expediat: 'Expediat',
    livrat: 'Livrat',
    anulat: 'Anulat',
};

export async function onRequestPut(context) {
    const { DB } = context.env;
    const { id } = context.params;

    let body;
    try {
        body = await context.request.json();
    } catch {
        return err('Invalid JSON body');
    }

    const { stage, reason } = body;

    if (!stage) return err('stage este obligatoriu');
    if (!VALID_STAGES.includes(stage)) {
        return err(`Stage invalid. Valori permise: ${VALID_STAGES.join(', ')}`);
    }

    try {
        const order = await DB
            .prepare('SELECT id, cod, client_id, stage FROM orders WHERE id = ?')
            .bind(id)
            .first();
        if (!order) return err('Comanda nu există', 404);

        const ts = now();
        const todayStr = today();

        await DB.prepare(`
            UPDATE orders SET stage = ?, updated_at = ? WHERE id = ?
        `).bind(stage, ts, id).run();

        // Dacă există un client asociat, actualizăm last_activity
        if (order.client_id) {
            await DB
                .prepare('UPDATE clients SET last_activity = ?, updated_at = ? WHERE id = ?')
                .bind(todayStr, ts, order.client_id)
                .run();
        }

        const prevLabel = STAGE_LABELS[order.stage] || order.stage;
        const nextLabel = STAGE_LABELS[stage] || stage;
        let message = `Comanda ${order.cod} mutată: ${prevLabel} → ${nextLabel}`;
        if (reason) message += `. ${reason}`;

        return json({
            success: true,
            order: { id: order.id, cod: order.cod, stage },
            message,
        });
    } catch (e) {
        return err('Database error: ' + e.message, 500);
    }
}
