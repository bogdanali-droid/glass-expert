# 📋 DELEGATION ORDERS — Glass Expert Finalization

**From:** @ana (COO)  
**Date:** 2026-06-02, 14:30 UTC  
**Status:** 🔴 URGENT — 3-day sprint to launch  
**Branch:** `claude/ecstatic-maxwell-uptlo`

---

## 🎯 MISSION

**Finish glass-expert.com website for production launch by June 5 (Wednesday).**

Current state: 90% design + docs, 0% deployed.  
What's needed: CSS integration + images + backend + testing + deploy.

**Success = LIVE website with working forms, responsive design, <2s load time, WCAG AA compliant.**

---

## 👤 @cosmin — PHASE 1: INTEGRATION (P0)

**Title:** Full-stack Web Developer (Lead)  
**Deadline:** June 3, EOD (by tomorrow 23:59 UTC)  
**Priority:** P0 (CRITICAL PATH)

### TASK 1.1: CSS Integration [1 hour]
```
Citeste: QUICK-START-IMPLEMENTATION.md (section "CSS Integration")

□ Open: index.html, commercial.html, hospitality.html, healthcare.html, education.html
□ Add <link rel="stylesheet" href="css/polish-enhancements.css"> in <head>
□ Verify all 5 files have the link
□ Test locally: Open index.html in browser → check animations load
□ No console errors allowed
□ Commit: "Add CSS polish framework to all 5 pages"
□ Push to branch
```

### TASK 1.2: Hero Images [1 hour]
```
Citeste: HTML-IMAGE-INTEGRATION-TEMPLATES.md (Hero Section section)

□ index.html hero:
  - Add <picture> element with responsive images
  - Class: "segment-blue" (smart glass hero)
  - Srcset: 480w, 768w, 1200w
  - Alt: "Smart glass technology for commercial buildings"

□ commercial.html hero:
  - Class: "segment-orange"
  - Alt: "Professional facade glass for commercial properties"

□ hospitality.html hero:
  - Class: "segment-green"  
  - Alt: "Luxury interior glass solutions for hospitality"

□ healthcare.html hero:
  - Class: "segment-purple"
  - Alt: "Medical-grade glass for healthcare facilities"

□ education.html hero:
  - Class: "segment-blue"
  - Alt: "Durable glass solutions for educational institutions"

□ Test on mobile (480px) + tablet (768px) + desktop (1200px)
□ Images load in <500ms each
□ Commit: "Integrate hero images on all 5 pages"
□ Push to branch
```

### TASK 1.3: Product Card Images [30 min]
```
Citeste: HTML-IMAGE-INTEGRATION-TEMPLATES.md (Product Card section)

□ commercial.html → find feature cards section
□ Add <div class="feature-image"> to EACH card
□ Add <picture> element inside
□ Images: smart-glass.jpg, curved-glass.jpg, ceramic-glass.jpg, thermal-glass.jpg
□ Add .product-img class to <img>
□ Add .feature-tags with badges
□ Update card class: "card-hover-lift shadow-md"
□ Test hover effect on desktop
□ Commit: "Add product imagery to commercial page"
□ Push to branch
```

### TASK 1.4: Case Study Images [30 min]
```
Citeste: HTML-IMAGE-INTEGRATION-TEMPLATES.md (Case Study section)

□ Find case study sections on:
  - commercial.html
  - hospitality.html
  - healthcare.html
  - education.html

□ For each: add <picture> element with responsive image
□ All use class: "case-study-img"
□ Srcset: 480w, 768w, 1200w
□ Alt text: descriptive (client name, project type)

□ Test images display correctly
□ Test on all 3 breakpoints
□ Commit: "Integrate case study imagery across all pages"
□ Push to branch
```

### TASK 1.5: Form Styling [30 min]
```
Citeste: css/polish-enhancements.css (form section)

□ Find contact form in ALL pages
□ Add polish CSS classes:
  - Input: class="form-input form-focus-glow"
  - Submit button: class="btn btn-primary btn-shimmer"
  - Form wrapper: class="form-container shadow-lg"

□ Test form inputs on desktop + mobile
□ Hover effects work
□ Focus glow effect visible
□ Button click animation smooth
□ Commit: "Add form styling and polish"
□ Push to branch
```

