# 📋 VAGOGLASS — Log decizii Bogdan

| Data | Decizie | Răspuns Bogdan |
|---|---|---|
| 02 iun 2026 | **Nume brand** | VAGOGLASS (confirmat docx client) |
| 02 iun 2026 | **Domeniu producție** | Rămânem pe **Cloudflare Pages subdomain** până achiziție domeniu propriu (`vagoglass.ro`). |
| 02 iun 2026 | **Limbi site v1** | **RO + EN** ✅ confirmat |
| 02 iun 2026 | **Focus comunicare CFR/Alstom Coradia** | ✅ confirmat „DA" — Alstom prioritate de cucerit (NU client încă) |
| 02 iun 2026 | **Sponsor intern Glass Expert** | **Beatrice GRAMA** ✅ confirmat |
| 02 iun 2026 | **Locație fabrică** | **Popești-Leordeni, Ilfov** (corectare — NU Timișoara). Avantaj geografic excelent: lângă București = proximitate maximă pentru CFR HQ, Atelierele Grivița, STB, Metrorex, Alstom RO HQ. |
| 02 iun 2026 | **Logo VAGOGLASS** | **Wordmark declinat din xglas.eu** — sans-serif minimalist + linie de accent cyan. Co-branding „VAGOGLASS by Glass Expert". |
| 02 iun 2026 | **Documente oficiale pe site** | DA — afișăm prominent **certificatele + autorizațiile** (AFER ATR, EN 15152, ISO 9001/14001/45001, etc.) ca trust elements. „Va cantari" (Bogdan). Cer Beatricei copiile PDF + numerele exacte pentru integrare imediată. |
| 02 iun 2026 | **Foto produse site** | **Imagini extrase din catalogul CFR** (6 fișiere salvate în `vagoglass/assets/products/`) + Unsplash verificate ca fallback până vin foto profesionale de la fabrică. Bogdan confirmă pe email care e care (parbriz / lateral / interior / fabrică). |
| 02 iun 2026 | **Logo-uri clienți pe site** | DA — folosim logo-uri reale (CFR, STB, Alstom, Electroputere VFU din Wikimedia + site oficial). Grivița + ICRL Brașov rămân wordmark (fără logo public). |

---

## 👥 Lista CORECTĂ clienți câștigați (confirmată Beatrice GRAMA, 02 iun 2026, 20:20)

1. **CFR Călători** ✅
2. **Atelierele CFR Grivița** ✅
3. **Electroputere VFU Pașcani** ✅
4. **ICRL Brașov** ✅ (Întreținere & Reparații Locomotive — *corectare* față de „SCRL Brașov" din docx)
5. **STB** ✅ (rămâne din docx oficial — *verificare cerere Beatrice*)

**Alstom = TARGET PRIORITAR (NU client încă)** — „cochetăm cu el"
→ Strategia comunicare: poziționăm brand ca *credibil pentru standardul Alstom*, ca să facilităm conversia.

---

## 🎯 Implicații pentru sprint

### Focus narativ Coradia / CFR Alstom
- **Hero pagina principală:** vizual cabină / interior Coradia + headline „Sticlă feroviară pentru flota modernă a României"
- **Case study #1 (poziția 1):** Alstom Coradia Stream @ CFR Călători — 16 rame, 26 trenuri/zi, 160 km/h, rute București-Constanța + București-Craiova
- **Trust bar:** logo CFR Călători + logo Alstom (cu confirmare client)
- **Lead magnet white paper:** „Conformitate EN 15152 + TSI LOC&PAS pentru flota Coradia / PNRR" (gated)
- **Outreach Faza 1 prioritar:**
  1. **Alstom Reichshoffen / Alstom Romania** — engineering & procurement Coradia (subfurnizor sticlă pentru loturi viitoare + retrofit)
  2. **ARF (Autoritatea pentru Reformă Feroviară)** — decident achiziție PNRR
  3. **CFR Călători engineering** — Eduard Deleanu (CTO, dacă confirmat), Cristian Micu (Procurement)
  4. **Alstom Group HQ** — supplier registration global

### Deploy & domeniu
- Push site sub `vagoglass/` în repo `glass-expert` SAU project Cloudflare separat `vagoglass-pages`
- DNS migration → `vagoglass.ro` doar după ce Bogdan achiziționează domeniul. Atunci redirect din `pages.dev`.

### Plan Faza 2 (după achiziție domeniu + decizii client)
- Add DE / PL ca limbi
- Lansare publică brand la Zilele Feroviare 2026 (toamnă) + InnoTrans 2026 Berlin (sept)

---

## ❓ Întrebare deschisă

Confirmă-mi interpretarea „cfr alstom" — focus prioritar pe contractul Alstom Coradia (16 rame CFR Călători)?
- Dacă DA → continuăm cu sprintul cum planificat
- Dacă altceva (ex: sponsorul intern xglas pe rail e cineva cu „CFR Alstom" în titlu / segment buyer) → spune-mi care e contextul
