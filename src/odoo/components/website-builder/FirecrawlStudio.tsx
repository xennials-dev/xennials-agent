import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Search, 
  Youtube, 
  Play, 
  Globe, 
  Tv, 
  Download, 
  Check, 
  ExternalLink, 
  ClipboardCheck, 
  PlusCircle, 
  TrendingUp, 
  Sparkles, 
  Cpu,
  Trash2
} from 'lucide-react';
import { cn } from '../../utils';
import { GoogleDoc } from './GoogleDocsHub';

interface FirecrawlStudioProps {
  onAddScrapedDoc: (newDoc: GoogleDoc) => void;
}

export default function FirecrawlStudio({ onAddScrapedDoc }: FirecrawlStudioProps) {
  const [targetUrl, setTargetUrl] = useState('https://www.youtube.com/@andrejkarpathy');
  const [scrapingProfile, setScrapingProfile] = useState<'transcripts' | 'prompt_hacking' | 'best_workflows'>('best_workflows');
  
  // Simulated State Machines
  const [crawlLogs, setCrawlLogs] = useState<Array<{ progress: number, step: string, consoleOut: string }>>([]);
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlStepIndex, setCrawlStepIndex] = useState(-1);
  const [recentScrapedArticles, setRecentScrapedArticles] = useState<Array<{ title: string, source: string, body: string, folder: string }>>([]);

  // Load / Save developer presets in local storage for persistence
  const [devPresets, setDevPresets] = useState<Array<{ name: string, url: string, handle: string }>>(() => {
    const saved = localStorage.getItem('firecrawl_dev_presets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { name: 'Andrej Karpathy (Vibe Coding)', url: 'https://www.youtube.com/@andrejkarpathy', handle: '@andrejkarpathy' },
      { name: 'Wes Roth (AI Automation Trends)', url: 'https://www.youtube.com/@wesroth', handle: '@wesroth' },
      { name: 'Matthew Berman (Workflow Tutorials)', url: 'https://www.youtube.com/@matthew_berman', handle: '@matthew_berman' },
      { name: 'Prompt Engineering (SaaS builds)', url: 'https://www.youtube.com/@PromptEngineering', handle: '@PromptEngineering' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('firecrawl_dev_presets', JSON.stringify(devPresets));
  }, [devPresets]);

  // Form states to add new custom preset
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetHandle, setNewPresetHandle] = useState('');
  const [newPresetUrl, setNewPresetUrl] = useState('');

  const handleSelectPreset = (url: string) => {
    setTargetUrl(url);
    setCrawlLogs([]);
    setIsCrawling(false);
  };

  const handleAddPreset = () => {
    if (!newPresetName.trim() || !newPresetUrl.trim()) {
      alert("Name and URL are required!");
      return;
    }
    // Clean handle representation
    let handle = newPresetHandle.trim();
    if (handle && !handle.startsWith('@')) {
      handle = '@' + handle;
    } else if (!handle) {
      handle = '@' + newPresetName.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    const exists = devPresets.some(p => p.handle.toLowerCase() === handle.toLowerCase() || p.url.toLowerCase() === newPresetUrl.toLowerCase());
    if (exists) {
      alert("A preset with this handle or URL already exists!");
      return;
    }

    setDevPresets(prev => [
      ...prev,
      { name: newPresetName.trim(), url: newPresetUrl.trim(), handle }
    ]);

    setNewPresetName('');
    setNewPresetHandle('');
    setNewPresetUrl('');
  };

  const handleDeletePreset = (handle: string) => {
    setDevPresets(prev => prev.filter(p => p.handle !== handle));
  };

  const triggerCrawl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl) return;

    setIsCrawling(true);
    setCrawlLogs([]);
    setCrawlStepIndex(0);
  };

  useEffect(() => {
    if (!isCrawling) return;

    const timer = setTimeout(() => {
      let entry = null;
      const step = crawlStepIndex;

      switch(step) {
        case 0:
          entry = {
            progress: 15,
            step: "FIRECRAWL RESOLVE",
            consoleOut: `[CONNECT] Initiating Firecrawl Cloud API handshake.\n[TARGET] URL: ${targetUrl}\n[AUTH] Verified Bearer Key: process.env.FIRECRAWL_API_KEY (Online)`
          };
          break;
        case 1:
          entry = {
            progress: 35,
            step: "BYPASS PROXY & CLOUDFLARE",
            consoleOut: `[NETWORK] Routing traffic through residential premium socks5 pools.\n[BYPASS] Cloudflare challenge detected! Executing dynamic stealth solver (Captcha solved in 630ms).\n[SSL] TLS fingerprints aligned.`
          };
          break;
        case 2:
          entry = {
            progress: 60,
            step: "JS TEMPLATE DYNAMICS RENDERING",
            consoleOut: `[HEADLESS] Rendering SPA scripts template. Loading shadow DOM elements.\n[EXTRACTOR] Grabbing video metadata, transcripts, and channel community posts.\n[TRANSCRIPTS] Extracted 4 recent detailed transcripts.`
          };
          break;
        case 3:
          entry = {
            progress: 85,
            step: "MARCH THROUGH LLM MARKDOWN COMPILER",
            consoleOut: `[PARSER] Scrubbing raw container wrappers. Compiling to pure structured Markdown.\n[AI SUMMARIZED] Passing text blocks to Gemini flash-extractor. Extracting top automation workflows, prompt parameters, and tech libraries.`
          };
          break;
        case 4:
          // Compile a mock document based on the URL selected
          let resultArticle: { title: string; source: string; folder: 'Strategy' | 'Blueprints' | 'Forms & Onboarding' | 'Best Tools'; body: string } = {
            title: "Andrej Karpathy: Intro to Large Language Models",
            source: targetUrl,
            folder: "Strategy",
            body: `## Andrej Karpathy - Intro to LLMs (Transcribed & Compiled by Firecrawl)\n\n### Summary of Core Engineering Principles:\n1. **Core Architecture**: LLMs are just two files: a parameters file (containing neural weights, e.g. .bin) and an executable file written in C or Python to run the forward pass.\n2. **Training Pipeline**: Split strictly into: \n   - **Pretraining**: Unsupervised reading of 10TB of raw internet text to learn semantic forecasting. Cost: High ($1M-$10M).\n   - **Supervised Fine-Tuning (SFT)**: Teaching the model to act as an assistant via clean dialogue files. Cost: Low (few hours/days).\n   - **RLHF**: Aligning the assistant output directly with human preferences using comparison maps.\n\n### Practical Prompts & Tooling Tips:\n- **Low-latency workflows**: Move heavy semantic categorization tasks to small local engines or flash models to keep execution loops under 200ms.\n- **Vibe Coding**: Let agents parse files sequentially. Do not feed all text in a single bulk prompt, or you'll trigger truncation limits.`
          };

          if (targetUrl.includes('wesroth')) {
            resultArticle = {
              title: "Wes Roth: In-Depth AI Automation Trends",
              source: targetUrl,
              folder: "Strategy",
              body: `## Wes Roth Strategy Briefing (Compiled by Firecrawl)\n\n### Outstanding Insights:\n1. **SaaS vs Multi-Agent AAA Agencies**: In 2025, Agencies are pivoting from simple API integration scripts toward complete virtual digital offices running on n8n, local Odoo, and agent-led databases.\n2. **Action Loops**: AI agents that operate via long-term vector state cache are achieving 98% task completion vs 65% for standard zero-shot prompt pipelines.\n3. **Docker Sandboxed Environments**: Run agent execution loops strictly inside Docker container overlays to prevent remote model hallucinations from corrupting active master directories.`
            };
          } else if (targetUrl.includes('matthew_berman')) {
            resultArticle = {
              title: "Matthew Berman: Building Multi-Agent Odoo Workflows",
              source: targetUrl,
              folder: "Blueprints",
              body: `## Matthew Berman Multi-Agent Blueprint (Compiled by Firecrawl)\n\n### Core Step-By-Step Workflow Guide:\n1. **Setup Drizzle schema mappings**: Ensure PostgreSQL columns are strictly defined within your TypeScript model before invoking Docker engine CLI hooks.\n2. **Handoff Logic**: Create clean transition parameters so your Chief Automation Bot can automatically hand off complicated database sync errors to physical human operator logs.\n3. **Firecrawl Scraping API**: Integrate markdown scraper ports to automatically feed fresh developer releases on GitHub into your RAG pipeline index daily.`
            };
          } else if (targetUrl.includes('PromptEngineering')) {
            resultArticle = {
              title: "Prompt Engineering: SaaS Orchestration Tips",
              source: targetUrl,
              folder: "Best Tools",
              body: `## Prompt Engineering: Advanced Prompt Structures (Compiled by Firecrawl)\n\n### Top Prompt Patterns:\n1. **In-Context Learning (ICL)**: Provide 3 exact input-output tuples inside XML blocks rather than explanation parameters. Models follow structural symmetry flawlessly.\n2. **Fallback Handlers**: Always append standard diagnostic JSON schemas in case validation linters block standard agentic replies.`
            };
          }

          setRecentScrapedArticles(prev => [resultArticle, ...prev]);
          
          // Callback to parent component to append document to resource hub!
          onAddScrapedDoc({
            id: `scraped_${Date.now()}`,
            title: resultArticle.title,
            folder: resultArticle.folder as any,
            emoji: '🔥',
            content: resultArticle.body,
            scraped: true
          });

          entry = {
            progress: 100,
            step: "SUCCESSFUL COMPILATION",
            consoleOut: `[COMPLETED] Scraped successfully! Compiled Markdown saved directly as virtual Google Doc inside Branded Resource Library.\n[LOG] Article title: "${resultArticle.title}"`
          };
          break;
        default:
          setIsCrawling(false);
          setCrawlStepIndex(-1);
          alert(`Firecrawl scraped and synced successfully!`);
          return;
      }

      if (entry) {
        setCrawlLogs(prev => [...prev, entry]);
        setCrawlStepIndex(prev => prev + 1);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [isCrawling, crawlStepIndex]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0E1218] overflow-hidden text-sm" id="firecrawl-studio-root">
      
      {/* Upper header */}
      <div className="p-4 bg-[#0E1217] border-b border-[#1C222A] flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center border border-orange-500/25">
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <h4 className="font-bold text-[#E6EBF5] uppercase tracking-wider text-xs">Firecrawl Web Scraper Console</h4>
            <p className="text-[10px] text-gray-400 font-mono">Simulated Scraper Engine for extracting developer transcripts & video advice</p>
          </div>
        </div>
        <span className="text-[9px] bg-orange-950/40 border border-orange-850/45 text-orange-400 font-bold px-2 py-0.5 rounded font-mono">
          API STATUS: ACTIVE
        </span>
      </div>

      {/* Main split dashboard */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left selector and input pane */}
        <div className="w-full md:w-96 border-r border-[#1C222A] p-4.5 space-y-4 overflow-y-auto shrink-0 select-none">
          
          {/* Quick presets list */}
          <div className="space-y-2">
            <label className="block text-[10px] font-mono font-bold text-[#8E95A3] uppercase tracking-wider">
              YouTube AI Developer Channels Presets
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {devPresets.map((preset) => (
                <div key={preset.handle} className="flex items-center gap-1.5 w-full">
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className={cn(
                      "flex-1 text-left p-2 px-2.5 rounded-lg border flex items-center gap-2.5 transition min-w-0",
                      targetUrl === preset.url 
                        ? "bg-orange-600/10 border-orange-500/30 text-white font-semibold" 
                        : "bg-[#141820]/45 text-gray-400 border-transparent hover:bg-[#1C222A]"
                    )}
                  >
                    <Youtube className="w-4 h-4 text-orange-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs uppercase font-mono tracking-tight leading-none text-white truncate">
                        {preset.name}
                      </span>
                      <span className="block text-[9.5px] font-mono text-gray-500 mt-1 leading-none truncate">{preset.handle}</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePreset(preset.handle)}
                    className="p-2.5 text-gray-500 hover:text-red-400 bg-[#141820]/45 hover:bg-[#1C222A] rounded-lg border border-transparent transition shrink-0"
                    title="Delete preset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick add custom preset */}
            <div className="p-3 bg-[#141820]/45 rounded-lg border border-white/5 space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Quick Add Preset</span>
                <PlusCircle className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder="Name (e.g. Lex Fridman)"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  className="w-full bg-black/60 text-[11px] text-white px-2 py-1.5 rounded border border-[#1F252D] focus:outline-none focus:border-orange-500 font-mono"
                />
                <input
                  type="text"
                  placeholder="Handle (e.g. @lexfridman)"
                  value={newPresetHandle}
                  onChange={(e) => setNewPresetHandle(e.target.value)}
                  className="w-full bg-black/60 text-[11px] text-white px-2 py-1.5 rounded border border-[#1F252D] focus:outline-none focus:border-orange-500 font-mono"
                />
                <input
                  type="url"
                  placeholder="YouTube URL"
                  value={newPresetUrl}
                  onChange={(e) => setNewPresetUrl(e.target.value)}
                  className="w-full bg-black/60 text-[11px] text-white px-2 py-1.5 rounded border border-[#1F252D] focus:outline-none focus:border-orange-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddPreset}
                  className="w-full py-1.5 bg-orange-600/20 hover:bg-orange-600/35 text-orange-400 font-mono font-bold text-[10.5px] uppercase rounded border border-orange-500/30 transition"
                >
                  Add Preset
                </button>
              </div>
            </div>

          </div>

          <form onSubmit={triggerCrawl} className="space-y-4 border-t border-[#1C222A] pt-4">
            {/* Target URL */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono uppercase font-bold text-gray-400">Custom Scraper Target URL</label>
              <input
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://www.youtube.com/channel/..."
                className="w-full bg-black/45 text-xs text-white p-2.5 rounded border border-[#1F252D] focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
              />
            </div>

            {/* Parsing strategy */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono uppercase font-bold text-gray-400">Extraction Strategy Target</label>
              <select
                value={scrapingProfile}
                onChange={(e) => setScrapingProfile(e.target.value as any)}
                className="w-full bg-black/45 text-xs text-white p-2 rounded border border-[#1F252D] focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
              >
                <option value="best_workflows">Extract multi-agent & local Odoo blueprints</option>
                <option value="prompt_hacking">Extract systematic prompt engineering tuples</option>
                <option value="transcripts">Translate pure transcripts into markdown text</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isCrawling}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-mono font-bold uppercase transition py-3 rounded-lg text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Initialize Firecrawl Run</span>
            </button>
          </form>

        </div>

        {/* Right logs console */}
        <div className="flex-1 bg-[#090C10] flex flex-col overflow-hidden p-5 space-y-4">
          
          <div className="bg-[#0E1217] p-4.5 rounded-lg border border-white/5 shadow-2xl flex-1 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center border-b border-white/5 pb-2.5 mb-3">
              <span className="text-[10px] font-mono text-gray-500 uppercase flex items-center gap-1.5 font-bold">
                <Globe className="w-3.5 h-3.5 text-orange-500" />
                <span>Crawling Diagnostics Pipeline Logs</span>
              </span>
              <span className="text-[10px] font-sans text-orange-400">Stealth Captcha Solver: ACTIVE</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[10.5px] pr-2 scrollbar-thin select-text">
              {crawlLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-2">
                  <Flame className="w-8 h-8 text-gray-850 animate-pulse" />
                  <p className="text-[10px] uppercase font-bold text-gray-500">Awaiting crawl ignition sequence...</p>
                </div>
              ) : (
                crawlLogs.map((log, idx) => (
                  <div key={idx} className="space-y-1.5 bg-black/40 p-3 rounded border border-white/5">
                    <div className="flex items-center justify-between text-[8px] font-bold tracking-wider">
                      <span className="text-orange-400">[{log.progress}%] {log.step}</span>
                      <span className="text-gray-500">NODE_CRAWLER_0{idx + 1}</span>
                    </div>
                    <p className="text-[#96A4B9] leading-relaxed whitespace-pre-wrap">{log.consoleOut}</p>
                  </div>
                ))
              )}

              {isCrawling && (
                <div className="flex items-center gap-2 text-orange-400 text-[10.5px] italic p-1 bg-black/20 border border-orange-500/10 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping"></span>
                  <span>Bypassing YouTube Cloudflare protection, compiling layout...</span>
                </div>
              )}
            </div>
          </div>

          {/* Scraped items showcase */}
          {recentScrapedArticles.length > 0 && (
            <div className="p-3 bg-[#0E1217] border border-orange-500/10 rounded-lg flex items-center gap-3 animate-fade-in shrink-0">
              <ClipboardCheck className="w-8 h-8 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] font-mono uppercase text-gray-500 font-bold tracking-wider">Recently Synced Resource</span>
                <span className="block font-sans text-xs text-white font-bold truncate">{recentScrapedArticles[0].title}</span>
              </div>
              <span className="text-[9px] bg-emerald-950/40 border border-emerald-800/35 text-emerald-400 font-bold px-1.5 py-0.5 rounded ml-auto uppercase font-mono whitespace-nowrap">
                Synced Perfect
              </span>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
