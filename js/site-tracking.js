/**
 * VAGOTECH Analytics Tracking & GDPR Consent
 *
 * Manages visitor consent, generates visitor IDs, and tracks analytics events
 * Uses localStorage for visitor ID and consent state
 */

(function() {
    // Check if consent banner already shown in this session
    if (window.vagotech_consent_initialized) return;
    window.vagotech_consent_initialized = true;

    const CONSENT_KEY = 'site_consent';
    const VISITOR_ID_KEY = 'visitor_id';
    const CONSENT_GIVEN_KEY = 'consent_given';
    const TRACK_ENDPOINT = '/api/analytics/track';

    // Segment detection: vagotech.html -> 'vagotech', everything else -> 'glassexpert'.
    // Allow per-page override via <body data-segment="..."> or window.SITE_SEGMENT.
    function getSegment() {
        if (window.SITE_SEGMENT) return window.SITE_SEGMENT;
        const bodySeg = document.body && document.body.getAttribute('data-segment');
        if (bodySeg) return bodySeg;
        return /vagotech/i.test(window.location.pathname) ? 'vagotech' : 'glassexpert';
    }

    // Generate unique visitor ID
    function generateVisitorId() {
        return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Get or create visitor ID
    function getVisitorId() {
        let visitorId = localStorage.getItem(VISITOR_ID_KEY);
        if (!visitorId) {
            visitorId = generateVisitorId();
            localStorage.setItem(VISITOR_ID_KEY, visitorId);
        }
        return visitorId;
    }

    // Check if user has consented
    function hasConsent() {
        return localStorage.getItem(CONSENT_GIVEN_KEY) === 'true';
    }

    // Show consent banner
    function showConsentBanner() {
        // Only show if consent not already given or declined
        if (localStorage.getItem(CONSENT_KEY) !== null) return;

        const banner = document.createElement('div');
        banner.id = 'vagotech-consent-banner';
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #1a3a52 0%, #2d5a7a 100%);
            color: white;
            padding: 1.5rem;
            font-size: 0.95rem;
            z-index: 9999;
            box-shadow: 0 -4px 12px rgba(0,0,0,0.15);
            font-family: system-ui, -apple-system, sans-serif;
        `;

        banner.innerHTML = `
            <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 250px;">
                    <p style="margin: 0 0 0.5rem 0; font-weight: 600;">Analytics & Visitor Tracking</p>
                    <p style="margin: 0; opacity: 0.9; font-size: 0.9rem;">We use analytics to understand how you use our site and improve your experience. <a href="/privacy.html" style="color: #ffffff; text-decoration: underline;">Learn more</a></p>
                </div>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <button id="vagotech-decline" style="
                        background: transparent;
                        border: 1px solid rgba(255,255,255,0.5);
                        color: white;
                        padding: 0.6rem 1.2rem;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 500;
                        font-size: 0.95rem;
                    ">Decline</button>
                    <button id="vagotech-accept" style="
                        background: white;
                        border: none;
                        color: #1a3a52;
                        padding: 0.6rem 1.2rem;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 0.95rem;
                    ">Accept Analytics</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Accept button
        document.getElementById('vagotech-accept').addEventListener('click', () => {
            localStorage.setItem(CONSENT_KEY, 'accepted');
            localStorage.setItem(CONSENT_GIVEN_KEY, 'true');
            banner.remove();
            // Start tracking
            initTracking();
            trackPageView();
        });

        // Decline button
        document.getElementById('vagotech-decline').addEventListener('click', () => {
            localStorage.setItem(CONSENT_KEY, 'declined');
            localStorage.setItem(CONSENT_GIVEN_KEY, 'false');
            banner.remove();
            // No tracking
        });
    }

    // Track an event
    function trackEvent(eventType, productName = null, pagePath = null, durationSeconds = 0) {
        if (!hasConsent()) return;

        const payload = {
            visitor_id: getVisitorId(),
            segment: getSegment(),
            event_type: eventType,
            product_name: productName,
            page_path: pagePath || window.location.pathname,
            duration_seconds: durationSeconds,
            device_type: getDeviceType(),
            referrer: document.referrer,
            consent: true
        };

        fetch(TRACK_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(err => console.log('Analytics tracking error:', err));
    }

    // Track page view
    function trackPageView() {
        if (!hasConsent()) return;
        trackEvent('page_view', null, window.location.pathname);
    }

    // Track page exit (before navigation)
    function trackPageExit() {
        if (!hasConsent()) return;

        const startTime = sessionStorage.getItem('page_start_time');
        const duration = startTime ? Math.floor((Date.now() - parseInt(startTime)) / 1000) : 0;

        const payload = {
            visitor_id: getVisitorId(),
            segment: getSegment(),
            event_type: 'page_exit',
            page_path: window.location.pathname,
            duration_seconds: duration,
            device_type: getDeviceType(),
            consent: true
        };

        // Use sendBeacon for reliable transmission when page unloads
        navigator.sendBeacon(TRACK_ENDPOINT, JSON.stringify(payload));
    }

    // Track product click
    function trackProductClick(productName) {
        if (!hasConsent()) return;
        trackEvent('product_click', productName);
    }

    // Detect device type
    function getDeviceType() {
        const ua = navigator.userAgent;
        if (/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua.toLowerCase())) {
            return /ipad/.test(ua.toLowerCase()) ? 'tablet' : 'mobile';
        }
        return 'desktop';
    }

    // Initialize tracking
    function initTracking() {
        // Record page start time
        sessionStorage.setItem('page_start_time', Date.now().toString());

        // Track product card clicks
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const productName = card.querySelector('h3')?.textContent;
                if (productName) trackProductClick(productName.trim());
            });
        });

        // Track page exit
        window.addEventListener('beforeunload', trackPageExit);
    }

    // Initialize on page load
    function init() {
        getVisitorId(); // Generate visitor ID immediately

        if (hasConsent()) {
            initTracking();
            trackPageView();
        } else {
            const consentStatus = localStorage.getItem(CONSENT_KEY);
            if (consentStatus === null) {
                // First time visitor - show consent banner
                showConsentBanner();
            } else if (consentStatus === 'declined') {
                // User previously declined
                return;
            }
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose public API for manual tracking
    const api = {
        trackEvent: trackEvent,
        trackPageView: trackPageView,
        trackProductClick: trackProductClick,
        getVisitorId: getVisitorId,
        hasConsent: hasConsent,
        showConsentBanner: showConsentBanner,
        getSegment: getSegment
    };
    window.siteAnalytics = api;
    window.vagotech = api; // backward-compat alias

})();
