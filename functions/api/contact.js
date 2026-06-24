/**
 * Contact / Quote Request Endpoint
 * POST /api/contact
 *
 * Receives the website contact form, validates it, persists the lead, and
 * attempts to deliver an email notification to the US office.
 *
 * Delivery strategy (resilient — a lead is NEVER lost):
 *   1. Persist the lead into D1 (contact_leads table) first. This is the
 *      source of truth and is queryable from the admin dashboard.
 *   2. Attempt email delivery via MailChannels (free on Cloudflare Pages when
 *      a verified sender domain + DKIM is configured). If it fails or is not
 *      configured, we still return 200 because the lead is safely stored.
 *
 * Accepts JSON: { name, email, company, phone, message, segment, budget }
 * Returns JSON: { success: boolean, message: string }
 *
 * Required env (optional but recommended for email delivery):
 *   CONTACT_TO_EMAIL    -> defaults to office.us@xglass.eu
 *   CONTACT_FROM_EMAIL  -> a verified sender on your domain (e.g. noreply@xglass.eu)
 *   DKIM_DOMAIN         -> xglass.eu
 *   DKIM_SELECTOR       -> e.g. "mailchannels"
 *   DKIM_PRIVATE_KEY    -> base64 DKIM private key (Cloudflare Secret)
 * D1 binding: VAGOTECH_DB (already declared in wrangler.toml)
 */

const DEFAULT_TO = 'office.us@xglass.eu';
const DEFAULT_FROM = 'noreply@xglass.eu';
const ALLOWED_ORIGINS = [
    'https://xglass.eu',
    'https://www.xglass.eu',
    'https://versatika.com',
    'https://glass-expert.pages.dev'
];

/* ----------------------------------------------------------------
   CORS helpers
   ---------------------------------------------------------------- */
function corsHeaders(request) {
    const origin = request.headers.get('Origin') || '';
    // Allow the configured production origins, any *.pages.dev preview, and
    // localhost during development. Fall back to the primary site otherwise.
    let allowOrigin = 'https://xglass.eu';
    if (
        ALLOWED_ORIGINS.includes(origin) ||
        /^https:\/\/[a-z0-9-]+\.pages\.dev$/.test(origin) ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    ) {
        allowOrigin = origin;
    }
    return {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin'
    };
}

function jsonResponse(body, status, request) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(request)
        }
    });
}

/* ----------------------------------------------------------------
   Validation
   ---------------------------------------------------------------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function sanitize(value, maxLen) {
    if (value === undefined || value === null) return '';
    return String(value).trim().substring(0, maxLen);
}

function validate(data) {
    const errors = [];
    const name = sanitize(data.name, 120);
    const email = sanitize(data.email, 254);
    if (!name) errors.push('name is required');
    if (!email) {
        errors.push('email is required');
    } else if (!EMAIL_RE.test(email)) {
        errors.push('email is not valid');
    }
    return { errors };
}

/* ----------------------------------------------------------------
   Persistence (D1) — best effort, never blocks the response on schema gaps
   ---------------------------------------------------------------- */
async function persistLead(db, lead) {
    if (!db) return { stored: false, reason: 'no-db-binding' };
    try {
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS contact_leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                company TEXT,
                phone TEXT,
                segment TEXT,
                budget TEXT,
                message TEXT,
                status TEXT DEFAULT 'new',
                email_sent BOOLEAN DEFAULT 0,
                source TEXT DEFAULT 'website',
                user_agent TEXT,
                ip_country TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `).run();

        const result = await db.prepare(`
            INSERT INTO contact_leads
                (name, email, company, phone, segment, budget, message, source, user_agent, ip_country)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'website', ?, ?)
        `).bind(
            lead.name,
            lead.email,
            lead.company || null,
            lead.phone || null,
            lead.segment || null,
            lead.budget || null,
            lead.message || null,
            lead.userAgent || null,
            lead.ipCountry || null
        ).run();

        return { stored: true, id: result.meta?.last_row_id };
    } catch (err) {
        return { stored: false, reason: err.message };
    }
}

/* ----------------------------------------------------------------
   Email delivery (MailChannels) — best effort
   ---------------------------------------------------------------- */
function buildEmailContent(lead) {
    const rows = [
        ['Name', lead.name],
        ['Email', lead.email],
        ['Company', lead.company || '—'],
        ['Phone', lead.phone || '—'],
        ['Segment', lead.segment || '—'],
        ['Budget', lead.budget || '—']
    ];
    const textLines = rows.map(([k, v]) => `${k}: ${v}`);
    textLines.push('', 'Message:', lead.message || '—');
    const text = `New quote request from the Glass Expert USA website\n\n${textLines.join('\n')}\n`;

    const tableRows = rows.map(([k, v]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#1a3a52;border-bottom:1px solid #eee">${escapeHtml(k)}</td>` +
        `<td style="padding:6px 12px;border-bottom:1px solid #eee">${escapeHtml(v)}</td></tr>`
    ).join('');
    const html = `
        <div style="font-family:system-ui,Segoe UI,sans-serif;max-width:640px;margin:auto">
            <div style="background:#1a3a52;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0">
                <h2 style="margin:0;font-size:18px">New Quote Request — Glass Expert USA</h2>
            </div>
            <div style="border:1px solid #eee;border-top:none;padding:20px 24px;border-radius:0 0 8px 8px">
                <table style="width:100%;border-collapse:collapse;font-size:14px">${tableRows}</table>
                <h3 style="color:#1a3a52;font-size:14px;margin:18px 0 6px">Message</h3>
                <p style="white-space:pre-wrap;font-size:14px;color:#333">${escapeHtml(lead.message || '—')}</p>
            </div>
        </div>`;
    return { text, html };
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

