/**
 * Xennials | AI Automation, DeepTutor & Multi-Page Platform
 * Reactive UI, Interactive DeepTutor Simulator, ROI Engine & Studio Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeroParticles();
    initMobileMenu();
    initNavDropdown();
    initScrollReveal();
    initCounterAnimations();
    initProjectFiltering();
    initSavingsCalculator();
    initProjectModal();
    initThemeSwitcher();
    initContactForm();
    initBackToTop();
    initCopyButtons();
    initDeepTutorSimulator();
    initPlaygroundStudio();
    initBlogHub();
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
    const particleCount = Math.min(Math.floor(width / 30), 45);

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

/* Mobile Drawer Menu Navigation */
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        const icon = btn.querySelector('i');
        if (icon) {
            if (menu.classList.contains('hidden')) {
                icon.className = 'fas fa-bars text-2xl';
            } else {
                icon.className = 'fas fa-times text-2xl text-pink-400';
            }
        }
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
            const icon = btn.querySelector('i');
            if (icon) icon.className = 'fas fa-bars text-2xl';
        });
    });
}

/* Header Projects Dropdown Menu */
function initNavDropdown() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('button');
        if (!btn) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('is-open');
        });
    });

    document.addEventListener('click', (e) => {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('is-open');
            }
        });
    });
}

/* Scroll Intersection Observer */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* Dynamic Number Counters */
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-counter'), 10);
                const suffix = el.getAttribute('data-suffix') || '';
                const duration = 1500;
                const start = performance.now();

                function updateCounter(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease-out cubic
                    const currentVal = Math.floor((1 - Math.pow(1 - progress, 3)) * target);
                    el.textContent = currentVal + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target + suffix;
                    }
                }

                requestAnimationFrame(updateCounter);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/* Category Filter Tabs for Projects */
function initProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');
    const cards = document.querySelectorAll('.repo-card[data-category]');

    if (!filterButtons.length || !cards.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const cat = card.getAttribute('data-category');
                if (filter === 'all' || cat === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

/* ROI & Savings Interactive Calculator */
function initSavingsCalculator() {
    const teamInput = document.getElementById('calc-team');
    const hoursInput = document.getElementById('calc-hours');
    const rateInput = document.getElementById('calc-rate');

    if (!teamInput || !hoursInput || !rateInput) return;

    const teamVal = document.getElementById('calc-team-val');
    const hoursVal = document.getElementById('calc-hours-val');
    const rateVal = document.getElementById('calc-rate-val');

    const resHours = document.getElementById('res-hours-saved');
    const resMoney = document.getElementById('res-money-saved');

    function updateCalculations() {
        const team = parseInt(teamInput.value, 10);
        const hours = parseInt(hoursInput.value, 10);
        const rate = parseInt(rateInput.value, 10);

        teamVal.textContent = team;
        hoursVal.textContent = `${hours} hrs/wk`;
        rateVal.textContent = `$${rate}/hr`;

        // 75% task efficiency reduction across 52 weeks
        const annualHoursSaved = Math.round(team * hours * 52 * 0.75);
        const annualDollarsSaved = Math.round(annualHoursSaved * rate);

        resHours.textContent = `${annualHoursSaved.toLocaleString()} hrs`;
        resMoney.textContent = `$${annualDollarsSaved.toLocaleString()}`;
    }

    teamInput.addEventListener('input', updateCalculations, { passive: true });
    hoursInput.addEventListener('input', updateCalculations, { passive: true });
    rateInput.addEventListener('input', updateCalculations, { passive: true });

    updateCalculations();
}

/* Project Quick View Modal Details */
const projectData = {
    'tutorbot-agents': {
        title: 'DeepTutor Platform (TutorBot Agents)',
        category: 'AI Agents & Lifelong Learning Copilots',
        description: 'Agent-native personalized tutoring ecosystem developed by HKUDS & Xennials. Includes 8 synchronized learning surfaces, 3-layer persistent cognitive memory, and multi-turn Socratic reasoning.',
        tech: ['Next.js', 'React', 'TutorBot Agent Swarm', 'FastAPI', 'RAG Engine', 'Vector DB'],
        url: 'deeptutor.html',
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
                modalLink.innerHTML = 'Explore DeepTutor Platform <i class="fas fa-arrow-right text-xs ml-1"></i>';
                modalLink.className = 'px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg inline-flex items-center gap-2 font-mono';
            } else {
                modalLink.innerHTML = 'Open on GitHub <i class="fas fa-external-link-alt text-xs ml-1"></i>';
                modalLink.className = 'px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors inline-flex items-center gap-2';
            }

            const techContainer = document.getElementById('modal-tech');
            techContainer.replaceChildren();

            data.tech.forEach(t => {
                const tag = document.createElement('span');
                tag.className = 'px-3 py-1 bg-slate-800 border border-slate-700 text-indigo-300 text-xs rounded-lg font-mono';
                tag.textContent = t;
                techContainer.appendChild(tag);
            });

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

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

/* Theme Switching System */
function initThemeSwitcher() {
    const themeButtons = document.querySelectorAll('.theme-option');
    const savedTheme = localStorage.getItem('xennials_theme') || 'default';

    if (savedTheme !== 'default') {
        document.body.setAttribute('data-theme', savedTheme);
    }

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const themeName = btn.getAttribute('data-theme-name');
            if (themeName === 'default') {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('xennials_theme', 'default');
            } else {
                document.body.setAttribute('data-theme', themeName);
                localStorage.setItem('xennials_theme', themeName);
            }
            showToast(`Theme updated to ${themeName}`);
        });
    });
}

