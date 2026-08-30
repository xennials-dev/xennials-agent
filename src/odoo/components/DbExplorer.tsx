import React, { useState } from 'react';
import { Database, Search, Library, FileJson, TableProperties } from 'lucide-react';
import { 
  OdooState, 
  CustomOdooModel, 
  DynamicRecord,
  ResPartner,
  ProductProduct,
  CrmLead,
  SaleOrder,
  AccountInvoice,
  StockMove
} from '../types';
import { cn } from '../utils';

interface DbExplorerProps {
  partners: ResPartner[];
  products: ProductProduct[];
  leads: CrmLead[];
  sales: SaleOrder[];
  invoices: AccountInvoice[];
  stockMoves: StockMove[];
  customModels: CustomOdooModel[];
  customRecords: Record<string, DynamicRecord[]>;
}

export default function DbExplorer({
  partners,
  products,
  leads,
  sales,
  invoices,
  stockMoves,
  customModels,
  customRecords,
}: DbExplorerProps) {
  // Database tables static schema representation
  const builtInTables = [
    { name: 'res.partner', desc: 'Partner core directory (users, contacts, vendors)', data: partners },
    { name: 'product.product', desc: 'Product master items details and stocks', data: products },
    { name: 'crm.lead', desc: 'CRM Sales pipeline leads and opportunities', data: leads },
    { name: 'sale.order', desc: 'Quotations and sales order line listings', data: sales },
    { name: 'account.move', desc: 'Accounting customer invoices ledger items', data: invoices },
    { name: 'stock.move', desc: 'Warehouse log product moves tracker', data: stockMoves },
  ];

  const allTables = [
    ...builtInTables,
    ...customModels.map((m) => ({
      name: m.name,
      desc: `Custom compiled model: ${m.className} [Developer Addon]`,
      data: customRecords[m.name] || [],
    })),
  ];

  const [selectedTableName, setSelectedTableName] = useState(allTables[0].name);
  const activeTable = allTables.find((t) => t.name === selectedTableName) || allTables[0];

  return (
    <div className="flex flex-col h-full bg-[#0B0D10] overflow-hidden" id="odoo-db-explorer">
      {/* Header */}
      <div className="bg-[#111419] p-4 border-b border-[#252A33] shrink-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-indigo-400" />
          <div>
            <div className="text-xs text-[#8E95A3] font-semibold tracking-wider uppercase font-mono">Relational Engine</div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">Database Schema Explorer</h2>
          </div>
        </div>
        <span className="text-xs bg-indigo-500/10 text-indigo-400 px-3.5 py-1.5 rounded-lg border border-indigo-500/20 font-bold font-mono">
          Total Tables: {allTables.length} Active System Models
        </span>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Table selector */}
        <div className="w-80 bg-[#111419] border-r border-[#252A33] p-4 space-y-3.5 select-none overflow-y-auto shrink-0 flex flex-col">
          <div className="flex items-center gap-2 font-mono">
            <Library className="h-4 w-4 text-[#8E95A3]" />
            <span className="text-xs font-bold uppercase text-[#8E95A3] tracking-wider">Tables Ledger (PostgreSQL)</span>
          </div>

          <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
            {allTables.map((tbl) => {
              const isSelected = tbl.name === selectedTableName;
              const isCustom = !builtInTables.some((bit) => bit.name === tbl.name);
              return (
                <button
                  key={tbl.name}
                  onClick={() => setSelectedTableName(tbl.name)}
                  className={cn(
                    "w-full text-left p-2.5 rounded-lg text-xs leading-snug transition group block border border-transparent cursor-pointer",
                    isSelected
                      ? "bg-[#1C2129] border border-[#252A33]"
                      : "hover:bg-[#1C2129]/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn("font-bold font-mono text-xs", isSelected ? "text-indigo-400" : "text-zinc-300")}>
                      {tbl.name}
                    </span>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-455 border border-indigo-500/20 px-1.5 py-0.5 rounded-full font-mono font-black shrink-0">
                      {tbl.data.length} row{tbl.data.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#8E95A3] truncate mt-1 group-hover:text-white transition font-normal">{tbl.desc}</div>
                  {isCustom && <span className="text-[8px] mt-1.5 bg-indigo-600 text-white font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider block font-mono">Custom Model</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected table row reader */}
        <div className="flex-1 overflow-hidden flex flex-col bg-[#14171D]">
          <div className="p-3 bg-[#111419] border-b border-[#252A33] flex items-center justify-between shrink-0 select-none">
            <span className="text-xs font-extrabold uppercase text-[#8E95A3] tracking-widest font-mono flex items-center gap-2">
              <TableProperties className="h-4 w-4 text-indigo-400" />
              Rows and Columns layout: {activeTable.name}
            </span>
            <div className="text-[10px] text-[#8E95A3] font-mono uppercase tracking-wider">
              QUERY SELECT * FROM {activeTable.name.replace(/\./g, '_')}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-4">
            {/* If table is empty */}
            {activeTable.data.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-[#252A33] rounded-xl text-center space-y-2 text-[#8E95A3]">
                <FileJson className="h-10 w-10 text-zinc-650" />
                <div>
                  <h4 className="font-bold text-white">Empty Recordset</h4>
                  <p className="text-xs max-w-sm mt-1 leading-relaxed text-[#8E95A3]">There are currently 0 records inside this table. Generate records using the modules UI directly!</p>
                </div>
              </div>
            ) : (
              // JSON Output code explorer
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-[#111419]/50 border border-[#252A33] rounded-lg">
                  <header className="text-[10px] uppercase font-bold text-[#8E95A3] mb-1 font-mono tracking-wider">Table description Metadata</header>
                  <p className="text-xs text-zinc-350 leading-relaxed font-semibold">
                    Table: <strong className="font-mono text-white">{activeTable.name}</strong> has a capacity of {activeTable.data.length} rows. Model tracks relational entity rules correctly.
                  </p>
                </div>

                <div className="bg-[#0B0D10] text-[#00E676] p-4 rounded-xl border border-[#252A33] font-mono text-xs overflow-x-auto shadow-inner leading-relaxed max-h-[60vh]">
                  <pre>{JSON.stringify(activeTable.data, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
