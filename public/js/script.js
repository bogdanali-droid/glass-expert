// ====================================
// GLAS EXPERT USA WEBSITE
// Main JavaScript
// ====================================

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

        // Collect form data
        const formData = {
            company: document.querySelector('input[name="company"]').value,
            name: document.querySelector('input[name="name"]').value,
            email: document.querySelector('input[name="email"]').value,
            phone: document.querySelector('input[name="phone"]').value,
            segment: document.querySelector('select[name="segment"]').value,
            message: document.querySelector('textarea[name="message"]').value,
            budget: document.querySelector('select[name="budget"]').value,
            timestamp: new Date().toISOString()
        };

        try {
            // Log to console (for development)
            console.log('Form submitted:', formData);

            // TODO: Integrate with backend service
            // Options: Formspree, EmailJS, Firebase, custom API

            // Show success message
            showSuccessMessage();

            // Reset form
            contactForm.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            showErrorMessage();
        }
    });
}

// SUCCESS MESSAGE
function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <div class="message-content">
            <h3>✓ Quote Request Submitted</h3>
            <p>Thank you! We'll respond within 24 hours.</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(message);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.querySelector('.success-message')) {
            document.querySelector('.success-message').remove();
        }
    }, 5000);
}

// ERROR MESSAGE
function showErrorMessage() {
    const message = document.createElement('div');
    message.className = 'error-message';
    message.innerHTML = `
        <div class="message-content">
            <h3>✗ Submission Error</h3>
            <p>Something went wrong. Please try again or contact us directly.</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(message);
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

console.log('✓ Glas Expert USA website loaded');
