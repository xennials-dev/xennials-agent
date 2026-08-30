/**
 * Hermes Agent <-> Odoo CRM Bridge
 * Enables bi-directional linking between CRM records and Hermes Copilot / War Room
 */

export interface CrmLeadContext {
  id: string;
  name: string;
  partner_name: string;
  email: string;
  phone?: string;
  expected_revenue: number;
  probability: number;
  stage: string;
  priority?: string;
  description?: string;
}

/**
 * Launch a Hermes chat session with preloaded contextual CRM customer data
 */
export function launchHermesLeadCopilot(lead: CrmLeadContext, navigate?: (path: string) => void) {
  const prompt = `[CRM COPILOT CONTEXT]\nLead: ${lead.name}\nContact: ${lead.partner_name} (${lead.email})\nStage: ${lead.stage} | Expected Revenue: $${lead.expected_revenue} (${lead.probability}% win probability)\nNotes: ${lead.description || 'N/A'}\n\nPlease analyze this deal, identify next best actions, and prepare a personalized outreach draft.`;
  
  sessionStorage.setItem('hermes_prefilled_prompt', prompt);
  sessionStorage.setItem('hermes_active_crm_lead', JSON.stringify(lead));
  
  if (navigate) {
    navigate('/chat');
  } else {
    window.location.href = '/chat';
  }
}

/**
 * Dispatch an AI Agency HQ campaign or automation task directly to Hermes War Room
 */
export function delegateToWarRoom(taskName: string, prompt: string, navigate?: (path: string) => void) {
  sessionStorage.setItem('hermes_warroom_pending_task', JSON.stringify({
    title: taskName,
    prompt: prompt,
    timestamp: Date.now()
  }));

  if (navigate) {
    navigate('/war-room');
  } else {
    window.location.href = '/war-room';
  }
}
