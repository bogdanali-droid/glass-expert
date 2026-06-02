/**
 * Site-wide Analytics Data Endpoint
 * GET /api/analytics/analytics?type=summary|products|pages|events&segment=all|glassexpert|vagotech
 *
 * Returns analytics data for the admin dashboard, optionally filtered by segment.
 * Requires: Basic Auth (username: admin, password: from Cloudflare Secrets ADMIN_PASSWORD)
 */

const VALID_SEGMENTS = ['glassexpert', 'vagotech'];

function segmentFilter(segment) {
    // Returns { clause, params } for an optional segment WHERE fragment.
    const s = segment ? String(segment).toLowerCase().trim() : 'all';
    if (s === 'all' || !VALID_SEGMENTS.includes(s)) {
        return { clause: '', params: [] };
    }
    return { clause: ' AND segment = ?', params: [s] };
}

export async function onRequest(context) {
    const request = context.request;
    const env = context.env;
    const db = env.VAGOTECH_DB; // binding name kept for wrangler.toml compatibility
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'summary';
    const segment = url.searchParams.get('segment') || 'all';

    // Basic Auth check
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic realm="Analytics Admin"' }
        });
    }

    try {
        const base64Creds = authHeader.substring(6);
        const creds = atob(base64Creds);
        const sep = creds.indexOf(':');
        const username = creds.substring(0, sep);
        const password = creds.substring(sep + 1);

        const adminPassword = env.ADMIN_PASSWORD;
        if (!adminPassword || username !== 'admin' || password !== adminPassword) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 403 });
        }
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Invalid auth header' }), { status: 401 });
    }

    try {
        let data = {};
        const f = segmentFilter(segment);

        if (type === 'summary') {
            const visitors = await db.prepare(`
                SELECT COUNT(*) as total_visitors, COUNT(DISTINCT visitor_id) as unique_visitors,
                       AVG(total_visits) as avg_visits_per_user
                FROM analytics_visitors
                WHERE deleted = 0${f.clause}
            `).bind(...f.params).first();

            const totalEvents = await db.prepare(`
                SELECT COUNT(*) as total_events
                FROM analytics_events
                WHERE visitor_id NOT IN (SELECT visitor_id FROM analytics_visitors WHERE deleted = 1)${f.clause}
            `).bind(...f.params).first();

            const lastUpdate = await db.prepare(`
                SELECT MAX(timestamp) as last_event_time
                FROM analytics_events
                WHERE 1=1${f.clause}
            `).bind(...f.params).first();

            data = {
                segment: segment,
                summary: {
                    total_visitors: visitors.total_visitors,
                    unique_visitors: visitors.unique_visitors,
                    avg_visits_per_user: (visitors.avg_visits_per_user || 0).toFixed(2),
                    total_events: totalEvents.total_events,
                    last_event_time: lastUpdate.last_event_time || 'Never'
                }
            };
        }

        if (type === 'products') {
            const products = await db.prepare(`
                SELECT segment, product_name, total_clicks, total_views, last_clicked, updated_at
                FROM analytics_product_metrics
                WHERE 1=1${f.clause}
                ORDER BY total_clicks DESC
                LIMIT 20
            `).bind(...f.params).all();

            data.products = products.results || [];
        }

        if (type === 'pages') {
            const pages = await db.prepare(`
                SELECT segment, page_path, total_views, unique_visitors, avg_duration_seconds, bounce_rate, last_visited
                FROM analytics_page_metrics
                WHERE 1=1${f.clause}
                ORDER BY total_views DESC
                LIMIT 20
            `).bind(...f.params).all();

            data.pages = pages.results || [];
        }

        if (type === 'events') {
            const events = await db.prepare(`
                SELECT visitor_id, segment, event_type, product_name, page_path, duration_seconds, device_type, timestamp
                FROM analytics_events
                WHERE visitor_id NOT IN (SELECT visitor_id FROM analytics_visitors WHERE deleted = 1)${f.clause}
                ORDER BY timestamp DESC
                LIMIT 100
            `).bind(...f.params).all();

            data.recent_events = events.results || [];
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Analytics error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), { status: 500 });
    }
}
