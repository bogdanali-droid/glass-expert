-- Glass Expert CRM — D1 SQLite Schema
-- Binding: DB (glas-expert-crm)
-- Rulează în: Cloudflare Dashboard > D1 > glas-expert-crm > Console

-- Clienți
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cod TEXT UNIQUE NOT NULL,
    alias TEXT NOT NULL,
    company TEXT NOT NULL,
    type TEXT DEFAULT 'Altul',
    country TEXT DEFAULT 'România',
    city TEXT DEFAULT '',
    vat_code TEXT DEFAULT '',
    opportunity REAL DEFAULT 0,
    stage TEXT DEFAULT 'prospect',
    products TEXT DEFAULT '[]',
    priority TEXT DEFAULT 'normal',
    source TEXT DEFAULT 'Altul',
    tags TEXT DEFAULT '[]',
    intel TEXT DEFAULT '',
    pipedrive_id TEXT DEFAULT NULL,
    winmentor_code TEXT DEFAULT NULL,
    created_at TEXT NOT NULL,
    last_activity TEXT DEFAULT NULL,
    updated_at TEXT DEFAULT NULL
);

-- Contacte (multiple per client)
CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT '',
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    is_primary INTEGER DEFAULT 0,
    created_at TEXT DEFAULT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Note activitate
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    note_date TEXT NOT NULL,
    created_at TEXT DEFAULT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Tasks follow-up
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    due_date TEXT DEFAULT NULL,
    done INTEGER DEFAULT 0,
    created_at TEXT DEFAULT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Oferte
CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cod TEXT UNIQUE NOT NULL,
    client_id INTEGER DEFAULT NULL,
    client_cod TEXT DEFAULT '',
    client_alias TEXT DEFAULT '',
    date_created TEXT NOT NULL,
    valid_days INTEGER DEFAULT 30,
    status TEXT DEFAULT 'draft',
    lines TEXT DEFAULT '[]',
    discount REAL DEFAULT 0,
    subtotal REAL DEFAULT 0,
    tva REAL DEFAULT 0,
    total REAL DEFAULT 0,
    notes TEXT DEFAULT '',
    created_at TEXT DEFAULT NULL,
    updated_at TEXT DEFAULT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Comenzi
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cod TEXT UNIQUE NOT NULL,
    client_id INTEGER DEFAULT NULL,
    client_cod TEXT DEFAULT '',
    client_alias TEXT DEFAULT '',
    quote_cod TEXT DEFAULT NULL,
    date_created TEXT NOT NULL,
    date_delivery TEXT DEFAULT NULL,
    stage TEXT DEFAULT 'nou',
    lot_fabrica TEXT DEFAULT NULL,
    lines TEXT DEFAULT '[]',
    discount REAL DEFAULT 0,
    subtotal REAL DEFAULT 0,
    tva REAL DEFAULT 0,
    total REAL DEFAULT 0,
    priority TEXT DEFAULT 'normal',
    notes TEXT DEFAULT '',
    notes_interne TEXT DEFAULT '',
    created_at TEXT DEFAULT NULL,
    updated_at TEXT DEFAULT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Secvențe auto-increment custom (pentru coduri GE-XXX, OF-XXX, CMD-XXX)
CREATE TABLE IF NOT EXISTS sequences (
    name TEXT PRIMARY KEY,
    value INTEGER DEFAULT 0
);
INSERT OR IGNORE INTO sequences (name, value) VALUES ('clients', 0);
INSERT OR IGNORE INTO sequences (name, value) VALUES ('quotes', 0);
INSERT OR IGNORE INTO sequences (name, value) VALUES ('orders', 0);
INSERT OR IGNORE INTO sequences (name, value) VALUES ('lots', 0);
