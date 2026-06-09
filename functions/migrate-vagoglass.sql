-- VAGOGLASS extension (run after schema.sql)
-- ------------------------------------------------------------
-- Adaugă suport pentru segment `vagoglass` + geo-tracking
-- (country/city/lat/lng), UTM tags, search query și section_id
-- pentru scroll depth pe pagină.
--
-- IMPORTANT: SQLite (D1) NU suportă `ADD COLUMN IF NOT EXISTS`.
-- Rulează doar o dată. Dacă o coloană există deja, comentează linia
-- respectivă înainte de re-run.
-- ------------------------------------------------------------

-- Extinderi pe `analytics_events`
ALTER TABLE analytics_events ADD COLUMN country TEXT;          -- ISO 3166-1 alpha-2 (ex: RO, DE, US)
ALTER TABLE analytics_events ADD COLUMN city TEXT;             -- oraș din CF-IPCity / request.cf.city
ALTER TABLE analytics_events ADD COLUMN latitude REAL;         -- request.cf.latitude
ALTER TABLE analytics_events ADD COLUMN longitude REAL;        -- request.cf.longitude
ALTER TABLE analytics_events ADD COLUMN search_query TEXT;     -- extras din referrer (Google/Bing q=)
ALTER TABLE analytics_events ADD COLUMN section_id TEXT;       -- id-ul <section> pentru scroll depth
ALTER TABLE analytics_events ADD COLUMN utm_source TEXT;
ALTER TABLE analytics_events ADD COLUMN utm_medium TEXT;
ALTER TABLE analytics_events ADD COLUMN utm_campaign TEXT;

-- Extinderi pe `analytics_visitors`
ALTER TABLE analytics_visitors ADD COLUMN country TEXT;
ALTER TABLE analytics_visitors ADD COLUMN city TEXT;
ALTER TABLE analytics_visitors ADD COLUMN device_resolution TEXT;  -- ex: "1920x1080"

-- Indici noi pentru query-uri rapide pe dashboard
CREATE INDEX IF NOT EXISTS idx_event_country ON analytics_events(country);
CREATE INDEX IF NOT EXISTS idx_event_city ON analytics_events(city);
CREATE INDEX IF NOT EXISTS idx_event_utm_source ON analytics_events(utm_source);
CREATE INDEX IF NOT EXISTS idx_visitor_country ON analytics_visitors(country);
