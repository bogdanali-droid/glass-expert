/**
 * GET /api/stats — KPIs pentru Overview și Rapoarte
 *
 * Returnează:
 * {
 *   total_clients, pipeline_value, active_clients,
 *   overdue_tasks, quotes_sent, quotes_value,
 *   orders_active, orders_value,
 *   clients_by_stage, clients_by_type, clients_by_country,
 *   monthly_pipeline (ultimele 6 luni),
 *   recent_activity (ultimele 10 note)
 * }
 */

import { json, err, today } from '../_helpers.js';

export async function onRequestGet(context) {
    const { DB } = context.env;

    try {
        // Rulăm toate query-urile în paralel (D1 suportă batch)
        const [
            totalClients,
            activeClients,
            pipelineValue,
            overdueTasks,
            quotesSent,
            ordersActive,
            clientsByStage,
            clientsByType,
            clientsByCountry,
            recentNotes,
        ] = await Promise.all([
            // Total clienți
            DB.prepare('SELECT COUNT(*) as cnt FROM clients').first(),

            // Clienți activi (nu pierduti)
            DB.prepare("SELECT COUNT(*) as cnt FROM clients WHERE stage != 'pierdut'").first(),

            // Valoare pipeline (oportunitate × clienți activi)
            DB.prepare("SELECT SUM(opportunity) as val FROM clients WHERE stage IN ('prospect','calificat','oferta')").first(),

            // Tasks overdue (scadente astăzi sau în trecut, nerezolvate)
            DB.prepare(`SELECT COUNT(*) as cnt FROM tasks WHERE done = 0 AND due_date IS NOT NULL AND due_date < ?`)
                .bind(today())
                .first(),

            // Oferte trimise în ultimele 30 zile
            DB.prepare(`SELECT COUNT(*) as cnt, SUM(total) as val FROM quotes WHERE status = 'trimisa' AND date_created >= date('now', '-30 days')`).first(),

            // Comenzi active (nu livrate/anulate)
            DB.prepare(`SELECT COUNT(*) as cnt, SUM(total) as val FROM orders WHERE stage NOT IN ('livrat','anulat')`).first(),

            // Distribuție pe stage
            DB.prepare('SELECT stage, COUNT(*) as cnt FROM clients GROUP BY stage ORDER BY cnt DESC').all(),

            // Distribuție pe tip
            DB.prepare('SELECT type, COUNT(*) as cnt FROM clients GROUP BY type ORDER BY cnt DESC LIMIT 10').all(),

            // Top țări
            DB.prepare('SELECT country, COUNT(*) as cnt FROM clients GROUP BY country ORDER BY cnt DESC LIMIT 10').all(),

            // Ultimele 10 note (activitate recentă)
            DB.prepare(`
                SELECT n.id, n.text, n.note_date, c.cod as client_cod, c.company, c.alias
                FROM notes n
                JOIN clients c ON n.client_id = c.id
                ORDER BY n.note_date DESC, n.id DESC
                LIMIT 10
            `).all(),
        ]);

        // Comenzi pe stage pentru kanban
        const ordersByStage = await DB
            .prepare("SELECT stage, COUNT(*) as cnt, SUM(total) as val FROM orders WHERE stage NOT IN ('livrat','anulat') GROUP BY stage")
            .all();

        return json({
            total_clients: totalClients?.cnt || 0,
            active_clients: activeClients?.cnt || 0,
            pipeline_value: pipelineValue?.val || 0,
            overdue_tasks: overdueTasks?.cnt || 0,

            quotes_sent: quotesSent?.cnt || 0,
            quotes_value: quotesSent?.val || 0,

            orders_active: ordersActive?.cnt || 0,
            orders_value: ordersActive?.val || 0,

            clients_by_stage: clientsByStage.results || [],
            clients_by_type: clientsByType.results || [],
            clients_by_country: clientsByCountry.results || [],
            orders_by_stage: ordersByStage.results || [],

            recent_activity: recentNotes.results || [],
        });
    } catch (e) {
        return err('Database error: ' + e.message, 500);
    }
}
