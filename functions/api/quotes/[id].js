/**
 * GET    /api/quotes/:id — ofertă completă
 * PUT    /api/quotes/:id — update ofertă
 * DELETE /api/quotes/:id — ștergere ofertă
 */

import { json, err, now, today, safeJsonParse } from '../_helpers.js';

export async function onRequestGet(context) {
    const { DB } = context.env;
    const { id } = context.params;

    try {
        const quote = await DB
            .prepare('SELECT * FROM quotes WHERE id = ?')
            .bind(id)
            .first();
        if (!quote) return err('Oferta nu există', 404);

        return json({ quote: { ...quote, lines: safeJsonParse(quote.lines, []) } });
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
            .prepare('SELECT * FROM quotes WHERE id = ?')
            .bind(id)
            .first();
        if (!existing) return err('Oferta nu există', 404);

        const allowed = [
            'client_id', 'client_cod', 'client_alias', 'date_created', 'valid_days',
            'status', 'discount', 'notes',
        ];

        const sets = [];
        const params = [];

        // Recalculăm liniile dacă sunt trimise
        let lines = existing.lines;
        if ('lines' in body) {
            const parsedLines = Array.isArray(body.lines) ? body.lines : safeJsonParse(body.lines, []);
            sets.push('lines = ?');
            params.push(JSON.stringify(parsedLines));
            lines = JSON.stringify(parsedLines);
        }

        for (const field of allowed) {
            if (field in body) {
                sets.push(`${field} = ?`);
                params.push(body[field]);
            }
        }

        // Recalculăm financiar dacă s-au schimbat lines sau discount
        if ('lines' in body || 'discount' in body) {
            const parsedLines = safeJsonParse(lines, []);
            const discount = 'discount' in body ? (body.discount || 0) : (existing.discount || 0);
            const subtotal = parsedLines.reduce((sum, l) => sum + ((l.qty || 0) * (l.price || 0)), 0);
            const afterDiscount = subtotal - subtotal * (discount / 100);
            const tva = afterDiscount * 0.19;
            const total = afterDiscount + tva;
            sets.push('subtotal = ?', 'tva = ?', 'total = ?');
            params.push(subtotal, tva, total);
        }

        if (sets.length === 0) return err('Niciun câmp de actualizat');

        sets.push('updated_at = ?');
        params.push(now());
        params.push(id);

        await DB
            .prepare(`UPDATE quotes SET ${sets.join(', ')} WHERE id = ?`)
            .bind(...params)
            .run();

        const quote = await DB
            .prepare('SELECT * FROM quotes WHERE id = ?')
            .bind(id)
            .first();

        return json({ quote: { ...quote, lines: safeJsonParse(quote.lines, []) } });
    } catch (e) {
        return err('Database error: ' + e.message, 500);
    }
}

export async function onRequestDelete(context) {
    const { DB } = context.env;
    const { id } = context.params;

    try {
        const quote = await DB
            .prepare('SELECT id, cod FROM quotes WHERE id = ?')
            .bind(id)
            .first();
        if (!quote) return err('Oferta nu există', 404);

        await DB
            .prepare('DELETE FROM quotes WHERE id = ?')
            .bind(id)
            .run();

        return json({ success: true, deleted: { id: quote.id, cod: quote.cod } });
    } catch (e) {
        return err('Database error: ' + e.message, 500);
    }
}
