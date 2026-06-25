#!/usr/bin/env python3
"""
Glas Expert CRM — Migrare clienti vechi (2012-2014) din Excel in D1.
Sursa: 0470ddd0-merged_tables.xlsx (JOIN companie x contact, 8596 randuri).
Strategie: grupare pe firma -> 1 client unic + N contacte.
Output: migration-import.sql (batch-uri) in /home/user/glass-expert/sql_batches/
Autor: @lucian
"""
import pandas as pd
import html
import re
import os
import json
from datetime import datetime

SRC = '/root/.claude/uploads/c70e5cd9-b2fe-5f0c-a264-37f76f09169e/0470ddd0-merged_tables.xlsx'
OUT_DIR = '/home/user/glass-expert/sql_batches'
SINGLE_FILE = '/home/user/glass-expert/migration-import.sql'
BATCH_SIZE = 400          # clienti per fisier batch (ramane sub limita D1 statement)
NOW = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')

# Orase RO cunoscute pt extragere din 'sediu' (lowercase, fara diacritice)
KNOWN_CITIES = [
    'bucuresti', 'cluj-napoca', 'cluj', 'timisoara', 'iasi', 'constanta',
    'craiova', 'brasov', 'galati', 'ploiesti', 'oradea', 'braila', 'arad',
    'pitesti', 'sibiu', 'bacau', 'targu mures', 'targu-mures', 'baia mare',
    'buzau', 'botosani', 'satu mare', 'ramnicu valcea', 'suceava', 'piatra neamt',
    'drobeta', 'focsani', 'targoviste', 'tulcea', 'resita', 'slatina', 'bistrita',
    'calarasi', 'giurgiu', 'deva', 'hunedoara', 'zalau', 'sfantu gheorghe',
    'alba iulia', 'vaslui', 'slobozia', 'turda', 'medias', 'voluntari',
    'magurele', 'domnesti', 'otopeni', 'popesti', 'mogosoaia', 'chiajna',
    'sinaia', 'mamaia', 'snagov', 'corbeanca', 'bragadiru', 'pantelimon',
    'berlin', 'munich', 'munchen', 'wien', 'viena', 'paris', 'london', 'milano',
]

