# AUTO-DEPLOY VERIFICATION CHECKLIST
## Glass Expert USA — Cloudflare Pages Deployment

**Version:** 1.0  
**Last Updated:** 2026-06-02  
**Status:** ACTIVE  

---

## PRE-DEPLOYMENT VALIDATION (Automated in GitHub Actions)

### Stage 1: Code Quality (5 minutes)

**✓ File Integrity Check**
```bash
# Verify all critical files exist
test -f index.html           # ✓ Should exist
test -f css/style.css        # ✓ Should exist
test -f js/script.js         # ✓ Should exist
test -f wrangler.toml        # ✓ Should exist
```

**✓ HTML Structure Validation**
- [ ] All HTML files have valid DOCTYPE
- [ ] All HTML files have proper <head> tags
- [ ] All HTML files have <meta charset="UTF-8">
- [ ] All HTML files have <meta viewport>
- [ ] No syntax errors in HTML

**Command to validate:**
```bash
# Manual validation (if needed)
grep -l "<!DOCTYPE html>" *.html  # Should list all files
```

**✓ CSS Validation**
- [ ] No syntax errors in style.css
- [ ] All CSS variables defined in :root
- [ ] No missing semicolons
- [ ] File size <20KB unminified

**File size check:**
```bash
du -h css/style.css  # Should be ~16KB
```

**✓ JavaScript Validation**
- [ ] No JavaScript syntax errors
- [ ] All function calls have matching definitions
- [ ] No missing semicolons
- [ ] File size <15KB unminified

**File size check:**
```bash
du -h js/script.js  # Should be ~12KB
```

---

## POST-DEPLOYMENT VERIFICATION (Automated in GitHub Actions)

### Stage 2: Deployment Success (2 minutes)

**✓ HTTP Response Codes**

| Page | Expected | Check |
|------|----------|-------|
| `https://glass-expert.pages.dev/` | 200 | `curl -I https://glass-expert.pages.dev/` |
| `https://glass-expert.pages.dev/index.html` | 200 | Should redirect to `/` |
| `https://glass-expert.pages.dev/commercial.html` | 200 | Check with curl |
| `https://glass-expert.pages.dev/hospitality.html` | 200 | Check with curl |
| `https://glass-expert.pages.dev/healthcare.html` | 200 | Check with curl |
| `https://glass-expert.pages.dev/education.html` | 200 | Check with curl |
| `https://glass-expert.pages.dev/css/style.css` | 200 | Assets must load |
| `https://glass-expert.pages.dev/js/script.js` | 200 | Assets must load |

**Verification script:**
```bash
#!/bin/bash
URL="https://glass-expert.pages.dev"

# Test main pages
for page in "" index.html commercial.html hospitality.html healthcare.html education.html; do
  response=$(curl -s -o /dev/null -w "%{http_code}" "$URL/$page")
  echo "[$URL/$page]: HTTP $response"
  test "$response" = "200" && echo "✓ PASS" || echo "✗ FAIL"
done

# Test assets
for asset in css/style.css js/script.js; do
  response=$(curl -s -o /dev/null -w "%{http_code}" "$URL/$asset")
  echo "[$URL/$asset]: HTTP $response"
  test "$response" = "200" && echo "✓ PASS" || echo "✗ FAIL"
done
```

---

### Stage 3: Page Performance (5 minutes)

**✓ Page Load Time**
- [ ] Homepage loads in <2 seconds
- [ ] All pages load in <3 seconds
- [ ] No console JavaScript errors

**Test with browser DevTools:**
1. Open https://glass-expert.pages.dev/
2. Press F12 (Developer Tools)
3. Go to Network tab
4. Reload page
5. Check "Finish" time (should be <2s)

**✓ Gzip Compression**
- [ ] CSS is served with gzip/brotli (Cloudflare default)
- [ ] JavaScript is compressed
- [ ] HTML is compressed

**Check compression:**
```bash
curl -I https://glass-expert.pages.dev/ | grep -i "content-encoding"
# Should show: Content-Encoding: gzip or br
```

