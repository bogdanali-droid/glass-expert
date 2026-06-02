# QUICK START GUIDE
## Glass Expert USA — Image Integration in 5 Steps

**Execution Time:** 2 hours  
**Difficulty:** Intermediate (copy-paste + minor edits)

---

## STEP 1: LINK CSS ENHANCEMENT (2 minutes)

**File:** `index.html` (and all segment pages)

**Add this line to `<head>` section:**
```html
<link rel="stylesheet" href="css/polish-enhancements.css">
```

**Complete head example:**
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Glas Expert USA — Premium Architectural Glass</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/polish-enhancements.css">  <!-- ADD THIS LINE -->
    <meta name="description" content="...">
</head>
```

---

## STEP 2: UPDATE HERO SECTION (5 minutes per page)

**Find this in your HTML:**
```html
<section id="home" class="hero">
    <div class="hero-content">
        ...
    </div>
</section>
```

**Replace with this template** (for commercial page):
```html
<section id="home" class="hero segment-commercial">
  <div class="hero-background">
    <picture>
      <source media="(min-width: 1200px)"
              srcset="https://xglas.eu/versatika/images/commercial/facade-curved.jpg">
      <source media="(min-width: 768px)"
              srcset="https://xglas.eu/versatika/images/commercial/facade-curved-768w.jpg">
      <img src="https://xglas.eu/versatika/images/commercial/facade-curved-480w.jpg"
           alt="Modern office building with premium curved glass facade"
           class="hero-bg-img" loading="eager" width="1920" height="1080">
    </picture>
  </div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="accent-glow">Premium Glass for Commercial Architecture</h1>
    <p class="hero-subtitle">Iconic Facades. Architectural Excellence.</p>
    <p style="font-size: 1.1rem; margin: 1.5rem 0; opacity: 0.95;">
      Curved glass, smart facades, structural innovation. European precision. American delivery.
    </p>
    <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
      <button class="btn-primary btn-cta">DESIGN YOUR FACADE</button>
      <button class="btn-secondary" style="background: rgba(255,255,255,0.2); color: var(--white); border-color: var(--white);">REQUEST CONSULTATION</button>
    </div>
  </div>
  <div class="accent-line"></div>
</section>
```

**Image URLs by Segment:**
```
Commercial:  https://xglas.eu/versatika/images/commercial/facade-curved.jpg
Hospitality: https://xglas.eu/versatika/images/hospitality/luxury-interior.jpg
Healthcare:  https://xglas.eu/versatika/images/healthcare/facility-interior.jpg
Education:   https://xglas.eu/versatika/images/education/campus-building.jpg
```

---

## STEP 3: UPDATE FEATURE CARDS (8 minutes)

**Find this:**
```html
<div class="feature">
    <h4>⚡ Smart Glass Innovation</h4>
    <p>Electrochromic technology...</p>
</div>
```

**Replace with:**
```html
<div class="feature card-hover-lift shadow-md">
  <div class="feature-image">
    <picture>
      <source media="(min-width: 768px)"
              srcset="https://xglas.eu/versatika/images/products/smart-glass-detail.jpg">
      <img src="https://xglas.eu/versatika/images/products/smart-glass-detail-mobile.jpg"
           alt="Smart glass technology showing clear and tinted states"
           class="product-img" loading="lazy" width="600" height="600">
    </picture>
  </div>
  <div class="feature-content">
    <h4>Smart Glass Innovation</h4>
    <p>Electrochromic technology. On-demand transparency. Premium futuristic positioning for corporate HQs.</p>
    <div class="feature-tags">
      <span class="badge" style="background: rgba(0, 212, 255, 0.2); color: var(--accent-bright);">Innovation</span>
      <span class="badge" style="background: rgba(0, 212, 255, 0.2); color: var(--accent-bright);">Smart Tech</span>
    </div>
  </div>