### DELIVERABLES
- 5 HTML files with CSS linked ✓
- 17 images integrated (heroes + products + case studies) ✓
- All images responsive (480/768/1200px) ✓
- All animations working (no console errors) ✓
- Forms styled with polish CSS ✓
- 4 commits pushed to branch ✓

---

## 👤 @alex + @danbastan — PHASE 2: BACKEND (P1)

**Assigned to:** @alex (Mobile) + @danbastan (Platform)  
**Deadline:** June 4, EOD  
**Priority:** P1 (HIGH)

### TASK 2.1: Contact Form API [@alex - 1.5 hours]
```
Create: /api/contact endpoint (Cloudflare Worker or Node.js)

□ Endpoint: POST /api/contact
□ Accept JSON:
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-123-4567",
    "company": "Acme Corp",
    "message": "Interested in smart glass quotes"
  }

□ Validate:
  - name: required, min 2 chars
  - email: valid email format
  - phone: optional but valid if present
  - message: required, min 10 chars

□ On success: return 200 + {success: true, message: "We'll contact you soon"}
□ On error: return 400 + {success: false, error: "..."}
□ Test with Postman/cURL
□ Commit: "Implement contact form API endpoint"
```

### TASK 2.2: Lead Capture Database [@danbastan - 1.5 hours]
```
Create: Database schema + storage for form submissions

□ Table: "glass_leads"
  - id (UUID)
  - name (varchar 255)
  - email (varchar 255)
  - phone (varchar 20)
  - company (varchar 255)
  - message (text)
  - source (varchar 50 = "contact-form")
  - timestamp (datetime, auto-now)
  - ip_address (varchar 45)
  - status (varchar 20 = "new")

□ Create /api/leads endpoint (GET - admin only):
  - Returns all leads (paginated, 20 per page)
  - Filter by date range
  - Filter by status (new, contacted, closed)
  - Requires API key or JWT auth

□ Create /api/leads/:id endpoint (PATCH - update):
  - Update lead status
  - Add notes
  - Requires auth

□ Test: Submit form → check database
□ Commit: "Add lead database schema and tracking API"
```

### TASK 2.3: Email Notifications [@alex - 1 hour]
```
Setup: Email sending (Sendgrid, Mailgun, or AWS SES)

□ When form submitted:
  - Confirmation email to prospect (John Doe)
  - Notification to sales@glassexpert.com (notify team)

□ Prospect email template (HTML):
  Subject: "Thank you, [Name]! We'll be in touch soon."
  Body:
    - Thank you for contacting Glass Expert
    - Confirm their request: "[company] - [message]"
    - Timeline: "We'll respond within 4 hours"
    - Link: "View our glass solutions"
    - Signature: Sales team

□ Sales team email template (HTML):
  Subject: "New Lead: [Name] from [Company]"
  Body:
    - Lead details (all fields)
    - Source: "Website contact form"
    - Direct reply link
    - Auto-assign: (TBD by Bogdan)

□ Test: Submit form → check emails arrived
□ Commit: "Add email notification system"
```

### TASK 2.4: Navigation & Routing [@alex - 30 min]
```
Test: All navigation works end-to-end

□ From index.html:
  - Click "Commercial" → commercial.html loads
  - Click "Hospitality" → hospitality.html loads
  - Click "Healthcare" → healthcare.html loads
  - Click "Education" → education.html loads
  - Click logo → index.html loads

□ From segment pages:
  - Click "Back to home" → index.html
  - Click logo → index.html
  - Mobile menu opens/closes
  - Mobile menu items link correctly

□ Test on: Chrome + Firefox + Safari, Mobile Chrome + Safari

□ All links work (no 404 errors)
□ Commit: "Fix navigation routing across all pages"
```

### DELIVERABLES
- POST /api/contact endpoint ✓
- GET /api/leads endpoint (with auth) ✓
- PATCH /api/leads/:id endpoint ✓
- Email notifications (prospect + sales) ✓
- Database schema created ✓
- All endpoints tested ✓
- 3 commits pushed ✓

---

## 👤 @adrian — PHASE 3: TESTING & QA (P1)

**Title:** QA Lead & Test Strategy  
**Deadline:** June 4, EOD  
**Priority:** P1 (HIGH)

