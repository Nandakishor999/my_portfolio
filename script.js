/**
 * NANDAKISHOR KALAGARLA — Premium Portfolio
 * Main Interactivity & Animations
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================
       PAGE LOADER
       ========================================================== */
    const pageLoader = document.getElementById('pageLoader');

    // Wait a little bit for the fill animation, then hide loader
    setTimeout(() => {
        pageLoader.classList.add('loaded');
        // Trigger hero animations slightly after loader fades
        setTimeout(() => {
            document.querySelectorAll('.hero .reveal').forEach(el => {
                el.classList.add('revealed');
            });
        }, 300);
    }, 1800);

    /* ==========================================================
       THEME TOGGLE (Dark Mode)
       ========================================================== */
    const themeToggle = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;

    // Check localStorage for theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlEl.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    /* ==========================================================
       CUSTOM CURSOR (Animated)
       ========================================================== */
    const cursor = document.getElementById('customCursor');
    const cursorDot = document.getElementById('cursorDot');

    // Only activate cursor tracking if we have mouse support (desktop)
    if (window.matchMedia("(pointer: fine)").matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = window.innerWidth / 2;
        let cursorY = window.innerHeight / 2;

        // Animation loop for smooth trailing effect
        function animateCursor() {
            // Lerp (Linear Interpolation) for smooth trailing
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;

            if (cursor) {
                cursor.style.left = cursorX + 'px';
                cursor.style.top = cursorY + 'px';
            }

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (cursorDot) {
                cursorDot.style.left = mouseX + 'px';
                cursorDot.style.top = mouseY + 'px';
            }

            if (cursor && !cursor.classList.contains('visible')) {
                cursor.classList.add('visible');
                if (cursorDot) cursorDot.classList.add('visible');
            }
        });

        // Hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .skill-card, .explore-tag, .tech-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });

        const projectCards = document.querySelectorAll('.project-dashboard');
        projectCards.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('project-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('project-hover'));
        });
    }

    /* ==========================================================
       SCROLL PROGRESS BAR
       ========================================================== */
    const scrollProgress = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = progress + '%';
    });

    /* ==========================================================
       NAVBAR BEHAVIOR
       ========================================================== */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('#navLinks a');

    window.addEventListener('scroll', () => {
        // Glassmorphism on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === currentSection) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================
       MOBILE MENU
       ========================================================== */
    const navHamburger = document.getElementById('navHamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('[data-mobile-link]');
    let menuOpen = false;

    function toggleMenu() {
        menuOpen = !menuOpen;
        navHamburger.setAttribute('aria-expanded', menuOpen);

        if (menuOpen) {
            navHamburger.classList.add('open');
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            navHamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    navHamburger.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuOpen) toggleMenu();
        });
    });

    /* ==========================================================
       INTERSECTION OBSERVER (Scroll Reveals)
       ========================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        // Don't observe hero elements, they are animated by the loader
        if (!el.closest('.hero')) {
            revealObserver.observe(el);
        }
    });

    /* ==========================================================
       SKILL FILTERING
       ========================================================== */
    const filterBtns = document.querySelectorAll('.skills-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.dataset.filter;

            skillCards.forEach(card => {
                if (filterValue === 'all' || card.dataset.category === filterValue) {
                    card.classList.remove('hide');
                    // Trigger slight animation
                    card.style.animation = 'none';
                    card.offsetHeight; // trigger reflow
                    card.style.animation = null;
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    /* ==========================================================
       PROJECT MODAL
       ========================================================== */
    const modalOverlay = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const viewProjectBtn = document.getElementById('viewProjectBtn');
    const projectDashboard = document.getElementById('projectDashboard');

    function openModal() {
        modalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (viewProjectBtn) viewProjectBtn.addEventListener('click', openModal);
    if (projectDashboard) projectDashboard.addEventListener('click', openModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
            closeModal();
        }
    });

    /* ==========================================================
       BACK TO TOP BUTTON
       ========================================================== */
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ==========================================================
       HERO AI VISUAL PARALLAX
       ========================================================== */
    const aiVisual = document.getElementById('aiVisual');
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (aiVisual && window.matchMedia("(pointer: fine)").matches) {
        aiVisual.addEventListener('mousemove', (e) => {
            const rect = aiVisual.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const mouseX = (x - centerX);
            const mouseY = (y - centerY);

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax);
                const xPos = mouseX * speed;
                const yPos = mouseY * speed;

                el.style.transform = `translate(${xPos}px, ${yPos}px)`;
            });
        });

        aiVisual.addEventListener('mouseleave', () => {
            parallaxElements.forEach(el => {
                el.style.transform = `translate(0, 0)`;
            });
        });
    }

    /* ==========================================================
       MAGNETIC BUTTON EFFECT (Desktop only)
       ========================================================== */
    const magneticBtns = document.querySelectorAll('.btn-primary, .social-float-btn, .contact-btn');

    if (window.matchMedia("(pointer: fine)").matches) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `translate(0px, 0px)`;
            });
        });
    }

    /* ==========================================================
       HERO BACKGROUND PARTICLES (Full-section canvas)
       ========================================================== */
    const heroBgCanvas = document.getElementById('heroBgCanvas');
    if (heroBgCanvas) {
        const ctx = heroBgCanvas.getContext('2d');
        let particles = [];
        let animFrameId;

        function resizeCanvas() {
            const hero = document.getElementById('hero');
            heroBgCanvas.width = hero.offsetWidth;
            heroBgCanvas.height = hero.offsetHeight;
        }

        function getThemeColor() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            return isDark ? '45, 212, 191' : '20, 184, 166';
        }

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * heroBgCanvas.width;
                this.y = Math.random() * heroBgCanvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > heroBgCanvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > heroBgCanvas.height) this.speedY *= -1;
            }
            draw() {
                const rgb = getThemeColor();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb}, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(Math.floor((heroBgCanvas.width * heroBgCanvas.height) / 12000), 80);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function drawConnections() {
            const rgb = getThemeColor();
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const alpha = (1 - dist / 120) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, heroBgCanvas.width, heroBgCanvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            animFrameId = requestAnimationFrame(animateParticles);
        }

        resizeCanvas();
        initParticles();
        animateParticles();

        window.addEventListener('resize', () => {
            cancelAnimationFrame(animFrameId);
            resizeCanvas();
            initParticles();
            animateParticles();
        });
    }

    /* ==========================================================
       TYPEWRITER ANIMATION
       ========================================================== */
    const typewriterEl = document.getElementById('typewriterText');
    if (typewriterEl) {
        const roles = [
            { text: 'Aspiring AI Developer', color: 'var(--teal)' },
            { text: 'Junior AI Engineer', color: 'var(--violet)' },
            { text: 'ML Enthusiast', color: 'var(--blue)' },
            { text: 'RAG Builder', color: 'var(--teal)' },
        ];
        let roleIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typingTimeout;

        function typeWriter() {
            const current = roles[roleIdx];
            typewriterEl.style.color = current.color;

            if (!isDeleting) {
                typewriterEl.textContent = current.text.slice(0, charIdx + 1);
                charIdx++;
                if (charIdx === current.text.length) {
                    isDeleting = true;
                    typingTimeout = setTimeout(typeWriter, 1800); // pause at end
                    return;
                }
            } else {
                typewriterEl.textContent = current.text.slice(0, charIdx - 1);
                charIdx--;
                if (charIdx === 0) {
                    isDeleting = false;
                    roleIdx = (roleIdx + 1) % roles.length;
                }
            }
            typingTimeout = setTimeout(typeWriter, isDeleting ? 50 : 80);
        }

        // Start typewriter after loader fades
        setTimeout(typeWriter, 2200);
    }

    /* ==========================================================
       ANIMATED COUNTERS
       ========================================================== */
    const counters = document.querySelectorAll('.counter[data-target]');

    function animateCounter(el) {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const duration = 1500; // ms
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;

            el.textContent = current.toFixed(decimals) + suffix;
            el.classList.add('counting');

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toFixed(decimals) + suffix;
                el.classList.remove('counting');
            }
        }

        requestAnimationFrame(step);
    }

    // Trigger counters when they enter the viewport
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

});


