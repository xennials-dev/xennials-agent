import React, { useState } from 'react';
import { Plus, Replace, ClipboardList, Container, RefreshCw, Archive, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { ProductProduct, StockMove } from '../types';
import { cn, formatCurrency, formatDate } from '../utils';

interface InventoryAppProps {
  products: ProductProduct[];
  stockMoves: StockMove[];
  setProducts: React.Dispatch<React.SetStateAction<ProductProduct[]>>;
  addStockMove: (id: string, qty: number, type: 'in' | 'out' | 'adjust', ref: string) => void;
}

export default function InventoryApp({ products, stockMoves, setProducts, addStockMove }: InventoryAppProps) {
  const [activeProduct, setActiveProduct] = useState<ProductProduct | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAdjustmentId, setShowAdjustmentId] = useState<string | null>(null);
  const [adjustmentValue, setAdjustmentValue] = useState('0');

  // New product fields
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('100');
  const [newProdCost, setNewProdCost] = useState('60');
  const [newProdQty, setNewProdQty] = useState('10');
  const [newProdDesc, setNewProdDesc] = useState('');

  // Handle inventory manual adjustment
  const handleStockAdjustment = (product: ProductProduct) => {
    const nextQty = parseInt(adjustmentValue) || 0;
    if (nextQty < 0) return;

    const diff = nextQty - product.qty_available;
    if (diff === 0) return;

    // 1. Commit Product Stock Qty
    const updated: ProductProduct = { ...product, qty_available: nextQty };
    setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    if (activeProduct?.id === product.id) {
      setActiveProduct(updated);
    }

    // 2. Append warehouse logging row
    addStockMove(
      product.id,
      Math.abs(diff),
      diff > 0 ? 'in' : 'out',
      `Manual adjustment ${diff > 0 ? '+' : '-'}${Math.abs(diff)}`
    );

    setShowAdjustmentId(null);
    setAdjustmentValue('0');
  };

  // Create customized Product asset
  const handleCreateProduct = () => {
    if (!newProdName.trim()) return;

    const newId = `product_${Date.now()}`;
    const startingQty = parseInt(newProdQty) || 0;

    const newProd: ProductProduct = {
      id: newId,
      name: newProdName,
      list_price: parseFloat(newProdPrice) || 0,
      standard_price: parseFloat(newProdCost) || 0,
      qty_available: startingQty,
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=150&fit=crop&q=80',
      description: newProdDesc || 'Custom manufactured warehouse asset.',
    };

    setProducts((prev) => [...prev, newProd]);
    if (startingQty > 0) {
      addStockMove(newId, startingQty, 'in', 'Initial warehouse inventory load');
    }

    setNewProdName('');
    setNewProdPrice('100');
    setNewProdCost('60');
    setNewProdQty('10');
    setNewProdDesc('');
    setShowCreateModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0D10] overflow-hidden" id="odoo-inventory-subsystem">
      {/* Inventory Header */}
      <div className="bg-[#111419] p-4 border-b border-[#252A33] flex justify-between items-center shrink-0">
        <div>
          <div className="text-xs text-[#8E95A3] font-semibold tracking-wider uppercase font-mono">Warehouse Management</div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wide">Products & Movements</h2>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 flex gap-4">
        {/* Product Catalog Section */}
        <div className="flex-1 bg-[#14171D] rounded-xl border border-[#252A33] overflow-hidden flex flex-col">
          <div className="p-3 bg-[#111419] border-b border-[#252A33] flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#8E95A3] tracking-widest font-mono">Product Catalog Registry</span>
            <span className="text-xs font-semibold text-[#8E95A3]">Master entries: {products.length}</span>
          </div>

          <div className="grid grid-cols-2 p-4 gap-3 overflow-y-auto flex-1">
            {products.map((product) => {
              const profitMargin = ((product.list_price - product.standard_price) / product.list_price) * 100;
              return (
                <div
                  key={product.id}
                  onClick={() => setActiveProduct(product)}
                  className={cn(
                    "p-3 border rounded-xl hover:bg-[#1C2129]/40 cursor-pointer transition select-none flex gap-3.5 items-center",
                    activeProduct?.id === product.id ? "border-indigo-500 bg-[#161920] shadow-sm" : "border-[#252A33] bg-[#111419]/30"
                  )}
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={product.image_url}
                    alt={product.name}
                    className="h-14 w-14 rounded-lg object-cover shrink-0 border border-[#252A33] shadow-inner"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-indigo-400 text-xs truncate uppercase tracking-wider">
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-[#8E95A3] mt-0.5 line-clamp-1">{product.description}</p>
                    <div className="flex gap-4 mt-1.5 text-[11px] font-semibold text-[#8E95A3]">
                      <span>Sale: <strong className="text-white font-mono">{formatCurrency(product.list_price)}</strong></span>
                      <span>Margin: <strong className="text-emerald-400 font-mono font-bold">{profitMargin.toFixed(0)}%</strong></span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-[#8E95A3] block tracking-wider font-mono">On Hand</span>
                    <span
                      className={cn(
                        "text-sm font-black font-mono",
                        product.qty_available === 0 ? "text-red-400" : "text-indigo-400"
                      )}
                    >
                      {product.qty_available} units
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Product Adjustments & Logging Ledger */}
        {activeProduct && (
          <div className="w-96 bg-[#14171D] rounded-xl border border-[#252A33] flex flex-col overflow-hidden">
            <div className="p-4 bg-[#111419] border-b border-[#252A33]">
              <span className="text-[10px] font-bold text-[#8E95A3] uppercase tracking-widest block font-mono">
                Product Quants Details
              </span>
              <div className="flex justify-between items-center mt-1">
                <h3 className="font-bold text-white text-sm truncate pr-2">{activeProduct.name}</h3>
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full shrink-0">
                  {activeProduct.qty_available} on-hand
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-normal">
              {/* Manual stock adjustment panel triggers */}
              <div className="bg-[#111419]/50 border border-[#252A33] p-3 rounded-lg space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#8E95A3] uppercase flex items-center gap-1 font-mono">
                    <Replace className="h-3 w-3 text-indigo-400" />
                    Physical Stock Adjustment
                  </span>
                  {showAdjustmentId !== activeProduct.id ? (
                    <button
                      onClick={() => {
                        setShowAdjustmentId(activeProduct.id);
                        setAdjustmentValue(String(activeProduct.qty_available));
                      }}
                      className="text-[10px] bg-indigo-600 text-white px-2.5 py-1 rounded font-bold hover:bg-indigo-700"
                    >
                      Update Count
                    </button>
                  ) : (
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="number"
                        value={adjustmentValue}
                        onChange={(e) => setAdjustmentValue(e.target.value)}
                        className="w-16 text-xs bg-[#1A1E24] text-white border border-[#252A33] p-1 rounded font-bold text-center focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleStockAdjustment(activeProduct)}
                        className="text-[10px] bg-emerald-600 text-white px-2 py-1 rounded font-bold hover:bg-emerald-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setShowAdjustmentId(null)}
                        className="text-[10px] bg-[#252A33] text-white px-2 py-1 rounded hover:bg-[#2D333E]"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-[#8E95A3] leading-relaxed font-semibold">
                  Update inventory quants directly to log manual audit counts. Odoo will append corresponding corrective moves.
                </p>
              </div>

              {/* Warehouse Moves related to product */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-[#8E95A3] uppercase tracking-widest block font-mono">
                  Product Warehouse Ledger
                </span>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {stockMoves.filter((m) => m.product_id === activeProduct.id).length === 0 ? (
                    <div className="text-xs text-[#8E95A3] py-4 text-center font-semibold font-mono">No movement logs registered</div>
                  ) : (
                    stockMoves
                      .filter((m) => m.product_id === activeProduct.id)
                      .map((move) => {
                        return (
                          <div key={move.id} className="p-2 border border-[#252A33] rounded bg-[#111419]/30 flex justify-between items-center">
                            <div>
                              <div className="text-xs font-bold text-white font-mono">{move.reference}</div>
                              <div className="text-[9px] text-[#8E95A3] font-mono">{formatDate(move.date)}</div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {move.type === 'in' ? (
                                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                              ) : (
                                <ArrowDownRight className="h-3.5 w-3.5 text-red-400 shrink-0" />
                              )}
                              <span className={cn("text-xs font-bold font-mono", move.type === 'in' ? "text-emerald-400" : "text-red-400")}>
                                {move.type === 'in' ? '+' : '-'}{move.qty}
                              </span>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#111419] border-t border-[#252A33] flex justify-end">
              <button
                onClick={() => setActiveProduct(null)}
                className="bg-[#252A33] border border-[#252A33] text-[#E0E2E6] px-4 py-2 rounded text-xs hover:bg-[#2D333E] font-bold transition"
              >
                Close details
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE PRODUCT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#14171D] rounded-xl border border-[#252A33] shadow-2xl w-full max-w-sm flex flex-col overflow-hidden">
            <div className="p-4 bg-[#111419] border-b border-[#252A33] flex justify-between items-center text-white">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block font-mono">ERP Catalog Registry</span>
                <h3 className="font-bold text-white text-base">Add New Product Master</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#8E95A3] hover:text-white font-extrabold text-sm transition"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E95A3] block mb-1 font-mono">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Executive Oak Table"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full text-xs bg-[#1A1E24] text-white border border-[#252A33] p-2 rounded-lg font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8E95A3] block mb-1 font-mono">Sale Price ($)</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full text-xs bg-[#1A1E24] text-white border border-[#252A33] p-2 rounded-lg font-bold font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8E95A3] block mb-1 font-mono">Production Cost ($)</label>
                  <input
                    type="number"
                    value={newProdCost}
                    onChange={(e) => setNewProdCost(e.target.value)}
                    className="w-full text-xs bg-[#1A1E24] text-white border border-[#252A33] p-2 rounded-lg font-bold font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E95A3] block mb-1 font-mono">Initial Stock Count (Qty)</label>
                <input
                  type="number"
                  value={newProdQty}
                  onChange={(e) => setNewProdQty(e.target.value)}
                  className="w-full text-xs bg-[#1A1E24] text-white border border-[#252A33] p-2 rounded-lg font-bold font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E95A3] block mb-1 font-mono">Catalog Description</label>
                <textarea
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full text-xs bg-[#1A1E24] text-white border border-[#252A33] p-2 rounded-lg focus:outline-none focus:border-indigo-500 min-h-[60px]"
                  rows={2}
                  placeholder="Brief details about material size or dimensions..."
                />
              </div>
            </div>

            <div className="p-3 bg-[#111419] border-t border-[#252A33] flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-xs text-[#8E95A3] hover:text-white px-4 py-2 hover:bg-[#1A1E24] rounded-md font-bold transition"
              >
                Discard
              </button>
              <button
                onClick={handleCreateProduct}
                className="text-xs bg-indigo-600 text-white px-5 py-2 rounded-md font-bold hover:bg-indigo-700 transition"
              >
                Create Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
