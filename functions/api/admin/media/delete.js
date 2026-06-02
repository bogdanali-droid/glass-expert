/**
 * DELETE /api/admin/media/delete
 * Body: { filename }
 * Auth: Bearer <ADMIN_PASSWORD>
 * Soft-deletes the DB row and removes the object from R2.
 */

import { requireAdmin, jsonResponse } from './auth.js';

async function handle(context) {
    const { request, env } = context;
    const denied = await requireAdmin(request, env);
    if (denied) return denied;

    if (!env.VAGOGLASS_MEDIA || !env.VAGOTECH_DB) {
        return jsonResponse(500, { error: 'Missing R2 or D1 bindings' });
    }

    let body;
    try { body = await request.json(); } catch (_) {
        return jsonResponse(400, { error: 'Invalid JSON body' });
    }
    const filename = body && body.filename ? String(body.filename) : null;
    if (!filename) return jsonResponse(400, { error: 'Missing filename' });

    const row = await env.VAGOTECH_DB
        .prepare('SELECT id FROM media_files WHERE filename = ?')
        .bind(filename)
        .first();
    if (!row) return jsonResponse(404, { error: 'Not found' });

    await env.VAGOTECH_DB
        .prepare('UPDATE media_files SET deleted = 1, deleted_at = CURRENT_TIMESTAMP WHERE filename = ?')
        .bind(filename)
        .run();

    try { await env.VAGOGLASS_MEDIA.delete(filename); } catch (_) { /* tolerate */ }

    return jsonResponse(200, { ok: true, filename });
}

export const onRequestDelete = handle;
export const onRequestPost = handle; // convenience for clients without DELETE bodies
