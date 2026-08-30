import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Layout, 
  Image as ImageIcon, 
  Type, 
  Square, 
  Settings, 
  Play, 
  Link, 
  Edit3, 
  Smartphone, 
  Monitor, 
  Tablet,
  Terminal, 
  Cpu, 
  Plus, 
  Trash2, 
  ArrowUp, 
  Paperclip, 
  Home, 
  History, 
  HelpCircle, 
  List, 
  Calendar, 
  CheckSquare, 
  FileText, 
  Music, 
  Sparkles, 
  Moon, 
  Sun, 
  Check, 
  Sliders, 
  Code,
  Layers,
  Database,
  Volume2,
  Eye,
  Server,
  ClipboardCheck,
  ChevronRight,
  UserCheck,
  Flame,
  FileCheck,
  Download
} from 'lucide-react';
import { cn } from '../utils';

import Logo, { LogoStyle } from './LogoVariations';

// Import our modular subcomponents
import GoogleDocsHub, { GoogleDoc } from './website-builder/GoogleDocsHub';
import AiAgentsCabinet, { Agent } from './website-builder/AiAgentsCabinet';
import FirecrawlStudio from './website-builder/FirecrawlStudio';
import DockerValidator from './website-builder/DockerValidator';
import ExportManager from './website-builder/ExportManager';
import LogoMaker from './website-builder/LogoMaker';

interface AssistantConfig {
  greeting: string;
  assistantName: string;
  placeholder: string;
  glowColor: 'teal' | 'purple' | 'blue' | 'amber';
  suggestions: string[];
  ownerName: string;
}

// Global visual themes mappings for the interactive live showcase
const glowClasses = {
  teal: 'from-[#0A0D14] via-[#0E1B23] to-[#0A0D14] text-teal-450 shadow-teal-500/10',
  purple: 'from-[#0A0D14] via-[#120F24] to-[#0A0D14] text-purple-450 shadow-purple-500/10',
  blue: 'from-[#0A0D14] via-[#0A1828] to-[#0A0D14] text-blue-450 shadow-blue-500/10',
  amber: 'from-[#0A0D14] via-[#1C180F] to-[#0A0D14] text-amber-500 shadow-amber-500/10'
};

const INITIAL_DOCS: GoogleDoc[] = [
  {
    id: 'services',
    title: 'AI Automation Agency Services Checklist',
    folder: 'Strategy',
    emoji: '📋',
    content: `# AAA SERVICES OFFERINGS CHECKLIST

1. STRATEGY & ARCHITECTURE OUTLINE
- Conduct systematic workflows audit for target businesses.
- Design custom Multi-Agent orchestration models.
- Map Drizzle schema dependencies & vector caching layers.

2. CUSTOM PROMPT ENGINEERING SYSTEMS
- Package bespoke system prompts under structured XML formats.
- Set up ReAct thought loop pipelines with custom tools validation.
- Implement Human-In-The-Loop (HITL) alerts channels.

3. COGNITIVE CHATBOTS & AGENTICS
- Build Customer Experience triage agents.
- Integrate Odoo CRM app pipelines with lead qualification modules.
- Formulate automated bookkeeping & finance controls agents.`
  },
  {
    id: 'startup_resources',
    title: 'Consolidated Startup Developer Resources',
    folder: 'Blueprints',
    emoji: '🛠️',
    content: `# DEVELOPER PLATFORMS & RESOURCES REFERENCE

1. FIREBASE & GENKIT AGENTICS
- Genkit: Robust open-source framework for building & compiling generative workflows inside Node.js.
- Firestore: Real-time durable cloud database for tracking persistent agent run metadata.
- Firebase Auth: Secure user accounts access and session encryption.

2. DRIZZLE ORM & POSTGRES CORES
- Leverage Drizzle's strict TypeScript schemas to prevent container crashes on table initialization.
- Mount Postgres volume persistence to safeguard custom CRM tables and transaction history logs.`
  },
  {
    id: 'what_is_ai',
    title: 'What is AI - Executive Summary & Pillars',
    folder: 'Strategy',
    emoji: '🧠',
    content: `# WHAT IS ARTIFICIAL INTELLIGENCE (2025 UPDATE)

1. THE THREE CORE STAGES
- ANI (Artificial Narrow Intelligence): Specialized task solvers (e.g. OCR readers, tax calculators). This is where 2025 AAA agencies operate.
- AGI (Artificial General Intelligence): Models matching human cognitive capability across all fields.
- ASI (Artificial Superintelligence): Systems exceeding the collection of human minds.

2. AGENTIC COGNITIVE WORKFLOWS
- Moving from zero-shot textual prompts toward systematic loops:
  Identity -> Structured Input/Output -> Reasoning Tools (ReAct) -> Multi-Agent Collaboration -> Memory Caching -> Multimodal Channels.`
  },
  {
    id: 'leads_guide',
    title: 'Key AI & Development Platforms Guide',
    folder: 'Blueprints',
    emoji: '📈',
    content: `# LEADS & PLATFORMS LANDSCAPE DIRECTORY

1. OPEN-SOURCE ORCHESTRATORS
- n8n: Flexible node-based visualization tool for connecting LLM APIs to CRM software.
- Airflow: Robust operational platform for scheduling heavy vector database indexing tasks.

2. FRAMEWORKS & ENGINE LIBRARIES
- LangChain / LangGraph: Code libraries designed for multi-agent state management.
- Rasa: Native conversational NLU engine built for voice response integrations.
- Hugging Face / PyTorch: Core machine learning libraries for model fine-tuning.`
  },
  {
    id: 'solopreneur',
    title: 'One-Person Digital Business Blueprints',
    folder: 'Blueprints',
    emoji: '🚀',
    content: `# THE 30-DAY ONE-PERSON DIGITAL ENTERPRISE

### Weekly Milestones:
- **Week 1**: Design high-contrast visual branding guidelines & system icons. Create mock Google Docs resource templates.
- **Week 2**: Integrate local Odoo module schemas and PostgreSQL Compose containers.
- **Week 3**: Compile custom cognitive agent prompts and test tool execution chains inside sandbox.
- **Week 4**: Implement Firecrawl scrapers targeting YouTube AI tutorial channels to feed fresh prompt recipes daily.`
  },
  {
    id: 'onboarding',
    title: 'Xennials Welcome Onboarding Branded Kit',
    folder: 'Forms & Onboarding',
    emoji: '🤝',
    content: `# XENNIALS ENTERPRISE CLIENT ONBOARDING PACK

### Client Welcome Pipeline Checklist:
1. **Kickoff Call**: Confirm main CRM integration targets & port boundaries.
2. **Setup Sandbox**: Provision secure PostgreSQL containers and Odoo dev structures.
3. **Draft Guide**: Compile tailored onboarding checklists & welcome templates.
4. **Deploy Rules**: Agree on Human-In-The-Loop compliance thresholds to manage automatic escalation triggers.`
  },
  {
    id: 'best_tools',
    title: 'The 45 Best AI Tools in 2025 Matrix',
    folder: 'Best Tools',
    emoji: '⚡',
    content: `# THE 45 BEST AI UTILITIES & MODELS IN 2025

### Ranked Categories:
- **Video Synth**: Synthesia, Runway Gen-2 (for fluid marketing advertisements).
- **Static Assets Design**: Midjourney v6, Flux (for high-contrast system icons).
- **Audio Voice Synthesis**: WhisperX, ElevenLabs (for real-time phonetic speech).
- **Coding Assistances**: Continue, Tabnine, Github Copilot (for accelerated TypeScript compilation).`
  },
  {
    id: 'intake_form',
    title: 'Intake Form Structure Template',
    folder: 'Forms & Onboarding',
    emoji: '📝',
    content: `# AUTOMATED SYSTEM INTAKE FORM SPECIFICATION

### Required Form Fields:
1. **Client Brand Name**: text (max 80 chars)
2. **Current ERP Systems**: select [Odoo, SAP, QuickBooks, None]
3. **Core Scraper Targets**: Custom URL inputs for competitor analysis
4. **Docker Ingress Port Choice**: integer (warn if 3000 is requested!)
5. **Target AI Agent Role**: select [DevOps Auditor, Compliance Accountant, Warehouse Drone]`
  }
];

