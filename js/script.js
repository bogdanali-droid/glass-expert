// ====================================
// GLAS EXPERT USA WEBSITE
// Main JavaScript
// ====================================

// GLASS SELECTOR TOOL STATE
let selectorState = {
    glass: null,
    app: null,
    perf: null,
    currentStep: 1
};

const glassSpecs = {
    tempered: {
        name: 'Tempered Glass',
        specs: ['4-5x stronger than annealed', 'Breaks into safe cubes', 'ASTM C1048 certified', 'Ideal for high-traffic areas']
    },
    laminated: {
        name: 'Laminated Glass',
        specs: ['Multiple layers with PVB interlayer', 'Stays intact when broken', 'ASTM C1172 certified', 'Excellent for safety and soundproofing']
    },
    curved: {
        name: 'Curved Glass',
        specs: ['Custom-bent architectural shapes', 'Rare manufacturing capability', 'Complex radius options', 'Premium architectural feature']
    },
    ceramic: {
        name: 'Ceramic-Printed Glass',
        specs: ['Screen-printed enamel design', 'Permanent custom colors/patterns', 'Fused at 700-800°C', 'Customizable branding']
    }
};

function selectGlassType(type) {
    selectorState.glass = type;
    document.querySelectorAll('#step1 .selector-option').forEach(btn => btn.classList.remove('selected'));
    // Handle both direct click and nested element clicks
    const button = event.target.closest('.selector-option');
    if (button) {
        button.classList.add('selected');
        console.log('Glass type selected:', type);
    }
}

function selectApplication(app) {
    selectorState.app = app;
    document.querySelectorAll('#step2 .selector-option').forEach(btn => btn.classList.remove('selected'));
    // Handle both direct click and nested element clicks
    const button = event.target.closest('.selector-option');
    if (button) {
        button.classList.add('selected');
        console.log('Application selected:', app);
    }
}

function selectPerformance(perf) {
    selectorState.perf = perf;
    document.querySelectorAll('#step3 .selector-option').forEach(btn => btn.classList.remove('selected'));
    // Handle both direct click and nested element clicks
    const button = event.target.closest('.selector-option');
    if (button) {
        button.classList.add('selected');
        console.log('Performance need selected:', perf);
    }
}

function nextStep() {
    if (selectorState.currentStep === 1 && !selectorState.glass) {
        showValidationError('Please select a glass type');
        return;
    }
    if (selectorState.currentStep === 2 && !selectorState.app) {
        showValidationError('Please select an application');
        return;
    }
    if (selectorState.currentStep === 3 && !selectorState.perf) {
        showValidationError('Please select a performance need');
        return;
    }

    selectorState.currentStep++;
    updateSelectorDisplay();
    console.log('Advanced to step:', selectorState.currentStep);
}

function prevStep() {
    if (selectorState.currentStep > 1) {
        selectorState.currentStep--;
        updateSelectorDisplay();
        console.log('Returned to step:', selectorState.currentStep);
    }
}

function showResult() {
    selectorState.currentStep = 4;
    updateSelectorDisplay();
    displayResult();
}

function updateSelectorDisplay() {
    document.querySelectorAll('.selector-step').forEach(step => step.classList.remove('active'));
    document.getElementById(`step${selectorState.currentStep}`).classList.add('active');
}

function displayResult() {
    const specs = glassSpecs[selectorState.glass];
    document.getElementById('resultTitle').textContent = specs.name;
    document.getElementById('resultBadge').textContent = `Perfect for ${selectorState.app}`;

    const specsList = document.getElementById('resultSpecs');
    specsList.innerHTML = specs.specs.map(spec => `<li>✓ ${spec}</li>`).join('');

    console.log('Glass Selection:', {
        type: selectorState.glass,
        application: selectorState.app,
        performance: selectorState.perf
    });
}

// HAMBURGER MENU
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
}

// SMOOTH SCROLL NAVIGATION
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (navMenu && window.innerWidth <= 768) {
                navMenu.style.display = 'none';
            }
        }
    });
});

// CONTACT FORM HANDLING
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');

        // Collect form data (use optional chaining so missing fields don't throw)
        const formData = {
            company: contactForm.querySelector('input[name="company"]')?.value || '',
            name: contactForm.querySelector('input[name="name"]')?.value || '',
            email: contactForm.querySelector('input[name="email"]')?.value || '',
            phone: contactForm.querySelector('input[name="phone"]')?.value || '',
            segment: contactForm.querySelector('select[name="segment"]')?.value || '',
            message: contactForm.querySelector('textarea[name="message"]')?.value || '',
            budget: contactForm.querySelector('select[name="budget"]')?.value || ''
        };

        // Loading state — disable button + show progress, store label to restore
        const originalLabel = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.dataset.loading = 'true';
            submitBtn.textContent = 'Sending…';
        }

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            let result = {};
            try {
                result = await response.json();
            } catch (_) {
                // Non-JSON response (e.g. proxy/HTML error page)
            }

            if (response.ok && result.success) {
                showSuccessMessage(result.message);
                contactForm.reset();
            } else {
                showErrorMessage(result.message);
            }
        } catch (error) {
            // Network failure / offline
            console.error('Form submission error:', error);
            showErrorMessage();
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                delete submitBtn.dataset.loading;
                submitBtn.textContent = originalLabel;
            }
        }
    });
}

