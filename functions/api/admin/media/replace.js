/**
 * POST /api/admin/media/replace
 * multipart/form-data: file, filename (existing key to replace)
 * Auth: Bearer <ADMIN_PASSWORD>
 * Overwrites the R2 object under the same key and updates replaced_at.
 */

import { requireAdmin, jsonResponse } from './auth.js';

const MAX_BYTES = 10 * 1024 * 1024;

export async function onRequestPost(context) {
    const { request, env } = context;
    const denied = await requireAdmin(request, env);
    if (denied) return denied;

    if (!env.VAGOGLASS_MEDIA || !env.VAGOTECH_DB) {
        return jsonResponse(500, { error: 'Missing R2 or D1 bindings' });
    }

    let form;
    try { form = await request.formData(); } catch (_) {
        return jsonResponse(400, { error: 'Invalid multipart form-data' });
    }

    const file = form.get('file');
    const filename = form.get('filename') ? String(form.get('filename')) : null;

    if (!file || typeof file === 'string') return jsonResponse(400, { error: 'Missing file' });
    if (!filename) return jsonResponse(400, { error: 'Missing filename' });

    const contentType = file.type || 'application/octet-stream';
    if (!contentType.startsWith('image/')) {
        return jsonResponse(400, { error: 'Only image/* uploads accepted' });
    }
    if (file.size > MAX_BYTES) {
        return jsonResponse(400, { error: `File exceeds ${MAX_BYTES} bytes` });
    }

    const existing = await env.VAGOTECH_DB
        .prepare('SELECT id, category FROM media_files WHERE filename = ?')
        .bind(filename)
        .first();
    if (!existing) return jsonResponse(404, { error: 'Filename not found in media_files' });

    const buffer = await file.arrayBuffer();
    await env.VAGOGLASS_MEDIA.put(filename, buffer, {
        httpMetadata: { contentType },
    });

    await env.VAGOTECH_DB
        .prepare(
            `UPDATE media_files
               SET size_bytes = ?, mime_type = ?, original_name = ?,
                   replaced_at = CURRENT_TIMESTAMP, deleted = 0, deleted_at = NULL
             WHERE filename = ?`
        )
        .bind(file.size, contentType, file.name || null, filename)
        .run();

    return jsonResponse(200, {
        ok: true,
        filename,
        url: `/media/${filename}`,
        size_bytes: file.size,
        mime_type: contentType,
    });
}
