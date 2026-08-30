import React from 'react';
import { Cpu, HardDrive, Terminal } from 'lucide-react';

interface PlaceholderAppProps {
  appId: string;
}

export default function PlaceholderApp({ appId }: PlaceholderAppProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0B0D10] text-[#8E95A3]">
      <Cpu className="w-16 h-16 mb-4 text-indigo-500 opacity-50" />
      <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
        Module Initialized: {appId}
      </h2>
      <p className="max-w-md text-center text-sm leading-relaxed mb-6 font-mono">
        This application module is registered in the Odoo registry. Standard models and AI agent listeners are running in the background. 
        Data structures for ModelScope & HuggingFace integration are loaded into memory.
      </p>
      
      <div className="bg-[#14171D] border border-[#252A33] rounded-xl p-4 w-full max-w-lg shadow-sm">
        <div className="flex items-center gap-2 mb-3 border-b border-[#252A33] pb-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-emerald-400">System Logs</span>
        </div>
        <div className="text-[10px] font-mono space-y-1 opacity-70">
          <p>{'>'} [INFO] Loading core module: {appId}.py</p>
          <p>{'>'} [INFO] Binding external API nodes...</p>
          <p>{'>'} [SUCCESS] Remotion / Hyperframes endpoints linked.</p>
          <p>{'>'} [SUCCESS] LLM connection to huggingface.co standing by.</p>
          <p>{'>'} [STATUS] The Brand Agent is actively guarding assets.</p>
        </div>
      </div>
    </div>
  );
}
