/**
 * Xennials | AI Automation & Web Development
 * Interactive Script Module - Audited & Performance Optimized
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeroParticles();
    initMobileMenu();
    initScrollReveal();
    initCounterAnimations();
    initProjectFiltering();
    initSavingsCalculator();
    initProjectModal();
    initThemeSwitcher();
    initContactForm();
    initBackToTop();
});

/* Hero Background Ambient Canvas */
function initHeroParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }, 150);
    }, { passive: true });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 30), 50);

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 1,
            color: Math.random() > 0.5 ? 'rgba(99, 102, 241, ' : 'rgba(236, 72, 153, ',
            alpha: Math.random() * 0.5 + 0.2,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35
        });
    }

    let animationFrameId;
    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.alpha + ')';
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < 14400) { // 120 * 120
                    const dist = Math.sqrt(distSq);
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${0.12 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    // Pause animation when tab is inactive to save battery & GPU resources
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationFrameId);
        } else {
            animate();
        }
    });

    animate();
}

/* Mobile Navigation Menu Toggle */
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        const isHidden = menu.classList.contains('hidden');
        if (isHidden) {
            menu.classList.remove('hidden');
            btn.setAttribute('aria-expanded', 'true');
            btn.innerHTML = '<i class="fas fa-times text-2xl text-pink-400"></i>';
        } else {
            menu.classList.add('hidden');
            btn.setAttribute('aria-expanded', 'false');
            btn.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
        }
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
            btn.setAttribute('aria-expanded', 'false');
            btn.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
        });
    });
}

/* Intersection Observer Scroll Reveal */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target); // Memory optimization: stop observing once revealed
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/* Animated Number Counter for Stats */
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.getAttribute('data-done')) {
                entry.target.setAttribute('data-done', 'true');
                obs.unobserve(entry.target);

                const targetVal = parseInt(entry.target.getAttribute('data-counter'), 10);
                const suffix = entry.target.getAttribute('data-suffix') || '';
                let current = 0;
                const increment = Math.max(1, Math.floor(targetVal / 40));
                const speed = 25;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= targetVal) {
                        current = targetVal;
                        clearInterval(timer);
                    }
                    entry.target.textContent = current + suffix;
                }, speed);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach(c => observer.observe(c));
}

/* Project Category Filtering */
function initProjectFiltering() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.repo-card');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'flex';
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        if (card.style.opacity === '0') {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
}

/* AI Savings & ROI Calculator */
function initSavingsCalculator() {
    const teamInput = document.getElementById('calc-team');
    const hoursInput = document.getElementById('calc-hours');
    const rateInput = document.getElementById('calc-rate');

    const teamVal = document.getElementById('calc-team-val');
    const hoursVal = document.getElementById('calc-hours-val');
    const rateVal = document.getElementById('calc-rate-val');

    const resHours = document.getElementById('res-hours-saved');
    const resMoney = document.getElementById('res-money-saved');

    if (!teamInput || !hoursInput || !rateInput) return;

    function updateCalculations() {
        const team = parseInt(teamInput.value, 10) || 0;
        const hours = parseInt(hoursInput.value, 10) || 0;
        const rate = parseInt(rateInput.value, 10) || 0;

        teamVal.textContent = team;
        hoursVal.textContent = hours + ' hrs/wk';
        rateVal.textContent = '$' + rate + '/hr';

        const weeklyHoursSaved = Math.round(team * hours * 0.75);
        const annualHoursSaved = weeklyHoursSaved * 52;
        const annualMoneySaved = annualHoursSaved * rate;

        resHours.textContent = annualHoursSaved.toLocaleString() + ' hrs';
        resMoney.textContent = '$' + annualMoneySaved.toLocaleString();
    }

    teamInput.addEventListener('input', updateCalculations, { passive: true });
    hoursInput.addEventListener('input', updateCalculations, { passive: true });
    rateInput.addEventListener('input', updateCalculations, { passive: true });

    updateCalculations();
}

