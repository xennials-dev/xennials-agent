import React, { useState } from 'react';
import { Plus, Check, Trash2, ShieldAlert, ShoppingBag, FileText, BadgeDollarSign } from 'lucide-react';
import { SaleOrder, ResPartner, ProductProduct, AccountInvoice } from '../types';
import { cn, formatCurrency, formatDate } from '../utils';

interface SalesAppProps {
  sales: SaleOrder[];
  partners: ResPartner[];
  products: ProductProduct[];
  setSales: React.Dispatch<React.SetStateAction<SaleOrder[]>>;
  setInvoices: React.Dispatch<React.SetStateAction<AccountInvoice[]>>;
  setProducts: React.Dispatch<React.SetStateAction<ProductProduct[]>>;
  addStockMove: (id: string, qty: number, type: 'in' | 'out' | 'adjust', ref: string) => void;
  setActiveAppId: (id: string) => void;
}

export default function SalesApp({
  sales,
  partners,
  products,
  setSales,
  setInvoices,
  setProducts,
  addStockMove,
  setActiveAppId,
}: SalesAppProps) {
  const [activeSale, setActiveSale] = useState<SaleOrder | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState(partners[0]?.id || '');

  // Master quote order lines creation buffer
  const [draftLines, setDraftLines] = useState<{ product_id: string; qty: number }[]>([]);
  const [addLineProductId, setAddLineProductId] = useState(products[0]?.id || '');
  const [addLineQty, setAddLineQty] = useState(1);

  // Add line to draft lines
  const handleAddDraftLine = () => {
    if (addLineQty <= 0) return;
    setDraftLines((prev) => {
      const existing = prev.find((l) => l.product_id === addLineProductId);
      if (existing) {
        return prev.map((l) => (l.product_id === addLineProductId ? { ...l, qty: l.qty + addLineQty } : l));
      }
      return [...prev, { product_id: addLineProductId, qty: addLineQty }];
    });
    setAddLineQty(1);
  };

  const handleCreateQuotation = () => {
    if (draftLines.length === 0) return;

    // Calculate totals
    let untaxed = 0;
    const lines = draftLines.map((line, idx) => {
      const prod = products.find((p) => p.id === line.product_id);
      const rate = prod?.list_price || 0;
      const subtotal = rate * line.qty;
      untaxed += subtotal;

      return {
        id: `sol_${Date.now()}_${idx}`,
        product_id: line.product_id,
        product_uom_qty: line.qty,
        price_unit: rate,
        price_subtotal: subtotal,
      };
    });

    const tax = untaxed * 0.15; // 15% VAT
    const total = untaxed + tax;

    const newSale: SaleOrder = {
      id: `sale_order_${Date.now()}`,
      name: `SO${String(sales.length + 1).padStart(3, '0')}`,
      partner_id: selectedPartnerId,
      date_order: new Date().toISOString().split('T')[0],
      state: 'draft',
      amount_untaxed: untaxed,
      amount_tax: tax,
      amount_total: total,
      order_line: lines,
    };

    setSales((prev) => [newSale, ...prev]);
    setDraftLines([]);
    setShowCreateModal(false);
  };

  // State workflow: Confirm Quotation -> Sales Order
  const handleConfirmOrder = (order: SaleOrder) => {
    // 1. Decrease product inventory counts and create corresponding warehouse movement logs
    order.order_line.forEach((line) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === line.product_id ? { ...p, qty_available: Math.max(0, p.qty_available - line.product_uom_qty) } : p))
      );
      addStockMove(line.product_id, line.product_uom_qty, 'out', `${order.name} Release`);
    });

    // 2. Commit Order state
    const updatedOrder: SaleOrder = { ...order, state: 'sale' };
    setSales((prev) => prev.map((s) => (s.id === order.id ? updatedOrder : s)));
    if (activeSale?.id === order.id) {
      setActiveSale(updatedOrder);
    }
  };

  // State workflow: Create Invoice from Confirmed Sales Order
  const handleCreateInvoice = (order: SaleOrder) => {
    const invoiceId = `account_invoice_${Date.now()}`;
    const newInvoice: AccountInvoice = {
      id: invoiceId,
      name: `INV/2026/${String(Math.floor(Math.random() * 9000) + 1000)}`,
      partner_id: order.partner_id,
      invoice_date: new Date().toISOString().split('T')[0],
      state: 'draft',
      payment_state: 'not_paid',
      amount_untaxed: order.amount_untaxed,
      amount_tax: order.amount_tax,
      amount_total: order.amount_total,
      invoice_line: order.order_line.map((l, idx) => ({
        id: `ail_${Date.now()}_${idx}`,
        product_id: l.product_id,
        product_uom_qty: l.product_uom_qty,
        price_unit: l.price_unit,
        price_subtotal: l.price_subtotal,
      })),
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    setActiveSale(null);
    setActiveAppId('invoices'); // Switch automatically to invoice app to let user preview or generate receipt
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0D10] overflow-hidden" id="odoo-sales-module">
      {/* Sales Actions Header */}
      <div className="bg-[#111419] p-4 border-b border-[#252A33] flex justify-between items-center shrink-0">
        <div>
          <div className="text-xs text-[#8E95A3] font-semibold tracking-wider uppercase font-mono">Sales Operation Module</div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wide">Quotations & Orders</h2>
        </div>
        <button
          onClick={() => {
            setSelectedPartnerId(partners[0]?.id || '');
            setDraftLines([]);
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>New Quotation</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 flex gap-4">
        {/* Quotations List Table */}
        <div className="flex-1 bg-[#14171D] rounded-xl border border-[#252A33] overflow-hidden flex flex-col">
          <div className="p-3.5 bg-[#111419] border-b border-[#252A33] flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#8E95A3] tracking-widest font-mono">ERP Sales Ledger</span>
            <span className="text-xs font-semibold text-[#8E95A3]">Total orders: {sales.length}</span>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#252A33] text-[10px] font-bold uppercase text-[#8E95A3] bg-[#111419]/50">
                <th className="p-3 font-mono">Reference</th>
                <th className="p-3">Order Date</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#252A33]">
              {sales.map((order) => {
                const partner = partners.find((p) => p.id === order.partner_id);
                return (
                  <tr
                    key={order.id}
                    onClick={() => setActiveSale(order)}
                    className={cn(
                      "hover:bg-[#1C2129]/60 cursor-pointer transition-colors duration-150",
                      activeSale?.id === order.id ? "bg-[#161920] font-semibold border-l-4 border-l-indigo-500" : ""
                    )}
                  >
                    <td className="p-3 text-indigo-400 font-mono font-bold">{order.name}</td>
                    <td className="p-3 text-[#8E95A3]">{formatDate(order.date_order)}</td>
                    <td className="p-3 text-white font-medium">{partner?.name || 'Standard Walk-in'}</td>
                    <td className="p-3 text-white font-semibold font-mono">{formatCurrency(order.amount_total)}</td>
                    <td className="p-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border",
                          order.state === 'sale'
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-[#252A33] text-[#8E95A3] border-transparent"
                        )}
                      >
                        {order.state === 'sale' ? 'Sales Order' : 'Quotation'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Quotation / Sales Order Detail Panel */}
        {activeSale && (
          <div className="w-96 bg-[#14171D] rounded-xl border border-[#252A33] flex flex-col overflow-hidden">
            <div className="p-4 bg-[#111419] border-b border-[#252A33]">
              <span className="text-[10px] font-bold text-[#8E95A3] uppercase tracking-widest block font-mono">
                Order details sheet
              </span>
              <div className="flex justify-between items-center mt-1">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-indigo-450" />
                  {activeSale.name}
                </h3>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] uppercase font-bold border",
                    activeSale.state === 'sale' 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-[#252A33] text-[#8E95A3] border-transparent"
                  )}
                >
                  {activeSale.state === 'sale' ? 'Confirmed' : 'Draft'}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Partner Overview */}
              <div>
                <label className="text-[9px] font-semibold text-[#8E95A3] uppercase font-mono tracking-wider">Customer Information</label>
                <div className="text-xs text-white font-bold mt-1">
                  {partners.find((p) => p.id === activeSale.partner_id)?.name || 'Direct Enterprise Client'}
                </div>
              </div>

              {/* Order Lines */}
              <div className="space-y-2">
                <label className="text-[9px] font-semibold text-[#8E95A3] uppercase font-mono tracking-wider">Ordered Products ({activeSale.order_line.length})</label>
                <div className="border border-[#252A33] rounded-lg divide-y divide-[#252A33] overflow-hidden">
                  {activeSale.order_line.map((line) => {
                    const prod = products.find((p) => p.id === line.product_id);
                    return (
                      <div key={line.id} className="p-2.5 flex justify-between items-center bg-[#111419]/30">
                        <div>
                          <div className="text-xs font-semibold text-white truncate max-w-[150px]">{prod?.name || 'Deleted Product'}</div>
                          <div className="text-[10px] text-[#8E95A3] font-mono mt-0.5">
                            {line.product_uom_qty} x {formatCurrency(line.price_unit)}
                          </div>
                        </div>
                        <div className="text-xs font-bold text-white font-mono">{formatCurrency(line.price_subtotal)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Subtotal metrics */}
              <div className="space-y-1.5 pt-3 border-t border-[#252A33] text-xs">
                <div className="flex justify-between text-[#8E95A3]">
                  <span>Untaxed Amount:</span>
                  <span className="font-mono">{formatCurrency(activeSale.amount_untaxed)}</span>
                </div>
                <div className="flex justify-between text-[#8E95A3]">
                  <span>VAT Tax (15%):</span>
                  <span className="font-mono">{formatCurrency(activeSale.amount_tax)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-dashed border-[#252A33]">
                  <span>Total Due:</span>
                  <span className="text-indigo-400 font-mono">{formatCurrency(activeSale.amount_total)}</span>
                </div>
              </div>

              {/* CRM Contextual alert for inventory constraints */}
              {activeSale.state === 'draft' && (
                <div className="p-2.5 bg-amber-500/10 text-amber-500 text-[10px] font-semibold rounded border border-amber-500/20 flex gap-2">
                  <ShieldAlert className="h-4 w-4 select-none shrink-0 text-amber-500" />
                  <span>Confirming this quote commits stock moves and subtracts quantities from inventory warehouse quants.</span>
                </div>
              )}
            </div>

            {/* Workflow Control Buttons */}
            <div className="p-3 bg-[#111419] border-t border-[#252A33] flex gap-2">
              {activeSale.state === 'draft' ? (
                <button
                  onClick={() => handleConfirmOrder(activeSale)}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-indigo-700 transition"
                >
                  <Check className="h-3.5 w-3.5" />
                  Confirm Sale
                </button>
              ) : (
                <button
                  onClick={() => handleCreateInvoice(activeSale)}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-indigo-700 transition shadow-sm"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Create Invoice
                </button>
              )}
              <button
                onClick={() => setActiveSale(null)}
                className="bg-[#252A33] text-[#E0E2E6] px-4 py-2 rounded text-xs hover:bg-[#2D333E] font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE QUOTATION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#14171D] rounded-xl border border-[#252A33] shadow-2xl w-full max-w-xl flex flex-col overflow-hidden max-h-[85vh]">
            <div className="p-4 bg-[#111419] border-b border-[#252A33] flex justify-between items-center">
              <div>
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block font-mono">ERP Quotation generator</span>
                <h3 className="font-extrabold text-white text-base">Generate New Sales Quotation</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-500 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Select Customer */}
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E95A3] font-mono block mb-1.5">Customer / Partner</label>
                <select
                  value={selectedPartnerId}
                  onChange={(e) => setSelectedPartnerId(e.target.value)}
                  className="w-full text-xs bg-[#0B0D10] border border-[#252A33] text-white p-2.5 rounded-lg font-semibold focus:outline-none"
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.city}, {p.country})
                    </option>
                  ))}
                </select>
              </div>

              {/* Add Order Lines Controls */}
              <div className="border border-[#252A33] rounded-lg p-3 bg-[#111419]/50">
                <label className="text-[10px] uppercase font-bold text-[#8E95A3] block mb-2 font-mono">Quotation Items Assembler</label>
                <div className="flex gap-2.5 items-end">
                  <div className="flex-1">
                    <label className="text-[9px] uppercase font-bold text-[#8E95A3] block mb-1">Product</label>
                    <select
                      value={addLineProductId}
                      onChange={(e) => setAddLineProductId(e.target.value)}
                      className="w-full text-xs bg-[#0B0D10] border border-[#252A33] text-white p-2 rounded-md focus:outline-none"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - {formatCurrency(p.list_price)} (Stock: {p.qty_available})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-[#8E95A3] block mb-1">Qty</label>
                    <input
                      type="number"
                      value={addLineQty}
                      onChange={(e) => setAddLineQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-xs bg-[#0B0D10] border border-[#252A33] text-white p-2 rounded-md focus:outline-none font-mono"
                    />
                  </div>
                  <button
                    onClick={handleAddDraftLine}
                    className="bg-indigo-600 text-white px-4 py-2 text-xs rounded-md font-bold hover:bg-indigo-750 transition"
                  >
                    Add Line
                  </button>
                </div>
              </div>

              {/* Active Lines Overview */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-[#8E95A3] block font-mono">Current lines draft ({draftLines.length})</label>
                {draftLines.length === 0 ? (
                  <div className="h-20 flex items-center justify-center border-2 border-dashed border-[#252A33] rounded-lg text-xs text-[#8E95A3]">
                    No items added to quotation yet. Please add at least one line above.
                  </div>
                ) : (
                  <div className="border border-[#252A33] rounded-lg divide-y divide-[#252A33] max-h-48 overflow-y-auto">
                    {draftLines.map((line, index) => {
                      const prod = products.find((p) => p.id === line.product_id);
                      return (
                        <div key={index} className="p-2.5 flex justify-between items-center text-xs bg-[#111419]/30">
                          <div>
                            <span className="font-bold text-white">{prod?.name}</span>
                            <span className="text-[#8E95A3] font-mono ml-2">[{line.qty} units]</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-indigo-400 font-mono">
                              {formatCurrency((prod?.list_price || 0) * line.qty)}
                            </span>
                            <button
                              onClick={() => setDraftLines((prev) => prev.filter((_, idx) => idx !== index))}
                              className="text-red-400 hover:text-red-500 p-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-[#111419] border-t border-[#252A33] flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-xs text-[#8E95A3] px-4 py-2 hover:bg-[#1C2129] rounded font-bold"
              >
                Discard
              </button>
              <button
                onClick={handleCreateQuotation}
                disabled={draftLines.length === 0}
                className={cn(
                  "text-xs bg-indigo-600 text-white px-5 py-2 rounded font-bold transition",
                  draftLines.length === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-indigo-700"
                )}
              >
                Save Quotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
