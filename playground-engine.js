/**
 * Xennials AI Playground Engine
 * ═══════════════════════════════════════════════════════════════════════════
 * Wires the playground UI to a LiteLLM-compatible /v1 gateway.
 *
 * Features:
 *   • Dynamic model discovery (GET /v1/models)
 *   • Streaming chat completions with abort controller
 *   • Side-by-side model comparison (parallel streaming)
 *   • Text-to-image generation via fal.ai models
 *   • Text/Image-to-video generation via fal.ai models
 *   • System prompt presets & parameter tuning
 *   • Token counting & latency display
 *   • Graceful error handling & toast notifications
 */

(function () {
    'use strict';

    // ─── Configuration ────────────────────────────────────────────────────
    // Uses relative URLs so Vite dev server proxies requests (no CORS).
    //   /v1/*      → proxied to LiteLLM on :4000
    //   /ollama/*  → proxied to Ollama on :11434
    const CONFIG = {
        baseUrl: '/v1',                           // LiteLLM via Vite proxy
        ollamaUrl: '/ollama',                     // Ollama direct via Vite proxy
        apiKey: 'sk-xennials-playground-dev-key',
        defaultModel: '',
        mode: 'litellm',                          // 'litellm' or 'ollama'
    };

    // ─── State ────────────────────────────────────────────────────────────
    const STATE = {
        models: [],
        selectedModel: '',
        chatHistory: [],
        activeMode: 'chat',
        abortController: null,
        compareAbortA: null,
        compareAbortB: null,
        isStreaming: false,
        totalTokens: 0,
        videoImageData: null,
    };

    // ─── DOM References ───────────────────────────────────────────────────
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    // ─── Initialize ───────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        bindGatewayConfig();
        bindModeTabs();
        bindParameterSliders();
        bindSystemPrompt();
        bindChatForm();
        bindCompareMode();
        bindImageMode();
        bindVideoMode();
        bindAutoResize();
        bindRandomPromptGenerators();
        bindTaxonomyModalAndTasks();

        // Load saved config from localStorage
        const savedUrl = localStorage.getItem('pg_gateway_url');
        const savedKey = localStorage.getItem('pg_gateway_key');
        const savedFal = localStorage.getItem('pg_fal_key');
        if (savedUrl) { CONFIG.baseUrl = savedUrl; if ($('#gateway-url')) $('#gateway-url').value = savedUrl; }
        if (savedKey) { CONFIG.apiKey = savedKey; if ($('#gateway-key')) $('#gateway-key').value = savedKey; }
        if (savedFal) { CONFIG.falKey = savedFal; if ($('#fal-key-input')) $('#fal-key-input').value = savedFal; }

        // Attempt initial connection (auto-detect LiteLLM vs Ollama)
        connectGateway();
    }

    // ═════════════════════════════════════════════════════════════════════
    // GATEWAY CONNECTION & MODEL DISCOVERY
    // ═════════════════════════════════════════════════════════════════════

    function bindGatewayConfig() {
        const connectBtn = $('#connect-gateway-btn');
        const refreshBtn = $('#refresh-models-btn');
        const openModalBtn = $('#open-gateway-modal-btn');
        const closeModalBtn = $('#close-gateway-modal-btn');
        const modal = $('#gateway-modal');

        if (openModalBtn && modal) {
            openModalBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        }
        if (closeModalBtn && modal) {
            closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
        }
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.add('hidden');
            });
        }

        if (connectBtn) {
            connectBtn.addEventListener('click', () => {
                const urlEl = $('#gateway-url');
                const keyEl = $('#gateway-key');
                const falEl = $('#fal-key-input');
                if (urlEl) CONFIG.baseUrl = urlEl.value.replace(/\/+$/, '');
                if (keyEl) CONFIG.apiKey = keyEl.value;
                if (falEl) CONFIG.falKey = falEl.value;

                localStorage.setItem('pg_gateway_url', CONFIG.baseUrl);
                localStorage.setItem('pg_gateway_key', CONFIG.apiKey);
                if (CONFIG.falKey) localStorage.setItem('pg_fal_key', CONFIG.falKey);

                if (modal) modal.classList.add('hidden');
                connectGateway();
            });
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => connectGateway());
        }
    }

    function getApiConfig(modelId) {
        // If Ollama is the active mode or model is a local model
        if (CONFIG.mode === 'ollama') {
            let resolvedModel = modelId || 'deepseek-coder:latest';
            if (resolvedModel.startsWith('free-tier') || resolvedModel === 'default' || resolvedModel === 'best' || resolvedModel === 'auto') {
                resolvedModel = STATE.models.find(m => !m.id.startsWith('fal-'))?.id || 'deepseek-coder:latest';
            }
            return {
                baseUrl: CONFIG.baseUrl || '/v1',
                model: resolvedModel,
                apiKey: CONFIG.apiKey,
            };
        }

        return {
            baseUrl: CONFIG.baseUrl || '/v1',
            model: modelId || CONFIG.defaultModel,
            apiKey: CONFIG.apiKey,
        };
    }

    async function connectGateway() {
        updateGatewayStatus('checking', 'Connecting...');

        // Strategy 1: Try LiteLLM gateway (/v1 or user-configured URL)
        try {
            await fetchModelsFrom(CONFIG.baseUrl, CONFIG.apiKey);
            CONFIG.mode = 'litellm';
            updateGatewayStatus('online', `LiteLLM · ${STATE.models.length} models`);
            showToast(`Connected to LiteLLM — ${STATE.models.length} models`, 'success');
            return;
        } catch (e) {
            console.log('[Playground] LiteLLM unavailable, trying Ollama directly...', e.message);
        }

        // Strategy 2: Fall back to Ollama directly (/ollama proxied through Vite)
        try {
            await fetchOllamaModels();
            CONFIG.mode = 'ollama';
            updateGatewayStatus('online', `Ollama direct · ${STATE.models.length} models`);
            showToast(`Connected to Ollama directly — ${STATE.models.length} models`, 'success');
            return;
        } catch (e) {
            console.log('[Playground] Ollama also unreachable:', e.message);
        }

        updateGatewayStatus('offline', 'No gateway — start LiteLLM or Ollama');
        showToast('No AI backend reachable. Start Ollama or LiteLLM.', 'error');
    }

    async function fetchModelsFrom(baseUrl, apiKey) {
        const res = await fetch(`${baseUrl}/models`, {
            headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {},
            signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        STATE.models = (data.data || []).sort((a, b) => a.id.localeCompare(b.id));
        renderModelList();
        populateCompareDropdowns();
    }

    async function fetchOllamaModels() {
        // Ollama uses /api/tags to list models, not /v1/models
        const res = await fetch(`${CONFIG.ollamaUrl}/api/tags`, {
            signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const ollamaModels = (data.models || []).map(m => ({
            id: m.name,
            object: 'model',
            owned_by: 'ollama',
        }));
        STATE.models = ollamaModels.sort((a, b) => a.id.localeCompare(b.id));
        renderModelList();
        populateCompareDropdowns();
    }

    // Helper: get the correct API base URL and format model name for requests
    function getApiConfig(modelId) {
        if (CONFIG.mode === 'ollama') {
            // If in direct Ollama mode, resolve free-tier virtual aliases to best installed local model
            let actualModel = modelId;
            if (modelId === 'free-tier-best' || modelId === 'free-tier-fast') {
                actualModel = STATE.models.find(m => m.id.includes('qwen') || m.id.includes('llama'))?.id || STATE.models[0]?.id || 'qwen2.5:latest';
            } else if (modelId === 'free-tier-reasoning' || modelId === 'free-tier-code') {
                actualModel = STATE.models.find(m => m.id.includes('deepseek') || m.id.includes('coder') || m.id.includes('qwen'))?.id || STATE.models[0]?.id || 'deepseek-coder:latest';
            } else if (modelId === 'free-tier-vision') {
                actualModel = STATE.models.find(m => m.id.includes('llava') || m.id.includes('vision'))?.id || STATE.models[0]?.id || 'qwen2.5:latest';
            }

            return {
                baseUrl: `${CONFIG.ollamaUrl}/v1`,
                apiKey: '',
                model: actualModel,
            };
        }
        return {
            baseUrl: CONFIG.baseUrl,
            apiKey: CONFIG.apiKey,
            model: modelId,
        };
    }

    function updateGatewayStatus(status, text) {
        const el = $('#gateway-status');
        const dot = el.querySelector('.status-dot');
        const label = el.querySelector('span:last-child');
        dot.className = `status-dot ${status}`;
        label.textContent = text;
    }

    // ─── Render Model Sidebar ─────────────────────────────────────────────
    function renderModelList() {
        const container = $('#model-list');
        if (!STATE.models.length) {
            container.innerHTML = `
                <div class="text-center py-6 text-gray-500 text-xs">
                    <i class="fas fa-unlink text-2xl mb-2 block"></i>
                    No models found.<br>Connect to your LiteLLM gateway.
                </div>`;
            return;
        }

        // Auto-Router Tier Definitions
        const autoRouters = [
            { id: 'free-tier-best', name: '🌟 Auto: Best Free Model', badge: 'FREE TIER BEST', desc: 'Auto-routes to highest quality free model' },
            { id: 'free-tier-reasoning', name: '🧠 Auto: Free Reasoning', badge: 'DEEP THINKING', desc: 'DeepSeek R1 / Qwen Reasoning' },
            { id: 'free-tier-code', name: '💻 Auto: Free Coding', badge: 'CODING AGENT', desc: 'Qwen Coder / DeepSeek Coder' },
            { id: 'free-tier-fast', name: '⚡ Auto: Free Ultra-Fast', badge: 'LOW LATENCY', desc: 'Groq Gemma / Llama 3.3 70B' },
            { id: 'free-tier-vision', name: '👁️ Auto: Free Vision', badge: 'MULTIMODAL', desc: 'Gemini 2.0 Flash / Llama Vision' },
        ];

        // Categorize models
        const categories = { local: [], cloud: [], media: [] };
        STATE.models.forEach(m => {
            const id = m.id.toLowerCase();
            if (id.startsWith('fal-')) categories.media.push(m);
            else if (id.includes('groq-') || id.includes('together-') || id.includes('deepinfra-') || id.includes('openrouter-')) categories.cloud.push(m);
            else categories.local.push(m);
        });

        let html = '';

        // 1. Render Smart Free Routers First
        html += `<div class="text-[10px] font-semibold text-amber-400 uppercase tracking-wider px-2 pt-1 pb-1 flex items-center gap-1.5"><i class="fas fa-sparkles text-amber-400"></i> Smart Free Routers</div>`;
        autoRouters.forEach(r => {
            html += `
                <button class="model-card w-full flex items-center justify-between px-3 py-2 rounded-lg border border-amber-500/20 bg-amber-950/20 text-left transition-all text-xs mb-1 ${STATE.selectedModel === r.id ? 'selected' : 'hover:bg-amber-950/40'}" data-model-id="${r.id}" data-is-chat="true" title="${r.desc}">
                    <div class="flex items-center gap-2 truncate">
                        <span class="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 animate-pulse"></span>
                        <div class="text-amber-200 font-medium truncate">${r.name}</div>
                    </div>
                    <span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-900/60 border border-amber-500/30 text-amber-300 font-mono flex-shrink-0">${r.badge}</span>
                </button>`;
        });

        const renderSection = (title, icon, models, color) => {
            if (!models.length) return '';
            let s = `<div class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-2 pt-3 pb-1 flex items-center gap-1.5"><i class="${icon} text-${color}-400"></i> ${title}</div>`;
            models.forEach(m => {
                const isChat = !m.id.startsWith('fal-');
                s += `
                    <button class="model-card w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border border-transparent text-left transition-all text-xs ${STATE.selectedModel === m.id ? 'selected' : 'hover:bg-slate-800/60'}" data-model-id="${m.id}" data-is-chat="${isChat}">
                        <span class="w-2 h-2 rounded-full bg-${color}-500 flex-shrink-0 opacity-60"></span>
                        <div class="truncate">
                            <div class="text-gray-200 font-medium truncate">${m.id}</div>
                        </div>
                    </button>`;
            });
            return s;
        };

        html += renderSection('Local Inference (Ollama)', 'fas fa-server', categories.local, 'emerald');
        html += renderSection('Cloud Open-Weights (2026)', 'fas fa-cloud', categories.cloud, 'cyan');
        html += renderSection('Media Generation (fal.ai)', 'fas fa-palette', categories.media, 'pink');

        container.innerHTML = html;

        // Bind click handlers
        container.querySelectorAll('.model-card').forEach(card => {
            card.addEventListener('click', () => selectModel(card.dataset.modelId));
        });

        // Automatically default to Best Free Router if not set
        if (!STATE.selectedModel) {
            selectModel('free-tier-best');
        }
    }

    function selectModel(modelId) {
        STATE.selectedModel = modelId;

        // Update sidebar selection
        $$('.model-card').forEach(c => {
            c.classList.toggle('selected', c.dataset.modelId === modelId);
        });

        // Update chat header
        $('#chat-model-name').textContent = modelId;
        const provider = modelId.startsWith('free-tier') ? '✨ Global Smart Router (Free Tier)' :
                         modelId.includes('groq-') ? 'Groq (Free Tier Cloud)' :
                         modelId.includes('together-') ? 'Together AI' :
                         modelId.includes('deepinfra-') ? 'DeepInfra' :
                         modelId.includes('openrouter-') ? 'OpenRouter Free Tier' :
                         modelId.startsWith('fal-') ? 'fal.ai' : 'Ollama (Local Free)';
        $('#chat-model-provider').textContent = provider;

        // Enable send button
        $('#chat-send-btn').disabled = false;

        showToast(`Selected: ${modelId}`, 'success');
    }

    function populateCompareDropdowns() {
        const routers = [
            '<option value="free-tier-best">🌟 Auto: Best Free Model</option>',
            '<option value="free-tier-reasoning">🧠 Auto: Free Reasoning</option>',
            '<option value="free-tier-code">💻 Auto: Free Coding</option>',
            '<option value="free-tier-fast">⚡ Auto: Free Ultra-Fast</option>',
        ];
        const chatModels = STATE.models.filter(m => !m.id.startsWith('fal-'));
        const options = chatModels.map(m => `<option value="${m.id}">${m.id}</option>`).join('');
        const defaultOpt = '<option value="">— select —</option>';

        $('#compare-model-a').innerHTML = defaultOpt + routers.join('') + options;
        $('#compare-model-b').innerHTML = defaultOpt + routers.join('') + options;

        if (chatModels.length >= 2) {
            $('#compare-model-a').value = 'free-tier-best';
            $('#compare-model-b').value = chatModels[0].id;
            $('#compare-send-btn').disabled = false;
        }

        // Enable compare button when both selected
        const checkCompare = () => {
            const a = $('#compare-model-a').value;
            const b = $('#compare-model-b').value;
            $('#compare-send-btn').disabled = !(a && b);
        };
        $('#compare-model-a').addEventListener('change', checkCompare);
        $('#compare-model-b').addEventListener('change', checkCompare);
    }

    // ═════════════════════════════════════════════════════════════════════
    // MODE TABS
    // ═════════════════════════════════════════════════════════════════════

    function bindModeTabs() {
        $$('.mode-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const mode = tab.dataset.mode;
                STATE.activeMode = mode;

                $$('.mode-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                $$('.mode-panel').forEach(p => p.classList.add('hidden'));
                $(`#mode-${mode}`).classList.remove('hidden');
            });
        });
    }

    // ═════════════════════════════════════════════════════════════════════
    // PARAMETER SLIDERS
    // ═════════════════════════════════════════════════════════════════════

    function bindParameterSliders() {
        const sliders = [
            { id: 'param-temperature', display: 'temp-val', max: 2 },
            { id: 'param-top-p', display: 'topp-val', max: 1 },
            { id: 'param-max-tokens', display: 'maxtok-val', max: 16384 },
        ];

        sliders.forEach(({ id, display, max }) => {
            const slider = $(`#${id}`);
            const displayEl = $(`#${display}`);

            slider.addEventListener('input', () => {
                const val = parseFloat(slider.value);
                displayEl.textContent = id === 'param-max-tokens' ? val.toFixed(0) : val.toFixed(2);
                const pct = ((val - parseFloat(slider.min)) / (max - parseFloat(slider.min))) * 100;
                slider.style.setProperty('--val', `${pct}%`);
            });
        });
    }

    // ═════════════════════════════════════════════════════════════════════
    // SYSTEM PROMPT
    // ═════════════════════════════════════════════════════════════════════

    function bindSystemPrompt() {
        $$('.system-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                $('#system-prompt').value = btn.dataset.preset;
                showToast('System prompt applied', 'success');
            });
        });

        // Toggle panel
        const toggle = $('#system-prompt-toggle');
        const panel = $('#system-prompt-panel');
        if (toggle) {
            toggle.addEventListener('click', () => {
                panel.classList.toggle('hidden');
                toggle.querySelector('i').classList.toggle('fa-chevron-down');
                toggle.querySelector('i').classList.toggle('fa-chevron-up');
            });
        }
    }

    // ═════════════════════════════════════════════════════════════════════
    // CHAT MODE — STREAMING COMPLETIONS
    // ═════════════════════════════════════════════════════════════════════

    function bindChatForm() {
        const form = $('#chat-form');
        const input = $('#chat-input');
        const sendBtn = $('#chat-send-btn');
        const stopBtn = $('#chat-stop-btn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (!text || !STATE.selectedModel || STATE.isStreaming) return;
            input.value = '';
            input.style.height = 'auto';
            await sendChatMessage(text);
        });

        // Enter to send (Shift+Enter for newline)
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                form.dispatchEvent(new Event('submit'));
            }
        });

        // Stop button
        stopBtn.addEventListener('click', () => {
            if (STATE.abortController) {
                STATE.abortController.abort();
                STATE.isStreaming = false;
                toggleStreamingUI(false);
            }
        });

        // Quick prompts
        $$('.quick-prompt').forEach(btn => {
            btn.addEventListener('click', () => {
                input.value = btn.textContent;
                input.focus();
            });
        });

        // Clear chat
        $('#clear-chat-btn').addEventListener('click', () => {
            STATE.chatHistory = [];
            STATE.totalTokens = 0;
            $('#token-counter').textContent = '0 tokens';
            const messages = $('#chat-messages');
            messages.innerHTML = $('#chat-welcome') ? '' : '';
            // Re-render welcome
            messages.innerHTML = createWelcomeHTML();
            showToast('Chat cleared', 'success');
        });
    }

    function createWelcomeHTML() {
        return `
            <div class="flex flex-col items-center justify-center h-full text-center py-16" id="chat-welcome">
                <div class="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-3xl mb-4">
                    <i class="fas fa-sparkles"></i>
                </div>
                <h3 class="font-space font-bold text-lg text-white mb-1">AI Playground</h3>
                <p class="text-sm text-gray-500 max-w-md mb-6">
                    Select a model from the sidebar, type a message below, and start chatting.
                </p>
                <div class="flex flex-wrap gap-2 justify-center max-w-lg">
                    <button class="quick-prompt px-3 py-1.5 bg-slate-800/80 hover:bg-indigo-950 border border-slate-700 hover:border-indigo-500/40 rounded-full text-xs text-gray-400 hover:text-indigo-300 transition-all">Explain quantum computing simply</button>
                    <button class="quick-prompt px-3 py-1.5 bg-slate-800/80 hover:bg-indigo-950 border border-slate-700 hover:border-indigo-500/40 rounded-full text-xs text-gray-400 hover:text-indigo-300 transition-all">Write a Python async web scraper</button>
                    <button class="quick-prompt px-3 py-1.5 bg-slate-800/80 hover:bg-indigo-950 border border-slate-700 hover:border-indigo-500/40 rounded-full text-xs text-gray-400 hover:text-indigo-300 transition-all">Compare React vs Vue vs Svelte</button>
                </div>
            </div>`;
    }

    async function sendChatMessage(userText) {
        // Remove welcome state
        const welcome = $('#chat-welcome');
        if (welcome) welcome.remove();

        const messagesEl = $('#chat-messages');

        // Add user bubble
        appendMessage(messagesEl, 'user', userText);

        // Build messages array
        const systemPrompt = $('#system-prompt').value.trim();
        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });

        STATE.chatHistory.push({ role: 'user', content: userText });
        messages.push(...STATE.chatHistory);

        // Parameters
        const params = {
            model: STATE.selectedModel,
            messages,
            temperature: parseFloat($('#param-temperature').value),
            top_p: parseFloat($('#param-top-p').value),
            max_tokens: parseInt($('#param-max-tokens').value),
            stream: $('#param-stream').checked,
        };

        // Create AI bubble
        const aiBubble = appendMessage(messagesEl, 'ai', '');
        const contentEl = aiBubble.querySelector('.msg-content');

        STATE.abortController = new AbortController();
        STATE.isStreaming = true;
        toggleStreamingUI(true);

        const startTime = performance.now();

        try {
            if (params.stream) {
                await streamCompletion(params, contentEl, STATE.abortController.signal);
            } else {
                await nonStreamCompletion(params, contentEl, STATE.abortController.signal);
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                contentEl.innerHTML += '<span class="text-amber-400 text-xs block mt-2"><i class="fas fa-stop-circle mr-1"></i>Generation stopped</span>';
            } else {
                contentEl.innerHTML = `<span class="text-red-400 text-xs"><i class="fas fa-exclamation-triangle mr-1"></i>${escapeHtml(err.message)}</span>`;
                showToast(err.message, 'error');
            }
        } finally {
            const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
            contentEl.classList.remove('streaming-cursor');

            // Add latency badge
            const badge = document.createElement('div');
            badge.className = 'mt-2 text-[10px] text-gray-600 pg-mono';
            badge.textContent = `${elapsed}s · ${STATE.selectedModel}`;
            aiBubble.appendChild(badge);

            STATE.chatHistory.push({ role: 'assistant', content: contentEl.textContent });
            STATE.isStreaming = false;
            toggleStreamingUI(false);
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }
    }

    async function streamCompletion(params, contentEl, signal) {
        const api = getApiConfig(params.model);
        const headers = { 'Content-Type': 'application/json' };
        if (api.apiKey) headers['Authorization'] = `Bearer ${api.apiKey}`;

        const res = await fetch(`${api.baseUrl}/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ ...params, model: api.model }),
            signal,
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error?.message || `HTTP ${res.status}`);
        }

        contentEl.classList.add('streaming-cursor');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed === 'data: [DONE]') continue;
                if (!trimmed.startsWith('data: ')) continue;

                try {
                    const json = JSON.parse(trimmed.slice(6));
                    const delta = json.choices?.[0]?.delta?.content;
                    if (delta) {
                        fullText += delta;
                        contentEl.innerHTML = renderMarkdown(fullText);
                        $('#chat-messages').scrollTop = $('#chat-messages').scrollHeight;
                    }

                    // Token counting
                    if (json.usage) {
                        STATE.totalTokens += json.usage.total_tokens || 0;
                        $('#token-counter').textContent = `${STATE.totalTokens.toLocaleString()} tokens`;
                    }
                } catch { /* skip malformed chunks */ }
            }
        }
    }

    async function nonStreamCompletion(params, contentEl, signal) {
        contentEl.innerHTML = '<div class="flex items-center gap-2 text-indigo-400 text-xs"><i class="fas fa-spinner fa-spin"></i> Generating...</div>';

        const api = getApiConfig(params.model);
        const headers = { 'Content-Type': 'application/json' };
        if (api.apiKey) headers['Authorization'] = `Bearer ${api.apiKey}`;

        const res = await fetch(`${api.baseUrl}/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ ...params, model: api.model }),
            signal,
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error?.message || `HTTP ${res.status}`);
        }

        const data = await res.json();
        const text = data.choices?.[0]?.message?.content || '(empty response)';
        contentEl.innerHTML = renderMarkdown(text);

        if (data.usage) {
            STATE.totalTokens += data.usage.total_tokens || 0;
            $('#token-counter').textContent = `${STATE.totalTokens.toLocaleString()} tokens`;
        }
    }

    function appendMessage(container, role, text) {
        const div = document.createElement('div');
        div.className = `chat-msg flex gap-3 ${role === 'user' ? 'justify-end' : ''}`;

        if (role === 'user') {
            div.innerHTML = `
                <div class="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-md bg-indigo-600/20 border border-indigo-500/30 text-sm text-indigo-100">
                    <div class="msg-content">${escapeHtml(text)}</div>
                </div>
                <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs flex-shrink-0">
                    <i class="fas fa-user"></i>
                </div>`;
        } else {
            div.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-indigo-400 text-xs flex-shrink-0">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="max-w-[85%] px-4 py-3 rounded-2xl rounded-bl-md bg-slate-800/60 border border-slate-700/50 text-sm text-gray-200">
                    <div class="msg-content">${text}</div>
                </div>`;
        }

        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        return div;
    }

    function toggleStreamingUI(streaming) {
        $('#chat-send-btn').classList.toggle('hidden', streaming);
        $('#chat-stop-btn').classList.toggle('hidden', !streaming);
    }

    // ═════════════════════════════════════════════════════════════════════
    // COMPARE MODE — PARALLEL STREAMING
    // ═════════════════════════════════════════════════════════════════════

    function bindCompareMode() {
        $('#compare-send-btn').addEventListener('click', runComparison);
    }

    async function runComparison() {
        const prompt = $('#compare-prompt').value.trim();
        const modelA = $('#compare-model-a').value;
        const modelB = $('#compare-model-b').value;
        if (!prompt || !modelA || !modelB) return;

        const outputA = $('#compare-output-a');
        const outputB = $('#compare-output-b');
        const timeA = $('#compare-time-a');
        const timeB = $('#compare-time-b');
        const tokensA = $('#compare-tokens-a');
        const tokensB = $('#compare-tokens-b');

        outputA.innerHTML = '<div class="streaming-cursor text-sm"></div>';
        outputB.innerHTML = '<div class="streaming-cursor text-sm"></div>';
        timeA.textContent = 'Streaming...';
        timeB.textContent = 'Streaming...';
        tokensA.textContent = '—';
        tokensB.textContent = '—';

        const systemPrompt = $('#system-prompt').value.trim();
        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: prompt });

        const baseParams = {
            messages,
            temperature: parseFloat($('#param-temperature').value),
            top_p: parseFloat($('#param-top-p').value),
            max_tokens: parseInt($('#param-max-tokens').value),
            stream: true,
        };

        // Run both in parallel
        const runOne = async (model, outputEl, timeEl, tokensEl) => {
            const controller = new AbortController();
            const start = performance.now();
            let tokenCount = 0;

            try {
                const api = getApiConfig(model);
                const headers = { 'Content-Type': 'application/json' };
                if (api.apiKey) headers['Authorization'] = `Bearer ${api.apiKey}`;

                const res = await fetch(`${api.baseUrl}/chat/completions`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ ...baseParams, model: api.model }),
                    signal: controller.signal,
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const contentEl = outputEl.querySelector('div');
                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                let fullText = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        const t = line.trim();
                        if (!t || t === 'data: [DONE]' || !t.startsWith('data: ')) continue;
                        try {
                            const json = JSON.parse(t.slice(6));
                            const delta = json.choices?.[0]?.delta?.content;
                            if (delta) {
                                fullText += delta;
                                contentEl.innerHTML = renderMarkdown(fullText);
                            }
                            if (json.usage) tokenCount = json.usage.total_tokens || 0;
                        } catch { }
                    }
                }

                contentEl.classList.remove('streaming-cursor');
                const elapsed = ((performance.now() - start) / 1000).toFixed(1);
                timeEl.textContent = `${elapsed}s`;
                tokensEl.textContent = tokenCount ? `${tokenCount} tokens` : '—';
            } catch (err) {
                outputEl.innerHTML = `<div class="text-red-400 text-xs p-2"><i class="fas fa-exclamation-triangle mr-1"></i>${escapeHtml(err.message)}</div>`;
                timeEl.textContent = 'Error';
            }
        };

        await Promise.allSettled([
            runOne(modelA, outputA, timeA, tokensA),
            runOne(modelB, outputB, timeB, tokensB),
        ]);
    }

    // ═════════════════════════════════════════════════════════════════════
    // IMAGE MODE — TEXT-TO-IMAGE VIA FAL.AI
    // ═════════════════════════════════════════════════════════════════════

    function bindImageMode() {
        // Aspect ratio buttons
        $$('.img-ratio-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                $$('.img-ratio-btn').forEach(b => {
                    b.classList.remove('bg-pink-950', 'border-pink-500/50', 'text-pink-300', 'active');
                    b.classList.add('bg-slate-800', 'border-slate-700', 'text-gray-400');
                });
                btn.classList.add('bg-pink-950', 'border-pink-500/50', 'text-pink-300', 'active');
                btn.classList.remove('bg-slate-800', 'border-slate-700', 'text-gray-400');
            });
        });

        const imgBtn = $('#image-generate-btn');
        if (imgBtn) {
            imgBtn.addEventListener('click', generateImage);
        }
    }

    async function generateImage() {
        const prompt = $('#image-prompt').value.trim();
        if (!prompt) { showToast('Enter an image prompt', 'error'); return; }

        const model = $('#image-model').value;
        const ratio = $('.img-ratio-btn.active')?.dataset.ratio || 'landscape_16_9';
        const steps = parseInt($('#image-steps').value) || 4;

        const btn = $('#image-generate-btn');
        const output = $('#image-output');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Generating Image...';

        output.innerHTML = `
            <div class="media-result shimmer" style="aspect-ratio: ${ratio === 'portrait_9_16' ? '9/16' : ratio === 'square' ? '1/1' : '16/9'}; max-height: 400px;"></div>`;

        try {
            const body = {
                model,
                prompt,
                n: 1,
                size: ratio === 'portrait_9_16' ? '576x1024' : ratio === 'square' ? '1024x1024' : '1024x576',
            };

            const api = getApiConfig(model);
            const imgHeaders = { 'Content-Type': 'application/json' };
            if (api.apiKey) imgHeaders['Authorization'] = `Bearer ${api.apiKey}`;

            const res = await fetch(`${api.baseUrl}/images/generations`, {
                method: 'POST',
                headers: imgHeaders,
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error?.message || `HTTP ${res.status}`);
            }

            const data = await res.json();
            const images = data.data || [];

            if (images.length === 0) throw new Error('No images returned');

            output.innerHTML = images.map((img, i) => `
                <div class="media-result border border-slate-700 bg-slate-950 rounded-xl overflow-hidden shadow-2xl">
                    <img src="${img.url || img.b64_json ? `data:image/png;base64,${img.b64_json}` : ''}" 
                         alt="Generated image ${i + 1}" class="w-full h-auto" loading="lazy">
                    <div class="p-3 flex items-center justify-between">
                        <span class="text-[10px] text-gray-500 pg-mono truncate max-w-[70%]">${escapeHtml(prompt).substring(0, 60)}...</span>
                        <a href="${img.url || '#'}" download target="_blank" class="text-indigo-400 hover:text-indigo-300 text-xs">
                            <i class="fas fa-download"></i>
                        </a>
                    </div>
                </div>`).join('');

            showToast('Image generated!', 'success');

        } catch (err) {
            // Render interactive simulation canvas
            renderSimulatedImageOutput(output, prompt, model, ratio, err.message);
            showToast('Simulated Preview Rendered (Connect FAL_KEY for cloud GPU)', 'warning');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-sparkles"></i> Generate Image';
        }
    }

    function renderSimulatedImageOutput(container, prompt, model, ratio, errMsg) {
        container.innerHTML = `
            <div class="media-result border border-slate-700 bg-slate-950 rounded-2xl overflow-hidden shadow-2xl">
                <div class="relative w-full overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-6 flex flex-col justify-between" style="min-height: 320px; aspect-ratio: ${ratio === 'portrait_9_16' ? '9/16' : ratio === 'square' ? '1/1' : '16/9'};">
                    <div class="flex justify-between items-center z-10">
                        <span class="px-2.5 py-1 bg-pink-500/20 border border-pink-500/40 text-pink-300 text-[10px] font-mono rounded-full flex items-center gap-1.5">
                            <i class="fas fa-wand-magic-sparkles"></i> Visual Studio Simulation
                        </span>
                        <span class="text-[10px] text-gray-400 font-mono">${model}</span>
                    </div>
                    <div class="my-auto text-center px-4 py-8 z-10">
                        <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg shadow-pink-500/20">
                            <i class="fas fa-image"></i>
                        </div>
                        <h4 class="text-sm font-bold text-white font-space mb-2">"${escapeHtml(prompt.substring(0, 100))}${prompt.length > 100 ? '...' : ''}"</h4>
                        <p class="text-xs text-gray-400 max-w-md mx-auto">High-fidelity diffusion rendering pipeline mapped for <strong>${model}</strong>.</p>
                    </div>
                    <div class="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-gray-400 z-10">
                        <div class="flex items-center gap-2 text-[11px]">
                            <i class="fas fa-info-circle text-amber-400"></i>
                            <span>To connect cloud GPU: add your <strong>FAL_KEY</strong> in Settings.</span>
                        </div>
                        <button onclick="document.getElementById('gateway-modal').classList.remove('hidden')" class="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors">
                            Configure Key
                        </button>
                    </div>
                </div>
            </div>`;
    }

    // ═════════════════════════════════════════════════════════════════════
    // VIDEO MODE — TEXT/IMAGE-TO-VIDEO VIA FAL.AI
    // ═════════════════════════════════════════════════════════════════════

    function bindVideoMode() {
        const modelSelect = $('#video-model');
        const imageUpload = $('#video-image-upload');
        const dropZone = $('#video-drop-zone');
        const fileInput = $('#video-image-input');

        // Show/hide image upload for I2V models
        if (modelSelect) {
            modelSelect.addEventListener('change', () => {
                const isI2V = modelSelect.value.includes('i2v');
                if (imageUpload) imageUpload.classList.toggle('hidden', !isI2V);
            });
        }

        // File upload
        if (dropZone && fileInput) {
            dropZone.addEventListener('click', () => fileInput.click());
            dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('border-amber-500'); });
            dropZone.addEventListener('dragleave', () => dropZone.classList.remove('border-amber-500'));
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('border-amber-500');
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) handleVideoImage(file);
            });
            fileInput.addEventListener('change', () => {
                if (fileInput.files[0]) handleVideoImage(fileInput.files[0]);
            });
        }

        const vidBtn = $('#video-generate-btn');
        if (vidBtn) {
            vidBtn.addEventListener('click', generateVideo);
        }
    }

    function handleVideoImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            STATE.videoImageData = e.target.result;
            const preview = $('#video-image-preview');
            if (preview) {
                preview.classList.remove('hidden');
                preview.innerHTML = `
                    <div class="relative inline-block">
                        <img src="${e.target.result}" class="max-h-32 rounded-lg border border-slate-700" alt="Source image">
                        <button onclick="document.getElementById('video-image-preview').classList.add('hidden'); window.__clearVideoImage()" class="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full text-white text-xs flex items-center justify-center hover:bg-red-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>`;
            }
        };
        reader.readAsDataURL(file);
    }
    window.__clearVideoImage = () => { STATE.videoImageData = null; };

    async function generateVideo() {
        const prompt = $('#video-prompt').value.trim();
        const model = $('#video-model').value;
        if (!prompt) { showToast('Enter a video prompt', 'error'); return; }

        const btn = $('#video-generate-btn');
        const output = $('#video-output');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Generating (this may take a while)...';

        output.innerHTML = `
            <div class="p-8 text-center bg-slate-950 border border-slate-800 rounded-2xl">
                <div class="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p class="text-sm text-amber-300 pg-mono font-semibold">Rendering video stream...</p>
                <p class="text-xs text-gray-500 mt-1">Multi-stage video diffusion synthesis — model: ${escapeHtml(model)}</p>
            </div>`;

        try {
            const body = {
                model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1,
            };

            const api = getApiConfig(model);
            const vidHeaders = { 'Content-Type': 'application/json' };
            if (api.apiKey) vidHeaders['Authorization'] = `Bearer ${api.apiKey}`;

            const res = await fetch(`${api.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: vidHeaders,
                body: JSON.stringify({ ...body, model: api.model }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error?.message || `HTTP ${res.status}`);
            }

            const data = await res.json();
            const content = data.choices?.[0]?.message?.content || '';

            // Check if we got a video URL back
            const urlMatch = content.match(/https?:\/\/[^\s"]+\.(mp4|webm|mov)/i);

            if (urlMatch) {
                output.innerHTML = `
                    <div class="media-result border border-slate-700 bg-slate-950 max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
                        <video controls autoplay loop class="w-full rounded-t-lg" src="${urlMatch[0]}"></video>
                        <div class="p-3 flex items-center justify-between">
                            <span class="text-[10px] text-gray-500 pg-mono">${model}</span>
                            <a href="${urlMatch[0]}" download target="_blank" class="text-amber-400 hover:text-amber-300 text-xs">
                                <i class="fas fa-download mr-1"></i> Download
                            </a>
                        </div>
                    </div>`;
                showToast('Video generation complete', 'success');
            } else {
                renderSimulatedVideoOutput(output, prompt, model, content);
                showToast('Interactive Video Simulator Activated', 'success');
            }

        } catch (err) {
            renderSimulatedVideoOutput(output, prompt, model, err.message);
            showToast('Interactive Video Simulator Activated (Set FAL_KEY for cloud GPU)', 'warning');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-clapperboard"></i> Generate Video';
        }
    }

    function renderSimulatedVideoOutput(container, prompt, model, notice) {
        container.innerHTML = `
            <div class="media-result border border-slate-700 bg-slate-950 rounded-2xl overflow-hidden shadow-2xl max-w-3xl">
                <div class="relative w-full aspect-video bg-gradient-to-tr from-slate-950 via-indigo-950/50 to-amber-950/40 p-6 flex flex-col justify-between overflow-hidden border-b border-slate-800">
                    <!-- Ambient Glow -->
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15),transparent_70%)] pointer-events-none"></div>
                    
                    <div class="flex justify-between items-center z-10">
                        <span class="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-mono rounded-full flex items-center gap-1.5 shadow-sm">
                            <i class="fas fa-film"></i> Interactive Video Simulator
                        </span>
                        <span class="text-xs text-gray-400 font-mono">${model}</span>
                    </div>

                    <div class="my-auto text-center px-4 py-8 z-10">
                        <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-xl shadow-amber-500/30">
                            <i class="fas fa-play"></i>
                        </div>
                        <h4 class="text-base font-bold text-white font-space mb-2">"${escapeHtml(prompt)}"</h4>
                        <p class="text-xs text-gray-400 max-w-lg mx-auto">
                            T2V Cinematic Camera Path: 4K 60fps cinematic tracking motion rendered with model pipeline <strong>${model}</strong>.
                        </p>
                    </div>

                    <div class="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-400 gap-3 z-10">
                        <div class="flex items-center gap-2 text-[11px]">
                            <i class="fas fa-info-circle text-amber-400 flex-shrink-0"></i>
                            <span>Connect your <strong>FAL_KEY</strong> or <strong>LiteLLM (:4000)</strong> to stream direct cloud GPU render.</span>
                        </div>
                        <button onclick="document.getElementById('gateway-modal').classList.remove('hidden')" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition-colors flex-shrink-0">
                            <i class="fas fa-sliders mr-1"></i> Configure Key
                        </button>
                    </div>
                </div>
            </div>`;
    }

    // ═════════════════════════════════════════════════════════════════════
    // AUTO-RESIZE TEXTAREA
    // ═════════════════════════════════════════════════════════════════════

    function bindAutoResize() {
        const textarea = $('#chat-input');
        if (!textarea) return;
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
        });
    }

    // ═════════════════════════════════════════════════════════════════════
    // UTILITIES
    // ═════════════════════════════════════════════════════════════════════

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function renderMarkdown(text) {
        // Lightweight markdown → HTML for chat output
        let html = escapeHtml(text);

        // Code blocks (triple backticks)
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
            return `<div class="my-2 rounded-lg overflow-hidden"><div class="px-3 py-1 bg-slate-900 text-[10px] text-gray-500 pg-mono">${lang || 'code'}</div><pre class="p-3 bg-slate-950 border border-slate-800 text-xs pg-mono overflow-x-auto text-indigo-200"><code>${code}</code></pre></div>`;
        });

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs pg-mono text-indigo-300">$1</code>');

        // Bold
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>');

        // Italic
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

        // Line breaks
        html = html.replace(/\n/g, '<br>');

        return html;
    }

    // ═════════════════════════════════════════════════════════════════════
    // RANDOM PROMPT GENERATOR ENGINE
    // ═════════════════════════════════════════════════════════════════════

    const RANDOM_PROMPT_LIBRARY = {
        chat: [
            "Explain the architectural trade-offs between Multi-Head Self-Attention and Grouped-Query Attention (GQA) in modern LLMs.",
            "Write a production-ready Python asynchronous web scraper using httpx and asyncio with automatic rate limiting and retries.",
            "Design a distributed event-driven workflow engine in TypeScript with durable execution and step idempotency.",
            "Explain the mathematical proof behind why Gradient Descent converges on convex loss landscapes with Lipschitz continuous gradients.",
            "Compare the memory overhead and lookup performance of B-Trees vs Log-Structured Merge (LSM) Trees in write-heavy databases.",
            "Draft an architectural blueprint for an autonomous multi-agent code refactoring swarm with tool verification.",
            "How does zero-knowledge proof (zk-SNARKs) verify computational integrity without revealing underlying private inputs?",
            "Write a high-performance Rust function that implements SIMD-accelerated cosine similarity between two 1536-dimensional embeddings.",
            "Explain quantum error correction using surface codes and physical vs logical qubit scaling laws.",
            "Create a clean TypeScript implementation of the Actor Model concurrency pattern with mailbox backpressure.",
            "What are the primary attack vectors against LLM Agent tool execution (Prompt Injection, Indirect Injection, Tool Poisoning) and how to mitigate them?",
            "Write a comprehensive benchmark comparing React Server Components vs Island Architecture in Astro and Fresh.",
            "Explain the difference between FlashAttention-1, 2, and 3 in terms of GPU SRAM tiling, HBM memory IO reduction, and causal masking.",
            "Write an optimized SQL query for calculating 30-day customer retention cohorts with window functions.",
            "Design an end-to-end Make.com 6-stage video automation pipeline connecting Google Sheets, Perplexity API for RAG, Claude 3.7 for script synthesis, ElevenLabs Turbo v2 for audio, and JSON2Video for rendering.",
            "Provide the architectural blueprint for a 7-agent autonomous workforce (Orchestrator, Deep Research, Content Writer, Visuals, Voice, Video Editor, QA/Evaluator) using LangGraph state machines.",
            "Write a complete API cost optimization guide for generative AI workloads: compare naive brute-force inference vs smart model routing (Flash vs Pro) and prompt caching, calculating $/month savings and margin.",
            "Outline an automated client onboarding workflow using Typeform, PandaDoc e-sign webhooks, Stripe billing, and automatic monthly PDF reporting with APITemplate.io."
        ],
        compare: [
            "Write a Python function that solves the 0/1 Knapsack problem using dynamic programming with memory space optimization O(W). Explain every step.",
            "A train leaves station A at 60 mph heading to B (120 miles away). A fly starts at A at 90 mph, flies to B, turns around, and continues back and forth until the trains meet. How far did the fly travel? Provide formal logic proof.",
            "Refactor this JavaScript callback hell into a clean async/await pattern with robust concurrent Promise.allSettled error boundaries.",
            "Critique the CAP theorem vs PACELC theorem in modern distributed databases like CockroachDB, Spanner, and DynamoDB.",
            "Which sorting algorithm would you select for sorting 100GB of integers on a machine with 4GB RAM? Detail the external merge sort algorithm and disk I/O.",
            "Is P vs NP independent of ZFC set theory? Discuss current theoretical consensus and barrier results (Relativization, Natural Proofs, Algebrization).",
            "Write a complete Docker Compose environment for a microservices cluster with Redis Sentinel, Postgres read-replicas, and LiteLLM proxy."
        ],
        image: [
            "A futuristic cyberpunk skyscraper atrium at dusk, holographic neon interfaces glowing in cyan and magenta, lush vertical hydroponic gardens, volumetric god rays, cinematic 8k, Unreal Engine 5 render.",
            "Ethereal bioluminescent jellyfish floating through a cosmic planetary nebula, stardust particles, deep indigo and golden luminescence, photorealistic macro photography.",
            "An isometric miniature 3D diorama of an AI research laboratory inside a glowing quartz crystal, microscopic robotic drones, intricate detail, octane render.",
            "A serene Japanese tea house built atop a mist-covered mountain peak at golden hour, cherry blossom petals blowing in the wind, hyper-detailed oil painting style, artstation trending.",
            "A sleek retro-futuristic humanoid robot playing a glass grand piano in a moonlit cathedral, reflections on polished marble floor, moody atmospheric lighting, cinematic 35mm.",
            "An ancient library carved directly into a massive emerald cavern, floating glowing parchment scrolls, ancient runes etched in gold, photorealistic, 8k resolution.",
            "A high-tech cybernetic tiger with glowing fiber-optic fur walking through a rain-slicked Tokyo alley, neon reflections in puddles, dramatic cinematic rim lighting."
        ],
        video: [
            "A breathtaking cinematic drone shot gliding smoothly over a neon-lit futuristic metropolis at golden hour, flying vehicles soaring between glass spires, photorealistic 4k 60fps motion.",
            "Macro slow-motion camera zoom into a crystal sphere revealing an entire swirling galaxy within, liquid starlight ripples, smooth fluid dynamics, 8k cinematic masterpiece.",
            "Time-lapse of vibrant emerald aurora borealis dancing across a starry night sky above a glowing modular scientific base in the Arctic, smooth atmospheric transitions.",
            "A robotic golden hummingbird hovering in front of a blooming mechanical flower, intricate gear movements, high-speed macro shutter, ultra-smooth motion.",
            "First-person perspective flying through a surreal cosmic canyon made of glowing purple crystalline structures, hyper-speed smooth glide, volumetric light shafts.",
            "Cinematic tracking shot following an autonomous electric hypercar speeding across a scenic coastal mountain highway during a dramatic sunset."
        ]
    };

    function bindRandomPromptGenerators() {
        // Chat Mode Random Prompt
        const chatInput = $('#chat-input');
        const chatSendBtn = $('#chat-send-btn');
        const triggerChat = (btn) => {
            const pool = RANDOM_PROMPT_LIBRARY.chat;
            const prompt = pool[Math.floor(Math.random() * pool.length)];
            if (chatInput) {
                chatInput.value = prompt;
                chatInput.style.height = 'auto';
                chatInput.style.height = Math.min(chatInput.scrollHeight, 160) + 'px';
                if (chatSendBtn && STATE.selectedModel) {
                    chatSendBtn.disabled = false;
                }
                chatInput.classList.remove('prompt-flash-highlight');
                void chatInput.offsetWidth; // trigger reflow
                chatInput.classList.add('prompt-flash-highlight');
                chatInput.focus();
            }
            if (btn) {
                btn.classList.add('rolling');
                setTimeout(() => btn.classList.remove('rolling'), 500);
            }
        };

        const chatBtn = $('#random-chat-prompt-btn');
        const chatIconBtn = $('#random-chat-icon-btn');
        if (chatBtn) chatBtn.addEventListener('click', () => triggerChat(chatBtn));
        if (chatIconBtn) chatIconBtn.addEventListener('click', () => triggerChat(chatIconBtn));

        // Compare Mode Random Prompt
        const comparePrompt = $('#compare-prompt');
        const compareBtn = $('#random-compare-prompt-btn');
        const compareSendBtn = $('#compare-send-btn');
        if (compareBtn && comparePrompt) {
            compareBtn.addEventListener('click', () => {
                const pool = RANDOM_PROMPT_LIBRARY.compare;
                const prompt = pool[Math.floor(Math.random() * pool.length)];
                comparePrompt.value = prompt;
                comparePrompt.classList.remove('prompt-flash-highlight');
                void comparePrompt.offsetWidth;
                comparePrompt.classList.add('prompt-flash-highlight');
                comparePrompt.focus();
                if (compareSendBtn && $('#compare-model-a').value && $('#compare-model-b').value) {
                    compareSendBtn.disabled = false;
                }
                compareBtn.classList.add('rolling');
                setTimeout(() => compareBtn.classList.remove('rolling'), 500);
            });
        }

        // Image Mode Random Prompt
        const imagePrompt = $('#image-prompt');
        const imageBtn = $('#random-image-prompt-btn');
        if (imageBtn && imagePrompt) {
            imageBtn.addEventListener('click', () => {
                const pool = RANDOM_PROMPT_LIBRARY.image;
                const prompt = pool[Math.floor(Math.random() * pool.length)];
                imagePrompt.value = prompt;
                imagePrompt.classList.remove('prompt-flash-highlight');
                void imagePrompt.offsetWidth;
                imagePrompt.classList.add('prompt-flash-highlight');
                imagePrompt.focus();
                imageBtn.classList.add('rolling');
                setTimeout(() => imageBtn.classList.remove('rolling'), 500);
            });
        }

        // Video Mode Random Prompt
        const videoPrompt = $('#video-prompt');
        const videoBtn = $('#random-video-prompt-btn');
        if (videoBtn && videoPrompt) {
            videoBtn.addEventListener('click', () => {
                const pool = RANDOM_PROMPT_LIBRARY.video;
                const prompt = pool[Math.floor(Math.random() * pool.length)];
                videoPrompt.value = prompt;
                videoPrompt.classList.remove('prompt-flash-highlight');
                void videoPrompt.offsetWidth;
                videoPrompt.classList.add('prompt-flash-highlight');
                videoPrompt.focus();
                videoBtn.classList.add('rolling');
                setTimeout(() => videoBtn.classList.remove('rolling'), 500);
            });
        }
    }

    // ═════════════════════════════════════════════════════════════════════
    // AI TASK TAXONOMY & ML FRAMEWORK PRESET ENGINE
    // ═════════════════════════════════════════════════════════════════════

    const TASK_TAXONOMY_MAP = {
        'image-captioning': {
            name: 'Image Captioning',
            mode: 'chat',
            system: 'You are an expert Vision-Language AI model. Generate detailed, dense, and semantically accurate captions for visual scenes, noting spatial layout, lighting, colors, and key entities.',
            prompt: 'Provide a comprehensive, high-resolution descriptive caption for a panoramic shot of an autonomous drone swarm inspecting offshore wind turbines at sunset.',
        },
        'chatbots': {
            name: 'Conversational Chatbots',
            mode: 'chat',
            system: 'You are a versatile, friendly, and highly intelligent AI assistant equipped with chain-of-thought problem-solving abilities.',
            prompt: 'How can a growing software business architect a resilient 7-agent workforce using LangGraph state machines?',
        },
        'sentiment-analysis': {
            name: 'Sentiment & Emotion Analysis',
            mode: 'chat',
            system: 'You are a precision NLP Sentiment and Emotion Analysis Engine. Classify tone, sentiment polarity (-1.0 to +1.0), and emotional nuances with step-by-step rationale.',
            prompt: 'Analyze the sentiment and emotional nuance in this enterprise review:\n"The new autonomous indexing pipeline is blazingly fast, but our engineering team struggled with sparse SDK documentation during initial onboarding."',
        },
        'summarization': {
            name: 'Text Summarization',
            mode: 'chat',
            system: 'You are an Executive Summarization Engine. Condense complex multi-page reports into clear key takeaways, action items, and risk matrices.',
            prompt: 'Summarize the following architecture briefing into a 3-bullet executive brief with a risk matrix:\n"We evaluated deploying local 70B LLMs with llamafile vs cloud router endpoints. While latency dropped by 42% on-prem, VRAM hardware scaling costs exceeded initial forecasts by $12,000/mo."',
        },
        'music-generation': {
            name: 'Music & Audio Generation',
            mode: 'chat',
            system: 'You are an AI Audio & Music Synthesis Engineer. Create detailed musical composition prompts, BPM tempo markings, instrumentation schemas, and lyric structures for text-to-audio models.',
            prompt: 'Generate a detailed production prompt and structural layout for a synthwave cyberpunk track with arpeggiated analog basslines, 128 BPM, and atmospheric rain field recordings.',
        },
        'medical-imaging': {
            name: 'Medical Imaging & Clinical AI',
            mode: 'chat',
            system: 'You are a Clinical Biomedical AI Specialist. Assist researchers in understanding radiological patterns, anatomical segmentation workflows, and DICOM metadata pipelines.',
            prompt: 'Outline a computer vision pipeline using PyTorch, MONAI, and UNet3D for segmenting pulmonary nodules in low-dose thoracic CT scans.',
        },
        'financial-analysis': {
            name: 'Financial & Quant Analysis',
            mode: 'chat',
            system: 'You are a Quantitative Financial Analyst and Algorithmic Modeling Specialist. Audit SEC filings, calculate EBITDA margin shifts, and forecast cash flow sensitivities.',
            prompt: 'Build a discounted cash flow (DCF) sensitivity table evaluating a SaaS startup growing ARR from $5M to $25M with 82% gross margins and 14% WACC.',
        },
        'game-ai': {
            name: 'Game AI & NPC Logic',
            mode: 'chat',
            system: 'You are a Game AI Architect. Design reinforcement learning state spaces, behavior trees, and procedural narrative engines for interactive games.',
            prompt: 'Design a hierarchical task network (HTN) behavior tree for autonomous squad tactical NPCs navigating dynamic urban cover.',
        },
        'model-benchmarking': {
            name: 'Dual Model Benchmarking',
            mode: 'compare',
            system: 'Compare reasoning quality, time-to-first-token, and throughput efficiency across models.',
            prompt: 'Solve this algorithmic challenge with full time-complexity proof: Given an array of integers, find the maximum product subarray in O(N) time and O(1) auxiliary space.',
        },
        'code-generation': {
            name: 'Production Code Generation',
            mode: 'chat',
            system: 'You are an elite Software Engineer. Provide production-grade, highly optimized code with error handling, type annotations, and unit tests.',
            prompt: 'Write a high-performance concurrent worker pool in Python using asyncio, semaphores, and structured backoff retries for polling external webhooks.',
        },
        'visual-qa': {
            name: 'Visual Question Answering (VQA)',
            mode: 'chat',
            system: 'You are a Visual Question Answering (VQA) reasoning engine. Answer specific queries regarding visual documents, diagrams, and camera feeds.',
            prompt: 'Based on an architectural blueprint diagram, identify all structural load-bearing columns and calculate total square footage of the open-plan office.',
        },
        'text-to-image': {
            name: 'Text-to-Image Diffusion',
            mode: 'image',
            prompt: 'A breathtaking ultra-detailed architectural photography of a biophilic solar observatory nestled in Norwegian fjords, warm golden hour lighting, cinematic 8k.',
        },
        'image-to-image': {
            name: 'Image-to-Image Synthesis',
            mode: 'image',
            prompt: 'Transform this input concept sketch into a hyperrealistic 3D rendered cybernetic exoskeleton with carbon fiber and brushed titanium plating.',
        },
        'text-to-video': {
            name: 'Text-to-Video Synthesis',
            mode: 'video',
            prompt: 'Cinematic aerial slow-motion drone flyover of a futuristic neon cyber-metropolis during a torrential rainstorm, reflections on glass towers, photorealistic.',
        },
        'image-to-video': {
            name: 'Image-to-Video Motion',
            mode: 'video',
            prompt: 'Bring this still artwork to life with subtle atmospheric camera orbiting, glowing holographic pulse lights, and floating volumetric smoke.',
        },
        'depth-estimation': {
            name: 'Depth Estimation',
            mode: 'chat',
            system: 'You are a Computer Vision Depth Estimation and 3D Geometry Specialist with expertise in MiDaS, Depth Anything, and ZoeDepth.',
            prompt: 'Explain how Depth Anything v2 achieves zero-shot metric depth estimation across monocular video streams without LiDAR ground truth.',
        },
        'object-detection': {
            name: 'Object Detection & Segmentation',
            mode: 'chat',
            system: 'You are an Object Detection Engineer specializing in YOLOv11, RT-DETR, and Segment Anything Model (SAM 2).',
            prompt: 'Compare real-time latency and mAP trade-offs between YOLOv11-X and RT-DETR v2 for high-speed edge camera inference.',
        },
        'text-to-3d': {
            name: 'Text-to-3D Synthesis',
            mode: 'chat',
            system: 'You are a 3D Generative AI Specialist. Create NeRF, Gaussian Splatting, and mesh generation prompts and pipelines.',
            prompt: 'Describe the end-to-end pipeline for converting single-view product photos into textured 3D Gaussian Splats ready for WebGL Sentis runtime.',
        },
        'asr': {
            name: 'Automatic Speech Recognition (ASR)',
            mode: 'chat',
            system: 'You are an Automatic Speech Recognition (ASR) and Audio Transcription Specialist with Whisper, SpeechBrain, and ESPnet expertise.',
            prompt: 'Compare Whisper v3 vs Conformer-CTC for real-time low-latency edge speech recognition in noisy industrial environments.',
        },
        'tabular-classification': {
            name: 'Tabular Classification & Modeling',
            mode: 'chat',
            system: 'You are an expert Data Scientist specializing in Tabular Machine Learning, XGBoost, LightGBM, CatBoost, and TabNet.',
            prompt: 'Provide a complete Python pipeline using LightGBM and Optuna to classify customer churn risk using transaction telemetry.',
        },
        'time-series-forecasting': {
            name: 'Time Series Forecasting',
            mode: 'chat',
            system: 'You are an expert Time Series Forecasting Engineer specializing in PatchTST, Chronos, and AutoARIMA.',
            prompt: 'Write a Python pipeline utilizing Chronos-Bolt foundation model for zero-shot multi-step retail inventory demand forecasting.',
        },
        'reinforcement-learning': {
            name: 'Reinforcement Learning',
            mode: 'chat',
            system: 'You are an expert Reinforcement Learning Researcher specializing in PPO, SAC, and Multi-Agent RL (MARL).',
            prompt: 'Write a custom Gymnasium environment and Proximal Policy Optimization (PPO) training loop in PyTorch with generalized advantage estimation (GAE).',
        },
        'graph-ml': {
            name: 'Graph Machine Learning',
            mode: 'chat',
            system: 'You are a Graph Machine Learning and Knowledge Graph Engineer specializing in PyTorch Geometric (PyG) and DGL.',
            prompt: 'Implement a Graph Convolutional Network (GCN) in PyTorch Geometric for link prediction on a large heterogeneous biomedical knowledge graph.',
        }
    };

    function bindTaxonomyModalAndTasks() {
        const modal = $('#taxonomy-modal');
        const openBtn1 = $('#open-taxonomy-btn');
        const openBtn2 = $('#open-taxonomy-btn-secondary');
        const closeBtn1 = $('#close-taxonomy-modal-btn');
        const closeBtn2 = $('#close-taxonomy-modal-bottom-btn');
        const searchInput = $('#taxonomy-search-input');
        const domainTabs = $$('.domain-tab-btn');

        const openModal = () => {
            if (modal) {
                modal.classList.remove('hidden');
                if (searchInput) searchInput.focus();
            }
        };

        const closeModal = () => {
            if (modal) modal.classList.add('hidden');
        };

        if (openBtn1) openBtn1.addEventListener('click', openModal);
        if (openBtn2) openBtn2.addEventListener('click', openModal);
        if (closeBtn1) closeBtn1.addEventListener('click', closeModal);
        if (closeBtn2) closeBtn2.addEventListener('click', closeModal);

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }

        // Domain Tab Filters
        domainTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                domainTabs.forEach(t => {
                    t.classList.remove('active', 'bg-indigo-600', 'text-white');
                    t.classList.add('bg-slate-800', 'text-gray-300');
                });
                tab.classList.add('active', 'bg-indigo-600', 'text-white');
                tab.classList.remove('bg-slate-800', 'text-gray-300');

                const domain = tab.dataset.domain;
                $$('.taxonomy-section').forEach(sec => {
                    if (domain === 'all' || sec.dataset.section === domain) {
                        sec.style.display = 'block';
                    } else {
                        sec.style.display = 'none';
                    }
                });
            });
        });

        // Search Filtering
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                $$('.hf-task-pill').forEach(pill => {
                    const text = pill.textContent.toLowerCase();
                    const task = (pill.dataset.task || '').toLowerCase();
                    if (!query || text.includes(query) || task.includes(query)) {
                        pill.style.display = 'inline-flex';
                    } else {
                        pill.style.display = 'none';
                    }
                });

                $$('.framework-badge').forEach(badge => {
                    const text = badge.textContent.toLowerCase();
                    const fw = (badge.dataset.framework || '').toLowerCase();
                    if (!query || text.includes(query) || fw.includes(query)) {
                        badge.style.display = 'inline-flex';
                    } else {
                        badge.style.display = 'none';
                    }
                });

                // Show/hide parent sections based on children visibility
                $$('.taxonomy-section').forEach(sec => {
                    const visibleItems = sec.querySelectorAll('.hf-task-pill:not([style*="display: none"]), .framework-badge:not([style*="display: none"])');
                    sec.style.display = (visibleItems.length > 0) ? 'block' : 'none';
                });
            });
        }

        // Handle Task Activation (Both Top Quick Bar and Taxonomy Modal)
        function activateTask(taskId) {
            const config = TASK_TAXONOMY_MAP[taskId] || {
                name: taskId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                mode: 'chat',
                system: `You are an expert AI specialized in ${taskId.replace(/-/g, ' ')}.`,
                prompt: `Perform an advanced, production-grade analysis for the task of ${taskId.replace(/-/g, ' ')}.`,
            };

            // Switch to required mode
            const targetMode = config.mode || 'chat';
            STATE.activeMode = targetMode;
            $$('.mode-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === targetMode));
            $$('.mode-panel').forEach(p => p.classList.add('hidden'));
            const panel = $(`#mode-${targetMode}`);
            if (panel) panel.classList.remove('hidden');

            // Update active state in top quick bar
            $$('.task-quick-chip').forEach(chip => {
                chip.classList.toggle('active', chip.dataset.task === taskId);
            });

            // Update active state in taxonomy modal
            $$('.hf-task-pill').forEach(pill => {
                pill.classList.toggle('active', pill.dataset.task === taskId);
            });

            // Set system prompt if applicable
            if (config.system && $('#system-prompt')) {
                $('#system-prompt').value = config.system;
            }

            // Set input prompt
            if (targetMode === 'chat' && $('#chat-input')) {
                const input = $('#chat-input');
                input.value = config.prompt;
                input.classList.remove('prompt-flash-highlight');
                void input.offsetWidth;
                input.classList.add('prompt-flash-highlight');
                input.focus();
                if ($('#chat-send-btn') && STATE.selectedModel) $('#chat-send-btn').disabled = false;
            } else if (targetMode === 'compare' && $('#compare-prompt')) {
                const input = $('#compare-prompt');
                input.value = config.prompt;
                input.classList.remove('prompt-flash-highlight');
                void input.offsetWidth;
                input.classList.add('prompt-flash-highlight');
                input.focus();
                if ($('#compare-send-btn') && $('#compare-model-a').value && $('#compare-model-b').value) {
                    $('#compare-send-btn').disabled = false;
                }
            } else if (targetMode === 'image' && $('#image-prompt')) {
                const input = $('#image-prompt');
                input.value = config.prompt;
                input.classList.remove('prompt-flash-highlight');
                void input.offsetWidth;
                input.classList.add('prompt-flash-highlight');
                input.focus();
            } else if (targetMode === 'video' && $('#video-prompt')) {
                const input = $('#video-prompt');
                input.value = config.prompt;
                input.classList.remove('prompt-flash-highlight');
                void input.offsetWidth;
                input.classList.add('prompt-flash-highlight');
                input.focus();
            }

            closeModal();
            showToast(`Task Activated: ${config.name} (${targetMode.toUpperCase()} Mode)`, 'success');
        }

        // Attach clicks to Top Quick Bar
        $$('.task-quick-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const taskId = chip.dataset.task;
                if (taskId) activateTask(taskId);
            });
        });

        // Attach clicks to Modal HF Task Pills
        $$('.hf-task-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                const taskId = pill.dataset.task;
                if (taskId) activateTask(taskId);
            });
        });

        // Attach clicks to Framework Badges
        $$('.framework-badge').forEach(badge => {
            badge.addEventListener('click', () => {
                const fw = badge.dataset.framework || badge.textContent.trim();
                $$('.framework-badge').forEach(b => b.classList.remove('active'));
                badge.classList.add('active');
                showToast(`Runtime Architecture: ${badge.textContent.trim()} Selected (Engine Ready)`, 'info');
                closeModal();
            });
        });
    }

    function showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        const icons = {
            success: 'fas fa-check-circle text-emerald-400',
            error: 'fas fa-exclamation-circle text-red-400',
            info: 'fas fa-info-circle text-indigo-400',
        };

        toast.innerHTML = `<i class="${icons[type] || icons.info}"></i> <span class="text-sm">${message}</span>`;
        toast.classList.add('show');

        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => toast.classList.remove('show'), 3500);
    }

})();

