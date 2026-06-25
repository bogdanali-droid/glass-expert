/**
 * GET  /api/orders — listă comenzi cu filtre
 * POST /api/orders — creare comandă nouă
 *
 * Query params GET: ?stage=&priority=&client_id=&q=&page=&limit=
 */

import { json, err, nextSeq, now, today, safeJsonParse } from '../_helpers.js';

export async function onRequestGet(context) {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const stage = url.searchParams.get('stage') || '';
    const priority = url.searchParams.get('priority') || '';
    const client_id = url.searchParams.get('client_id') || '';
    const q = url.searchParams.get('q') || '';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(200, parseInt(url.searchParams.get('limit') || '50'));
    const offset = (page - 1) * limit;

    try {
        const where = [];
        const params = [];

        if (stage) { where.push('o.stage = ?'); params.push(stage); }
        if (priority) { where.push('o.priority = ?'); params.push(priority); }
        if (client_id) { where.push('o.client_id = ?'); params.push(client_id); }
        if (q) {
            where.push('(o.cod LIKE ? OR o.client_alias LIKE ? OR o.client_cod LIKE ? OR o.lot_fabrica LIKE ?)');
            const like = `%${q}%`;
            params.push(like, like, like, like);
        }

        const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

        const countRow = await DB
            .prepare(`SELECT COUNT(*) as total FROM orders o ${whereClause}`)
            .bind(...params)
            .first();

        const result = await DB
            .prepare(`SELECT o.* FROM orders o ${whereClause} ORDER BY o.date_created DESC, o.id DESC LIMIT ? OFFSET ?`)
            .bind(...params, limit, offset)
            .all();

        const orders = result.results.map(o => ({
            ...o,
            lines: safeJsonParse(o.lines, []),
        }));

        return json({
            orders,
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

    const { client_id, client_cod, client_alias, quote_cod, date_created,
            date_delivery, stage, lines, discount, priority, notes, notes_interne } = body;

    try {
        const cod = await nextSeq(DB, 'orders', 'CMD');
        const ts = now();

        // Generăm lot_fabrica automat
        const lot_fabrica = await nextSeq(DB, 'lots', 'LOT');

        const parsedLines = Array.isArray(lines) ? lines : safeJsonParse(lines, []);
        const subtotal = parsedLines.reduce((sum, l) => sum + ((l.qty || 0) * (l.price || 0)), 0);
        const discountAmt = subtotal * ((discount || 0) / 100);
        const afterDiscount = subtotal - discountAmt;
        const tva = afterDiscount * 0.19;
        const total = afterDiscount + tva;

        await DB.prepare(`
            INSERT INTO orders
                (cod, client_id, client_cod, client_alias, quote_cod, date_created, date_delivery,
                 stage, lot_fabrica, lines, discount, subtotal, tva, total,
                 priority, notes, notes_interne, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            cod,
            client_id || null,
            client_cod || '',
            client_alias || '',
            quote_cod || null,
            date_created || today(),
            date_delivery || null,
            stage || 'nou',
            lot_fabrica,
            JSON.stringify(parsedLines),
            discount || 0,
            subtotal,
            tva,
            total,
            priority || 'normal',
            notes || '',
            notes_interne || '',
            ts,
            ts,
        ).run();

        const order = await DB
            .prepare('SELECT * FROM orders WHERE cod = ?')
            .bind(cod)
            .first();

        // Dacă comanda vine dintr-o ofertă, actualizăm statusul ofertei
        if (quote_cod) {
            await DB
                .prepare("UPDATE quotes SET status = 'acceptata', updated_at = ? WHERE cod = ?")
                .bind(ts, quote_cod)
                .run();
        }

        return json({ order: { ...order, lines: parsedLines }, cod }, 201);
    } catch (e) {
        if (e.message?.includes('UNIQUE')) return err('Codul comenzii există deja', 409);
        return err('Database error: ' + e.message, 500);
    }
}
