/**
 * Glass Expert CRM — CORS Middleware
 * Se aplică pe toate rutele din /api/ (Cloudflare Pages Functions middleware)
 */

export async function onRequest({ request, next }) {
    // Preflight OPTIONS — răspunde imediat fără a apela handler-ul
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: corsHeaders(),
        });
    }

    const response = await next();

    const headers = new Headers(response.headers);
    const cors = corsHeaders();
    for (const [key, val] of cors.entries()) {
        headers.set(key, val);
    }

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
}

function corsHeaders() {
    return new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
    });
}