### TASK 3.1: Responsive Testing [1 hour]
```
Citeste: DEPLOYMENT-READINESS-CHECKLIST.md (Responsive Design Testing section)

Test all 5 pages at 3 breakpoints: 480px (mobile), 768px (tablet), 1200px (desktop)

□ index.html @ 480px, 768px, 1200px
□ commercial.html @ 480px, 768px, 1200px
□ hospitality.html @ 480px, 768px, 1200px
□ healthcare.html @ 480px, 768px, 1200px
□ education.html @ 480px, 768px, 1200px

For each:
  □ Images scale proportionally (no stretched/squished)
  □ Text readable (font size, line height appropriate)
  □ Mobile nav works (hamburger menu on <768px)
  □ Forms readable and clickable on mobile
  □ Feature grid stacks single column on mobile
  □ No horizontal scrolling on any size
  □ Shadows/animations render correctly

Document: Create file "RESPONSIVE-TESTING-MATRIX.md" with results

Commit: "Complete responsive design testing (480/768/1200px)"
```

### TASK 3.2: Lighthouse Audit [1 hour]
```
Run Google Lighthouse audit on each page:

□ Use: https://developers.google.com/web/tools/lighthouse
  OR Chrome DevTools → Lighthouse tab

□ Target scores (target >80):
  - Performance: >80
  - Accessibility: >90
  - Best Practices: >85
  - SEO: >90

□ For each page:
  - Run audit (Desktop + Mobile)
  - Document: score, FCP, LCP, CLS metrics
  - Fix issues if below target

□ Common fixes:
  - Image optimization (use WebP format)
  - Remove unused CSS
  - Minify JavaScript
  - Add meta descriptions
  - Improve color contrast

Document: Create file "LIGHTHOUSE-AUDIT-RESULTS.md"

Commit: "Optimize for Lighthouse performance (target >80)"
```

### TASK 3.3: Accessibility Audit [1 hour]
```
Citeste: DEPLOYMENT-READINESS-CHECKLIST.md (Accessibility Compliance section)

□ Test each page with:
  - WAVE tool (webaim.org/wave) — check for errors
  - Axe DevTools (plugin) — check critical issues
  - Manual keyboard navigation (Tab through all elements)

□ Verify:
  - All images have alt text (descriptive, not "image")
  - Color contrast meets WCAG AA (4.5:1 minimum)
  - Focus states visible on buttons/links (yellow outline)
  - Form inputs have associated labels
  - Headings in proper order (h1, h2, h3, not skipped)
  - Semantic HTML (use <button>, not <div> for buttons)
  - Animations respect prefers-reduced-motion

□ Test with screen reader (NVDA on Windows, VoiceOver on Mac)
  - Read through page
  - Confirm content makes sense
  - Confirm form labels clear

Document: Create file "ACCESSIBILITY-AUDIT-RESULTS.md"

Commit: "Complete WCAG AA accessibility audit"
```

### TASK 3.4: Browser Compatibility [30 min]
```
Test on these browsers (latest versions):

□ Chrome / Chromium (Desktop)
□ Firefox (Desktop)
□ Safari (Desktop)
□ Edge (Desktop)
□ Chrome (Android)
□ Safari (iOS)

For each:
  □ All pages load correctly
  □ No console errors
  □ Images display properly
  □ Forms work
  □ Animations smooth
  □ Colors display correctly
  □ CSS animations working

Document: Create file "BROWSER-COMPATIBILITY-MATRIX.md"

Commit: "Verify cross-browser compatibility"
```

### TASK 3.5: Visual QA [30 min]
```
Citeste: BRANDING-MANUAL-USA.md (Brand colors + typography)

Compare visual design against brand spec:

□ Colors (should match exactly):
  - Primary blue: #0099CC
  - Secondary orange: #FF6B35
  - Tertiary green: #00C884
  - Quaternary purple: #6C5CE7
  - White: #FFFFFF
  - Text dark: #1B3A6B

□ Typography:
  - Headings: Poppins (bold, clear)
  - Body: Inter (readable, consistent)
  - Line height: 1.6 for body, 1.2 for headings

□ Visual elements:
  - Shadows: subtle (not overdone)
  - Spacing: consistent 4rem sections, 2rem mobile
  - Animations: smooth 60fps (use DevTools → Performance)
  - Hover effects: clear and responsive
  - No layout shifts on image load

□ Premium aesthetic check:
  - Looks professional (not cheap)
  - Consistent across all 5 pages
  - Cohesive design system

Document: Create file "VISUAL-QA-CHECKLIST.md"

Commit: "Complete visual QA - brand guidelines verified"
```

