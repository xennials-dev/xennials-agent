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
    initWorkflowSuite();
    initGuidedAnnotationsAndTour();
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

/* ═════════════════════════════════════════════════════════════════════
   AUTONOMOUS WORKFLOWS & MULTI-AGENT PIPELINE SUITE
   ═════════════════════════════════════════════════════════════════════ */

function initWorkflowSuite() {
    initWorkflowTabs();
    initPipelineInspectorAndSimulator();
    initCostOptimizerCalculator();
}

function initWorkflowTabs() {
    const tabButtons = document.querySelectorAll('.workflow-tab-btn');
    const tabPanels = document.querySelectorAll('.workflow-tab-content');

    if (!tabButtons.length) return;

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-wf-tab');
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tabPanels.forEach(panel => {
                if (panel.id === `wf-panel-${target}`) {
                    panel.classList.remove('hidden');
                } else {
                    panel.classList.add('hidden');
                }
            });
        });
    });
}

function initPipelineInspectorAndSimulator() {
    const nodes = document.querySelectorAll('.pipeline-node');
    const badgeEl = document.getElementById('inspector-step-badge');
    const titleEl = document.getElementById('inspector-step-title');
    const costEl = document.getElementById('inspector-step-cost');
    const configCodeEl = document.getElementById('inspector-config-code');
    const payloadCodeEl = document.getElementById('inspector-payload-code');
    const runBtn = document.getElementById('run-pipeline-sim-btn');
    const keywordInput = document.getElementById('sim-pipeline-keyword');
    const statusText = document.getElementById('pipeline-status-text');
    const liveLogs = document.getElementById('pipeline-live-logs');

    if (!nodes.length) return;

    const STEP_DETAILS = {
        '1': {
            badge: 'STEP 1',
            title: 'Trigger: Google Sheets Watch Changes',
            cost: 'Cost: $0.00 (Native Trigger)',
            config: `{\n  "app": "Google Sheets",\n  "action": "Watch Changes",\n  "worksheet": "Video Queue",\n  "triggerColumn": "Status = 'Pending'",\n  "filter": "Keyword is not empty"\n}`,
            payload: `// Payload emitted to downstream pipeline:\n{\n  "job_id": "vid_89412",\n  "keyword": "how to build an automated AI business",\n  "client_id": "client_acme_01",\n  "tone": "casual_engaging",\n  "target_duration_sec": 60\n}`
        },
        '2': {
            badge: 'STEP 2',
            title: 'Research Agent: Perplexity API / GPT-4o RAG',
            cost: 'Cost: ~$0.02 (250 tokens)',
            config: `{\n  "endpoint": "https://api.perplexity.ai/chat/completions",\n  "model": "sonar-medium-online",\n  "max_tokens": 500,\n  "cache_strategy": "24h_redis_kv"\n}`,
            payload: `// Research Output Data:\n{\n  "facts": [\n    "Solo entrepreneurs use agent swarms to scale 10x output.",\n    "Make.com + LangGraph reduces delivery time from 4h to 15m.",\n    "Average API operational cost is under $0.50 per final video."\n  ],\n  "sources": ["https://techcrunch.com/ai-agents", "https://arxiv.org/abs/2401"]\n}`
        },
        '3': {
            badge: 'STEP 3',
            title: 'Script Synthesis: Claude 3.7 / GPT-4o',
            cost: 'Cost: ~$0.04 (550 words / 480 tokens)',
            config: `{\n  "model": "claude-3-7-sonnet-20250219",\n  "system_prompt_id": "sys_hook_retention_v3",\n  "temperature": 0.65,\n  "rules": ["Hook in first 3s", "Casual tone", "CTA at end"]\n}`,
            payload: `// Generated Script:\n{\n  "hook": "What if a one-person business could outproduce a 10-person media team?",\n  "body": "Here is the exact 3-step agent blueprint: 1. Automated lead capture, 2. Multi-agent video assembly, 3. Zero-touch CRM delivery...",\n  "duration_sec": 58\n}`
        },
        '4': {
            badge: 'STEP 4',
            title: 'Voice Synthesis: ElevenLabs Turbo v2',
            cost: 'Cost: ~$0.15 (Turbo Model, 50% savings)',
            config: `{\n  "url": "https://api.elevenlabs.io/v1/text-to-speech/voice_adam_turbo",\n  "model_id": "eleven_turbo_v2",\n  "stability": 0.5,\n  "similarity_boost": 0.75\n}`,
            payload: `// Audio Output Metadata:\n{\n  "audio_format": "audio/mp3",\n  "duration_sec": 58.4,\n  "sample_rate": 44100,\n  "file_url": "https://cdn.xennials.tech/audio/voice_89412.mp3"\n}`
        },
        '5': {
            badge: 'STEP 5',
            title: 'Video Compositor: JSON2Video / Pictory API',
            cost: 'Cost: ~$0.25 (1080p Cloud Render)',
            config: `{\n  "resolution": "1080x1920",\n  "fps": 30,\n  "scenes": 7,\n  "captions": "auto_animated_subtitles",\n  "audio_track": "voice_89412.mp3"\n}`,
            payload: `// Rendered Video Asset:\n{\n  "render_id": "rnd_44901",\n  "status": "COMPLETED",\n  "video_url": "https://cdn.xennials.tech/rendered/vid_89412_final.mp4",\n  "filesize_mb": 24.8\n}`
        },
        '6': {
            badge: 'STEP 6',
            title: 'Auto Delivery & CRM: Drive, Notion, Stripe',
            cost: 'Cost: $0.00 (Webhook Automation)',
            config: `{\n  "route_a": "Google Drive: /Client_Acme/March_2026/",\n  "route_b": "Notion Database: Update Status to Completed",\n  "route_c": "Gmail: Auto-notify client with download link"\n}`,
            payload: `// Delivery Confirmation:\n{\n  "notion_item_updated": true,\n  "drive_file_id": "1xZ9...kM8",\n  "client_email_sent": "client@acmestudios.com",\n  "time_elapsed_total": "14m 32s"\n}`
        }
    };

    nodes.forEach(node => {
        node.addEventListener('click', () => {
            const stepId = node.getAttribute('data-step-id');
            nodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');

            const info = STEP_DETAILS[stepId];
            if (info) {
                if (badgeEl) badgeEl.textContent = info.badge;
                if (titleEl) titleEl.textContent = info.title;
                if (costEl) costEl.textContent = info.cost;
                if (configCodeEl) configCodeEl.textContent = info.config;
                if (payloadCodeEl) payloadCodeEl.textContent = info.payload;
            }
        });
    });

    // Run Pipeline Simulator
    if (runBtn) {
        runBtn.addEventListener('click', () => {
            const keyword = keywordInput ? keywordInput.value.trim() : 'how to build an automated AI business';
            if (!keyword) return;

            runBtn.disabled = true;
            runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Executing Swarm...</span>';
            if (liveLogs) {
                liveLogs.classList.remove('hidden');
                liveLogs.innerHTML = `<div class="text-indigo-400">[00:00] 🚀 Initializing Autonomous Agent Swarm for: "${keyword}"...</div>`;
            }
            if (statusText) statusText.innerHTML = 'Status: <span class="text-pink-400 font-bold animate-pulse">Running Swarm...</span>';

            const logs = [
                { delay: 800, step: 1, log: `[00:02] [Make.com] Row fetched from Google Sheet. Trigger verified for keyword: "${keyword}".` },
                { delay: 2000, step: 2, log: `[00:05] [Perplexity Agent] 5 research facts & citations extracted (0.8s latency, 240 tokens).` },
                { delay: 3400, step: 3, log: `[00:09] [Claude 3.7 Sonnet] High-retention 58-second script synthesized with 3-second hook.` },
                { delay: 4800, step: 4, log: `[00:12] [ElevenLabs Turbo v2] Generated voiceover MP3 (Cost: $0.15, -14 LUFS normalized).` },
                { delay: 6400, step: 5, log: `[00:15] [JSON2Video Engine] Matched 7 dynamic stock scenes & rendered 1080p MP4 master.` },
                { delay: 7800, step: 6, log: `[00:18] [Delivery Router] Video saved to Google Drive /Client_Acme/, Notion status updated to Completed ✅.` }
            ];

            const container = document.getElementById('pipeline-nodes-container');
            if (container) container.classList.add('sim-running');

            logs.forEach(item => {
                setTimeout(() => {
                    nodes.forEach(n => n.classList.remove('running-step'));
                    const activeNode = document.querySelector(`.pipeline-node[data-step-id="${item.step}"]`);
                    if (activeNode) {
                        activeNode.classList.add('running-step');
                        activeNode.click();
                    }
                    if (liveLogs) {
                        const logRow = document.createElement('div');
                        logRow.className = 'text-gray-300';
                        logRow.innerHTML = `<span class="text-emerald-400">✓</span> ${item.log}`;
                        liveLogs.appendChild(logRow);
                        liveLogs.scrollTop = liveLogs.scrollHeight;
                    }
                }, item.delay);
            });

            setTimeout(() => {
                if (container) container.classList.remove('sim-running');
                nodes.forEach(n => n.classList.remove('running-step'));
                runBtn.disabled = false;
                runBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>Simulation Complete (Run Again)</span>';
                if (statusText) statusText.innerHTML = 'Status: <span class="text-emerald-400 font-bold">Delivered (100% Zero-Touch)</span>';
                showToast('Pipeline execution simulation complete!', 'success');
            }, 8500);
        });
    }
}