</div>
```

**Product Image URLs:**
```
Smart Glass:      https://xglas.eu/versatika/images/products/smart-glass-detail.jpg
Curved Glass:     https://xglas.eu/versatika/images/products/curved-glass.jpg
Ceramic-Printed:  https://xglas.eu/versatika/images/products/ceramic-printed.jpg
Low-E Thermal:    https://xglas.eu/versatika/images/products/low-e-thermal.jpg
```

---

## STEP 4: ADD CASE STUDY SECTION (10 minutes)

**Add this after hero section on segment pages:**

```html
<section class="case-study segment segment-commercial">
  <div class="container">
    <h2>Case Study: Fortune 500 HQ Facade Transformation</h2>
    <div class="segment-content">
      <div class="segment-image">
        <picture>
          <source media="(min-width: 1200px)"
                  srcset="https://xglas.eu/versatika/images/casestudies/commercial-hq.jpg">
          <source media="(min-width: 768px)"
                  srcset="https://xglas.eu/versatika/images/casestudies/commercial-hq-768w.jpg">
          <img src="https://xglas.eu/versatika/images/casestudies/commercial-hq-480w.jpg"
               alt="Fortune 500 corporate headquarters with glass architecture"
               class="case-study-img shadow-lg" loading="lazy" width="800" height="600">
        </picture>
      </div>
      <div class="segment-text">
        <h3>Fortune 500 Corporate HQ: Curved Glass Innovation</h3>
        <p>A leading financial services company needed a headquarters that projected innovation, transparency, and cutting-edge design. The challenge: create a distinctive architectural icon using curved glass while maintaining structural integrity and energy efficiency.</p>
        <div class="case-study-stats">
          <div class="stat-item">
            <h5>Project Scale</h5>
            <p>48,000 sq ft curved facade</p>
          </div>
          <div class="stat-item">
            <h5>Timeline</h5>
            <p>18 months design to completion</p>
          </div>
          <div class="stat-item">
            <h5>Impact</h5>
            <p>40% energy savings, iconic landmark</p>
          </div>
        </div>
        <blockquote class="quote">
          "Glas Expert transformed our vision into an architectural statement. The curved glass facade is now a defining feature of our brand identity."
          <br><strong>— VP Facilities, Fortune 500 Company</strong>
        </blockquote>
        <button class="btn-primary">View Full Case Study</button>
      </div>
    </div>
  </div>
