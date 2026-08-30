import React, { useState } from 'react';
import { Plus, Check, Star, Calendar, RefreshCw, Mail, Phone, MapPin } from 'lucide-react';
import { CrmLead, ResPartner } from '../types';
import { cn, formatCurrency, formatDate } from '../utils';

interface CrmAppProps {
  leads: CrmLead[];
  partners: ResPartner[];
  setLeads: React.Dispatch<React.SetStateAction<CrmLead[]>>;
}

export default function CrmApp({ leads, partners, setLeads }: CrmAppProps) {
  const [activeLead, setActiveLead] = useState<CrmLead | null>(null);
  const [showAddForm, setShowAddForm] = useState<string | null>(null); // holds stage_id
  const [addName, setAddName] = useState('');
  const [addRevenue, setAddRevenue] = useState('1000');
  const [addPartner, setAddPartner] = useState(partners[0]?.id || '');

  const stages: { id: CrmLead['stage_id']; name: string; border: string; bg: string }[] = [
    { id: 'new', name: 'New', border: 'border-t-4 border-t-blue-500', bg: 'bg-blue-50/20' },
    { id: 'qualified', name: 'Qualified', border: 'border-t-4 border-t-amber-500', bg: 'bg-amber-50/20' },
    { id: 'proposition', name: 'Proposition', border: 'border-t-4 border-t-purple-500', bg: 'bg-purple-50/20' },
    { id: 'won', name: 'Won', border: 'border-t-4 border-t-emerald-500', bg: 'bg-emerald-50/20' },
  ];

  const [animatingLeads, setAnimatingLeads] = useState<Record<string, { nextStage: CrmLead['stage_id']; direction: 'forward' | 'backward' }>>({});

  // Move lead stage
  const moveStage = (leadId: string, nextStage: CrmLead['stage_id']) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.stage_id === nextStage) return;

    const currentIdx = stages.findIndex((s) => s.id === lead.stage_id);
    const nextIdx = stages.findIndex((s) => s.id === nextStage);
    const direction = nextIdx > currentIdx ? 'forward' : 'backward';

    // 1. Tag lead with animation state (slide out)
    setAnimatingLeads((prev) => ({
      ...prev,
      [leadId]: { nextStage, direction }
    }));

    // 2. Commit the stage change after CSS animation finishes
    setTimeout(() => {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId
            ? { ...l, stage_id: nextStage, probability: nextStage === 'won' ? 100 : l.probability }
            : l
        )
      );
      setAnimatingLeads((prev) => {
        const copy = { ...prev };
        delete copy[leadId];
        return copy;
      });
    }, 300); // 300ms matches the transition duration perfectly
  };

  // Create quick lead
  const handleCreateLead = (stageId: CrmLead['stage_id']) => {
    if (!addName.trim()) return;
    const partner = partners.find((p) => p.id === addPartner);

    const newLead: CrmLead = {
      id: `crm_lead_${Date.now()}`,
      name: addName,
      partner_id: addPartner,
      expected_revenue: parseFloat(addRevenue) || 0,
      probability: stageId === 'won' ? 100 : stageId === 'proposition' ? 70 : stageId === 'qualified' ? 40 : 10,
      stage_id: stageId,
      email: partner?.email || 'sales@example.com',
      phone: partner?.phone || '',
      description: 'Quickly generated lead from CRM Kanban.',
      priority: 2,
      date_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    setLeads((prev) => [newLead, ...prev]);
    setAddName('');
    setAddRevenue('1000');
    setShowAddForm(null);
  };

  // Get stage totals
  const getStageTotal = (stageId: CrmLead['stage_id']) => {
    return leads
      .filter((l) => l.stage_id === stageId)
      .reduce((sum, l) => sum + (l.expected_revenue || 0), 0);
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0D10] overflow-hidden" id="odoo-crm-subsystem">
      {/* CRM Actions Header */}
      <div className="bg-[#111419] p-4 border-b border-[#252A33] flex justify-between items-center shrink-0">
        <div>
          <div className="text-xs text-[#8E95A3] font-semibold tracking-wider uppercase font-mono">CRM Application</div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wide">My Pipeline</h2>
        </div>
        <div className="flex items-center gap-4 bg-[#1C2129] px-4 py-2 rounded-lg border border-[#252A33]">
          <span className="text-xs font-semibold text-[#8E95A3]">Pipeline Value:</span>
          <span className="text-sm font-bold text-indigo-400 font-mono">
            {formatCurrency(leads.reduce((sum, l) => sum + (l.expected_revenue || 0), 0))}
          </span>
        </div>
      </div>

      {/* Kanban Board Stage Columns */}
      <div className="flex-1 overflow-x-auto p-4 flex gap-4 alignment-stretch min-h-0">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage_id === stage.id);
          return (
            <div
              key={stage.id}
              className={cn(
                "w-80 rounded-xl border border-[#252A33] bg-[#14171D] flex flex-col shrink-0 overflow-hidden",
                stage.id === 'new' ? 'border-t-2 border-t-[#6366F1]' :
                stage.id === 'qualified' ? 'border-t-2 border-t-amber-500' :
                stage.id === 'proposition' ? 'border-t-2 border-t-purple-500' : 'border-t-2 border-t-emerald-500'
              )}
            >
              {/* Column Header */}
              <div className="p-3 bg-[#111419] border-b border-[#252A33] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-xs uppercase tracking-wide flex items-center gap-2">
                    {stage.name}
                    <span className="px-1.5 py-0.5 text-[10px] bg-[#252A33] text-[#8E95A3] rounded-full font-mono font-bold">
                      {stageLeads.length}
                    </span>
                  </h3>
                  <p className="text-[11px] font-mono text-indigo-400 font-bold mt-0.5">
                    {formatCurrency(getStageTotal(stage.id))}
                  </p>
                </div>
                <button
                  onClick={() => setShowAddForm(showAddForm === stage.id ? null : stage.id)}
                  className="p-1 hover:bg-[#1C2129] rounded text-[#8E95A3] hover:text-white transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Quick Add Form */}
              {showAddForm === stage.id && (
                <div className="p-3 bg-[#111419] border-b border-[#252A33] space-y-2.5">
                  <input
                    type="text"
                    placeholder="Opportunity Title..."
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="w-full text-xs bg-[#0B0D10] border border-[#252A33] text-white p-2.5 rounded focus:outline-none focus:border-indigo-500 font-medium placeholder-zinc-600"
                  />
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[9px] font-bold text-[#8E95A3] block mb-1 uppercase font-mono">Partner</label>
                      <select
                        value={addPartner}
                        onChange={(e) => setAddPartner(e.target.value)}
                        className="w-full text-xs bg-[#0B0D10] border border-[#252A33] text-white px-2 py-1.5 rounded focus:outline-none"
                      >
                        {partners.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-[#8E95A3] block mb-1 uppercase font-mono">Revenue ($)</label>
                      <input
                        type="number"
                        value={addRevenue}
                        onChange={(e) => setAddRevenue(e.target.value)}
                        className="w-20 text-xs bg-[#0B0D10] border border-[#252A33] text-white p-1.5 rounded focus:outline-none font-mono font-bold"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-1.5 pt-1">
                    <button
                      onClick={() => setShowAddForm(null)}
                      className="text-[10px] px-2.5 py-1 text-[#8E95A3] hover:bg-[#1C2129] rounded font-semibold"
                    >
                      Discard
                    </button>
                    <button
                      onClick={() => handleCreateLead(stage.id)}
                      className="text-[10px] bg-indigo-600 text-white px-3 py-1 rounded font-bold hover:bg-indigo-700 transition"
                    >
                      Add Lead
                    </button>
                  </div>
                </div>
              )}

              {/* Column Cards List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {stageLeads.length === 0 ? (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-[#252A33] rounded-lg text-xs text-[#8E95A3]">
                    No active opportunities
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const partner = partners.find((p) => p.id === lead.partner_id);
                    const isAnimating = !!animatingLeads[lead.id];
                    const animDir = animatingLeads[lead.id]?.direction;

                    return (
                      <div
                        key={lead.id}
                        onClick={() => setActiveLead(lead)}
                        className={cn(
                          "p-3 bg-[#1C2129]/65 border border-[#252A33] rounded-lg hover:border-indigo-500 hover:bg-[#1C2129] cursor-pointer transition-all duration-300 ease-in-out space-y-2 group transform origin-center",
                          isAnimating && animDir === "forward" && "translate-x-12 opacity-0 scale-90 rotate-2 pointer-events-none",
                          isAnimating && animDir === "backward" && "-translate-x-12 opacity-0 scale-90 -rotate-2 pointer-events-none"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-white text-xs leading-tight group-hover:text-indigo-400 transition-colors">
                            {lead.name}
                          </h4>
                          <span className="text-[11px] font-mono font-bold text-indigo-400">
                            {formatCurrency(lead.expected_revenue)}
                          </span>
                        </div>

                        <div className="flex text-[10px] items-center text-[#8E95A3] gap-1.5">
                          {partner && (
                            <img
                              referrerPolicy="no-referrer"
                              src={partner.image_url}
                              alt={partner.name}
                              className="h-3.5 w-3.5 rounded-full object-cover shrink-0 border border-[#252A33]"
                            />
                          )}
                          <span className="truncate font-semibold">{partner?.name || 'Unknown contact'}</span>
                        </div>

                        <div className="flex justify-between items-center pt-1 border-t border-[#252A33]">
                          {/* Priority Indicator stars */}
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "h-3 w-3",
                                  star <= lead.priority ? "fill-amber-405 text-amber-500" : "text-[#252A33]"
                                )}
                              />
                            ))}
                          </div>

                          {/* Move action controls shortcut */}
                          <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                            {stage.id !== 'won' && (
                              <button
                                title="Move to next stage"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const nextIdx = stages.findIndex((s) => s.id === stage.id) + 1;
                                  if (nextIdx < stages.length) moveStage(lead.id, stages[nextIdx].id);
                                }}
                                className="p-0.5 bg-[#252A33] hover:bg-indigo-600 hover:text-white rounded"
                              >
                                <Check className="h-2.5 w-2.5 text-[#E0E2E6]" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Opportunity Detail View Modal Sheet */}
      {activeLead && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#14171D] rounded-xl shadow-2xl border border-[#252A33] w-full max-w-xl flex flex-col overflow-hidden max-h-[85vh]">
            <div className="p-4 bg-[#111419] border-b border-[#252A33] flex justify-between items-center">
              <div>
                <span className="text-[9px] font-extrabold tracking-wider text-indigo-400 uppercase font-mono">Opportunity record sheet</span>
                <h3 className="font-extrabold text-white text-base mt-0.5">{activeLead.name}</h3>
              </div>
              <button
                onClick={() => setActiveLead(null)}
                className="text-zinc-500 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#8E95A3] font-mono">Customer</label>
                  <div className="text-xs text-white font-bold py-1">
                    {partners.find((p) => p.id === activeLead.partner_id)?.name || 'Direct Enterprise Client'}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#8E95A3] font-mono">Expected Revenue</label>
                  <div className="text-xs text-indigo-400 font-bold py-1 font-mono">
                    {formatCurrency(activeLead.expected_revenue)}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#8E95A3] font-mono">Probability Rating</label>
                  <div className="text-xs text-white py-1 font-mono font-bold">
                    {activeLead.probability}%
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#8E95A3] font-mono">Deadline</label>
                  <div className="text-xs text-white py-1 flex items-center gap-1.5 font-semibold">
                    <Calendar className="h-3.5 w-3.5 text-[#8E95A3]" />
                    {formatDate(activeLead.date_deadline)}
                  </div>
                </div>
              </div>

              <div className="border-t border-[#252A33] pt-3">
                <label className="text-[10px] uppercase font-bold text-[#8E95A3] font-mono">Contact Details</label>
                <div className="mt-1.5 space-y-1.5">
                  <div className="text-xs text-zinc-300 flex items-center gap-2">
                    <Mail className="h-3 w-3 text-indigo-400" /> {activeLead.email}
                  </div>
                  {activeLead.phone && (
                    <div className="text-xs text-zinc-300 flex items-center gap-2">
                      <Phone className="h-3 w-3 text-indigo-400" /> {activeLead.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-[#252A33] pt-3">
                <label className="text-[10px] uppercase font-bold text-[#8E95A3] font-mono">Stage Selection Progress</label>
                <div className="flex gap-1.5 mt-2">
                  {stages.map((stg) => {
                    const activeState = activeLead.stage_id === stg.id;
                    return (
                      <button
                        key={stg.id}
                        onClick={() => {
                          const updated = { ...activeLead, stage_id: stg.id, probability: stg.id === 'won' ? 100 : activeLead.probability };
                          setActiveLead(updated);
                          moveStage(activeLead.id, stg.id);
                        }}
                        className={cn(
                          "flex-1 text-[10px] py-1.5 rounded-md font-bold text-center border transition-all uppercase tracking-wider",
                          activeState 
                            ? "bg-indigo-600 text-white border-transparent" 
                            : "bg-[#1C2129] text-[#8E95A3] border-[#252A33] hover:border-[#2D333E]"
                        )}
                      >
                        {stg.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-[#252A33] pt-3">
                <label className="text-[10px] uppercase font-bold text-[#8E95A3] font-mono">Internal Notes</label>
                <textarea
                  value={activeLead.description}
                  onChange={(e) => {
                    const value = e.target.value;
                    const updated = { ...activeLead, description: value };
                    setActiveLead(updated);
                    setLeads((prev) => prev.map((l) => (l.id === activeLead.id ? updated : l)));
                  }}
                  className="w-full text-xs text-[#E0E2E6] bg-[#0B0D10] border border-[#252A33] mt-1.5 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
                  rows={3}
                />
              </div>
            </div>

            <div className="bg-[#111419] p-4 border-t border-[#252A33] flex justify-between shrink-0">
              <button
                onClick={() => {
                  setLeads((prev) => prev.filter((l) => l.id !== activeLead.id));
                  setActiveLead(null);
                }}
                className="text-xs text-red-400 hover:bg-red-950/20 px-3.5 py-1.5 rounded font-bold"
              >
                Delete Opportunity
              </button>
              <button
                onClick={() => setActiveLead(null)}
                className="text-xs bg-indigo-600 text-white px-5 py-1.5 rounded font-bold hover:bg-indigo-700 transition"
              >
                Close Records
              </button>
              <div className="border-t border-[#252A33] pt-4 flex justify-between items-center">
                <button
                  onClick={() => {
                    const partner = partners.find((p) => p.id === activeLead.partner_id);
                    const prompt = `[CRM LEAD COPILOT]\nLead: ${activeLead.name}\nContact: ${partner?.name || 'Direct Contact'} (${activeLead.email})\nStage: ${activeLead.stage_id} | Value: $${activeLead.expected_revenue} (${activeLead.probability}% probability)\nNotes: ${activeLead.description}\n\nPlease analyze this deal, identify risks, and suggest 3 high-impact next actions.`;
                    sessionStorage.setItem('hermes_prefilled_prompt', prompt);
                    window.location.href = '/chat';
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-xs font-bold hover:brightness-110 shadow-lg shadow-indigo-500/20 transition-all"
                >
                  <span>✨</span> Consult Hermes Copilot
                </button>
                <button
                  onClick={() => setActiveLead(null)}
                  className="px-4 py-2 bg-[#1C2129] border border-[#252A33] text-[#8E95A3] hover:text-white rounded-lg text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