### DELIVERABLES
- Responsive testing matrix (all pages, 3 breakpoints) ✓
- Lighthouse audit (all pages >80 score) ✓
- Accessibility audit (WCAG AA compliant) ✓
- Browser compatibility matrix (6 browsers tested) ✓
- Visual QA checklist (brand spec verified) ✓
- 5 testing documents created ✓
- 5 commits pushed ✓

---

## 👤 @danbastan + @vlad — PHASE 4: DEPLOYMENT (P0)

**Assigned to:** @danbastan (Platform) + @vlad (GitHub/DevOps)  
**Deadline:** June 5, EOD  
**Priority:** P0 (CRITICAL PATH)

### TASK 4.1: Cloudflare Pages Setup [@danbastan - 1 hour]
```
Setup: Deploy to Cloudflare Pages (free CDN + hosting)

□ Prerequisites:
  - GitHub repo ready (bogdanali-droid/glass-expert)
  - All code pushed to main or feature branch
  - Verified no secrets in repo (API keys, passwords)

□ Steps:
  1. Go to dash.cloudflare.com
  2. Pages → Create project → Connect to Git
  3. Select: bogdanali-droid/glass-expert repo
  4. Build settings:
     - Framework: None (static HTML/CSS/JS)
     - Build command: (leave blank)
     - Build output directory: . (current dir)
  5. Create deployment
  6. Wait for deployment to complete (usually <2min)
  7. Visit Cloudflare Pages URL (will be *.pages.dev)

□ Verify:
  - All pages load (index + 4 segment pages)
  - CSS loads correctly
  - Images display
  - No 404 errors
  - Load time <2 seconds

□ Setup custom domain (pending Bogdan approval):
  1. Points to: xglass-usa.com OR glasspro.ai OR demo.glassexpert.com
  2. Add custom domain in Cloudflare Pages dashboard
  3. Update DNS records in domain registrar
  4. Wait for SSL certificate (automatic, <10min)
  5. Verify green lock (https://)

Commit: "Deploy glass-expert to Cloudflare Pages"
```

### TASK 4.2: DNS Configuration [@vlad - 1 hour]
```
Setup: DNS pointing + SSL certificate

□ Domain details needed from Bogdan:
  - Which domain? (xglass-usa.com / glasspro.ai / custom)
  - Who manages domain? (Cloudflare / GoDaddy / Namecheap / other)

□ If using Cloudflare nameservers:
  1. Change domain registrar → use Cloudflare nameservers
  2. Wait for propagation (15-60 min)
  3. Verify DNS records in Cloudflare dashboard

□ If using CNAME:
  1. Find Cloudflare CNAME from Pages dashboard
  2. Add CNAME record in domain registrar
  3. Wait for propagation

□ Verify DNS:
  - Test: nslookup glasspro.ai (or custom domain)
  - Should point to Cloudflare
  - SSL certificate auto-generated (green lock in browser)
  - HTTPS working

Commit: "Configure DNS for custom domain"
```

### TASK 4.3: Monitoring & Analytics [@danbastan - 30 min]
```
Setup: Error tracking + performance monitoring

□ Sentry (error tracking):
  1. Create Sentry project (sentry.io)
  2. Add Sentry script to HTML head (all 5 pages)
  3. Test: Trigger console error → verify it appears in Sentry
  4. Setup alerts: Notify slack/email on new errors

□ Google Analytics:
  1. Create GA4 property (google analytics)
  2. Add GA tracking script to HTML head
  3. Track events: page views, button clicks, form submissions
  4. Create dashboard: view traffic by page/segment
  5. Monitor: bounce rate, avg session duration, conversion rate

□ Cloudflare Analytics:
  1. View in Cloudflare Pages dashboard
  2. Monitor: requests/day, unique visitors, bandwidth
  3. Check: error rates, slow pages, popular pages

□ Setup alerts:
  - P0: 500 errors → immediate notification
  - High latency (>3s) → daily digest
  - Traffic spike → weekly summary

Commit: "Setup error tracking and analytics monitoring"
```

