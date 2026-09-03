import { copyTextToClipboard } from '@/lib/clipboard';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, 
  Terminal, 
  Cpu, 
  ShieldAlert, 
  Compass, 
  Sliders, 
  Database, 
  Sparkles, 
  Layers, 
  Network, 
  Upload, 
  Trash2, 
  Check, 
  Play, 
  Globe, 
  Search, 
  FileCode, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  Mic, 
  Volume2, 
  ExternalLink,
  Smartphone,
  Monitor,
  Eye,
  RefreshCw,
  Zap
} from 'lucide-react';
import { cn } from '../utils';

// Types for our Custom Agency Cluster
interface CustomAgent {
  id: string;
  name: string;
  role: string;
  goal: string;
  backstory: string;
  avatarUrl: string; // standard human/robot photo or dataUrl
  isUploadedAvatar: boolean;
  activeTask?: string;
  status: 'idle' | 'thinking' | 'scraping' | 'aggregating' | 'speaking';
  intelligenceLevel: number; // 1-100
  toolUsed: 'Google Grounding' | 'Firecrawl engine' | 'Hermes Reasoning' | 'Puppeteer Engine' | 'None';
}

interface ScraperJob {
  id: string;
  url: string;
  format: 'markdown' | 'json' | 'html';
  timestamp: string;
  status: 'pending' | 'scraping' | 'completed' | 'failed';
  resultSize?: string;
  content: string;
}