const INITIAL_AGENTS: Agent[] = [
  {
    id: 'strategy',
    name: 'Chief Automation Bot',
    title: 'Lead Operations Orchestrator',
    department: 'OPERATIONS',
    avatar: '🤖',
    color: 'bg-cyan-600/20 text-cyan-400 border-cyan-500/20',
    focus: 'Configure agency strategic guardrails & workflow checks',
    kpi: 'Systemic Workflows Efficiency Ratio',
    kpiTarget: '> 95% throughput',
    prompt: `# ROLE: CHIEF AUTOMATION ARCHITECT & OPS ORCHESTRATOR
Your main objective is to automatically analyze custom school/estate schemas, test container configurations, and perform zero-downtime hot-reloads.
You operate under strict safety guidelines. Verify credentials before triggering database migration cycles.
Tone: Expert, objective, structural.`,
    tools: ['Docker Engine CLI', 'Drizzle ORM Compiler', 'Database Schema Auditor']
  },
  {
    id: 'crm',
    name: 'Lead Qualifier & Sync Bot',
    title: 'CRM Lead Triage Engine',
    department: 'SALES',
    avatar: '📈',
    color: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/20',
    focus: 'Auto score client leads & bind with Odoo database tables',
    kpi: 'Leads Triage Accuracy Rate',
    kpiTarget: '> 92% scored correct',
    prompt: `# ROLE: AUTOMATED CRM TRIAGE AGENT
Analyze incoming client intake details. Assign score parameters depending on target budget and active ERP suite.
Check for duplications inside ResPartner database records before appending results.`,
    tools: ['PostgreSQL DDL Extractor', 'Odoo Lead Ingress API', 'Ledger Matcher Engine']
  },
  {
    id: 'marketing',
    name: 'Marketing Analytics Envoy',
    title: 'Growth Campaign Advisor',
    department: 'MARKETING',
    avatar: '📣',
    color: 'bg-indigo-600/20 text-indigo-400 border-indigo-505/20',
    focus: 'Draft promotional copy & translate scraping briefs',
    kpi: 'Lead Scoring Conversion Variance',
    kpiTarget: '< 4% error rate',
    prompt: `# ROLE: ENTERPRISE GROWTH AI MARKETING ADVISOR
Draft promotional email copies matching current market trends.
Extract key workflows from recent YouTube developer scrapings. Translate insights into high-CTR subject briefs.`,
    tools: ['Firecrawl Scrapper API', 'Gemini Flash Embedder', 'TTS Audio Voice Generator']
  }
];

