// Cloudflare Workers AI — OCR cărți de vizită (față + verso)
// Model: llama-3.2-11b-vision-instruct (calitate maximă, motor intern Cloudflare)

const EXTRACT_PROMPT = `You are a precise business card OCR system. Carefully read every character on this business card image.
Extract ALL information and return ONLY a valid JSON object with these exact fields:
{
  "name": "full person name as printed",
  "title": "job title / function / position",
  "company": "company or firm name",
  "phone": "first phone number with country code if present",
  "phone2": "second phone number if present, else empty string",
  "email": "first email address",
  "email2": "second email address if present, else empty string",
  "website": "website URL without http://",
  "address": "street address",
  "city": "city name",
  "country": "country name",
  "vatCode": "VAT number, CUI, or tax code if visible, else empty string"
}
RULES:
- Read EVERY character carefully, especially phone digits and email addresses
- Include ALL phone numbers you see
- If a field is not visible, use empty string ""
- Return ONLY the JSON object, absolutely no other text before or after
- Do NOT add markdown code blocks`;

async function runVision(ai, imageBytes, prompt) {
  // Try llama-3.2-11b-vision first (best quality)
  try {
    const r = await ai.run('@cf/meta/llama-3.2-11b-vision-instruct', {
      messages: [{
        role: 'user',
        content: [
          { type: 'image', image: [...imageBytes] },
          { type: 'text', text: prompt }
        ]
      }],
      max_tokens: 600
    });
    return r.response || '';
  } catch (_) {}

  // Fallback to llava-1.5-7b
  try {
    const r = await ai.run('@cf/llava-1.5-7b-hf', {
      image: [...imageBytes],
      prompt,
      max_tokens: 600
    });
    return r.description || r.response || '';
  } catch (_) {}

  return '';
}

function b64ToBytes(b64) {
  const clean = b64.replace(/^data:image\/[^;]+;base64,/, '');
  const raw = atob(clean);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

function parseJSON(text) {
  if (!text) return {};
  // Strip markdown fences if model added them
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) return {};
  try { return JSON.parse(match[0]); } catch { return {}; }
}

function mergeData(front, back) {
  const keys = ['name','title','company','phone','phone2','email','email2','website','address','city','country','vatCode'];
  const out = {};
  for (const k of keys) {
    const fv = (front[k] || '').trim();
    const bv = (back[k] || '').trim();
    out[k] = fv || bv;
  }
  // If back has phone2 and front has only phone, promote back's phone to phone2
  if (out.phone && !out.phone2 && (back.phone || '').trim() && back.phone !== front.phone) {
    out.phone2 = (back.phone || '').trim();
  }
  return out;
}

export async function onRequestPost(context) {
  if (!context.env.AI) {
    return Response.json({ success: false, error: 'AI binding not configured in wrangler.toml' }, { status: 500 });
  }

  let body;
  try { body = await context.request.json(); } catch {
    return Response.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { front, back } = body;
  if (!front) return Response.json({ success: false, error: 'No front image provided' }, { status: 400 });

  const frontBytes = b64ToBytes(front);
  const frontText = await runVision(context.env.AI, frontBytes, EXTRACT_PROMPT);
  const frontData = parseJSON(frontText);

  let backData = {};
  if (back) {
    const backBytes = b64ToBytes(back);
    const backPrompt = `You are a business card OCR system. This is the BACK of a business card.
Extract any additional contact information not already on the front.
Return ONLY a JSON with fields: name, title, company, phone, phone2, email, email2, website, address, city, country, vatCode.
Empty string for any field not found. JSON only, no markdown.`;
    const backText = await runVision(context.env.AI, backBytes, backPrompt);
    backData = parseJSON(backText);
  }

  const merged = mergeData(frontData, backData);

  return Response.json({
    success: true,
    data: merged,
    raw: { front: frontText, back: '' }
  }, { headers: { 'Access-Control-Allow-Origin': '*' } });
}

export async function onRequestOptions() {
  return new Response(null, { headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }});
}
