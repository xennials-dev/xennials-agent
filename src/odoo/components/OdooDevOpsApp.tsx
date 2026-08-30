import React, { useState } from 'react';
import { 
  Server, 
  Terminal, 
  Cpu, 
  Layers, 
  Database, 
  FileCode, 
  CheckCircle, 
  Settings, 
  Sliders, 
  Briefcase, 
  CloudLightning, 
  Check, 
  Copy, 
  Download, 
  ExternalLink, 
  RefreshCw,
  Hammer,
  HelpCircle,
  TrendingUp,
  Boxes,
  Lock,
  Globe,
  Info
} from 'lucide-react';

interface DevOpsConfig {
  repoUrl: string;
  odooVersion: string;
  odooPort: string;
  postgresVersion: string;
  postgresDb: string;
  postgresUser: string;
  postgresPass: string;
  addonsPath: string;
  logLevel: string;
  maxCronThreads: number;
  longpollingPort: string;
}

export default function OdooDevOpsApp() {
  const [activeTab, setActiveTab] = useState<'setup' | 'docker' | 'deployment'>('setup');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  
  // Interactive DevOps config state
  const [config, setConfig] = useState<DevOpsConfig>({
    repoUrl: 'https://github.com/teefisher2k20/odoo.git',
    odooVersion: '17.0',
    odooPort: '8069',
    postgresVersion: '15',
    postgresDb: 'postgres',
    postgresUser: 'odoo',
    postgresPass: 'odoo_secure_db_pass',
    addonsPath: '/usr/lib/python3/dist-packages/odoo/addons,/mnt/extra-addons',
    logLevel: 'info',
    maxCronThreads: 2,
    longpollingPort: '8072'
  });

  const [activeDockerTab, setActiveDockerTab] = useState<'compose' | 'dockerfile' | 'conf'>('compose');
  
  // Checklist state for local setup
  const [checklist, setChecklist] = useState({
    prereq: false,
    clone: false,
    virtualenv: false,
    pip: false,
    postgres: false,
    conf: false,
    run: false
  });

  // Action feedback
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const toggleChecklist = (item: keyof typeof checklist) => {
    setChecklist(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(label);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const handleResetConfig = () => {
    setConfig({
      repoUrl: 'https://github.com/teefisher2k20/odoo.git',
      odooVersion: '17.0',
      odooPort: '8069',
      postgresVersion: '15',
      postgresDb: 'postgres',
      postgresUser: 'odoo',
      postgresPass: 'odoo_secure_db_pass',
      addonsPath: '/usr/lib/python3/dist-packages/odoo/addons,/mnt/extra-addons',
      logLevel: 'info',
      maxCronThreads: 2,
      longpollingPort: '8072'
    });
  };

  const handleSaveActiveConfig = () => {
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  // Dynamic file generators
  const generatedDockerfile = `# Highly Optimized Production-Grade Dockerfile for Odoo ERP
# Source: ${config.repoUrl}
FROM odoo:${config.odooVersion}

USER root

# Install essential system packages and security upgrades
RUN apt-get update && apt-get install -y --no-install-recommends \\
    git \\
    python3-pip \\
    python3-dev \\
    build-essential \\
    libxml2-dev \\
    libxslt1-dev \\
    zlib1g-dev \\
    libsasl2-dev \\
    libldap2-dev \\
    libssl-dev \\
    && rm -rf /var/lib/apt/lists/*

# Copy local requirements file if custom extensions are used
# COPY ./requirements.txt /etc/odoo/requirements.txt
# RUN pip3 install --no-cache-dir -r /etc/odoo/requirements.txt

# Create custom addons directory with correct ownership
RUN mkdir -p /mnt/extra-addons \\
    && chown -R odoo:odoo /mnt/extra-addons

# Set user context back to non-privileged 'odoo' for container run safety
USER odoo

# Expose HTTP port and Longpolling chat ports
EXPOSE ${config.odooPort} ${config.longpollingPort}

ENTRYPOINT ["/entrypoint.sh"]
CMD ["odoo"]`;

  const generatedDockerCompose = `version: '3.8'

services:
  # Relational Database Engine (Odoo requires PostgreSQL)
  db:
    image: postgres:${config.postgresVersion}
    environment:
      - POSTGRES_DB=${config.postgresDb}
      - POSTGRES_USER=${config.postgresUser}
      - POSTGRES_PASSWORD=${config.postgresPass}
      - PGDATA=/var/lib/postgresql/data/pgdata
    volumes:
      - odoo-db-data:/var/lib/postgresql/data/pgdata
    ports:
      - "5432:5432"
    restart: always

  # Odoo ERP Application Server
  web:
    build: .
    depends_on:
      - db
    ports:
      - "${config.odooPort}:${config.odooPort}"
      - "${config.longpollingPort}:${config.longpollingPort}"
    environment:
      - HOST=db
      - USER=${config.postgresUser}
      - PASSWORD=${config.postgresPass}
    volumes:
      - odoo-web-data:/var/lib/odoo
      # Dynamic live coding mount
      - ./custom_addons:/mnt/extra-addons
    command: odoo --addons-path=${config.addonsPath} --http-port=${config.odooPort} --longpolling-port=${config.longpollingPort}
    restart: always

volumes:
  odoo-db-data:
  odoo-web-data:`;

  const generatedOdooConf = `[options]
; This configuration is generated for local testing of ${config.repoUrl.split('/').pop()}
admin_passwd = admin_master_secret_pass
db_host = localhost
db_port = 5432
db_user = ${config.postgresUser}
db_password = ${config.postgresPass}
addons_path = ${config.addonsPath.replace('/mnt', './custom_addons')}
http_port = ${config.odooPort}
log_level = ${config.logLevel}
max_cron_threads = ${config.maxCronThreads}
workers = 2
longpolling_port = ${config.longpollingPort}`;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0D10] text-[#E0E2E6]" id="odoo-devops-root-panel">
      {/* Dynamic Header */}
      <div className="bg-[#111419] p-5 border-b border-[#252A33] shrink-0 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 rounded-lg text-black shadow-md flex items-center justify-center">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest font-mono">Operations Console</div>
            <h1 className="text-base font-bold text-white uppercase tracking-wider">Odoo DevOps & Deploy Suite</h1>
          </div>
        </div>

        {/* Global tab switches */}
        <div className="flex bg-[#0A0C0F] border border-[#252A33] p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'setup' ? 'bg-[#1C2129] text-amber-500 font-bold' : 'text-[#8E95A3] hover:text-[#E0E2E6]'
            }`}
          >
            Local Setup
          </button>
          <button
            onClick={() => setActiveTab('docker')}
            className={`px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'docker' ? 'bg-[#1C2129] text-amber-500 font-bold' : 'text-[#8E95A3] hover:text-[#E0E2E6]'
            }`}
          >
            Docker & Compose
          </button>
          <button
            onClick={() => setActiveTab('deployment')}
            className={`px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'deployment' ? 'bg-[#1C2129] text-amber-500 font-bold' : 'text-[#8E95A3] hover:text-[#E0E2E6]'
            }`}
          >
            Cloud Deploy Strategies
          </button>
        </div>
      </div>

      {/* Main Container Work Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {activeTab === 'setup' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
            {/* Setup Parameters Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-[#252A33] pb-3 text-amber-500">
                  <Sliders className="w-4 h-4" />
                  <h3 className="font-bold text-white text-sm">Interactive Dev Variables</h3>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-gray-400 mb-1 font-semibold uppercase">Odoo Git Repository</label>
                    <input 
                      type="text" 
                      value={config.repoUrl}
                      onChange={(e) => setConfig({ ...config, repoUrl: e.target.value })}
                      className="w-full bg-[#0B0D10] border border-[#252A33] rounded p-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-400 mb-1 font-semibold uppercase">Odoo Version</label>
                      <select 
                        value={config.odooVersion}
                        onChange={(e) => setConfig({ ...config, odooVersion: e.target.value })}
                        className="w-full bg-[#0B0D10] border border-[#252A33] rounded p-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                      >
                        <option value="17.0">17.0 (LTS)</option>
                        <option value="16.0">16.0 (LTS)</option>
                        <option value="15.0">15.0</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1 font-semibold uppercase">PostgreSQL Image</label>
                      <select 
                        value={config.postgresVersion}
                        onChange={(e) => setConfig({ ...config, postgresVersion: e.target.value })}
                        className="w-full bg-[#0B0D10] border border-[#252A33] rounded p-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                      >
                        <option value="15">Postgres 15</option>
                        <option value="14">Postgres 14</option>
                        <option value="16">Postgres 16</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-400 mb-1 font-semibold uppercase">Host HTTP Port</label>
                      <input 
                        type="text" 
                        value={config.odooPort}
                        onChange={(e) => setConfig({ ...config, odooPort: e.target.value })}
                        className="w-full bg-[#0B0D10] border border-[#252A33] rounded p-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1 font-semibold uppercase">Longpolling Port</label>
                      <input 
                        type="text" 
                        value={config.longpollingPort}
                        onChange={(e) => setConfig({ ...config, longpollingPort: e.target.value })}
                        className="w-full bg-[#0B0D10] border border-[#252A33] rounded p-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pb-2 border-b border-[#252A33]">
                    <div>
                      <label className="block text-gray-400 mb-1 font-semibold uppercase">Database User</label>
                      <input 
                        type="text" 
                        value={config.postgresUser}
                        onChange={(e) => setConfig({ ...config, postgresUser: e.target.value })}
                        className="w-full bg-[#0B0D10] border border-[#252A33] rounded p-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1 font-semibold uppercase">Database Password</label>
                      <input 
                        type="password" 
                        value={config.postgresPass}
                        onChange={(e) => setConfig({ ...config, postgresPass: e.target.value })}
                        className="w-full bg-[#0B0D10] border border-[#252A33] rounded p-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 font-semibold uppercase">Container Addons-Path</label>
                    <input 
                      type="text" 
                      value={config.addonsPath}
                      onChange={(e) => setConfig({ ...config, addonsPath: e.target.value })}
                      className="w-full bg-[#0B0D10] border border-[#252A33] rounded p-2.5 text-white focus:outline-none focus:border-amber-500 text-[11px]"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button 
                      onClick={handleResetConfig}
                      className="px-3 py-1.5 rounded bg-transparent hover:bg-[#252A33] text-gray-400 text-xs font-semibold"
                    >
                      Defaults
                    </button>
                    <button 
                      onClick={handleSaveActiveConfig}
                      className="bg-amber-500 hover:bg-amber-600 font-bold px-4 py-2 rounded text-black font-semibold text-xs transition flex items-center gap-1.5"
                    >
                      Apply Parameters
                    </button>
                  </div>
                </div>

                {showSaveSuccess && (
                  <div className="mt-3 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded flex items-center gap-2 text-xs text-emerald-400 font-mono">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Applied to local configurations & templates!</span>
                  </div>
                )}
              </div>

              {/* Dev environment quick metrics widget */}
              <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-5 font-mono text-xs">
                <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2 text-amber-500">
                  <Cpu className="w-4 h-4" />
                  Local Instance specs
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between border-b border-[#252A33]/55 pb-2">
                    <span className="text-gray-450 uppercase">Base Target:</span>
                    <span className="text-white font-bold">Linux (ARM64 & AMD64)</span>
                  </div>
                  <div className="flex justify-between border-b border-[#252A33]/55 pb-2">
                    <span className="text-gray-450">PYTHON BINARY:</span>
                    <span className="text-amber-400 font-bold">Python 3.10 / 3.11</span>
                  </div>
                  <div className="flex justify-between border-b border-[#252A33]/55 pb-2">
                    <span className="text-gray-450">ORADB CONNECTOR:</span>
                    <span className="text-slate-300">psycopg2-binary 2.9+</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-gray-450">ASSETS COMPILER:</span>
                    <span className="text-slate-300">Node JS w/ lessc</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Installation Instruction Deck */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-[#252A33] pb-3">
                  <div className="flex items-center gap-2 text-amber-500">
                    <Terminal className="w-4 h-4" />
                    <h3 className="font-bold text-white text-sm">Part 1: Local Development Setup Guide</h3>
                  </div>
                  <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded uppercase font-mono font-bold">
                    Odoo Local Stack
                  </span>
                </div>

                <p className="text-xs text-[#8E95A3] leading-relaxed mb-4">
                  This guide assumes a Unix-like environment (Debian/Ubuntu/macOS). If you are on Windows, using WSL 2 (Windows Subsystem for Linux) is highly recommended to prevent C-extension compilation errors during dependency installation.
                </p>

                {/* Instruction Checklist and commands */}
                <div className="space-y-4">
                  {/* Prerequisite 1 */}
                  <div className={`p-4 rounded-lg border transition ${checklist.prereq ? 'bg-emerald-500/5 border-emerald-500/25' : 'bg-[#0B0D10] border-[#252A33]'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <button 
                          onClick={() => toggleChecklist('prereq')}
                          className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            checklist.prereq ? 'bg-emerald-550 border-emerald-500' : 'border-gray-500 hover:border-amber-500'
                          }`}
                        >
                          {checklist.prereq && <Check className="w-3 h-3 text-black font-black" />}
                        </button>
                        <div>
                          <p className="text-xs font-bold text-white uppercase font-mono">Prerequisite 1: System Packages & PostgreSQL</p>
                          <p className="text-[11px] text-[#8E95A3] mt-1 font-sans">Install build dependencies, PostgreSQL, and web assets compilers for Debian/Ubuntu.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => copyToClipboard('sudo apt update && sudo apt upgrade -y && sudo apt install -y git python3-pip python3-dev python3-venv postgresql libxml2-dev libxslt1-dev zlib1g-dev libsasl2-dev libldap2-dev build-essential libssl-dev libffi-dev libjpeg-dev libpq-dev liblcms2-dev libwebp-dev libharfbuzz-dev libfribidi-dev libxcb1-dev nodejs npm wkhtmltopdf', 'prereq')}
                        className="text-[10px] text-amber-555 flex items-center gap-1 hover:underline shrink-0 font-mono"
                      >
                        {copiedFile === 'prereq' ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                    <div className="mt-2.5 bg-[#0A0C0F] border border-[#252A33] p-2.5 rounded font-mono text-[10px] text-amber-400 select-all overflow-x-auto whitespace-pre leading-relaxed">
                      <span className="text-gray-500"># Update system packages</span><br />
                      sudo apt update && sudo apt upgrade -y<br /><br />
                      <span className="text-gray-500"># Install build dependencies, PostgreSQL, Git, and web assets compilers</span><br />
                      sudo apt install -y git python3-pip python3-dev python3-venv postgresql \<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;libxml2-dev libxslt1-dev zlib1g-dev libsasl2-dev libldap2-dev \<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;build-essential libssl-dev libffi-dev libjpeg-dev libpq-dev \<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;liblcms2-dev libwebp-dev libharfbuzz-dev libfribidi-dev \<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;libxcb1-dev nodejs npm<br /><br />
                      <span className="text-gray-500"># Install wkhtmltopdf (Required for PDF report rendering)</span><br />
                      sudo apt install -y wkhtmltopdf
                    </div>
                  </div>

                  {/* Step 1: Clone */}
                  <div className={`p-4 rounded-lg border transition ${checklist.clone ? 'bg-emerald-500/5 border-emerald-500/25' : 'bg-[#0B0D10] border-[#252A33]'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <button 
                          onClick={() => toggleChecklist('clone')}
                          className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            checklist.clone ? 'bg-emerald-550 border-emerald-500' : 'border-gray-500 hover:border-amber-500'
                          }`}
                        >
                          {checklist.clone && <Check className="w-3 h-3 text-black font-black" />}
                        </button>
                        <div>
                          <p className="text-xs font-bold text-white uppercase font-mono">Step 1: Clone the Custom Repository</p>
                          <p className="text-[11px] text-[#8E95A3] mt-1 font-sans">Clone your specified repository onto your local workstation.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(`git clone ${config.repoUrl}\ncd odoo`, 'clone')}
                        className="text-[10px] text-amber-555 flex items-center gap-1 hover:underline shrink-0 font-mono"
                      >
                        {copiedFile === 'clone' ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                    <div className="mt-2.5 bg-[#0A0C0F] border border-[#252A33] p-2.5 rounded font-mono text-[11px] text-amber-400 select-all overflow-x-auto whitespace-pre">
                      git clone {config.repoUrl}<br />
                      cd odoo
                    </div>
                  </div>

                  {/* Step 2: Configure Python Virtual Environment */}
                  <div className={`p-4 rounded-lg border transition ${checklist.virtualenv ? 'bg-emerald-500/5 border-emerald-500/25' : 'bg-[#0B0D10] border-[#252A33]'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <button 
                          onClick={() => toggleChecklist('virtualenv')}
                          className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            checklist.virtualenv ? 'bg-emerald-550 border-emerald-500' : 'border-gray-500 hover:border-amber-500'
                          }`}
                        >
                          {checklist.virtualenv && <Check className="w-3 h-3 text-black" />}
                        </button>
                        <div>
                          <p className="text-xs font-bold text-white uppercase font-mono">Step 2: Configure Python Virtual Environment</p>
                          <p className="text-[11px] text-[#8E95A3] mt-1 font-sans">Create an isolated environment to prevent conflicts with system Python libraries.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => copyToClipboard('python3 -m venv odoo-env\nsource odoo-env/bin/activate', 'virtualenv')}
                        className="text-[10px] text-amber-555 flex items-center gap-1 hover:underline shrink-0 font-mono"
                      >
                        {copiedFile === 'virtualenv' ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                    <div className="mt-2.5 bg-[#0A0C0F] border border-[#252A33] p-2.5 rounded font-mono text-[11px] text-zinc-300 select-all overflow-x-auto whitespace-pre">
                      <span className="text-gray-500 font-sans"># Create a virtual environment named 'odoo-env'</span><br />
                      python3 -m venv odoo-env<br /><br />
                      <span className="text-gray-500 font-sans"># Activate the virtual environment</span><br />
                      source odoo-env/bin/activate
                    </div>
                  </div>

                  {/* Step 3: Install Python Dependencies */}
                  <div className={`p-4 rounded-lg border transition ${checklist.pip ? 'bg-emerald-500/5 border-emerald-500/25' : 'bg-[#0B0D10] border-[#252A33]'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <button 
                          onClick={() => toggleChecklist('pip')}
                          className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            checklist.pip ? 'bg-emerald-550 border-emerald-500' : 'border-gray-500 hover:border-amber-500'
                          }`}
                        >
                          {checklist.pip && <Check className="w-3 h-3 text-black" />}
                        </button>
                        <div>
                          <p className="text-xs font-bold text-white uppercase font-mono">Step 3: Install Python Dependencies</p>
                          <p className="text-[11px] text-[#8E95A3] mt-1 font-sans font-sans">Install Odoo dependencies via pip after upgrading package managers.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => copyToClipboard('pip install --upgrade pip wheel setuptools\npip install -r requirements.txt', 'pip')}
                        className="text-[10px] text-amber-555 flex items-center gap-1 hover:underline shrink-0 font-mono"
                      >
                        {copiedFile === 'pip' ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                    <div className="mt-2.5 bg-[#0A0C0F] border border-[#252A33] p-2.5 rounded font-mono text-[11px] text-indigo-300 select-all overflow-x-auto whitespace-pre">
                      <span className="text-gray-500 font-sans"># Upgrade pip to avoid wheel construction failures</span><br />
                      pip install --upgrade pip wheel setuptools<br /><br />
                      <span className="text-gray-500 font-sans"># Install Odoo requirements</span><br />
                      pip install -r requirements.txt
                    </div>
                  </div>

                  {/* Step 4: Configure the PostgreSQL Database */}
                  <div className={`p-4 rounded-lg border transition ${checklist.postgres ? 'bg-emerald-500/5 border-emerald-500/25' : 'bg-[#0B0D10] border-[#252A33]'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <button 
                          onClick={() => toggleChecklist('postgres')}
                          className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            checklist.postgres ? 'bg-emerald-550 border-emerald-500' : 'border-gray-500 hover:border-amber-500'
                          }`}
                        >
                          {checklist.postgres && <Check className="w-3 h-3 text-black" />}
                        </button>
                        <div>
                          <p className="text-xs font-bold text-white uppercase font-mono">Step 4: Configure the PostgreSQL Database</p>
                          <p className="text-[11px] text-[#8E95A3] mt-1 font-sans">Create a database superuser role matching your active local workstation user name.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(`sudo -u postgres createuser -s $USER\npsql -d postgres`, 'postgres')}
                        className="text-[10px] text-amber-555 flex items-center gap-1 hover:underline shrink-0 font-mono"
                      >
                        {copiedFile === 'postgres' ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                    <div className="mt-2.5 bg-[#0A0C0F] border border-[#252A33] p-2.5 rounded font-mono text-[11px] text-amber-400 select-all overflow-x-auto whitespace-pre">
                      <span className="text-gray-500 font-sans"># Create a database superuser matching your system user name</span><br />
                      sudo -u postgres createuser -s $USER<br /><br />
                      <span className="text-gray-500 font-sans"># (Optional) Verify your access to the PostgreSQL terminal (Exit with \\q)</span><br />
                      psql -d postgres
                    </div>
                  </div>

                  {/* Step 5: Configure the odoo.conf File */}
                  <div className={`p-4 rounded-lg border transition ${checklist.conf ? 'bg-emerald-500/5 border-emerald-500/25' : 'bg-[#0B0D10] border-[#252A33]'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <button 
                          onClick={() => toggleChecklist('conf')}
                          className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            checklist.conf ? 'bg-emerald-550 border-emerald-500' : 'border-gray-500 hover:border-amber-500'
                          }`}
                        >
                          {checklist.conf && <Check className="w-3 h-3 text-black" />}
                        </button>
                        <div>
                          <p className="text-xs font-bold text-white uppercase font-mono">Step 5: Configure the odoo.conf File</p>
                          <p className="text-[11px] text-[#8E95A3] mt-1 font-sans">Create odoo.conf in your root directory to instruct the server where resources reside.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(`[options]\ndb_host = 127.0.0.1\ndb_port = 5432\ndb_user = YOUR_SYSTEM_USER_NAME\ndb_password = False\naddons_path = addons,odoo/addons\nhttp_port = ${config.odooPort}\nlog_level = ${config.logLevel}`, 'conf')}
                        className="text-[10px] text-amber-555 flex items-center gap-1 hover:underline shrink-0 font-mono"
                      >
                        {copiedFile === 'conf' ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                    <div className="mt-2.5 bg-[#0A0C0F] border border-[#252A33] p-2.5 rounded font-mono text-[11px] text-indigo-300 select-all overflow-x-auto whitespace-pre">
                      <span className="text-gray-500 font-sans"># Save as "odoo.conf" in the root odoo directory</span><br />
                      [options]<br />
                      ; Database credentials (since your system user is a superuser, keep db_password blank)<br />
                      db_host = 127.0.0.1<br />
                      db_port = 5432<br />
                      db_user = YOUR_SYSTEM_USER_NAME<br />
                      db_password = False<br /><br />
                      ; Addons paths (pointing to default modules and any custom addons folders)<br />
                      addons_path = addons,odoo/addons<br /><br />
                      ; HTTP Port<br />
                      http_port = {config.odooPort}<br /><br />
                      ; Logging<br />
                      log_level = {config.logLevel}
                    </div>
                  </div>

                  {/* Step 6: Launch and Initialize the Server */}
                  <div className={`p-4 rounded-lg border transition ${checklist.run ? 'bg-emerald-500/5 border-emerald-500/25' : 'bg-[#0B0D10] border-[#252A33]'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <button 
                          onClick={() => toggleChecklist('run')}
                          className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            checklist.run ? 'bg-emerald-550 border-emerald-500' : 'border-gray-500 hover:border-amber-500'
                          }`}
                        >
                          {checklist.run && <Check className="w-3 h-3 text-black" />}
                        </button>
                        <div>
                          <p className="text-xs font-bold text-white uppercase font-mono">Step 6: Launch and Initialize the Server</p>
                          <p className="text-[11px] text-[#8E95A3] mt-1 font-sans">Launch the server with base database provisioning, then route to the browser client.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(`python3 odoo-bin -c odoo.conf -d odoo_dev_db -i base\npython3 odoo-bin -c odoo.conf`, 'run')}
                        className="text-[10px] text-amber-555 flex items-center gap-1 hover:underline shrink-0 font-mono"
                      >
                        {copiedFile === 'run' ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                    <div className="mt-2.5 bg-[#0A0C0F] border border-[#252A33] p-2.5 rounded font-mono text-[11px] text-zinc-300 select-all overflow-x-auto whitespace-pre">
                      <span className="text-gray-500 font-sans"># Run and install base modules automatically on first setup:</span><br />
                      python3 odoo-bin -c odoo.conf -d odoo_dev_db -i base<br /><br />
                      <span className="text-gray-500 font-sans"># Once initialized, open browser and navigate to:</span><br />
                      http://localhost:{config.odooPort}  (Username: admin / Password: admin)<br /><br />
                      <span className="text-gray-500 font-sans"># For future sessions, launch the server without installation:</span><br />
                      python3 odoo-bin -c odoo.conf
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        )}

        {activeTab === 'docker' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
            {/* Left Description columns */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3 text-amber-500">
                  <Boxes className="w-4 h-4" />
                  <h3 className="font-bold text-white text-sm">Container Workstation</h3>
                </div>
                <p className="text-xs text-[#8E95A3] leading-relaxed mb-4">
                  These configuration templates allow you to run and customize {config.repoUrl.split('/').pop()} using Docker and Docker Compose. 
                </p>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-[10px] font-mono shrink-0 mt-0.5">1</div>
                    <p className="text-gray-400">Save your values in the Left parameter console (Local Setup tab) to dynamically update the code in real-time.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-[10px] font-mono shrink-0 mt-0.5">2</div>
                    <p className="text-gray-400">Copy or Download individual file setups to your workstation directory.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-[10px] font-mono shrink-0 mt-0.5">3</div>
                    <p className="text-gray-400">Launch standard services with a single command line: <code className="bg-[#0A0C0F] text-amber-500 px-1 font-mono rounded text-[10px]">docker compose up -d --build</code></p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#252A33]/55">
                  <div className="bg-[#0A0C0F] border border-[#252A33] p-3 rounded-lg font-mono text-[11px]">
                    <span className="text-gray-500"># Fast execute terminal:</span><br />
                    <span className="text-amber-400">docker compose up -d --build</span>
                  </div>
                </div>
              </div>

              {/* Security Advisory card */}
              <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-5 text-xs leading-relaxed">
                <span className="font-bold text-white text-xs mb-1.5 flex items-center gap-1.5 text-red-500">
                  <Lock className="w-4 h-4" /> SECURITY COMPLIANCE ADVISORY
                </span>
                <p className="text-gray-400">
                  Avoid using hardcoded generic database passwords (<span className="font-mono text-zinc-300">"odoo_secure_db_pass"</span>) on public registries or corporate cloud deployments. Consider feeding these variables into custom environments or secrets management vaults (like GCP Secret Manager or AWS Systems Manager Parameter Store).
                </p>
              </div>
            </div>

            {/* Right Side Code Viewports */}
            <div className="lg:col-span-8 flex flex-col h-full bg-[#14171D] border border-[#252A33] rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center border-b border-[#252A33] pb-3 mb-4 shrink-0">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveDockerTab('compose')}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-semibold uppercase tracking-wider transition ${
                      activeDockerTab === 'compose' ? 'bg-[#0B0D10] text-[#E0E2E6] border border-[#252A33] font-bold' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    docker-compose.yml
                  </button>
                  <button
                    onClick={() => setActiveDockerTab('dockerfile')}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-semibold uppercase tracking-wider transition ${
                      activeDockerTab === 'dockerfile' ? 'bg-[#0B0D10] text-[#E0E2E6] border border-[#252A33] font-bold' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    Dockerfile
                  </button>
                  <button
                    onClick={() => setActiveDockerTab('conf')}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-semibold uppercase tracking-wider transition ${
                      activeDockerTab === 'conf' ? 'bg-[#0B0D10] text-[#E0E2E6] border border-[#252A33] font-bold' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    odoo.conf
                  </button>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => copyToClipboard(
                      activeDockerTab === 'compose' ? generatedDockerCompose : activeDockerTab === 'dockerfile' ? generatedDockerfile : generatedOdooConf,
                      activeDockerTab
                    )}
                    className="bg-[#1C2129] hover:bg-[#252A33] text-white text-xs px-3 py-1.5 rounded border border-[#252A33] font-semibold transition flex items-center gap-1.5"
                  >
                    {copiedFile === activeDockerTab ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFile === activeDockerTab ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button 
                    onClick={() => {
                      const fileContent = activeDockerTab === 'compose' ? generatedDockerCompose : activeDockerTab === 'dockerfile' ? generatedDockerfile : generatedOdooConf;
                      const fileName = activeDockerTab === 'compose' ? 'docker-compose.yml' : activeDockerTab === 'dockerfile' ? 'Dockerfile' : 'odoo.conf';
                      const element = document.createElement("a");
                      const file = new Blob([fileContent], {type: 'text/plain'});
                      element.href = URL.createObjectURL(file);
                      element.download = fileName;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-black text-xs px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Text Area for code copy */}
              <div className="flex-1 overflow-auto bg-[#0A0C0F] border border-[#252A33] rounded-lg p-4 font-mono text-xs text-slate-350 min-h-[400px] select-text leading-relaxed whitespace-pre scrollbar-thin">
                {activeDockerTab === 'compose' ? generatedDockerCompose : activeDockerTab === 'dockerfile' ? generatedDockerfile : generatedOdooConf}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deployment' && (
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Overview Intro with cloud badges */}
            <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-amber-500">
                <CloudLightning className="w-5 h-5" />
                <h3 className="font-bold text-white text-sm">Part 2: Open Source Deployment Options</h3>
              </div>
              <p className="text-xs text-[#8E95A3] leading-relaxed max-w-4xl">
                When moving from local development to production, choosing a robust, secure, and easily maintainable environment is critical. Below is a structured analysis of popular open-source deployment strategies for Odoo, outlining their execution patterns, pros, and cons.
              </p>
            </div>

            {/* Deep Platform Comparisons Matrix */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              {/* Option 1: Docker & Docker Compose */}
              <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-5 flex flex-col justify-between hover:border-amber-500/25 transition space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded font-mono uppercase">Container orchestration</span>
                    <Boxes className="w-5 h-5 text-amber-500" />
                  </div>
                  <h4 className="font-bold text-white text-base mb-1">1. Docker & Docker Compose (Self-Hosted on VPS)</h4>
                  <p className="text-xs text-gray-400 font-semibold mb-2 uppercase font-mono">How it works:</p>
                  <p className="text-xs text-[#8E95A3] leading-relaxed mb-4">
                    Docker-based environments are the standard for small-to-medium business deployments. They bundle Odoo and PostgreSQL into standardized containers, minimizing host system dependencies. You run an open-source Docker daemon on a clean Linux OS (e.g., Ubuntu). A <code className="bg-[#0B0D10] text-[#E0E2E6] px-1 font-mono text-[10px]">docker-compose.yml</code> orchestrates the Odoo web container, the PostgreSQL database container, and a reverse proxy (like Nginx or Traefik) for SSL certificates.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#252A33]">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2 font-mono">Pros</span>
                    <ul className="space-y-1.5 text-xs text-[#8E95A3]">
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold font-sans">✓</span>
                        <span><strong>Portability:</strong> If you need to move providers, simply copy your configuration directory and database volume.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold font-sans">✓</span>
                        <span><strong>Environment Isolation:</strong> Odoo's Python variables and system libraries do not conflict with host processes.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold font-sans">✓</span>
                        <span><strong>Ecosystem Integration:</strong> Easily integrate open-source utilities like Let's Encrypt for automatic HTTPS renewals.</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-2 font-mono">Cons</span>
                    <ul className="space-y-1.5 text-xs text-[#8E95A3]">
                      <li className="flex items-start gap-1.5">
                        <span className="text-red-500 font-bold font-sans">✗</span>
                        <span>Requires active database backup management (using pg_dump cron jobs or external block-storage backups).</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-red-500 font-bold font-sans">✗</span>
                        <span>Containers add a minor storage and memory overhead compared to bare-metal execution.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Option 2: Coolify or CapRover */}
              <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-5 flex flex-col justify-between hover:border-amber-500/25 transition space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded font-mono uppercase">Open-Source PaaS</span>
                    <CloudLightning className="w-5 h-5 text-amber-500" />
                  </div>
                  <h4 className="font-bold text-white text-base mb-1">2. Coolify or CapRover (Self-Hosted PaaS Alternatives to Heroku)</h4>
                  <p className="text-xs text-gray-400 font-semibold mb-2 uppercase font-mono">How it works:</p>
                  <p className="text-xs text-[#8E95A3] leading-relaxed mb-4">
                    If you prefer a visual web dashboard to deploy, manage, and scale applications, open-source PaaS platforms are excellent choices. You install Coolify or CapRover on your VPS and connect your GitHub repository (<code className="bg-[#0B0D10] text-[#E0E2E6] px-1 font-mono text-[10px]">https://github.com/teefisher2k20/odoo.git</code>). The system detects the codebase, provisions PostgreSQL, sets up environment variables, routes your domain, and issues SSL certificates automatically on every push.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#252A33]">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2 font-mono">Pros</span>
                    <ul className="space-y-1.5 text-xs text-[#8E95A3]">
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold font-sans">✓</span>
                        <span><strong>GitOps Workflow:</strong> Deploying a change is as easy as running a simple <code className="text-emerald-400 font-mono text-[10px]">git push origin main</code>.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold font-sans">✓</span>
                        <span><strong>Intuitive Web UI:</strong> Monitor CPU, memory usage, container state, and system logs without using terminal commands.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold font-sans">✓</span>
                        <span><strong>Database Management:</strong> Includes simple graphical interfaces for taking database snapshots.</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-2 font-mono">Cons</span>
                    <ul className="space-y-1.5 text-xs text-[#8E95A3]">
                      <li className="flex items-start gap-1.5">
                        <span className="text-red-500 font-bold font-sans">✗</span>
                        <span>Requires configuring custom build definitions (such as a custom Dockerfile or Nixpack buildpack) to install Odoo's system-level C dependencies.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-red-500 font-bold font-sans">✗</span>
                        <span>If the PaaS management cluster crashes, debugging the underlying reverse proxy configurations can be complex.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Option 3: Kubernetes with Helm */}
              <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-5 flex flex-col justify-between hover:border-amber-500/25 transition space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded font-mono uppercase">High availability / cluster</span>
                    <Cpu className="w-5 h-5 text-amber-500" />
                  </div>
                  <h4 className="font-bold text-white text-base mb-1">3. Kubernetes with Helm (High Availability / Enterprise Topology)</h4>
                  <p className="text-xs text-gray-400 font-semibold mb-2 uppercase font-mono">How it works:</p>
                  <p className="text-xs text-[#8E95A3] leading-relaxed mb-4">
                    For large-scale, high-traffic installations where zero downtime is required, deploying Odoo to a Kubernetes cluster is the premier enterprise approach. You use open-source Helm charts (e.g., Bitnami Odoo) or Kubernetes Operators to deploy Odoo pods behind a load balancer, backed by a persistent database cluster.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#252A33]">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2 font-mono">Pros</span>
                    <ul className="space-y-1.5 text-xs text-[#8E95A3]">
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold font-sans">✓</span>
                        <span><strong>Horizontal Scaling:</strong> Automatically scales Odoo worker pods up or down to handle high traffic surges.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold font-sans">✓</span>
                        <span><strong>Self-Healing:</strong> If an Odoo container fails or encounters memory leaks, Kubernetes immediately terminates and restarts it without user intervention.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold font-sans">✓</span>
                        <span><strong>High Availability:</strong> Ensures your ERP remains active even if an underlying cloud physical server fails.</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-2 font-mono">Cons</span>
                    <ul className="space-y-1.5 text-xs text-[#8E95A3]">
                      <li className="flex items-start gap-1.5">
                        <span className="text-red-500 font-bold font-sans">✗</span>
                        <span><strong>Massive Complexity:</strong> Requires deep expertise in container orchestration, ingress controllers, persistent volume claims, and networking.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-red-500 font-bold font-sans">✗</span>
                        <span><strong>Cost:</strong> Running a minimal multi-node Kubernetes cluster is significantly more expensive than running a single robust virtual machine.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Option 4: Native Linux Systemd Service */}
              <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-5 flex flex-col justify-between hover:border-amber-500/25 transition space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded font-mono uppercase">Classic bare metal</span>
                    <Server className="w-5 h-5 text-amber-500" />
                  </div>
                  <h4 className="font-bold text-white text-base mb-1">4. Native Linux Systemd Service (Classic Bare-Metal)</h4>
                  <p className="text-xs text-gray-400 font-semibold mb-2 uppercase font-mono">How it works:</p>
                  <p className="text-xs text-[#8E95A3] leading-relaxed mb-4">
                    Directly installing Odoo onto the host OS and running it as a standard system service. You configure a Python virtual environment and PostgreSQL database directly on the host machine. You write a standard systemd service file (<code className="bg-[#0B0D10] text-[#E0E2E6] px-1 font-mono text-[10px]">/etc/systemd/system/odoo.service</code>) to start Odoo on system boot.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#252A33]">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2 font-mono">Pros</span>
                    <ul className="space-y-1.5 text-xs text-[#8E95A3]">
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold font-sans">✓</span>
                        <span><strong>Maximum Performance:</strong> Direct access to host hardware with zero virtualization overhead.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold font-sans">✓</span>
                        <span><strong>Minimal Setup:</strong> No need to learn container runtimes or PaaS architecture.</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-2 font-mono">Cons</span>
                    <ul className="space-y-1.5 text-xs text-[#8E95A3]">
                      <li className="flex items-start gap-1.5">
                        <span className="text-red-500 font-bold font-sans">✗</span>
                        <span><strong>Server Clutter:</strong> The server's OS becomes tied to a specific Python configuration and dependency set, making upgrades or system migrations difficult.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-red-500 font-bold font-sans">✗</span>
                        <span><strong>Security Risks:</strong> If the system service is compromised, attackers have more direct routes to the host OS compared to sandboxed containers.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>

            {/* Stateless architecture diagram and explanation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              <div className="lg:col-span-8 bg-[#14171D] border border-[#252A33] rounded-xl p-5 space-y-4">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-500" />
                  Stateless Scaling Architecture (Recommended Checklist)
                </h4>
                
                <div className="space-y-4 font-mono text-xs">
                  <div className="bg-[#0B0D10] border border-[#252A33] p-4 rounded-lg space-y-2">
                    <div className="text-amber-500 font-bold">1. Shared Storage (The Filestore)</div>
                    <p className="text-[11px] text-[#8E95A3] leading-relaxed font-sans">
                      Odoo places uploaded files, PDFs, images, and session templates inside <code className="bg-[#14171D] text-indigo-400 px-1 font-mono text-[10px]">~/.local/share/Odoo/filestore/</code>. If you scale Odoo horizontally on multiple servers or container pods, users connected to instance A won't have access to documents uploaded on instance B. Mount a distributed network drive like Amazon EFS, Azure Files, or GCP NetApp to path: <code className="bg-[#14171D] text-indigo-400 px-1 font-mono text-[10px]">/mnt/extra-addons</code>. Alternatively, use community modules like Odoo S3 or GCP Cloud Storage integrations.
                    </p>
                  </div>

                  <div className="bg-[#0B0D10] border border-[#252A33] p-4 rounded-lg space-y-2">
                    <div className="text-amber-500 font-bold">2. Longpolling WebSockets (Porfolio Chat & Real-Time Alerts)</div>
                    <p className="text-[11px] text-[#8E95A3] leading-relaxed font-sans">
                      Standard Odoo relies on port <code className="bg-[#14171D] text-[#8E95A3] px-1 font-mono text-[10px]">8069</code> for common transactional connections, but routes real-time chats, notifications, and webhooks on port <code className="bg-[#14171D] text-[#8E95A3] px-1 font-mono text-[10px]">8072</code>. Configure your Reverse Proxy (e.g. Nginx or Traefik) to route paths mapping <code className="bg-[#14171D] text-indigo-400 px-1 font-mono text-[10px]">/websocket</code> directly to port 8072 to prevent disconnections.
                    </p>
                  </div>

                  <div className="bg-[#0B0D10] border border-[#252A33] p-4 rounded-lg space-y-2">
                    <div className="text-amber-500 font-bold">3. Database High-Availability Clustering</div>
                    <p className="text-[11px] text-[#8E95A3] leading-relaxed font-sans">
                      Always use managed relational services with automatic replication (Multi-AZ) and daily snapshot windows. Do not run Postgres inside a standard single container on production clusters without automatic volume storage backup rules configured.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-[#14171D] border border-[#252A33] rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm mb-3">DevOps Useful Resources</h4>
                  <ul className="space-y-4 text-xs font-mono">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <a href="https://www.odoo.com/documentation/17.0/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Official Odoo docs</a>
                    </li>
                    <li className="flex items-center gap-2 border-t border-[#252A33] pt-3.5">
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <a href="https://github.com/odoo/odoo" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Base Odoo GitHub repo</a>
                    </li>
                    <li className="flex items-center gap-2 border-t border-[#252A33] pt-3.5">
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <a href="https://github.com/teefisher2k20/odoo" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">User Odoo Fork repo</a>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 mt-5 border-t border-[#252A33]">
                  <p className="text-[10px] text-[#8E95A3] uppercase tracking-wider font-semibold font-mono mb-2">Configure webhook integrations</p>
                  <p className="text-[11px] text-[#8E95A3] leading-normal font-sans">
                    You can setup CI/CD pipelines in GitHub Actions to build testing images upon pushing to <code className="bg-[#0B0D10] text-[#E0E2E6] px-1 font-mono text-[9px]">teefisher2k20/odoo</code>.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
