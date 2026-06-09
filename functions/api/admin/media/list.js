/**
 * GET /api/admin/media/list?category=trains&page=1&per_page=50&include_deleted=0
 * Auth: Bearer <ADMIN_PASSWORD>
 */

import { requireAdmin, jsonResponse, isValidCategory } from './auth.js';

export async function onRequestGet(context) {
    const { request, env } = context;
    const denied = await requireAdmin(request, env);
    if (denied) return denied;

    if (!env.VAGOTECH_DB) {
        return jsonResponse(500, { error: 'D1 binding VAGOTECH_DB missing' });
    }

    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
    const perPage = Math.min(200, Math.max(1, parseInt(url.searchParams.get('per_page') || '50', 10) || 50));
    const includeDeleted = url.searchParams.get('include_deleted') === '1';

    const where = [];
    const params = [];
    if (!includeDeleted) where.push('deleted = 0');
    if (category && isValidCategory(category)) {
        where.push('category = ?');
        params.push(category);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const offset = (page - 1) * perPage;

    const countRow = await env.VAGOTECH_DB
        .prepare(`SELECT COUNT(*) AS n FROM media_files ${whereSql}`)
        .bind(...params)
        .first();
    const total = countRow ? countRow.n : 0;

    const rows = await env.VAGOTECH_DB
        .prepare(
            `SELECT id, filename, category, original_name, size_bytes, mime_type,
                    width, height, alt_text_ro, alt_text_en, used_in_pages,
                    uploaded_by, uploaded_at, replaced_at, deleted, deleted_at
             FROM media_files
             ${whereSql}
             ORDER BY uploaded_at DESC
             LIMIT ? OFFSET ?`
        )
        .bind(...params, perPage, offset)
        .all();

    const items = (rows.results || []).map(r => ({
        ...r,
        url: `/media/${r.filename}`,
    }));

    return jsonResponse(200, {
        items,
        page,
        per_page: perPage,
        total,
        total_pages: Math.max(1, Math.ceil(total / perPage)),
    });
}
