-- Site-wide Analytics Database Schema (Glass Expert + VAGOTECH consolidated)
-- Run this SQL in Cloudflare D1 to initialize tables on a FRESH database.
-- For an existing vagotech_* database, run migrate.sql instead.
--
-- Segmentation: every row carries a `segment` column.
--   segment = 'glassexpert' -> all Glass Expert USA pages
--   segment = 'vagotech'    -> vagotech.html

CREATE TABLE IF NOT EXISTS analytics_visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_id TEXT UNIQUE NOT NULL,
    segment TEXT NOT NULL DEFAULT 'glassexpert',  -- glassexpert | vagotech
    first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_visits INTEGER DEFAULT 1,
    pages_visited TEXT,  -- JSON array of page names
    device_type TEXT,  -- mobile, tablet, desktop
    browser TEXT,
    referrer TEXT,
    consent_given BOOLEAN DEFAULT 0,
    consent_given_at DATETIME,
    deleted BOOLEAN DEFAULT 0,
    deleted_at DATETIME,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_id TEXT NOT NULL,
    segment TEXT NOT NULL DEFAULT 'glassexpert',  -- glassexpert | vagotech
    event_type TEXT NOT NULL,  -- page_view, product_click, form_submit, page_exit
    product_name TEXT,  -- e.g., "VERSATIKA", "EVOLAM"
    page_path TEXT,  -- /index.html, /vagotech.html
    duration_seconds INTEGER,  -- time spent on page
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    device_type TEXT,
    referrer TEXT,
    FOREIGN KEY (visitor_id) REFERENCES analytics_visitors(visitor_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS analytics_product_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    segment TEXT NOT NULL DEFAULT 'glassexpert',
    product_name TEXT NOT NULL,
    total_clicks INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    last_clicked DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(segment, product_name)
);

CREATE TABLE IF NOT EXISTS analytics_page_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    segment TEXT NOT NULL DEFAULT 'glassexpert',
    page_path TEXT NOT NULL,
    total_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    avg_duration_seconds INTEGER DEFAULT 0,
    bounce_rate REAL DEFAULT 0.0,  -- 0.0 to 1.0
    last_visited DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(segment, page_path)
);

-- Contact form / quote request leads (captured by /api/contact)
CREATE TABLE IF NOT EXISTS contact_leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    phone TEXT,
    segment TEXT,            -- commercial | hospitality | healthcare | education | other
    budget TEXT,             -- 30-50k | 50-100k | 100-300k | 300k+
    message TEXT,
    status TEXT DEFAULT 'new',       -- new | contacted | qualified | won | lost
    email_sent BOOLEAN DEFAULT 0,    -- 1 once the office notification email was delivered
    source TEXT DEFAULT 'website',
    user_agent TEXT,
    ip_country TEXT,         -- from CF-IPCountry header
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_lead_status ON contact_leads(status);
CREATE INDEX IF NOT EXISTS idx_lead_created ON contact_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_visitor_id ON analytics_visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_segment ON analytics_visitors(segment);
CREATE INDEX IF NOT EXISTS idx_event_visitor ON analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_event_segment ON analytics_events(segment);
CREATE INDEX IF NOT EXISTS idx_event_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_product_segment ON analytics_product_metrics(segment, product_name);
CREATE INDEX IF NOT EXISTS idx_page_segment ON analytics_page_metrics(segment, page_path);
