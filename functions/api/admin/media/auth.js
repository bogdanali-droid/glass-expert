/**
 * Shared admin auth helper for VAGOGLASS media endpoints.
 *
 * Usage:
 *   import { requireAdmin } from './auth.js';
 *   const denied = await requireAdmin(request, env);
 *   if (denied) return denied;
 *
 * Expects header: `Authorization: Bearer <ADMIN_PASSWORD>`
 * ADMIN_PASSWORD comes from Cloudflare Pages Secrets.
 */

const VALID_CATEGORIES = ['trains', 'logos', 'certifications', 'products', 'other'];

function constantTimeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
        diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return diff === 0;
}

function jsonResponse(status, payload, extraHeaders = {}) {
    return new Response(JSON.stringify(payload), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            ...extraHeaders,
        },
    });
}

export function unauthorized(message = 'Unauthorized') {
    return jsonResponse(401, { error: message });
}

export async function requireAdmin(request, env) {
    const expected = env && env.ADMIN_PASSWORD;
    if (!expected) {
        return jsonResponse(500, { error: 'ADMIN_PASSWORD not configured' });
    }

    // Header path (preferred for API calls)
    const header = request.headers.get('Authorization') || '';
    if (header.startsWith('Bearer ')) {
        const token = header.slice(7).trim();
        if (constantTimeEqual(token, expected)) return null;
    }

    // Cookie path (set by /api/admin/auth-check after login)
    const cookie = request.headers.get('Cookie') || '';
    const match = cookie.match(/(?:^|;\s*)vg_admin=([^;]+)/);
    if (match) {
        try {
            const token = decodeURIComponent(match[1]);
            if (constantTimeEqual(token, expected)) return null;
        } catch (_) { /* fall through */ }
    }

    return unauthorized();
}

export function sanitizeFilenameSegment(name) {
    if (!name) return '';
    return String(name)
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9._-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^[-.]+|[-.]+$/g, '')
        .slice(0, 120);
}

export function buildFilename(category, providedName, originalName) {
    const cat = VALID_CATEGORIES.includes(category) ? category : 'other';
    const src = providedName || originalName || `file-${Date.now()}`;
    // Preserve extension
    const dot = src.lastIndexOf('.');
    const base = dot > 0 ? src.slice(0, dot) : src;
    const ext = dot > 0 ? src.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '') : 'bin';
    const safeBase = sanitizeFilenameSegment(base) || `file-${Date.now()}`;
    const safeExt = ext.slice(0, 8) || 'bin';
    return `${cat}/${safeBase}.${safeExt}`;
}

export function isValidCategory(category) {
    return VALID_CATEGORIES.includes(category);
}

export { VALID_CATEGORIES, jsonResponse };
