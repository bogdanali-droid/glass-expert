/**
 * POST /api/admin/auth-check
 * Body: { password }
 * Verifies password against ADMIN_PASSWORD (Cloudflare Secret) and sets a
 * HTTPOnly cookie `vg_admin=<password>` for subsequent admin requests.
 *
 * This is a deliberately simple scheme: the cookie value IS the secret token,
 * compared in constant time on each request. No JWT, no DB session.
 *
 * GET /api/admin/auth-check
 * Returns { authenticated: true|false } based on the cookie.
 */

function constantTimeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

function json(status, payload, headers = {}) {
    return new Response(JSON.stringify(payload), {
        status,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
    });
}

export async function onRequestPost(context) {
    const { request, env } = context;
    const expected = env && env.ADMIN_PASSWORD;
    if (!expected) return json(500, { error: 'ADMIN_PASSWORD not configured' });

    let body;
    try { body = await request.json(); } catch (_) {
        return json(400, { error: 'Invalid JSON body' });
    }
    const password = body && body.password ? String(body.password) : '';

    if (!constantTimeEqual(password, expected)) {
        return json(401, { error: 'Invalid password' });
    }

    const cookie = [
        `vg_admin=${encodeURIComponent(password)}`,
        'Path=/',
        'HttpOnly',
        'Secure',
        'SameSite=Strict',
        `Max-Age=${60 * 60 * 8}`, // 8h
    ].join('; ');

    return json(200, { ok: true }, { 'Set-Cookie': cookie });
}

export async function onRequestGet(context) {
    const { request, env } = context;
    const expected = env && env.ADMIN_PASSWORD;
    if (!expected) return json(500, { error: 'ADMIN_PASSWORD not configured' });

    const cookie = request.headers.get('Cookie') || '';
    const match = cookie.match(/(?:^|;\s*)vg_admin=([^;]+)/);
    if (!match) return json(200, { authenticated: false });
    try {
        const token = decodeURIComponent(match[1]);
        return json(200, { authenticated: constantTimeEqual(token, expected) });
    } catch (_) {
        return json(200, { authenticated: false });
    }
}

export async function onRequestDelete() {
    // Logout: clear the cookie
    const cookie = 'vg_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0';
    return json(200, { ok: true }, { 'Set-Cookie': cookie });
}
