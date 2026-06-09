/**
 * Newsletter admin: list subscribers
 * GET /api/newsletter/list?segment=all|tren|tramvai|metrou&confirmed=1|0|any&page=1&page_size=50
 *
 * Requires Basic Auth (admin / ADMIN_PASSWORD).
 * Returns { total, page, page_size, subscribers: [...], stats: {...} }
 */

const VALID_SEGMENTS = ['tren', 'tramvai', 'metrou', 'all'];

function unauthorized() {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
            'Content-Type': 'application/json',
            'WWW-Authenticate': 'Basic realm="Newsletter Admin"'
        }
    });
}

function checkAuth(request, env) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) return false;
    try {
        const creds = atob(authHeader.substring(6));
        const sep = creds.indexOf(':');
        const user = creds.substring(0, sep);
        const pass = creds.substring(sep + 1);
        const adminPassword = env.ADMIN_PASSWORD;
        return adminPassword && user === 'admin' && pass === adminPassword;
    } catch {
        return false;
    }
}

export async function onRequest(context) {
    const { request, env } = context;
    const db = env.VAGOTECH_DB;

    if (request.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }
    if (!checkAuth(request, env)) return unauthorized();

    const url = new URL(request.url);
    const segment = (url.searchParams.get('segment') || 'all').toLowerCase();
    const confirmedFilter = url.searchParams.get('confirmed') || 'any';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const pageSize = Math.min(200, Math.max(1, parseInt(url.searchParams.get('page_size') || '50', 10)));
    const offset = (page - 1) * pageSize;

    const where = ['unsubscribed_at IS NULL'];
    const params = [];

    if (VALID_SEGMENTS.includes(segment) && segment !== 'all') {
        where.push('segment_interest = ?');
        params.push(segment);
    }
    if (confirmedFilter === '1') {
        where.push('confirmed = 1');
    } else if (confirmedFilter === '0') {
        where.push('confirmed = 0');
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    try {
        const totalRow = await db.prepare(
            `SELECT COUNT(*) AS total FROM newsletter_subscribers ${whereSql}`
        ).bind(...params).first();

        const subs = await db.prepare(`
            SELECT id, email, name, company, segment_interest, language, source,
                   confirmed, subscribed_at, confirmed_at, last_email_sent_at
            FROM newsletter_subscribers
            ${whereSql}
            ORDER BY subscribed_at DESC
            LIMIT ? OFFSET ?
        `).bind(...params, pageSize, offset).all();

        // Aggregate stats
        const stats = await db.prepare(`
            SELECT
                COUNT(*) AS total_all,
                SUM(CASE WHEN confirmed = 1 THEN 1 ELSE 0 END) AS confirmed_count,
                SUM(CASE WHEN confirmed = 0 AND unsubscribed_at IS NULL THEN 1 ELSE 0 END) AS pending_count,
                SUM(CASE WHEN unsubscribed_at IS NOT NULL THEN 1 ELSE 0 END) AS unsubscribed_count
            FROM newsletter_subscribers
        `).first();

        return new Response(JSON.stringify({
            total: totalRow?.total || 0,
            page,
            page_size: pageSize,
            subscribers: subs.results || [],
            stats: stats || {}
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Newsletter list error:', error);
        return new Response(JSON.stringify({ error: 'Server error', details: error.message }), { status: 500 });
    }
}
