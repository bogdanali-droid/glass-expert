# HTML IMAGE INTEGRATION TEMPLATES
## Glass Expert USA — Copy-Paste Ready Code

**Status:** Production-ready templates  
**Alignment:** BRANDING-MANUAL-USA.md compliant  
**Implementation:** 15-minute integration per page

---

## TEMPLATE 1: HERO SECTION WITH BACKGROUND IMAGE

**File Location:** Apply to all segment pages (commercial.html, hospitality.html, healthcare.html, education.html)

**Current Implementation:** Gradient-only hero  
**Upgraded Implementation:** Gradient + background image with overlay

```html
<!-- HERO SECTION WITH BACKGROUND IMAGE -->
<section id="home" class="hero [segment-class]">
  <!-- Background image container -->
  <div class="hero-background">
    <picture>
      <!-- Desktop version (1920x1080) -->
      <source media="(min-width: 1200px)"
              srcset="https://xglas.eu/versatika/images/[segment]/hero-[segment]-1920w.jpg">
      <!-- Tablet version (1024x576) -->
      <source media="(min-width: 768px)"
              srcset="https://xglas.eu/versatika/images/[segment]/hero-[segment]-1024w.jpg">
      <!-- Mobile version (480x270) -->
      <source media="(max-width: 767px)"
              srcset="https://xglas.eu/versatika/images/[segment]/hero-[segment]-480w.jpg">
      <!-- Fallback -->
      <img src="https://xglas.eu/versatika/images/[segment]/hero-[segment].jpg"
           alt="[DESCRIPTIVE ALT TEXT]"
           class="hero-bg-img"
           loading="eager"
           width="1920" height="1080">
    </picture>
  </div>

  <!-- Overlay gradient for text readability -->
  <div class="hero-overlay"></div>

  <!-- Hero content with proper z-index -->
  <div class="hero-content">
    <h1 class="accent-glow">[PAGE TITLE]</h1>
    <p class="hero-subtitle">[TAGLINE]</p>
    <p style="font-size: 1.1rem; margin: 1.5rem 0; opacity: 0.95;">
      [DESCRIPTIVE TEXT]
    </p>
    <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
      <button class="btn-primary btn-cta"
              onclick="document.getElementById('selector').scrollIntoView({behavior: 'smooth'})">
        [PRIMARY CTA]
      </button>
      <button class="btn-secondary"
              style="background: rgba(255,255,255,0.2); color: var(--white); border-color: var(--white);"
              onclick="document.getElementById('contact').scrollIntoView({behavior: 'smooth'})">
        [SECONDARY CTA]
      </button>
    </div>
  </div>

  <!-- Bottom accent line -->
  <div class="accent-line"></div>
</section>
```

**Segment-Specific Examples:**

### COMMERCIAL
```html
<!-- Commercial segment -->
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

### HOSPITALITY
```html
<section id="home" class="hero segment-hospitality">
  <div class="hero-background">
    <picture>
      <source media="(min-width: 1200px)"
              srcset="https://xglas.eu/versatika/images/hospitality/luxury-interior.jpg">
      <source media="(min-width: 768px)"
              srcset="https://xglas.eu/versatika/images/hospitality/luxury-interior-768w.jpg">
      <img src="https://xglas.eu/versatika/images/hospitality/luxury-interior-480w.jpg"
           alt="Luxury hospitality space with ambient glass features"
           class="hero-bg-img" loading="eager" width="1920" height="1080">
    </picture>
  </div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="accent-glow">Bespoke Glass for Luxury Hospitality</h1>
    <p class="hero-subtitle">Design Stories. Unforgettable Experiences.</p>
    <p style="font-size: 1.1rem; margin: 1.5rem 0; opacity: 0.95;">
      Custom colors, ambient lighting integration, guest experience design. Premium materials. Exceptional results.
    </p>
    <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
      <button class="btn-primary btn-cta">CREATE YOUR DESIGN STORY</button>
      <button class="btn-secondary" style="background: rgba(255,255,255,0.2); color: var(--white); border-color: var(--white);">SCHEDULE CONSULTATION</button>
    </div>
  </div>
  <div class="accent-line"></div>