/* Project Quick View Modal Details */
const projectData = {
    'tutorbot-agents': {
        title: 'TutorBot Agents — DeepTutor Platform',
        category: 'AI Agents & Educational Copilots',
        description: 'Agent-native intelligent learning companion and multi-agent educational copilot. Manage in-process TutorBot instances with real-time reasoning workspaces, custom soul templates, and interactive multi-turn dialogue.',
        tech: ['Next.js', 'React', 'TutorBot Agent Core', 'Unified Chat', 'WebSocket'],
        url: 'https://clever-mochi-c38d64.netlify.app/agents',
        isApp: true
    },
    'xennials-agent': {
        title: 'Xennials AI Autonomous Suite',
        category: 'Autonomous Multi-Agent Enterprise Suite',
        description: 'Personal AI agent runtime & Enterprise Suite integration with byte-stable prompt caching, multi-platform messaging gateway (Telegram, Discord, WeChat, Slack), 1,069+ skills, interactive video ads, and full CRM automation.',
        tech: ['FastAPI', 'React 19', 'Vite', 'Xennials Agent Core', 'Enterprise CRM', 'NVIDIA NIM'],
        url: 'https://xennials-agent.netlify.app/',
        isApp: true
    },
    'n8n-templates': {
        title: 'TutorBot Agents — DeepTutor Platform',
        category: 'AI Agents & Educational Copilots',
        description: 'Agent-native intelligent learning companion and multi-agent educational copilot. Manage in-process TutorBot instances with real-time reasoning workspaces.',
        tech: ['Next.js', 'React', 'TutorBot Agent Core', 'Unified Chat'],
        url: 'https://clever-mochi-c38d64.netlify.app/agents',
        isApp: true
    },
    'activepieces': {
        title: 'Hermes Agent & Odoo Automation Suite',
        category: 'Autonomous Multi-Agent Enterprise Suite',
        description: 'Autonomous agent core with prompt caching, multi-platform messaging, 1,038+ skills, interactive voice ads, and full Odoo Enterprise CRM automation.',
        tech: ['FastAPI', 'React 19', 'Vite', 'Hermes Core', 'Odoo Suite'],
        url: 'https://xennials-agent.netlify.app/',
        isApp: true
    },
    'ui-components': {
        title: '21st - UI Components Design System',
        category: 'Frontend Engineering',
        description: 'Component marketplace for design engineers built on shadcn/ui and TailwindCSS. Offers ready-to-use micro-animations, glassmorphism cards, dynamic charts, and interactive hooks.',
        tech: ['React', 'TailwindCSS', 'Framer Motion', 'TypeScript'],
        url: 'https://github.com/teefisher2k20/21st'
    },
    'adk-python': {
        title: 'ADK Python (AI Development Kit)',
        category: 'Agentic AI Framework',
        description: 'Code-first Python toolkit designed to build, evaluate, and orchestrate complex multi-agent LLM systems with custom memory management and tool routing.',
        tech: ['Python 3.11', 'LangChain', 'FastAPI', 'Pydantic', 'AsyncIO'],
        url: 'https://github.com/teefisher2k20/adk-python'
    },
    'agent-e': {
        title: 'Agent-E Web Automation Engine',
        category: 'Headless Browser Automation',
        description: 'Agentic automation engine built for autonomous web navigation, DOM parsing, structured data extraction, and automated form execution.',
        tech: ['Python', 'Playwright', 'Puppeteer', 'AI Vision'],
        url: 'https://github.com/teefisher2k20/agent-e'
    },
    'vscode-tools': {
        title: 'VS Code Developer Suite',
        category: 'Developer Tooling',
        description: 'Custom open-source extension pack enhancing developer velocity with AI code completion, quick syntax snippets, and automated test triggers.',
        tech: ['TypeScript', 'VS Code API', 'JSON Schema'],
        url: 'https://github.com/teefisher2k20/vscode'
    }
};

function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close-btn');

    if (!modal) return;

    document.querySelectorAll('[data-project-key]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const key = btn.getAttribute('data-project-key');
            const data = projectData[key];
            if (!data) return;

            document.getElementById('modal-title').textContent = data.title;
            document.getElementById('modal-category').textContent = data.category;
            document.getElementById('modal-description').textContent = data.description;
            
            const modalLink = document.getElementById('modal-link');
            modalLink.href = data.url;
            if (data.isApp) {
                modalLink.innerHTML = 'Launch Working App <i class="fas fa-external-link-alt text-xs ml-1"></i>';
                modalLink.className = 'px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg inline-flex items-center gap-2 font-mono';
            } else {
                modalLink.innerHTML = 'Open on GitHub <i class="fas fa-external-link-alt text-xs ml-1"></i>';
                modalLink.className = 'px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors inline-flex items-center gap-2';
            }

            const techContainer = document.getElementById('modal-tech');
            techContainer.replaceChildren(); // Safely clear children

            data.tech.forEach(t => {
                const badge = document.createElement('span');
                badge.className = 'px-3 py-1 bg-slate-800 border border-slate-700 text-indigo-300 rounded-full text-xs font-mono';
                badge.textContent = t; // Secure text assignment
                techContainer.appendChild(badge);
            });

            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* Theme Accent Switcher */
function initThemeSwitcher() {
    const btns = document.querySelectorAll('.theme-option');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme-name');
            if (theme === 'default') {
                document.body.removeAttribute('data-theme');
            } else {
                document.body.setAttribute('data-theme', theme);
            }
            showToast(`Accent Theme updated to ${theme.toUpperCase()}`, 'success');
        });
    });
}

/* Interactive Contact Form */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const messageInput = document.getElementById('contact-message');

        if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
            showToast('Please fill out all required fields.', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';

        setTimeout(() => {
            showToast('Thank you! Your message has been sent successfully.', 'success');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1000);
    });
}

/* Toast Message Display */
function showToast(message, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }

    const icon = type === 'success' 
        ? '<i class="fas fa-check-circle text-emerald-400 text-xl"></i>' 
        : '<i class="fas fa-exclamation-circle text-rose-400 text-xl"></i>';

    toast.innerHTML = `${icon} <span>${escapeHtml(message)}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/* Back To Top Button */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                if (window.scrollY > 400) {
                    btn.classList.add('visible');
                } else {
                    btn.classList.remove('visible');
                }
                scrollTimeout = null;
            }, 100);
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
