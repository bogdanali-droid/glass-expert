-- VAGOGLASS Media Library schema
-- Run with: wrangler d1 execute vagotech_analytics --file=functions/migrate-media.sql

CREATE TABLE IF NOT EXISTS media_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT UNIQUE NOT NULL, -- e.g. trains/desiro-cfr.jpg
  category TEXT NOT NULL, -- trains | logos | certifications | products | other
  original_name TEXT,
  size_bytes INTEGER,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  alt_text_ro TEXT,
  alt_text_en TEXT,
  used_in_pages TEXT, -- JSON array
  uploaded_by TEXT,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  replaced_at DATETIME,
  deleted BOOLEAN DEFAULT 0,
  deleted_at DATETIME
);

CREATE INDEX IF NOT EXISTS idx_media_category ON media_files(category);
CREATE INDEX IF NOT EXISTS idx_media_filename ON media_files(filename);
