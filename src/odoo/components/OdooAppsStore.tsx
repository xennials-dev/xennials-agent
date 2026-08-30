import React, { useState } from 'react';
import { 
  Layers, 
  Briefcase, 
  DollarSign, 
  Container, 
  GraduationCap, 
  Home, 
  Wand2, 
  FileCheck,
  CheckCircle,
  DownloadCloud,
  Globe,
  ShoppingCart,
  MessageSquare,
  Users,
  Video,
  MonitorPlay,
  Share2,
  Calendar,
  PenTool,
  Cpu,
  Mail,
  PieChart,
  HardDrive
} from 'lucide-react';
import { CustomOdooAddon } from '../types';
import { cn } from '../utils';

// Icon dictionary to map custom database schemas and apps
const ICON_MAP: Record<string, any> = {
  Layers,
  Briefcase,
  DollarSign,
  Container,
  GraduationCap,
  Home,
  Wand2,
  FileCheck,
  CheckCircle,
  DownloadCloud,
  Globe,
  ShoppingCart,
  MessageSquare,
  Users,
  Video,
  MonitorPlay,
  Share2,
  Calendar,
  PenTool,
  Cpu,
  Mail,
  PieChart,
  HardDrive
};

interface OdooAppsStoreProps {
  addons: CustomOdooAddon[];
  installedAddons: string[];
  setInstalledAddons: React.Dispatch<React.SetStateAction<string[]>>;
  setAddons: React.Dispatch<React.SetStateAction<CustomOdooAddon[]>>;
  setActiveAppId: (id: string) => void;
  setCompileLogs: (logs: string[]) => void;
  compileAddon: (addon: CustomOdooAddon) => void;
}

