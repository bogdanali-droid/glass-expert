/**
 * POST /api/admin/media/alt
 * Body: { filename, alt_text_ro?, alt_text_en? }
 * Auth: Bearer <ADMIN_PASSWORD>
 */

import { requireAdmin, jsonResponse } from './auth.js';

export async function onRequestPost(context) {
    const { request, env } = context;
    const denied = await requireAdmin(request, env);
    if (denied) return denied;

    if (!env.VAGOTECH_DB) return jsonResponse(500, { error: 'D1 binding missing' });

    let body;
    try { body = await request.json(); } catch (_) {
        return jsonResponse(400, { error: 'Invalid JSON body' });
    }
    const filename = body && body.filename ? String(body.filename) : null;
    if (!filename) return jsonResponse(400, { error: 'Missing filename' });

    const altRo = body.alt_text_ro != null ? String(body.alt_text_ro) : null;
    const altEn = body.alt_text_en != null ? String(body.alt_text_en) : null;

    const row = await env.VAGOTECH_DB
        .prepare('SELECT id FROM media_files WHERE filename = ?')
        .bind(filename).first();
    if (!row) return jsonResponse(404, { error: 'Not found' });

    await env.VAGOTECH_DB.prepare(
        'UPDATE media_files SET alt_text_ro = COALESCE(?, alt_text_ro), alt_text_en = COALESCE(?, alt_text_en) WHERE filename = ?'
    ).bind(altRo, altEn, filename).run();

    return jsonResponse(200, { ok: true, filename });
}
