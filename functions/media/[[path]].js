/**
 * GET /media/<filename>
 * Public R2 reader. Streams the object with content-type + 1y cache.
 */

const MIME_BY_EXT = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    avif: 'image/avif',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
};

function guessContentType(key) {
    const dot = key.lastIndexOf('.');
    if (dot < 0) return 'application/octet-stream';
    const ext = key.slice(dot + 1).toLowerCase();
    return MIME_BY_EXT[ext] || 'application/octet-stream';
}

export async function onRequestGet(context) {
    const { env, params, request } = context;

    if (!env.VAGOGLASS_MEDIA) {
        return new Response('R2 binding missing', { status: 500 });
    }

    const segments = Array.isArray(params.path) ? params.path : [params.path];
    const key = segments.filter(Boolean).join('/');
    if (!key) return new Response('Not found', { status: 404 });

    const obj = await env.VAGOGLASS_MEDIA.get(key);
    if (!obj) return new Response('Not found', { status: 404 });

    const headers = new Headers();
    const ctype =
        (obj.httpMetadata && obj.httpMetadata.contentType) || guessContentType(key);
    headers.set('Content-Type', ctype);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    if (obj.httpEtag) headers.set('ETag', obj.httpEtag);

    // ETag conditional GET
    const ifNoneMatch = request.headers.get('If-None-Match');
    if (ifNoneMatch && obj.httpEtag && ifNoneMatch === obj.httpEtag) {
        return new Response(null, { status: 304, headers });
    }

    return new Response(obj.body, { headers });
}
