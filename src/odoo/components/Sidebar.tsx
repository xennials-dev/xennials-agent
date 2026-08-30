import React from 'react';
import { 
  Building2, 
  Layers, 
  Database, 
  Terminal, 
  Heart, 
  Home, 
  GraduationCap, 
  Briefcase, 
  DollarSign, 
  Container, 
  CheckCircle, 
  ChevronRight,
  CodeXml,
  Users,
  Share2,
  Globe,
  MessageSquare,
  Cpu,
  PieChart,
  BookOpen,
  Server,
  Network
} from 'lucide-react';
import { cn } from '../utils';

interface SidebarProps {
  activeAppId: string;
  setActiveAppId: (id: string) => void;
  developerMode: boolean;
  setDeveloperMode: (val: boolean) => void;
  installedAddons: string[];
}

export default function Sidebar({
  activeAppId,
  setActiveAppId,
  developerMode,
  setDeveloperMode,
  installedAddons,
}: SidebarProps) {
  // Built-in core apps
  const coreApps = [
    { id: 'apps', name: 'App Store', icon: Layers, color: 'text-purple-600 bg-purple-50' },
    { id: 'openai_cookbook', name: 'OpenAI Cookbook', icon: BookOpen, color: 'text-emerald-500 bg-emerald-50' },
    { id: 'odoo_devops', name: 'DevOps & Deploy', icon: Server, color: 'text-amber-500 bg-amber-55 font-bold animate-pulse' },
    { id: 'ai_agency_hq', name: 'AI Agency HQ', icon: Network, color: 'text-[#a855f7] bg-[#a855f7]/10 font-bold border border-purple-500/30' },
    { id: 'crm', name: 'CRM', icon: Briefcase, color: 'text-orange-600 bg-orange-50' },
    { id: 'sales', name: 'Sales', icon: DollarSign, color: 'text-blue-600 bg-blue-50' },
    { id: 'invoices', name: 'Finance', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'inventory', name: 'Inventory', icon: Container, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'hr', name: 'HR', icon: Users, color: 'text-pink-600 bg-pink-50' },
    { id: 'marketing', name: 'Marketing', icon: Share2, color: 'text-rose-600 bg-rose-50' },
    { id: 'website_builder', name: 'Web Builder', icon: Globe, color: 'text-cyan-600 bg-cyan-50' },
    { id: 'productivity', name: 'Productivity', icon: MessageSquare, color: 'text-violet-600 bg-violet-50' },
    { id: 'ai_brand_agent', name: 'Brand Agent', icon: Cpu, color: 'text-fuchsia-600 bg-fuchsia-50' },
    { id: 'bi', name: 'Spreadsheet BI', icon: PieChart, color: 'text-teal-600 bg-teal-50' },
  ];

  // Custom dynamically compiled Odoo applications
  const customModules = [
    { id: 'school_registry', name: 'School', icon: GraduationCap, color: 'text-red-600 bg-red-50' },
    { id: 'estate_management', name: 'Real Estate', icon: Home, color: 'text-teal-600 bg-teal-50' },
  ];

  return (
    <div className="w-64 bg-[#14171D] text-[#E0E2E6] border-r border-[#252A33] flex flex-col h-full select-none" id="odoo-sidebar-root">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#252A33] flex items-center gap-3">
        <div className="p-2 bg-indigo-600 rounded-lg shadow-inner">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
            Odoo <span className="text-[9px] bg-[#252A33] text-indigo-400 px-1.5 py-0.5 font-bold uppercase rounded font-mono">Cloud</span>
          </h1>
          <p className="text-[10px] text-[#8E95A3] font-semibold font-mono">v16.0 Stable Suite</p>
        </div>
      </div>

      {/* Main App Switcher Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#8E95A3] px-3 mb-2 font-mono">Core ERP Suite</p>
        {coreApps.map((app) => {
          const Icon = app.icon;
          const isActive = activeAppId === app.id;
          return (
            <button
              key={app.id}
              onClick={() => setActiveAppId(app.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 text-left border-l-2",
                isActive 
                  ? "bg-indigo-600/10 text-indigo-400 border-indigo-650 font-bold" 
                  : "text-[#8E95A3] border-transparent hover:bg-[#1C2129] hover:text-[#E0E2E6]"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("h-4 w-4", isActive ? "text-indigo-400" : "text-[#8E95A3]")} />
                <span>{app.name}</span>
              </div>
              {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-80" />}
            </button>
          );
        })}

        {/* Hermes AI Suite Navigation */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 px-3 pt-4 mb-2 font-mono flex items-center gap-1.5">
          <span>☿</span> Hermes AI Suite
        </p>
        <a
          href="/chat"
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-xs font-semibold text-zinc-300 hover:bg-[#1C2129] hover:text-white transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm">💬</span>
            <span>Live Chat</span>
          </div>
          <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono">Copilot</span>
        </a>
        <a
          href="/war-room"
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-xs font-semibold text-zinc-300 hover:bg-[#1C2129] hover:text-white transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm">⚔️</span>
            <span>War Room</span>
          </div>
          <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono">Swarm</span>
        </a>
        <a
          href="/skills"
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-xs font-semibold text-zinc-300 hover:bg-[#1C2129] hover:text-white transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm">⚡</span>
            <span>Skill Studio</span>
          </div>
        </a>
        <a
          href="/analytics"
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-xs font-semibold text-zinc-300 hover:bg-[#1C2129] hover:text-white transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm">✨</span>
            <span>3D Memory</span>
          </div>
        </a>
        <a
          href="/evaluations"
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-xs font-semibold text-zinc-300 hover:bg-[#1C2129] hover:text-white transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm">📊</span>
            <span>Evaluations</span>
          </div>
        </a>

        {/* Dynamic Studio Module Editor */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#8E95A3] px-3 pt-4 mb-2 font-mono">Simulated IDE</p>
        <button
          onClick={() => setActiveAppId('studio')}
          className={cn(
            "w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 text-left border-l-2",
            activeAppId === 'studio' 
              ? "bg-indigo-600/10 text-indigo-400 border-indigo-650 font-bold" 
              : "text-[#8E95A3] border-transparent hover:bg-[#1C2129] hover:text-[#E0E2E6]"
          )}
        >
          <div className="flex items-center gap-3">
            <CodeXml className={cn("h-4 w-4", activeAppId === 'studio' ? "text-indigo-400" : "text-[#8E95A3]")} />
            <span>Studio Module Editor</span>
          </div>
          {activeAppId === 'studio' && <ChevronRight className="h-3.5 w-3.5 opacity-80" />}
        </button>

        {/* Custom Dynamic Addons Installed section */}
        {installedAddons.length > 0 && (
          <>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8E95A3] px-3 pt-4 mb-2 font-mono">Installed Addons ({installedAddons.length})</p>
            {customModules
              .filter(m => installedAddons.includes(m.id))
              .map((app) => {
                const Icon = app.icon;
                const isActive = activeAppId === app.id;
                return (
                  <button
                    key={app.id}
                    onClick={() => setActiveAppId(app.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 text-left border-l-2",
                      isActive 
                        ? "bg-indigo-600/10 text-indigo-400 border-indigo-650 font-bold" 
                        : "text-[#8E95A3] border-transparent hover:bg-[#1C2129] hover:text-[#E0E2E6]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("h-4 w-4", isActive ? "text-indigo-400" : "text-[#8E95A3]")} />
                      <span>{app.name}</span>
                    </div>
                  </button>
                );
              })}
          </>
        )}
      </div>

      {/* Developer Mode & PostgreSQL Database explorer */}
      <div className="p-4 border-t border-[#252A33] space-y-2.5 bg-[#111419]">
        <button
          onClick={() => setActiveAppId('database')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-left transition border-l-2",
            activeAppId === 'database' 
              ? "bg-indigo-600/10 text-indigo-400 border-indigo-650" 
              : "text-[#8E95A3] border-transparent hover:bg-[#1C2129] hover:text-[#E0E2E6]"
          )}
        >
          <Database className="h-4 w-4" />
          <span>Database Explorer</span>
        </button>

        <div className="flex items-center justify-between px-3 py-2 bg-[#1C2129] border border-[#252A33] rounded-lg">
          <div className="flex items-center gap-2">
            <Terminal className="h-3 w-3 text-indigo-400" />
            <span className="text-[10px] text-[#8E95A3] font-mono uppercase tracking-wider">Dev Mode</span>
          </div>
          <button
            onClick={() => setDeveloperMode(!developerMode)}
            className={cn(
              "w-8 h-4 rounded-full p-px transition-colors duration-200 focus:outline-none",
              developerMode ? "bg-indigo-600" : "bg-[#252A33]"
            )}
          >
            <div
              className={cn(
                "bg-white w-3 h-3 rounded-full shadow-md transform duration-200",
                developerMode ? "translate-x-4" : "translate-x-0"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
