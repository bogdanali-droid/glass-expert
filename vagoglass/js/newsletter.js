/**
 * VAGOGLASS newsletter form handler
 * Attaches to any form with data-newsletter-form attribute.
 * Submits to /api/newsletter/subscribe, displays inline success/error.
 */
(function () {
    'use strict';

    function detectLanguage() {
        const htmlLang = (document.documentElement.lang || 'ro').toLowerCase();
        return htmlLang.startsWith('en') ? 'en' : 'ro';
    }

    function t(key, lang) {
        const dict = {
            ro: {
                submitting: 'Se trimite…',
                submit: 'Abonează-mă',
                generic_error: 'Eroare temporară. Încearcă din nou.',
                network_error: 'Eroare de rețea. Verifică conexiunea.',
                invalid_email: 'Adresă de email invalidă.',
                consent_required: 'Trebuie să accepți politica GDPR.'
            },
            en: {
                submitting: 'Sending…',
                submit: 'Subscribe',
                generic_error: 'Temporary error. Please try again.',
                network_error: 'Network error. Check your connection.',
                invalid_email: 'Invalid email address.',
                consent_required: 'You must accept the GDPR consent.'
            }
        };
        return (dict[lang] || dict.ro)[key];
    }

    function setStatus(form, type, message) {
        let statusEl = form.querySelector('[data-newsletter-status]');
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.setAttribute('data-newsletter-status', '');
            statusEl.className = 'newsletter-status';
            form.appendChild(statusEl);
        }
        statusEl.textContent = message || '';
        statusEl.className = 'newsletter-status newsletter-status--' + (type || 'info');
        statusEl.style.display = message ? 'block' : 'none';
    }

    async function handleSubmit(form, event) {
        event.preventDefault();
        const lang = detectLanguage();
        const btn = form.querySelector('button[type="submit"], [data-submit-btn]');
        const originalBtnText = btn ? btn.textContent : '';

        const email = (form.querySelector('[name="email"]')?.value || '').trim();
        const name = (form.querySelector('[name="name"]')?.value || '').trim();
        const company = (form.querySelector('[name="company"]')?.value || '').trim();
        const segmentInterest = (form.querySelector('[name="segment_interest"]')?.value || 'all').trim();
        const consentEl = form.querySelector('[name="consent_marketing"]');
        const consent = consentEl ? consentEl.checked : true;
        const source = form.getAttribute('data-source') || 'homepage';

        // Client-side validation
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)) {
            setStatus(form, 'error', t('invalid_email', lang));
            return;
        }
        if (!consent) {
            setStatus(form, 'error', t('consent_required', lang));
            return;
        }

        if (btn) {
            btn.disabled = true;
            btn.textContent = t('submitting', lang);
        }
        setStatus(form, 'info', '');

        try {
            const resp = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    name: name || null,
                    company: company || null,
                    segment_interest: segmentInterest,
                    language: lang,
                    source,
                    consent_marketing: consent
                })
            });

            let data;
            try {
                data = await resp.json();
            } catch {
                data = { success: false, message: t('generic_error', lang) };
            }

            if (resp.ok && data.success) {
                setStatus(form, 'success', data.message || (lang === 'en'
                    ? 'Almost done! Check your inbox to confirm.'
                    : 'Aproape gata! Verifică inbox-ul.'));
                form.reset();
            } else {
                setStatus(form, 'error', data.message || t('generic_error', lang));
            }
        } catch (err) {
            setStatus(form, 'error', t('network_error', lang));
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = originalBtnText || t('submit', lang);
            }
        }
    }

    function init() {
        const forms = document.querySelectorAll('[data-newsletter-form]');
        forms.forEach(function (form) {
            form.addEventListener('submit', function (e) { handleSubmit(form, e); });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
