/**
 * Site-wide Analytics Tracking Endpoint
 * POST /api/analytics/track
 *
 * Tracks visitor events: page views, product clicks, form submissions, page exits,
 * scroll depth, search queries.
 * Segmented by `segment` field (glassexpert | vagotech | vagoglass).
 * Requires: consent check before processing.
 * Returns: { success: boolean, visitor_id: string }
 *
 * VAGOGLASS extension:
 *   - acceptă segment `vagoglass`
 *   - extrage geo (country/city/lat/lng) din headerele Cloudflare
 *   - persistă utm_*, search_query, section_id
 */

const VALID_SEGMENTS = ['glassexpert', 'vagotech', 'vagoglass'];

function normalizeSegment(segment) {
    const s = segment ? String(segment).toLowerCase().trim() : 'glassexpert';
    return VALID_SEGMENTS.includes(s) ? s : 'glassexpert';
}

// Helper: trunchiere defensivă pentru câmpuri text
function clip(value, max) {
    if (value === null || value === undefined) return null;
    return String(value).substring(0, max);
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

        const {
            visitor_id, event_type, product_name, page_path,
            duration_seconds, device_type, referrer, consent, segment,
            // câmpuri noi (opționale)
            search_query, section_id, utm_source, utm_medium, utm_campaign,
            device_resolution
        } = data;

        if (!visitor_id || !event_type || !page_path) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        if (!consent) {
            return new Response(JSON.stringify({ error: 'User has not given consent for tracking' }), { status: 403 });
        }

        const seg = normalizeSegment(segment);
        const cleanProduct = clip(product_name, 100);
        const cleanPage = clip(page_path, 255);
        const cleanType = clip(event_type, 50);
        const cleanDevice = clip(device_type, 50) || 'unknown';
        const cleanReferrer = clip(referrer, 255);

        // --- Geo enrichment via Cloudflare ---
        // Headerele și `request.cf` sunt disponibile când rulează pe edge.
        // În dev local pot lipsi; tratăm defensiv.
        const cf = request.cf || {};
        const country = clip(
            request.headers.get('CF-IPCountry') || cf.country || null, 2
        );
        const city = clip(
            request.headers.get('CF-IPCity') || cf.city || null, 100
        );
        const latitude = (typeof cf.latitude !== 'undefined' && cf.latitude !== null)
            ? parseFloat(cf.latitude) : null;
        const longitude = (typeof cf.longitude !== 'undefined' && cf.longitude !== null)
            ? parseFloat(cf.longitude) : null;

        // UTM + extras
        const cleanSearchQuery = clip(search_query, 255);
        const cleanSectionId = clip(section_id, 100);
        const cleanUtmSource = clip(utm_source, 100);
        const cleanUtmMedium = clip(utm_medium, 100);
        const cleanUtmCampaign = clip(utm_campaign, 100);
        const cleanResolution = clip(device_resolution, 20);

        // --- Visitor (insert dacă nou) ---
        await db.prepare(`
            INSERT OR IGNORE INTO analytics_visitors
              (visitor_id, segment, consent_given, consent_given_at, country, city, device_resolution, device_type, referrer)
            VALUES (?, ?, 1, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?)
        `).bind(
            visitor_id, seg, country, city, cleanResolution, cleanDevice, cleanReferrer
        ).run();

        // Update last_visit + geo (dacă lipsea)
        await db.prepare(`
            UPDATE analytics_visitors
            SET last_visit = CURRENT_TIMESTAMP,
                total_visits = total_visits + 1,
                country = COALESCE(country, ?),
                city = COALESCE(city, ?),
                device_resolution = COALESCE(device_resolution, ?)
            WHERE visitor_id = ?
        `).bind(country, city, cleanResolution, visitor_id).run();

        // --- Event row ---
        await db.prepare(`
            INSERT INTO analytics_events
              (visitor_id, segment, event_type, product_name, page_path,
               duration_seconds, device_type, referrer,
               country, city, latitude, longitude,
               search_query, section_id, utm_source, utm_medium, utm_campaign)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            visitor_id, seg, cleanType, cleanProduct, cleanPage,
            duration_seconds || 0, cleanDevice, cleanReferrer,
            country, city, latitude, longitude,
            cleanSearchQuery, cleanSectionId,
            cleanUtmSource, cleanUtmMedium, cleanUtmCampaign
        ).run();

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
