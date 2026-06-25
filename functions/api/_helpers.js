/**
 * Glass Expert CRM — Shared Helpers
 * Importate în toate Pages Functions din /api/
 */

export function json(data, status = 200) {
    return Response.json(data, { status });
}

export function err(msg, status = 400) {
    return Response.json({ error: msg }, { status });
}

/**
 * Returnează un client complet cu contacts, notes, tasks.
 * @param {D1Database} db
 * @param {number|string} clientId
 */
export async function getClientWithDetails(db, clientId) {
    const client = await db
        .prepare('SELECT * FROM clients WHERE id = ?')
        .bind(clientId)
        .first();
    if (!client) return null;

    const contacts = await db
        .prepare('SELECT * FROM contacts WHERE client_id = ? ORDER BY is_primary DESC, id ASC')
        .bind(clientId)
        .all();
    const notes = await db
        .prepare('SELECT * FROM notes WHERE client_id = ? ORDER BY note_date DESC, id DESC LIMIT 50')
        .bind(clientId)
        .all();
    const tasks = await db
        .prepare('SELECT * FROM tasks WHERE client_id = ? ORDER BY done ASC, due_date ASC, id ASC')
        .bind(clientId)
        .all();

    return {
        ...client,
        products: safeJsonParse(client.products, []),
        tags: safeJsonParse(client.tags, []),
        contacts: contacts.results,
        notes: notes.results,
        tasks: tasks.results,
    };
}

/**
 * Incrementează secvența și returnează codul formatat (ex. "GE-007").
 * @param {D1Database} db
 * @param {string} name — numele secvenței (clients, quotes, orders, lots)
 * @param {string} prefix — ex. "GE", "OF", "CMD", "LOT"
 */
export async function nextSeq(db, name, prefix) {
    await db
        .prepare('UPDATE sequences SET value = value + 1 WHERE name = ?')
        .bind(name)
        .run();
    const row = await db
        .prepare('SELECT value FROM sequences WHERE name = ?')
        .bind(name)
        .first();
    return prefix + '-' + String(row.value).padStart(3, '0');
}

/** Data curentă în format ISO (YYYY-MM-DD). */
export function today() {
    return new Date().toISOString().slice(0, 10);
}

/** ISO timestamp complet. */
export function now() {
    return new Date().toISOString();
}

/** JSON.parse sigur cu fallback. */
export function safeJsonParse(val, fallback = null) {
    try {
        return JSON.parse(val);
    } catch {
        return fallback;
    }
}

/**
 * Mapare stage Pipedrive → stage intern CRM.
 * @param {string} pipedriveStage
 */
export function mapPipedriveStage(pipedriveStage) {
    if (!pipedriveStage) return 'prospect';
    const s = pipedriveStage.toLowerCase().trim();
    if (s.includes('qualif') || s.includes('calific')) return 'calificat';
    if (s.includes('proposal') || s.includes('ofert')) return 'oferta';
    if (s.includes('won') || s.includes('comanda') || s.includes('câștig')) return 'comanda';
    if (s.includes('lost') || s.includes('pierdut')) return 'pierdut';
    return 'prospect';
}