/* Toast Notifications */
function showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.innerHTML = `<i class="fas fa-check-circle text-emerald-400 text-lg"></i> <span id="toast-msg"></span>`;
        document.body.appendChild(toast);
    }
    const msgEl = document.getElementById('toast-msg') || toast.querySelector('span');
    if (msgEl) msgEl.textContent = msg;

    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

/* Copy to Clipboard Helpers */
function initCopyButtons() {
    document.querySelectorAll('.copy-btn, .copy-badge').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy') || btn.parentElement.querySelector('code')?.textContent;
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast('Copied to clipboard!');
                }).catch(() => {
                    showToast('Failed to copy');
                });
            }
        });
    });
}

/* Contact Form Feedback */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Transmitting...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i> Message Sent!';
            submitBtn.classList.replace('from-indigo-600', 'from-emerald-600');
            submitBtn.classList.replace('to-pink-600', 'to-teal-600');
            showToast('Thank you! Your message has been received.');
            form.reset();

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.replace('from-emerald-600', 'from-indigo-600');
                submitBtn.classList.replace('to-teal-600', 'to-pink-600');
            }, 3000);
        }, 1200);
    });
}

/* Back To Top Floating Action */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* DeepTutor Interactive Simulator Engine */
function initDeepTutorSimulator() {
    const simForm = document.getElementById('sim-input-form');
    const simInput = document.getElementById('sim-user-input');
    const messages = document.getElementById('sim-messages');
    const toggleReasoningBtn = document.getElementById('toggle-reasoning-btn');
    const reasoningPanel = document.getElementById('sim-reasoning');
    const subjectButtons = document.querySelectorAll('.subject-btn');
    const personaButtons = document.querySelectorAll('.persona-btn');
    const presetPills = document.querySelectorAll('.preset-pill');

    if (!simForm || !messages) return;

    const simulatorKnowledge = {
        'attention': {
            query: 'How does Multi-Head Self-Attention compute queries, keys, and values?',
            topic: '[AI Systems]',
            steps: [
                '1. [RAG Engine] Retrieved "Attention Is All You Need" (Vaswani et al.) Sec 3.2.',
                '2. [Cognitive Model] Learner understands matrix multiplication; needs visual breakdown of scaled dot-product.',
                '3. [Socratic Goal] Explain linear projections first, formulate question on why dimension d_k scaling prevents vanishing gradients.'
            ],
            aiHtml: `
                <p>In Self-Attention, an input sequence is projected into three distinct representations through learned weight matrices:</p>
                <div class="bg-slate-950 p-3 rounded-lg font-mono text-xs text-indigo-300 border border-slate-800 my-2">
                    Q = X · W_Q &emsp;|&emsp; K = X · W_K &emsp;|&emsp; V = X · W_V
                </div>
                <p>We then compute the scaled dot-product attention formula:</p>
                <div class="latex-math text-center py-2 text-sm my-2">
                    Attention(Q, K, V) = softmax((Q · Kᵀ) / √d_k) · V
                </div>
                <p class="text-sm text-gray-300 mt-2">
                    <strong>Socratic Question for You:</strong> Why do we divide by <span class="latex-math">√d_k</span> inside the softmax rather than directly passing <span class="latex-math">Q · Kᵀ</span>? What happens to the gradients when <span class="latex-math">d_k</span> grows very large?
                </p>
            `
        },
        'gradient': {
            query: 'Derive the Gradient Descent weight update rule for Mean Squared Error loss.',
            topic: '[Mathematics]',
            steps: [
                '1. [RAG Engine] Retrieved Optimization & Linear Models chapter (Bishop PRML).',
                '2. [Cognitive Model] Learner knows partial derivatives; wants step-by-step vector calculus proof.',
                '3. [Socratic Goal] Show MSE derivative with respect to weights and highlight the learning rate step.'
            ],
            aiHtml: `
                <p>Given the MSE loss function <span class="latex-math">L(w) = (1/2N) ∑ (y_i - wᵀx_i)²</span>, we calculate the gradient:</p>
                <div class="bg-slate-950 p-3 rounded-lg font-mono text-xs text-pink-300 border border-slate-800 my-2">
                    ∇_w L(w) = - (1/N) ∑ (y_i - wᵀx_i) x_i
                </div>
                <p>The parameter update with learning rate <span class="latex-math">η</span> becomes:</p>
                <div class="latex-math text-center py-2 text-sm my-2">
                    w_{t+1} = w_t - η · ∇_w L(w_t)
                </div>
                <p class="text-sm text-gray-300 mt-2">
                    <strong>Socratic Question for You:</strong> If we set the learning rate <span class="latex-math">η</span> too large, what geometric behavior will the parameter trajectory exhibit across the loss contour?
                </p>
            `
        },
        'redblack': {
            query: 'Explain Red-Black Tree balancing invariants and rotation rules during insertion.',
            topic: '[Computer Science]',
            steps: [
                '1. [RAG Engine] Retrieved Cormen CLRS Chapter 13: Red-Black Trees.',
                '2. [Cognitive Model] Learner understands BSTs; verifying color flips vs left/right rotations.',
                '3. [Socratic Goal] Outline the 5 fundamental properties and quiz on uncle node colors.'
            ],
            aiHtml: `
                <p>Red-Black Trees maintain <span class="latex-math">O(log n)</span> search, insertion, and deletion by enforcing 5 critical invariants:</p>
                <ul class="list-disc pl-5 space-y-1 text-xs text-gray-300 my-2">
                    <li>1. Every node is either Red or Black.</li>
                    <li>2. The root is always Black.</li>
                    <li>3. All NIL leaves are Black.</li>
                    <li>4. If a node is Red, both its children must be Black (no adjacent red nodes).</li>
                    <li>5. For every node, all paths to descendant leaves contain the exact same number of black nodes.</li>
                </ul>
                <p class="text-sm text-gray-300 mt-2">
                    <strong>Socratic Question for You:</strong> When inserting a new node <span class="font-mono text-pink-400">Z</span> and its uncle is <strong>Red</strong>, do we need tree rotations or only color flips?
                </p>
            `
        },
        'schrodinger': {
            query: 'How is the Time-Dependent Schrödinger Equation formulated for a 1D potential well?',
            topic: '[Physics]',
            steps: [
                '1. [RAG Engine] Retrieved Griffiths Quantum Mechanics Chapter 2.',
                '2. [Cognitive Model] Learner is exploring Hamiltonian operators and wavefunctions.',
                '3. [Socratic Goal] Present the general PDE and examine boundary conditions at the infinite barriers.'
            ],
            aiHtml: `
                <p>In one dimension, the time-dependent Schrödinger equation is given by:</p>
                <div class="latex-math text-center py-2 text-sm my-2">
                    iℏ (∂Ψ(x,t) / ∂t) = [ - (ℏ² / 2m) (∂² / ∂x²) + V(x) ] Ψ(x,t)
                </div>
                <p>For an infinite square well of width <span class="latex-math">L</span>, the spatial wavefunctions quantize to:</p>
                <div class="bg-slate-950 p-3 rounded-lg font-mono text-xs text-cyan-300 border border-slate-800 my-2">
                    ψ_n(x) = √(2/L) · sin(nπx / L), &emsp; n = 1, 2, 3...
                </div>
                <p class="text-sm text-gray-300 mt-2">
                    <strong>Socratic Question for You:</strong> Why is the ground state energy <span class="latex-math">E_1 > 0</span> rather than 0? How does Heisenberg's Uncertainty Principle mandate this?
                </p>
            `
        }
    };

    function renderSimulation(itemKey) {
        const item = simulatorKnowledge[itemKey];
        if (!item) return;

        const topicTag = document.getElementById('sim-topic-tag');
        if (topicTag) topicTag.textContent = item.topic;

        // Clear and render user query
        const userQueryEl = document.getElementById('sim-user-query');
        if (userQueryEl) userQueryEl.textContent = item.query;

        // Render reasoning steps
        if (reasoningPanel) {
            const list = reasoningPanel.querySelector('ul');
            if (list) {
                list.replaceChildren();
                item.steps.forEach(s => {
                    const li = document.createElement('li');
                    li.textContent = s;
                    list.appendChild(li);
                });
            }
        }

        // Render AI response
        const aiResponseEl = document.getElementById('sim-ai-response');
        if (aiResponseEl) {
            aiResponseEl.innerHTML = item.aiHtml;
        }

        // Animate retention score randomly upwards to simulate learning
        const scoreEl = document.getElementById('sim-retention-score');
        const progEl = document.getElementById('sim-progress-bar');
        if (scoreEl && progEl) {
            const newScore = (92 + Math.random() * 6).toFixed(1);
            scoreEl.textContent = `${newScore}%`;
            progEl.style.width = `${newScore}%`;
        }
    }

    // Toggle Reasoning Chain
    if (toggleReasoningBtn && reasoningPanel) {
        toggleReasoningBtn.addEventListener('click', () => {
            reasoningPanel.classList.toggle('hidden');
            const isHidden = reasoningPanel.classList.contains('hidden');
            toggleReasoningBtn.innerHTML = isHidden 
                ? '<i class="fas fa-eye mr-1 text-indigo-400"></i> Show Reasoning' 
                : '<i class="fas fa-stream mr-1 text-indigo-400"></i> Chain-of-Thought';
        });
    }

    // Subject Selector
    subjectButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            subjectButtons.forEach(b => {
                b.classList.remove('active', 'border-indigo-500/50', 'bg-indigo-950/40', 'text-white');
                b.classList.add('border-slate-800', 'bg-slate-950/40', 'text-gray-300');
            });
            btn.classList.add('active', 'border-indigo-500/50', 'bg-indigo-950/40', 'text-white');
            btn.classList.remove('border-slate-800', 'bg-slate-950/40', 'text-gray-300');

            const sub = btn.getAttribute('data-subject');
            const mapping = { 'ai': 'attention', 'math': 'gradient', 'cs': 'redblack', 'physics': 'schrodinger' };
            if (mapping[sub]) renderSimulation(mapping[sub]);
        });
    });

    // Persona Selector
    personaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            personaButtons.forEach(b => {
                b.classList.remove('active', 'border-pink-500/50', 'bg-pink-950/30', 'text-white');
                b.classList.add('border-slate-800', 'bg-slate-950/40', 'text-gray-300');
            });
            btn.classList.add('active', 'border-pink-500/50', 'bg-pink-950/30', 'text-white');
            btn.classList.remove('border-slate-800', 'bg-slate-950/40', 'text-gray-300');

            const agentTitle = document.getElementById('sim-agent-name');
            if (agentTitle) {
                const persona = btn.getAttribute('data-persona');
                const titles = {
                    'socratic': 'DeepTutor • Socratic Mentor',
                    'architect': 'DeepTutor • Code Architect',
                    'scientist': 'DeepTutor • First Principles',
                    'crammer': 'DeepTutor • Exam Drill'
                };
                agentTitle.textContent = titles[persona] || 'DeepTutor • Agent Core';
            }
        });
    });

    // Presets
    presetPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const promptKey = pill.getAttribute('data-prompt');
            renderSimulation(promptKey);
        });
    });

    // Random Technical Topic Generator
    const STEM_TOPICS = [
        "Explain how Scaled Dot-Product Attention maintains gradient stability as key dimension d_k increases.",
        "Derive the Backpropagation equations for a 2-layer MLP with Cross-Entropy Loss from first principles.",
        "Prove that any comparison-based sorting algorithm has a lower bound of Ω(n log n) comparisons.",
        "How do Raft consensus leader election and log replication guarantees prevent split-brain partitions?",
        "Explain the physics of quantum entanglement and Bell's theorem violation in EPR paradox experiments.",
        "Analyze why transformer KV-cache memory usage scales linearly with sequence length O(N) and batch size.",
        "Derive the Euler-Lagrange equations from the Principle of Stationary Action in classical mechanics.",
        "Explain the formal proof of Gödel's First Incompleteness Theorem using Gödel numbering and self-reference.",
        "How does TCP BBR congestion control estimate bottleneck bandwidth and round-trip propagation time without packet loss?",
        "Explain Fourier Transform duality: why sharp localization in the time domain creates broad spread in the frequency domain."
    ];

    const randomSimBtn = document.getElementById('random-sim-prompt-btn');
    const randomSimIcon = document.getElementById('random-sim-icon-btn');
    const triggerSimRandom = (btn) => {
        const topic = STEM_TOPICS[Math.floor(Math.random() * STEM_TOPICS.length)];
        if (simInput) {
            simInput.value = topic;
            simInput.classList.remove('prompt-flash-highlight');
            void simInput.offsetWidth;
            simInput.classList.add('prompt-flash-highlight');
            simInput.focus();
        }
        if (btn) {
            btn.classList.add('rolling');
            setTimeout(() => btn.classList.remove('rolling'), 500);
        }
    };

    if (randomSimBtn) randomSimBtn.addEventListener('click', () => triggerSimRandom(randomSimBtn));
    if (randomSimIcon) randomSimIcon.addEventListener('click', () => triggerSimRandom(randomSimIcon));

    // Custom Form Submit
    simForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = simInput.value.trim();
        if (!text) return;

        const userBubble = document.createElement('div');
        userBubble.className = 'agent-chat-bubble user max-w-[85%]';
        userBubble.innerHTML = `<p>${text}</p>`;
        messages.appendChild(userBubble);
        simInput.value = '';

        // Simulate agent reasoning & response
        const aiBubble = document.createElement('div');
        aiBubble.className = 'agent-chat-bubble ai max-w-[90%] space-y-2';
        aiBubble.innerHTML = `
            <div class="flex items-center gap-2 text-indigo-400 text-xs font-mono mb-1">
                <i class="fas fa-spinner fa-spin"></i> DeepTutor Socratic Synthesis...
            </div>
            <p>Analyzing foundational concepts in: <em>"${text}"</em></p>
        `;
        messages.appendChild(aiBubble);
        messages.scrollTop = messages.scrollHeight;

        setTimeout(() => {
            aiBubble.innerHTML = `
                <p>To master <strong>${text}</strong>, let's break this down into first principles:</p>
                <div class="bg-slate-950 p-3 rounded-lg font-mono text-xs text-indigo-300 border border-slate-800 my-2">
                    Core Rule: Deconstruct the problem into elementary axioms & verified invariants.
                </div>
                <p class="text-sm text-gray-300">
                    <strong>Socratic Prompt:</strong> How does this concept connect to your existing knowledge base in calculus and algorithms? Try defining the input-output boundary condition first.
                </p>
            `;
            messages.scrollTop = messages.scrollHeight;
        }, 900);
    });
}

