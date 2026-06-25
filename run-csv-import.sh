#!/usr/bin/env bash
# Glas Expert CRM — Import CSV (Email PST 2024) in D1.
# PRECONDITIE: export CLOUDFLARE_API_TOKEN=...  (permisiune Account > D1 > Edit)
# Genereaza intai SQL-ul cu: python3 migrate_csv_clients.py
# Autor: @lucian
set -euo pipefail
cd "$(dirname "$0")"

DB="glas-expert-crm"
DBID="c3af7e2d-326e-4f05-9b74-92fc42cd0241"
DIR="sql_csv_import"

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ] && [ -z "${CLOUDFLARE_API_KEY:-}" ]; then
  echo "EROARE: seteaza CLOUDFLARE_API_TOKEN inainte de a rula."
  exit 1
fi

echo "==> [0/4] Snapshot emailuri+coduri existente (pt raport exact + re-generare)..."
npx wrangler d1 execute "$DB" --remote --json \
  --command="SELECT id, cod, email, products, intel, city, phone, created_at FROM clients" \
  > existing_clients_raw.json || true
# extrage doar array-ul de results (wrangler intoarce [{results:[...]}])
python3 - <<'PY'
import json
try:
    raw = json.load(open('existing_clients_raw.json'))
    res = raw[0]['results'] if isinstance(raw, list) else raw.get('results', [])
    json.dump(res, open('existing_clients.json','w'), ensure_ascii=False)
    print(f'    snapshot: {len(res)} clienti existenti -> existing_clients.json')
except Exception as e:
    print(f'    (fara snapshot: {e}) — continui in mod idempotent')
PY

echo "==> [0b] Re-generez SQL cu snapshot (matching exact)..."
python3 migrate_csv_clients.py

echo "==> [1/4] ALTER TABLE (campuri noi). Erorile 'duplicate column' sunt benigne."
while IFS= read -r line; do
  [[ "$line" =~ ^ALTER ]] || continue
  echo "    $line"
  npx wrangler d1 execute "$DB" --remote --command="$line" || echo "    (skip: probabil exista deja)"
done < "$DIR/00_alter.sql"

echo "==> [2/4] Secventa curenta GE inainte de import:"
npx wrangler d1 execute "$DB" --remote --command="SELECT value FROM sequences WHERE name='clients';"

echo "==> [3/4] Rulez batch-urile (UPDATE matching + INSERT clienti noi)..."
n=0
for f in $(ls "$DIR"/batch_*.sql | sort); do
  n=$((n+1))
  echo "    -> $f"
  npx wrangler d1 execute "$DB" --remote --file="$f"
done
echo "    $n batch-uri rulate."

echo "==> [4/4] Verificare finala:"
npx wrangler d1 execute "$DB" --remote --command="\
SELECT COUNT(*) AS total_clienti FROM clients; \
SELECT COUNT(*) AS total_contacte FROM contacts; \
SELECT value AS seq_clients FROM sequences WHERE name='clients'; \
SELECT COUNT(*) AS clienti_csv2 FROM clients WHERE tags LIKE '%csv-2024%'; \
SELECT COUNT(*) AS cu_inquiry FROM clients WHERE inquiry_count > 0;"

echo "==> GATA. Import CSV complet in D1 $DB ($DBID)."
