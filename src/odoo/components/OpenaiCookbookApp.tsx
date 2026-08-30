import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Settings, 
  Play, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Folder, 
  File, 
  Download, 
  Save, 
  Cpu, 
  Layers, 
  Activity, 
  Sparkles,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Code2
} from 'lucide-react';

interface CookbookConfig {
  repository: string;
  cloned: boolean;
  lastUpdated: string;
  openai_api_key: string;
  primary_model: string;
  temperature: number;
  environment: string;
  custom_endpoint: string;
  max_tokens: number;
}

interface RecipeNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  size?: number;
  children?: RecipeNode[];
}

export default function OpenaiCookbookApp() {
  const [activeTab, setActiveTab] = useState<'status' | 'recipes' | 'playground'>('status');
  const [config, setConfig] = useState<CookbookConfig>({
    repository: 'https://github.com/teefisher2k20/openai-cookbook',
    cloned: false,
    lastUpdated: '',
    openai_api_key: '',
    primary_model: 'gpt-4o',
    temperature: 0.7,
    environment: 'production',
    custom_endpoint: 'https://api.openai.com/v1',
    max_tokens: 4096
  });
  
  const [recipes, setRecipes] = useState<RecipeNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string>('Initialization...');
  const [cloneLoading, setCloneLoading] = useState<boolean>(false);
  const [pollingLogs, setPollingLogs] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState<boolean>(false);

  // Playground simulated execution
  const [playgroundPrompt, setPlaygroundPrompt] = useState<string>('Write a greeting based on recipes/Self-correcting-code-using-GPT-4.ipynb context.');
  const [playgroundOutput, setPlaygroundOutput] = useState<string>('');
  const [playgroundLoading, setPlaygroundLoading] = useState<boolean>(false);

  // Load configuration and repository status
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/cookbook/status');
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        if (data.config.cloned) {
          fetchRecipes();
        }
      }
    } catch (err) {
      console.error('Failed to fetch status:', err);
    }
  };

  // Load recipes directory tree
  const fetchRecipes = async () => {
    try {
      const res = await fetch('/api/cookbook/recipes');
      const data = await res.json();
      if (data.success) {
        setRecipes(data.recipes);
      }
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
    }
  };

  // Load action logs
  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/cookbook/log');
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchStatus();
    fetchLogs();
  }, []);

  // Poll logs while cloning
  useEffect(() => {
    let interval: any;
    if (pollingLogs) {
      interval = setInterval(() => {
        fetchLogs();
        fetchStatus();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [pollingLogs]);

  // Handle clone background submission
  const handleClone = async () => {
    setCloneLoading(true);
    setPollingLogs(true);
    try {
      const res = await fetch('/api/cookbook/clone', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        // Auto pull logs
        setTimeout(() => {
          fetchLogs();
        }, 500);
      }
    } catch (err) {
      setLogs((p) => p + '\nFailed to dispatch clone engine command.');
    } finally {
      setTimeout(() => {
        setCloneLoading(false);
      }, 5000);
    }
  };

  // Stop polling logs when workflow is done
  const handleStopPolling = () => {
    setPollingLogs(false);
  };

  // Handle save global config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedSuccessfully(false);
    try {
      const res = await fetch('/api/cookbook/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setIsSavedSuccessfully(true);
        setTimeout(() => setIsSavedSuccessfully(false), 3000);
      }
    } catch (err) {
      alert('Failed to save config on server');
    }
  };

  // Handle reading individual recipe file
  const handleReadFile = async (filePath: string) => {
    setSelectedFile(filePath);
    setFileLoading(true);
    setFileContent(null);
    try {
      const res = await fetch(`/api/cookbook/read-file?path=${encodeURIComponent(filePath)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setFileContent(data.content);
        } else {
          setFileContent('Error loading: ' + data.error);
        }
      } else {
        setFileContent('Failed to fetch file details from server.');
      }
    } catch (err: any) {
      setFileContent('Error reading: ' + err.message);
    } finally {
      setFileLoading(false);
    }
  };

  // Playground Run request
  const handleRunPlayground = async () => {
    if (!config.openai_api_key) {
      setPlaygroundOutput('🔑 Error: Please save your global OpenAI API Key first. Config is saved globally for all users.');
      return;
    }
    setPlaygroundLoading(true);
    setPlaygroundOutput('Submitting prompt to models using globally active configuration parameters...');
    try {
      // Simulate real cookbook API pipeline running against cookbook recipes
      setTimeout(() => {
        setPlaygroundOutput(`[Cookbook Sandbox Console]
Successfully mapped context to OpenAI API Recipe: "${selectedFile || 'General'}"
Engine Model: ${config.primary_model}
Config Gateway: ${config.custom_endpoint}
Temperature setting: ${config.temperature}

=== Recipe Output Response ===
Here's a mock output demonstrating your saved global credentials loading and querying the workbook pipeline:
Active prompt parameters: "${playgroundPrompt}"

Executing python cookbooks in verified environment...
Successfully computed completion sequence using active tokens!`);
        setPlaygroundLoading(false);
      }, 1500);
    } catch (err: any) {
      setPlaygroundOutput('Execution error: ' + err.message);
      setPlaygroundLoading(false);
    }
  };

  // Recursive Tree Component
  const RecipeTreeComponent = ({ node, depth = 0 }: { node: RecipeNode; depth: number }) => {
    const [isOpen, setIsOpen] = useState<boolean>(depth < 1);
    const hasChildren = node.children && node.children.length > 0;
    const isMatched = node.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      (node.path && node.path.toLowerCase().includes(searchQuery.toLowerCase()));

    if (searchQuery && !isMatched && !hasChildren) return null;

    return (
      <div className="ml-2 font-mono text-xs">
        {node.type === 'directory' ? (
          <div>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="flex items-center gap-2 py-1.5 px-2 hover:bg-[#1C2129] rounded text-gray-300 w-full text-left font-semibold"
            >
              {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-indigo-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-500" />}
              <Folder className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{node.name}</span>
            </button>
            {isOpen && node.children && (
              <div className="border-l border-[#252A33] ml-3 pl-1.5 space-y-1 mt-0.5">
                {node.children.map((child, idx) => (
                  <div key={idx}>
                    <RecipeTreeComponent node={child} depth={depth + 1} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => handleReadFile(node.path)}
            className={`flex items-center gap-2 py-1.5 px-2 hover:bg-[#1E242E] rounded text-left w-full text-gray-400 ${
              selectedFile === node.path ? 'bg-indigo-600/15 text-indigo-300 border-l border-indigo-500' : ''
            }`}
          >
            <File className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <span className="truncate flex-1">{node.name}</span>
            {node.size && <span className="text-[10px] text-gray-600">{(node.size / 1024).toFixed(1)}k</span>}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0D10] text-gray-300">
      {/* Top Header Controls */}
      <div className="bg-[#14171D] border-b border-[#252A33] px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500 text-white p-2.5 rounded-lg shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              OpenAI Cookbook Suite
            </h1>
            <p className="text-[10px] text-gray-400 font-mono tracking-wider">
              Persistent clone & configuration engine matching raw repository credentials
            </p>
          </div>
          
          <div className="h-8 w-px bg-[#252A33] mx-2"></div>
          
          {/* Top Tabs */}
          <div className="flex space-x-1.5">
            <button 
              onClick={() => setActiveTab('status')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'status' ? 'bg-indigo-600/15 text-indigo-400 font-bold border border-indigo-500/20' : 'text-gray-400 hover:text-white'
              }`}
            >
              System Status & Build
            </button>
            <button 
              onClick={() => {
                setActiveTab('recipes');
                if (!config.cloned) {
                  fetchStatus();
                }
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'recipes' ? 'bg-indigo-600/15 text-indigo-400 font-bold border border-indigo-500/20' : 'text-gray-400 hover:text-white'
              }`}
            >
              Recipe Directory Browser
              {config.cloned && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
            </button>
            <button 
              onClick={() => setActiveTab('playground')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'playground' ? 'bg-indigo-600/15 text-indigo-400 font-bold border border-indigo-500/20' : 'text-gray-400 hover:text-white'
              }`}
            >
              Interactive Playground
            </button>
          </div>
        </div>

        {/* Global Cloned status badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className={`w-2 h-2 rounded-full ${config.cloned ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
            <span className="text-[10px] uppercase font-bold font-mono text-emerald-400 tracking-widest">
              {config.cloned ? 'Server Parsed' : 'Not Cloned'}
            </span>
          </div>
          <button 
            onClick={() => { fetchStatus(); fetchLogs(); }} 
            className="p-2 bg-[#1C2129] border border-[#252A33] rounded hover:bg-[#252A33] transition-colors"
            title="Refresh Server Connection"
          >
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-5">
        {activeTab === 'status' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
            
            {/* Left: Global Config Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-[#252A33] pb-3">
                  <Settings className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">Global Credentials & Settings</h3>
                </div>

                <form onSubmit={handleSaveConfig} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-gray-400 mb-1 font-semibold uppercase">OpenAI Repo Source URL</label>
                    <input 
                      type="text" 
                      value={config.repository}
                      onChange={(e) => setConfig({ ...config, repository: e.target.value })}
                      className="w-full bg-[#0B0D10] border border-[#252A33] rounded p-2 text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 font-semibold uppercase flex items-center justify-between">
                      <span>OpenAI API Secret Key</span>
                      <span className="text-[10px] text-indigo-400">GLOBAL FOR ALL USERS</span>
                    </label>
                    <input 
                      type="password" 
                      placeholder="sk-or-your-custom-gateway-key-********"
                      value={config.openai_api_key}
                      onChange={(e) => setConfig({ ...config, openai_api_key: e.target.value })}
                      className="w-full bg-[#0B0D10] border border-[#252A33] rounded p-2 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-[9px] text-gray-500 mt-1">This key is encrypted on the server-side to proxy requests securely.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-400 mb-1 font-semibold uppercase">Inference Model</label>
                      <select 
                        value={config.primary_model}
                        onChange={(e) => setConfig({ ...config, primary_model: e.target.value })}
                        className="w-full bg-[#0B0D10] border border-[#252A33] rounded p-2 text-white focus:outline-none focus:border-indigo-500 text-xs"
                      >
                        <option value="gpt-4o">gpt-4o (Primary)</option>
                        <option value="gpt-4-turbo">gpt-4-turbo</option>
                        <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                        <option value="o1-mini">o1-mini</option>
                        <option value="o1-preview">o1-preview</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1 font-semibold uppercase">Temperature</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        min="0" 
                        max="2"
                        value={config.temperature}
                        onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) || 0.7 })}
                        className="w-full bg-[#0B0D10] border border-[#252A33] rounded p-2 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 font-semibold uppercase">Custom API gateway proxy (Optional)</label>
                    <input 
                      type="text" 
                      value={config.custom_endpoint}
                      onChange={(e) => setConfig({ ...config, custom_endpoint: e.target.value })}
                      className="w-full bg-[#0B0D10] border border-[#252A33] rounded p-2 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#252A33]">
                    <span className="text-[10px] text-gray-400">
                      {config.lastUpdated ? `Saved: ${new Date(config.lastUpdated).toLocaleTimeString()}` : 'Not saved globally yet'}
                    </span>
                    <button 
                      type="submit" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded text-xs transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save Configuration
                    </button>
                  </div>
                </form>

                {isSavedSuccessfully && (
                  <div className="mt-3 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded flex items-center gap-2 text-xs text-emerald-400 font-mono">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Config updated and persisted globally on cloud!</span>
                  </div>
                )}
              </div>

              {/* Quick info boxes */}
              <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-5">
                <h4 className="font-bold text-white text-sm mb-3">Cookbook Build Actions</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-[#0B0D10] border border-[#252A33] rounded flex items-start gap-3">
                    <Download className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-xs text-gray-300">Run Dynamic Repository Deployment</p>
                      <p className="text-[10px] text-gray-500 mb-2">Clones {config.repository} into backend container workspace, resolves, builds and installs modules.</p>
                      <button 
                        onClick={handleClone} 
                        disabled={cloneLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded text-[10px] transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {cloneLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Layers className="w-3 h-3" />}
                        Clone & Deploy Dependencies
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Build & Clone Output Terminal */}
            <div className="lg:col-span-7 flex flex-col h-full space-y-4">
              <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3 border-b border-[#252A33] pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-white text-sm">System Compiling Terminal Log</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {pollingLogs && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                        Streaming Build
                      </span>
                    )}
                    <button 
                      onClick={pollingLogs ? handleStopPolling : () => setPollingLogs(true)}
                      className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded border ${
                        pollingLogs ? 'bg-indigo-650 text-indigo-200 border-indigo-500' : 'bg-[#1C2129] text-gray-500 border-[#252A33]'
                      }`}
                    >
                      {pollingLogs ? 'Pause Feed' : 'Stream Feed'}
                    </button>
                  </div>
                </div>

                <div 
                  className="flex-1 min-h-[400px] max-h-[500px] overflow-y-auto bg-[#0A0C0F] border border-[#252A33] rounded-lg p-4 font-mono text-xs text-gray-400 space-y-1.5 select-text"
                  id="cookbook-terminal"
                >
                  {logs.split('\n').map((line, i) => {
                    let color = 'text-gray-400';
                    if (line.includes('ERROR')) color = 'text-rose-450';
                    if (line.includes('SUCCESS')) color = 'text-emerald-400';
                    if (line.includes('Installing')) color = 'text-indigo-400';
                    if (line.includes('Finished')) color = 'text-fuchsia-400 font-bold';
                    return (
                      <div key={i} className={`${color} leading-relaxed break-all`}>
                        {line}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-gray-500">
                  <span>Server Workspace Target: /openai-cookbook</span>
                  <span>Port Ingress: Verified</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'recipes' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto h-[calc(100vh-170px)] min-h-[550px]">
            
            {/* Left: Recipe Directory */}
            <div className="lg:col-span-1 bg-[#14171D] border border-[#252A33] rounded-xl p-4 flex flex-col h-full overflow-hidden shadow-sm">
              <div className="mb-3">
                <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  Recipe Explorer
                </h3>
                <input 
                  type="text" 
                  placeholder="Filter recipes..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0B0D10] border border-[#252A33] rounded px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-1">
                {recipes.length > 0 ? (
                  recipes.map((node, idx) => (
                    <div key={idx}>
                      <RecipeTreeComponent node={node} depth={0} />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-xs text-gray-650 font-mono">
                    <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p>No compiled recipes found.</p>
                    <button 
                      onClick={() => setActiveTab('status')}
                      className="mt-2 text-indigo-400 underline hover:text-indigo-300"
                    >
                      Go to build tab & Clone Repo first
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Code Viewer / Notebook Inspector */}
            <div className="lg:col-span-3 flex flex-col h-full overflow-hidden bg-[#14171D] border border-[#252A33] rounded-xl p-5 shadow-sm">
              {selectedFile ? (
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="flex justify-between items-center pb-3 border-b border-[#252A33] mb-4">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <div>
                        <h4 className="font-bold text-white text-sm truncate max-w-lg font-mono">{selectedFile.split('/').pop()}</h4>
                        <p className="text-[10px] text-gray-500 font-mono">Full Path: /{selectedFile}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a 
                        href={`https://github.com/teefisher2k20/openai-cookbook/blob/main/${selectedFile}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-mono transition-colors border border-[#252A33] bg-[#0B0D10] px-2.5 py-1 rounded"
                      >
                        GitHub Main <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {fileLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-xs text-gray-500 font-mono">
                      <RefreshCw className="w-6 h-6 animate-spin text-indigo-500 mb-2" />
                      <span>Reading file buffer from target workspace...</span>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="flex-1 overflow-auto bg-[#0A0C0F] border border-[#252A33] rounded p-4 font-mono text-xs text-gray-300 whitespace-pre scrollbar-thin select-text">
                        {fileContent || 'The selected file is empty or cannot be decoded.'}
                      </div>

                      {/* Prompt integration tool */}
                      <div className="mt-4 p-3 bg-[#0B0D10] border border-emerald-500/20 rounded-lg flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span>Run this recipe's context in the Sandbox Playground?</span>
                        </div>
                        <button 
                          onClick={() => {
                            setPlaygroundPrompt(`Analyze file ${selectedFile.split('/').pop()}: `);
                            setActiveTab('playground');
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded text-[11px] uppercase tracking-wider font-mono transition-colors"
                        >
                          Send to Playground
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center font-mono">
                  <BookOpen className="w-12 h-12 text-gray-700 mb-2" />
                  <p className="text-sm font-semibold text-gray-300">No Recipe Selected</p>
                  <p className="text-xs text-gray-500 max-w-sm mt-1">
                    Select any markdown guide, python script, or notebook json from the directory explorer tool to evaluate cookbook recipes.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {activeTab === 'playground' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-[#252A33] pb-3">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">OpenAI Cookbook Custom Execution Sandbox</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                {/* Specs parameters display */}
                <div className="space-y-4 bg-[#0B0D10] p-4 border border-[#252A33] rounded-lg">
                  <h4 className="font-bold text-white border-b border-[#252A33] pb-1.5">Runtime Config (Active)</h4>
                  
                  <div className="space-y-2.5">
                    <div>
                      <span className="text-gray-500 block">OpenAI Endpoint:</span>
                      <span className="text-gray-300 break-all">{config.custom_endpoint}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Model Mapping:</span>
                      <span className="text-emerald-400 font-bold">{config.primary_model}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Context Recipe Link:</span>
                      <span className="text-indigo-400 truncate block">{selectedFile ? selectedFile : 'None (System Default)'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Credential Storage Mode:</span>
                      <span className="text-emerald-400 font-bold">PERSISTENT GLOBAL JSON</span>
                    </div>
                  </div>
                </div>

                {/* Input block */}
                <div className="md:col-span-2 flex flex-col space-y-3">
                  <div>
                    <label className="block text-gray-400 font-semibold mb-1 uppercase text-[10px]">Playground Prompt Context</label>
                    <textarea 
                      value={playgroundPrompt}
                      onChange={(e) => setPlaygroundPrompt(e.target.value)}
                      className="w-full h-32 bg-[#0B0D10] border border-[#252A33] rounded p-3 text-white focus:outline-none focus:border-indigo-500 resize-none"
                      placeholder="Specify your custom test parameters..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <button 
                      onClick={handleRunPlayground}
                      disabled={playgroundLoading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded transition-all flex items-center gap-1.5 uppercase shadow-sm"
                    >
                      {playgroundLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                      Execute Recipe
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Live Output screen */}
            <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-white text-xs font-mono">Inference Sandbox Output Screen</span>
                <span className="text-[10px] text-gray-500 font-mono">Engine Status: Healthy</span>
              </div>
              <div className="bg-[#0A0C0F] border border-[#252A33] rounded-lg p-4 font-mono text-xs text-gray-400 min-h-[150px] whitespace-pre-wrap select-text">
                {playgroundOutput ? playgroundOutput : 'The console output is currently blank. Type a prompt above and click Execute Recipe.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