async function sendEmail(env, lead) {
    const toEmail = env.CONTACT_TO_EMAIL || DEFAULT_TO;
    const fromEmail = env.CONTACT_FROM_EMAIL || DEFAULT_FROM;
    const { text, html } = buildEmailContent(lead);

    const personalization = {
        to: [{ email: toEmail, name: 'Glass Expert USA' }]
    };
    // DKIM dramatically improves deliverability; only attach if fully configured.
    if (env.DKIM_DOMAIN && env.DKIM_SELECTOR && env.DKIM_PRIVATE_KEY) {
        personalization.dkim_domain = env.DKIM_DOMAIN;
        personalization.dkim_selector = env.DKIM_SELECTOR;
        personalization.dkim_private_key = env.DKIM_PRIVATE_KEY;
    }

    const payload = {
        personalizations: [personalization],
        from: { email: fromEmail, name: 'Glass Expert USA Website' },
        reply_to: { email: lead.email, name: lead.name },
        subject: `New Quote Request — ${lead.company || lead.name}`,
        content: [
            { type: 'text/plain', value: text },
            { type: 'text/html', value: html }
        ]
    };

    try {
        const resp = await fetch('https://api.mailchannels.net/tx/v1/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (resp.ok || resp.status === 202) {
            return { sent: true };
        }
        const detail = await resp.text();
        return { sent: false, reason: `mailchannels ${resp.status}: ${detail.substring(0, 200)}` };
    } catch (err) {
        return { sent: false, reason: err.message };
    }
}

/* ----------------------------------------------------------------
   Handlers
   ---------------------------------------------------------------- */
export async function onRequestOptions(context) {
    return new Response(null, { status: 204, headers: corsHeaders(context.request) });
}

export async function onRequestPost(context) {
    const { request, env } = context;

    // Parse body defensively (some clients send text/plain).
    let data;
    try {
        data = await request.json();
    } catch {
        try {
            data = JSON.parse(await request.text());
        } catch {
            return jsonResponse(
                { success: false, message: 'Invalid request body. Expected JSON.' },
                400,
                request
            );
        }
    }

    const { errors } = validate(data);
    if (errors.length) {
        return jsonResponse(
            { success: false, message: errors.join(', ') },
            400,
            request
        );
    }

    const lead = {
        name: sanitize(data.name, 120),
        email: sanitize(data.email, 254),
        company: sanitize(data.company, 200),
        phone: sanitize(data.phone, 60),
        segment: sanitize(data.segment, 60),
        budget: sanitize(data.budget, 60),
        message: sanitize(data.message, 5000),
        userAgent: sanitize(request.headers.get('User-Agent'), 255),
        ipCountry: request.headers.get('CF-IPCountry') || null
    };

    // 1. Persist first — this is the durable source of truth.
    const persisted = await persistLead(env.VAGOTECH_DB, lead);

    // 2. Try email notification (best effort).
    const emailResult = await sendEmail(env, lead);

    // Mark the stored row as emailed when delivery succeeded.
    if (persisted.stored && persisted.id && emailResult.sent && env.VAGOTECH_DB) {
        try {
            await env.VAGOTECH_DB.prepare(
                'UPDATE contact_leads SET email_sent = 1 WHERE id = ?'
            ).bind(persisted.id).run();
        } catch (_) { /* non-fatal */ }
    }

    // Log server-side for observability without leaking to the client.
    if (!persisted.stored) {
        console.error('Lead persistence failed:', persisted.reason);
    }
    if (!emailResult.sent) {
        console.warn('Lead email not sent:', emailResult.reason);
    }

    // Succeed for the user as long as the lead was captured somewhere.
    // If BOTH persistence and email fail, surface an error so the user can
    // fall back to phone/email.
    if (!persisted.stored && !emailResult.sent) {
        return jsonResponse(
            {
                success: false,
                message: 'We could not process your request right now. Please call +1-609-408-8100 or email office.us@xglass.eu.'
            },
            502,
            request
        );
    }

    return jsonResponse(
        {
            success: true,
            message: "Thank you! Your quote request was received. Our team will respond within 24 hours."
        },
        200,
        request
    );
}

// Fallback for any other method.
export async function onRequest(context) {
    if (context.request.method === 'POST') return onRequestPost(context);
    if (context.request.method === 'OPTIONS') return onRequestOptions(context);
    return jsonResponse({ success: false, message: 'Method not allowed' }, 405, context.request);
}
