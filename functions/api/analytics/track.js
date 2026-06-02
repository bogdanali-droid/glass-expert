/**
 * Site-wide Analytics Tracking Endpoint
 * POST /api/analytics/track
 *
 * Tracks visitor events: page views, product clicks, form submissions, page exits.
 * Segmented by `segment` field (glassexpert | vagotech).
 * Requires: consent check before processing.
 * Returns: { success: boolean, visitor_id: string }
 */

const VALID_SEGMENTS = ['glassexpert', 'vagotech'];

function normalizeSegment(segment) {
    const s = segment ? String(segment).toLowerCase().trim() : 'glassexpert';
    return VALID_SEGMENTS.includes(s) ? s : 'glassexpert';
}

export async function onRequest(context) {
    const request = context.request;
    const env = context.env;
    const db = env.VAGOTECH_DB; // binding name kept for wrangler.toml compatibility

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        // sendBeacon sends text/plain; parse defensively
        let data;
        try {
            data = await request.json();
        } catch {
            const txt = await request.text();
            data = JSON.parse(txt);
        }

        const { visitor_id, event_type, product_name, page_path, duration_seconds, device_type, referrer, consent, segment } = data;

        if (!visitor_id || !event_type || !page_path) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        if (!consent) {
            return new Response(JSON.stringify({ error: 'User has not given consent for tracking' }), { status: 403 });
        }

        const seg = normalizeSegment(segment);
        const cleanProduct = product_name ? String(product_name).substring(0, 100) : null;
        const cleanPage = String(page_path).substring(0, 255);
        const cleanType = String(event_type).substring(0, 50);
        const cleanDevice = device_type ? String(device_type).substring(0, 50) : 'unknown';
        const cleanReferrer = referrer ? String(referrer).substring(0, 255) : null;

        // Record visitor if new
        await db.prepare(`
            INSERT OR IGNORE INTO analytics_visitors (visitor_id, segment, consent_given, consent_given_at)
            VALUES (?, ?, 1, CURRENT_TIMESTAMP)
        `).bind(visitor_id, seg).run();

        // Update last_visit for existing visitor
        await db.prepare(`
            UPDATE analytics_visitors
            SET last_visit = CURRENT_TIMESTAMP, total_visits = total_visits + 1
            WHERE visitor_id = ?
        `).bind(visitor_id).run();

        // Record event
        await db.prepare(`
            INSERT INTO analytics_events (visitor_id, segment, event_type, product_name, page_path, duration_seconds, device_type, referrer)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(visitor_id, seg, cleanType, cleanProduct, cleanPage, duration_seconds || 0, cleanDevice, cleanReferrer).run();

        // Update product metrics if product_click
        if (cleanType === 'product_click' && cleanProduct) {
            await db.prepare(`
                INSERT INTO analytics_product_metrics (segment, product_name, total_clicks, total_views, last_clicked, updated_at)
                VALUES (?, ?, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                ON CONFLICT(segment, product_name) DO UPDATE SET
                    total_clicks = total_clicks + 1,
                    last_clicked = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
            `).bind(seg, cleanProduct).run();
        }

        // Update page metrics
        if (cleanType === 'page_view') {
            await db.prepare(`
                INSERT INTO analytics_page_metrics (segment, page_path, total_views, unique_visitors, last_visited, updated_at)
                VALUES (?, ?, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                ON CONFLICT(segment, page_path) DO UPDATE SET
                    total_views = total_views + 1,
                    last_visited = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
            `).bind(seg, cleanPage).run();
        }

        return new Response(JSON.stringify({
            success: true,
            visitor_id: visitor_id,
            segment: seg,
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