export default function AiAgencyHqApp() {
  const [activeTab, setActiveTab] = useState<'cluster' | 'scrapers' | 'terminal' | 'ceo_mrr' | 'showcase'>('showcase');
  
  // Custom uploaded or default agents state
  const [agents, setAgents] = useState<CustomAgent[]>([
    {
      id: 'agent_hermes',
      name: 'Hermes Core',
      role: 'Senior Agency Orchestrator & Logic Coordinator',
      goal: 'Execute recursive reasoning paths, synthesize parsed text, and coordinate task handoffs.',
      backstory: 'Derived from high-reasoning open-weights and custom fine-tunes designed to act as a flawless system architect.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      isUploadedAvatar: false,
      activeTask: 'Synthesizing competitive pricing index...',
      status: 'thinking',
      intelligenceLevel: 98,
      toolUsed: 'Hermes Reasoning'
    },
    {
      id: 'agent_open_claw',
      name: 'Open Claw',
      role: 'Autonomous Web Negotiator & API Executor',
      goal: 'Navigate dynamic Javascript pages, invoke custom endpoints, and authenticate secure sandbox instances.',
      backstory: 'Equipped with headless browser control, custom proxies, and neural-gaze coordinate clicking grids.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      isUploadedAvatar: false,
      activeTask: 'Ready to dispatch browser clicks...',
      status: 'idle',
      intelligenceLevel: 94,
      toolUsed: 'Puppeteer Engine'
    },
    {
      id: 'agent_firecrawl',
      name: 'Firecrawl Scraper',
      role: 'Deep-Directory Markdown Converter & Crawler',
      goal: 'Scrape dense web configurations, strip unnecessary styling tags, and emit optimized layout records.',
      backstory: 'High-speed distributed crawler optimized for extracting perfect LLM-friendly documentation pages.',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      isUploadedAvatar: false,
      activeTask: 'Bypassing Cloudflare protection layers...',
      status: 'scraping',
      intelligenceLevel: 90,
      toolUsed: 'Firecrawl engine'
    }
  ]);

  // Selected Agent for Avatar Details & Interactive talking loop
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent_hermes');
  const activeAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  // Scrapers / Firecrawl history and playgrounds
  const [scrapedJobs, setScrapedJobs] = useState<ScraperJob[]>([
    {
      id: 'job_1',
      url: 'https://remotion.dev/docs',
      format: 'markdown',
      timestamp: '21:12:02',
      status: 'completed',
      resultSize: '48.2 KB',
      content: '# Remotion Documentation\n\nRemotion allows you to write programmatic videos in React. Use frames, compositions, and sequences with absolute coordinate layout values.\n\n## Core Concepts\n- **Composition**: Declares dimensions, duration in frames, and frame-rate (fps).\n- **Sequence**: Handles temporal shifts easily with start-times and layouts.\n- **Audio/Video assets**: Dynamically rendered on the timeline.'
    },
    {
      id: 'job_2',
      url: 'https://huggingface.co/models',
      format: 'json',
      timestamp: '21:14:15',
      status: 'completed',
      resultSize: '12.4 KB',
      content: '{\n  "source": "huggingface.co",\n  "scraped_models": [\n    { "id": "hermes-3-llama-3.1-70b", "category": "Text-Generation", "likes": 420 },\n    { "id": "open-claw-vision-alpha", "category": "Multimodal", "likes": 182 },\n    { "id": "firecrawl-markdown-v2", "category": "Parser", "likes": 95 }\n  ]\n}'
    }
  ]);
  
  // Scraper Input State
  const [scraperUrl, setScraperUrl] = useState<string>('https://news.ycombinator.com');
  const [scraperFormat, setScraperFormat] = useState<'markdown' | 'json' | 'html'>('markdown');
  const [isScrapingInProgress, setIsScrapingInProgress] = useState<boolean>(false);

  // Live Executive Terminal Logs
  const [terminalLogs, setTerminalLogs] = useState<Array<{ time: string; type: 'info' | 'warn' | 'success' | 'agent' | 'system'; text: string }>>([
    { time: '21:00:03', type: 'system', text: 'AI Automation Agency HQ initialised.' },
    { time: '21:00:15', type: 'info', text: 'Awaiting webhook tasks from Odoo Sales modules...' },
    { time: '21:02:40', type: 'agent', text: '[Hermes Core]: Starting orchestration for new lead context: Acme Enterprise Integration.' },
    { time: '21:02:42', type: 'agent', text: '[Hermes Core] Delegating scraping workflow to Firecrawl Scraper.' },
    { time: '21:02:45', type: 'info', text: '[Firecrawl] Dispatched parallel scraper on URL: https://acme-site.example.com' },
    { time: '21:02:49', type: 'success', text: '[Firecrawl] Scraping complete (7 records converted to pristine markdown layouts).' },
    { time: '21:02:51', type: 'agent', text: '[Open Claw] Firing simulated browser executor to update target databases on port 3000.' },
    { time: '21:02:55', type: 'success', text: '[Hermes Core] Acme Integration model synchronised successfully! MRR potential: $4,500.' }
  ]);

  // Terminal input
  const [terminalCommand, setTerminalCommand] = useState<string>('');

  // Agency CEO MRR & Client retainer state
  const [clients, setClients] = useState([
    { id: 1, name: 'Apex Logistics Corp', service: 'Custom Document Pipeline (Hermes + Firecrawl)', mrr: 2500, activeAgents: 2, joined: '2026-02-12', health: '98%' },
    { id: 2, name: 'Sovereign Capital LLC', service: 'Automated Portfolios Crawler (Open Claw)', mrr: 4200, activeAgents: 3, joined: '2026-03-01', health: '100%' },
    { id: 3, name: 'Manning & Sons Estate', service: 'Dynamic House Listing Scraper', mrr: 1800, activeAgents: 1, joined: '2026-05-18', health: '92%' }
  ]);

  // CEO Metrics
  const totalMRR = clients.reduce((sum, c) => sum + c.mrr, 0);
  const activeScrapersCount = scrapedJobs.length;

  // New Agent Form States
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('');
  const [newAgentGoal, setNewAgentGoal] = useState('');
  const [newAgentBackstory, setNewAgentBackstory] = useState('');
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);

  // Interactive Avatar speaking loop visual indicators
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState<boolean>(false);
  const [avatarSpeechText, setAvatarSpeechText] = useState<string>('');
  const [avatarPitch, setAvatarPitch] = useState<number>(50);
  const [avatarBlink, setAvatarBlink] = useState<boolean>(false);
  const [neuralGazeEnabled, setNeuralGazeEnabled] = useState<boolean>(true);

  // Set randomized eye blinking simulation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setAvatarBlink(true);
      setTimeout(() => setAvatarBlink(false), 150);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Handle avatar voice speech simulation
  const speakAvatarMessage = (message: string) => {
    setAvatarSpeechText(message);
    setIsAvatarSpeaking(true);
    
    // Simulate real logs
    const now = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [
      ...prev,
      { time: now, type: 'agent', text: `[${activeAgent.name} speaking]: "${message}"` }
    ]);

    // End speech after 3.5 seconds
    setTimeout(() => {
      setIsAvatarSpeaking(false);
    }, 3500);
  };

  // Handle URL File Upload for Agency Agent human faces
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>, agentId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setAgents(prev => prev.map(a => 
          a.id === agentId ? { ...a, avatarUrl: dataUrl, isUploadedAvatar: true } : a
        ));

        // simulated log
        const now = new Date().toLocaleTimeString();
        setTerminalLogs(prev => [
          ...prev,
          { time: now, type: 'success', text: `Uploaded highly-scalable dynamic humanoid grid mapping for agent: ${agents.find(ag => ag.id === agentId)?.name}` }
        ]);
        
        speakAvatarMessage(`Understood! Scanning uploaded dynamic avatar telemetry. Face matching calibrated!`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run Custom command in AI Terminal
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalCommand.trim()) return;

    const cmd = terminalCommand.trim();
    const now = new Date().toLocaleTimeString();
    
    setTerminalLogs(prev => [
      ...prev,
      { time: now, type: 'system', text: `> ${cmd}` }
    ]);

    // Simple reactive commands
    if (cmd.toLowerCase().includes('scrape')) {
      const parts = cmd.split(' ');
      const targetUrl = parts[1] || 'https://example.com';
      setTerminalLogs(prev => [
        ...prev,
        { time: now, type: 'info', text: `Triggering immediate Firecrawl scrape on ${targetUrl}...` }
      ]);
      triggerScraperRun(targetUrl, scraperFormat);
    } else if (cmd.toLowerCase().includes('status')) {
      setTerminalLogs(prev => [
        ...prev,
        { time: now, type: 'info', text: `Cluster state: healthy. Memory parameters within expected standard error margins. Hermes orchestration queue empty.` }
      ]);
    } else if (cmd.toLowerCase().includes('help')) {
      setTerminalLogs(prev => [
        ...prev,
        { time: now, type: 'info', text: `Available CLI operations: "status" - inspect cluster nodes | "scrape [url]" - crawl target URL using Firecrawl Engine | "speak [message]" - invoke live TTS agent verbalize | "clear" - clean viewport` }
      ]);
    } else if (cmd.toLowerCase().includes('speak')) {
      const speech = cmd.substring(6) || 'Testing agency sound matrix array.';
      speakAvatarMessage(speech);
    } else if (cmd.toLowerCase() === 'clear') {
      setTerminalLogs([]);
    } else {
      // Default generative agent response
      const randResponses = [
        `Understood. Initializing multi-agent reasoning chain. Directing tasks to appropriate specialists.`,
        `Command unrecognized, but Open Claw is probing your local workflow hooks to see if we can resolve this with Web scraping.`,
        `Synthesizing input commands across Hermes model nodes... Successful resolution.`,
        `Request dispatched. Running programmatic execution flow.`
      ];
      const randomResponse = randResponses[Math.floor(Math.random() * randResponses.length)];
      setTerminalLogs(prev => [
        ...prev,
        { time: now, type: 'agent', text: `[Hermes Core]: ${randomResponse}` }
      ]);
    }

    setTerminalCommand('');
  };

  // Run Firecrawl Scraper Simulation
  const triggerScraperRun = (urlToScrape: string, format: 'markdown' | 'json' | 'html') => {
    setIsScrapingInProgress(true);
    const now = new Date();
    const timestampStr = now.toLocaleTimeString();

    // Spawn progress logs
    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        { time: timestampStr, type: 'info', text: `[Firecrawl Scraper] Establishing connection node at: ${urlToScrape}` }
      ]);
    }, 400);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        { time: timestampStr, type: 'info', text: `[Firecrawl Scraper] Cloudflare WAF verification bypassed. Resolving React DOM hydration tree...` }
      ]);
    }, 1200);

    setTimeout(() => {
      const generatedMarkdown = `# Programmatic Capture of ${urlToScrape}\n\nAutomated extraction performed via Firecrawl Core at ${timestampStr}.\n\n- **Host Header**: ${urlToScrape.replace('https://', '')}\n- **Integrity**: Standard secure socket\n- **Text Density Index**: 82.5%\n\n### Scraped Executive Summary\nThis dynamic asset was scraped seamlessly. Content models mapped to structured database arrays inside the Agency Headquarters. All systems green.`;
      
      const generatedJson = `{\n  "url": "${urlToScrape}",\n  "scraped_at": "${timestampStr}",\n  "status": "active",\n  "extracted_parameters": {\n    "title": "Autonomous Workspace Feed",\n    "mrr_potential": 3500,\n    "verified_tls": true\n  }\n}`;

      const generatedHtml = `<!DOCTYPE html>\n<html>\n<head>\n  <title>Scraped ${urlToScrape}</title>\n</head>\n<body style="background: #02070f; color: #fff;">\n  <h1>Scrape Capture node</h1>\n  <p>Extracted raw content indices for LLM-ready workspace pipelines.</p>\n</body>\n</html>`;

      const finalContent = format === 'markdown' ? generatedMarkdown : (format === 'json' ? generatedJson : generatedHtml);

      const newJob: ScraperJob = {
        id: `job_${Date.now()}`,
        url: urlToScrape,
        format,
        timestamp: timestampStr,
        status: 'completed',
        resultSize: format === 'markdown' ? '2.8 KB' : (format === 'json' ? '1.5 KB' : '3.9 KB'),
        content: finalContent
      };

      setScrapedJobs(prev => [newJob, ...prev]);
      setIsScrapingInProgress(false);

      setTerminalLogs(prev => [
        ...prev,
        { time: timestampStr, type: 'success', text: `[Firecrawl Engine] Finished parse! Created LLM ready ${format.toUpperCase()} asset (${newJob.resultSize}).` }
      ]);

      // If the currently selected agent is speaking or thinking, have them voice the completion
      speakAvatarMessage(`Firecrawl finished extracting data from ${urlToScrape.replace('https://', '')}! Ready for processing inside the terminal.`);

    }, 2500);
  };

  // Add Custom Agent to Cluster Group
  const handleAddNewAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;

    const newAgent: CustomAgent = {
      id: `agent_${Date.now()}`,
      name: newAgentName,
      role: newAgentRole || 'General Assistant',
      goal: newAgentGoal || 'Help scale the workspace MRR workflows.',
      backstory: newAgentBackstory || 'Pre-trained autonomous task solver initialized inside the agency canvas.',
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
      isUploadedAvatar: false,
      status: 'idle',
      intelligenceLevel: Math.floor(Math.random() * 20) + 75,
      toolUsed: 'None'
    };

    setAgents(prev => [...prev, newAgent]);
    setSelectedAgentId(newAgent.id);
    setShowAddAgentModal(false);

    // Reset fields
    setNewAgentName('');
    setNewAgentRole('');
    setNewAgentGoal('');
    setNewAgentBackstory('');

    const now = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [
      ...prev,
      { time: now, type: 'success', text: `[Cluster Manager] Successfully deployed new agent model instance: ${newAgent.name} (${newAgent.role})` }
    ]);
  };

  // Add custom client to agency
  const handleAddClientSim = () => {
    const clientsNames = ['Globex Enterprise', 'Omni Corp AI branch', 'Vanguard Legal Automation', 'Nebula SaaS Integration'];
    const services = ['Recursive Firecrawl CRM logs extraction', 'Cognitive Email Campaign agent Cluster', 'Autonomous Web Data sync', 'Open Claw API Webhook router'];
    const chosenName = clientsNames[Math.floor(Math.random() * clientsNames.length)];
    const chosenService = services[Math.floor(Math.random() * services.length)];
    const randomMRR = Math.floor(Math.random() * 3) * 1000 + 2000;

    const newC = {
      id: Date.now(),
      name: chosenName,
      service: chosenService,
      mrr: randomMRR,
      activeAgents: Math.floor(Math.random() * 3) + 1,
      joined: new Date().toISOString().split('T')[0],
      health: '100%'
    };

    setClients(prev => [...prev, newC]);
    speakAvatarMessage(`Added brand partner contract with ${chosenName} bringing in $${randomMRR}/month in recurring client metrics!`);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0D10] text-[#E0E2E6] overflow-hidden" id="ai-agency-hq-workspace">
      
      {/* Header bar */}
      <div className="bg-[#14171D] border-b border-[#252A33] px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-[#a855f7] text-white p-2.5 rounded-xl shadow-md shadow-purple-950/20 border border-purple-400/20 shrink-0">
            <Network className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <span>AI Automation Agency Headquarters</span>
              <span className="text-[9px] bg-indigo-950 text-indigo-400 border border-indigo-900 px-2 py-0.5 rounded-full font-bold font-mono">CEO HUB</span>
            </h1>
            <p className="text-[10px] text-[#8E95A3] font-mono mt-0.5">Scale operations, fine-tune Hermes cluster agents, trigger web scapers, and capture client MRR retainers</p>
          </div>
        </div>

        {/* Global Retainers Counter in Header */}
        <div className="hidden lg:flex items-center gap-4 border-l border-[#252A33] pl-4 font-mono">
          <div className="text-right">
            <span className="block text-[8px] uppercase font-bold text-gray-500">Agency Monthly Revenue</span>
            <span className="text-emerald-400 font-bold font-mono text-sm">${totalMRR.toLocaleString()}/mo</span>
          </div>
          <div className="text-right">
            <span className="block text-[8px] uppercase font-bold text-gray-500">Active Agents Cluster</span>
            <span className="text-[#a855f7] font-bold font-mono text-sm">{agents.length} nodes</span>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="bg-[#0e1116] border-b border-[#252A33] px-5 py-2 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center space-x-1.5 shrink-0">
          <button 
            onClick={() => setActiveTab('cluster')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition uppercase tracking-wider flex items-center gap-1.5 border border-transparent",
              activeTab === 'cluster' 
                ? "bg-[#a855f7]/10 text-[#c084fc] border-[#a855f7]/25 font-bold shadow-sm" 
                : "text-[#8E95A3] hover:text-white hover:bg-white/5"
            )}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Agent CrewAI Cluster & Avatar</span>
          </button>

          <button 
            onClick={() => setActiveTab('scrapers')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition uppercase tracking-wider flex items-center gap-1.5 border border-transparent",
              activeTab === 'scrapers' 
                ? "bg-indigo-650/15 text-indigo-400 border-indigo-500/25 font-bold shadow-sm" 
                : "text-[#8E95A3] hover:text-white hover:bg-white/5"
            )}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Firecrawl Scraper UI</span>
          </button>

          <button 
            onClick={() => setActiveTab('terminal')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition uppercase tracking-wider flex items-center gap-1.5 border border-transparent",
              activeTab === 'terminal' 
                ? "bg-emerald-600/10 text-emerald-400 border-emerald-500/20 font-bold shadow-sm" 
                : "text-[#8E95A3] hover:text-white hover:bg-white/5"
            )}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>HQ Command Terminal</span>
          </button>

          <button 
            onClick={() => setActiveTab('ceo_mrr')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition uppercase tracking-wider flex items-center gap-1.5 border border-transparent",
              activeTab === 'ceo_mrr' 
                ? "bg-amber-600/10 text-amber-400 border-amber-500/20 font-bold shadow-sm" 
                : "text-[#8E95A3] hover:text-white hover:bg-white/5"
            )}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Client Retainers ({clients.length})</span>
          </button>

          <button 
            onClick={() => setActiveTab('showcase')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition uppercase tracking-wider flex items-center gap-1.5 border border-transparent",
              activeTab === 'showcase' 
                ? "bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border-amber-500/30 font-bold shadow-sm" 
                : "text-[#8E95A3] hover:text-white hover:bg-white/5"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>🚀 Example Projects & Showcases</span>
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest hidden md:inline">Hermes & OpenClaw cluster syncing live</span>
        </div>
      </div>

      {/* Main workspace panels */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">

        {/* Tab 1: Agent CrewAI Cluster & Avatar */}
        {activeTab === 'cluster' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 max-w-7xl mx-auto h-full">
            
            {/* Left: Agents List Selector (5 Columns) */}
            <div className="xl:col-span-4 flex flex-col gap-4">
              <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#252A33] pb-3 mb-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2 font-mono">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span>Cluster CrewAI Nodes</span>
                    </h3>
                    <button 
                      onClick={() => setShowAddAgentModal(true)}
                      className="text-[10px] bg-purple-600 hover:bg-purple-700 text-white font-bold px-2 py-1 rounded transition flex items-center gap-1 font-mono uppercase"
                    >
                      <span>+ Deploy Agent</span>
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                    Select a core agent block below to adjust background backstory parameters, deploy live telemetry, or trigger real-time simulated speak outputs.
                  </p>

                  <div className="space-y-2.5">
                    {agents.map((ag) => {
                      const isSelected = ag.id === selectedAgentId;
                      return (
                        <div 
                          key={ag.id}
                          onClick={() => setSelectedAgentId(ag.id)}
                          className={cn(
                            "p-3 rounded-lg border text-left cursor-pointer transition-all duration-150 relative group",
                            isSelected 
                              ? "bg-purple-950/20 border-purple-500/55 shadow-md shadow-purple-950/10" 
                              : "bg-[#181C24]/85 border-[#252A33] hover:border-gray-700 hover:bg-[#1E2430]"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img 
                                src={ag.avatarUrl} 
                                alt={ag.name} 
                                className="w-10 h-10 object-cover rounded-lg border border-white/5" 
                              />
                              <div className={cn(
                                "absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border border-[#14171D]",
                                ag.status === 'thinking' ? "bg-purple-400 animate-pulse" : (ag.status === 'scraping' ? "bg-amber-400 animate-pulse" : "bg-emerald-500")
                              )}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-xs text-white truncate">{ag.name}</h4>
                                <span className={cn(
                                  "text-[8px] px-1.5 py-0.5 rounded font-bold font-mono tracking-wide uppercase",
                                  ag.status === 'thinking' ? "bg-purple-900/40 text-purple-300" : (ag.status === 'scraping' ? "bg-amber-900/40 text-amber-300" : "bg-emerald-950 text-emerald-400")
                                )}>
                                  {ag.status}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-400 truncate mt-0.5">{ag.role}</p>
                            </div>
                          </div>

                          {/* Action prompt in list */}
                          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-gray-500">
                            <span className="font-mono">Intel Score: <strong className="text-purple-400 font-bold">{ag.intelligenceLevel}/100</strong></span>
                            <span className="font-mono text-gray-400">{ag.toolUsed}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Agent cluster guide badge */}
                <div className="mt-4 pt-3 border-t border-[#252A33] bg-[#0A0C0F] p-2.5 rounded-lg border border-white/5">
                  <div className="flex gap-2 text-[10px] leading-relaxed text-gray-400">
                    <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Hermes routes internal loops to Open Claw for dynamic form submissions on your Odoo local databases.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: AI Lifelike Moving Avatar Rig & Details (8 Columns) */}
            <div className="xl:col-span-8 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Visual Avatar Telemetry Feed (5 Columns in box) */}
                <div className="md:col-span-5 bg-[#14171D] border border-[#252A33] rounded-xl p-4 flex flex-col items-center justify-between relative overflow-hidden">
                  
                  {/* Subtle Background Neural Coordinate Matrix */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none font-mono text-[8px] text-[#a855f7] leading-none select-none p-2 overflow-hidden">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <p key={i} className="mb-1 truncate">0x{i+15} FFFFFF 00101101 {i*3721} 19.42 PX COORDINATE ALIGNED GRID_NODE_ACTIVE</p>
                    ))}
                  </div>

                  {/* Top Feed indicators */}
                  <div className="w-full flex justify-between items-center z-10">
                    <span className="text-[8px] bg-red-650 text-white font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
                      <span>AVATAR RIG ACTIVE</span>
                    </span>
                    <span className="text-[10px] text-[#c084fc] font-mono font-bold">29.9 FPS</span>
                  </div>

                  {/* Main Avatar Moving & Speech Visualization canvas Area */}
                  <div className="my-5 relative w-44 h-44 rounded-full flex items-center justify-center border-2 border-purple-500/20 group">
                    
                    {/* Ring Pulse Animations depending on speaking loop */}
                    {isAvatarSpeaking ? (
                      <>
                        <div className="absolute inset-0 w-full h-full rounded-full border-4 border-[#a855f7]/30 animate-ping"></div>
                        <div className="absolute -inset-2 rounded-full border border-purple-400/40 animate-pulse"></div>
                      </>
                    ) : (
                      <div className="absolute -inset-1.5 rounded-full border border-white/5 animate-pulse duration-1000"></div>
                    )}

                    {/* Highly Lifelike Vector Cyber Matrix Overlays */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
                      {/* Reticle brackets */}
                      <path d="M 15 30 L 15 15 L 30 15" fill="none" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.4" />
                      <path d="M 85 30 L 85 15 L 70 15" fill="none" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.4" />
                      <path d="M 15 70 L 15 85 L 30 85" fill="none" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.4" />
                      <path d="M 85 70 L 85 85 L 70 85" fill="none" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.4" />

                      {/* Diagnostic face mapping grids */}
                      {neuralGazeEnabled && (
                        <>
                          <line x1="15" y1="50" x2="85" y2="50" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="3 3" strokeOpacity="0.3" />
                          <line x1="50" y1="15" x2="50" y2="85" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="3 3" strokeOpacity="0.3" />
                          
                          {/* Face key nodes */}
                          <circle cx="38" cy="46" r="1.5" fill="#38bdf8" fillOpacity="0.6" className={cn(avatarBlink && "opacity-20")} />
                          <circle cx="62" cy="46" r="1.5" fill="#38bdf8" fillOpacity="0.6" className={cn(avatarBlink && "opacity-20")} />
                          <circle cx="50" cy="56" r="1" fill="#38bdf8" fillOpacity="0.6" />
                          
                          {/* Mouth coordinates talking pulse */}
                          {isAvatarSpeaking ? (
                            <path d="M 42 66 Q 50 72 58 66" fill="none" stroke="#f43f5e" strokeWidth="2.5" className="animate-bounce" />
                          ) : (
                            <line x1="44" y1="65" x2="56" y2="65" stroke="#38bdf8" strokeWidth="1.5" />
                          )}
                        </>
                      )}
                    </svg>

                    {/* Standard Avatar or User Uploaded Head Image */}
                    <div className="absolute inset-2 rounded-full overflow-hidden border border-white/10 bg-black">
                      <img 
                        src={activeAgent.avatarUrl} 
                        alt={activeAgent.name} 
                        className={cn(
                          "w-full h-full object-cover transition-transform duration-500",
                          // Breathing simulation using absolute scaling
                          isAvatarSpeaking ? "scale-105 duration-150 animate-bounce" : "scale-100 animate-pulse"
                        )}
                        style={{ animationDuration: '3s' }}
                      />
                    </div>

                    {/* Diagnostic Blink overlay */}
                    {avatarBlink && (
                      <div className="absolute inset-2 rounded-full bg-black/85 flex items-center justify-center z-10 transition">
                        <span className="text-[9px] text-[#a855f7] font-mono uppercase font-bold tracking-widest">BLINK STATE</span>
                      </div>
                    )}
                  </div>

                  {/* Vocalizer speech text feedback bubble */}
                  <div className="w-full bg-[#0A0C0F] border border-[#252A33] rounded-lg p-2.5 z-10 min-h-[48px] flex flex-col justify-between">
                    <span className="block text-[8px] text-gray-500 font-mono uppercase font-bold tracking-widest">Verbalizing Output Stream:</span>
                    <p className="text-[11px] font-mono italic text-purple-300 leading-normal mt-0.5">
                      {isAvatarSpeaking ? avatarSpeechText : `"${activeAgent.name} node ready. Ask me to formulate responses."`}
                    </p>
                  </div>

                  {/* Real Life Human avatar custom upload trigger */}
                  <div className="w-full mt-3 pt-3 border-t border-[#252A33] flex flex-col items-stretch gap-1.5 z-10">
                    <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 font-bold">
                      <span>Face Upload:</span>
                      <span className="text-[#a855f7]">{activeAgent.isUploadedAvatar ? 'Custom Base64 Model Active' : 'Default Preset Active'}</span>
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="file" 
                        accept="image/*" 
                        id={`avatar-upload-${activeAgent.id}`}
                        className="hidden" 
                        onChange={(e) => handleAvatarFileUpload(e, activeAgent.id)}
                      />
                      <button
                        onClick={() => document.getElementById(`avatar-upload-${activeAgent.id}`)?.click()}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#1C2129] hover:bg-purple-950/20 text-xs font-bold font-mono px-3 py-2 rounded-lg transition border border-white/5 text-gray-300 hover:text-purple-400 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Moving Rig Face</span>
                      </button>
                    </div>
                    <p className="text-[8px] text-gray-500 text-center font-mono mt-0.5">Loads any transparent PNG, JPG, or personal photo dynamically into the interactive mouth coordinates simulator.</p>
                  </div>
                </div>

                {/* Agent Properties and Tuning (7 Columns in box) */}
                <div className="md:col-span-7 bg-[#14171D] border border-[#252A33] rounded-xl p-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#252A33] pb-2.5">
                      <div>
                        <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-purple-400" />
                          <span>{activeAgent.name} Parameters</span>
                        </h3>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">Scale agency output on target servers</p>
                      </div>
                      
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded font-mono text-[9px] text-[#c084fc] font-bold">
                        <span>Cluster: active</span>
                      </div>
                    </div>

                    {/* Description & Backstory config */}
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 font-mono mb-1">Agent Primary Role</label>
                        <div className="bg-[#0A0C0F] border border-white/5 p-2.5 rounded-lg text-xs font-bold leading-normal text-white">
                          {activeAgent.role}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 font-mono mb-1">Current Focus Goal</label>
                        <div className="bg-[#0A0C0F] border border-white/5 p-2.5 rounded-lg text-xs leading-normal text-gray-300">
                          {activeAgent.goal}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 font-mono mb-1">System Prompt & Backstory</label>
                        <div className="bg-[#0A0C0F] border border-white/5 p-2.5 rounded-lg text-xs text-gray-400 italic max-h-24 overflow-y-auto leading-relaxed">
                          {activeAgent.backstory}
                        </div>
                      </div>
                    </div>

                    {/* Parameters sliders */}
                    <div className="pt-3 border-t border-[#252A33] grid grid-cols-2 gap-3.5 text-xs font-mono">
                      <div>
                        <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1">
                          <span>Intelligence Rig</span>
                          <span className="text-purple-400 font-bold">{activeAgent.intelligenceLevel}%</span>
                        </div>
                        <div className="w-full bg-[#0A0C0F] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full" style={{ width: `${activeAgent.intelligenceLevel}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1">
                          <span>Vocal Pitch Offset</span>
                          <span className="text-[#38bdf8] font-bold">{avatarPitch} Hz</span>
                        </div>
                        <input 
                          type="range" 
                          min="10" 
                          max="100" 
                          value={avatarPitch}
                          onChange={(e) => setAvatarPitch(Number(e.target.value))}
                          className="w-full h-1 bg-[#0A0C0F] rounded-lg appearance-none cursor-pointer accent-[#38bdf8]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Speak button simulation trigger footer */}
                  <div className="mt-4 pt-3.5 border-t border-[#252A33] flex flex-col sm:flex-row gap-2">
                    <button 
                      onClick={() => speakAvatarMessage(`Greeting workspace CEO! Hermes core reasoning matrix is successfully checking target databases for automation optimization loops.`)}
                      className="flex-1 bg-purple-650 hover:bg-purple-700 text-white font-bold font-mono text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Mic className="w-4 h-4 text-white" />
                      <span>Simulate Vocal Speak Run</span>
                    </button>

                    <button 
                      onClick={() => setNeuralGazeEnabled(!neuralGazeEnabled)}
                      className={cn(
                        "font-mono text-xs font-semibold px-4 py-2.5 rounded-lg border transition flex items-center justify-center gap-1.5 cursor-pointer",
                        neuralGazeEnabled 
                          ? "bg-sky-950/20 text-[#38bdf8] border-[#38bdf8]/35" 
                          : "bg-[#1C2129] text-gray-500 border-white/5"
                      )}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{neuralGazeEnabled ? "Disable Gaze Grid" : "Enable Gaze Grid"}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Cluster Task Coordinator Activity log */}
              <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-white font-mono mb-2">Live Orchestrated Task Feed</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-[#0A0C0F] p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="text-[9px] text-[#a855f7] font-mono uppercase font-bold">1. HERMES ORCHESTRATOR</span>
                    <p className="text-xs text-white leading-normal font-semibold">Coordinate Acme Pipeline</p>
                    <p className="text-[10px] text-gray-400 leading-normal">Formulating the scraper parameters query mapping.</p>
                  </div>
                  <div className="bg-[#0A0C0F] p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="text-[9px] text-indigo-400 font-mono uppercase font-bold">2. FIRECRAWL EXTRACTOR</span>
                    <p className="text-xs text-white leading-normal font-semibold">Extract Acme Catalog</p>
                    <p className="text-[10px] text-gray-400 leading-normal">Parsing 14 subpages with headless chromium.</p>
                  </div>
                  <div className="bg-[#0A0C0F] p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="text-[9px] text-emerald-400 font-mono uppercase font-bold">3. OPEN CLAW INTEGRATOR</span>
                    <p className="text-xs text-white leading-normal font-semibold">Database Schema Inject</p>
                    <p className="text-[10px] text-gray-400 leading-normal">Bulk importing structured records on database.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Firecrawl Website to Markdown Scraper UI */}
        {activeTab === 'scrapers' && (
          <div className="max-w-6xl mx-auto space-y-5">
            <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-5">
              <div className="flex items-center gap-3 border-b border-[#252A33] pb-4 mb-4">
                <div className="p-2 bg-indigo-600/10 rounded-lg border border-indigo-500/20">
                  <Globe className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">Firecrawl Scraping and Crawl Engine</h3>
                  <p className="text-xs text-gray-400">Directly convert any website directory into clean Markdown structured data for LLM context injection</p>
                </div>
              </div>

              {/* Scrape Input Toolbar */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                <div className="lg:col-span-7 space-y-1">
                  <label className="block text-[10px] font-bold font-mono text-gray-500 uppercase">Input target Url to parse</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={scraperUrl}
                      onChange={(e) => setScraperUrl(e.target.value)}
                      placeholder="e.g. https://remotion.dev/docs"
                      className="w-full bg-[#0A0C0F] border border-[#252A33] text-white rounded-lg pl-9 pr-4 py-2.5 text-xs font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="lg:col-span-3 space-y-1">
                  <label className="block text-[10px] font-bold font-mono text-gray-500 uppercase">Extraction Output Format</label>
                  <select 
                    value={scraperFormat}
                    onChange={(e) => setScraperFormat(e.target.value as any)}
                    className="w-full bg-[#0A0C0F] border border-[#252A33] text-white rounded-lg px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-indigo-500"
                  >
                    <option value="markdown">Markdown (.md for LLMS)</option>
                    <option value="json">Structured JSON data</option>
                    <option value="html">Purified Raw HTML (Tags cleaned)</option>
                  </select>
                </div>

                <div className="lg:col-span-2 flex items-end">
                  <button 
                    onClick={() => triggerScraperRun(scraperUrl, scraperFormat)}
                    disabled={isScrapingInProgress}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:opacity-50 text-white font-bold font-mono text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm uppercase cursor-pointer"
                  >
                    {isScrapingInProgress ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Scraping Live...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Extract Page</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Scrape Options panel */}
              <div className="mt-4 p-3 bg-[#0A0C0F] rounded-lg border border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono text-gray-400">
                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <input type="checkbox" defaultChecked className="rounded border-[#252A33] text-indigo-650 focus:ring-0 bg-[#0A0C0F]" />
                  <span>Bypass Cloudflare WAF</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <input type="checkbox" defaultChecked className="rounded border-[#252A33] text-indigo-650 focus:ring-0 bg-[#0A0C0F]" />
                  <span>Wait for Javascript hydration</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <input type="checkbox" defaultChecked className="rounded border-[#252A33] text-indigo-650 focus:ring-0 bg-[#0A0C0F]" />
                  <span>Extract subpages (Crawl)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <input type="checkbox" defaultChecked className="rounded border-[#252A33] text-indigo-650 focus:ring-0 bg-[#0A0C0F]" />
                  <span>Strip cookie warning banners</span>
                </label>
              </div>
            </div>

            {/* Scraper Output and History Splitting */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* History index (4 columns) */}
              <div className="lg:col-span-4 bg-[#14171D] border border-[#252A33] rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-white font-mono mb-3 border-b border-[#252A33] pb-2">Scraped Pages Repository</h3>
                  <div className="space-y-2">
                    {scrapedJobs.map((job) => (
                      <div 
                        key={job.id}
                        className="bg-[#0A0C0F] border border-white/5 rounded-lg p-3 hover:border-indigo-500/40 cursor-pointer transition font-mono space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-400 truncate max-w-[150px] font-bold block">{job.url.replace('https://', '')}</span>
                          <span className="bg-indigo-950 text-indigo-400 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">{job.format}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-gray-500">
                          <span>Size: <strong className="text-gray-400">{job.resultSize || 'Pending'}</strong></span>
                          <span>{job.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#252A33] text-[10px] font-mono text-gray-500 text-center leading-relaxed">
                  Firecrawl Engine can be called in background loops using the terminal commands: <code>scrape [url]</code>
                </div>
              </div>

              {/* Scraped Content Preview Area (8 columns) */}
              <div className="lg:col-span-8 bg-[#14171D] border border-[#252A33] rounded-xl p-4 flex flex-col">
                <div className="flex items-center justify-between border-b border-[#252A33] pb-2.5 mb-3.5">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-400" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-white font-mono">LLM Ready Extracted Asset Preview</h3>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase bg-emerald-900/10 px-2 py-0.5 rounded">Validated Markup template</span>
                </div>

                {scrapedJobs.length > 0 ? (
                  <div className="flex-1 flex flex-col justify-between shrink-0">
                    <pre className="bg-[#0A0C0F] text-xs font-mono text-gray-350 p-4 rounded-lg overflow-x-auto overflow-y-auto max-h-96 border border-white/5 select-text whitespace-pre-wrap leading-relaxed">
                      {scrapedJobs[0].content}
                    </pre>

                    <div className="mt-4 pt-3 border-t border-[#252A33] flex justify-end gap-2 text-xs font-mono">
                      <button 
                        onClick={() => {
                          void copyTextToClipboard(scrapedJobs[0].content);
                          speakAvatarMessage("Copied scraped markdown layout directly to your system clipboard!");
                        }}
                        className="bg-[#1C2129] border border-white/5 hover:bg-[#252B35] text-white px-3 py-1.5 rounded-lg transition"
                      >
                        Copy to Clipboard
                      </button>
                      <button 
                        onClick={() => {
                          const now = new Date().toLocaleTimeString();
                          setTerminalLogs(prev => [
                            ...prev,
                            { time: now, type: 'info', text: `Injecting scraped package directly to Hermes memory context.` }
                          ]);
                          speakAvatarMessage("Markdown parsed directly into active reasoning variables!");
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg font-bold transition"
                      >
                        Inject to Hermes Context
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center text-gray-500 font-mono text-xs">
                    No scraping jobs resolved yet. Enter a Target URL above to trigger the extraction pipeline.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: HQ Terminal Shell */}
        {activeTab === 'terminal' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="bg-[#14171D] border border-[#252A33] rounded-xl overflow-hidden flex flex-col">
              
              {/* Terminal header */}
              <div className="bg-[#1A1E24] px-4 py-2.5 flex items-center justify-between border-b border-[#252A33]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="text-[10px] text-gray-400 font-mono font-bold uppercase ml-2 select-none">AI Agent Handoff Stream -- root@agency-hq:~</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#a855f7] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-pulse"></span>
                  <span>Hermes CPU: 24% load</span>
                </div>
              </div>

              {/* Console log list window */}
              <div className="p-4 bg-[#07090C] h-96 overflow-y-auto font-mono text-xs space-y-2 select-text">
                {terminalLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="text-gray-650 shrink-0">[{log.time}]</span>
                    {log.type === 'system' && <span className="text-purple-400 font-bold shrink-0">[SYS]</span>}
                    {log.type === 'info' && <span className="text-cyan-400 font-bold shrink-0">[INFO]</span>}
                    {log.type === 'success' && <span className="text-emerald-400 font-bold shrink-0">[OK]</span>}
                    {log.type === 'agent' && <span className="text-purple-300 font-bold shrink-0">[AGNT]</span>}
                    <p className={cn(
                      log.type === 'system' ? "text-white font-bold" : "text-gray-300"
                    )}>
                      {log.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Console prompt execution */}
              <form onSubmit={handleTerminalSubmit} className="bg-[#111419] p-3 border-t border-[#252A33] flex gap-2">
                <span className="text-indigo-400 font-mono text-xs font-bold self-center px-1.5 select-none">{`$`}</span>
                <input 
                  type="text"
                  value={terminalCommand}
                  onChange={(e) => setTerminalCommand(e.target.value)}
                  placeholder="Enter AI Agency command... (e.g. 'status', 'scrape https://remotion.dev', 'speak Hello CEO', 'help')"
                  className="bg-[#0A0C0F] border border-[#252A33] rounded-lg px-3 py-2 text-xs font-mono text-white flex-1 focus:outline-none focus:border-indigo-500"
                />
                <button 
                  type="submit"
                  className="bg-purple-650 hover:bg-purple-700 text-white font-bold font-mono text-xs px-5 py-2 rounded-lg transition uppercase cursor-pointer"
                >
                  Run Query
                </button>
              </form>
            </div>

            {/* Quick action helper cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1 text-xs">
              <div 
                onClick={() => setTerminalCommand('status')}
                className="bg-[#14171D] hover:bg-[#1E242F] border border-[#252A33] p-3 rounded-lg cursor-pointer transition font-mono space-y-1"
              >
                <div className="text-purple-300 font-bold">» Inspect Cluster status</div>
                <p className="text-[10px] text-gray-500 leading-normal">Inspect running states of Hermes core, Open Claw browser nodes, and scraping memory pipelines.</p>
              </div>

              <div 
                onClick={() => setTerminalCommand('scrape https://remotion.dev')}
                className="bg-[#14171D] hover:bg-[#1E242F] border border-[#252A33] p-3 rounded-lg cursor-pointer transition font-mono space-y-1"
              >
                <div className="text-indigo-300 font-bold">» Quick Scrape news page</div>
                <p className="text-[10px] text-gray-500 leading-normal">Deploy Firecrawl parsing loops directly onto high density developer sites.</p>
              </div>

              <div 
                onClick={() => speakAvatarMessage("The agency system logs are looking fully compliant. High velocity pipelines active.")}
                className="bg-[#14171D] hover:bg-[#1E242F] border border-[#252A33] p-3 rounded-lg cursor-pointer transition font-mono space-y-1"
              >
                <div className="text-emerald-300 font-bold">» Direct Vocal Speak trigger</div>
                <p className="text-[10px] text-gray-500 leading-normal">Trigger custom voice diagnostics instantly inside the active Rig player.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: CEO Agency Hub MRR Tracker */}
        {activeTab === 'ceo_mrr' && (
          <div className="max-w-6xl mx-auto space-y-5">
            
            {/* CEO KPIs banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#14171D] border border-[#252A33] p-4.5 rounded-xl space-y-2">
                <span className="text-[10px] text-gray-500 font-mono uppercase font-bold tracking-widest block">Total Recurring Retainer (MRR)</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold font-mono text-emerald-400">${totalMRR.toLocaleString()}</span>
                  <div className="bg-emerald-500/10 font-bold font-mono text-[9px] px-2 py-0.5 rounded text-emerald-400 uppercase">
                    +15% monthly growth
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 font-mono">Billed securely across Odoo Finance modules</p>
              </div>

              <div className="bg-[#14171D] border border-[#252A33] p-4.5 rounded-xl space-y-2">
                <span className="text-[10px] text-gray-500 font-mono uppercase font-bold tracking-widest block">Contract Fulfillment Rate</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold font-mono text-white">100%</span>
                  <span className="text-[9px] font-mono text-gray-400">Zero service drops</span>
                </div>
                <p className="text-[10px] text-gray-400 font-mono">Fully backstopped by real-time agent clusters</p>
              </div>

              <div className="bg-[#14171D] border border-[#252A33] p-4.5 rounded-xl space-y-2">
                <span className="text-[10px] text-gray-500 font-mono uppercase font-bold tracking-widest block">Active Web Scrapes today</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold font-mono text-indigo-400">{activeScrapersCount} runs</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                </div>
                <p className="text-[10px] text-gray-400 font-mono">Parallel headless Chromium jobs successfully crawled</p>
              </div>
            </div>

            {/* Clients Table Box */}
            <div className="bg-[#14171D] border border-[#252A33] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[#252A33] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">Enterprise Retainers & Contracts</h3>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">Automated AI systems scaling client pipeline operations</p>
                </div>
                <button 
                  onClick={handleAddClientSim}
                  className="bg-emerald-650 hover:bg-emerald-750 text-white font-bold font-mono text-xs px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 uppercase"
                >
                  <span>+ Sign New Brand Contract</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#252A33] text-[9px] text-gray-550 uppercase bg-[#0B0D10]">
                      <th className="p-3">Client Name</th>
                      <th className="p-3">Core Automated Automation Service</th>
                      <th className="p-3 text-center">Assigned Cluster Nodes</th>
                      <th className="p-3">Status / Health Metric</th>
                      <th className="p-3 text-right">Pricing retainer (mo)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#252A33] text-gray-300">
                    {clients.map((client) => (
                      <tr key={client.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-bold text-white">{client.name}</td>
                        <td className="p-3 text-gray-400 italic">{client.service}</td>
                        <td className="p-3 text-center text-purple-400 font-bold">{client.activeAgents} units</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] bg-emerald-950 text-emerald-400 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>{client.health} health</span>
                          </span>
                        </td>
                        <td className="p-3 text-right font-bold text-emerald-400">${client.mrr.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Simulated API endpoints & Keys controls */}
            <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-4.5 space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-white font-mono border-b border-[#252A33] pb-2.5">API & Crawler Integration Keys</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase font-bold">
                    <span>FIRECRAWL_API_KEY</span>
                    <span className="text-emerald-400">ACTIVE</span>
                  </div>
                  <div className="bg-[#0A0C0F] border border-white/5 rounded-lg p-2.5 flex items-center justify-between text-gray-450 text-[11px]">
                    <span>fc_live_79a25b1ffc8e036bd4917a80eeeb3c...</span>
                    <span className="text-purple-400 bg-purple-950/20 px-1.5 py-0.5 rounded text-[8px] font-bold">CRAWLER KEY</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase font-bold">
                    <span>OPEN_CLAW_INFRASTRUCTURE_KEY</span>
                    <span className="text-emerald-400">ACTIVE</span>
                  </div>
                  <div className="bg-[#0A0C0F] border border-white/5 rounded-lg p-2.5 flex items-center justify-between text-gray-450 text-[11px]">
                    <span>oc_sec_89b2cc38df597cee9942a7dc4...</span>
                    <span className="text-blue-400 bg-blue-950/20 px-1.5 py-0.5 rounded text-[8px] font-bold">NEGOTIATOR KEY</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Tab 5: Example Projects & Netlify Showcase */}
        {activeTab === 'showcase' && (
          <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn font-mono">
            {/* Hero Showcase Banner */}
            <div className="bg-gradient-to-r from-amber-950/30 via-[#14171D] to-purple-950/30 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Featured Live Production Deployment</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Hermes Agent Interactive AI Voice &amp; Video Ad</h2>
                  <p className="text-sm text-gray-300 max-w-2xl font-sans leading-relaxed">
                    A cinematic 10-second interactive marketing asset with synchronized Edge/ElevenLabs voiceover, responsive CSS keyframe animations, terminal telemetry, and direct bi-directional links into Hermes Agent.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                    <span className="bg-black/40 border border-white/10 px-3 py-1 rounded-lg text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Netlify Production Ready</span>
                    </span>
                    <span className="bg-black/40 border border-white/10 px-3 py-1 rounded-lg text-amber-300">
                      Site ID: <code className="text-white">d0d08609-b91b-4dfa-927d-a103ef6cd305</code>
                    </span>
                    <span className="bg-black/40 border border-white/10 px-3 py-1 rounded-lg text-purple-300">
                      Domain: <code className="text-white">xennials.tech / xennials-agent.netlify.app</code>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
                  <a 
                    href="https://xennials-agent.netlify.app" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl transition shadow-lg shadow-amber-950/40 text-xs uppercase tracking-wider"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Live Production (xennials.tech)</span>
                  </a>
                  <a 
                    href="/chat" 
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#1E232D] hover:bg-[#282F3C] text-white border border-white/10 font-bold rounded-xl transition text-xs uppercase tracking-wider"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Consult Hermes Copilot</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Live Interactive Preview & Details */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left: Embedded Live Preview (7 Cols) */}
              <div className="xl:col-span-7 bg-[#14171D] border border-[#252A33] rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-[#252A33] pb-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-amber-400" />
                    <span>Live Interactive Viewport (10s Motion Sequence)</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">100% Client-Side Rendered</span>
                  </div>
                </div>

                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black shadow-inner">
                  <iframe 
                    src="https://hermes-agent-ad.netlify.app" 
                    title="Hermes Agent Interactive Ad" 
                    className="w-full h-full border-0"
                    allow="autoplay"
                  />
                </div>
                <p className="text-[11px] text-gray-400 text-center">
                  Click inside the preview above to trigger playback with voiceover speech and interactive scene transitions.
                </p>
              </div>

              {/* Right: Technical Specs & Multi-Project Catalog (5 Cols) */}
              <div className="xl:col-span-5 flex flex-col gap-4">
                <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-4 space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-white border-b border-[#252A33] pb-2 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <span>Deployment Specifications</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Target Framework</span>
                      <span className="text-white font-bold">Vanilla HTML5 / Modern CSS / ES6</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Audio Subsystem</span>
                      <span className="text-amber-400 font-bold">100KB Preloaded Voiceover Asset</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Primary Domain</span>
                      <a href="https://xennials.tech" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                        xennials.tech ↗
                      </a>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Netlify Preview</span>
                      <a href="https://hermes-agent-ad.netlify.app" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                        hermes-agent-ad.netlify.app ↗
                      </a>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">Local Source Dir</span>
                      <code className="text-emerald-400 text-[11px]">c:\Users\tee\hermes_ad</code>
                    </div>
                  </div>
                </div>

                <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-4 space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-white border-b border-[#252A33] pb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-400" />
                    <span>Connected Example Projects Catalog</span>
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>TutorBot Agents (DeepTutor)</span>
                          <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono">LIVE APP</span>
                        </div>
                        <div className="text-[10px] text-gray-400">Agent-native intelligent learning companion</div>
                      </div>
                      <a href="https://clever-mochi-c38d64.netlify.app/agents" target="_blank" rel="noreferrer" className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold transition flex items-center gap-1">
                        Launch <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="p-2.5 rounded-lg bg-pink-950/30 border border-pink-500/30 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>Hermes Agent &amp; Odoo Suite</span>
                          <span className="text-[9px] bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded font-mono">LIVE APP</span>
                        </div>
                        <div className="text-[10px] text-gray-400">Personal runtime &amp; Enterprise CRM Suite</div>
                      </div>
                      <a href="https://xennials-agent.netlify.app/" target="_blank" rel="noreferrer" className="px-2.5 py-1 bg-pink-600 hover:bg-pink-500 text-white rounded text-[10px] font-bold transition flex items-center gap-1">
                        Launch <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">Odoo Enterprise CRM Suite</div>
                        <div className="text-[10px] text-gray-400">Central homepage with Copilot lead bridge</div>
                      </div>
                      <a href="/crm" className="px-2.5 py-1 bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded text-[10px] font-bold hover:bg-purple-600/50 transition">
                        Open
                      </a>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">HermesClaw WeChat Router</div>
                        <div className="text-[10px] text-gray-400">Multi-agent multiplexer for messaging</div>
                      </div>
                      <a href="/skills" className="px-2.5 py-1 bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold hover:bg-emerald-600/50 transition">
                        Skill
                      </a>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">Anthropic Cybersecurity Suite</div>
                        <div className="text-[10px] text-gray-400">317+ Red/Blue team defense skills</div>
                      </div>
                      <a href="/skills" className="px-2.5 py-1 bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded text-[10px] font-bold hover:bg-amber-600/50 transition">
                        Skills
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Modal: Add custom Agent to cluster */}
      {showAddAgentModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#14171D] border border-purple-500/30 rounded-xl w-full max-w-md p-5 shadow-[0_0_25px_rgba(168,85,247,0.15)] space-y-4">
            
            <div className="flex justify-between items-center border-b border-[#252A33] pb-2">
              <h3 className="font-bold text-sm uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>Deploy New Cluster Agent</span>
              </h3>
              <button 
                onClick={() => setShowAddAgentModal(false)}
                className="text-gray-500 hover:text-white transition font-mono text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleAddNewAgent} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold font-mono text-gray-400 uppercase">Agent Identifier Name</label>
                <input 
                  type="text" 
                  required
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="e.g. Athena Logic Core"
                  className="w-full bg-[#0A0C0F] border border-[#252A33] text-white rounded-lg p-2.5 font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold font-mono text-gray-400 uppercase">Primary Workspace Role</label>
                <input 
                  type="text" 
                  required
                  value={newAgentRole}
                  onChange={(e) => setNewAgentRole(e.target.value)}
                  placeholder="e.g. Lead Pipeline Synthesizer"
                  className="w-full bg-[#0A0C0F] border border-[#252A33] text-white rounded-lg p-2.5 font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold font-mono text-gray-400 uppercase">Assigned Core Goal</label>
                <textarea 
                  required
                  value={newAgentGoal}
                  onChange={(e) => setNewAgentGoal(e.target.value)}
                  placeholder="e.g. Analyze incoming Odoo Leads and extract PDF catalogs."
                  rows={2}
                  className="w-full bg-[#0A0C0F] border border-[#252A33] text-white rounded-lg p-2.5 font-mono focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold font-mono text-gray-400 uppercase">Prompt Backstory / Tuning Parameters</label>
                <textarea 
                  value={newAgentBackstory}
                  onChange={(e) => setNewAgentBackstory(e.target.value)}
                  placeholder="e.g. Derived from deep reasoning models and fine-tuned for high density document layouts..."
                  rows={2}
                  className="w-full bg-[#0A0C0F] border border-[#252A33] text-white rounded-lg p-2.5 font-mono focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#252A33] flex justify-end gap-2 font-mono">
                <button 
                  type="button"
                  onClick={() => setShowAddAgentModal(false)}
                  className="bg-[#1C2129] border border-white/5 hover:bg-[#252B35] text-white px-4 py-2 rounded-lg transition"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-bold transition shadow-md shadow-purple-900/10"
                >
                  Deploy Node
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
