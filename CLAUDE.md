# Glass Expert — Claude Code Guide

> Auto-loaded la fiecare sesiune. Citește ÎNTÂI.

---

## ⚠️ Identitate Repo (citire obligatorie)

**Acest repo NU conține agenți.** Conține **siteurile** pe care le construim
pentru clientul nostru. Toți agenții (@ana, @lucian, @irina, @victoria, @vlad,
@stefan, @adrian, @cosmin, etc.) trăiesc în repo-ul `ai-team` și lucrează AICI
fără să-și dubleze profilurile. Nu crea `agents/`, `shared/protocols/`,
`shared/memory/` aici — protocoalele sunt moștenite din `ai-team/shared/`.

---

## 👥 Clientul: Glass Expert / xglass.eu / VERSATIKA

- **Brand:** xglass.eu (Timișoara + Neubiberg) — producător european de sticlă
  arhitecturală premium, 25+ ani, Top 20 Europa.
- **Produs flagship:** **VERSATIKA** (versatika.com) — sistem ușă flush-to-wall,
  Red Dot Award 2025.
- **US office:** New Jersey · +1‑609‑408‑8100 · office.us@xglass.eu
- **Tagline:** „From Better to Best"
- **Status comercial:** clienți confirmați. Am convenit cu ei să ne implicăm
  în business-ul **VAGOTECH** (linia lor de sticlă pentru railway).

---

## 🎯 Proiecte în acest repo

### 1. Glass Expert USA (xglass.eu — landing USA)
Status: 🟢 LIVE / în polish
- `index.html`, `commercial.html`, `hospitality.html`, `healthcare.html`,
  `education.html`, `products.html`, `projects.html`, `privacy.html`
- CSS: `css/redesign-v2.css` + `css/polish-enhancements.css`
- JS: `js/script.js`
- Deploy: Cloudflare Pages (`wrangler.toml`, `_headers`, `_redirects`)

### 2. VAGOTECH (vertical railway glass)
Status: 🟡 v1 deployed, **next: site dedicat RO**
- `vagotech.html` + `vagotech-presentation.html` (versiune actuală)
- **Next sprint:** site standalone VAGOTECH în **română**, target piața **RO**

### 3. Email + outreach tooling
- `email_campaign_system.py`, `prospect_database.py`, `response_tracking_system.py`
- `email_campaign_tracking.json`, `response_log_phase1.json`

### 4. Admin & Functions
- `admin/` (dashboard intern)
- `functions/` (Cloudflare Workers + D1 — analytics)

---

## 🚀 Următor pas (confirmat cu Bogdan, 02 iunie 2026)

**Site nou VAGOTECH în română, pentru piața RO.**
- Domeniu: TBD (decizie Bogdan)
- Limbă: RO primary
- Target: arhitecți, dezvoltatori, contractori feroviari + producători
  vagoane din România
- Stack: același (HTML/CSS/JS static, Cloudflare Pages)
- Echipa care execută: agenți din `ai-team` (vezi mai jos)

---

## 👥 Echipa care lucrează aici (din ai-team — NU duplica)

Apelezi agenții cu `@nume` exact ca în `ai-team/agents/`:

| Rol pe acest repo | Agent (ai-team) |
|---|---|
| Coordonare | @ana (COO) → escalează la Bogdan |
| Project Management | @stefan, @alina |
| Tech lead + frontend | @lucian, @cosmin |
| Mobile / responsive | @alex |
| Design / UX | @irina, @diana, @marian |
| SEO + copy RO/EN | @elena, @mihai, @andrei |
| Marketing + paid | @victoria, @laura, @george |
| Conținut social | @cristina, @ion |
| Deploy / Cloudflare | @vlad, @cloudflare |
| QA | @adrian, @playwright, @frontend-qa |
| Analytics | @robert |
| Compliance / GDPR | @marius, @sorin |

Pentru pricing/quote business glass: @ioana, @bianca, @emma.

---

## 📋 Reguli (moștenite 1:1 din `ai-team/shared/`)

1. **Limbă:** română primar (termeni tehnici în engleză OK).
2. **Memorie:** agenții scriu în `ai-team/shared/memory/<nume>/active-projects.md`
   despre proiectele de aici. NU creăm `shared/memory/` în acest repo.
3. **Escalation:** P0/P1 → @ana → Bogdan. Vezi `ai-team/shared/escalation-protocol.md`.
4. **Anti-timeout:** scrieri <10KB, commit + push frecvent, branch
   `claude/<nume-sesiune>`.
5. **Confidențialitate:** datele client (xglass) rămân în AXA IT.

---

## 🔗 Tehnic — quick reference

- **Stack:** Static HTML/CSS/JS, Cloudflare Pages, D1 (analytics)
- **Produse reale (nume oficiale):** EVOPRINT, EVOLAM, EVOLAM SMART, EVODUR,
  EVOCLEAN, VERSATIKA
- **Proiecte referință (doar acestea):** Roland Garros Paris, FUTURIUM Berlin,
  Therme, SKANSKA, ING, H&M — **NU inventa altele**
- **Contact USA (doar acesta):** +1‑609‑408‑8100, office.us@xglass.eu, xglass.eu

---

## ❌ NU face în acest repo

- ❌ NU crea fișiere `agents/` sau profiluri agent (sunt în `ai-team`)
- ❌ NU crea `shared/protocols/` sau `shared/memory/` (sunt în `ai-team`)
- ❌ NU inventa proiecte/clienți xglass (folosește doar lista de mai sus)
- ❌ NU schimba numele produselor reale (EVOPRINT, VERSATIKA, etc.)
- ❌ NU folosi alt telefon/email decât cele oficiale
