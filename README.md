# 🔮 Glass Expert — Site Repository

> Repo cu **siteurile** pe care AXA IT le construiește pentru clientul
> **Glass Expert / xglass.eu / VERSATIKA**.

**Status:** 🟢 LIVE (xglass.eu USA) + 🟡 v1 VAGOTECH → next: site VAGOTECH RO
**Owner:** Bogdan (CEO AXA IT)
**Echipă:** agenții din [`ai-team`](https://github.com/bogdanali-droid/ai-team) (NU duplicați aici)

---

## 👤 Clientul

**Glass Expert (xglass.eu)** — producător european premium de sticlă arhitecturală:
- Timișoara (RO) + Neubiberg (DE), 25+ ani, Top 20 Europa
- Flagship: **VERSATIKA** (versatika.com) — ușă flush-to-wall, Red Dot 2025
- US office: New Jersey · +1‑609‑408‑8100 · office.us@xglass.eu
- Tagline: „From Better to Best"

Clienți confirmați. Ne implicăm în vertical-ul **VAGOTECH** (sticlă railway).

---

## 📦 Ce conține repo-ul

### Site Glass Expert USA (live)
`index.html` · `commercial.html` · `hospitality.html` · `healthcare.html` ·
`education.html` · `products.html` · `projects.html` · `privacy.html`

### Site VAGOTECH (v1 live + next iteration: RO)
`vagotech.html` · `vagotech-presentation.html`

### Assets
`css/` (redesign-v2 + polish) · `js/script.js` · `images/` · `public/` (backup)

### Deploy (Cloudflare Pages)
`wrangler.toml` · `_headers` · `_redirects` · `404.html` · `sitemap.xml`

### Backend & Tooling
`functions/` (Workers + D1 analytics) · `admin/` (dashboard)
`email_campaign_system.py` · `prospect_database.py` · `response_tracking_system.py`

### Documentație livrabile pentru client
- Brand & design: `BRAND-USA-GUIDE.md`, `BRANDING-MANUAL-USA.md`, `UI-UX-DESIGN-BRIEF.md`
- Imagery: `IMAGERY-STRATEGY.md`, `IMAGE-INTEGRATION-*`, `HTML-IMAGE-INTEGRATION-TEMPLATES.md`
- Research: `COMPETITOR-DESIGN-ANALYSIS.md`, `DESIGN-RESEARCH-FINDINGS.md`, `INNOVATION-DESIGN-RESEARCH.md`
- Copy & SEO: `SEO-COPY-STRATEGY.md`, `TECHNICAL-DICTIONARY-EN.md`, `docs/WEBSITE-USA-LANDING-PAGES-COPY.md`
- Campanii: `COLD-EMAIL-TEMPLATES.md`, `COLD_EMAIL_CAMPAIGN_DELIVERABLES.md`, `EMAIL-BATCH-1-READY-TO-SEND.md`, `CAMPAIGN_FINAL_REPORT.txt`, `CAMPAIGNS-READY-TO-LAUNCH.md`
- LinkedIn: `LINKEDIN-POSTING-SCHEDULE-READY.md`, `LINKEDIN-POSTS-CAMPAIGN.md`, `docs/LINKEDIN-*`
- Lead lists: `prospect_list_20firms.csv`, `MARKET-SEGMENTATION-LEADS-30K.docx`, `SEGMENTARE-PIATA-LEADURI-30K-RO.docx`
- Deploy ops: `CLOUDFLARE-PAGES-SETUP-GUIDE.md`, `DEPLOYMENT-READINESS-CHECKLIST.md`, `DEPLOYMENT-OPTIMIZATION-PLAN.md`, `DEPLOYMENT-STATUS-REPORT.md`, `AUTO-DEPLOY-VERIFICATION-CHECKLIST.md`, `OPTIMIZATION-IMPLEMENTATION-GUIDE.md`, `PERFORMANCE-TUNING-EXECUTIVE-SUMMARY.md`
- Quick start: `QUICK-START-IMPLEMENTATION.md`, `LAUNCH-CHECKLIST.md`

---

## 🚀 Next sprint: site VAGOTECH RO

**Decis cu Bogdan, 02 iunie 2026.**

VAGOTECH = linia xglass pentru sticlă feroviară. Clientul vrea **site dedicat,
în română, pentru piața RO** — separat de paginile actuale.

- Limbă: RO primary
- Target: arhitecți, dezvoltatori, contractori feroviari, producători vagoane RO
- Stack: HTML/CSS/JS static + Cloudflare Pages (aceeași arhitectură)
- Domeniu: TBD (decizie Bogdan)
- Echipa: agenți din `ai-team`
- PROJECT-OVERVIEW.md detaliază planul.

---

## 👥 Echipa (din ai-team)

| Funcție | Agent |
|---|---|
| Coordonare | @ana → Bogdan |
| PM | @stefan, @alina |
| Tech / frontend | @lucian, @cosmin, @alex |
| Design / UX | @irina, @diana, @marian |
| SEO + copy RO | @elena, @mihai, @andrei |
| Marketing | @victoria, @laura, @george |
| Social | @cristina, @ion |
| Deploy | @vlad, @cloudflare |
| QA | @adrian, @playwright |
| Analytics | @robert |
| Compliance | @marius, @sorin |

Profilurile agenților sunt în [`ai-team/agents/`](https://github.com/bogdanali-droid/ai-team/tree/main/claude/amazing-wozniak-Q83UM/agents). **NU le copia aici.**

---

## 📋 Protocoale

Moștenite 1:1 din `ai-team/shared/`:
- `escalation-protocol.md` — P0/P1/P2/P3/P4
- `internal-communication-protocol.md` — format mesaje
- `memory-protocol.md` — `ai-team/shared/memory/<agent>/`
- `anti-timeout-protocol.md` — scrieri <10KB, push frecvent
- `agent-life-protocol.md` · `proposals-protocol.md` · `rules.md`

**NU duplica protocoalele aici.**

---

## ⚙️ Dev quick start

```bash
# Static site — deschide local
python3 -m http.server 8080

# Deploy Cloudflare Pages (manual)
wrangler pages deploy . --project-name=glass-expert
```

---

**Repo curat. Agenții stau în ai-team. Aici doar livrabile pentru client.** 🔮
