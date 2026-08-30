import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Settings, 
  Cpu, 
  Play, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Layers, 
  Database, 
  Volume2, 
  Eye, 
  AlertTriangle, 
  Scale, 
  TrendingUp, 
  Terminal, 
  Copy, 
  ExternalLink,
  Plus,
  Upload,
  Brain,
  Activity,
  FileText,
  UserCheck,
  CheckCircle2,
  ListRestart
} from 'lucide-react';
import { cn } from '../../utils';

export interface Agent {
  id: string;
  name: string;
  title: string;
  department: string;
  avatar: string; // emoji string OR blob/dataUri for uploaded photograph
  color: string;
  focus: string;
  kpi: string;
  kpiTarget: string;
  prompt: string;
  tools: string[];
}

interface AiAgentsCabinetProps {
  onPromptUpdated?: (prompt: string) => void;
  injectedContextText?: string;
  onClearInjectedContext?: () => void;
  agents: Agent[];
}

// Global static initial RAG logs database to maintain memory retention
const INITIAL_RAG_STORE: Record<string, string[]> = {
  strategy: [
    "Retained guideline: Prioritize high-margin creator recurring pricing schemes over single flat-rate licenses.",
    "Web Scraped YouTube metadata: 2025 development trends highly prioritize local Docker environments and Drizzle DB setups.",
    "Odoo SLA validation: Invoices must clearly mark payment details and 15-day grace terms."
  ],
  marketing: [
    "Retained developer scrapings: Wes Roth videos indicate AI builders maximize conversion using interactive Voice API endpoints.",
    "Scraped target brief: Firecrawl search shows 'Odoo local integration' generates 3.5x higher click-through-rates in subject lines."
  ],
  docker: [
    "Drizzle schema lock metrics: Always assert existence of public.school_registry target table before launching migration loops.",
    "Docker security rule: Restrict internal ingress variables; keep public-facing server binding locked strictly to Port 3000."
  ]
};

