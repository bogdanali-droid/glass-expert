#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Glas Expert CRM — Import clienti din CSV (Email PST 2024) in D1.
Sursa: 392a92c9-clienti_FINAL.csv (1198 randuri, UTF-8 BOM, separator ',').

Strategie:
  - matching pe EMAIL exact fata de clientii existenti in D1
  - match  -> UPDATE (completeaza campuri goale, merge produse, append intel, +contact)
  - no match -> INSERT client nou (cod GE secvential de la START_COD)
Output: batch-uri SQL in /home/user/glass-expert/sql_csv_import/ (50 statements/fisier)

IMPORTANT despre execuție:
  Scriptul are 2 moduri.
  (A) OFFLINE (default): genereaza SQL idempotent (UPDATE/INSERT OR IGNORE) folosind
      un snapshot al emailurilor + cod existente exportat din D1 in existing_clients.json.
      Daca snapshot-ul lipseste, presupune ca TOATE randurile sunt clienti noi
      (sigur datorita INSERT OR IGNORE + UPDATE pe email — vezi mai jos).
  (B) Snapshot-aware: daca existing_clients.json exista (export din D1), face matching
      real local => stie exact ce e UPDATE si ce e INSERT, deci raportul e exact.

  SQL-ul generat e construit sa fie SIGUR indiferent de mod:
    - pt fiecare rand emitem ÎNTÂI un UPDATE ... WHERE email = ? (afecteaza 0 randuri daca
      clientul nu exista — no-op) SI un INSERT OR IGNORE (ignorat daca emailul/codul exista).
    => ruleaza idempotent; nu dubleaza, nu suprascrie clienti existenti gresit.

