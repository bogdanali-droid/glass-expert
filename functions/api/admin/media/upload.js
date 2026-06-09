/**
 * POST /api/admin/media/upload
 * multipart/form-data: file, category, alt_text_ro?, alt_text_en?, filename?
 *
 * Auth: Bearer <ADMIN_PASSWORD>
 * Stores in R2 (VAGOGLASS_MEDIA) and records metadata in D1 (media_files).
 */

import { requireAdmin, jsonResponse, buildFilename, isValidCategory } from './auth.js';

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export async function onRequestPost(context) {
    const { request, env } = context;

    const denied = await requireAdmin(request, env);
    if (denied) return denied;

    if (!env.VAGOGLASS_MEDIA) {
        return jsonResponse(500, { error: 'R2 binding VAGOGLASS_MEDIA missing' });
    }
    if (!env.VAGOTECH_DB) {
        return jsonResponse(500, { error: 'D1 binding VAGOTECH_DB missing' });
    }

    let form;
    try {
        form = await request.formData();
    } catch (err) {
        return jsonResponse(400, { error: 'Invalid multipart form-data' });
    }

    const file = form.get('file');
    const category = String(form.get('category') || '').toLowerCase().trim();
    const altRo = form.get('alt_text_ro') ? String(form.get('alt_text_ro')) : null;
    const altEn = form.get('alt_text_en') ? String(form.get('alt_text_en')) : null;
    const requestedName = form.get('filename') ? String(form.get('filename')) : null;
    const uploadedBy = form.get('uploaded_by') ? String(form.get('uploaded_by')) : 'admin';

    if (!file || typeof file === 'string') {
        return jsonResponse(400, { error: 'Missing file field' });
    }
    if (!isValidCategory(category)) {
        return jsonResponse(400, { error: 'Invalid category' });
    }

    const contentType = file.type || 'application/octet-stream';
    if (!contentType.startsWith('image/')) {
        return jsonResponse(400, { error: 'Only image/* uploads accepted' });
    }
    if (file.size > MAX_BYTES) {
        return jsonResponse(400, { error: `File exceeds ${MAX_BYTES} bytes` });
    }

    const filename = buildFilename(category, requestedName, file.name);

    // Avoid clobbering an existing key on upload (use replace.js for that)
    const existing = await env.VAGOGLASS_MEDIA.head(filename);
    if (existing) {
        return jsonResponse(409, { error: 'Filename already exists; use replace endpoint', filename });
    }

    const buffer = await file.arrayBuffer();
    await env.VAGOGLASS_MEDIA.put(filename, buffer, {
        httpMetadata: { contentType },
    });

    try {
        await env.VAGOTECH_DB.prepare(
            `INSERT INTO media_files
               (filename, category, original_name, size_bytes, mime_type, alt_text_ro, alt_text_en, uploaded_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            filename,
            category,
            file.name || null,
            file.size,
            contentType,
            altRo,
            altEn,
            uploadedBy
        ).run();
    } catch (err) {
        // Roll back the R2 put if DB insert fails
        try { await env.VAGOGLASS_MEDIA.delete(filename); } catch (_) {}
        return jsonResponse(500, { error: 'DB insert failed', detail: String(err && err.message || err) });
    }

    return jsonResponse(200, {
        filename,
        url: `/media/${filename}`,
        size_bytes: file.size,
        mime_type: contentType,
        category,
    });
}
