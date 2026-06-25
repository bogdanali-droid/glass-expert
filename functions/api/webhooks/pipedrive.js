/**
 * POST /api/webhooks/pipedrive
 *
 * Primeşte webhook Pipedrive pentru deal.added / deal.updated / deal.deleted
 *
 * Payload Pipedrive:
 * {
 *   event: "updated.deal" | "added.deal" | "deleted.deal",
 *   current: { id, title, value, stage_name, status, org_name, person_name, ... },
 *   previous: { ... },
 *   meta: { ...  }
 * }
 *
 * Returns: { success: true }
 */

import { json, err, nextSeq, now, today, mapPipedriveStage } from '../_helpers.js';

export async function onRequestPost(context) {
    const { DB } = context.env;

    let body;
    try {
        body = await context.request.json();
    } catch {
        return err('Invalid JSON body');
    }

    const { event, current, previous } = body;

    if (!event || !current) {
        return err('Payload Pipedrive invalid (lipsesc event sau current)');
    }

    // Ignorăm ștergeri — nu ștergem clienți automat din CRM
    if (event === 'deleted.deal') {
        return json({ success: true, action: 'ignored', reason: 'delete events are not synced' });
    }

    const pipedriveId = String(current.id);
    const company = current.org_name || current.organization?.name || current.title || '';
    const stageName = current.stage_name || current.status || '';
    const newStage = mapPipedriveStage(stageName);
    const opportunity = parseFloat(current.value || 0) || 0;

    const ts = now();
    const todayStr = today();

    try {
        // Căutăm client existent după pipedrive_id
        let client = await DB
            .prepare('SELECT * FROM clients WHERE pipedrive_id = ?')
            .bind(pipedriveId)
            .first();

        if (client) {
            // Update client existent
            const prevStage = client.stage;
            const stageChanged = prevStage !== newStage;
            const valueChanged = client.opportunity !== opportunity;

            const updates = [];
            const params = [];

            if (stageChanged) { updates.push('stage = ?'); params.push(newStage); }
            if (valueChanged) { updates.push('opportunity = ?'); params.push(opportunity); }
            updates.push('last_activity = ?', 'updated_at = ?');
            params.push(todayStr, ts);
            params.push(client.id);

            await DB
                .prepare(`UPDATE clients SET ${updates.join(', ')} WHERE id = ?`)
                .bind(...params)
                .run();

            // Notă automată dacă stage s-a schimbat
            if (stageChanged) {
                const noteText = `Pipedrive sync: deal mutat la "${stageName}" (${prevStage} → ${newStage})`;
                await DB.prepare(`
                    INSERT INTO notes (client_id, text, note_date, created_at)
                    VALUES (?, ?, ?, ?)
                `).bind(client.id, noteText, todayStr, ts).run();
            }

            return json({
                success: true,
                action: 'updated',
                client_id: client.id,
                stage_changed: stageChanged,
                value_changed: valueChanged,
            });

        } else {
            // Client nou — creăm doar dacă avem company
            if (!company) {
                return json({
                    success: true,
                    action: 'ignored',
                    reason: 'no company name in deal',
                });
            }

            // Verificăm dacă există deja după company
            const byCompany = await DB
                .prepare('SELECT id FROM clients WHERE LOWER(TRIM(company)) = LOWER(TRIM(?))')
                .bind(company)
                .first();

            if (byCompany) {
                // Actualizăm pipedrive_id pe clientul existent
                await DB
                    .prepare('UPDATE clients SET pipedrive_id = ?, updated_at = ? WHERE id = ?')
                    .bind(pipedriveId, ts, byCompany.id)
                    .run();

                return json({
                    success: true,
                    action: 'linked',
                    client_id: byCompany.id,
                    pipedrive_id: pipedriveId,
                });
            }

            // Creăm client nou
            const cod = await nextSeq(DB, 'clients', 'GE');

            await DB.prepare(`
                INSERT INTO clients
                    (cod, alias, company, type, country, city,
                     opportunity, stage, products, priority, source, tags, intel,
                     pipedrive_id, created_at, last_activity, updated_at)
                VALUES (?, ?, ?, 'Altul', 'România', '', ?, ?, '[]', 'normal', 'Pipedrive', '[]', '', ?, ?, ?, ?)
            `).bind(
                cod, cod, company,
                opportunity, newStage,
                pipedriveId,
                ts, todayStr, ts,
            ).run();

            const newClient = await DB
                .prepare('SELECT id FROM clients WHERE cod = ?')
                .bind(cod)
                .first();

            // Contact din deal
            const contactName = current.person_name || current.contact_name || '';
            const contactEmail = current.person?.email?.[0]?.value || current.contact_email || '';
            const contactPhone = current.person?.phone?.[0]?.value || current.contact_phone || '';

            if (newClient && contactName) {
                await DB.prepare(`
                    INSERT INTO contacts (client_id, name, email, phone, is_primary, created_at)
                    VALUES (?, ?, ?, ?, 1, ?)
                `).bind(newClient.id, contactName, contactEmail, contactPhone, ts).run();
            }

            // Notă automată de creare
            if (newClient) {
                await DB.prepare(`
                    INSERT INTO notes (client_id, text, note_date, created_at)
                    VALUES (?, ?, ?, ?)
                `).bind(
                    newClient.id,
                    `Pipedrive sync: client creat automat din deal "${current.title || company}"`,
                    todayStr, ts,
                ).run();
            }

            return json({
                success: true,
                action: 'created',
                client_id: newClient?.id,
                cod,
            }, 201);
        }

    } catch (e) {
        // Webhook-urile Pipedrive nu trebuie să primească 5xx — returnăm 200 cu error
        console.error('Pipedrive webhook error:', e.message);
        return json({ success: false, error: e.message });
    }
}