Autor: @lucian
"""
import csv
import json
import os
import re
import html
from datetime import datetime

SRC = '/root/.claude/uploads/c70e5cd9-b2fe-5f0c-a264-37f76f09169e/392a92c9-clienti_FINAL.csv'
OUT_DIR = '/home/user/glass-expert/sql_csv_import'
SNAPSHOT = '/home/user/glass-expert/existing_clients.json'  # optional export din D1
REPORT = os.path.join(OUT_DIR, '_report.json')

BATCH_SIZE = 50                  # statements per fisier SQL (cerut de task)
START_COD = 7636                 # primul cod client NOU (task: secventa curenta GE = 7635)
NOW = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
IMPORT_TAG = 'csv-2024'
IMPORT_SOURCE = 'Email PST 2024'

# ---------------------------------------------------------------------------
# Mapare produse CSV -> nomenclator CRM (EVOPRINT/EVOLAM/EVOLAM SMART/EVODUR/
# EVOCLEAN/VERSATIKA). Cheile sunt NORMALIZATE (lower, fara spatii in jurul lui '/').
# ---------------------------------------------------------------------------
def norm_prod_key(s):
    s = (s or '').strip().lower()
    s = re.sub(r'\s*/\s*', '/', s)        # "a / b" -> "a/b"
    s = re.sub(r'\s+', ' ', s).strip()
    return s

# valoare None = ignora explicit (nu e in nomenclator)
PRODUCT_MAP = {
    # din task
    'sticla decorativa/oglinzi': 'EVOPRINT',
    'cabine dus/baie': 'EVOLAM',
    'mobilier sticla/rafturi': 'EVOLAM',
    'sticla securizata/securit': 'EVODUR',
    'geamuri termopan/pvc': None,
    'vitrine/usi sticla': 'VERSATIKA',
    'sticla auto': None,
    'sticla rezistenta la foc': 'EVODUR',
    'sticla laminata': 'EVOLAM',
    'sticla smart': 'EVOLAM SMART',
    'sticla antibacteriana': 'EVOCLEAN',
    # variante reale gasite in CSV, nementionate in task (decizie @lucian, vezi raport)
    'sticla decorativa': 'EVOPRINT',
    'fatade si balustrade sticla': 'EVODUR',
    'usi din sticla': 'VERSATIKA',
    'usa sticla': 'VERSATIKA',
    'usa glisanta din sticla': 'VERSATIKA',
    'usa glisanta sticla': 'VERSATIKA',
    'sticla lowe': None,
    'sticla curbata': None,
    'sticla float': None,
}

# diacritice -> ascii pentru robustetea cheii de mapare
DIAC = str.maketrans({'ă':'a','â':'a','î':'i','ș':'s','ş':'s','ț':'t','ţ':'t',
                      'Ă':'a','Â':'a','Î':'i','Ș':'s','Ş':'s','Ț':'t','Ţ':'t'})

def map_products(produse_raw):
    """'A / B; C / D' -> lista deduplicata de produse CRM (ordine stabila)."""
    out, seen, unmapped = [], set(), []
    for tok in (produse_raw or '').split(';'):
        tok = tok.strip()
        if not tok:
            continue
        key = norm_prod_key(tok.translate(DIAC))
        if key in PRODUCT_MAP:
            crm = PRODUCT_MAP[key]
            if crm and crm not in seen:
                seen.add(crm)
                out.append(crm)
        else:
            unmapped.append(tok)
    return out, unmapped

# ---------------------------------------------------------------------------
# Helpers curatare / SQL
# ---------------------------------------------------------------------------
def clean(v):
    if v is None:
        return ''
    s = html.unescape(str(v))
    s = s.replace('\r', ' ').replace('\n', ' ')
    s = re.sub(r'\s+', ' ', s).strip()
    if s.lower() in ('nan', 'none', 'nat', 'null'):
        return ''
    return s

def q(v):
    """Literal SQL string, escape apostrof."""
    return "'" + clean(v).replace("'", "''") + "'"

def q_raw(s):
    if s is None or s == '':
        return "''"
    return "'" + str(s).replace("'", "''") + "'"

def norm_email(v):
    e = clean(v).lower()
    return e if '@' in e and '.' in e else ''

def norm_phone(v):
    c = clean(v)
    c = re.sub(r'[^\d+ ]', '', c).strip()
    return c if len(re.sub(r'\D', '', c)) >= 6 else ''

def parse_date(v):
    """'2024-04-18 10:55' -> '2024-04-18T10:55:00Z' (ISO)."""
    s = clean(v)
    for fmt in ('%Y-%m-%d %H:%M:%S', '%Y-%m-%d %H:%M', '%Y-%m-%d'):
        try:
            return datetime.strptime(s, fmt).strftime('%Y-%m-%dT%H:%M:%SZ')
        except ValueError:
            continue
    return ''

def to_int(v, default=0):
    try:
        return int(float(clean(v)))
    except (ValueError, TypeError):
        return default

def map_stage(status):
    s = clean(status).lower()
    if s in ('', 'nou', 'new'):
        return 'prospect'
    mapping = {'prospect': 'prospect', 'calificat': 'calificat',
               'oferta': 'oferta', 'ofertă': 'oferta', 'comanda': 'comanda',
               'comandă': 'comanda'}
    return mapping.get(s, 'prospect')

def alias_for(company, num):
    first = ''
    for ch in clean(company):
        if ch.isalnum():
            first = ch.upper()
            break
    return (first or 'X') + '-' + f'{num:03d}'

# ---------------------------------------------------------------------------
# Snapshot D1 (optional) — map email -> {id, cod, products, intel, city, phone, created_at}
# Format asteptat: lista de obiecte cu acele chei (export simplu din D1).
# ---------------------------------------------------------------------------
def load_snapshot():
    if not os.path.exists(SNAPSHOT):
        return None
    try:
        with open(SNAPSHOT, encoding='utf-8') as f:
            data = json.load(f)
        rows = data.get('results', data) if isinstance(data, dict) else data
        idx = {}
        for r in rows:
            em = norm_email(r.get('email', ''))
            if em:
                idx[em] = r
        return idx
    except Exception as e:
        print(f'! Snapshot ilizibil ({e}); continui fara matching exact.')
        return None

# ---------------------------------------------------------------------------
# SQL builders
# ---------------------------------------------------------------------------
def build_update(row, snap_row):
    """
    UPDATE pe client existent (matching email). Completeaza doar campuri goale,
    merge produse (JSON), append intel, +contact daca lipseste.
    Daca avem snapshot -> calcul exact local. Fara snapshot -> SQL care foloseste
    COALESCE/NULLIF si subquery pe coloana existenta (merge produse in SQL).
    Returneaza lista de statements (UPDATE clients + eventual INSERT contact).
    """
    email = norm_email(row['email'])
    city = clean(row['zona_interes'])
    phone = norm_phone(row['telefon'])
    inquiry = to_int(row['nr_cereri'])
    last_subject = clean(row['ultim_subiect'])
    email_source = clean(row['sursa'])
    products_csv, _ = map_products(row['produse'])
    obs = clean(row['observatii'])
    intel_add = f"CSV Import 2024: {obs}".rstrip(': ')
    if last_subject:
        intel_add += f" | Subiect: {last_subject}"
    created_csv = parse_date(row['data_prima_cerere'])
    contact_name = clean(row['nume'])

    stmts = []

    if snap_row is not None:
        # ----- matching EXACT (avem datele clientului) -----
        existing_products = []
        try:
            existing_products = json.loads(snap_row.get('products') or '[]')
            if not isinstance(existing_products, list):
                existing_products = []
        except Exception:
            existing_products = []
        merged = existing_products[:]
        for p in products_csv:
            if p not in merged:
                merged.append(p)
        products_json = json.dumps(merged, ensure_ascii=False)

        old_intel = (snap_row.get('intel') or '').strip()
        new_intel = (old_intel + (' || ' if old_intel else '') + intel_add).strip()

        old_city = clean(snap_row.get('city'))
        old_phone = clean(snap_row.get('phone'))
        old_created = clean(snap_row.get('created_at'))

        set_city = q(city) if (not old_city and city) else 'city'
        set_phone = q(phone) if (not old_phone and phone) else 'phone'
        # created_at: pastreaza cea mai veche
        set_created = 'created_at'
        if created_csv and (not old_created or created_csv < old_created):
            set_created = q(created_csv)

        stmts.append(
            "UPDATE clients SET "
            f"city = {set_city}, "
            f"phone = {set_phone}, "
            f"inquiry_count = {inquiry}, "
            f"last_subject = {q(last_subject)}, "
            f"email_source = {q(email_source)}, "
            f"products = {q_raw(products_json)}, "
            f"intel = {q_raw(new_intel)}, "
            f"created_at = {set_created}, "
            f"last_activity = {q(created_csv or NOW)}, "
            f"updated_at = {q(NOW)} "
            f"WHERE email = {q(email)};"
        )
        client_id = snap_row.get('id')
        if contact_name and client_id is not None:
            stmts.append(
                "INSERT INTO contacts (client_id, name, role, email, phone, is_primary, created_at) "
                f"SELECT {int(client_id)}, {q(contact_name)}, '', {q(email)}, {q(phone)}, 0, {q(NOW)} "
                f"WHERE NOT EXISTS (SELECT 1 FROM contacts WHERE client_id = {int(client_id)} AND email = {q(email)});"
            )
    else:
        # ----- fara snapshot: SQL robust care merge produsele in DB -----
        # merge produse: doar adauga cele care lipsesc din JSON-ul existent (LIKE check)
        prod_clause = 'products'
        for p in products_csv:
            needle = q_raw('"' + p + '"')
            # daca produsul lipseste, il inseram inainte de ']' final
            prod_clause = (
                "CASE WHEN products LIKE '%' || " + needle + " || '%' "
                "THEN " + prod_clause + " "
                "ELSE json_insert(" + prod_clause + ", '$[#]', " + q_raw(p) + ") END"
            )
        stmts.append(
            "UPDATE clients SET "
            f"city = CASE WHEN city IS NULL OR city = '' THEN {q(city)} ELSE city END, "
            f"phone = CASE WHEN phone IS NULL OR phone = '' THEN {q(phone)} ELSE phone END, "
            f"inquiry_count = {inquiry}, "
            f"last_subject = {q(last_subject)}, "
            f"email_source = {q(email_source)}, "
            f"products = {prod_clause}, "
            f"intel = TRIM(COALESCE(NULLIF(intel,''),'') || "
            f"CASE WHEN intel IS NULL OR intel = '' THEN '' ELSE ' || ' END || {q_raw(intel_add)}), "
            f"created_at = CASE WHEN created_at IS NULL OR created_at = '' OR created_at > {q(created_csv or NOW)} "
            f"THEN {q(created_csv or NOW)} ELSE created_at END, "
            f"last_activity = {q(created_csv or NOW)}, "
            f"updated_at = {q(NOW)} "
            f"WHERE email = {q(email)};"
        )
        if contact_name:
            stmts.append(
                "INSERT INTO contacts (client_id, name, role, email, phone, is_primary, created_at) "
                f"SELECT c.id, {q(contact_name)}, '', {q(email)}, {q(phone)}, 0, {q(NOW)} "
                f"FROM clients c WHERE c.email = {q(email)} "
                f"AND NOT EXISTS (SELECT 1 FROM contacts ct WHERE ct.client_id = c.id AND ct.email = {q(email)});"
            )
    return stmts

def build_insert(row, cod):
    email = norm_email(row['email'])
    company = clean(row['firma']) or clean(row['nume']) or '(necunoscut)'
    num = int(cod.split('-')[1])
    alias = alias_for(company, num)
    city = clean(row['zona_interes'])
    phone = norm_phone(row['telefon'])
    inquiry = to_int(row['nr_cereri'])
    last_subject = clean(row['ultim_subiect'])
    email_source = clean(row['sursa'])
    products_csv, _ = map_products(row['produse'])
    products_json = json.dumps(products_csv, ensure_ascii=False)
    obs = clean(row['observatii'])
    intel = f"CSV Import 2024: {obs}".rstrip(': ')
    if last_subject:
        intel += f" | Subiect: {last_subject}"
    created = parse_date(row['data_prima_cerere']) or NOW
    stage = map_stage(row['status'])
    contact_name = clean(row['nume'])
    tags_json = json.dumps([IMPORT_TAG, '2024'], ensure_ascii=False)

    stmts = []
    # INSERT conditionat de inexistenta EMAILului (coloana email NU e UNIQUE in D1,
    # deci OR IGNORE pe cod nu ar opri un duplicat cand emailul exista sub alt cod).
    # In modul snapshot stim deja ca e client nou, dar pastram garda si aici => idempotent.
    stmts.append(
        "INSERT OR IGNORE INTO clients "
        "(cod, alias, company, type, country, city, vat_code, opportunity, stage, products, "
        "priority, source, tags, intel, inquiry_count, last_subject, email_source, "
        "products_ordered, margin_class, created_at, last_activity, updated_at, email, phone) "
        f"SELECT {q(cod)}, {q(alias)}, {q(company)}, 'Altul', 'România', {q(city)}, '', 0, {q(stage)}, "
        f"{q_raw(products_json)}, 'normal', {q(IMPORT_SOURCE)}, {q_raw(tags_json)}, {q_raw(intel)}, "
        f"{inquiry}, {q(last_subject)}, {q(email_source)}, '[]', '', "
        f"{q(created)}, {q(created)}, {q(NOW)}, {q(email)}, {q(phone)} "
        f"WHERE NOT EXISTS (SELECT 1 FROM clients WHERE email = {q(email)});"
    )
    if contact_name:
        stmts.append(
            "INSERT INTO contacts (client_id, name, role, email, phone, is_primary, created_at) "
            f"SELECT id, {q(contact_name)}, '', {q(email)}, {q(phone)}, 1, {q(NOW)} "
            f"FROM clients WHERE cod = {q(cod)} "
            f"AND NOT EXISTS (SELECT 1 FROM contacts WHERE client_id = (SELECT id FROM clients WHERE cod = {q(cod)}));"
        )
    return stmts

# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------
def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for f in os.listdir(OUT_DIR):
        if f.startswith('batch_') and f.endswith('.sql'):
            os.remove(os.path.join(OUT_DIR, f))

    with open(SRC, encoding='utf-8-sig') as f:
        rows = list(csv.DictReader(f))

    snapshot = load_snapshot()
    snap_mode = snapshot is not None

    update_stmts, insert_stmts = [], []
    n_update = n_insert = 0
    new_cod = START_COD
    unmapped_counter = {}
    seen_emails = set()
    dupe_in_csv = 0

    for row in rows:
        email = norm_email(row['email'])
        if not email:
            continue
        if email in seen_emails:
            dupe_in_csv += 1
            continue
        seen_emails.add(email)

        # colecteaza produse nemapate pt raport
        _, unmapped = map_products(row['produse'])
        for u in unmapped:
            unmapped_counter[u] = unmapped_counter.get(u, 0) + 1

        is_existing = snap_mode and email in snapshot
        if is_existing:
            update_stmts.extend(build_update(row, snapshot[email]))
            n_update += 1
        elif snap_mode:
            # snapshot exista, email lipseste => client NOU
            insert_stmts.extend(build_insert(row, f'GE-{new_cod:04d}'))
            new_cod += 1
            n_insert += 1
        else:
            # FARA snapshot: emit AMBELE (UPDATE no-op daca nu exista + INSERT OR IGNORE)
            update_stmts.extend(build_update(row, None))
            insert_stmts.extend(build_insert(row, f'GE-{new_cod:04d}'))
            new_cod += 1

    max_cod = new_cod - 1
    # ALTER-uri (idempotente prin rulare separata; D1 nu suporta IF NOT EXISTS pe ADD COLUMN,
    # asa ca le punem intr-un fisier separat care poate esua benign daca exista deja).
    alter_stmts = [
        "ALTER TABLE clients ADD COLUMN inquiry_count INTEGER DEFAULT 0;",
        "ALTER TABLE clients ADD COLUMN last_subject TEXT DEFAULT '';",
        "ALTER TABLE clients ADD COLUMN email_source TEXT DEFAULT '';",
        "ALTER TABLE clients ADD COLUMN products_ordered TEXT DEFAULT '[]';",
        "ALTER TABLE clients ADD COLUMN margin_class TEXT DEFAULT '';",
    ]
    seq_stmt = [
        f"UPDATE sequences SET value = {max_cod} WHERE name = 'clients' AND value < {max_cod};"
    ]

    # ordine de executie: UPDATE-uri intai (matching), apoi INSERT-uri (clienti noi)
    body = update_stmts + insert_stmts + seq_stmt

    # scrie ALTER separat
    with open(os.path.join(OUT_DIR, '00_alter.sql'), 'w', encoding='utf-8') as fh:
        fh.write('-- ALTER TABLE: campuri noi. Ruleaza o singura data.\n')
        fh.write('-- D1 nu suporta IF NOT EXISTS la ADD COLUMN; daca o coloana exista deja,\n')
        fh.write('-- comanda respectiva da eroare benigna — ignora si continua.\n')
        fh.write('\n'.join(alter_stmts) + '\n')

    # batch-uri body
    batch_files = []
    for i in range(0, len(body), BATCH_SIZE):
        chunk = body[i:i + BATCH_SIZE]
        bf = os.path.join(OUT_DIR, f'batch_{i // BATCH_SIZE:03d}.sql')
        with open(bf, 'w', encoding='utf-8') as fh:
            fh.write('\n'.join(chunk) + '\n')
        batch_files.append(os.path.basename(bf))

    report = {
        'mode': 'snapshot-exact' if snap_mode else 'offline-idempotent',
        'csv_rows': len(rows),
        'distinct_emails': len(seen_emails),
        'dupe_emails_skipped': dupe_in_csv,
        'matched_update': n_update if snap_mode else 'unknown (no snapshot)',
        'new_insert': n_insert if snap_mode else f'<= {len(seen_emails)} (INSERT OR IGNORE)',
        'start_cod': f'GE-{START_COD:04d}',
        'max_cod_generated': f'GE-{max_cod:04d}',
        'update_statements': len(update_stmts),
        'insert_statements': len(insert_stmts),
        'total_statements': len(body),
        'batch_files': len(batch_files),
        'unmapped_products': unmapped_counter,
    }
    with open(REPORT, 'w', encoding='utf-8') as fh:
        json.dump(report, fh, indent=2, ensure_ascii=False)

    print(json.dumps(report, indent=2, ensure_ascii=False))

if __name__ == '__main__':
    main()
