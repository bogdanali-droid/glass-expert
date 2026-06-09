-- Newsletter module schema for VAGOGLASS
-- Run via: wrangler d1 execute vagotech_analytics --file=functions/migrate-newsletter.sql --remote
-- Binding: VAGOTECH_DB

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  company TEXT,
  segment_interest TEXT, -- 'tren' | 'tramvai' | 'metrou' | 'all'
  language TEXT DEFAULT 'ro', -- ro | en
  source TEXT, -- 'homepage' | 'whitepaper' | 'footer'
  consent_marketing BOOLEAN DEFAULT 1,
  confirmed BOOLEAN DEFAULT 0, -- double opt-in
  confirm_token TEXT UNIQUE,
  unsubscribe_token TEXT UNIQUE,
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  confirmed_at DATETIME,
  unsubscribed_at DATETIME,
  last_email_sent_at DATETIME
);

CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  segment_filter TEXT, -- 'tren' | 'tramvai' | 'metrou' | 'all'
  language TEXT DEFAULT 'ro',
  sent_at DATETIME,
  sent_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_confirmed ON newsletter_subscribers(confirmed);
CREATE INDEX IF NOT EXISTS idx_newsletter_segment ON newsletter_subscribers(segment_interest);
CREATE INDEX IF NOT EXISTS idx_newsletter_confirm_token ON newsletter_subscribers(confirm_token);
CREATE INDEX IF NOT EXISTS idx_newsletter_unsubscribe_token ON newsletter_subscribers(unsubscribe_token);
CREATE INDEX IF NOT EXISTS idx_campaigns_sent_at ON newsletter_campaigns(sent_at);
