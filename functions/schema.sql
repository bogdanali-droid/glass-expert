-- VAGOTECH Analytics Database Schema
-- Run this SQL in Cloudflare D1 to initialize tables

CREATE TABLE IF NOT EXISTS vagotech_visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_id TEXT UNIQUE NOT NULL,
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

CREATE TABLE IF NOT EXISTS vagotech_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_id TEXT NOT NULL,
    event_type TEXT NOT NULL,  -- page_view, product_click, form_submit, page_exit
    product_name TEXT,  -- e.g., "Windshield Glass", "Side Panel Glass"
    page_path TEXT,  -- /vagotech.html, /admin/vagotech-analytics.html
    duration_seconds INTEGER,  -- time spent on page
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    device_type TEXT,
    referrer TEXT,
    FOREIGN KEY (visitor_id) REFERENCES vagotech_visitors(visitor_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vagotech_product_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL UNIQUE,
    total_clicks INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    last_clicked DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vagotech_page_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_path TEXT NOT NULL UNIQUE,
    total_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    avg_duration_seconds INTEGER DEFAULT 0,
    bounce_rate REAL DEFAULT 0.0,  -- 0.0 to 1.0
    last_visited DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_visitor_id ON vagotech_visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_event_visitor ON vagotech_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_event_timestamp ON vagotech_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_event_type ON vagotech_events(event_type);
CREATE INDEX IF NOT EXISTS idx_product_name ON vagotech_product_metrics(product_name);