export default function OdooAppsStore({
  addons,
  installedAddons,
  setInstalledAddons,
  setAddons,
  setActiveAppId,
  setCompileLogs,
  compileAddon,
}: OdooAppsStoreProps) {
  const [loadingAddonId, setLoadingAddonId] = useState<string | null>(null);

  // Core built-in apps static info
  const coreApps = [
    {
      id: 'crm',
      name: 'CRM',
      summary: 'Sales pipeline planning, customer lead opportunities tracker',
      author: 'Odoo S.A.',
      icon: Briefcase,
      color: 'bg-orange-500',
    },
    {
      id: 'sales',
      name: 'Sales',
      summary: 'Quotation registry, confirmations, and sales receipts order-lines',
      author: 'Odoo S.A.',
      icon: DollarSign,
      color: 'bg-blue-500',
    },
    {
      id: 'invoices',
      name: 'Finance & Accounting',
      summary: 'Invoicing, Expenses, Ledger management, and register payments',
      author: 'Odoo S.A.',
      icon: FileCheck,
      color: 'bg-emerald-500',
    },
    {
      id: 'inventory',
      name: 'Supply Chain & Inventory',
      summary: 'Warehouse stock tracker, Manufacturing, PLM, and Purchase',
      author: 'Odoo S.A.',
      icon: Container,
      color: 'bg-indigo-500',
    },
    {
      id: 'hr',
      name: 'Human Resources',
      summary: 'Employees, Recruitment, Time Off, Appraisals, Referrals',
      author: 'Odoo S.A.',
      icon: Users,
      color: 'bg-pink-500',
    },
    {
      id: 'marketing',
      name: 'Marketing',
      summary: 'Social, Email, SMS Marketing, Automation, Events, Surveys',
      author: 'Odoo S.A.',
      icon: Share2,
      color: 'bg-rose-500',
    },
    {
      id: 'website_builder',
      name: 'Website Builder & eCommerce',
      summary: 'Powered by remotion-dev & hyperframes for dynamic video assets',
      author: 'Web Integration',
      icon: Globe,
      color: 'bg-cyan-500',
    },
    {
      id: 'productivity',
      name: 'Productivity',
      summary: 'Discuss, IoT, VoIP, Knowledge, WhatsApp, Live Chat integration',
      author: 'Odoo S.A.',
      icon: MessageSquare,
      color: 'bg-violet-500',
    },
    {
      id: 'ai_brand_agent',
      name: 'The Brand Agent (AI)',
      summary: 'Brand Guardian LLM (from teefisher2k20/modelscope & huggingface.co)',
      author: 'AI Operations',
      icon: Cpu,
      color: 'bg-fuchsia-600',
    },
    {
      id: 'bi',
      name: 'Spreadsheet BI & Documents',
      summary: 'Business Intelligence, Sign, and Data Analytics',
      author: 'Odoo S.A.',
      icon: PieChart,
      color: 'bg-teal-500',
    }
  ];

  // Installation loop trigger
  const handleInstallAddon = (addon: CustomOdooAddon) => {
    setLoadingAddonId(addon.id);

    setTimeout(() => {
      compileAddon(addon);
      setLoadingAddonId(null);
    }, 1200);
  };

  const handleUninstallAddon = (addonId: string) => {
    setInstalledAddons((prev) => prev.filter((id) => id !== addonId));
    setAddons((prev) =>
      prev.map((a) => (a.id === addonId ? { ...a, state: 'uninstalled' } : a))
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0D10] overflow-hidden" id="odoo-app-store">
      {/* Header */}
      <div className="bg-[#111419] p-4 border-b border-[#252A33] shrink-0 flex justify-between items-center">
        <div>
          <div className="text-xs text-[#8E95A3] font-semibold tracking-wider uppercase font-mono">System Management</div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wide">Apps Dashboard</h2>
        </div>
        <span className="text-xs bg-[#252A33] border border-[#252A33] text-indigo-400 px-3 py-1 font-bold rounded-lg font-mono shadow-sm">
          Active Suite: {4 + installedAddons.length} applications
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Core ERP Suite Section */}
        <div>
          <span className="text-xs font-bold uppercase text-[#8E95A3] tracking-widest block mb-3 font-mono">
            Core Enterprise Suite
          </span>
          <div className="grid grid-cols-2 gap-4">
            {coreApps.map((app) => {
              const Icon = app.icon;
              return (
                <div
                  key={app.id}
                  className="bg-[#14171D] rounded-xl border border-[#252A33] p-4 shadow-sm flex gap-4 hover:bg-[#1C2129]/30 transition duration-150"
                >
                  <div className={cn("p-3 rounded-lg text-white shrink-0 self-start shadow-md", app.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-white text-sm">{app.name}</h4>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black uppercase">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-[#8E95A3] mt-1.5 leading-relaxed">{app.summary}</p>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#252A33]">
                      <span className="text-[10px] text-[#8E95A3] font-medium font-mono">By {app.author}</span>
                      <button
                        onClick={() => setActiveAppId(app.id)}
                        className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                      >
                        Launch Application
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Community Addons & Custom Python Apps section */}
        <div className="pt-4 border-t border-[#252A33]">
          <span className="text-xs font-bold uppercase text-[#8E95A3] tracking-widest block mb-3 font-mono">
            Local Developer Modules & Addons
          </span>
          {addons.length === 0 ? (
            <div className="bg-[#14171D] rounded-xl border border-[#252A33] p-8 text-center text-xs text-[#8E95A3]">
              No developer addons registered. Visit the "Studio Module Editor" to design one!
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {addons.map((addon) => {
                const isInstalled = installedAddons.includes(addon.id);
                const isLoading = loadingAddonId === addon.id;

                // Dynamically fetch icon based on metadata
                const CustomIcon = ICON_MAP[addon.icon] || Layers;

                return (
                  <div
                    key={addon.id}
                    className="bg-[#14171D] rounded-xl border border-[#252A33] p-4 shadow-sm flex gap-4 hover:bg-[#1C2129]/30 transition duration-150"
                  >
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg shrink-0 self-start">
                      <CustomIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-white text-sm">{addon.shortdesc}</h4>
                          <span className="text-[9px] text-[#8E95A3] font-mono block mt-0.5">module: {addon.name}</span>
                        </div>
                        {isInstalled && (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black uppercase flex items-center gap-1 font-mono">
                            <CheckCircle className="h-2.5 w-2.5" /> Installed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8E95A3] mt-1.5 leading-relaxed font-normal">{addon.description}</p>
                      <div className="flex justify-between items-center mt-3.5 pt-3 border-t border-[#252A33] select-none text-xs">
                        <span className="text-[10px] text-[#8E95A3] font-semibold">By {addon.author}</span>
                        <div className="flex gap-2">
                          {isInstalled ? (
                            <>
                              <button
                                onClick={() => handleUninstallAddon(addon.id)}
                                className="text-[11px] bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-md font-bold transition border border-red-500/20 cursor-pointer"
                              >
                                Uninstall
                              </button>
                              <button
                                onClick={() => setActiveAppId(addon.id)}
                                className="text-[11px] bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1.5 rounded-md font-bold transition cursor-pointer"
                              >
                                Launch
                              </button>
                            </>
                          ) : (
                            <button
                              disabled={isLoading}
                              onClick={() => handleInstallAddon(addon)}
                              className="text-[11px] bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                            >
                              <DownloadCloud className="h-3.5 w-3.5" />
                              <span>{isLoading ? 'Installing...' : 'Install Addon'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