// Small helper: escape text injected into message markup
function escapeMessageHtml(value) {
    const div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
}

// SUCCESS MESSAGE
function showSuccessMessage(customMessage) {
    const text = customMessage
        ? escapeMessageHtml(customMessage)
        : "Thank you! We'll respond within 24 hours.";
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <div class="message-content">
            <h3>✓ Quote Request Submitted</h3>
            <p>${text}</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(message);

    // Auto-remove after 6 seconds
    setTimeout(() => {
        if (document.querySelector('.success-message')) {
            document.querySelector('.success-message').remove();
        }
    }, 6000);
}

// ERROR MESSAGE
function showErrorMessage(customMessage) {
    const text = customMessage
        ? escapeMessageHtml(customMessage)
        : 'Something went wrong. Please try again or call +1-609-408-8100.';
    const message = document.createElement('div');
    message.className = 'error-message';
    message.innerHTML = `
        <div class="message-content">
            <h3>✗ Submission Error</h3>
            <p>${text}</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(message);

    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (document.querySelector('.error-message')) {
            document.querySelector('.error-message').remove();
        }
    }, 8000);
}

// VALIDATION ERROR MESSAGE (for selector validation)
function showValidationError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-error';
    errorDiv.innerHTML = `
        <div class="validation-content">
            <p>⚠️ ${message}</p>
        </div>
    `;
    document.body.appendChild(errorDiv);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (document.querySelector('.validation-error')) {
            document.querySelector('.validation-error').remove();
        }
    }, 3000);

    console.warn('Validation error:', message);
}

// ADD INLINE STYLES FOR MESSAGES
const style = document.createElement('style');
style.textContent = `
    .success-message, .error-message {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        max-width: 400px;
    }

    .success-message {
        background: #27ae60;
        color: white;
    }

    .error-message {
        background: #e74c3c;
        color: white;
    }

    .message-content {
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }

    .message-content h3 {
        margin-bottom: 0.5rem;
    }

    .message-content p {
        margin-bottom: 1rem;
        font-size: 0.95rem;
    }

    .message-content button {
        background: rgba(255,255,255,0.2);
        color: white;
        border: 1px solid rgba(255,255,255,0.3);
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .message-content button:hover {
        background: rgba(255,255,255,0.3);
    }

    @media (max-width: 768px) {
        .success-message, .error-message {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }

    /* Submit button loading state */
    button[type="submit"][data-loading="true"] {
        opacity: 0.7;
        cursor: progress;
        position: relative;
    }
    button[type="submit"]:disabled {
        cursor: not-allowed;
    }

    /* Validation Error Styles */
    .validation-error {
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 999;
        max-width: 400px;
        background: #FFF3CD;
        border: 1px solid #FFE69C;
        color: #856404;
    }

    .validation-content {
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        font-weight: 500;
        text-align: center;
    }

    .validation-content p {
        margin: 0;
        font-size: 0.95rem;
    }

    @media (max-width: 480px) {
        .validation-error {
            top: 70px;
            left: 10px;
            right: 10px;
            transform: none;
            max-width: none;
        }
    }
`;
document.head.appendChild(style);

// ANALYTICS TRACKING (Optional - Google Analytics integration point)
function trackEvent(category, action, label) {
    if (window.gtag) {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// Track form submission
if (contactForm) {
    contactForm.addEventListener('submit', () => {
        trackEvent('Form', 'Submit', 'Quote Request');
    });
}

// LAZY LOADING FOR IMAGES (if added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// WINDOW RESIZE - HAMBURGER MENU FIX
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        if (navMenu) navMenu.style.display = 'flex';
    }
});

// ============================================================
// REDESIGN V2 — SCROLL ANIMATIONS (Intersection Observer)
// Fades in elements with class .fade-in when they enter viewport
// ============================================================

(function initScrollAnimations() {
    'use strict';

    if (!('IntersectionObserver' in window)) {
        // Fallback: just make everything visible
        document.querySelectorAll('.fade-in').forEach(function(el) {
            el.classList.add('visible');
        });
        return;
    }

    var fadeObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -48px 0px'
    });

    // Observe all .fade-in elements
    document.querySelectorAll('.fade-in').forEach(function(el) {
        fadeObserver.observe(el);
    });

    // Also observe elements added dynamically (re-scan on DOMContentLoaded)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.fade-in:not([data-observed])').forEach(function(el) {
                el.setAttribute('data-observed', '1');
                fadeObserver.observe(el);
            });
        });
    }
}());

// REDESIGN V2 — HAMBURGER MENU (navbar-v2)
(function initNavbarV2() {
    'use strict';

    var hamburger = document.getElementById('hamburger');
    var navMenuV2 = document.getElementById('nav-menu');

    if (!hamburger || !navMenuV2) return;

    hamburger.addEventListener('click', function() {
        var isOpen = navMenuV2.classList.contains('open');
        if (isOpen) {
            navMenuV2.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        } else {
            navMenuV2.classList.add('open');
            hamburger.setAttribute('aria-expanded', 'true');
        }
    });

    // Close menu when a nav link is clicked (mobile)
    navMenuV2.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            navMenuV2.classList.remove('open');
        });
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenuV2.contains(e.target)) {
            navMenuV2.classList.remove('open');
        }
    });
}());

// Initialize Feather Icons
if (typeof feather !== 'undefined') {
    feather.replace();
}

console.log('✓ Glas Expert USA website loaded');