function initCostOptimizerCalculator() {
    const jobsSlider = document.getElementById('cost-calc-jobs');
    const jobsVal = document.getElementById('cost-calc-jobs-val');
    const cacheCheckbox = document.getElementById('cost-opt-cache');
    const routingCheckbox = document.getElementById('cost-opt-routing');
    const unoptEl = document.getElementById('cost-unopt-total');
    const optEl = document.getElementById('cost-opt-total');
    const savingsEl = document.getElementById('cost-savings-monthly');

    if (!jobsSlider) return;

    function updateCalculations() {
        const jobs = parseInt(jobsSlider.value, 10);
        if (jobsVal) jobsVal.textContent = `${jobs} videos`;

        const unoptimizedPerJob = 2.10;
        let optimizedPerJob = 2.10;

        // Apply savings
        if (routingCheckbox && routingCheckbox.checked) {
            optimizedPerJob -= 0.90; // Smart model routing
        }
        if (cacheCheckbox && cacheCheckbox.checked) {
            optimizedPerJob -= 0.74; // Prompt caching & system prompt separation
        }

        // Clamp to minimum cost ($0.46)
        optimizedPerJob = Math.max(0.46, optimizedPerJob);

        const unoptTotal = jobs * unoptimizedPerJob;
        const optTotal = jobs * optimizedPerJob;
        const monthlySavings = unoptTotal - optTotal;

        if (unoptEl) unoptEl.textContent = `$${unoptTotal.toFixed(2)}/mo`;
        if (optEl) optEl.textContent = `$${optTotal.toFixed(2)}/mo`;
        if (savingsEl) savingsEl.textContent = `$${monthlySavings.toFixed(2)} / month`;
    }

    jobsSlider.addEventListener('input', updateCalculations);
    if (cacheCheckbox) cacheCheckbox.addEventListener('change', updateCalculations);
    if (routingCheckbox) routingCheckbox.addEventListener('change', updateCalculations);
    updateCalculations();
}