</section>
```

### HEALTHCARE
```html
<section id="home" class="hero segment-healthcare">
  <div class="hero-background">
    <picture>
      <source media="(min-width: 1200px)"
              srcset="https://xglas.eu/versatika/images/healthcare/facility-interior.jpg">
      <source media="(min-width: 768px)"
              srcset="https://xglas.eu/versatika/images/healthcare/facility-interior-768w.jpg">
      <img src="https://xglas.eu/versatika/images/healthcare/facility-interior-480w.jpg"
           alt="Modern healthcare facility with transparent glass partitions"
           class="hero-bg-img" loading="eager" width="1920" height="1080">
    </picture>
  </div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="accent-glow">Healing Spaces Through Glass Design</h1>
    <p class="hero-subtitle">Safety. Clarity. Compassion.</p>
    <p style="font-size: 1.1rem; margin: 1.5rem 0; opacity: 0.95;">
      FDA-approved, LEED-certified, medical-grade materials. Healing environments. Superior safety standards.
    </p>
    <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
      <button class="btn-primary btn-cta">BUILD YOUR LEGACY</button>
      <button class="btn-secondary" style="background: rgba(255,255,255,0.2); color: var(--white); border-color: var(--white);">CONSULT WITH EXPERTS</button>
    </div>
  </div>
  <div class="accent-line"></div>
</section>
```

### EDUCATION
```html
<section id="home" class="hero segment-education">
  <div class="hero-background">
    <picture>
      <source media="(min-width: 1200px)"
              srcset="https://xglas.eu/versatika/images/education/campus-building.jpg">
      <source media="(min-width: 768px)"
              srcset="https://xglas.eu/versatika/images/education/campus-building-768w.jpg">
      <img src="https://xglas.eu/versatika/images/education/campus-building-480w.jpg"
           alt="Modern educational campus with glass learning spaces"
           class="hero-bg-img" loading="eager" width="1920" height="1080">
    </picture>
  </div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class="accent-glow">Shape the Future of Education</h1>
    <p class="hero-subtitle">Innovation. Inspiration. Excellence.</p>
    <p style="font-size: 1.1rem; margin: 1.5rem 0; opacity: 0.95;">
      Smart learning spaces, sustainable materials, institutional excellence. Educational innovation through design.
    </p>
    <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
      <button class="btn-primary btn-cta">DESIGN LEARNING SPACES</button>
      <button class="btn-secondary" style="background: rgba(255,255,255,0.2); color: var(--white); border-color: var(--white);">REQUEST PROPOSAL</button>
    </div>
  </div>
  <div class="accent-line"></div>
</section>
```

---

## TEMPLATE 2: PRODUCT CARD WITH IMAGE

**Location:** Features/products grid sections

**Previous:** Text-only cards  
**Upgraded:** Image + text with hover effects

```html
<div class="feature card-hover-lift shadow-md">
  <!-- Product image container -->
  <div class="feature-image">
    <picture>
      <source media="(min-width: 768px)"
              srcset="https://xglas.eu/versatika/images/products/[product-name].jpg">
      <img src="https://xglas.eu/versatika/images/products/[product-name]-mobile.jpg"
           alt="[DESCRIPTIVE ALT TEXT]"
           class="product-img"
           loading="lazy"
           width="600" height="600">
    </picture>
  </div>

  <!-- Product content -->
  <div class="feature-content">
    <h4>[PRODUCT NAME]</h4>
    <p>[Product description with key benefits]</p>

    <!-- Feature tags -->
    <div class="feature-tags">
      <span class="badge" style="background: rgba(0, 212, 255, 0.2); color: var(--accent-bright);">
        Innovation
      </span>
      <span class="badge" style="background: rgba(0, 200, 132, 0.2); color: var(--accent-green);">
        Sustainable
      </span>
    </div>
  </div>
