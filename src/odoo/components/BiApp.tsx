import React, { useState } from 'react';
import { PieChart, LineChart as LineChartIcon, BarChart3, Database, FileSpreadsheet, Download, Filter, Maximize2 } from 'lucide-react';
import { cn } from '../utils';

export default function BiApp() {
  const [activeTab, setActiveTab] = useState<'dashboards' | 'spreadsheets'>('dashboards');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAFAFA]">
      <div className="bg-white border-b border-[#E0E0E0] px-4 py-3 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-teal-600 text-white p-2 rounded-lg shadow-sm">
            <PieChart className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-[#3B3B3B]">Spreadsheet BI Explorer</h1>
          
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          
          <div className="flex space-x-1">
            <button 
              onClick={() => setActiveTab('dashboards')}
              className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2", activeTab === 'dashboards' ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50")}
            >
              <BarChart3 className="w-4 h-4" /> Dashboards
            </button>
            <button 
              onClick={() => setActiveTab('spreadsheets')}
              className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2", activeTab === 'spreadsheets' ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50")}
            >
              <FileSpreadsheet className="w-4 h-4" /> Spreadsheets
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded text-sm font-medium transition-colors border border-gray-200 flex items-center gap-1.5">
            <Filter className="w-4 h-4" /> Global Filters
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm">
            New Report
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-gray-50/50">
        {activeTab === 'dashboards' ? (
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-gray-900 mt-2">Executive Summary Overview</h2>
              <div className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                Data sources synced: <span className="text-emerald-600 font-bold">Sales, CRM, Invoicing</span> (Live)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { title: "Total Revenue (MoM)", value: "$4.12M", trend: "+12.4%", up: true },
                { title: "Avg Deal Size", value: "$12,450", trend: "+2.1%", up: true },
                { title: "Pipeline Value", value: "$8.5M", trend: "-1.2%", up: false },
                { title: "Customer Acc. Cost", value: "$420", trend: "-5.4%", up: true }, // Lower CAC is good
              ].map((metric, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">{metric.title}</h3>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</div>
                  <div className={cn("text-xs font-bold", metric.up ? "text-emerald-600" : "text-rose-600")}>
                    {metric.trend} vs last month
                  </div>
                  
                  {/* Decorative chart bg */}
                  <div className="absolute right-0 bottom-0 opacity-5 -mr-4 -mb-4 group-hover:opacity-10 transition-opacity">
                    <LineChartIcon className="w-32 h-32" />
                  </div>
                </div>
              ))}
            </div>

            {/* Visualizer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[400px]">
              <div className="col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col p-4">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-gray-900 text-sm">Revenue by Region</h3>
                   <button className="text-gray-400 hover:text-gray-600"><Maximize2 className="w-4 h-4" /></button>
                 </div>
                 <div className="flex-1 bg-gray-50 rounded border border-gray-100 flex items-center justify-center relative overflow-hidden">
                    {/* Simulated Bar Chart */}
                    <div className="absolute inset-0 flex items-end justify-around px-8 pt-12 pb-8">
                       {[40, 70, 45, 90, 60, 30, 80].map((h, i) => (
                         <div key={i} className="w-12 bg-gradient-to-t from-teal-600 to-teal-400 rounded-t shadow-sm group relative" style={{ height: `${h}%` }}>
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">${h}k</div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="col-span-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col p-4">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-gray-900 text-sm">Lead Conversion</h3>
                 </div>
                 <div className="flex-1 bg-gray-50 rounded border border-gray-100 flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-40 h-40 relative">
                        <svg className="w-full h-full transform -rotate-90">
                           <circle cx="80" cy="80" r="70" fill="none" stroke="#f3f4f6" strokeWidth="20" />
                           <circle cx="80" cy="80" r="70" fill="none" stroke="#0d9488" strokeWidth="20" strokeDasharray="440" strokeDashoffset="140" className="transition-all duration-1000 ease-out" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                           <span className="text-2xl font-bold text-gray-900">68%</span>
                           <span className="text-xs text-gray-500 font-medium tracking-wide">WON</span>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto h-[600px] bg-white border border-gray-300 rounded-xl shadow-sm flex flex-col overflow-hidden">
            {/* Spreadsheet Toolbar */}
            <div className="bg-gray-100 border-b border-gray-300 p-2 flex gap-1">
               <button className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700">File</button>
               <button className="px-3 py-1 hover:bg-gray-200 rounded text-sm font-medium text-gray-700">Edit</button>
               <button className="px-3 py-1 hover:bg-gray-200 rounded text-sm font-medium text-gray-700">View</button>
               <button className="px-3 py-1 hover:bg-gray-200 rounded text-sm font-medium text-gray-700">Insert</button>
               <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
               <button className="px-3 py-1 hover:bg-gray-200 rounded text-sm font-medium text-gray-700">Format</button>
               <button className="px-3 py-1 hover:bg-gray-200 rounded text-sm font-medium text-gray-700">Data</button>
               
               <div className="ml-auto">
                 <button className="px-3 py-1 hover:bg-gray-200 text-emerald-600 rounded text-sm font-bold flex items-center gap-1">
                   <Download className="w-4 h-4" /> Export CSV
                 </button>
               </div>
            </div>
            
            {/* Spreadsheet Formula Bar */}
            <div className="bg-white border-b border-gray-300 p-2 flex gap-2 items-center">
              <div className="w-10 text-center font-mono text-sm text-gray-500 font-bold bg-gray-100 py-1 border border-gray-200">fx</div>
              <input type="text" className="flex-1 px-3 py-1 font-mono text-sm border border-transparent focus:border-emerald-500 focus:outline-none" defaultValue="=SUM(DynamicRecords!EstateProperty[expected_price])" />
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-auto bg-gray-50 flex">
              <div className="bg-gray-100 border-r border-gray-300 w-12 flex flex-col items-center">
                <div className="h-8 border-b border-gray-300 w-full"></div>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                  <div key={i} className="h-8 border-b border-gray-300 w-full flex items-center justify-center text-xs text-gray-500 font-mono">{i}</div>
                ))}
              </div>
              
              <div className="flex-1">
                 <div className="flex border-b border-gray-300 bg-gray-100">
                    {['A', 'B', 'C', 'D', 'E', 'F'].map(l => (
                      <div key={l} className="w-32 h-8 border-r border-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">{l}</div>
                    ))}
                 </div>
                 
                 {/* Fake Data Rows */}
                 {[1,2,3,4,5,6,7,8,9,10,11,12].map((row) => (
                    <div key={row} className="flex border-b border-gray-200 group">
                      {['A', 'B', 'C', 'D', 'E', 'F'].map((col, idx) => (
                        <div key={col} className={cn(
                          "w-32 h-8 border-r border-gray-200 px-2 py-1 text-sm bg-white overflow-hidden text-ellipsis whitespace-nowrap",
                          row === 1 && idx === 0 && "bg-blue-50/50 border-blue-200 shadow-[inset_0_0_0_1px_#3b82f6] relative z-10" 
                        )}>
                          {row === 1 && idx === 0 ? "4,120,000.00" : row % 2 !== 0 && idx % 3 === 0 ? "Pending" : ""}
                        </div>
                      ))}
                    </div>
                 ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
