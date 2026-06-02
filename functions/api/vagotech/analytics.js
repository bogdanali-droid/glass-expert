/**
 * VAGOTECH Analytics Data Endpoint
 * GET /api/vagotech/analytics?type=summary|products|pages
 *
 * Returns analytics data for the admin dashboard
 * Requires: Basic Auth (username: admin, password: from Cloudflare Secrets)
 */

export async function onRequest(context) {
    const request = context.request;
    const env = context.env;
    const db = env.VAGOTECH_DB;
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'summary';

    // Basic Auth check
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic realm="VAGOTECH Admin"' }
        });
    }

    try {
        const base64Creds = authHeader.substring(6);
        const creds = atob(base64Creds);
        const [username, password] = creds.split(':');

        // Verify credentials (password from Cloudflare Secrets)
        const adminPassword = env.ADMIN_PASSWORD;
        if (username !== 'admin' || password !== adminPassword) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 403 });
        }
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Invalid auth header' }), { status: 401 });
    }

    try {
        let data = {};

        if (type === 'summary') {
            // Summary stats
            const visitors = await db.prepare(`
                SELECT COUNT(*) as total_visitors, COUNT(DISTINCT visitor_id) as unique_visitors,
                       AVG(total_visits) as avg_visits_per_user
                FROM vagotech_visitors
                WHERE deleted = 0
            `).first();

            const totalEvents = await db.prepare(`
                SELECT COUNT(*) as total_events
                FROM vagotech_events
                WHERE visitor_id NOT IN (SELECT visitor_id FROM vagotech_visitors WHERE deleted = 1)
            `).first();

            const lastUpdate = await db.prepare(`
                SELECT MAX(timestamp) as last_event_time
                FROM vagotech_events
            `).first();

            data = {
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
            // Top products by clicks
            const products = await db.prepare(`
                SELECT product_name, total_clicks, total_views, last_clicked, updated_at
                FROM vagotech_product_metrics
                ORDER BY total_clicks DESC
                LIMIT 20
            `).all();

            data.products = products.results || [];
        }

        if (type === 'pages') {
            // Top pages by views
            const pages = await db.prepare(`
                SELECT page_path, total_views, unique_visitors, avg_duration_seconds, bounce_rate, last_visited
                FROM vagotech_page_metrics
                ORDER BY total_views DESC
                LIMIT 20
            `).all();

            data.pages = pages.results || [];
        }

        if (type === 'events') {
            // Recent events (last 100)
            const events = await db.prepare(`
                SELECT visitor_id, event_type, product_name, page_path, duration_seconds, device_type, timestamp
                FROM vagotech_events
                WHERE visitor_id NOT IN (SELECT visitor_id FROM vagotech_visitors WHERE deleted = 1)
                ORDER BY timestamp DESC
                LIMIT 100
            `).all();

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
