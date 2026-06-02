# 🔮 Glass Expert — Project Overview

**Tip:** Client work — siteuri pentru xglass.eu / VERSATIKA / VAGOTECH
**Client:** Glass Expert (xglass.eu, Timișoara + Neubiberg)
**Owner AXA IT:** Bogdan
**Echipă:** `ai-team` (nu duplica aici)
**Data:** 2026-06-02

---

## 🎯 Context comercial

xglass.eu este client confirmat. Am convenit să ne implicăm în
**vertical-ul VAGOTECH** (sticlă pentru industria feroviară — vagoane).
Ei produc, noi facem prezența digitală și go-to-market pe piața RO.

---

## 🚀 Proiecte active

### A. Glass Expert USA (site live, polish ongoing)
**Status:** 🟢 LIVE pe Cloudflare Pages
- 8 pagini HTML (index + 4 segmente + products + projects + privacy)
- Brand: „From Better to Best", VERSATIKA Red Dot 2025 anchor
- Lead generation: cold email + LinkedIn (campanii deja pregătite)
- Target: USA — arhitecți, dezvoltatori, hospitality, healthcare, education

### B. VAGOTECH RO (NEXT — site standalone)
**Status:** 🟡 v1 deployed (`vagotech.html`) → **construim v2 standalone RO**

#### Obiectiv
Site dedicat VAGOTECH, în română, pentru piața din România.

#### Scope v2
- **Limbă:** RO primary (engleză eventual ca toggle, faza 2)
- **Audiență RO:**
  - Producători vagoane (Astra Arad, Softronic, Remarul Cluj, etc.)
  - Operatori feroviari (CFR Călători, CFR Marfă, Transferoviar, GFR)
  - Birouri arhitectură transport
  - Autoritatea Feroviară Română (AFER) — context standardizare
- **Conținut:**
  - Hero: VAGOTECH = sticlă feroviară premium europeană, fabricată local
  - Produse: tipuri sticlă pentru aplicații feroviare (geam frontal, lateral,
    despărțitoare, uși, plafon)
  - Standarde: EN 15152 (geam vagoane), EN 12150, certificări CE, AFER
  - Studii de caz reale (din portofoliul xglass — Roland Garros, FUTURIUM,
    SKANSKA, ING, H&M nu sunt feroviare; cerem clientului refs feroviare reale)
  - Procesul: comandă → spec → producție → livrare
  - Contact RO (Timișoara HQ)
- **Stack:** HTML/CSS/JS static + Cloudflare Pages (consistent cu Glass Expert USA)
- **SEO RO:** „sticlă vagoane", „geam tren", „sticlă feroviară", „EN 15152"
- **Performance:** <2s LCP mobile, Lighthouse >90
- **Compliance:** GDPR cookie banner, privacy policy RO

#### Decizii pe care le aștept de la Bogdan
1. **Domeniu:** `vagotech.ro` / `vagotech.eu` / subdomeniu sub `xglass.eu`?
2. **Refs feroviare reale** — proiecte/clienți xglass în domeniul feroviar pe
   care le putem cita (cerem listă de la client)
3. **Buget timeline:** target GO LIVE? Propunere @ana: 2 săptămâni (sprint 10
   zile lucrătoare).
4. **Lead form:** Cloudflare Workers + D1 (ca pe Glass Expert USA) sau
   integrare CRM client?

---

## 👥 Pod execution VAGOTECH RO (din ai-team)

| Rol | Agent | Output |
|---|---|---|
| PM | @stefan | Sprint plan, tracking, daily standup |
| Tech lead | @lucian | Arhitectură, code review |
| Frontend | @cosmin | Build HTML/CSS/JS |
| Design / UX | @irina + @diana | Wireframes → mockups → handoff |
| Visual / branding RO | @marian | Adaptare brand pentru RO |
| Copy RO | @mihai | Headline-uri, body copy RO |
| SEO RO | @elena | Keywords RO, meta, schema, structură URL |
| Research piață | @robert + @bianca | Lead list RO (producători + operatori feroviari) |
| Cold outreach | @george + @laura | Campanie email + ads RO (faza 2) |
| Deploy | @vlad + @cloudflare | Cloudflare Pages, DNS, headers |
| QA | @adrian + @playwright | E2E + Lighthouse + cross-browser |
| Analytics | @robert | GA4 / Cloudflare analytics setup |
| GDPR/Legal RO | @marius + @clara | Privacy policy + cookie banner RO |
| Coordonare | @ana | Daily, escalations, raportare Bogdan |

---

## 📅 Sprint propus VAGOTECH RO (10 zile lucrătoare)

| Zi | Milestone | Owner |
|---|---|---|
| D1 | Discovery: refs feroviare client, decizie domeniu, sitemap | @ana + Bogdan |
| D2 | Wireframes 5 pagini + copy outline RO | @irina + @mihai |
| D3 | Mockups Hi-Fi + brand RO adapted | @diana + @marian |
| D4 | Copy RO finalizat + SEO map | @mihai + @elena |
| D5–D6 | Build frontend (HTML/CSS/JS) | @cosmin (@lucian review) |
| D7 | Lead form + Cloudflare Workers + D1 schema | @vlad + @cosmin |
| D8 | QA: Lighthouse, cross-browser, mobile, a11y | @adrian + @playwright |
| D9 | GDPR/cookie/privacy RO + analytics setup | @marius + @robert |
| D10 | Deploy production + smoke test + raport Bogdan | @vlad + @ana |

Faza 2 (post-launch): cold outreach RO + ads + content marketing.

---

## ✅ Definition of Done (VAGOTECH RO v2)

- [ ] 5 pagini RO live pe domeniu confirmat
- [ ] Lighthouse mobile ≥90 (perf, a11y, SEO, best practices)
- [ ] Lead form funcțional (test cu submit real → D1)
- [ ] Cookie banner + privacy policy RO conforme GDPR
- [ ] Sitemap.xml + robots.txt
- [ ] GA4 (sau Cloudflare Analytics) instalat
- [ ] Cross-browser OK: Chrome, Firefox, Safari, Edge
- [ ] Mobile responsive: 320 / 480 / 768 / 1200 px
- [ ] Zero console errors
- [ ] Aprobare client (xglass) pe varianta finală
- [ ] Aprobare Bogdan

---

## 🔗 Referințe

- Site Glass Expert USA în acest repo (referință stack/design system)
- Protocoale: `ai-team/shared/` (escalation, memory, anti-timeout, communication)
- Brand client: `BRAND-USA-GUIDE.md`, `BRANDING-MANUAL-USA.md` (adaptăm pentru RO)
- Tehnic: `TECHNICAL-DICTIONARY-EN.md` (traducem termenii în RO)

---

**Așteptăm răspunsuri Bogdan pe cele 4 decizii (domeniu, refs feroviare, timeline, lead form backend) ca să pornim D1.**

🔮 **VAGOTECH RO — ready to start.**
