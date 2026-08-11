// Salvează foto carte de vizită + metadata GPS în D1
export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return Response.json({ success: false, error: 'DB binding missing' }, { status: 500 });

  let body;
  try { body = await context.request.json(); } catch {
    return Response.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { cod, company, frontImage, backImage, ocrData, lat, lon, scannedAt } = body;

  try {
    await db.prepare(`
      INSERT INTO client_cards (cod, company, front_image, back_image, ocr_data, latitude, longitude, scanned_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      cod || '',
      company || '',
      frontImage || null,
      backImage || null,
      typeof ocrData === 'string' ? ocrData : JSON.stringify(ocrData || {}),
      lat || null,
      lon || null,
      scannedAt || new Date().toISOString()
    ).run();

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
