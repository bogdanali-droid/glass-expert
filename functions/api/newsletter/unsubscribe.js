/**
 * Newsletter unsubscribe endpoint
 * GET /api/newsletter/unsubscribe?token=...
 *
 * Marks subscriber as unsubscribed (sets unsubscribed_at, confirmed=0).
 * Returns simple HTML page.
 */

function htmlPage({ title, heading, body, ctaLabel, ctaHref, accent = '#0891b2' }) {
    return `<!DOCTYPE html><html lang="ro"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
  body { font-family: system-ui,-apple-system,'Segoe UI',sans-serif; background:#f5f7fa; color:#111827; margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; }
  .card { max-width:520px; background:#fff; border-radius:14px; padding:48px 36px; box-shadow:0 4px 24px rgba(0,0,0,0.06); text-align:center; }
  .eyebrow { font-size:0.82rem; letter-spacing:0.1em; text-transform:uppercase; color:${accent}; font-weight:600; margin-bottom:8px; }
  h1 { font-size:1.6rem; margin:0 0 16px; color:#0f172a; }
  p { font-size:1rem; line-height:1.6; color:#475569; margin:0 0 28px; }
  a.btn { display:inline-block; background:${accent}; color:#fff; text-decoration:none; padding:14px 28px; border-radius:10px; font-weight:600; }
</style></head>
<body>
  <div class="card">
    <div class="eyebrow">VAGOGLASS</div>
    <h1>${heading}</h1>
    <p>${body}</p>
    <a class="btn" href="${ctaHref}">${ctaLabel}</a>
  </div>
</body></html>`;
}

export async function onRequest(context) {
    const { request, env } = context;
    const db = env.VAGOTECH_DB;
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
        return new Response(htmlPage({
            title: 'Token lipsă',
            heading: 'Link invalid',
            body: 'Linkul de dezabonare lipsește sau este incomplet.',
            ctaLabel: 'Înapoi la VAGOGLASS',
            ctaHref: '/vagoglass/',
            accent: '#dc2626'
        }), { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    try {
        const row = await db.prepare(
            'SELECT id, language, unsubscribed_at FROM newsletter_subscribers WHERE unsubscribe_token = ?'
        ).bind(token).first();

        if (!row) {
            return new Response(htmlPage({
                title: 'Token invalid',
                heading: 'Link expirat sau invalid',
                body: 'Nu am găsit o abonare asociată acestui link.',
                ctaLabel: 'Înapoi la VAGOGLASS',
                ctaHref: '/vagoglass/',
                accent: '#dc2626'
            }), { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }

        const isEn = row.language === 'en';

        if (!row.unsubscribed_at) {
            await db.prepare(
                'UPDATE newsletter_subscribers SET unsubscribed_at = CURRENT_TIMESTAMP, confirmed = 0 WHERE id = ?'
            ).bind(row.id).run();
        }

        return new Response(htmlPage({
            title: isEn ? 'Unsubscribed — VAGOGLASS' : 'Dezabonat — VAGOGLASS',
            heading: isEn ? 'You have been unsubscribed' : 'Ai fost dezabonat',
            body: isEn
                ? 'We are sorry to see you go. You will not receive any further emails from VAGOGLASS.'
                : 'Ne pare rău. Nu vei mai primi emailuri de la VAGOGLASS.',
            ctaLabel: isEn ? 'Back to VAGOGLASS' : 'Înapoi la VAGOGLASS',
            ctaHref: isEn ? '/vagoglass/en/' : '/vagoglass/'
        }), { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        return new Response(htmlPage({
            title: 'Eroare',
            heading: 'A apărut o eroare',
            body: 'Te rugăm să încerci din nou mai târziu.',
            ctaLabel: 'Înapoi la VAGOGLASS',
            ctaHref: '/vagoglass/',
            accent: '#dc2626'
        }), { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
}
