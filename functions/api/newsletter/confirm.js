/**
 * Newsletter confirm endpoint (double opt-in)
 * GET /api/newsletter/confirm?token=...
 *
 * Updates confirmed=1, confirmed_at=now.
 * Returns a simple HTML thank-you page.
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
  a.btn:hover { filter:brightness(1.08); }
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
            title: 'Token lipsă — VAGOGLASS',
            heading: 'Link invalid',
            body: 'Linkul de confirmare lipsește sau este incomplet.',
            ctaLabel: 'Înapoi la VAGOGLASS',
            ctaHref: '/vagoglass/',
            accent: '#dc2626'
        }), { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    try {
        const row = await db.prepare(
            'SELECT id, email, confirmed, language FROM newsletter_subscribers WHERE confirm_token = ?'
        ).bind(token).first();

        if (!row) {
            return new Response(htmlPage({
                title: 'Token invalid — VAGOGLASS',
                heading: 'Link expirat sau invalid',
                body: 'Nu am găsit o abonare asociată acestui link. Poate a expirat sau a fost folosit deja.',
                ctaLabel: 'Înapoi la VAGOGLASS',
                ctaHref: '/vagoglass/',
                accent: '#dc2626'
            }), { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }

        const isEn = row.language === 'en';

        if (!row.confirmed) {
            await db.prepare(
                'UPDATE newsletter_subscribers SET confirmed = 1, confirmed_at = CURRENT_TIMESTAMP WHERE id = ?'
            ).bind(row.id).run();
        }

        return new Response(htmlPage({
            title: isEn ? 'Subscription confirmed — VAGOGLASS' : 'Abonare confirmată — VAGOGLASS',
            heading: isEn ? 'Thank you — your subscription is confirmed!' : 'Mulțumim — abonarea ta a fost confirmată!',
            body: isEn
                ? 'You will receive our monthly insights on PNRR rail procurement and VAGOGLASS updates.'
                : 'Vei primi lunar analizele noastre pe achizițiile feroviare PNRR și noutățile VAGOGLASS.',
            ctaLabel: isEn ? 'Back to VAGOGLASS' : 'Înapoi la VAGOGLASS',
            ctaHref: isEn ? '/vagoglass/en/' : '/vagoglass/'
        }), { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    } catch (error) {
        console.error('Confirm error:', error);
        return new Response(htmlPage({
            title: 'Eroare — VAGOGLASS',
            heading: 'A apărut o eroare',
            body: 'Te rugăm să încerci din nou mai târziu sau să ne contactezi.',
            ctaLabel: 'Înapoi la VAGOGLASS',
            ctaHref: '/vagoglass/',
            accent: '#dc2626'
        }), { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
}