/* Playground Studio Engine */
function initPlaygroundStudio() {
    const genBtn = document.getElementById('generate-btn');
    const promptInput = document.getElementById('prompt-input');
    const canvasPreview = document.getElementById('canvas-preview');
    const styleTags = document.querySelectorAll('.style-tag');

    if (!genBtn || !canvasPreview) return;

    styleTags.forEach(tag => {
        tag.addEventListener('click', () => {
            styleTags.forEach(t => {
                t.classList.remove('bg-indigo-950', 'border-indigo-500/50', 'text-indigo-300');
                t.classList.add('bg-slate-800', 'border-slate-700', 'text-gray-400');
            });
            tag.classList.add('bg-indigo-950', 'border-indigo-500/50', 'text-indigo-300');
            tag.classList.remove('bg-slate-800', 'border-slate-700', 'text-gray-400');
        });
    });

    genBtn.addEventListener('click', () => {
        const text = promptInput ? promptInput.value.trim() : '';
        const originalText = genBtn.innerHTML;
        genBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Synthesizing Latents...';
        genBtn.disabled = true;

        canvasPreview.innerHTML = `
            <div class="flex flex-col items-center justify-center space-y-3">
                <div class="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <p class="text-xs text-indigo-300 font-mono">Sampling Diffusion Steps [28/28]...</p>
            </div>
        `;

        setTimeout(() => {
            canvasPreview.innerHTML = `
                <div class="w-full h-full flex flex-col items-center justify-center relative p-6">
                    <div class="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white text-4xl shadow-2xl mb-4 animate-float">
                        <i class="fas fa-cube"></i>
                    </div>
                    <h4 class="font-space font-bold text-white text-lg">Visual Synthesis Generated</h4>
                    <p class="text-xs text-indigo-300 font-mono mt-1 max-w-md">${text || 'Autonomous AI Robotic Architecture in Cybernetic Stacks'}</p>
                    <div class="mt-4 flex gap-2">
                        <button class="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-gray-300 hover:text-white" onclick="showToast('High-Res canvas downloaded!')">
                            <i class="fas fa-download mr-1"></i> Export HD
                        </button>
                    </div>
                </div>
            `;
            genBtn.innerHTML = originalText;
            genBtn.disabled = false;
            showToast('Visual synthesized successfully!');
        }, 1400);
    });
}

/* Blog Filtering & Search Engine */
function initBlogHub() {
    const searchInput = document.getElementById('blog-search');
    const categoryButtons = document.querySelectorAll('.filter-btn[data-category]');
    const articles = document.querySelectorAll('[data-article-category]');

    if (!articles.length) return;

    function filterArticles() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const activeBtn = document.querySelector('.filter-btn[data-category].active');
        const activeCat = activeBtn ? activeBtn.getAttribute('data-category') : 'all';

        articles.forEach(art => {
            const cat = art.getAttribute('data-article-category');
            const text = art.textContent.toLowerCase();
            const matchesCat = activeCat === 'all' || cat === activeCat;
            const matchesQuery = !query || text.includes(query);

            if (matchesCat && matchesQuery) {
                art.style.display = '';
            } else {
                art.style.display = 'none';
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterArticles, { passive: true });
    }

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterArticles();
        });
    });
}