/* ═════════════════════════════════════════════════════════════════════
   HOVER ANNOTATIONS & INTERACTIVE GUIDED TOUR ENGINE
   ═════════════════════════════════════════════════════════════════════ */

function initGuidedAnnotationsAndTour() {
    const hoverCard = document.getElementById('hover-annotation-card');
    const badgeEl = document.getElementById('annotation-step-badge');
    const titleEl = document.getElementById('annotation-title');
    const descEl = document.getElementById('annotation-desc');
    const actionEl = document.getElementById('annotation-action-text');
    const guideToggle = document.getElementById('guide-mode-toggle');
    const startTourBtn = document.getElementById('start-tour-btn');
    const modal = document.getElementById('tour-spotlight-modal');
    const modalStep = document.getElementById('tour-modal-step');
    const modalTitle = document.getElementById('tour-modal-title');
    const modalDesc = document.getElementById('tour-modal-desc');
    const modalTip = document.getElementById('tour-modal-tip');
    const modalPrev = document.getElementById('tour-modal-prev');
    const modalNext = document.getElementById('tour-modal-next');
    const modalClose = document.getElementById('tour-modal-close');
    const modalDots = document.getElementById('tour-modal-dots');

    let isGuideActive = localStorage.getItem('guide_mode_active') !== 'false';
    document.body.classList.toggle('guide-mode-active', isGuideActive);
    updateGuideButtonState();

    function updateGuideButtonState() {
        if (!guideToggle) return;
        if (isGuideActive) {
            guideToggle.classList.add('active');
            guideToggle.innerHTML = '<i class="fas fa-lightbulb text-amber-400"></i> <span>Guide: <strong class="text-white">ON</strong></span>';
        } else {
            guideToggle.classList.remove('active');
            guideToggle.innerHTML = '<i class="far fa-lightbulb text-gray-400"></i> <span>Guide: <strong class="text-gray-300">OFF</strong></span>';
        }
    }

    if (guideToggle) {
        guideToggle.addEventListener('click', () => {
            isGuideActive = !isGuideActive;
            localStorage.setItem('guide_mode_active', isGuideActive);
            document.body.classList.toggle('guide-mode-active', isGuideActive);
            updateGuideButtonState();
            if (!isGuideActive && hoverCard) {
                hoverCard.classList.remove('visible');
            }
            showToast(isGuideActive ? 'Interactive Guide Mode Enabled' : 'Guide Mode Disabled');
        });
    }

    // ─── Hover Annotation Cards ──────────────────────────────────────────
    let hoverTimeout;
    const annotatedElements = document.querySelectorAll('[data-step-guide]');

    annotatedElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (!isGuideActive || !hoverCard) return;
            clearTimeout(hoverTimeout);

            const guide = el.getAttribute('data-step-guide') || '';
            const title = el.getAttribute('data-step-title') || 'Interactive Feature';
            const action = el.getAttribute('data-step-action') || '👉 Click to interact';
            const stepNum = el.getAttribute('data-step-number') || '01';

            if (badgeEl) badgeEl.textContent = `STEP ${stepNum} • ONBOARDING GUIDE`;
            if (titleEl) titleEl.textContent = title;
            if (descEl) descEl.textContent = guide;
            if (actionEl) actionEl.textContent = action;

            const rect = el.getBoundingClientRect();
            const cardWidth = 320;
            const cardHeight = 150;

            // Position card smartly above or below target
            let left = rect.left + (rect.width / 2) - (cardWidth / 2);
            let top = rect.top - cardHeight - 12;

            // Clamp horizontally
            left = Math.max(16, Math.min(left, window.innerWidth - cardWidth - 16));

            // If too high for viewport, show below element
            if (top < 16) {
                top = rect.bottom + 12;
            }

            hoverCard.style.left = `${left}px`;
            hoverCard.style.top = `${top}px`;
            hoverCard.classList.add('visible');
        });

        el.addEventListener('mouseleave', () => {
            if (!hoverCard) return;
            hoverTimeout = setTimeout(() => {
                hoverCard.classList.remove('visible');
            }, 100);
        });
    });

    // ─── Step-by-Step Interactive Guided Tour ────────────────────────────
    const TOUR_STEPS = [
        {
            selector: '[data-step-number="01"]',
            title: 'Step 1: Theme Personalization',
            desc: 'Start by customizing the platform theme. Switch seamlessly between Indigo Cyber, Cyber Cyan & Emerald, or Deep Purple & Amber styles.',
            tip: '💡 Pro-Tip: Themes persist across all pages in local storage.'
        },
        {
            selector: '[data-step-number="02"]',
            title: 'Step 2: Instant Project Consultation',
            desc: 'Use the primary action button to jump directly to our automated project intake and custom agent specification form.',
            tip: '💡 Pro-Tip: Ideal for businesses seeking zero-touch automation swarms.'
        },
        {
            selector: '[data-step-number="03"]',
            title: 'Step 3: Open Source Ecosystem',
            desc: 'Explore our catalog of 379+ production repositories and flagship projects categorized into AI Agents, Full Stack, and Automations.',
            tip: '💡 Pro-Tip: Click Quick View on any project card to see tech stack breakdowns.'
        },
        {
            selector: '[data-step-number="04"]',
            title: 'Step 4: Autonomous Workflows Hub',
            desc: 'Navigate through our 4 core architecture tabs: 6-Stage Video Pipeline, 7-Agent Workforce Matrix, API Cost Optimizer, and Client Onboarding Engine.',
            tip: '💡 Pro-Tip: Each tab offers production-ready architectural schemas.'
        },
        {
            selector: '[data-step-number="05"]',
            title: 'Step 5: Multi-Agent Execution Simulator',
            desc: 'Test our 6-stage video automation pipeline in real time. Enter any topic keyword and watch research, scripting, voiceover, and video rendering stream in live logs.',
            tip: '💡 Pro-Tip: Demonstrates zero-touch content pipeline capabilities.'
        },
        {
            selector: '[data-step-number="06"]',
            title: 'Step 6: Real-Time API Cost Optimizer',
            desc: 'Adjust the monthly job slider and toggle Prompt Caching and Smart Model Routing to see how per-video costs drop from $2.10 down to $0.46 (78% margin).',
            tip: '💡 Pro-Tip: Shows how tiered LLM routing maximizes ROI.'
        },
        {
            selector: '[data-step-number="07"]',
            title: 'Step 7: Team Automation ROI Calculator',
            desc: 'Calculate annual hours recovered and gross dollar savings when deploying Xennials AI automations across your team size.',
            tip: '💡 Pro-Tip: Adjust manual hours per person to match your team workflows.'
        },
        {
            selector: '[data-step-number="08"]',
            title: 'Step 8: Deploy Custom AI Infrastructure',
            desc: 'Submit your specific technical requirements and our team will design, test, and deploy customized autonomous agent swarms for your organization.',
            tip: '💡 Pro-Tip: Responses are typically delivered within 24 hours.'
        }
    ];

    let currentTourStep = 0;

    function renderTourDots() {
        if (!modalDots) return;
        modalDots.innerHTML = '';
        TOUR_STEPS.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = `w-2 h-2 rounded-full transition-all ${idx === currentTourStep ? 'bg-indigo-500 w-5' : 'bg-slate-700'}`;
            modalDots.appendChild(dot);
        });
    }

    function showTourStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= TOUR_STEPS.length) return;
        currentTourStep = stepIndex;

        // Clear previous highlights
        document.querySelectorAll('.tour-step-highlight').forEach(el => el.classList.remove('tour-step-highlight'));

        const stepData = TOUR_STEPS[currentTourStep];
        const targetEl = document.querySelector(stepData.selector);

        if (targetEl) {
            targetEl.classList.add('tour-step-highlight');
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        if (modalStep) modalStep.textContent = `STEP ${currentTourStep + 1} OF ${TOUR_STEPS.length}`;
        if (modalTitle) modalTitle.textContent = stepData.title;
        if (modalDesc) modalDesc.textContent = stepData.desc;
        if (modalTip) modalTip.textContent = stepData.tip;

        if (modalPrev) modalPrev.disabled = currentTourStep === 0;
        if (modalPrev) modalPrev.style.opacity = currentTourStep === 0 ? '0.4' : '1';

        if (modalNext) {
            if (currentTourStep === TOUR_STEPS.length - 1) {
                modalNext.innerHTML = 'Finish Tour <i class="fas fa-check ml-1"></i>';
                modalNext.className = 'px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-emerald-600/30 transition-all';
            } else {
                modalNext.innerHTML = 'Next Step <i class="fas fa-chevron-right ml-1"></i>';
                modalNext.className = 'px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-600/30 transition-all';
            }
        }

        renderTourDots();
        if (modal) modal.classList.add('active');
    }

    function closeTour() {
        if (modal) modal.classList.remove('active');
        document.querySelectorAll('.tour-step-highlight').forEach(el => el.classList.remove('tour-step-highlight'));
    }

    if (startTourBtn) {
        startTourBtn.addEventListener('click', () => {
            showTourStep(0);
        });
    }

    if (modalNext) {
        modalNext.addEventListener('click', () => {
            if (currentTourStep >= TOUR_STEPS.length - 1) {
                closeTour();
                showToast('Guided Tour Complete! Enjoy exploring Xennials.', 'success');
            } else {
                showTourStep(currentTourStep + 1);
            }
        });
    }

    if (modalPrev) {
        modalPrev.addEventListener('click', () => {
            if (currentTourStep > 0) {
                showTourStep(currentTourStep - 1);
            }
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeTour);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeTour();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!modal || !modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeTour();
        if (e.key === 'ArrowRight' && currentTourStep < TOUR_STEPS.length - 1) showTourStep(currentTourStep + 1);
        if (e.key === 'ArrowLeft' && currentTourStep > 0) showTourStep(currentTourStep - 1);
    });
}


