import React, { useState } from 'react';
import { CodeXml, Terminal, Play, GraduationCap, Home, RotateCcw, Sparkles, Wand2 } from 'lucide-react';
import { CustomOdooAddon, CustomOdooModel, DynamicRecord } from '../types';
import { parseOdooPython, parseOdooXML, cn } from '../utils';

interface StudioAppProps {
  addons: CustomOdooAddon[];
  setAddons: React.Dispatch<React.SetStateAction<CustomOdooAddon[]>>;
  customModels: CustomOdooModel[];
  setCustomModels: React.Dispatch<React.SetStateAction<CustomOdooModel[]>>;
  setCustomRecords: React.Dispatch<React.SetStateAction<Record<string, DynamicRecord[]>>>;
  setInstalledAddons: React.Dispatch<React.SetStateAction<string[]>>;
  installedAddons: string[];
  setActiveAppId: (id: string) => void;
}

export default function StudioApp({
  addons,
  setAddons,
  customModels,
  setCustomModels,
  setCustomRecords,
  setInstalledAddons,
  installedAddons,
  setActiveAppId,
}: StudioAppProps) {
  const [selectedAddon, setSelectedAddon] = useState<CustomOdooAddon>(addons[0]);
  const [activeTab, setActiveTab] = useState<'python' | 'xml' | 'assistant'>('python');

  // Code editor values
  const [pythonCode, setPythonCode] = useState(selectedAddon.python_code);
  const [xmlCode, setXmlCode] = useState(selectedAddon.xml_view_code);

  // General terminal compile logs
  const [compileLogs, setCompileLogs] = useState<string[]>([
    'Odoo Local Studio ready.',
    'Click "Compile & Install Addon" to build the schema.',
  ]);
  const [isCompiling, setIsCompiling] = useState(false);

  // AI module generator fields
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Sync editor values when selected addon changes
  const handleSelectAddon = (addon: CustomOdooAddon) => {
    setSelectedAddon(addon);
    setPythonCode(addon.python_code);
    setXmlCode(addon.xml_view_code);
    setActiveTab('python');
    setCompileLogs([
      `Selected addon ${addon.shortdesc}. Ready to edit models.py and views.xml.`,
    ]);
  };

  // Run Compiler & Inject schema
  const handleCompileAndInstall = () => {
    setIsCompiling(true);
    setCompileLogs(['Initializing Odoo Module Compiler...', 'Verifying Python class bindings...']);

    setTimeout(() => {
      // 1. Compile custom model from custom Python code
      const compiledModel = parseOdooPython(pythonCode);
      if (!compiledModel) {
        setCompileLogs((prev) => [
          ...prev,
          '❌ ERROR: Failed to parse Python class. Ensure _name field is defined and matches snake_case syntax.',
          'Compilation aborted.',
        ]);
        setIsCompiling(false);
        return;
      }

      setCompileLogs((prev) => [
        ...prev,
        `✓ Found class ${compiledModel.className} representing Odoo Model "${compiledModel.name}"`,
        'Compiling database schema maps...',
        `✓ Generated simulated PostgreSQL table "odoo_model_${compiledModel.name.replace(/\./g, '_')}"`,
      ]);

      compiledModel.fields.forEach((field) => {
        setCompileLogs((prev) => [
          ...prev,
          `  - Created column "${field.name}" [Type: ${field.type.toUpperCase()}] with display label "${field.string}"`,
        ]);
      });

      // 2. Compile XML Views target layouts
      const visibleFields = parseOdooXML(xmlCode);
      setCompileLogs((prev) => [
        ...prev,
        '✓ Parsed views.xml tree layout.',
        `✓ Bound ${visibleFields.length} columns to rendering view layout: ${visibleFields.join(', ')}`,
      ]);

      // 3. Register state updates
      // Add custom model rules
      setCustomModels((prev) => {
        const filtered = prev.filter((m) => m.name !== compiledModel.name);
        return [...filtered, compiledModel];
      });

      // Initialize empty rows mapping database space
      setCustomRecords((prev) => {
        if (!prev[compiledModel.name]) {
          return { ...prev, [compiledModel.name]: [] };
        }
        return prev;
      });

      // Flag addon as installed
      setAddons((prev) =>
        prev.map((a) => (a.id === selectedAddon.id ? { ...a, python_code: pythonCode, xml_view_code: xmlCode, state: 'installed' } : a))
      );

      setInstalledAddons((prev) => {
        if (!prev.includes(selectedAddon.id)) {
          return [...prev, selectedAddon.id];
        }
        return prev;
      });

      setCompileLogs((prev) => [
        ...prev,
        '✓ Synchronized system hooks.',
        `✓ SUCCESS: Custom module "${selectedAddon.name}" compiled and installed successfully!`,
        `🚀 Open "${selectedAddon.shortdesc}" app via the left sidebar to add custom entries!`,
      ]);
      setIsCompiling(false);

      // Transition users directly to the newly parsed module to let them play with it immediately
      setTimeout(() => {
        setActiveAppId(selectedAddon.id);
      }, 3000);
    }, 1500);
  };

  // Request AI Custom Addon generator
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiError(null);

    setCompileLogs((prev) => [...prev, `AI request: Designing custom module for "${aiPrompt}"...`]);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_module', prompt: aiPrompt }),
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || 'Server-side Gemini generation error');
      }

      const generated = resData.module;

      // Construct a new addon on the fly
      const newAddon: CustomOdooAddon = {
        id: `addon_${generated.name}`,
        name: generated.name,
        shortdesc: generated.shortdesc,
        description: generated.description,
        author: generated.author,
        icon: generated.icon || 'CodeXml',
        state: 'uninstalled',
        python_code: generated.python_code,
        xml_view_code: generated.xml_view_code,
      };

      // Append custom generated addon to list and focus
      setAddons((prev) => [...prev, newAddon]);
      setSelectedAddon(newAddon);
      setPythonCode(newAddon.python_code);
      setXmlCode(newAddon.xml_view_code);
      setActiveTab('python');

      setCompileLogs((prev) => [
        ...prev,
        `✓ AI successfully generated custom module: ${generated.shortdesc}`,
        'Ready to run compiler tests.',
      ]);
      setAiPrompt('');
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Error executing server AI model.');
      setCompileLogs((prev) => [...prev, `❌ AI compilation failure: ${err.message}`]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0D10] text-[#E0E2E6] overflow-hidden" id="odoo-studio-ide">
      {/* Studio Header Bar */}
      <div className="bg-[#111419] p-4 border-b border-[#252A33] shrink-0 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <CodeXml className="h-5 w-5 text-indigo-400 animate-pulse" />
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono block">Code Studio Sandbox</span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">Developer Workspace</h2>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={handleCompileAndInstall}
          disabled={isCompiling}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 text-xs font-bold rounded-lg hover:bg-indigo-700 transition shadow disabled:opacity-50 shrink-0 select-none cursor-pointer"
        >
          <Play className={cn("h-3.5 w-3.5", isCompiling ? "animate-spin" : "")} />
          <span>Compile & Install Addon</span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Module Explorer Preset List */}
        <div className="w-56 bg-[#111419] border-r border-[#252A33] p-3 flex flex-col gap-2.5 select-none font-mono">
          <span className="text-[10px] uppercase font-black tracking-widest text-[#8E95A3] block">Addon Directory</span>
          <div className="space-y-1 overflow-y-auto flex-1 text-xs">
            {addons.map((addon) => {
              const isSelected = addon.id === selectedAddon.id;
              const isInst = installedAddons.includes(addon.id);
              return (
                <button
                  key={addon.id}
                  onClick={() => handleSelectAddon(addon)}
                  className={cn(
                    "w-full text-left p-2 rounded-lg text-xs leading-tight transition-colors block text-[#8E95A3] hover:bg-[#1C2129]/60 hover:text-white cursor-pointer",
                    isSelected ? "bg-[#1C2129] text-white border-l-2 border-l-indigo-500 font-bold" : ""
                  )}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span className="truncate">{addon.shortdesc}</span>
                    {isInst && <span className="text-[8px] px-1.5 bg-emerald-500/10 border border-emerald-500/20 font-bold text-emerald-400 font-mono rounded-full scale-90">LIVE</span>}
                  </div>
                  <div className="text-[10px] text-[#8E95A3]/80 truncate mt-0.5">__manifest__.py</div>
                </button>
              );
            })}
          </div>

          {/* Quick preset reset */}
          <button
            onClick={() => {
              setPythonCode(selectedAddon.python_code);
              setXmlCode(selectedAddon.xml_view_code);
              setCompileLogs(['Workspace code reset to factory presets.']);
            }}
            className="flex items-center justify-center gap-1.5 p-2 rounded-lg text-[#8E95A3] bg-[#1C2129] border border-[#252A33] text-[10px] hover:text-white hover:bg-[#202631] transition cursor-pointer font-bold"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Active File</span>
          </button>
        </div>

        {/* Active Source Code Editors Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* File Tab Nav Bar */}
          <div className="bg-[#111419] flex justify-between border-b border-[#252A33] shrink-0 font-mono text-xs select-none">
            <div className="flex">
              <button
                onClick={() => setActiveTab('python')}
                className={cn(
                  "px-4 py-2.5 border-r border-[#252A33] transition-colors cursor-pointer",
                  activeTab === 'python' ? "bg-[#14171D] text-white border-b-2 border-b-indigo-500 font-bold" : "text-[#8E95A3] hover:text-white hover:bg-[#1C2129]/40"
                )}
              >
                models.py (Python)
              </button>
              <button
                onClick={() => setActiveTab('xml')}
                className={cn(
                  "px-4 py-2.5 border-r border-[#252A33] transition-colors cursor-pointer",
                  activeTab === 'xml' ? "bg-[#14171D] text-white border-b-2 border-b-indigo-500 font-bold" : "text-[#8E95A3] hover:text-white hover:bg-[#1C2129]/40"
                )}
              >
                views.xml (XML Layout)
              </button>
              <button
                onClick={() => setActiveTab('assistant')}
                className={cn(
                  "px-4 py-2.5 border-r border-[#252A33] transition-colors text-indigo-400 flex items-center gap-1.5 hover:text-indigo-300 cursor-pointer",
                  activeTab === 'assistant' ? "bg-[#14171D] text-indigo-400 border-b-2 border-b-indigo-500 font-black" : ""
                )}
              >
                <Sparkles className="h-3.5 w-3.5 animate-pulse text-indigo-400" />
                Gemini AI Designer
              </button>
            </div>
          </div>

          {/* Core code editors */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'python' && (
              <textarea
                value={pythonCode}
                onChange={(e) => setPythonCode(e.target.value)}
                className="w-full h-full p-4 bg-[#14171D] text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none resize-none overflow-y-auto"
                spellCheck={false}
              />
            )}
            {activeTab === 'xml' && (
              <textarea
                value={xmlCode}
                onChange={(e) => setXmlCode(e.target.value)}
                className="w-full h-full p-4 bg-[#14171D] text-sky-450 font-mono text-xs leading-relaxed focus:outline-none resize-none overflow-y-auto"
                spellCheck={false}
              />
            )}
            {activeTab === 'assistant' && (
              <div className="w-full h-full p-6 bg-[#14171D] flex flex-col justify-center items-center text-center space-y-4">
                <div className="p-4 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400">
                  <Wand2 className="h-7 w-7 animate-bounce" />
                </div>
                <div className="max-w-md">
                  <h4 className="font-extrabold text-white text-sm">Gemini Odoo ERP Customizer</h4>
                  <p className="text-[#8E95A3] text-xs mt-1.5 leading-relaxed font-normal">
                    Type a high-level description below (e.g. "Build an application to track car rentals with vehicle plate, model name, and standard daily rate"). Gemini will build complete Python and XML modules automatically!
                  </p>
                </div>

                <div className="w-full max-w-lg space-y-3 pt-2 text-xs">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe your ERP application needs..."
                    disabled={aiLoading}
                    className="w-full bg-[#1A1E24] border border-[#252A33] rounded-xl text-xs text-white p-3 focus:outline-none focus:border-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAIGenerate();
                    }}
                  />
                  <div className="flex justify-between items-center text-left">
                    <span className="text-[10px] text-[#8E95A3] font-semibold uppercase font-mono">
                      * Uses server-side gemini-2.5-flash
                    </span>
                    <button
                      onClick={handleAIGenerate}
                      disabled={aiLoading || !aiPrompt.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-5 py-2 rounded-lg font-bold flex items-center gap-1.5 shadow transition disabled:opacity-50 cursor-pointer"
                    >
                      {aiLoading ? 'Developing...' : 'Generate custom app'}
                    </button>
                  </div>
                  {aiError && (
                    <div className="p-3 bg-red-500/10 rounded border border-red-500/20 text-red-400 text-xs text-left">
                      {aiError}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Compilation Logs Console Terminal */}
          <div className="h-44 bg-[#111419] border-t border-[#252A33] flex flex-col font-mono select-none overflow-hidden shrink-0">
            <div className="bg-[#0B0D10] px-4 py-1.5 border-b border-[#252A33] flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#8E95A3]">
              <span className="flex items-center gap-1">
                <Terminal className="h-3 w-3 text-indigo-400" />
                Compilation Output Console
              </span>
              <span>Shell Streams logs</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 text-[11px] space-y-1 bg-[#090B0D] text-[#8E95A3]">
              {compileLogs.map((log, idx) => {
                const isError = log.includes('❌') || log.includes('ERROR');
                const isSuccess = log.includes('✓') || log.includes('SUCCESS');
                return (
                  <div
                    key={idx}
                    className={cn(
                      isError ? "text-red-400 font-bold" : isSuccess ? "text-emerald-400 font-bold" : ""
                    )}
                  >
                    {log}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
