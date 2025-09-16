// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initStickyHeader();
    initContactForm();
    initCookieConsent();
    
    // Check if page was loaded with a hash (for direct navigation to sections)
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            setTimeout(() => {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }, 500);
        }
    }
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Sticky header functionality
function initStickyHeader() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitButton = document.getElementById('submit-button');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            submitButton.disabled = true;
            submitButton.innerHTML = '<div class="loading"></div> Sending...';
            
            // Simulate form submission
            setTimeout(function() {
                formMessage.style.display = 'block';
                formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                formMessage.className = 'form-message success';
                contactForm.reset();
                
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send Message';
                
                // Track form submission with analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'contact_form_submission', {
                        'event_category': 'engagement',
                        'event_label': 'Contact Form'
                    });
                }
            }, 1500);
        });
    }
}

// Cookie consent functionality
function initCookieConsent() {
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptCookies = document.getElementById('accept-cookies');
    const rejectCookies = document.getElementById('reject-cookies');
    
    // Check if user has already made a choice
    if (!localStorage.getItem('cookieConsent')) {
        // Show banner after a delay
        setTimeout(function() {
            cookieConsent.style.display = 'block';
        }, 2000);
    }
    
    if (acceptCookies) {
        acceptCookies.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieConsent.style.display = 'none';
            
            // Enable analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'analytics_storage': 'granted'
                });
            }
        });
    }
    
    if (rejectCookies) {
        rejectCookies.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'rejected');
            cookieConsent.style.display = 'none';
            
            // Disable analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'analytics_storage': 'denied'
                });
            }
        });
    }
    
    // Initialize analytics based on user consent
    if (typeof gtag !== 'undefined') {
        const consent = localStorage.getItem('cookieConsent');
        gtag('consent', 'default', {
            'analytics_storage': consent === 'accepted' ? 'granted' : 'denied'
        });
    }
}