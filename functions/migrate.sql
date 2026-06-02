-- Migration: vagotech_* tables -> analytics_* tables (site-wide, segmented)
-- ONLY run this if a database with the OLD vagotech_* schema already exists
-- AND contains data you want to keep. For a fresh DB, run schema.sql instead.
--
-- Strategy: non-destructive. Creates new analytics_* tables, copies old data
-- with segment='vagotech', then leaves old tables in place (drop manually
-- after verifying the migration).

-- 1. Create new schema (idempotent)
-- (Run schema.sql first, or paste its CREATE statements here, then continue.)

-- 2. Copy visitors
INSERT OR IGNORE INTO analytics_visitors
    (visitor_id, segment, first_visit, last_visit, total_visits, pages_visited,
     device_type, browser, referrer, consent_given, consent_given_at,
     deleted, deleted_at, notes)
SELECT visitor_id, 'vagotech', first_visit, last_visit, total_visits, pages_visited,
       device_type, browser, referrer, consent_given, consent_given_at,
       deleted, deleted_at, notes
FROM vagotech_visitors;

-- 3. Copy events
INSERT INTO analytics_events
    (visitor_id, segment, event_type, product_name, page_path, duration_seconds,
     timestamp, device_type, referrer)
SELECT visitor_id, 'vagotech', event_type, product_name, page_path, duration_seconds,
       timestamp, device_type, referrer
FROM vagotech_events;

-- 4. Copy product metrics
INSERT OR IGNORE INTO analytics_product_metrics
    (segment, product_name, total_clicks, total_views, unique_visitors, last_clicked, updated_at)
SELECT 'vagotech', product_name, total_clicks, total_views, unique_visitors, last_clicked, updated_at
FROM vagotech_product_metrics;

-- 5. Copy page metrics
INSERT OR IGNORE INTO analytics_page_metrics
    (segment, page_path, total_views, unique_visitors, avg_duration_seconds, bounce_rate, last_visited, updated_at)
SELECT 'vagotech', page_path, total_views, unique_visitors, avg_duration_seconds, bounce_rate, last_visited, updated_at
FROM vagotech_page_metrics;

-- 6. AFTER verifying counts match, drop old tables manually:
-- DROP TABLE vagotech_events;
-- DROP TABLE vagotech_visitors;
-- DROP TABLE vagotech_product_metrics;
-- DROP TABLE vagotech_page_metrics;
