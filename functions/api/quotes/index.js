/**
 * GET  /api/quotes — listă oferte cu filtre
 * POST /api/quotes — creare ofertă nouă
 *
 * Query params GET: ?status=&client_id=&q=&page=&limit=
 */

import { json, err, nextSeq, now, today, safeJsonParse } from '../_helpers.js';

export async function onRequestGet(context) {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const status = url.searchParams.get('status') || '';
    const client_id = url.searchParams.get('client_id') || '';
    const q = url.searchParams.get('q') || '';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(200, parseInt(url.searchParams.get('limit') || '50'));
    const offset = (page - 1) * limit;

    try {
        const where = [];
        const params = [];

        if (status) { where.push('q.status = ?'); params.push(status); }
        if (client_id) { where.push('q.client_id = ?'); params.push(client_id); }
        if (q) {
            where.push('(q.cod LIKE ? OR q.client_alias LIKE ? OR q.client_cod LIKE ?)');
            const like = `%${q}%`;
            params.push(like, like, like);
        }

        const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

        const countRow = await DB
            .prepare(`SELECT COUNT(*) as total FROM quotes q ${whereClause}`)
            .bind(...params)
            .first();

        const result = await DB
            .prepare(`SELECT q.* FROM quotes q ${whereClause} ORDER BY q.date_created DESC, q.id DESC LIMIT ? OFFSET ?`)
            .bind(...params, limit, offset)
            .all();

        const quotes = result.results.map(q => ({
            ...q,
            lines: safeJsonParse(q.lines, []),
        }));

        return json({
            quotes,
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

    const { client_id, client_cod, client_alias, date_created, valid_days,
            status, lines, discount, notes } = body;

    try {
        const cod = await nextSeq(DB, 'quotes', 'OF');
        const ts = now();

        // Calculăm totalurile din lines
        const parsedLines = Array.isArray(lines) ? lines : safeJsonParse(lines, []);
        const subtotal = parsedLines.reduce((sum, l) => sum + ((l.qty || 0) * (l.price || 0)), 0);
        const discountAmt = subtotal * ((discount || 0) / 100);
        const afterDiscount = subtotal - discountAmt;
        const tva = afterDiscount * 0.19;
        const total = afterDiscount + tva;

        await DB.prepare(`
            INSERT INTO quotes
                (cod, client_id, client_cod, client_alias, date_created, valid_days,
                 status, lines, discount, subtotal, tva, total, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            cod,
            client_id || null,
            client_cod || '',
            client_alias || '',
            date_created || today(),
            valid_days || 30,
            status || 'draft',
            JSON.stringify(parsedLines),
            discount || 0,
            subtotal,
            tva,
            total,
            notes || '',
            ts,
            ts,
        ).run();

        const quote = await DB
            .prepare('SELECT * FROM quotes WHERE cod = ?')
            .bind(cod)
            .first();

        return json({ quote: { ...quote, lines: parsedLines }, cod }, 201);
    } catch (e) {
        if (e.message?.includes('UNIQUE')) return err('Codul ofertei există deja', 409);
        return err('Database error: ' + e.message, 500);
    }
}
