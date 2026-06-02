/**
 * Newsletter subscribe endpoint
 * POST /api/newsletter/subscribe
 *
 * Body: { email, name?, company?, segment_interest?, language?, source?, consent_marketing }
 * - Validates email
 * - Generates confirm_token + unsubscribe_token
 * - Insert (or no-op) into D1 with confirmed=0
 * - Sends confirmation email via Brevo
 * - Returns { success, message }
 */

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const VALID_SEGMENTS = ['tren', 'tramvai', 'metrou', 'all'];
const VALID_LANGS = ['ro', 'en'];
const VALID_SOURCES = ['homepage', 'whitepaper', 'footer', 'aplicatii', 'resurse'];

function jsonResponse(body, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}

function clean(v, max = 120) {
    if (v == null) return null;
    return String(v).trim().substring(0, max);
}

function buildConfirmEmail({ name, language, confirmUrl }) {
    const ro = language !== 'en';
    const subject = ro
        ? 'Confirmă-ți abonarea la newsletter-ul VAGOGLASS'
        : 'Confirm your VAGOGLASS newsletter subscription';

    const greeting = name
        ? (ro ? `Salut, ${name}!` : `Hi ${name},`)
        : (ro ? 'Salut!' : 'Hi,');

    const bodyText = ro
        ? `Mulțumim că te-ai abonat la newsletter-ul VAGOGLASS — analize lunare despre achizițiile feroviare PNRR și noutăți din linia noastră de sticlă pentru material rulant.<br><br>Te rugăm să confirmi abonarea prin click pe butonul de mai jos:`
        : `Thanks for subscribing to the VAGOGLASS newsletter — monthly insights on PNRR rail procurement and updates from our rolling-stock glass line.<br><br>Please confirm your subscription by clicking the button below:`;

    const cta = ro ? 'Confirmă abonarea' : 'Confirm subscription';
    const footer = ro
        ? `Dacă nu ai solicitat această abonare, ignoră acest email.<br><br>VAGOGLASS — linia rail glass a Glass Expert (xglass.eu)`
        : `If you did not request this subscription, simply ignore this email.<br><br>VAGOGLASS — rail glass division of Glass Expert (xglass.eu)`;

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#f5f7fa;margin:0;padding:24px;color:#111827">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
    <div style="font-size:0.85rem;letter-spacing:0.08em;text-transform:uppercase;color:#0891b2;font-weight:600;margin-bottom:8px">VAGOGLASS</div>
    <h1 style="font-size:1.4rem;margin:0 0 16px;color:#0f172a">${greeting}</h1>
    <p style="font-size:1rem;line-height:1.6;color:#334155;margin:0 0 24px">${bodyText}</p>
    <p style="margin:0 0 32px"><a href="${confirmUrl}" style="display:inline-block;background:#0891b2;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600">${cta} →</a></p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
    <p style="font-size:0.85rem;color:#6b7280;line-height:1.5;margin:0">${footer}</p>
  </div>
</body></html>`;

    return { subject, html };
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
        throw new Error(`Brevo error ${resp.status}: ${txt}`);
    }
    return resp.json();
}

export async function onRequest(context) {
    const { request, env } = context;
    const db = env.VAGOTECH_DB;

    if (request.method === 'OPTIONS') {
        return jsonResponse({}, 204);
    }
    if (request.method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    let data;
    try {
        data = await request.json();
    } catch {
        return jsonResponse({ error: 'Invalid JSON body' }, 400);
    }

    const email = clean(data.email, 200)?.toLowerCase();
    const name = clean(data.name, 120);
    const company = clean(data.company, 160);
    let segmentInterest = clean(data.segment_interest, 20) || 'all';
    let language = clean(data.language, 2) || 'ro';
    let source = clean(data.source, 40) || 'homepage';
    const consentMarketing = data.consent_marketing === true || data.consent_marketing === 1 || data.consent_marketing === '1' || data.consent_marketing === 'on';

    if (!email || !EMAIL_RX.test(email)) {
        return jsonResponse({ success: false, error: 'invalid_email', message: 'Adresă de email invalidă.' }, 400);
    }
    if (!consentMarketing) {
        return jsonResponse({ success: false, error: 'consent_required', message: 'Consimțământul GDPR este obligatoriu.' }, 400);
    }
    if (!VALID_SEGMENTS.includes(segmentInterest)) segmentInterest = 'all';
    if (!VALID_LANGS.includes(language)) language = 'ro';
    if (!VALID_SOURCES.includes(source)) source = 'homepage';

    try {
        // Check duplicate
        const existing = await db.prepare(
            'SELECT id, confirmed, confirm_token, unsubscribe_token FROM newsletter_subscribers WHERE email = ?'
        ).bind(email).first();

        const url = new URL(request.url);
        const host = `${url.protocol}//${url.host}`;

        if (existing) {
            // If already confirmed: no-op success
            if (existing.confirmed) {
                return jsonResponse({
                    success: true,
                    already_subscribed: true,
                    message: language === 'en'
                        ? 'This email is already subscribed.'
                        : 'Email-ul există deja în lista noastră. Mulțumim!'
                });
            }
            // Resend confirmation
            const confirmUrl = `${host}/api/newsletter/confirm?token=${existing.confirm_token}`;
            if (env.BREVO_API_KEY) {
                try {
                    const { subject, html } = buildConfirmEmail({ name, language, confirmUrl });
                    await sendBrevoEmail({
                        apiKey: env.BREVO_API_KEY,
                        toEmail: email,
                        toName: name,
                        subject,
                        html,
                        fromEmail: env.NEWSLETTER_FROM_EMAIL || 'newsletter@xglass.eu',
                        fromName: env.NEWSLETTER_FROM_NAME || 'VAGOGLASS'
                    });
                } catch (e) {
                    console.error('Brevo resend error:', e);
                }
            }
            return jsonResponse({
                success: true,
                resent: true,
                message: language === 'en'
                    ? 'We re-sent the confirmation email. Please check your inbox.'
                    : 'Ți-am retrimis emailul de confirmare. Verifică inbox-ul.'
            });
        }

        // New subscriber
        const confirmToken = crypto.randomUUID();
        const unsubscribeToken = crypto.randomUUID();

        await db.prepare(`
            INSERT INTO newsletter_subscribers
            (email, name, company, segment_interest, language, source, consent_marketing, confirmed, confirm_token, unsubscribe_token)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
        `).bind(
            email, name, company, segmentInterest, language, source,
            consentMarketing ? 1 : 0, confirmToken, unsubscribeToken
        ).run();

        const confirmUrl = `${host}/api/newsletter/confirm?token=${confirmToken}`;

        // Send confirmation email
        if (env.BREVO_API_KEY) {
            try {
                const { subject, html } = buildConfirmEmail({ name, language, confirmUrl });
                await sendBrevoEmail({
                    apiKey: env.BREVO_API_KEY,
                    toEmail: email,
                    toName: name,
                    subject,
                    html,
                    fromEmail: env.NEWSLETTER_FROM_EMAIL || 'newsletter@xglass.eu',
                    fromName: env.NEWSLETTER_FROM_NAME || 'VAGOGLASS'
                });
            } catch (e) {
                console.error('Brevo send error:', e);
                // Still report success — subscriber recorded; admin can resend later
            }
        } else {
            console.warn('BREVO_API_KEY not configured — confirmation email NOT sent.');
        }

        return jsonResponse({
            success: true,
            message: language === 'en'
                ? 'Almost done! Check your inbox to confirm your subscription.'
                : 'Aproape gata! Verifică inbox-ul ca să-ți confirmi abonarea.'
        });
    } catch (error) {
        console.error('Newsletter subscribe error:', error);
        return jsonResponse({
            success: false,
            error: 'server_error',
            message: 'Eroare temporară. Încearcă din nou mai târziu.',
            details: error.message
        }, 500);
    }
}
