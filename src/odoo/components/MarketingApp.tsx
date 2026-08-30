import React, { useState } from 'react';
import { Share2, Mail, MessageSquare, BarChart2, Plus, Users, ArrowUpRight } from 'lucide-react';
import { cn } from '../utils';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'sms';
  status: 'draft' | 'running' | 'completed';
  sent: number;
  clicks: number;
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Black Friday Deals', type: 'email', status: 'completed', sent: 12500, clicks: 3420 },
  { id: '2', name: 'Spring Collection Launch', type: 'social', status: 'running', sent: 45000, clicks: 8900 },
  { id: '3', name: 'VIP Customer Retention', type: 'email', status: 'running', sent: 2100, clicks: 650 },
  { id: '4', name: 'Flash Sale Alert', type: 'sms', status: 'draft', sent: 0, clicks: 0 },
];

export default function MarketingApp() {
  const [campaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'analytics'>('campaigns');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAFAFA]">
      <div className="bg-white border-b border-[#E0E0E0] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-rose-600 text-white p-2 rounded-lg shadow-sm">
            <Share2 className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-[#3B3B3B]">Marketing</h1>
          
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          
          <div className="flex space-x-1">
            <button 
              onClick={() => setActiveTab('campaigns')}
              className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-colors", activeTab === 'campaigns' ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50")}
            >
              Campaigns
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-colors", activeTab === 'analytics' ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50")}
            >
              Analytics
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            Create
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'campaigns' ? (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 text-gray-500 mb-2 text-sm font-medium">
                  <Mail className="w-4 h-4 text-emerald-600" /> Total Emails Sent
                </div>
                <div className="text-2xl font-bold text-gray-900">14,600</div>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 text-gray-500 mb-2 text-sm font-medium">
                  <Share2 className="w-4 h-4 text-blue-600" /> Social Impressions
                </div>
                <div className="text-2xl font-bold text-gray-900">45,000</div>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 text-gray-500 mb-2 text-sm font-medium">
                  <Users className="w-4 h-4 text-violet-600" /> Active Leads Gens
                </div>
                <div className="text-2xl font-bold text-gray-900">4,070</div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-900 font-medium">
                  <tr>
                    <th className="px-4 py-3">Campaign Name</th>
                    <th className="px-4 py-3">Channel</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Sent / Reached</th>
                    <th className="px-4 py-3 text-right">Clicks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {campaigns.map(camp => (
                    <tr key={camp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                        {camp.name}
                      </td>
                      <td className="px-4 py-3 capitalize flex items-center gap-1.5">
                        {camp.type === 'email' && <Mail className="w-3.5 h-3.5 text-gray-400" />}
                        {camp.type === 'social' && <Share2 className="w-3.5 h-3.5 text-blue-400" />}
                        {camp.type === 'sms' && <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
                        {camp.type}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[11px] font-bold uppercase",
                          camp.status === 'running' ? "bg-emerald-100 text-emerald-700" :
                          camp.status === 'completed' ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-700"
                        )}>
                          {camp.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-gray-500">
                        {camp.sent.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-gray-900 font-medium">
                        {camp.clicks > 0 ? (
                          <span className="flex items-center justify-end gap-1">
                            {camp.clicks.toLocaleString()}
                            <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
              <BarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-gray-900 font-medium text-lg mb-1">Detailed Analytics</h3>
              <p className="text-gray-500 text-sm mb-4">Link your Google Analytics or Plausible account to see deep funnels.</p>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                Connect Tracker
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
