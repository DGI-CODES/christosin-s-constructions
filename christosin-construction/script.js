

// DOM Elements (safe selectors)
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const statNumbers = document.querySelectorAll('.stat-number');

// Mobile Navigation Toggle (guarded)
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });
}

// Close mobile menu when clicking on a nav link (guarded)
if (navLinks && navLinks.length) {
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            const icon = navToggle ? navToggle.querySelector('i') : null;
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }

            // Update active nav link
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// Project Filtering (guarded)
if (filterButtons && filterButtons.length && projectCards) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Animated Counter for Statistics (requestAnimationFrame-based)
function animateCounter() {
    statNumbers.forEach(stat => {
        const raw = stat.getAttribute('data-count');
        const target = Number.parseInt(raw, 10) || 0;
        const duration = 2000; // milliseconds
        if (target <= 0) {
            stat.textContent = '0+';
            return;
        }

        const startTime = performance.now();
        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.floor(progress * target);
            stat.textContent = value + '+';
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                stat.textContent = target + '+';
            }
        }
        requestAnimationFrame(tick);
    });
}

// Check if element is in viewport for animation triggers
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

// Handle scroll animations
function handleScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-card, .animate-fade-left, .animate-fade-right');

    animatedElements.forEach(element => {
        if (isInViewport(element)) {
            const animation = element.style.animation;
            if (!animation || animation === 'none') {
                // Trigger reflow to restart animation
                void element.offsetWidth;
                element.style.animation = getComputedStyle(element).animation;
            }
        }
    });

    // Trigger counter animation when stats section is in view
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection && isInViewport(statsSection)) {
        if (!statsSection.classList.contains('animated')) {
            statsSection.classList.add('animated');
            animateCounter();
        }
    }
}

// Smooth scrolling for anchor links (guarded)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Update active nav link (guarded)
            if (navLinks && navLinks.length) {
                navLinks.forEach(link => link.classList.remove('active'));
                const correspondingNavLink = document.querySelector(`a[href="${targetId}"]`);
                if (correspondingNavLink) correspondingNavLink.classList.add('active');
            }

            // Scroll to element
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize animations on page load
window.addEventListener('DOMContentLoaded', () => {
    handleScrollAnimations();

    // Add scroll event listener for animations
    window.addEventListener('scroll', handleScrollAnimations);

    // Add hover effect to social icons
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) rotate(10deg)';
        });

        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0)';
        });
    });
});

// Parallax effect for hero section (guarded)
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset || document.documentElement.scrollTop;
        const rate = scrolled * 0.5;
        hero.style.backgroundPosition = `center ${-rate}px`;
    }
});

// sendMail with defensive checks and corrected clearing of fields
function sendMail() {
    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("email");
    const phoneEl = document.getElementById("number"); 
    const messageEl = document.getElementById("message");
    const serviceEl = document.getElementById("service");

    const params = {
        name: nameEl ? nameEl.value : '',
        email: emailEl ? emailEl.value : '',
        number: phoneEl ? phoneEl.value : '',
        message: messageEl ? messageEl.value : '',
        service: serviceEl ? serviceEl.value : ''
    };

    const serviceID = "service_c6t2ttp"; 
    const templateID = "template_m44yqpg"; 

    if (typeof emailjs === 'undefined' || !emailjs.send) {
        alert('Email sending is not available: EmailJS library is not loaded. Please include and init EmailJS.');
        return;
    }

    emailjs.send(serviceID, templateID, params)
        .then(res => {
            if (nameEl) nameEl.value = "";
            if (emailEl) emailEl.value = "";
            if (phoneEl) phoneEl.value = "";
            if (serviceEl) serviceEl.value = "";
            if (messageEl) messageEl.value = "";
            console.log(res);
            alert("Your message was sent successfully!");
        })
        .catch(err => {
            console.log(err);
            alert("Failed to send message. Please try again.");
        });
}

// Attach submit handler to button (guarded)
const bt = document.querySelector('.btn-submit');

if (bt) {
    bt.addEventListener("click", function(e) {
        e.preventDefault();
        sendMail();
    });
}