import React, { useState } from 'react';
import { 
  FileText, 
  Folder, 
  FolderOpen, 
  Search, 
  Copy, 
  Check, 
  PlusCircle, 
  FileCheck, 
  Globe, 
  Layers, 
  Cpu, 
  Users 
} from 'lucide-react';

export interface GoogleDoc {
  id: string;
  title: string;
  folder: 'Strategy' | 'Blueprints' | 'Forms & Onboarding' | 'Best Tools';
  emoji: string;
  content: string;
  scraped?: boolean;
}

interface GoogleDocsHubProps {
  onInjectIntoAgent?: (text: string) => void;
  docs: GoogleDoc[];
  setDocs: React.Dispatch<React.SetStateAction<GoogleDoc[]>>;
}

export default function GoogleDocsHub({ onInjectIntoAgent, docs, setDocs }: GoogleDocsHubProps) {
  const [selectedDocId, setSelectedDocId] = useState<string>('services');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customFolder, setCustomFolder] = useState<'Strategy' | 'Blueprints' | 'Forms & Onboarding' | 'Best Tools'>('Strategy');
  const [customContent, setCustomContent] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const selectedDoc = docs.find(d => d.id === selectedDocId) || docs[0];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder ? doc.folder === selectedFolder : true;
    return matchesSearch && matchesFolder;
  });

  const handleAddCustomDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customContent.trim()) return;

    const newDoc: GoogleDoc = {
      id: `custom_${Date.now()}`,
      title: customTitle.trim(),
      folder: customFolder,
      emoji: '📝',
      content: customContent.trim()
    };

    setDocs(prev => [newDoc, ...prev]);
    setSelectedDocId(newDoc.id);
    setCustomTitle('');
    setCustomContent('');
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden text-sm bg-[#0E1218]" id="docs-hub-root">
      {/* Sidebar Browser */}
      <div className="w-full lg:w-72 border-r border-[#1C222A] bg-[#0E1217] flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-[#1C222A] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#8E95A3] font-mono flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Branded Resource Folders</span>
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-[10px] bg-cyan-600/20 text-cyan-400 border border-cyan-500/20 px-2 py-1 rounded hover:bg-cyan-600/40 transition flex items-center gap-1"
            >
              <PlusCircle className="w-3 h-3" />
              <span>New Doc</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search resource archive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 text-xs text-white pl-8 pr-3 py-1.5 rounded-lg border border-[#1F252D] focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
            />
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-500" />
          </div>
        </div>

        {/* Categories Folders list */}
        <div className="p-3 border-b border-[#1C222A] grid grid-cols-2 gap-1.5 bg-black/10 shrink-0">
          {(['Strategy', 'Blueprints', 'Forms & Onboarding', 'Best Tools'] as const).map(folder => {
            const isSelected = selectedFolder === folder;
            const count = docs.filter(d => d.folder === folder).length;
            return (
              <button
                key={folder}
                onClick={() => setSelectedFolder(isSelected ? null : folder)}
                className={`p-2 rounded text-left text-[11px] font-mono transition-colors relative overflow-hidden border ${
                  isSelected 
                    ? 'bg-cyan-600/10 text-cyan-400 border-cyan-500/30 font-bold' 
                    : 'bg-[#141820] text-gray-400 border-transparent hover:bg-[#1C222A]'
                }`}
              >
                <div className="flex items-center gap-1.5 justify-between">
                  <span className="truncate">{folder}</span>
                  <span className="text-[9px] px-1 bg-black/30 rounded-full text-cyan-300 font-sans">{count}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Document list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredDocs.length === 0 ? (
            <div className="text-center p-6 text-xs text-gray-500 font-mono">No documents found matching criteria.</div>
          ) : (
            filteredDocs.map(doc => {
              const isSelected = doc.id === selectedDocId;
              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition border ${
                    isSelected
                      ? 'bg-cyan-600/15 border-cyan-500/25 text-white shadow-md shadow-cyan-550/5'
                      : 'border-transparent text-gray-400 hover:bg-[#141821] hover:text-white'
                  }`}
                >
                  <span className="text-lg shrink-0">{doc.emoji}</span>
                  <div className="min-w-0">
                    <span className="block font-bold text-[11px] truncate leading-tight">{doc.title}</span>
                    <span className="inline-block text-[9px] font-mono text-gray-500 mt-1 uppercase tracking-tight bg-black/20 px-1 rounded">
                      {doc.folder}
                    </span>
                    {doc.scraped && (
                      <span className="inline-block text-[9px] font-mono text-emerald-400 ml-1.5 font-bold uppercase tracking-widest bg-emerald-950/40 border border-emerald-800/35 px-1 rounded animate-pulse">
                        Scraped
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Document Content Pane */}
      <div className="flex-1 flex flex-col h-full bg-[#090C10] overflow-hidden">
        {selectedDoc ? (
          <>
            {/* Header toolbar */}
            <div className="px-5 py-3.5 border-b border-[#1C222A] bg-[#0E1217] flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-2xl">{selectedDoc.emoji}</span>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-white truncate leading-tight font-sans">
                    {selectedDoc.title}
                  </h4>
                  <p className="text-[10px] font-mono text-cyan-400 mt-0.5 tracking-wide">
                    Google Docs Sync: Active Server Folder / {selectedDoc.folder}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onInjectIntoAgent && (
                  <button
                    onClick={() => onInjectIntoAgent(selectedDoc.content)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] py-1.5 px-3 rounded font-bold font-mono tracking-wide transition flex items-center gap-1"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Send to Agent Context</span>
                  </button>
                )}
                
                <button
                  onClick={() => handleCopy(selectedDoc.id, selectedDoc.content)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] py-1.5 px-3 rounded font-bold font-mono tracking-wide transition flex items-center gap-1.5"
                >
                  {copiedId === selectedDoc.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === selectedDoc.id ? 'Copied!' : 'Copy Doc'}</span>
                </button>
              </div>
            </div>

            {/* Document body text */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 select-text selection:bg-cyan-500/20">
              <div className="bg-[#0E1217] border border-white/5 rounded-xl p-6 shadow-2xl space-y-4 max-w-4xl mx-auto">
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">
                  <span>GOOGLE WORKSPACE DOC SYNC</span>
                  <span>EST. 2024 • LOCAL SECURE SHELF</span>
                </div>
                
                <div className="text-gray-200 leading-relaxed text-xs font-mono space-y-4 whitespace-pre-wrap font-sans">
                  {selectedDoc.content}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-2">
            <FileText className="w-12 h-12 text-gray-700 animate-pulse" />
            <p className="text-xs font-mono">Select a document from the folder to inspect.</p>
          </div>
        )}
      </div>

      {/* Add Custom Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-xs font-mono">
          <div className="bg-[#0F131A] border border-[#222E3B] rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-[#222E3B] pb-2">
              <h3 className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                <span>Create Mock Google Doc</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white font-bold text-sm">×</button>
            </div>

            <form onSubmit={handleAddCustomDoc} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[9px] text-[#8E95A3] uppercase">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Odoo Lead Ingestion API Guide"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-black/40 text-xs text-white p-2.5 rounded border border-[#1F252D] focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] text-[#8E95A3] uppercase">Target Synced Folder</label>
                <select
                  value={customFolder}
                  onChange={(e) => setCustomFolder(e.target.value as any)}
                  className="w-full bg-[#141820] text-xs text-white p-2 rounded border border-[#1F252D] focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Strategy">Strategy & Goals</option>
                  <option value="Blueprints">SaaS Operations Blueprints</option>
                  <option value="Forms & Onboarding">Forms & Onboarding guides</option>
                  <option value="Best Tools">Best AI Tools & Libraries</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] text-[#8E95A3] uppercase">Document Content / Markdown Text</label>
                <textarea
                  required
                  rows={8}
                  placeholder="Paste or write your document contents..."
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  className="w-full bg-black/40 text-xs text-white p-2.5 rounded border border-[#1F252D] focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-400 text-[10px] px-3.5 py-2 rounded uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] px-3.5 py-2 rounded uppercase font-bold"
                >
                  Save Synced Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
