/**
 * Newsletter admin: send campaign
 * POST /api/newsletter/send-campaign
 *
 * Body: { subject, body_html, segment_filter?, language?, dry_run? }
 * Requires Basic Auth (admin / ADMIN_PASSWORD).
 *
 * Sends emails via Brevo to confirmed subscribers matching segment + language.
 * Records the campaign in newsletter_campaigns.
 * Adds an unsubscribe link footer to each email automatically.
 */

const VALID_SEGMENTS = ['tren', 'tramvai', 'metrou', 'all'];
const VALID_LANGS = ['ro', 'en'];

function unauthorized() {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
            'Content-Type': 'application/json',
            'WWW-Authenticate': 'Basic realm="Newsletter Admin"'
        }
    });
}

function checkAuth(request, env) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) return false;
    try {
        const creds = atob(authHeader.substring(6));
        const sep = creds.indexOf(':');
        const user = creds.substring(0, sep);
        const pass = creds.substring(sep + 1);
        const adminPassword = env.ADMIN_PASSWORD;
        return adminPassword && user === 'admin' && pass === adminPassword;
    } catch {
        return false;
    }
}

async function sendBrevoEmail({ apiKey, toEmail, toName, subject, html, fromEmail, fromName }) {
    const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            sender: { email: fromEmail, name: fromName },
            to: [{ email: toEmail, name: toName || toEmail }],
            subject,
            htmlContent: html
        })
    });
    if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Brevo ${resp.status}: ${txt}`);
    }
    return true;
}

function wrapHtmlWithFooter({ bodyHtml, unsubscribeUrl, language }) {
    const isEn = language === 'en';
    const unsubLabel = isEn ? 'Unsubscribe' : 'Dezabonare';
    const sentBy = isEn
        ? 'Sent by VAGOGLASS — rail glass division of Glass Expert (xglass.eu).'
        : 'Trimis de VAGOGLASS — linia rail glass a Glass Expert (xglass.eu).';
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#f5f7fa;margin:0;padding:24px;color:#111827">
  <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
    ${bodyHtml}
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px">
    <p style="font-size:0.78rem;color:#9ca3af;line-height:1.5;margin:0">
      ${sentBy}<br>
      <a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline">${unsubLabel}</a>
    </p>
  </div>
</body></html>`;
}

export async function onRequest(context) {
    const { request, env } = context;
    const db = env.VAGOTECH_DB;

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }
    if (!checkAuth(request, env)) return unauthorized();

    let payload;
    try {
        payload = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
    }

    const subject = (payload.subject || '').toString().trim();
    const bodyHtml = (payload.body_html || '').toString();
    let segmentFilter = (payload.segment_filter || 'all').toString().toLowerCase();
    let language = (payload.language || 'ro').toString().toLowerCase();
    const dryRun = payload.dry_run === true;

    if (!subject || !bodyHtml) {
        return new Response(JSON.stringify({ error: 'subject and body_html are required' }), { status: 400 });
    }
    if (!VALID_SEGMENTS.includes(segmentFilter)) segmentFilter = 'all';
    if (!VALID_LANGS.includes(language)) language = 'ro';

    const where = ['confirmed = 1', 'unsubscribed_at IS NULL', 'language = ?'];
    const params = [language];
    if (segmentFilter !== 'all') {
        where.push('(segment_interest = ? OR segment_interest = ?)');
        params.push(segmentFilter, 'all');
    }

    try {
        const subsResult = await db.prepare(`
            SELECT id, email, name, unsubscribe_token
            FROM newsletter_subscribers
            WHERE ${where.join(' AND ')}
        `).bind(...params).all();

        const subs = subsResult.results || [];

        if (dryRun) {
            return new Response(JSON.stringify({
                success: true,
                dry_run: true,
                target_count: subs.length,
                segment_filter: segmentFilter,
                language
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        if (!env.BREVO_API_KEY) {
            return new Response(JSON.stringify({
                success: false,
                error: 'BREVO_API_KEY not configured'
            }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        const url = new URL(request.url);
        const host = `${url.protocol}//${url.host}`;
        const fromEmail = env.NEWSLETTER_FROM_EMAIL || 'newsletter@xglass.eu';
        const fromName = env.NEWSLETTER_FROM_NAME || 'VAGOGLASS';

        // Insert campaign row first
        const campaignInsert = await db.prepare(`
            INSERT INTO newsletter_campaigns (subject, body_html, segment_filter, language, created_by)
            VALUES (?, ?, ?, ?, ?)
        `).bind(subject, bodyHtml, segmentFilter, language, 'admin').run();

        const campaignId = campaignInsert.meta?.last_row_id;

        let sentCount = 0;
        const errors = [];

        // Sequential send to avoid Brevo rate limits / Worker subrequest fanout limits
        for (const sub of subs) {
            const unsubscribeUrl = `${host}/api/newsletter/unsubscribe?token=${sub.unsubscribe_token}`;
            const html = wrapHtmlWithFooter({ bodyHtml, unsubscribeUrl, language });
            try {
                await sendBrevoEmail({
                    apiKey: env.BREVO_API_KEY,
                    toEmail: sub.email,
                    toName: sub.name,
                    subject,
                    html,
                    fromEmail,
                    fromName
                });
                sentCount++;
                // Update last_email_sent_at
                await db.prepare(
                    'UPDATE newsletter_subscribers SET last_email_sent_at = CURRENT_TIMESTAMP WHERE id = ?'
                ).bind(sub.id).run();
            } catch (e) {
                errors.push({ email: sub.email, error: e.message });
            }
        }

        await db.prepare(
            'UPDATE newsletter_campaigns SET sent_at = CURRENT_TIMESTAMP, sent_count = ? WHERE id = ?'
        ).bind(sentCount, campaignId).run();

        return new Response(JSON.stringify({
            success: true,
            campaign_id: campaignId,
            target_count: subs.length,
            sent_count: sentCount,
            errors_count: errors.length,
            errors: errors.slice(0, 10)
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('send-campaign error:', error);
        return new Response(JSON.stringify({ error: 'Server error', details: error.message }), { status: 500 });
    }
}
