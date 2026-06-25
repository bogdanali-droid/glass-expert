/**
 * PUT /api/clients/:id/stage — avansează stage și adaugă notă automată
 *
 * Body: { stage: "calificat" }
 * Stage-uri valide: prospect → calificat → oferta → comanda → pierdut
 */

import { json, err, now, today } from '../../_helpers.js';

const VALID_STAGES = ['prospect', 'calificat', 'oferta', 'comanda', 'pierdut'];

const STAGE_LABELS = {
    prospect: 'Prospect',
    calificat: 'Calificat',
    oferta: 'Ofertă trimisă',
    comanda: 'Comandă',
    pierdut: 'Pierdut',
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
        const client = await DB
            .prepare('SELECT id, cod, company, stage FROM clients WHERE id = ?')
            .bind(id)
            .first();
        if (!client) return err('Clientul nu există', 404);

        const ts = now();
        const todayStr = today();

        // Actualizăm stage-ul
        await DB.prepare(`
            UPDATE clients SET stage = ?, last_activity = ?, updated_at = ? WHERE id = ?
        `).bind(stage, todayStr, ts, id).run();

        // Adăugăm notă automată cu tranziția
        const prevLabel = STAGE_LABELS[client.stage] || client.stage;
        const nextLabel = STAGE_LABELS[stage] || stage;
        let noteText = `Stage actualizat: ${prevLabel} → ${nextLabel}`;
        if (reason) noteText += `. ${reason}`;

        await DB.prepare(`
            INSERT INTO notes (client_id, text, note_date, created_at)
            VALUES (?, ?, ?, ?)
        `).bind(id, noteText, todayStr, ts).run();

        const updated = await DB
            .prepare('SELECT * FROM clients WHERE id = ?')
            .bind(id)
            .first();

        return json({
            success: true,
            client: { id: updated.id, cod: updated.cod, stage: updated.stage },
            note: noteText,
        });
    } catch (e) {
        return err('Database error: ' + e.message, 500);
    }
}