</div>
```

**Complete Product Grid Example:**

```html
<section class="why-us">
  <div class="container">
    <h2>Our Glass Solutions</h2>
    <div class="features-grid">

      <!-- Smart Glass -->
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
          <p>Electrochromic technology with on-demand transparency control. Perfect for corporate HQs requiring privacy and innovation.</p>
          <div class="feature-tags">
            <span class="badge" style="background: rgba(0, 212, 255, 0.2); color: var(--accent-bright);">Innovation</span>
            <span class="badge" style="background: rgba(0, 212, 255, 0.2); color: var(--accent-bright);">Smart Tech</span>
          </div>
        </div>
      </div>

      <!-- Curved Glass -->
      <div class="feature card-hover-lift shadow-md">
        <div class="feature-image">
          <picture>
            <source media="(min-width: 768px)"
                    srcset="https://xglas.eu/versatika/images/products/curved-glass.jpg">
            <img src="https://xglas.eu/versatika/images/products/curved-glass-mobile.jpg"
                 alt="Premium curved glass with advanced manufacturing precision"
                 class="product-img" loading="lazy" width="600" height="600">
          </picture>
        </div>
        <div class="feature-content">
          <h4>Curved Glass Facades</h4>
          <p>Advanced manufacturing enables complex curves. Architectural statements that define building identity and presence.</p>
          <div class="feature-tags">
            <span class="badge" style="background: rgba(0, 212, 255, 0.2); color: var(--accent-bright);">Precision</span>
            <span class="badge" style="background: rgba(0, 212, 255, 0.2); color: var(--accent-bright);">Architecture</span>
          </div>
        </div>
      </div>

      <!-- Ceramic-Printed Glass -->
      <div class="feature card-hover-lift shadow-md">
        <div class="feature-image">
          <picture>
            <source media="(min-width: 768px)"
                    srcset="https://xglas.eu/versatika/images/products/ceramic-printed.jpg">
            <img src="https://xglas.eu/versatika/images/products/ceramic-printed-mobile.jpg"
                 alt="Ceramic-printed glass with custom color options"
                 class="product-img" loading="lazy" width="600" height="600">
          </picture>
        </div>
        <div class="feature-content">
          <h4>Ceramic-Printed Glass</h4>
          <p>Custom color integration with ceramic printing technology. Unlimited design possibilities for branded environments.</p>
          <div class="feature-tags">
            <span class="badge" style="background: rgba(255, 107, 53, 0.2); color: var(--accent-orange);">Design</span>
            <span class="badge" style="background: rgba(255, 107, 53, 0.2); color: var(--accent-orange);">Custom</span>
          </div>
        </div>
      </div>

      <!-- Low-E Thermal Glass -->
      <div class="feature card-hover-lift shadow-md">
        <div class="feature-image">
          <picture>
            <source media="(min-width: 768px)"
                    srcset="https://xglas.eu/versatika/images/products/low-e-thermal.jpg">
            <img src="https://xglas.eu/versatika/images/products/low-e-thermal-mobile.jpg"
                 alt="Low-E thermal glass with advanced thermal insulation"
                 class="product-img" loading="lazy" width="600" height="600">
          </picture>
        </div>
        <div class="feature-content">
          <h4>Low-E Thermal Glass</h4>
          <p>Advanced thermal insulation with low-emissivity coatings. LEED-certified sustainability for energy-conscious projects.</p>
          <div class="feature-tags">
            <span class="badge" style="background: rgba(0, 200, 132, 0.2); color: var(--accent-green);">Sustainable</span>
            <span class="badge" style="background: rgba(0, 200, 132, 0.2); color: var(--accent-green);">LEED</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
```

---

## TEMPLATE 3: CASE STUDY SECTION

**Location:** Below hero on segment pages

**Implementation:** Two-column layout (image + text) with alternating sides

```html
<section class="case-study segment segment-[color]">
  <div class="container">
    <h2>Case Study: [Project Name]</h2>
    <div class="segment-content">

      <!-- Image side -->
      <div class="segment-image">
        <picture>
          <source media="(min-width: 1200px)"
                  srcset="https://xglas.eu/versatika/images/casestudies/[project]-1200w.jpg">
          <source media="(min-width: 768px)"
                  srcset="https://xglas.eu/versatika/images/casestudies/[project]-768w.jpg">
          <img src="https://xglas.eu/versatika/images/casestudies/[project]-480w.jpg"
               alt="[DESCRIPTIVE ALT TEXT]"
               class="case-study-img shadow-lg"
               loading="lazy"
               width="800" height="600">
        </picture>
      </div>

      <!-- Text side -->
      <div class="segment-text">
        <h3>[Project Title]</h3>
        <p>[Opening paragraph with project overview and challenge]</p>

        <!-- Key stats -->
        <div class="case-study-stats">
          <div class="stat-item">
            <h5>Project Scale</h5>
            <p>[Relevant metric]</p>
          </div>
          <div class="stat-item">
            <h5>Timeline</h5>
            <p>[Duration or milestones]</p>
          </div>
          <div class="stat-item">
            <h5>Impact</h5>
            <p>[Key achievement or benefit]</p>
          </div>
        </div>

        <!-- Quote -->
        <blockquote class="quote">
          "[Client testimonial about project impact and satisfaction]"
          <br><strong>— [Client role], [Company name]</strong>
        </blockquote>

        <!-- CTA -->
        <button class="btn-primary">View Full Case Study</button>
      </div>

    </div>
  </div>
