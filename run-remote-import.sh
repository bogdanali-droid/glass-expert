#!/usr/bin/env bash
# Glas Expert CRM — Import remote in D1 (glas-expert-crm)
# PRECONDITIE: export CLOUDFLARE_API_TOKEN=... (token cu permisiuni D1 Edit)
#              SAU ruleaza fiecare comanda cu --temporary (printeaza claim URL)
# Autor: @lucian
set -euo pipefail
cd "$(dirname "$0")"

DB="glas-expert-crm"
DBID="c3af7e2d-326e-4f05-9b74-92fc42cd0241"

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ] && [ -z "${CLOUDFLARE_API_KEY:-}" ]; then
  echo "EROARE: seteaza CLOUDFLARE_API_TOKEN inainte de a rula."
  echo "        export CLOUDFLARE_API_TOKEN=xxxxx"
  echo "        (token cu permisiunea Account > D1 > Edit pe contul corect)"
  exit 1
fi

echo "==> [1/3] Rulez schema (creeaza tabele daca nu exista)..."
npx wrangler d1 execute "$DB" --remote --file=schema.sql

echo "==> [2/3] Import batch-uri clienti + contacte..."
n=0
for f in $(ls sql_batches/batch_*.sql | sort); do
  n=$((n+1))
  echo "    -> $f"
  npx wrangler d1 execute "$DB" --remote --file="$f"
done
echo "    $n batch-uri rulate."

echo "==> [3/3] Verificare finala..."
npx wrangler d1 execute "$DB" --remote --command="SELECT COUNT(*) AS total_clienti FROM clients; SELECT COUNT(*) AS total_contacte FROM contacts; SELECT cod, alias, company, stage, priority FROM clients ORDER BY id LIMIT 10;"

echo "==> GATA. Import complet in D1 $DB ($DBID)."