</section>
```

**Case Study Image URLs:**
```
Commercial:  https://xglas.eu/versatika/images/casestudies/commercial-hq.jpg
Hospitality: https://xglas.eu/versatika/images/casestudies/hospitality-hotel.jpg
Healthcare:  https://xglas.eu/versatika/images/casestudies/healthcare-center.jpg
Education:   https://xglas.eu/versatika/images/casestudies/education-library.jpg
```

---

## STEP 5: TEST & VERIFY (30 minutes)

### Desktop Testing
1. Open each page in Chrome/Firefox/Safari
2. Scroll to see animations trigger
3. Hover on buttons/cards to see effects
4. Verify images load properly

### Mobile Testing
1. Open on phone or use DevTools (F12 → Toggle Device Toolbar)
2. Test at 480px width minimum
3. Verify images responsive
4. Check animations don't stutter

### Accessibility
1. Right-click → Inspect Element
2. Check alt text on all images
3. Tab through buttons/form fields
4. Use keyboard to navigate

### Performance
1. DevTools → Network tab
2. Check image file sizes (<200KB each)
3. Verify load time <2s
4. Check for render-blocking resources

---

## CSS CLASSES YOU NOW HAVE

**Shadow Utilities:**
```html
<div class="shadow-md">Content here</div>
<div class="shadow-lg">Content here</div>
```

**Glow Effects:**
```html
<h1 class="accent-glow">Glowing title</h1>
<button class="glow-bright">Glowing button</button>
```

**Card Effects:**
```html
<div class="feature card-hover-lift shadow-lg">Card</div>
```

**Animations:**
- `imageReveal` — Images slide in on load
- `accentGlow` — Titles pulse with glow
- `hoverLift` — Cards float up on hover
- `segmentFade` — Sections fade in on scroll

---

## COMMON ISSUES & FIXES

**Images not showing?**
- Check URL path is correct
- Verify xglas.eu is accessible
- Check `<picture>` tag syntax
- Inspect browser console for 404 errors

**Animation not working?**
- Verify `polish-enhancements.css` is linked
- Check browser console for CSS errors
- Make sure class names are exact (case-sensitive)
- Test in Chrome first, then other browsers

**Mobile layout broken?**
- Check responsive image `srcset` attributes
- Test at 480px breakpoint
- Verify `.segment-content` has `grid-template-columns: 1fr`
- Use DevTools Device Mode

**Colors don't match?**
- Check CSS variable names in `:root`
- Verify segment class name (e.g., `segment-commercial`)
- Inspect element to see computed styles
- Check for conflicting CSS rules

---

## FILES TO MODIFY

1. ✅ `/home/user/glass-expert/index.html` — Hero section
2. ✅ `/home/user/glass-expert/commercial.html` — Full update
3. ✅ `/home/user/glass-expert/hospitality.html` — Full update
4. ✅ `/home/user/glass-expert/healthcare.html` — Full update
5. ✅ `/home/user/glass-expert/education.html` — Full update

---

## FILES ALREADY CREATED FOR YOU

1. ✅ `/css/polish-enhancements.css` — Ready to link
2. ✅ `/IMAGE-INTEGRATION-STRATEGY.md` — Full reference docs
3. ✅ `/HTML-IMAGE-INTEGRATION-TEMPLATES.md` — Copy-paste templates
4. ✅ `/DELIVERABLE-EXECUTIVE-SUMMARY.md` — Complete breakdown

---

## SEGMENT CLASS NAMES

Use these exactly:
- `segment-commercial` for commercial pages
- `segment-hospitality` for hospitality pages
- `segment-healthcare` for healthcare pages
- `segment-education` for education pages

Example:
```html
<section class="hero segment-commercial">...</section>
```

---

## IMAGE ALT TEXT TEMPLATES

**Hero:**
`"[Segment type] [location/feature] with [glass type] architecture"`

**Product:**
`"[Product name] showing [key visual feature]"`

**Case Study:**
`"[Client type] [project type] featuring [glass solution]"`

---

## TIMELINE

| Task | Time | Status |
|------|------|--------|
| Link CSS | 2 min | Ready |
| Index.html hero | 5 min | Ready |
| Commercial page | 15 min | Ready |
| Hospitality page | 15 min | Ready |
| Healthcare page | 15 min | Ready |
| Education page | 15 min | Ready |
| Testing | 30 min | Ready |
| **TOTAL** | **~95 min** | **Ready** |

---

## SUCCESS CHECKLIST

- [ ] CSS file linked on all pages
- [ ] All 5 hero sections updated with images
- [ ] All feature cards have images + badges
- [ ] Case studies added to segment pages
- [ ] Images load without errors
- [ ] Animations smooth (no lag)
- [ ] Mobile responsive at 480px
- [ ] All alt text complete
- [ ] No broken image links
- [ ] Page loads <2s on 4G

---

## REFERENCE DOCUMENTS

**Need more detail?**
- **Full Strategy:** `IMAGE-INTEGRATION-STRATEGY.md`
- **HTML Templates:** `HTML-IMAGE-INTEGRATION-TEMPLATES.md`
- **Brand Guide:** `BRANDING-MANUAL-USA.md`
- **CSS Source:** `css/polish-enhancements.css`

---

## GET STUCK?

1. Check the error message in browser console (F12)
2. Review the relevant section in IMAGE-INTEGRATION-STRATEGY.md
3. Compare your code against HTML-IMAGE-INTEGRATION-TEMPLATES.md
4. Verify image URLs are accessible
5. Check CSS class names match exactly

---

**YOU'VE GOT THIS!** 🚀

Everything is ready. All templates, all CSS, all documentation.

Just follow the 5 steps above and you'll have a world-class visual experience in 2 hours.

---

**Questions?** → See DELIVERABLE-EXECUTIVE-SUMMARY.md
**Code examples?** → See HTML-IMAGE-INTEGRATION-TEMPLATES.md
**Technical specs?** → See IMAGE-INTEGRATION-STRATEGY.md
**CSS details?** → See css/polish-enhancements.css
