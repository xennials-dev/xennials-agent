import React, { useState } from 'react';
import { MessageSquare, Calendar, CheckSquare, Clock, FileText, Bell, Search, Video, Hash, File } from 'lucide-react';
import { cn } from '../utils';

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
}

const CHAT_MSGS: ChatMessage[] = [
  { id: '1', user: 'Alice Walker', avatar: 'A', content: 'Hey team, did we get the final assets from the agency?', timestamp: '10:42 AM' },
  { id: '2', user: 'David Smith', avatar: 'D', content: 'Yes, they are in the shared Drive folder. I linked them in the weekly docs.', timestamp: '10:45 AM' },
  { id: '3', user: 'Sarah Jones', avatar: 'S', content: 'Awesome, I will start drafting the copy around them.', timestamp: '10:50 AM' },
];

export default function ProductivityApp() {
  const [activeChannel, setActiveChannel] = useState('general');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAFAFA]">
      <div className="bg-white border-b border-[#E0E0E0] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-violet-600 text-white p-2 rounded-lg shadow-sm">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-[#3B3B3B]">Productivity Workspace</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64 hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search messages, files, tasks..." 
              className="w-full pl-9 pr-3 py-1.5 bg-gray-100 border-transparent rounded-md text-sm focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
            />
          </div>
          <button className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors relative">
             <Bell className="w-4 h-4" />
             <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-[#E0E0E0] flex flex-col">
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-3 mb-6">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Apps</h3>
              <div className="space-y-0.5">
                <button className="w-full flex items-center gap-2 text-gray-700 hover:bg-gray-200 px-2 py-1.5 rounded-md text-sm font-medium transition-colors">
                  <CheckSquare className="w-4 h-4 text-emerald-600" /> Tasks
                </button>
                <button className="w-full flex items-center gap-2 text-gray-700 hover:bg-gray-200 px-2 py-1.5 rounded-md text-sm font-medium transition-colors">
                  <Calendar className="w-4 h-4 text-blue-600" /> Calendar
                </button>
                <button className="w-full flex items-center gap-2 text-gray-700 hover:bg-gray-200 px-2 py-1.5 rounded-md text-sm font-medium transition-colors">
                  <FileText className="w-4 h-4 text-orange-500" /> Notes
                </button>
              </div>
            </div>

            <div className="px-3">
              <div className="flex items-center justify-between mb-2 px-2">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Channels</h3>
                <button className="text-gray-400 hover:text-gray-600">+</button>
              </div>
              <div className="space-y-0.5">
                {['general', 'design', 'engineering', 'marketing', 'random'].map(chan => (
                  <button 
                    key={chan}
                    onClick={() => setActiveChannel(chan)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
                      activeChannel === chan ? "bg-violet-100 text-violet-800" : "text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    <Hash className="w-4 h-4 opacity-50" /> {chan}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Pane */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Channel Header */}
          <div className="border-b border-gray-100 flex items-center justify-between px-6 py-3">
            <div className="flex flex-col">
              <div className="font-bold text-gray-900 flex items-center gap-1">
                <Hash className="w-4 h-4 text-gray-400" /> {activeChannel}
              </div>
              <span className="text-xs text-gray-500 font-medium">Team discussions and general announcements.</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['A', 'D', 'S'].map((initial, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm z-10">{initial}</div>
                ))}
              </div>
              <button className="text-gray-500 hover:text-violet-600 hover:bg-violet-50 p-2 rounded-md transition-colors">
                <Video className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            <div className="text-center">
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Today</span>
            </div>
            {CHAT_MSGS.map(msg => (
              <div key={msg.id} className="flex gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-100 to-fuchsia-100 border border-violet-200 flex items-center justify-center text-violet-700 font-bold flex-shrink-0">
                  {msg.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-sm text-gray-900">{msg.user}</span>
                    <span className="text-xs text-gray-400 font-medium">{msg.timestamp}</span>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="px-6 py-4">
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden focus-within:ring-1 focus-within:ring-violet-500 focus-within:border-violet-500">
              <textarea 
                className="w-full max-h-32 min-h-[80px] p-3 text-sm focus:outline-none resize-none"
                placeholder={`Message #${activeChannel}...`}
              />
              <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 flex items-center justify-between">
                <div className="flex gap-1">
                   <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded"><File className="w-4 h-4" /></button>
                   <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded"><span className="font-bold text-sm leading-none">@</span></button>
                </div>
                <button className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info Panel Context (Collapsible, shown fixed here) */}
        <div className="w-72 bg-gray-50 border-l border-[#E0E0E0] p-4 hidden lg:flex lg:flex-col">
          <h3 className="font-bold text-sm text-gray-900 mb-4">Channel Details</h3>
          <div className="space-y-4">
             <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
               <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pinned Items</div>
               <div className="space-y-2">
                 <div className="flex gap-2 items-start">
                   <FileText className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                   <div>
                     <p className="text-sm font-medium text-gray-800 leading-tight">Q3 Marketing Strategy.pdf</p>
                   </div>
                 </div>
                 <div className="flex gap-2 items-start">
                   <FileText className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                   <div>
                     <p className="text-sm font-medium text-gray-800 leading-tight">Brand Guidelines 2026</p>
                   </div>
                 </div>
               </div>
             </div>

             <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
               <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Upcoming Tasks</div>
               <div className="space-y-2">
                 <div className="flex gap-2 items-start">
                   <input type="checkbox" className="mt-1 flex-shrink-0 rounded text-violet-600" />
                   <div>
                     <p className="text-sm font-medium text-gray-800 leading-tight">Review weekly newsletter draft</p>
                     <p className="text-xs text-rose-500 mt-0.5">Due Tomorrow</p>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