def clean(v):
    """Curata o valoare: html.unescape, strip, trateaza junk/NaN."""
    if v is None:
        return ''
    s = str(v).strip()
    if s.lower() in ('nan', 'none', 'nat', '000', ''):
        return ''
    s = html.unescape(s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s

def sql_str(v):
    """Escape pentru SQL literal."""
    s = clean(v)
    return "'" + s.replace("'", "''") + "'"

def sql_raw(s):
    if s is None or s == '':
        return "''"
    return "'" + str(s).replace("'", "''") + "'"

def pick_email(*vals):
    for v in vals:
        c = clean(v)
        if c and '@' in c and '.' in c:
            return c.lower()
    return ''

def pick_phone(*vals):
    for v in vals:
        c = clean(v)
        # normalizare minimala telefon
        c = re.sub(r'[^\d+ ]', '', c).strip()
        if c and len(re.sub(r'\D', '', c)) >= 6:
            return c
    return ''

def extract_city(sediu):
    c = clean(sediu).lower()
    if not c:
        return ''
    for city in KNOWN_CITIES:
        if re.search(r'\b' + re.escape(city) + r'\b', c):
            # capitalize nice
            return city.title().replace('Cluj', 'Cluj-Napoca') if city == 'cluj' else city.title()
    return ''

def map_priority(imp):
    """importanta 1-5 -> priority string."""
    try:
        n = int(float(imp))
    except (ValueError, TypeError):
        return 'normal'
    if n >= 5:
        return 'urgent'
    if n == 4:
        return 'high'
    if n <= 1:
        return 'low'
    return 'normal'

def norm_firma(name):
    """Cheie de grupare: lowercase + collapse spaces."""
    return clean(name).lower()

# ---------- LOAD ----------
df = pd.read_excel(SRC)
print(f'Loaded {len(df)} rows')

# elimina randul junk firma == 000
df['_firma_clean'] = df['firma'].apply(clean)
df = df[df['_firma_clean'] != ''].copy()
df['_key'] = df['firma'].apply(norm_firma)
print(f'After junk removal: {len(df)} rows, {df["_key"].nunique()} distinct firms')

# ---------- GROUP BY FIRMA ----------
clients = []      # list of dict
contacts = []     # list of dict (client_idx -> contact)
failed = []

grouped = df.groupby('_key', sort=False)
code_n = 0

for key, g in grouped:
    code_n += 1
    cod = f'GE-{code_n:03d}'
    # nume companie: prefera 'denumire' (legal) daca exista, altfel 'firma'
    firma_display = clean(g['firma'].iloc[0])
    denumire = ''
    for d in g['denumire']:
        if clean(d):
            denumire = clean(d)
            break
    company = denumire if denumire else firma_display
    if not company:
        failed.append({'key': key, 'reason': 'no company name'})
        code_n -= 1
        continue

    alias = (company[0].upper() if company else 'X') + '-' + f'{code_n:03d}'

    # email/telefon la nivel client = primul valid din grup
    client_email = ''
    client_phone = ''
    for _, r in g.iterrows():
        if not client_email:
            client_email = pick_email(r['email'], r['email.1'])
        if not client_phone:
            client_phone = pick_phone(r['telefon'], r['tel_mob'], r['telefon_fix'])
        if client_email and client_phone:
            break

    # oras din sediu
    city = ''
    for s in g['sediu']:
        city = extract_city(s)
        if city:
            break

    # prioritate = max importanta din grup
    pr = 'normal'
    imps = [map_priority(x) for x in g['importanta']]
    order = {'urgent': 4, 'high': 3, 'normal': 2, 'low': 1}
    pr = max(imps, key=lambda x: order.get(x, 2)) if imps else 'normal'

    # data adaugare cea mai veche
    dd = pd.to_datetime(g['data_adaugare'], errors='coerce').min()
    created = dd.strftime('%Y-%m-%dT%H:%M:%SZ') if pd.notna(dd) else NOW

    # tara: heuristic dupa firma/sediu (DE/GMBH -> Germania)
    country = 'România'
    blob = (firma_display + ' ' + ' '.join(clean(x) for x in g['sediu'])).lower()
    if 'gmbh' in blob or ' de ' in (' ' + firma_display.lower() + ' ') or 'berlin' in blob or 'munich' in blob or 'munchen' in blob or 'wien' in blob:
        country = 'Germania' if ('gmbh' in blob or 'berlin' in blob or 'munich' in blob or 'munchen' in blob) else country

    intel = f'Import legacy (id_client orig: {clean(g["id_client"].iloc[0])}). Adresa: {clean(g["sediu"].iloc[0])[:200]}'

    cidx = len(clients)  # index pt legare contacte
    clients.append({
        'idx': cidx, 'cod': cod, 'alias': alias, 'company': company,
        'country': country, 'city': city, 'email': client_email,
        'phone': client_phone, 'priority': pr, 'created': created,
        'intel': intel,
    })

    # CONTACTE: fiecare rand cu nume valid si != company
    seen_contacts = set()
    primary_set = False
    for _, r in g.iterrows():
        nume = clean(r['nume'])
        if not nume or nume.lower() == company.lower():
            continue
        c_email = pick_email(r['email.1'], r['email'])
        c_phone = pick_phone(r['tel_mob'], r['telefon'], r['telefon_fix'])
        role = clean(r['functie'])
        dedup_key = (nume.lower(), c_email, c_phone)
        if dedup_key in seen_contacts:
            continue
        seen_contacts.add(dedup_key)
        is_primary = 0 if primary_set else 1
        primary_set = True
        contacts.append({
            'cidx': cidx, 'name': nume, 'role': role,
            'email': c_email, 'phone': c_phone, 'is_primary': is_primary,
        })

print(f'Built {len(clients)} clients, {len(contacts)} contacts, {len(failed)} failed')

# ---------- GENERATE SQL ----------
os.makedirs(OUT_DIR, exist_ok=True)
# curata batch-uri vechi
for f in os.listdir(OUT_DIR):
    if f.endswith('.sql'):
        os.remove(os.path.join(OUT_DIR, f))

def client_insert(c):
    return (
        "INSERT INTO clients (cod, alias, company, type, country, city, vat_code, "
        "opportunity, stage, products, priority, source, tags, intel, created_at, last_activity, updated_at) VALUES ("
        f"{sql_raw(c['cod'])}, {sql_raw(c['alias'])}, {sql_raw(c['company'])}, 'Altul', "
        f"{sql_raw(c['country'])}, {sql_raw(c['city'])}, '', 0, 'prospect', '[]', "
        f"{sql_raw(c['priority'])}, 'Import legacy', '[\"legacy\",\"2012-2014\"]', {sql_raw(c['intel'])}, "
        f"{sql_raw(c['created'])}, NULL, {sql_raw(NOW)});"
    )

# Contacte: folosim subquery pe cod client (D1 nu da inapoi last_insert_id usor in batch).
def contact_insert(ct, client_cod):
    return (
        "INSERT INTO contacts (client_id, name, role, email, phone, is_primary, created_at) "
        f"SELECT id, {sql_raw(ct['name'])}, {sql_raw(ct['role'])}, {sql_raw(ct['email'])}, "
        f"{sql_raw(ct['phone'])}, {ct['is_primary']}, {sql_raw(NOW)} FROM clients WHERE cod = {sql_raw(client_cod)};"
    )

# map idx -> cod
idx_to_cod = {c['idx']: c['cod'] for c in clients}

# batch files: clientii intai (toti), apoi contactele
all_stmts = [client_insert(c) for c in clients]
for ct in contacts:
    all_stmts.append(contact_insert(ct, idx_to_cod[ct['cidx']]))

# update sequence clients la final
all_stmts.append(f"UPDATE sequences SET value = {len(clients)} WHERE name = 'clients';")

# scrie batch-uri (statements grupate)
STMTS_PER_BATCH = 450
batch_files = []
for i in range(0, len(all_stmts), STMTS_PER_BATCH):
    chunk = all_stmts[i:i + STMTS_PER_BATCH]
    bf = os.path.join(OUT_DIR, f'batch_{i//STMTS_PER_BATCH:03d}.sql')
    with open(bf, 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(chunk) + '\n')
    batch_files.append(bf)

# scrie si fisier unic (pt referinta / re-rulare locala)
with open(SINGLE_FILE, 'w', encoding='utf-8') as fh:
    fh.write('-- Glas Expert CRM migration import (generat de migrate_clients.py)\n')
    fh.write(f'-- {len(clients)} clienti, {len(contacts)} contacte\n')
    fh.write('\n'.join(all_stmts) + '\n')

print(f'Wrote {len(batch_files)} batch files to {OUT_DIR}')
print(f'Wrote single file {SINGLE_FILE} ({len(all_stmts)} statements)')

# salveaza raport pt parent
report = {
    'total_rows': int(len(pd.read_excel(SRC))),
    'distinct_firms': int(df['_key'].nunique()),
    'clients_built': len(clients),
    'contacts_built': len(contacts),
    'failed': failed[:20],
    'failed_count': len(failed),
    'batch_files': len(batch_files),
    'sample_clients': clients[:5],
}
with open('/home/user/glass-expert/sql_batches/_report.json', 'w') as fh:
    json.dump(report, fh, indent=2, default=str, ensure_ascii=False)
print('REPORT:', json.dumps({k: v for k, v in report.items() if k != 'sample_clients'}, default=str, ensure_ascii=False))
