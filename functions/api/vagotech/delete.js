/**
 * VAGOTECH Data Deletion Endpoint
 * POST /api/vagotech/delete
 *
 * Deletes all analytics data for a visitor (GDPR right to be forgotten)
 * Body: { visitor_id: string }
 * No auth required - user provides their own visitor_id
 */

export async function onRequest(context) {
    const request = context.request;
    const env = context.env;
    const db = env.VAGOTECH_DB;

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const data = await request.json();
        const { visitor_id } = data;

        if (!visitor_id) {
            return new Response(JSON.stringify({ error: 'Missing visitor_id' }), { status: 400 });
        }

        // Check if visitor exists
        const visitor = await db.prepare(`
            SELECT visitor_id FROM vagotech_visitors WHERE visitor_id = ?
        `).bind(visitor_id).first();

        if (!visitor) {
            return new Response(JSON.stringify({ error: 'Visitor not found', success: false }), { status: 404 });
        }

        // Soft delete: mark as deleted
        await db.prepare(`
            UPDATE vagotech_visitors
            SET deleted = 1, deleted_at = CURRENT_TIMESTAMP
            WHERE visitor_id = ?
        `).bind(visitor_id).run();

        // Delete associated events
        await db.prepare(`
            DELETE FROM vagotech_events WHERE visitor_id = ?
        `).bind(visitor_id).run();

        return new Response(JSON.stringify({
            success: true,
            message: 'Your visitor profile and all analytics data have been deleted'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Deletion error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), { status: 500 });
    }
}
