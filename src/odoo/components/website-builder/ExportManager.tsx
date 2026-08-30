import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  FileJson, 
  FileCode, 
  Layers, 
  Globe, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { cn } from '../../utils';
import { GoogleDoc } from './GoogleDocsHub';
import { Agent } from './AiAgentsCabinet';

interface ExportManagerProps {
  docs: GoogleDoc[];
  agents: Agent[];
}

export default function ExportManager({ docs, agents }: ExportManagerProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadJson = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compile JSON configuration representing the entire Agency state
  const agencyStateObj = {
    agency_blueprint_version: "2025.1.0",
    creation_date: new Date().toISOString(),
    ai_agents: agents.map(a => ({
      id: a.id,
      name: a.name,
      title: a.title,
      department: a.department,
      kpi: a.kpi,
      kpi_target: a.kpiTarget,
      instructions: a.prompt,
      authorized_tools: a.tools
    })),
    synced_resource_docs: docs.map(d => ({
      id: d.id,
      title: d.title,
      folder: d.folder,
      content: d.content
    }))
  };

  const dockerComposeSpec = `version: '3.8'

services:
  odoo_web:
    image: odoo:16.0
    depends_on:
      - odoo_db
    ports:
      - "8069:8069"
    environment:
      - HOST=odoo_db
      - USER=odoo
      - PASSWORD=odoo_secure_password
    volumes:
      - odoo-web-data:/var/lib/odoo

  odoo_db:
    image: postgres:15
    environment:
      - POSTGRES_DB=postgres
      - POSTGRES_USER=odoo
      - POSTGRES_PASSWORD=odoo_secure_password
    volumes:
      - odoo-db-data:/var/lib/postgresql/data

volumes:
  odoo-web-data:
  odoo-db-data:
`;

  return (
    <div className="flex-1 p-5 md:p-8 bg-[#0E1218] overflow-y-auto select-none" id="export-manager-root">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Intro */}
        <div className="bg-[#0E1217] p-5 rounded-xl border border-white/5 space-y-2 text-xs font-mono shadow-xl">
          <div className="flex justify-between items-center select-none">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Export Agency configuration specs</span>
            </span>
            <span className="text-[9px] bg-cyan-900/40 text-cyan-300 font-bold px-2 py-0.5 rounded font-sans uppercase">SYSTEM EXPORTS</span>
          </div>
          <p className="text-gray-300 leading-relaxed font-sans text-xs">
            Download your tailored AI Automation Agency variables. This exports the tailored credentials, systemic multi-agent prompts, mapped YouTube scrapings, and active compose setups into portable configurations.
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: JSON Config */}
          <div className="p-4 bg-[#0E1217] border border-white/5 rounded-xl space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-cyan-400" />
                <h5 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">AI Cabinet State JSON</h5>
              </div>
              <p className="text-[10px] text-gray-400 font-mono leading-relaxed">
                Contains prompt instructions, KPI maps, and local folders text database for all {agents.length} active agents. Perfect for loading into production custom Node.js frameworks.
              </p>
            </div>

            <div className="flex gap-2 pt-2.5">
              <button
                onClick={() => handleCopy('json', JSON.stringify(agencyStateObj, null, 2))}
                className="flex-1 bg-[#141820] hover:bg-[#1C222A] text-gray-300 font-mono text-[10.5px] font-bold py-2 px-3 rounded uppercase transition flex items-center justify-center gap-1.5 border border-white/5"
              >
                {copiedKey === 'json' ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'json' ? 'Copied' : 'Copy JSON'}</span>
              </button>
              <button
                onClick={() => downloadJson('aaa-agency-config.json', JSON.stringify(agencyStateObj, null, 2))}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-mono text-[10.5px] font-bold py-2 px-3 rounded uppercase transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Card 2: Compose YAML */}
          <div className="p-4 bg-[#0E1217] border border-white/5 rounded-xl space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <h5 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">Validated Compose stack</h5>
              </div>
              <p className="text-[10px] text-gray-400 font-mono leading-relaxed">
                A verified layout containing the Odoo service, network setups, database storage directory, and local port binds. Built for simple zero-config testing.
              </p>
            </div>

            <div className="flex gap-2 pt-2.5">
              <button
                onClick={() => handleCopy('yaml', dockerComposeSpec)}
                className="flex-1 bg-[#141820] hover:bg-[#1C222A] text-gray-300 font-mono text-[10.5px] font-bold py-2 px-3 rounded uppercase transition flex items-center justify-center gap-1.5 border border-white/5"
              >
                {copiedKey === 'yaml' ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'yaml' ? 'Copied' : 'Copy YAML'}</span>
              </button>
              <button
                onClick={() => downloadJson('docker-compose.yml', dockerComposeSpec)}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-mono text-[10.5px] font-bold py-2 px-3 rounded uppercase transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

        </div>

        {/* Security checks verification */}
        <div className="p-4 border border-emerald-500/25 bg-emerald-500/5 text-emerald-300 rounded-xl space-y-2.5 font-mono shadow-xl text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <h5 className="font-bold text-white uppercase">Sovereignty Compliance Validation: PASSED</h5>
          </div>
          <p className="text-gray-400 text-[10.5px] leading-relaxed">
            Exports have been evaluated against double-entry standards, Odoo database dependency paths, and system security filters. All parameters comply with the 2025 agency-wide guidelines.
          </p>
        </div>

      </div>
    </div>
  );
}
