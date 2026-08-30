import React, { useState } from 'react';
import { Cpu, Terminal, Shield, Zap, Sparkles, Sliders, Database, Layers, Eye } from 'lucide-react';
import { cn } from '../utils';

export default function AiBrandAgentApp() {
  const [activeTab, setActiveTab] = useState<'console' | 'guardrails' | 'assets' | 'models'>('console');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0D10] text-gray-300">
      <div className="bg-[#14171D] border-b border-[#252A33] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-fuchsia-600 text-white p-2 rounded-lg shadow-sm">
            <Cpu className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-white">Brand Agent</h1>
          
          <div className="h-6 w-px bg-gray-700 mx-2"></div>
          
          <div className="flex space-x-1">
            <button 
              onClick={() => setActiveTab('console')}
              className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-colors", activeTab === 'console' ? "bg-fuchsia-500/10 text-fuchsia-400" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800")}
            >
              Live Console
            </button>
            <button 
              onClick={() => setActiveTab('models')}
              className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-colors", activeTab === 'models' ? "bg-fuchsia-500/10 text-fuchsia-400" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800")}
            >
              Open Source Models
            </button>
            <button 
              onClick={() => setActiveTab('guardrails')}
              className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-colors", activeTab === 'guardrails' ? "bg-fuchsia-500/10 text-fuchsia-400" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800")}
            >
              Guardrails
            </button>
            <button 
              onClick={() => setActiveTab('assets')}
              className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-colors", activeTab === 'assets' ? "bg-fuchsia-500/10 text-fuchsia-400" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800")}
            >
              Asset Library
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">Agent Active</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 content-container">
        {activeTab === 'console' && (
          <div className="flex gap-6 h-full max-w-7xl mx-auto">
            {/* Live Data Feed */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4 border-b border-[#252A33] pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-fuchsia-400" />
                    <h3 className="font-bold text-white text-sm">Agent Data Stream</h3>
                  </div>
                  <button className="text-xs font-mono text-gray-500 hover:text-fuchsia-400 transition-colors">Clear</button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs">
                  <div className="text-gray-500">[10:45:01] <span className="text-emerald-400 font-bold">INFO</span> Connected to huggingface.co endpoint securely.</div>
                  <div className="text-gray-500">[10:45:15] <span className="text-blue-400 font-bold">EVENT</span> Received content draft from Marketing Module.</div>
                  <div className="text-gray-500">[10:45:16] <span className="text-fuchsia-400 font-bold">PROCESS</span> Running tone analysis (Strict Professional).</div>
                  <div className="text-gray-500">[10:45:18] <span className="text-emerald-400 font-bold">SUCCESS</span> Content approved. No deviations detected.</div>
                  <div className="text-gray-500">[10:46:05] <span className="text-blue-400 font-bold">EVENT</span> User requested new website banner variations.</div>
                  <div className="text-gray-500">[10:46:06] <span className="text-fuchsia-400 font-bold">PROCESS</span> Utilizing Brand Colors: #0F172A, #10B981, #F43F5E.</div>
                  <div className="text-gray-500">[10:46:12] <span className="text-emerald-400 font-bold">SUCCESS</span> 4 variations generated and saved to Asset Library.</div>
                  <div className="text-gray-500">[10:48:33] <span className="text-amber-400 font-bold">WARNING</span> Detected colloquialism "gonna" in draft from Sales Team.</div>
                  <div className="text-gray-500">[10:48:33] <span className="text-fuchsia-400 font-bold">ACTION</span> Auto-correcting "gonna" -&gt; "going to".</div>
                </div>
              </div>
              
              <div className="h-48 bg-[#14171D] border border-[#252A33] rounded-xl p-4 flex flex-col">
                <h3 className="font-bold text-white text-sm mb-3">Model Input</h3>
                <textarea 
                  className="w-full flex-1 bg-[#0A0C0F] border border-[#252A33] rounded-lg p-3 text-sm text-gray-300 font-mono focus:outline-none focus:border-fuchsia-500 resize-none mb-3"
                  placeholder="Ask the brand agent to generate copy, verify assets, or run a compliance check..."
                />
                <div className="flex justify-end">
                  <button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Run Request
                  </button>
                </div>
              </div>
            </div>

            {/* Neural Setup (Visual representation) */}
            <div className="w-80 flex flex-col gap-4">
              <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-4">
                <h3 className="font-bold text-white text-sm mb-4 border-b border-[#252A33] pb-2">Active Configuration</h3>
                
                <div className="space-y-4">
                   <div>
                     <div className="flex justify-between text-xs mb-1">
                       <span className="text-gray-400">Primary Inference Model</span>
                       <span className="text-emerald-400 font-mono">ONLINE</span>
                     </div>
                     <div className="bg-[#0A0C0F] border border-[#252A33] p-2 rounded text-xs font-mono text-gray-300">
                       meta-llama/Llama-3-70b-instruct
                     </div>
                   </div>
                   
                   <div>
                     <div className="flex justify-between text-xs mb-1">
                       <span className="text-gray-400">Vector Database (RAG)</span>
                       <span className="text-emerald-400 font-mono">SYNCED</span>
                     </div>
                     <div className="bg-[#0A0C0F] border border-[#252A33] p-2 rounded text-xs font-mono text-gray-300 flex items-center justify-between">
                       <span>brand_guidelines_v4</span>
                       <Database className="w-3 h-3 text-gray-500" />
                     </div>
                   </div>

                   <div className="pt-2 border-t border-[#252A33]">
                     <div className="flex items-center justify-between text-sm">
                       <span className="text-gray-400">Strict Compliance</span>
                       <div className="w-8 h-4 bg-fuchsia-600 rounded-full relative shadow-[0_0_10px_rgba(192,38,211,0.5)] cursor-pointer">
                         <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                       </div>
                     </div>
                   </div>
                </div>
              </div>

              <div className="bg-[#14171D] border border-fuchsia-500/30 rounded-xl p-4 shadow-[0_0_15px_rgba(192,38,211,0.1)]">
                <div className="flex gap-3 mb-3">
                  <div className="bg-fuchsia-500/20 p-2 rounded overflow-hidden">
                     <Shield className="w-5 h-5 text-fuchsia-400 relative z-10" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Brand Shield</h3>
                    <p className="text-xs text-gray-400">All outbound communication is intercepted and verified by this agent.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                   <div className="bg-[#0A0C0F] border border-[#252A33] p-2 rounded text-center">
                     <div className="text-fuchsia-400 font-bold font-mono text-lg">14k</div>
                     <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Checks</div>
                   </div>
                   <div className="bg-[#0A0C0F] border border-[#252A33] p-2 rounded text-center">
                     <div className="text-amber-400 font-bold font-mono text-lg">24</div>
                     <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Corrections</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guardrails' && (
          <div className="max-w-4xl mx-auto space-y-6 pt-4">
            <h2 className="text-2xl font-bold text-white mb-2">Voice & Tone Guardrails</h2>
            <p className="text-gray-400 text-sm mb-6 max-w-2xl">
              Configure the exact constraints that the AI agent will enforce when generating or reviewing copy across the entire unified system.
            </p>
            
            <div className="bg-[#14171D] border border-[#252A33] rounded-xl overflow-hidden">
               <div className="p-4 border-b border-[#252A33] bg-[#0F1115]">
                 <h3 className="font-bold text-white text-sm flex items-center gap-2"><Sliders className="w-4 h-4 text-fuchsia-400"/> Core Instructions</h3>
               </div>
               <div className="p-6">
                 <textarea 
                   className="w-full h-40 bg-[#0A0C0F] border border-[#252A33] rounded-lg p-4 text-sm text-gray-300 font-mono focus:outline-none focus:border-fuchsia-500 resize-none"
                   defaultValue="You are the ultimate brand guardian. The brand voice is professional, confident, yet approachable. Never use slang. Avoid overly complex jargon but do not talk down to the user. Always capitalize 'Brand'. Do not use exclamation marks more than once per paragraph. Never promise features that are not explicitly listed in the confirmed manifest."
                 />
                 <div className="mt-4 flex justify-end">
                   <button className="bg-[#252A33] hover:bg-[#323844] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors border border-[#3B4252]">Update System Prompt</button>
                 </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'models' && (
           <div className="max-w-6xl mx-auto space-y-6 pt-4">
              <div className="flex items-center justify-between mb-6">
                 <div>
                   <h2 className="text-2xl font-bold text-white mb-1">Open Source Models</h2>
                   <p className="text-gray-400 text-sm">Configure inference engine connections to ModelScope, Hugging Face, or local LLMs.</p>
                 </div>
                 <button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                    <Database className="w-4 h-4" /> Add Endpoint
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#14171D] border border-emerald-500/50 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                   <div className="p-4 border-b border-[#252A33] flex justify-between items-center bg-[#0F1115]">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded bg-[#252A33] flex items-center justify-center font-bold text-white">HF</div>
                         <div>
                           <h3 className="font-bold text-white text-sm">meta-llama/Llama-3-70b-instruct</h3>
                           <p className="text-[10px] text-gray-500 uppercase tracking-wider">Hugging Face Inference Setup</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-emerald-400">Active Primary</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      </div>
                   </div>
                   <div className="p-4 space-y-3">
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-500">Endpoint URL</span>
                       <span className="text-gray-300 font-mono text-xs">api-inference.huggingface.co</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-500">API Key</span>
                       <span className="text-gray-300 font-mono text-xs">hf_***************************</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-500">Latency (avg)</span>
                       <span className="text-emerald-400 font-mono text-xs">124ms</span>
                     </div>
                   </div>
                   <div className="bg-[#0A0C0F] p-3 border-t border-[#252A33] flex gap-2">
                     <button className="flex-1 bg-[#252A33] hover:bg-[#323844] text-white py-1.5 rounded text-xs font-medium transition-colors">Test Connection</button>
                     <button className="flex-1 bg-[#252A33] hover:bg-[#323844] text-white py-1.5 rounded text-xs font-medium transition-colors">Configure Settings</button>
                   </div>
                </div>

                <div className="bg-[#14171D] border border-[#252A33] rounded-xl overflow-hidden opacity-75 hover:opacity-100 transition-opacity">
                   <div className="p-4 border-b border-[#252A33] flex justify-between items-center bg-[#0F1115]">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded bg-[#252A33] flex items-center justify-center font-bold text-white">MS</div>
                         <div>
                           <h3 className="font-bold text-white text-sm">qwen/Qwen2-72B-Instruct</h3>
                           <p className="text-[10px] text-gray-500 uppercase tracking-wider">ModelScope Studio</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-gray-500">Standby (Fallback)</span>
                        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      </div>
                   </div>
                   <div className="p-4 space-y-3">
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-500">Endpoint URL</span>
                       <span className="text-gray-300 font-mono text-xs">dashscope.aliyuncs.com</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-500">API Key</span>
                       <span className="text-gray-300 font-mono text-xs">sk-***************************</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-500">Latency (avg)</span>
                       <span className="text-gray-400 font-mono text-xs">210ms</span>
                     </div>
                   </div>
                   <div className="bg-[#0A0C0F] p-3 border-t border-[#252A33] flex gap-2">
                     <button className="flex-1 bg-[#252A33] hover:bg-[#323844] text-white py-1.5 rounded text-xs font-medium transition-colors">Test Connection</button>
                     <button className="flex-1 bg-fuchsia-600/20 hover:bg-fuchsia-600/30 text-fuchsia-400 border border-fuchsia-500/30 py-1.5 rounded text-xs font-medium transition-colors">Set as Primary</button>
                   </div>
                </div>
              </div>
           </div>
        )}

        {activeTab === 'assets' && (
           <div className="max-w-6xl mx-auto space-y-6 pt-4">
              <div className="flex items-center justify-between mb-6">
                 <div>
                   <h2 className="text-2xl font-bold text-white mb-1">Generated Asset Library</h2>
                   <p className="text-gray-400 text-sm">Visual and copy assets generated by the agent, ready for deployment.</p>
                 </div>
                 <button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Generate New
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-[#14171D] border border-[#252A33] rounded-xl overflow-hidden group cursor-pointer hover:border-fuchsia-500/50 transition-colors">
                    <div className="aspect-video bg-[#0A0C0F] flex items-center justify-center p-4 relative overflow-hidden">
                       <Layers className="w-10 h-10 text-gray-700 absolute opacity-20" />
                       <div className="text-center relative z-10">
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2 font-mono">Generated Copy Block {i}</p>
                          <p className="text-sm text-gray-300 font-medium leading-relaxed">"Discover the next generation of unified productivity, driven by agentic artificial intelligence."</p>
                       </div>
                       
                       <div className="absolute inset-0 bg-[#0A0C0F]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                         <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full border border-white/20 transition-colors">
                           <Eye className="w-5 h-5" />
                         </button>
                       </div>
                    </div>
                    <div className="p-3 border-t border-[#252A33] flex justify-between items-center bg-[#0F1115]">
                      <span className="text-xs text-gray-500 font-mono">Type: Web Header</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Approved</span>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