**✓ Cache Headers**
- [ ] Static assets have long cache TTL
- [ ] HTML has appropriate cache TTL

**Check cache headers:**
```bash
curl -I https://glass-expert.pages.dev/css/style.css
# Should show: Cache-Control headers

curl -I https://glass-expert.pages.dev/
# Should show: Cache-Control headers
```

---

### Stage 4: Functionality Verification (5 minutes)

**✓ Navigation Works**
- [ ] Home link navigates correctly
- [ ] Commercial link navigates to #commercial section
- [ ] Hospitality link navigates to #hospitality section
- [ ] Healthcare link navigates to #healthcare section
- [ ] Education link navigates to #education section
- [ ] Contact link scrolls to contact form

**Manual test:**
1. Open https://glass-expert.pages.dev/
2. Click each navigation link
3. Verify smooth scroll to correct section

**✓ Interactive Elements**
- [ ] Glass selector buttons are clickable
- [ ] Next/Back buttons work
- [ ] Form inputs accept text
- [ ] Submit button is clickable

**Manual test:**
1. Scroll to "Find Your Perfect Glass" section
2. Click glass type buttons (should highlight)
3. Click "Next" (should advance to step 2)
4. Click "Back" (should go back to step 1)

**✓ Responsive Design**
- [ ] Desktop view: All content visible, navigation horizontal
- [ ] Tablet view (768px): Content adapts, navigation adjusts
- [ ] Mobile view (375px): Hamburger menu appears, content stacks

**Test responsive:**
1. Open DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Test at: 1920px, 768px, 375px widths
4. Verify layout adapts correctly

---

### Stage 5: Browser Compatibility (3 minutes)

**✓ Test on Modern Browsers**
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Quick browser check:**
```
All browsers should show:
- Clean layout
- No console errors
- All assets load
- Navigation works
- Form submits
```

---

### Stage 6: SEO & Security (5 minutes)

**✓ SEO Essentials**
- [ ] Page has <title> tag
- [ ] Page has <meta description>
- [ ] Heading hierarchy is correct (H1, H2, H3)
- [ ] Images have alt text (when added)
- [ ] Links have descriptive text

**Check title and description:**
```bash
curl https://glass-expert.pages.dev/ | grep -E "<title>|<meta name=\"description\""
```

**✓ Security Headers**
- [ ] X-Content-Type-Options set to nosniff
- [ ] X-Frame-Options set to SAMEORIGIN
- [ ] HTTPS only (no HTTP)

**Check headers:**
```bash
curl -I https://glass-expert.pages.dev/ | grep -E "X-Content-Type|X-Frame|Strict-Transport"
```

---

## AUTOMATED VERIFICATION WORKFLOW

### GitHub Actions Runs These Checks Automatically

```yaml
# On every push to claude/gallant-meitner-UJzXt:

1. Validation Stage (pre-deploy)
   ✓ File size check
   ✓ Critical files exist
   ✓ HTML structure valid
   ✓ CSS/JS present

2. Deploy Stage
   ✓ Deploy to Cloudflare Pages
   ✓ Wait for DNS propagation (5s)

3. Verification Stage (post-deploy)
   ✓ Test all page URLs
   ✓ Test all asset URLs
   ✓ Verify HTTP 200 responses
   ✓ Log deployment status
```

### Access GitHub Actions Results

1. Go to: https://github.com/bogdanali-droid/glass-expert
2. Click "Actions" tab
3. Click latest workflow run
4. Expand "Deploy to Cloudflare Pages" step
5. Review console output
6. Check for ✓ or ✗ marks

---

## MANUAL VERIFICATION CHECKLIST

**After each deployment, manually verify:**

### Quick 2-Minute Check
- [ ] Site loads at https://glass-expert.pages.dev/
- [ ] Click one navigation link (verify it works)
- [ ] Check browser DevTools (no red errors)
- [ ] Check page size (<100KB loaded)

