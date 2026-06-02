/**
 * VAGOGLASS — client analytics tracker
 * ------------------------------------------------------------
 * Trimite evenimente la /api/analytics/track (segment=vagoglass).
 *
 * Caracteristici:
 *   - Respectă consimțământul cookie (`vg-cookies-v1` choice=='accept')
 *   - Visitor ID stabil în localStorage (`vg-visitor`)
 *   - Page view la load
 *   - Click pe [data-track] + link-uri externe + CTA principal
 *   - Scroll depth 25/50/75/100% via IntersectionObserver pe <section id="...">
 *   - Time on page la beforeunload (sendBeacon)
 *   - Extract UTM params + search query din referrer Google/Bing/etc
 *
 * Endpoint: POST /api/analytics/track  (CF Pages function)
 * ------------------------------------------------------------
 */
(function () {
  'use strict';

  // --- Config ---
  const ENDPOINT = '/api/analytics/track';
  const SEGMENT  = 'vagoglass';
  const CONSENT_KEY = 'vg-cookies-v1';
  const VISITOR_KEY = 'vg-visitor';

  // --- Consent gate ---
  function hasConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return false;
      const obj = JSON.parse(raw);
      return obj && obj.choice === 'accept';
    } catch (_) { return false; }
  }
  if (!hasConsent()) return; // skip silent

  // --- Visitor ID (UUID v4 best effort) ---
  function uuid() {
    if (crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  let visitorId = localStorage.getItem(VISITOR_KEY);
  if (!visitorId) {
    visitorId = uuid();
    localStorage.setItem(VISITOR_KEY, visitorId);
  }

  // --- Device detection (lightweight) ---
  function deviceType() {
    const w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  }
  const resolution = window.screen ? (window.screen.width + 'x' + window.screen.height) : null;

  // --- UTM + search query extraction ---
  const urlParams = new URLSearchParams(window.location.search);
  const utm = {
    source:   urlParams.get('utm_source')   || null,
    medium:   urlParams.get('utm_medium')   || null,
    campaign: urlParams.get('utm_campaign') || null
  };
  function extractSearchQuery(ref) {
    if (!ref) return null;
    try {
      const u = new URL(ref);
      const host = u.hostname.toLowerCase();
      // Caz Google / Bing / Yahoo / DuckDuckGo / Ecosia / Yandex
      if (/(google|bing|yahoo|duckduckgo|ecosia|yandex)\./.test(host)) {
        return u.searchParams.get('q') || u.searchParams.get('p') || null;
      }
    } catch (_) {}
    return null;
  }
  const referrer = document.referrer || null;
  const searchQuery = extractSearchQuery(referrer);

  // --- State pentru durata pe pagină ---
  const pageStart = Date.now();

  // --- Send helper ---
  function send(payload, useBeacon) {
    const body = Object.assign({
      visitor_id: visitorId,
      segment: SEGMENT,
      consent: true,
      page_path: location.pathname,
      referrer: referrer,
      device_type: deviceType(),
      device_resolution: resolution,
      utm_source: utm.source,
      utm_medium: utm.medium,
      utm_campaign: utm.campaign,
      search_query: searchQuery
    }, payload);

    const json = JSON.stringify(body);
    try {
      if (useBeacon && navigator.sendBeacon) {
        const blob = new Blob([json], { type: 'application/json' });
        navigator.sendBeacon(ENDPOINT, blob);
        return;
      }
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json,
        keepalive: true
      }).catch(() => {});
    } catch (_) { /* fail silent */ }
  }

  // --- 1) Page view ---
  send({ event_type: 'page_view' });

  // --- 2) Click delegation: [data-track] + link-uri externe + CTA principal ---
  document.addEventListener('click', function (e) {
    const el = e.target.closest('a, button, [data-track]');
    if (!el) return;

    const trackAttr = el.getAttribute('data-track');
    const isAnchor  = el.tagName === 'A';
    const href      = isAnchor ? (el.getAttribute('href') || '') : '';

    // Link extern?
    let external = false;
    if (isAnchor && href && /^https?:\/\//i.test(href)) {
      try { external = (new URL(href)).hostname !== location.hostname; } catch (_) {}
    }

    // CTA principal: .btn-primary, .cta, [data-cta]
    const isCTA = el.matches('.btn-primary, .cta, [data-cta]');

    if (!trackAttr && !external && !isCTA) return;

    send({
      event_type: trackAttr ? 'tracked_click' : (external ? 'external_link' : 'cta_click'),
      product_name: el.getAttribute('data-product') || trackAttr || null,
      section_id: (el.closest('section') || {}).id || null
    });
  }, { passive: true });

  // --- 3) Scroll depth via IntersectionObserver pe <section id="..."> ---
  const sections = document.querySelectorAll('section[id]');
  if (sections.length && 'IntersectionObserver' in window) {
    const seen = new Set();
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        if (seen.has(id)) return;
        seen.add(id);
        send({
          event_type: 'section_view',
          section_id: id
        });
      });
    }, { threshold: 0.5 });
    sections.forEach(s => obs.observe(s));
  }

  // Praguri 25/50/75/100% pe scroll
  const milestones = [25, 50, 75, 100];
  const fired = new Set();
  function checkDepth() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH <= 0) return;
    const pct = Math.min(100, Math.round((window.scrollY / docH) * 100));
    milestones.forEach(m => {
      if (pct >= m && !fired.has(m)) {
        fired.add(m);
        send({ event_type: 'scroll_depth', section_id: 'p' + m });
      }
    });
  }
  let scrollTimer = null;
  window.addEventListener('scroll', () => {
    if (scrollTimer) return;
    scrollTimer = setTimeout(() => { scrollTimer = null; checkDepth(); }, 250);
  }, { passive: true });

  // --- 4) Time on page la beforeunload (sendBeacon) ---
  window.addEventListener('beforeunload', function () {
    const dur = Math.round((Date.now() - pageStart) / 1000);
    send({ event_type: 'page_exit', duration_seconds: dur }, /*useBeacon*/ true);
  });
})();