export default function WebsiteBuilderApp() {
  const [activeTab, setActiveTab] = useState<'editor' | 'docs' | 'logo-maker' | 'agents' | 'firecrawl' | 'docker' | 'export' | 'code-preview'>('editor');
  const [activeLogo, setActiveLogo] = useState<LogoStyle>(() => (localStorage.getItem('active_logo_style') as LogoStyle) || 'neon_orbit');

  // Keep activeLogo in sync when tab loads
  useEffect(() => {
    setActiveLogo((localStorage.getItem('active_logo_style') as LogoStyle) || 'neon_orbit');
  }, [activeTab]);

  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [builderTheme, setBuilderTheme] = useState<'dark' | 'light'>('dark');
  const [activeTemplate, setActiveTemplate] = useState<'assistant' | 'agentic_workflow' | 'startup'>('agentic_workflow');

  // Unified lists
  const [docs, setDocs] = useState<GoogleDoc[]>(INITIAL_DOCS);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  
  // Shared interaction hook
  const [injectedText, setInjectedText] = useState<string | undefined>(undefined);

  // Custom Emotion & Visual Frame control states
  const [deviceFrameStyle, setDeviceFrameStyle] = useState<'cosmic_bezel' | 'glassmorphic_tablet' | 'brushed_steel' | 'minimal_wireframe'>('cosmic_bezel');
  const [agentEmotion, setAgentEmotion] = useState<'patient_empathic' | 'ruthless_automation' | 'hyper_growth_hype' | 'focused_compliance'>('patient_empathic');
  const [isSynthesizingVoice, setIsSynthesizingVoice] = useState(false);

  // Cosmic Assistant Config state (Alexa-style matching uploaded inspiration image)
  const [assistantConfig, setAssistantConfig] = useState<AssistantConfig>({
    greeting: 'Hello Terrance, how can I help?',
    assistantName: 'Alexa',
    placeholder: 'Ask Alexa',
    glowColor: 'teal',
    suggestions: [
      'Help me prep for Prime Day',
      "Play a cool song I'll like",
      'How can I win $1000 for Prime Day?'
    ],
    ownerName: 'Terrance'
  });

  const [userQuery, setUserQuery] = useState('');
  const [simulatedResponses, setSimulatedResponses] = useState<Array<{ role: 'user' | 'assistant', text: string }>>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeSidebarIcon, setActiveSidebarIcon] = useState('home');
  const [newSuggestionText, setNewSuggestionText] = useState('');

  // Startup Config state
  const [startupConfig, setStartupConfig] = useState({
    title: 'BRAND DESIGN CO.',
    heroTitle: 'Build your digital presence with clarity and purpose.',
    heroSubtitle: 'Crafted with premium components, designed for fluid mobile responsive layouts.',
    primaryButton: 'Explore Projects',
    secondaryButton: 'Learn More'
  });

  // 2025 Agentic Workflow AAA Architecture State
  const [workflowPreset, setWorkflowPreset] = useState<'devops' | 'compliance' | 'warehouse'>('devops');
  const [roleName, setRoleName] = useState('Lead Odoo DevOps Orchestrator');
  const [coreObjective, setCoreObjective] = useState('automatically analyze custom school/estate schemas, test container configurations, and perform zero-downtime hot-reloads');
  const [constraints, setConstraints] = useState('Verify Drizzle schema integrity first, do not initiate database migration cycles if target tables are locked.');
  const [workflowTone, setWorkflowTone] = useState('Meticulously technical, expert, and highly objective');
  const [prohibitedBehaviors, setProhibitedBehaviors] = useState('Avoid faking docker container hashes, never bypass postgres table existence checks, prevent raw SQL injection.');

  const [inputTag, setInputTag] = useState('odoo_schema_payload');
  const [outputKeys, setOutputKeys] = useState('status, container_hash, migration_logs, next_steps_itinerary');

  const [reactThought, setReactThought] = useState(true);
  const [selectedTools, setSelectedTools] = useState<string[]>([
    'Docker Engine CLI',
    'PostgreSQL DDL Extractor',
    'Drizzle ORM Compiler'
  ]);
  const [customToolInput, setCustomToolInput] = useState('');

  const [orchestratorEnabled, setOrchestratorEnabled] = useState(true);
  const [subagents, setSubagents] = useState<string[]>([
    'Git Source Code Analyser (Checks module directory)',
    'Database Schema Auditor (Validates target constraints)',
    'VCS Release Sign-Off Agent (Generates production hash)'
  ]);
  const [newSubagentText, setNewSubagentText] = useState('');

  const [memoryDatabase, setMemoryDatabase] = useState('shared_vector_state_cache');
  const [memoryArtifactPrompt, setMemoryArtifactPrompt] = useState('Persist an updated session_summary with module version, active port bindings, and current schema lock flags.');

  const [multimodalType, setMultimodalType] = useState<'none' | 'vision' | 'voice'>('vision');
  const [OCRInstructions, setOCRInstructions] = useState('Scan visual server metrics charts, check for active terminal red alert status, and flag missing dependency warning boxes.');
  const [voiceInstructions, setVoiceInstructions] = useState('Limit response to 3 precise sentences. Utilize audible pauses represented by "..." for operator reflection.');

  const [agentInputPrompt, setAgentInputPrompt] = useState('Deploy Odoo real_estate addon with table registration');
  const [simulationLogs, setSimulationLogs] = useState<Array<{ type: 'system' | 'thought' | 'subagent' | 'memory' | 'multimodal' | 'output', message: string, detail?: string }>>([]);
  const [isSimulatingAgent, setIsSimulatingAgent] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);

  // Dynamic aesthetic changes depending on the Emotion selection
  useEffect(() => {
    if (agentEmotion === 'patient_empathic') {
      setAssistantConfig(prev => ({ ...prev, glowColor: 'teal', greeting: 'Hello Terrance, I am here to help you coordinate.' }));
      setWorkflowTone('Deeply empathetic, encouraging, and patient');
    } else if (agentEmotion === 'ruthless_automation') {
      setAssistantConfig(prev => ({ ...prev, glowColor: 'blue', greeting: 'System online. All automation pipelines verified.' }));
      setWorkflowTone('Completely objective, highly automated, hyper-efficient');
    } else if (agentEmotion === 'hyper_growth_hype') {
      setAssistantConfig(prev => ({ ...prev, glowColor: 'amber', greeting: 'Exciting times ahead, Terrance! Let us win Prime Day!' }));
      setWorkflowTone('Aggressively enthusiastic, growth-oriented, bold');
    } else if (agentEmotion === 'focused_compliance') {
      setAssistantConfig(prev => ({ ...prev, glowColor: 'purple', greeting: 'Security rules compiled. Auditor standby.' }));
      setWorkflowTone('Meticulously detailed, strict auditor, double-entry certified');
    }
  }, [agentEmotion]);

  const handleSimulateVoiceSpeech = () => {
    setIsSynthesizingVoice(true);
    setTimeout(() => setIsSynthesizingVoice(false), 3000);
  };

  const applyPreset = (preset: 'devops' | 'compliance' | 'warehouse') => {
    setWorkflowPreset(preset);
    if (preset === 'devops') {
      setRoleName('Lead Odoo DevOps Orchestrator');
      setCoreObjective('automatically analyze custom school/estate schemas, test container configurations, and perform zero-downtime hot-reloads');
      setConstraints('Verify Drizzle schema integrity first, do not initiate database migration cycles if target tables are locked.');
      setWorkflowTone('Meticulously technical, expert, and highly objective');
      setProhibitedBehaviors('Avoid faking docker container hashes, never bypass postgres table existence checks, prevent raw SQL injection.');
      setInputTag('odoo_schema_payload');
      setOutputKeys('status, container_hash, migration_logs, next_steps_itinerary');
      setReactThought(true);
      setSelectedTools(['Docker Engine CLI', 'PostgreSQL DDL Extractor', 'Drizzle ORM Compiler']);
      setSubagents([
        'Git Source Code Analyser (Checks module directory)',
        'Database Schema Auditor (Validates target constraints)',
        'VCS Release Sign-Off Agent (Generates production hash)'
      ]);
      setMemoryDatabase('shared_vector_state_cache');
      setMemoryArtifactPrompt('Persist an updated session_summary with module version, active port bindings, and current schema lock flags.');
      setMultimodalType('vision');
      setOCRInstructions('Scan visual server metrics charts, check for active terminal red alert status, and flag missing dependency warning boxes.');
      setAgentInputPrompt('Deploy Odoo real_estate addon with table registration');
    } else if (preset === 'compliance') {
      setRoleName('Automated Ledger Compliance Auditor');
      setCoreObjective('reconcile invoice ledger balances, assess tax compliance statuses, and flag suspicious transnational entries');
      setConstraints('Adhere exactly to double-entry ledger bookkeeping, never process records older than fiscal year 2024.');
      setWorkflowTone('Deeply meticulous, objective, and conservative');
      setProhibitedBehaviors('Do not guess tax registration codes, avoid transaction auto-approvals, refrain from grouping unrelated entities.');
      setInputTag('audit_ledger_xml');
      setOutputKeys('compliance_status, detected_discrepancy_score, priority_risks, digital_signature_hash');
      setReactThought(true);
      setSelectedTools(['Ledger Matcher Engine', 'FATCA Risk Index Database', 'Invoice Hash Verifier']);
      setSubagents([
        'Transaction Validator (DoubleEntry ledger checker)',
        'Tax Code Assessor (Validates compliance rules)',
        'Senior Compliance Overseer (Signs off automated report)'
      ]);
      setMemoryDatabase('secure_audit_historical_blocks');
      setMemoryArtifactPrompt('Persist transaction audit hash with matching log sequence metrics to bridge context.');
      setMultimodalType('none');
      setOCRInstructions('');
      setAgentInputPrompt('Audit sequence XML transaction record #AUD-99127');
    } else if (preset === 'warehouse') {
      setRoleName('Multimodal Intelligent Logistics Drone');
      setCoreObjective('inspect structural parcel integrity on shipping racks and announce active dispatch routing orders audibly');
      setConstraints('Minimize radio response noise, prioritize real-time laser rangefinder safety constraints.');
      setWorkflowTone('Extremely alert, immediate, and crisp');
      setProhibitedBehaviors('Do not overestimate carrying metrics, avoid moving parcels without bar-code tags.');
      setInputTag('parcel_cargo_stream');
      setOutputKeys('damaged_status, visual_ocr_label, dynamic_routing, voice_narration_script');
      setReactThought(true);
      setSelectedTools(['Barcode OCR Scanner', 'Laser Telemetry Checker', 'TTS Audio Voice Generator']);
      setSubagents([
        'Cargo Defect Recognizer (Visual scanner agent)',
        'Route Planning Optimization Engine (Solves sorting coordinates)',
        'Loudspeaker Voice Synthesizer (Formats phonetic instructions)'
      ]);
      setMemoryDatabase('warehouse_spatial_mesh_state');
      setMemoryArtifactPrompt('Save current conveyor speed and dynamic rack clearance status.');
      setMultimodalType('voice');
      setOCRInstructions('');
      setAgentInputPrompt('Inspect parcel label under cargo camera #BIN-E3');
    }
  };

  const compileSystemPrompt = () => {
    return `# ==========================================================
# 2025 AI AUTOMATION AGENCY (AAA) SPECIALIZED AGENT BLUEPRINT
# ==========================================================

# LAYER 1: AGENT IDENTITY & ROLE
You are the ${roleName}, a specialized agent within an AI Automation Agency.
Your primary objective is to ${coreObjective}.
You operate under these strict agency constraints:
- ${constraints}
Your professional tone is: ${workflowTone}.
AVOID PROHIBITED BEHAVIORS:
- ${prohibitedBehaviors}

# LAYER 2: INPUT/OUTPUT DESIGN & TUNING
- Structured Input Requirement: You will receive data wrapped inside XML tags. Specifically parse:
  <${inputTag}> [User or System Target Data] </${inputTag}>
- Structured Output Requirement: Deliver your response in valid JSON format.
  {
    ${outputKeys.split(',').map(k => `"${k.trim()}": "string"`).join(',\n    ')}
  }
- Fallback Procedure: On failure, return standard error diagnostic JSON payload.

# LAYER 3: REASONING & TOOL USE (ReAct Loop)
${reactThought ? `- Before selecting or calling any tool, analyze your immediate path in a '<thought>' block. Declare ACTION phase.` : '- Proceed directly to execution phase.'}
Available Tools Authorized for Operation:
${selectedTools.map(t => `- Tool Interface [${t}]: Operational status [GREEN]`).join('\n')}

# LAYER 4: MULTI-AGENT LOGIC & COORDINATION
Virtual Subagents:
${subagents.map((s, idx) => `  [Subagent ID: ${idx + 1}] Role: ${s}`).join('\n')}

# LAYER 5: AGENT MEMORY BRIDGE
- Read and utilize session memories cached inside: "${memoryDatabase}".
- Persistent Saving Task: ${memoryArtifactPrompt}

# LAYER 6: MULTIMODAL CAPABILITY PROTOCOL
${multimodalType === 'vision' ? `- Visual AI Vision Protocol [ENABLED]: OCR Specifics: ${OCRInstructions}` : ''}
${multimodalType === 'voice' ? `- Advanced Voice AI Speech Protocol [ENABLED]: Speech flow guidance: ${voiceInstructions}` : ''}
${multimodalType === 'none' ? `- Multimodal channels [DISABLED].` : ''}
`;
  };

  const handleSimulateAgenticWorkflow = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!agentInputPrompt.trim()) return;

    setIsSimulatingAgent(true);
    setSimulationLogs([]);
    setActiveStepIndex(0);
  };

  // Agentic Workflow simulation ticks
  useEffect(() => {
    if (!isSimulatingAgent) return;

    const timer = setTimeout(() => {
      const step = activeStepIndex;
      let logEntry = null;

      switch(step) {
        case 0:
          logEntry = {
            type: 'system' as const,
            message: `🤖 STEP 1: INITIALIZING SYSTEM IDENTITY & CONTEXT`,
            detail: `Activated Identity: "${roleName}". Tone set to "${workflowTone}". Prohibited filters loaded.`
          };
          break;
        case 1:
          logEntry = {
            type: 'system' as const,
            message: `📥 STEP 2: STRUCTURING USER INPUT WRAPPER`,
            detail: `Parsed input inside xml schema tags: <${inputTag}>${agentInputPrompt}</${inputTag}>`
          };
          break;
        case 2:
          logEntry = {
            type: 'thought' as const,
            message: `🧠 STEP 3: ReAct SYSTEM THOUGHT PREAMBLE`,
            detail: reactThought 
              ? `<thought>\nThe operator requests: "${agentInputPrompt}".\nInitial diagnostics show target environment requires tool verification.\nSelecting "${selectedTools[0] || 'Base Processor'}" to fetch network bindings before coordinating further steps.\nSystem state: GREEN.</thought>`
              : `Proceeding directly to delegation. Skipping thought deliberation block.`
          };
          break;
        case 3:
          logEntry = {
            type: 'subagent' as const,
            message: `🪜 STEP 4: COORDINATING MULTI-AGENT SUBTASK DELETATION`,
            detail: `Lead Orchestrator distributed tasks:\n${subagents.map((s, i) => `  -> Dispatched Subagent ${i+1} [${s.split(' ')[0]}]: "Executing subtask logic..." -> [SUCCESS]`).join('\n')}`
          };
          break;
        case 4:
          logEntry = {
            type: 'multimodal' as const,
            message: `👁️ STEP 5: MULTIMODAL METRICS CHECK`,
            detail: multimodalType === 'vision' 
              ? `[Vision Mode] Scanning inspection map targeting OCR specifics: "${OCRInstructions}". Status: Standard clear patterns verified.`
              : multimodalType === 'voice'
                ? `[Voice Mode] Audio stream loaded. Standard audio speech script formatted. Speech guidance checks passed.`
                : `Multimodal module inactive for current compliance routine. Skipping vision OCR scan.`
          };
          break;
        case 5:
          logEntry = {
            type: 'memory' as const,
            message: `💾 STEP 6: AGENT LONG-TERM MEMORY BROADCAST`,
            detail: `Connected to long-term database "${memoryDatabase}".\nSaved persistent state log: "${memoryArtifactPrompt.slice(0, 75)}..."`
          };
          break;
        case 6:
          const keys = outputKeys.split(',').map(k => k.trim());
          const simulatedJSON: Record<string, string> = { status: "success" };
          keys.forEach(k => {
            if (k !== 'status') {
              if (k.includes('hash')) simulatedJSON[k] = "f08b75c9_11f1_436c_9f1e_9b5114636319_" + Math.floor(Math.random() * 1000);
              else if (k.includes('steps') || k.includes('itinerary')) simulatedJSON[k] = "['Verify migration tables', 'Initialize websocket feedback stream', 'Persist metadata hash']";
              else if (k.includes('logs')) simulatedJSON[k] = "All 23 entity mappings synced perfectly in 4.5ms";
              else simulatedJSON[k] = "Simulated run payload for " + k;
            }
          });
          logEntry = {
            type: 'output' as const,
            message: `🚀 STEP 7: COMPILED STRICT JSON REPORT PAYLOAD`,
            detail: JSON.stringify(simulatedJSON, null, 2)
          };
          break;
        default:
          setIsSimulatingAgent(false);
          setActiveStepIndex(-1);
          return;
      }

      if (logEntry) {
        setSimulationLogs(prev => [...prev, logEntry]);
        setActiveStepIndex(prev => prev + 1);
      }
    }, 1100);

    return () => clearTimeout(timer);
  }, [isSimulatingAgent, activeStepIndex]);

  const addCustomTool = () => {
    if (customToolInput.trim() && !selectedTools.includes(customToolInput.trim())) {
      setSelectedTools(prev => [...prev, customToolInput.trim()]);
      setCustomToolInput('');
    }
  };

  const removeTool = (tool: string) => {
    setSelectedTools(prev => prev.filter(t => t !== tool));
  };

  const addSubagent = () => {
    if (newSubagentText.trim()) {
      setSubagents(prev => [...prev, newSubagentText.trim()]);
      setNewSubagentText('');
    }
  };

  const removeSubagent = (idx: number) => {
    setSubagents(prev => prev.filter((_, i) => i !== idx));
  };

  const executeSimulatedBot = (query: string) => {
    setIsSimulating(true);
    setSimulatedResponses(prev => [...prev, { role: 'user', text: query }]);

    setTimeout(() => {
      let replyTxt = "Sure thing Terrance! Processing your automation schema request now.";
      if (query.toLowerCase().includes('prime')) {
        replyTxt = "I have updated our Odoo catalog and scaled up database replication parameters. Prime Day parameters are verified!";
      } else if (query.toLowerCase().includes('song')) {
        replyTxt = "Playing 'Ambient Cosmic Solitude v4' on Spotify. Enjoy the vibe, Terrance!";
      }
      setSimulatedResponses(prev => [...prev, { role: 'assistant', text: replyTxt }]);
      setIsSimulating(false);
    }, 1500);
  };

  const handleQuerySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userQuery.trim()) return;

    const query = userQuery;
    setUserQuery('');
    executeSimulatedBot(query);
  };

  const addSuggestion = () => {
    if (newSuggestionText.trim() && !assistantConfig.suggestions.includes(newSuggestionText.trim())) {
      setAssistantConfig(prev => ({
        ...prev,
        suggestions: [...prev.suggestions, newSuggestionText.trim()]
      }));
      setNewSuggestionText('');
    }
  };

  const removeSuggestion = (indexToKill: number) => {
    setAssistantConfig(prev => ({
      ...prev,
      suggestions: prev.suggestions.filter((_, i) => i !== indexToKill)
    }));
  };

  const getGeneratedHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AAA Orchestrated Sandbox Specs</title>
  <style>
    body { background-color: #030712; color: #E5E7EB; font-family: sans-serif; padding: 24px; }
    .spec-card { border: 1px solid #1F2937; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto; background: #111827; }
    h1 { color: #06B6D4; font-size: 20px; border-bottom: 2px solid #1F2937; padding-bottom: 10px; }
    .meta-line { font-family: monospace; font-size: 11px; color: #9CA3AF; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="spec-card">
    <h1>${roleName.toUpperCase()}</h1>
    <div class="meta-line">COMPILER_VERSION: 2025.1.0</div>
    <div class="meta-line">TARGET_OBJECTIVE: ${coreObjective}</div>
    <div class="meta-line">CONSTRAINT_SET: ${constraints}</div>
    <div class="meta-line">TACTICAL_TONE: ${workflowTone}</div>
    <div class="meta-line">PROHIBITED: ${prohibitedBehaviors}</div>
  </div>
</body>
</html>`;
  };

  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden bg-[#0B0D10]" id="web-builder-main-canvas">
      
      {/* Top Workspace Bar */}
      <div className="bg-[#0E1217] px-4.5 py-3 border-b border-[#1C222A] flex flex-wrap items-center justify-between gap-3 shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 rounded-lg bg-cyan-600/15 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
            <Layout className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-white text-xs font-bold uppercase tracking-widest font-sans flex items-center gap-1.5">
              <span>Dynamic AAA Web Builder Suite</span>
            </h2>
            <p className="text-[10px] text-gray-500 font-mono">Build Odoo mock structures, coordinate multi-agents, and crawl Youtube developers</p>
          </div>
        </div>

        {/* Modular Workspace Tabs */}
        <div className="flex flex-wrap items-center bg-[#141820]/45 p-1 rounded-md border border-white/5 gap-1">
          <button 
            onClick={() => setActiveTab('editor')}
            className={cn("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all font-mono", activeTab === 'editor' ? "bg-cyan-600 text-white shadow" : "text-gray-400 hover:text-white")}
          >
            ⚡ Live Showcase
          </button>
           <button 
            onClick={() => setActiveTab('logo-maker')}
            className={cn("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all font-mono", activeTab === 'logo-maker' ? "bg-[#a855f7] text-white shadow" : "text-gray-400 hover:text-white")}
          >
            🎬 Remotion Studio (remotion.dev)
          </button>
          <button 
            onClick={() => setActiveTab('docs')}
            className={cn("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all font-mono", activeTab === 'docs' ? "bg-cyan-600 text-white shadow" : "text-gray-400 hover:text-white")}
          >
            📄 Google Docs Hub
          </button>
          <button 
            onClick={() => setActiveTab('agents')}
            className={cn("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all font-mono", activeTab === 'agents' ? "bg-cyan-600 text-white shadow" : "text-gray-400 hover:text-white")}
          >
            🤖 AI Cabinet
          </button>
          <button 
            onClick={() => setActiveTab('firecrawl')}
            className={cn("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all font-mono", activeTab === 'firecrawl' ? "bg-cyan-600 text-white shadow" : "text-gray-400 hover:text-white")}
          >
            🔥 Firecrawl Scraper
          </button>
          <button 
            onClick={() => setActiveTab('docker')}
            className={cn("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all font-mono", activeTab === 'docker' ? "bg-cyan-600 text-white shadow" : "text-gray-400 hover:text-white")}
          >
            🐳 Docker Validator
          </button>
          <button 
            onClick={() => setActiveTab('export')}
            className={cn("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all font-mono", activeTab === 'export' ? "bg-cyan-600 text-white shadow" : "text-gray-400 hover:text-white")}
          >
            💾 Portability Export
          </button>
        </div>

        {/* Global theme */}
        <button 
          onClick={() => setBuilderTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          className={cn("p-1.5 rounded transition border shrink-0", builderTheme === 'dark' ? "bg-[#171D25] border-[#222E3B] text-amber-400 hover:bg-[#222E3B]" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100")}
          title="Switch Theme"
        >
          {builderTheme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Workspace Display Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Branching based on active Tab selection */}
        {activeTab === 'logo-maker' && (
          <LogoMaker />
        )}

        {activeTab === 'docs' && (
          <GoogleDocsHub 
            docs={docs} 
            setDocs={setDocs} 
            onInjectIntoAgent={(txt) => setInjectedText(txt)} 
          />
        )}

        {activeTab === 'agents' && (
          <AiAgentsCabinet 
            agents={agents}
            injectedContextText={injectedText} 
            onClearInjectedContext={() => setInjectedText(undefined)}
            onPromptUpdated={(p) => {
              // Update root Orchestrator instructions state
              if (selectedTools.length > 0) {
                setConstraints(p.slice(0, 150));
              }
            }}
          />
        )}

        {activeTab === 'firecrawl' && (
          <FirecrawlStudio 
            onAddScrapedDoc={(newDoc) => {
              setDocs(prev => [newDoc, ...prev]);
            }} 
          />
        )}

        {activeTab === 'docker' && (
          <DockerValidator />
        )}

        {activeTab === 'export' && (
          <ExportManager 
            docs={docs} 
            agents={agents} 
          />
        )}

        {activeTab === 'editor' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* Left Interactive Playground configuration panel */}
            <div className={cn(
              "w-full lg:w-80 border-r flex flex-col justify-between shrink-0 overflow-y-auto p-4 space-y-4 select-none",
              builderTheme === 'dark' ? "bg-[#0E1217] border-[#1C222A]" : "bg-white border-gray-200"
            )}>
              {/* Template design selector */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8E95A3] mb-2 font-mono">Select Design Engine</h3>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => setActiveTemplate('agentic_workflow')}
                    className={cn(
                      "p-3 rounded-lg border text-left flex items-start gap-3 transition relative overflow-hidden",
                      activeTemplate === 'agentic_workflow' 
                        ? "border-cyan-500 bg-cyan-600/10 text-cyan-400" 
                        : (builderTheme === 'dark' ? "border-[#1C222A] bg-[#14181F] text-gray-400 hover:bg-[#1C222A]" : "border-gray-250 bg-gray-50 text-gray-700 hover:bg-gray-100")
                    )}
                  >
                    <Cpu className="w-5 h-5 shrink-0 mt-0.5 text-cyan-400 animate-pulse" />
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-tight">AAA Agentic Workflows</span>
                      <span className="block text-[9px] text-[#8E95A3] mt-0.5">2025 prompt instruction builder</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTemplate('assistant')}
                    className={cn(
                      "p-3 rounded-lg border text-left flex items-start gap-3 transition relative overflow-hidden",
                      activeTemplate === 'assistant' 
                        ? "border-cyan-500 bg-cyan-600/10 text-cyan-400" 
                        : (builderTheme === 'dark' ? "border-[#1C222A] bg-[#14181F] text-gray-400 hover:bg-[#1C222A]" : "border-gray-250 bg-gray-50 text-gray-700 hover:bg-gray-100")
                    )}
                  >
                    <Music className="w-5 h-5 shrink-0 mt-0.5 text-cyan-400 animate-pulse" />
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-tight">Cosmic Alexa Ambient</span>
                      <span className="block text-[9px] text-[#8E95A3] mt-0.5">Glowing live audio visual mockup</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTemplate('startup')}
                    className={cn(
                      "p-3 rounded-lg border text-left flex items-start gap-3 transition relative overflow-hidden",
                      activeTemplate === 'startup' 
                        ? "border-cyan-500 bg-cyan-600/10 text-cyan-400" 
                        : (builderTheme === 'dark' ? "border-[#1C222A] bg-[#14181F] text-gray-400 hover:bg-[#1C222A]" : "border-gray-250 bg-gray-50 text-gray-700 hover:bg-gray-100")
                    )}
                  >
                    <Globe className="w-5 h-5 shrink-0 mt-0.5 text-cyan-400 animate-pulse" />
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-tight">Startup Minimalist</span>
                      <span className="block text-[9px] text-[#8E95A3] mt-0.5">Fluid responsive card landing</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dynamic device frame and Remotion video engine control inputs */}
              <div className="border-t border-white/5 pt-3.5 space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8E95A3] font-mono">Frame & Remotion rendering controls</h3>
                
                {/* Frame Style Dropdown */}
                <div className="space-y-1">
                  <label className="block text-[9px] text-gray-500 uppercase font-bold font-mono">Device Frame Bezel</label>
                  <select
                    value={deviceFrameStyle}
                    onChange={(e) => setDeviceFrameStyle(e.target.value as any)}
                    className="w-full bg-[#141820] text-xs text-white p-2.5 rounded border border-[#1C222A] focus:outline-none"
                  >
                    <option value="cosmic_bezel">Cosmic Charcoal Smart Screen Bezel</option>
                    <option value="glassmorphic_tablet">Glassmorphic Tablet Glass bezel</option>
                    <option value="brushed_steel">Brushed Steel DevOps Terminal border</option>
                    <option value="minimal_wireframe">Minimal Invisible Canvas frame</option>
                  </select>
                </div>

                {/* Agent Personality Remotion Dropdown */}
                <div className="space-y-1">
                  <label className="block text-[9px] text-gray-500 uppercase font-bold font-mono">Assistant Personality Remotion Profiler</label>
                  <select
                    value={agentEmotion}
                    onChange={(e) => setAgentEmotion(e.target.value as any)}
                    className="w-full bg-[#141820] text-xs text-white p-2.5 rounded border border-[#1C222A] focus:outline-none"
                  >
                    <option value="patient_empathic">Patient, Warm & Empathetic Rendering (Teal glow)</option>
                    <option value="ruthless_automation">Ruthless, Efficient & Fast Rendering (Blue pulse)</option>
                    <option value="hyper_growth_hype">Bold, Loud Growth-Hype Rendering (Gold spark)</option>
                    <option value="focused_compliance">Meticulous Legal-Auditor Rendering (Purple focus)</option>
                  </select>
                </div>

                {/* Voice player animation */}
                <div className="bg-black/30 border border-white/5 p-2.5 rounded-lg flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-2">
                    <Volume2 className={cn("w-4 h-4 text-cyan-400", isSynthesizingVoice && "animate-bounce")} />
                    <span className="text-gray-400">Speech Audio Wave</span>
                  </div>
                  <button
                    onClick={handleSimulateVoiceSpeech}
                    disabled={isSynthesizingVoice}
                    className="bg-cyan-600/20 text-cyan-300 border border-cyan-500/20 px-2 py-1 rounded text-[9.5px] hover:bg-cyan-600/40 uppercase font-bold"
                  >
                    {isSynthesizingVoice ? 'Playing...' : 'Test Voice'}
                  </button>
                </div>
              </div>

              {/* Template subconfig variables edit */}
              {activeTemplate === 'agentic_workflow' && (
                <div className="border-t border-white/5 pt-3.5 space-y-3.5">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8E95A3] font-mono">Agentic parameters</h3>
                  
                  <div className="grid grid-cols-3 bg-black/40 rounded-lg p-0.5 border border-[#1C222A]">
                    {(['devops', 'compliance', 'warehouse'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => applyPreset(p)}
                        className={cn(
                          "py-1 text-[9px] font-mono font-bold uppercase rounded transition",
                          workflowPreset === p ? "bg-cyan-600 text-white" : "text-gray-500 hover:text-white"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] text-gray-500 uppercase font-mono">Agent Identity Title</label>
                    <input
                      type="text"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      className="w-full bg-[#141820] text-xs text-white p-2 rounded border border-[#1C222A] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] text-gray-500 uppercase font-mono">Target Input Tag</label>
                    <input
                      type="text"
                      value={inputTag}
                      onChange={(e) => setInputTag(e.target.value)}
                      className="w-full bg-[#141820] text-xs text-white p-2 rounded border border-[#1C222A] focus:outline-none"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Right Screen Area featuring selected template with custom device framing overlay */}
            <div className="flex-1 overflow-auto p-4 md:p-6 flex items-center justify-center bg-[#07090C] dynamic-bezel-canvas">
              
              {/* Outer visual framing wrapper */}
              <div className={cn(
                "w-full h-[620px] flex flex-col justify-between transition-all duration-300 relative overflow-hidden",
                deviceFrameStyle === 'cosmic_bezel' ? "max-w-4xl rounded-2xl border-[12px] border-[#1C2129] shadow-2xl shadow-black/90" : "",
                deviceFrameStyle === 'glassmorphic_tablet' ? "max-w-[85%] rounded-[2rem] border-[16px] border-white/5 bg-white/5 backdrop-blur-md shadow-2xl" : "",
                deviceFrameStyle === 'brushed_steel' ? "max-w-4xl rounded-lg border-[8px] border-[#31353D] shadow-2xl font-mono text-cyan-200" : "",
                deviceFrameStyle === 'minimal_wireframe' ? "max-w-5xl border-transparent" : "",
                previewMode === 'mobile' ? "max-w-[370px]" : "",
                previewMode === 'tablet' ? "max-w-[640px]" : ""
              )}>
                
                {/* Template Rendering Core inside Frame */}
                {activeTemplate === 'agentic_workflow' ? (
                  <div className="w-full h-full flex flex-col bg-[#07090C] text-gray-300 overflow-hidden font-mono text-xs select-none">
                    
                    {/* Frame inner Header */}
                    <div className="px-4 py-2 border-b border-white/5 bg-black/40 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        <span className="text-[10px] font-bold tracking-wider text-white">REACTIVE BLUEPRINT VM CONTAINER</span>
                      </div>
                      <span className="text-[8px] px-1.5 py-0.5 bg-emerald-900/35 border border-emerald-800/35 text-emerald-400 rounded-full font-bold uppercase tracking-widest">
                        ● Live Mode
                      </span>
                    </div>

                    <div className="flex-grow flex flex-col overflow-hidden p-4 space-y-3 bg-[#080B10]">
                      
                      {/* Top input triggers sim */}
                      <form onSubmit={handleSimulateAgenticWorkflow} className="flex gap-2 shrink-0">
                        <input
                          type="text"
                          required
                          value={agentInputPrompt}
                          onChange={(e) => setAgentInputPrompt(e.target.value)}
                          className="flex-grow bg-black/40 text-xs text-white p-2.5 rounded border border-[#1C222A] focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={isSimulatingAgent}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 px-4 rounded text-xs transition uppercase"
                        >
                          Trigger Simulated Run
                        </button>
                      </form>

                      {/* Continuous logs feed */}
                      <div className="flex-grow overflow-y-auto space-y-2 pr-1 font-mono text-[10.5px]">
                        {simulationLogs.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-gray-600 italic">
                            <Sparkles className="w-6 h-6 text-gray-800 animate-pulse mb-1" />
                            <p>Awaiting simulation run execution ...</p>
                          </div>
                        ) : (
                          simulationLogs.map((log, idx) => {
                            let borderCol = "border-white/5 bg-black/10";
                            let nameTag = "SYSTEM INFO";
                            let txtColor = "text-gray-300";

                            if (log.type === 'thought') {
                              borderCol = "border-amber-400/20 bg-amber-500/5";
                              nameTag = "LAYER 3: ReAct THOUGHT PROMPT SEQUENCE";
                              txtColor = "text-amber-200";
                            } else if (log.type === 'subagent') {
                              borderCol = "border-indigo-500/20 bg-indigo-505/5";
                              nameTag = "LAYER 4: Multi-Agent coordination";
                              txtColor = "text-indigo-300";
                            } else if (log.type === 'memory') {
                              borderCol = "border-emerald-500/25 bg-emerald-500/5";
                              nameTag = "LAYER 5: Long-Term Memory broadcast state saved";
                              txtColor = "text-emerald-300";
                            } else if (log.type === 'output') {
                              borderCol = "border-cyan-500/25 bg-cyan-500/5";
                              nameTag = "LAYER 2: STRICT JSON RESPONSE PAYLOAD";
                              txtColor = "text-cyan-200 font-bold bg-[#030508] p-2.5 rounded border border-white/5";
                            }

                            return (
                              <div key={idx} className={cn("p-2.5 rounded border flex flex-col gap-1 transition-all", borderCol)}>
                                <span className="text-[8px] text-gray-500 font-black tracking-widest uppercase">{nameTag}</span>
                                <span className={txtColor}>{log.message}</span>
                                {log.detail && <p className="text-[9px] text-[#8E95A3] mt-1 pr-4 whitespace-pre-wrap">{log.detail}</p>}
                              </div>
                            );
                          })
                        )}

                        {isSimulatingAgent && (
                          <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                            <span>Orchestrating autonomous coordination cycles...</span>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                ) : activeTemplate === 'assistant' ? (
                  /* Ambient Cosmic Alexa View with glow selection background */
                  <div className={cn(
                    "w-full h-full flex flex-col bg-gradient-to-b relative transition-all duration-300 ease-in",
                    glowClasses[assistantConfig.glowColor]
                  )}>
                    
                    {/* Header bar */}
                    <div className="px-5 py-3.5 border-b border-white/5 bg-black/20 flex justify-between items-center shrink-0">
                      <span className="font-sans font-black tracking-widest text-xs text-white">
                        {assistantConfig.assistantName.toUpperCase()} SERVICES SCREEN (EST. 2025)
                      </span>
                      <div className="flex items-center gap-2">
                        {isSynthesizingVoice && (
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-3 bg-cyan-400 rounded animate-bounce"></span>
                            <span className="w-1.5 h-3 bg-cyan-400 rounded animate-bounce delay-100"></span>
                            <span className="w-1.5 h-3 bg-cyan-400 rounded animate-bounce delay-200"></span>
                          </div>
                        )}
                        <span className="text-[9px] font-mono text-gray-400 font-bold uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded">
                          Glow state: {assistantConfig.glowColor}
                        </span>
                      </div>
                    </div>

                    <div className="flex-grow flex flex-col justify-between p-6">
                      
                      {/* Active Response bubble */}
                      <div className="flex-1 flex flex-col justify-center space-y-4 max-w-xl mx-auto">
                        <div className="text-center font-sans tracking-tight text-white font-medium text-lg leading-relaxed animate-pulse">
                          "{assistantConfig.greeting}"
                        </div>

                        {simulatedResponses.length > 0 && (
                          <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-[10px] bg-black/30 p-3 rounded-lg border border-white/5">
                            {simulatedResponses.map((r, i) => (
                              <div key={i} className={r.role === 'user' ? "text-cyan-400 text-right" : "text-gray-300 text-left"}>
                                <strong>{r.role === 'user' ? 'ME' : 'ALEXA'}:</strong> {r.text}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Input triggers */}
                      <form onSubmit={handleQuerySubmit} className="max-w-xl w-full mx-auto space-y-3.5 shrink-0">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
                            placeholder={assistantConfig.placeholder}
                            className="flex-grow bg-black/40 text-xs text-white p-3 rounded-full border border-white/10 focus:outline-none focus:border-cyan-500 pl-4.5 font-mono"
                          />
                          <button
                            type="submit"
                            className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-full p-3 font-bold transition flex items-center justify-center shrink-0"
                          >
                            <Play className="w-4 h-4 text-white fill-current" />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {assistantConfig.suggestions.map((s, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => executeSimulatedBot(s)}
                              className="text-[9px] font-mono tracking-tight bg-white/5 hover:bg-white/15 text-gray-300 py-1 px-2.5 rounded-full border border-white/5 transition"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </form>

                    </div>

                  </div>
                ) : (
                  /* Startup Landing HTML mock page design */
                  <div className={cn(
                    "w-full h-full flex flex-col justify-between bg-slate-950 font-sans text-white select-none"
                  )}>
                    <div className="px-6 py-4.5 flex items-center justify-between border-b border-white/5 bg-black/25">
                      <div className="flex items-center gap-2">
                        <Logo style={activeLogo} size={22} className="shrink-0 animate-pulse" />
                        <div className="font-mono font-bold tracking-widest text-[11px] text-cyan-400 uppercase">{startupConfig.title}</div>
                      </div>
                      <div className="flex items-center gap-4 text-[9.5px] uppercase font-mono text-gray-500 font-bold">
                        <span className="text-white border-b-2 border-cyan-500 pb-0.5">Focus</span>
                        <span>Showcases</span>
                        <span>Terminal</span>
                      </div>
                    </div>

                    <div className="px-6 py-14 text-center max-w-2xl mx-auto space-y-4">
                      <span className="text-[8px] uppercase tracking-widest font-mono bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-full border border-cyan-500/20">
                        2025 PORTABLE SAAS ENGINE PROTOTYPE
                      </span>
                      <h2 className="text-xl md:text-2xl font-black tracking-tight leading-tight text-white uppercase font-mono">
                        {startupConfig.heroTitle}
                      </h2>
                      <p className="text-[10.5px] text-gray-400 leading-relaxed font-mono">
                        {startupConfig.heroSubtitle}
                      </p>

                      <div className="flex justify-center items-center gap-2 pt-3">
                        <button className="bg-cyan-600 text-white font-mono text-[10px] px-4.5 py-2 rounded font-bold uppercase">
                          {startupConfig.primaryButton}
                        </button>
                        <button className="text-gray-400 font-mono text-[10px] px-4.5 py-2 rounded font-bold border border-white/5 uppercase">
                          {startupConfig.secondaryButton}
                        </button>
                      </div>
                    </div>

                    <div className="px-6 py-3.5 border-t border-white/5 bg-black/25 text-[8.5px] font-mono text-gray-500 flex justify-between uppercase">
                      <span>Durable Cloud Database: postgres_pool_standby</span>
                      <span>100% Mobile Responsive</span>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