### Full 15-Minute Check
- [ ] All sections load correctly
- [ ] All images/placeholders display
- [ ] Form inputs work
- [ ] Navigation links work
- [ ] Mobile responsive (test on phone)
- [ ] No console errors (F12 → Console)
- [ ] Page speed <2s (F12 → Network tab)

### Before Declaring Success
- [ ] Homepage works
- [ ] All pages accessible
- [ ] No 404 errors in console
- [ ] Performance acceptable
- [ ] Mobile responsive

---

## PERFORMANCE BASELINE (Target Metrics)

### Expected Metrics After Optimization

| Metric | Target | Acceptable | Investigate |
|--------|--------|-----------|---|
| Lighthouse Performance | >90 | 85-90 | <85 |
| Largest Contentful Paint | <2.5s | <3.0s | >3.0s |
| First Contentful Paint | <1.8s | <2.0s | >2.0s |
| Cumulative Layout Shift | <0.1 | <0.15 | >0.15 |
| Load time (fully loaded) | <2s | <2.5s | >2.5s |
| Time to Interactive | <3.5s | <4.0s | >4.0s |

### Check Lighthouse Score

1. Go to: https://pagespeed.web.dev/
2. Enter: https://glass-expert.pages.dev/
3. Click "Analyze"
4. Review metrics:
   - Performance: Should be >90
   - Accessibility: Should be >95
   - Best Practices: Should be >95
   - SEO: Should be >95

---

## ROLLBACK PROCEDURE

**If deployment fails critical verification:**

### Immediate Actions
1. Check deployment status in GitHub Actions
2. Review error messages in workflow logs
3. Determine root cause

### Common Issues & Fixes

**Issue: Site returns 404**
```
Cause: Cloudflare not synced yet
Fix: Wait 30 seconds and refresh
Check: curl https://glass-expert.pages.dev/
```

**Issue: CSS/JS not loading**
```
Cause: Asset paths incorrect
Fix: Check file paths in HTML
Check: curl https://glass-expert.pages.dev/css/style.css
```

**Issue: Performance degraded**
```
Cause: Large files, missing optimization
Fix: Review file sizes
Check: du -h css/ js/
```

### Rollback Steps

**If site is broken:**
```bash
# Option 1: Revert commit
git revert HEAD
git push origin claude/gallant-meitner-UJzXt
# Cloudflare auto-deploys previous version (2 min)

# Option 2: Manual Cloudflare Pages revert
# In Cloudflare Dashboard:
# 1. Go to Pages → glass-expert
# 2. Click "Deployments" tab
# 3. Find previous successful deployment
# 4. Click "Rollback to this deployment"
```

**Expected rollback time:** <5 minutes

---

## MONITORING & ALERTS

### Setup Continuous Monitoring

**Option 1: Cloudflare Analytics**
1. Cloudflare Dashboard → Websites → glass-expert
2. Analytics → Check performance metrics
3. Uptime status (should be 100%)

**Option 2: Uptime Robot**
1. Visit: https://uptimerobot.com/
2. Create monitor for: https://glass-expert.pages.dev/
3. Set check interval: 5 minutes
4. Set alert: Email on down

**Option 3: Google Search Console**
1. Add property: https://glass-expert.pages.dev/
2. Monitor Core Web Vitals
3. Check for crawl errors

---

## POST-DEPLOYMENT SIGN-OFF

**Verification completed by:** _______________________

**Date & Time:** _______________________

**All checks passed:** [ ] YES  [ ] NO

**Issues found:** _______________________

**Action items:** _______________________

**Next review date:** 2026-06-09

---

## AUTOMATION NOTES

This checklist is partially automated via GitHub Actions:
- Validation and deployment are 100% automated
- Performance monitoring requires manual setup
- Uptime monitoring requires external service
- Lighthouse scores require manual checks

**Recommended frequency:**
- Deploy verification: After every push
- Performance check: Weekly
- Uptime monitoring: Continuous
- Lighthouse audit: Monthly

---

**For issues or questions:**
- Check GitHub Actions logs: https://github.com/bogdanali-droid/glass-expert/actions
- Contact: @lucian (Tech Lead)
- Escalation: AXA IT Support