export default function AiAgentsCabinet({ 
  onPromptUpdated, 
  injectedContextText,
  onClearInjectedContext,
  agents: initialAgents
}: AiAgentsCabinetProps) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('strategy');
  const [activeTab, setActiveTab] = useState<'prompt' | 'simulation' | 'metrics' | 'rag' | 'generator'>('prompt');
  
  // Custom chat prompt simulator
  const [simQuery, setSimQuery] = useState('');
  const [simLogs, setSimLogs] = useState<Array<{ type: 'thought' | 'action' | 'output' | 'system', text: string }>>([]);
  const [isSimulatingAgent, setIsSimulatingAgent] = useState(false);
  const [simStep, setSimStep] = useState(0);

  // Proactive Autonomy loop states
  const [isProactiveAutonomyActive, setIsProactiveAutonomyActive] = useState(false);
  const [proactiveLogs, setProactiveLogs] = useState<string[]>([
    "System background monitor online. Awaiting autonomy mobilization trigger."
  ]);
  const proactiveLogsEndRef = useRef<HTMLDivElement>(null);

  // RAG Memory structures
  const [ragStore, setRagStore] = useState<Record<string, string[]>>(INITIAL_RAG_STORE);
  const [newRagInput, setNewRagInput] = useState('');

  // Agent Creation (THE GEN) Form State
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentTitle, setNewAgentTitle] = useState('');
  const [newAgentDept, setNewAgentDept] = useState('Marketing');
  const [newAgentFocus, setNewAgentFocus] = useState('');
  const [newAgentKpi, setNewAgentKpi] = useState('Workspace Efficiency Ratio');
  const [newAgentKpiTarget, setNewAgentKpiTarget] = useState('< 3.5% drift');
  const [newAgentPrompt, setNewAgentPrompt] = useState('');
  const [newAgentPhoto, setNewAgentPhoto] = useState<string | null>(null);
  const [isCreatingSuccess, setIsCreatingSuccess] = useState(false);

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  // Auto-scroll proactive logs terminal
  useEffect(() => {
    if (proactiveLogsEndRef.current) {
      proactiveLogsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [proactiveLogs]);

  // If we receive injected text from Google Docs, append or apply it to the selected agent prompt context
  useEffect(() => {
    if (injectedContextText) {
      setAgents(prev => prev.map(a => {
        if (a.id === selectedAgentId) {
          return {
            ...a,
            prompt: `${a.prompt}\n\n# ADDED CONTEXT DOCUMENT:\n${injectedContextText}`
          };
        }
        return a;
      }));
      
      // Also automatically save it to RAG database storage to retain information!
      setRagStore(prev => {
        const currentRag = prev[selectedAgentId] || [];
        return {
          ...prev,
          [selectedAgentId]: [...currentRag, `Google Doc Injected: "${injectedContextText.slice(0, 150)}..."`]
        };
      });

      if (onPromptUpdated) {
        onPromptUpdated(`${selectedAgent.prompt}\n\n# ADDED CONTEXT DOCUMENT:\n${injectedContextText}`);
      }
      setActiveTab('rag');
      alert(`Injected context document successfully as a RAG memory cache item into ${selectedAgent.title}!`);
      if (onClearInjectedContext) onClearInjectedContext();
    }
  }, [injectedContextText]);

  // Autonomous proactive job loop simulated tickers
  useEffect(() => {
    if (!isProactiveAutonomyActive) return;

    const interval = setInterval(() => {
      const selected = selectedAgent;
      const actions = [
        `[Autonomous Job] ${selected.name} triggered proactive check on pending Odoo school database schemas.`,
        `[Autonomous Job] Checking active linter logs on HTTP local binding port: 3000... status: OK.`,
        `[Autonomous RAG] Querying vector storage for context matching: "${selected.focus.slice(0, 30)}..."`,
        `[Autonomous Job] Scanning background Google Docs repository for unclassified brief items.`,
        `[Autonomous Job] Verifying integrity of local Docker compose configuration hashes. No drift detected.`,
        `[Autonomous KPI Check] Progressing toward current benchmark threshold: "${selected.kpiTarget}". Evaluated status: [COMPLIANT]`
      ];
      
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setProactiveLogs(prev => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}] ${randomAction}`]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isProactiveAutonomyActive, selectedAgentId]);

  const handleUpdatePrompt = (val: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === selectedAgentId) {
        return { ...a, prompt: val };
      }
      return a;
    }));
    if (onPromptUpdated) onPromptUpdated(val);
  };

  const startSimulation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!simQuery.trim()) return;

    setIsSimulatingAgent(true);
    setSimLogs([
      { type: 'system', text: `Initializing proactive autonomous identity sequence...` },
      { type: 'system', text: `RAG memory retrieval: Found ${ragStore[selectedAgent.id]?.length || 0} relative vector chunks matching terms.` },
      { type: 'system', text: `Injecting tools [${selectedAgent.tools.join(', ')}] and cognitive prompt into serverless execution context` }
    ]);
    setSimStep(0);
  };

  // Agent Step Sim loop
  useEffect(() => {
    if (!isSimulatingAgent) return;

    const timer = setTimeout(() => {
      let entry = null;
      const step = simStep;

      switch(step) {
        case 0:
          // Querying index memory
          const matchingRag = ragStore[selectedAgent.id]?.[0] || 'No specific cached vector guidelines found.';
          entry = {
            type: 'thought' as const,
            text: `Analyzing query: "${simQuery}". Guided by RAG memory context: "${matchingRag}". ReAct protocol activated.`
          };
          break;
        case 1:
          entry = {
            type: 'action' as const,
            text: `Dispatched tool: "${selectedAgent.tools[0] || 'Odoo Module Auditor'}". Scoped parameters verified on port 3000. Retuned response code [200].`
          };
          break;
        case 2:
          entry = {
            type: 'thought' as const,
            text: `Analyzing output results aligned with active target KPI: "${selectedAgent.kpiTarget}". Formulating strict structured JSON response.`
          };
          break;
        case 3:
          let compiledAnswer = '';
          if (selectedAgent.id === 'strategy') {
            compiledAnswer = `{\n  "brand_positioning": "Autonomous Digital Dominance Platform",\n  "target_market": "High-Growth Solo creators, Educators, Real Estate Agencies",\n  "core_proposition": "Scale from 0 to 10k MRR with 0% staff count using pre-built Odoo automated microservices."\n}`;
          } else if (selectedAgent.id === 'marketing') {
            compiledAnswer = `{\n  "campaign_status": "Marketing Automation Engine Active",\n  "subject_line": "Wes Roth just optimized his Odoo container setup. Here is how you can do it too.",\n  "lead_move_rules": "Score Lead +25 if they click the public sandbox URL."\n}`;
          } else if (selectedAgent.id === 'docker') {
            compiledAnswer = `{\n  "docker_compose_state": "VALIDATED",\n  "ports_assigned": {\n    "odoo_web": 8069,\n    "postgres_db": 5432\n  },\n  "conflicts_detected": "None. Local preview is safe on port 3000."\n}`;
          } else {
            compiledAnswer = `{\n  "agent_status": "success",\n  "query_analyzed": "${simQuery}",\n  "proactive_insight": "Automated workflow matched ${selectedAgent.title} successfully.",\n  "target_kpi_metric": "${selectedAgent.kpi}",\n  "rag_retrieval_status": "synced"\n}`;
          }
          entry = {
            type: 'output' as const,
            text: compiledAnswer
          };
          break;
        default:
          setIsSimulatingAgent(false);
          setSimStep(-1);
          return;
      }

      if (entry) {
        setSimLogs(prev => [...prev, entry]);
        setSimStep(prev => prev + 1);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [isSimulatingAgent, simStep]);

  // Handle file photo upload for real-life agent representations
  const handlePhotoUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setNewAgentPhoto(url);
    }
  };

  // Submit agent generator (THE GEN)
  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim() || !newAgentTitle.trim()) return;

    const generatedId = `custom_agent_${Date.now()}`;
    const newAgent: Agent = {
      id: generatedId,
      name: newAgentName,
      title: newAgentTitle,
      department: newAgentDept,
      // Use uploaded photograph, or fallback to an emoji placeholder
      avatar: newAgentPhoto || '👮',
      color: newAgentDept === 'Marketing' ? 'bg-pink-500 text-white' : 'bg-emerald-500 text-white',
      focus: newAgentFocus || `Proactively manage and optimize ${newAgentDept} workflows autonomous schedules.`,
      kpi: newAgentKpi,
      kpiTarget: newAgentKpiTarget,
      prompt: newAgentPrompt || `# ROLE: ${newAgentName.toUpperCase()} - ${newAgentTitle.toUpperCase()}\nProactively monitor workspaces, retain indexed RAG guidelines, and drive target deliverables matching KPI parameters.`,
      tools: ['Google Workplace SDK', 'JSON Schema Compiler', 'Autonomous Live Cron Trigger']
    };

    setAgents(prev => [...prev, newAgent]);
    setSelectedAgentId(generatedId);
    
    // Seed initials in RAG DB memory
    setRagStore(prev => ({
      ...prev,
      [generatedId]: [
        `Base agent identity: Proactive, autonomous operator created successfully inside "the gen" studio.`,
        `Knowledge schema target: Aligned to KPI parameters - "${newAgentKpiTarget}"`
      ]
    }));

    setIsCreatingSuccess(true);
    setNewAgentName('');
    setNewAgentTitle('');
    setNewAgentFocus('');
    setNewAgentPrompt('');
    setNewAgentPhoto(null);

    setTimeout(() => {
      setIsCreatingSuccess(false);
      setActiveTab('simulation');
    }, 2000);
  };

  // Submits a new RAG knowledge cache item
  const handleAddRagChunk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRagInput.trim()) return;

    setRagStore(prev => {
      const activeRag = prev[selectedAgent.id] || [];
      return {
        ...prev,
        [selectedAgent.id]: [...activeRag, newRagInput]
      };
    });
    setNewRagInput('');
  };

  // Check if avatar is real of emoji
  const renderAvatar = (avatar: string, sizeClass = "w-8 h-8") => {
    if (avatar.startsWith('blob:') || avatar.startsWith('data:') || avatar.startsWith('http')) {
      return (
        <img 
          src={avatar} 
          alt="Avatar Portrait" 
          className={cn("rounded-full object-cover border border-white/10", sizeClass)} 
        />
      );
    }
    return (
      <div className={cn("rounded-full flex items-center justify-center text-base shrink-0", sizeClass)}>
        {avatar}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden text-sm bg-[#0E1218]" id="agents-cabinet-root">
      
      {/* 1. LEFT SIDEBAR: Visual Listing of Agents & Proactive Toggles */}
      <div className="w-full lg:w-[290px] border-r border-[#1C222A] bg-[#0E1217] flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-[#1C222A]">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8E95A3] font-mono flex items-center gap-1.5 justify-between">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Agent Cabinet ({agents.length})</span>
            </div>
            <span className="text-[9px] bg-cyan-900/40 text-cyan-300 font-bold px-1.5 py-0.5 rounded uppercase font-mono">2025 ACTIVE</span>
          </h3>
          <p className="text-[10px] text-gray-400 font-mono mt-1 leading-snug">
            Proactive autonomous agents with photo representations and RAG memory retention.
          </p>
        </div>

        {/* List of Agents with photo renderer */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {agents.map((agent) => {
            const isSelected = agent.id === selectedAgentId;
            return (
              <button
                key={agent.id}
                onClick={() => {
                  setSelectedAgentId(agent.id);
                  setSimLogs([]);
                  setIsSimulatingAgent(false);
                  if (activeTab === 'generator') {
                    setActiveTab('prompt'); // Reset tab to view details
                  }
                }}
                className={cn(
                  "w-full text-left p-2.5 rounded-lg flex items-start gap-3 transition border",
                  isSelected 
                    ? "bg-cyan-600/10 border-cyan-500/20 text-white" 
                    : "border-transparent text-gray-400 hover:bg-[#141821] hover:text-white"
                )}
              >
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-base", !agent.avatar.startsWith('http') && !agent.avatar.startsWith('blob:') && agent.color)}>
                  {renderAvatar(agent.avatar, "w-8 h-8")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-tight block truncate uppercase leading-none">{agent.name}</span>
                    <span className="text-[8px] font-mono font-bold text-gray-500 px-1 bg-black/20 rounded uppercase">
                      {agent.department}
                    </span>
                  </div>
                  <span className="block text-[9.5px] text-[#8E95A3] mt-1 font-mono truncate leading-none">
                    {agent.title}
                  </span>
                  <div className="flex items-center gap-1 mt-2 text-[8px] font-mono text-gray-500">
                    <TrendingUp className="w-2.5 h-2.5 text-cyan-500" />
                    <span>KPI: <strong className="text-cyan-400">{agent.kpiTarget}</strong></span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 2025 Background Proactive Autonomy Ticker Trigger */}
        <div className="p-3 bg-[#0a0c10] border-t border-[#1C222A] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#8E95A3] uppercase font-bold tracking-wider">Proactive Autonomy Engine</span>
            <span className={cn(
              "w-2 h-2 rounded-full",
              isProactiveAutonomyActive ? "bg-emerald-400 animate-ping" : "bg-gray-600"
            )}></span>
          </div>

          <button
            onClick={() => {
              setIsProactiveAutonomyActive(!isProactiveAutonomyActive);
              if(!isProactiveAutonomyActive) {
                setProactiveLogs(prev => [...prev, `[SYSTEM] ${selectedAgent.name} autonomy stream initiated.`]);
              }
            }}
            className={cn(
              "w-full py-1.5 px-2.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all border",
              isProactiveAutonomyActive 
                ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600/35" 
                : "bg-black text-gray-400 border-white/5 hover:text-white"
            )}
          >
            {isProactiveAutonomyActive ? "⏸ Stop Cron Stream" : "⚡ Mobilize Autonomous Cron"}
          </button>

          {/* Autonomy Live Ticker Shell */}
          <div className="bg-black/95 rounded p-2 border border-white/5 h-[100px] overflow-y-auto font-mono text-[8px] text-gray-400 space-y-1">
            <div className="text-[7.5px] font-semibold text-gray-500 border-b border-white/5 pb-1 uppercase tracking-widest flex items-center gap-1">
              <Activity className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
              <span>Autonomy Streams</span>
            </div>
            {proactiveLogs.slice(-6).map((log, index) => (
              <div key={index} className="leading-normal text-gray-400 select-none">
                {log}
              </div>
            ))}
            <div ref={proactiveLogsEndRef} />
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE / CHAT SIMULATOR */}
      <div className="flex-1 flex flex-col h-full bg-[#090C10] overflow-hidden">
        
        {/* Agent active card overview with unified tab controller */}
        <div className="p-4 bg-[#0E1217] border-b border-[#1C222A] flex flex-col md:flex-row justify-between items-center shrink-0 gap-3">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5 overflow-hidden", !selectedAgent.avatar.startsWith('http') && !selectedAgent.avatar.startsWith('blob:') && selectedAgent.color)}>
              {renderAvatar(selectedAgent.avatar, "w-10 h-10")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white font-sans uppercase tracking-tight">{selectedAgent.name}</h4>
                <span className="text-[9px] bg-cyan-650/15 border border-cyan-600/20 text-cyan-300 font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                  PROACTIVE ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-[#8E95A3] font-mono mt-0.5">{selectedAgent.title}</p>
            </div>
          </div>

          {/* Central Workspace Tab controller */}
          <div className="flex flex-wrap bg-black/40 rounded-lg p-0.5 border border-[#1C222A] gap-0.5">
            {(['prompt', 'simulation', 'metrics', 'rag', 'generator'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-2.5 py-1 text-[9px] sm:text-[10px] font-mono font-bold uppercase rounded transition",
                  activeTab === tab ? "bg-cyan-600 text-white" : "text-gray-400 hover:text-white"
                )}
              >
                {tab === 'prompt' ? '✎ Sys Prompt' 
                 : tab === 'simulation' ? '⚡ Run Sandbox' 
                 : tab === 'metrics' ? '📊 KPIs' 
                 : tab === 'rag' ? '🧠 Dynamic RAG memory' 
                 : '➕ "The Gen"'}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Workspace panel */}
        <div className="flex-1 overflow-y-auto p-5 select-text selection:bg-cyan-500/20">
          
          {/* A. SYSTEM PROMPT Tab */}
          {activeTab === 'prompt' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="p-3 bg-cyan-950/20 border border-cyan-800/25 rounded-lg text-cyan-300 flex gap-2.5 items-start">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="text-[10.5px] leading-relaxed">
                  <strong>Cognitive Instruction Set:</strong> This prompt acts as the absolute operational constraints for <span className="font-bold">{selectedAgent.name}</span>. Edit the text below to tune logic parameters inside the browser ReAct loops.
                </div>
              </div>

              <div className="bg-[#0E1217] rounded-xl border border-white/5 overflow-hidden flex flex-col shadow-2xl">
                <div className="bg-black/30 px-3.5 py-2 border-b border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase">
                  <span>SYSTEM COGNITIVE PROMPT EDITOR</span>
                  <span>Strict UTF-8</span>
                </div>
                <textarea
                  value={selectedAgent.prompt}
                  onChange={(e) => handleUpdatePrompt(e.target.value)}
                  rows={15}
                  className="w-full bg-black/45 text-cyan-100 p-4 font-mono text-[11px] focus:outline-none focus:ring-0 leading-relaxed resize-none scrollbar-thin"
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                <span>Persisted cache synced on localPort:3000</span>
                <span className="text-cyan-400 font-bold">{selectedAgent.prompt.length} UTF8 characters</span>
              </div>
            </div>
          )}

          {/* B. SIMULATION RUN SANDBOX Tab */}
          {activeTab === 'simulation' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="bg-[#0E1217] p-4 rounded-xl border border-white/5 shadow-2xl space-y-3">
                <h5 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">Execute Sandbox Query (With RAG and Tools)</h5>
                <p className="text-[10px] text-gray-400 leading-relaxed font-mono">
                  Input a query target to dispatch. The system retrieves relevant indexed vector memory items matching this prompt before starting ReAct thought blocks.
                </p>

                <form onSubmit={startSimulation} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={simQuery}
                    onChange={(e) => setSimQuery(e.target.value)}
                    placeholder={`e.g., Run proactively to verify "${selectedAgent.focus.substring(0,40)}..."`}
                    className="flex-1 bg-black/45 hover:bg-black/60 focus:bg-black text-xs text-white px-3 py-2.5 rounded border border-[#1F252D] focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isSimulatingAgent}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white text-[11px] font-bold uppercase transition px-5 py-2.5 rounded shrink-0 font-mono flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Run</span>
                  </button>
                </form>
              </div>

              {/* Simulation logs console */}
              {simLogs.length > 0 && (
                <div className="bg-[#07090D] rounded-xl border border-white/5 p-4.5 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#8E95A3]">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <span>COGNITIVE RUNTIME STAGING LOGS</span>
                    </div>
                    <button
                      onClick={() => setSimLogs([])}
                      className="text-[9px] hover:text-white font-mono text-gray-500"
                    >
                      Clear Console
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[350px] overflow-y-auto font-mono scrollbar-thin">
                    {simLogs.map((log, idx) => {
                      let tagColor = "text-cyan-400";
                      let bgStyle = "border-white/5 bg-[#0E1217]/20";
                      let tagLabel = "SYSTEM INFO";

                      if (log.type === 'thought') {
                        tagColor = "text-amber-400";
                        bgStyle = "border-amber-500/10 bg-amber-500/5";
                        tagLabel = "LAYER 3: RAG-INDEXED COGNITIVE THOUGHT BUFFER";
                      } else if (log.type === 'action') {
                        tagColor = "text-indigo-400";
                        bgStyle = "border-indigo-500/10 bg-indigo-500/5";
                        tagLabel = "LAYER 4: ACTIVE COMPLIANCE TOOL ACTION";
                      } else if (log.type === 'output') {
                        tagColor = "text-emerald-400 font-bold";
                        bgStyle = "border-emerald-500/20 bg-black";
                        tagLabel = "STRUCTURAL OUTPUT PAYLOAD GENERATED";
                      }

                      return (
                        <div key={idx} className={cn("p-2.5 rounded-lg border flex flex-col gap-1 text-[10.5px]", bgStyle)}>
                          <span className={cn("text-[9px] tracking-widest uppercase font-black", tagColor)}>
                            {tagLabel}
                          </span>
                          <span className={cn("leading-relaxed", log.type === 'output' ? "whitespace-pre text-emerald-200" : "text-gray-300")}>
                            {log.text}
                          </span>
                        </div>
                      );
                    })}

                    {isSimulatingAgent && (
                      <div className="flex items-center gap-2 text-cyan-400 text-[10px] italic">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-500" />
                        <span>Solving constraints, executing pipelines ...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* C. KPIs & MEASURED DRIFT METRICS Tab */}
          {activeTab === 'metrics' && (
            <div className="max-w-4xl mx-auto space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Performance profile */}
                <div className="p-4 bg-[#0E1217] border border-white/5 rounded-xl space-y-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-cyan-400" />
                    <h5 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">Metrics & Performance</h5>
                  </div>
                  <div className="space-y-2.5 font-mono text-[11px] text-gray-300">
                    <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                      <span>Department:</span>
                      <span className="text-white font-bold uppercase">{selectedAgent.department}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                      <span>Proactive Scope Objective:</span>
                      <span className="text-gray-400 text-right font-medium max-w-[200px] truncate">{selectedAgent.focus}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                      <span>Target KPI Metric:</span>
                      <span className="text-cyan-400 font-bold">{selectedAgent.kpi}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                      <span>Compliance Target:</span>
                      <span className="text-emerald-400 font-bold">{selectedAgent.kpiTarget}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Autonomy Frequency:</span>
                      <span className="text-fuchsia-400">4500ms ticker cycle</span>
                    </div>
                  </div>
                </div>

                {/* HITL safeguards */}
                <div className="p-4 bg-[#0E1217] border border-white/5 rounded-xl space-y-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                    <h5 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">Linter &amp; Exception boundaries</h5>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-gray-400 leading-relaxed font-mono">
                      Define boundaries where the autonomous logic suspends and shifts telemetry details immediately to customer support channels.
                    </p>
                    <div className="p-2.5 bg-black/40 rounded border border-white/5 text-[10px] font-mono text-amber-300">
                      RULE BIND: Pause background execution if local server compilation fails on port 3000, or if Odoo schema returns invalid tables.
                    </div>
                  </div>
                </div>
              </div>

              {/* Tools checklists */}
              <div className="p-4 bg-[#0E1217] border border-white/5 rounded-xl space-y-3 shadow-xl">
                <h5 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">Authorized Workspace Tools</h5>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {selectedAgent.tools.map((t) => (
                    <div key={t} className="p-2.5 bg-black/30 rounded border border-white/5 flex items-center gap-2 font-mono text-[10px] text-cyan-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <span className="truncate">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* D. DYNAMIC RAG RETRIEVAL MEMY CACHE Tab */}
          {activeTab === 'rag' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="p-4 bg-[#0E1217] border border-white/5 rounded-xl space-y-4 shadow-xl">
                <div>
                  <h5 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1.5">
                    <Brain className="text-[#a855f7] w-4 h-4" />
                    <span>Dynamic RAG Vector Database Storage</span>
                  </h5>
                  <p className="text-[10.5px] text-gray-400 font-mono mt-0.5">
                    Pasted text guidelines, developer comments, and search scrapes are index-hashed here. The Agent executes semantical vector similarity matches on this data first during ReAct runtime.
                  </p>
                </div>

                {/* List current chunk indexes */}
                <div className="space-y-2 mt-3 text-xs">
                  <span className="text-[10px] text-gray-500 font-mono uppercase block font-bold">Currently Indexed Context Clusters ({ragStore[selectedAgent.id]?.length || 0})</span>
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                    {ragStore[selectedAgent.id]?.map((chunk, idx) => (
                      <div key={idx} className="p-2.5 bg-black/40 rounded border border-white/5 font-mono text-[10.5px] text-indigo-200 flex gap-2 items-start">
                        <span className="text-[9px] bg-purple-950/40 text-purple-400 px-1.5 py-0.5 border border-purple-900/30 rounded font-bold">CHUNK-{idx+1}</span>
                        <span className="leading-snug">{chunk}</span>
                      </div>
                    ))}
                    {(!ragStore[selectedAgent.id] || ragStore[selectedAgent.id].length === 0) && (
                      <div className="p-3 bg-black/20 text-gray-600 font-mono italic text-[10.5px]">No RAG assets indexed for this agent profile yet. Paste custom guidelines below.</div>
                    )}
                  </div>
                </div>

                {/* Add new memory chunk form */}
                <form onSubmit={handleAddRagChunk} className="space-y-2 pt-2 border-t border-white/5">
                  <label className="text-[10px] font-mono text-gray-500 uppercase block">Index new text guideline (RAG retention)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={newRagInput}
                      onChange={(e) => setNewRagInput(e.target.value)}
                      placeholder="e.g. YouTube developer crawl indicates SDXL generates logos 3.5x better than SD1.5"
                      className="flex-grow bg-black/40 border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                    />
                    <button
                      type="submit"
                      className="bg-purple-700 hover:bg-purple-800 text-white font-mono text-xs font-bold px-4 rounded transition uppercase shrink-0 flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Index</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* E. AGENT CONSTRUCTOR ("THE GEN") Tab */}
          {activeTab === 'generator' && (
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleCreateAgent} className="bg-[#0e1218] rounded-xl border border-white/5 p-5 shadow-2xl space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <span className="text-[10px] bg-fuchsia-950/40 text-fuchsia-400 border border-fuchsia-900/20 px-2 py-0.5 rounded font-mono uppercase tracking-wider font-bold">Agent Synthesis Chamber // "The Gen"</span>
                  <h4 className="text-white font-bold text-sm uppercase mt-1">Generate Autonomous Real-Life Agent</h4>
                  <p className="text-[10.5px] text-gray-400 font-mono mt-0.5">Define job scopes, descriptions, target SLA thresholds, and attach physical photos to create a brand new autonomous operator.</p>
                </div>

                {isCreatingSuccess && (
                  <div className="p-3 bg-emerald-950/30 border border-emerald-800/30 text-emerald-400 rounded-lg flex items-center gap-2 font-mono text-xs animate-bounce">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Agent synthesized successfully! Redirecting to simulation staging...</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 uppercase block">Agent Full Name</label>
                    <input
                      type="text"
                      required
                      value={newAgentName}
                      onChange={(e) => setNewAgentName(e.target.value)}
                      placeholder="e.g. Alexis Prime"
                      className="w-full bg-[#050608] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 uppercase block">Job Professional Title</label>
                    <input
                      type="text"
                      required
                      value={newAgentTitle}
                      onChange={(e) => setNewAgentTitle(e.target.value)}
                      placeholder="e.g. Lead Brand Artificer & logo builder"
                      className="w-full bg-[#050608] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  {/* Department */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 uppercase block">Workspace Department</label>
                    <select
                      value={newAgentDept}
                      onChange={(e) => setNewAgentDept(e.target.value)}
                      className="w-full bg-[#050608] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono font-semibold"
                    >
                      <option value="Marketing">Marketing &amp; Content</option>
                      <option value="DevOps">DevOps &amp; Infrastructure</option>
                      <option value="Legal &amp; Compliance">Legal &amp; Ledger Compliance</option>
                      <option value="Brand Strategy &amp; Design">Brand Strategy &amp; Design</option>
                    </select>
                  </div>

                  {/* Photo upload for real-life agent */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 uppercase block">Attach Real-Life Photograph</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUploadChange}
                        className="flex-1 text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[9px] file:font-mono file:font-semibold file:bg-cyan-950/20 file:text-cyan-400 file:border file:border-cyan-900/35 hover:file:bg-cyan-900/30 font-mono"
                      />
                      {newAgentPhoto && (
                        <img src={newAgentPhoto} alt="Upload preview" className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0" />
                      )}
                    </div>
                  </div>

                  {/* Business target details */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 uppercase block">North-Star KPI Measured Metric</label>
                    <input
                      type="text"
                      required
                      value={newAgentKpi}
                      onChange={(e) => setNewAgentKpi(e.target.value)}
                      placeholder="e.g. Scraped YouTube Lead Conversion CTR"
                      className="w-full bg-[#050608] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  {/* KPI compliance target */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 uppercase block">SLA Target Threshold (Success Bound)</label>
                    <input
                      type="text"
                      required
                      value={newAgentKpiTarget}
                      onChange={(e) => setNewAgentKpiTarget(e.target.value)}
                      placeholder="e.g. > 12.5% clicking rate"
                      className="w-full bg-[#050608] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  {/* Focus Scope */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-mono text-gray-500 uppercase block">Proactive Job Description &amp; Focus</label>
                    <input
                      type="text"
                      required
                      value={newAgentFocus}
                      onChange={(e) => setNewAgentFocus(e.target.value)}
                      placeholder="e.g. Proactively crawls top YouTube AI clips via Firecrawl, formats blogs matching Schott NYC branding rotations."
                      className="w-full bg-[#050608] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  {/* Custom cognitive prompt */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-mono text-gray-500 uppercase block">Custom Cognitive Prompt Rules</label>
                    <textarea
                      value={newAgentPrompt}
                      onChange={(e) => setNewAgentPrompt(e.target.value)}
                      placeholder={`# ROLE: ENTERPRISE SPECIALIST\nAdhere directly to vector RAG guidelines. Verify odoo schema limits. Assert container health parameters.`}
                      rows={4}
                      className="w-full bg-[#050608] border border-white/10 rounded p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono resize-none leading-relaxed"
                    />
                  </div>

                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-mono text-xs font-bold py-2.5 rounded uppercase transition flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Synthesize Autonomous Agent Now</span>
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