### TASK 4.4: SEO & Metadata [@vlad - 30 min]
```
Setup: SEO optimization for search engines

□ Meta tags (verify on all 5 pages):
  - <title> — unique, descriptive (55-60 chars)
    Example: "Smart Glass Solutions for Commercial Buildings"
  - <meta name="description"> — unique summary (155-160 chars)
  - <meta name="viewport"> content="width=device-width, initial-scale=1"

□ Page-specific titles + descriptions:
  □ index.html — homepage intro
  □ commercial.html — commercial glass solutions
  □ hospitality.html — hospitality glass solutions
  □ healthcare.html — healthcare glass solutions
  □ education.html — educational glass solutions

□ Structured data (schema.org):
  - Add JSON-LD for Organization (company info)
  - Add schema for LocalBusiness (if applicable)
  - Validate: schema.org/validate

□ Sitemap:
  - Create sitemap.xml with all 5 pages
  - Submit to Google Search Console
  - Submit to Bing Webmaster Tools

□ Robots.txt:
  - Create robots.txt (allow all by default)
  - Disallow admin paths if any

□ OG tags (social sharing):
  - og:title, og:description, og:image
  - twitter:card, twitter:title, twitter:description

Commit: "Complete SEO metadata optimization"
```

### DELIVERABLES
- Cloudflare Pages deployment (live at *.pages.dev) ✓
- Custom domain configured (xglass-usa.com or approved domain) ✓
- SSL certificate active (green lock) ✓
- DNS fully configured ✓
- Sentry error tracking active ✓
- Google Analytics tracking active ✓
- SEO metadata complete ✓
- Sitemap.xml created ✓
- 4 commits pushed ✓

---

## 🎯 SUMMARY TABLE

| Phase | Owner(s) | What | Hours | Deadline | Status |
|-------|----------|------|-------|----------|--------|
| 1 | @cosmin | CSS + Images + Forms | 2h | Jun 3 EOD | 🔴 TODO |
| 2 | @alex, @danbastan | Backend + APIs | 3h | Jun 4 EOD | 🔴 TODO |
| 3 | @adrian | Testing + QA | 3h | Jun 4 EOD | 🔴 TODO |
| 4 | @danbastan, @vlad | Deploy + DNS | 2h | Jun 5 EOD | 🔴 TODO |
| **TOTAL** | **5 agents** | **WEBSITE LIVE** | **10h** | **Jun 5 🚀** | **🔴 IN PROGRESS** |

---

## 📞 ESCALATION & COORDINATION

### Daily Standup (09:00 UTC)
- **Who:** @cosmin, @alex, @danbastan, @adrian, @vlad
- **What:** Status update (done/blockers/next)
- **Where:** Slack #glass-expert-dev

### Blockers = Escalate to @ana
- API endpoint fails → escalate @danbastan → @ana
- Design mismatch → escalate @adrian → @irina → @ana
- Deployment issue → escalate @vlad → @danbastan → @ana
- P0 = notify Bogdan directly

### Decisions Needed from Bogdan
- [ ] Which domain? (xglass-usa.com / glasspro.ai / other)
- [ ] Email for sales team? (sales@glassexpert.com / custom)
- [ ] Analytics requirement? (Google Analytics / Hotjar / other)
- [ ] Slack webhook for notifications? (optional)

---

## ✅ SIGN-OFF & LAUNCH CHECKLIST

### Day 5 (June 5), 18:00 UTC — Final Verification

- [ ] @cosmin: "CSS + Images complete & tested"
- [ ] @alex + @danbastan: "Backend API working, emails sending"
- [ ] @adrian: "All QA passed, Lighthouse >85"
- [ ] @danbastan: "Cloudflare deployed, monitoring active"
- [ ] @vlad: "DNS configured, SSL green lock"
- [ ] @ana: "All blockers resolved, ready to launch"
- [ ] Bogdan: "Approves launch 🚀"

### LAUNCH TIME: June 5, 19:00 UTC
```
Domain goes LIVE → glasspro.ai
Status: Production Ready ✅
Team: Celebration! 🎉
```

---

**From:** @ana (COO)  
**Status:** Ready to execute  
**Questions?** DM me directly or escalate P0

Let's ship this! 🚀

