/**
 * Oréon – Main JS
 * Navigation, GSAP Animationen, Utils
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initGSAPAnimations();
    initHeroParticles();
    initContactForm();
    updateCartBadge();
});

// ========== Navigation ==========
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect
    if (navbar && !navbar.classList.contains('scrolled')) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Mobile toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }
}

function initGSAPAnimations() {
    // =====KI=====
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // KI GENERIERT: Reveal Animations (ScrollTrigger)
    gsap.utils.toArray('.reveal').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    gsap.utils.toArray('.reveal-left').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, x: -40 },
            {
                opacity: 1, x: 0, duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    gsap.utils.toArray('.reveal-right').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, x: 40 },
            {
                opacity: 1, x: 0, duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    gsap.utils.toArray('.reveal-scale').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, scale: 0.9 },
            {
                opacity: 1, scale: 1, duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // KI GENERIERT: Hero Stagger Animation
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const heroElements = heroContent.children;
        gsap.fromTo(heroElements,
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                delay: 0.3
            }
        );
    }

    // KI GENERIERT: Product Cards Stagger
    const productGrids = document.querySelectorAll('.products-grid');
    productGrids.forEach(grid => {
        const observer = new MutationObserver(() => {
            const cards = grid.querySelectorAll('.product-card');
            if (cards.length > 0) {
                gsap.fromTo(cards,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1, y: 0,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: 'power2.out'
                    }
                );
                observer.disconnect();
            }
        });
        observer.observe(grid, { childList: true });
    });

    // KI GENERIERT: Feature Cards Hover Feedback
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card.querySelector('.feature-icon'), {
                scale: 1.2, rotation: 10, duration: 0.3, ease: 'power2.out'
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card.querySelector('.feature-icon'), {
                scale: 1, rotation: 0, duration: 0.3, ease: 'power2.out'
            });
        });
    });

    // ============
}

// ========== Hero Particles ==========
function initHeroParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    // =====KI=====
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 6) + 's';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }

    // ============
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        showToast('Nachricht gesendet! Wir melden uns bald.', 'success');
        contactForm.reset();
    });
}

// ========== Toast Notifications ==========
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span> ${escapeHtml(message)}`;

    container.appendChild(toast);

    // =====KI=====
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(toast,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
        );
    }

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3500);

    // ============
}

// ========== Utils ==========
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function getUrlParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}