</section>
```

**Commercial Case Study Example:**

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
          "Glas Expert transformed our vision into an architectural statement. The curved glass facade is now a defining feature of our brand identity and has increased our competitive positioning."
          <br><strong>— VP Facilities, Fortune 500 Financial Services</strong>
        </blockquote>
        <button class="btn-primary">View Full Case Study</button>
      </div>
    </div>
  </div>
</section>
```

---

## TEMPLATE 4: RESPONSIVE IMAGE WRAPPER

**For any custom image placement:**

```html
<div class="image-wrapper shadow-lg">
  <picture>
    <source media="(min-width: 1200px)" srcset="image-1200w.jpg">
    <source media="(min-width: 768px)" srcset="image-768w.jpg">
    <source media="(max-width: 767px)" srcset="image-480w.jpg">
    <img src="image-fallback.jpg"
         alt="[DESCRIPTIVE ALT TEXT]"
         loading="lazy"
         width="800" height="600"
         class="responsive-img">
  </picture>
</div>
```

**CSS for wrapper:**
```css
.image-wrapper {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
}

.responsive-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}
```

---

## TEMPLATE 5: IMAGE WITH OVERLAY TEXT

**For hero-style sections with text overlay:**

```html
<div class="hero-with-image">
  <div class="hero-background">
    <img src="https://xglas.eu/versatika/images/[image].jpg"
         alt="[ALT TEXT]"
         class="hero-bg-img"
         loading="eager">
  </div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h2 class="accent-glow">Your Heading Here</h2>
    <p>Your content here</p>
  </div>
</div>
```

---

## INTEGRATION CHECKLIST

### Before Going Live

- [ ] **Link CSS enhancement file** in `<head>`:
  ```html
  <link rel="stylesheet" href="css/polish-enhancements.css">
  ```

- [ ] **Update all hero sections** with image structure per Template 1

- [ ] **Convert feature cards** to use images per Template 2

- [ ] **Add case study sections** using Template 3

- [ ] **Test responsive images** on mobile, tablet, desktop

- [ ] **Verify xglas.eu URLs** are accessible and correct

- [ ] **Check image alt text** for accessibility compliance

- [ ] **Optimize image file sizes** (target <200KB each)

- [ ] **Test animations** in different browsers

- [ ] **Verify color contrast** (WCAG AA minimum 4.5:1)

- [ ] **Test on slow 4G** connection

- [ ] **Check accessibility** with screen reader

---

## QUICK REPLACEMENT GUIDE

**Find and Replace:**

| Find | Replace |
|------|---------|
| `class="hero"` | `class="hero segment-[color]"` |
| `.gradient-only` | `.hero-background` + `.hero-overlay` |
| Text-only cards | Feature cards with images |
| Static sections | Animated sections with polish-enhancements.css |

---

## File Structure Reference

```
glass-expert/
├── index.html (apply Template 1 hero)
├── commercial.html (apply all templates)
├── hospitality.html (apply all templates)
├── healthcare.html (apply all templates)
├── education.html (apply all templates)
├── css/
│   ├── style.css (existing styles)
│   └── polish-enhancements.css (ADD THIS)
└── images/
    └── (organize xglas.eu images here)
```

---

**Implementation Time:** 15-20 minutes per page  
**Total Project Time:** 2 hours for all pages  
**Quality:** Production-ready, accessible, optimized
