/**
 * VAGOTECH Analytics Tracking Endpoint
 * POST /api/vagotech/track
 *
 * Tracks visitor events: page views, product clicks, form submissions, page exits
 * Requires: consent check before processing
 * Returns: { success: boolean, visitor_id: string }
 */

export async function onRequest(context) {
    const request = context.request;
    const env = context.env;
    const db = env.VAGOTECH_DB;

    // Only accept POST requests
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const data = await request.json();
        const { visitor_id, event_type, product_name, page_path, duration_seconds, device_type, referrer, consent } = data;

        // Validate required fields
        if (!visitor_id || !event_type || !page_path) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        // Check consent
        if (!consent) {
            return new Response(JSON.stringify({ error: 'User has not given consent for tracking' }), { status: 403 });
        }

        // Sanitize inputs
        const cleanProduct = product_name ? String(product_name).substring(0, 100) : null;
        const cleanPage = String(page_path).substring(0, 255);
        const cleanType = String(event_type).substring(0, 50);
        const cleanDevice = device_type ? String(device_type).substring(0, 50) : 'unknown';
        const cleanReferrer = referrer ? String(referrer).substring(0, 255) : null;

        // Record visitor if new
        await db.prepare(`
            INSERT OR IGNORE INTO vagotech_visitors (visitor_id, consent_given, consent_given_at)
            VALUES (?, 1, CURRENT_TIMESTAMP)
        `).bind(visitor_id).run();

        // Update last_visit for existing visitor
        await db.prepare(`
            UPDATE vagotech_visitors
            SET last_visit = CURRENT_TIMESTAMP, total_visits = total_visits + 1
            WHERE visitor_id = ?
        `).bind(visitor_id).run();

        // Record event
        await db.prepare(`
            INSERT INTO vagotech_events (visitor_id, event_type, product_name, page_path, duration_seconds, device_type, referrer)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(visitor_id, cleanType, cleanProduct, cleanPage, duration_seconds || 0, cleanDevice, cleanReferrer).run();

        // Update product metrics if product_click
        if (cleanType === 'product_click' && cleanProduct) {
            await db.prepare(`
                INSERT INTO vagotech_product_metrics (product_name, total_clicks, total_views, last_clicked, updated_at)
                VALUES (?, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                ON CONFLICT(product_name) DO UPDATE SET
                    total_clicks = total_clicks + 1,
                    last_clicked = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
            `).bind(cleanProduct).run();
        }

        // Update page metrics
        if (cleanType === 'page_view') {
            await db.prepare(`
                INSERT INTO vagotech_page_metrics (page_path, total_views, unique_visitors, last_visited, updated_at)
                VALUES (?, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                ON CONFLICT(page_path) DO UPDATE SET
                    total_views = total_views + 1,
                    last_visited = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
            `).bind(cleanPage).run();
        }

        return new Response(JSON.stringify({
            success: true,
            visitor_id: visitor_id,
            tracked: event_type
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Tracking error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), { status: 500 });
    }
}
