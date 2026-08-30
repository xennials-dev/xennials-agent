import React, { useState } from 'react';
import { Plus, GraduationCap, Home, ShieldCheck, Database, FileText, Upload } from 'lucide-react';
import { CustomOdooAddon, CustomOdooModel, DynamicRecord } from '../types';
import { parseOdooXML, cn } from '../utils';

interface CustomAppRendererProps {
  addon: CustomOdooAddon;
  model: CustomOdooModel | undefined;
  records: DynamicRecord[];
  setCustomRecords: React.Dispatch<React.SetStateAction<Record<string, DynamicRecord[]>>>;
}

export default function CustomAppRenderer({
  addon,
  model,
  records,
  setCustomRecords,
}: CustomAppRendererProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formFieldsState, setFormFieldsState] = useState<Record<string, any>>({});

  // Parse fields to display in list view
  const visibleFields = model ? parseOdooXML(addon.xml_view_code) : [];

  const handleCreateRecord = () => {
    if (!model) return;

    // Build model default fields
    const newRecord: DynamicRecord = {
      id: `custom_rec_${Date.now()}`,
    };

    model.fields.forEach((f) => {
      const val = formFieldsState[f.name];
      if (val !== undefined) {
        newRecord[f.name] = val;
      } else {
        newRecord[f.name] = f.type === 'boolean' ? false : f.type === 'integer' || f.type === 'float' ? 0 : '';
      }
    });

    if (formFieldsState._record_photo) {
      newRecord._record_photo = formFieldsState._record_photo;
    }

    setCustomRecords((prev) => {
      const existing = prev[model.name] || [];
      return {
        ...prev,
        [model.name]: [newRecord, ...existing],
      };
    });

    setFormFieldsState({});
    setShowAddForm(false);
  };

  if (!model) {
    return (
      <div className="flex-1 bg-[#0B0D10] p-6 flex items-center justify-center text-center select-none">
        <div className="max-w-md space-y-3.5 bg-[#14171D] p-6 rounded-xl border border-[#252A33] shadow-md flex flex-col items-center">
          <Database className="h-10 w-10 text-indigo-400 mx-auto animate-pulse" />
          <h3 className="font-extrabold text-sm text-white">Model Definition Stale</h3>
          <p className="text-xs text-[#8E95A3] leading-relaxed font-normal">
            Database schema and model definition not compiled for this module yet. Please open the "Studio Module Editor", ensure class definitions are correct, and click "Compile & Install Addon" to bind schemas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0B0D10] overflow-hidden" id="custom-app-renderer">
      {/* Header */}
      <div className="bg-[#111419] p-4 border-b border-[#252A33] flex justify-between items-center shrink-0">
        <div>
          <div className="text-xs text-[#8E95A3] font-semibold tracking-wider uppercase font-mono">Custom ERP Database App</div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {addon.shortdesc}
            <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              model: {model.name}
            </span>
          </h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition cursor-pointer text-xs animate-none"
        >
          <Plus className="h-4 w-4" />
          <span>Add Record entry</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 flex gap-4">
        {/* Records tree listing view */}
        <div className="flex-1 bg-[#14171D] rounded-xl border border-[#252A33] shadow-sm overflow-hidden flex flex-col">
          <div className="p-3 bg-[#111419] border-b border-[#252A33] flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#8E95A3] tracking-wider font-mono">
              PostgreSQL Relation: {model.name.replace(/\./g, '_')}
            </span>
            <span className="text-xs font-semibold text-[#8E95A3] font-mono">Total Entries: {records.length}</span>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#252A33] text-[10px] font-bold uppercase text-[#8E95A3] bg-[#111419]/50">
                <th className="p-3 w-16">Photo</th>
                <th className="p-3">ID Reference</th>
                {visibleFields.map((fName) => {
                  const mField = model.fields.find((field) => field.name === fName);
                  return (
                    <th key={fName} className="p-3">
                      {mField?.string || fName}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#252A33] font-medium text-zinc-350">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={visibleFields.length + 2} className="p-8 text-center text-[#8E95A3]">
                    No records found inside this custom database module. Create some entries by clicking "Add Record entry" on the header.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#1C2129]/30 transition">
                    <td className="p-3">
                      {rec._record_photo ? (
                        <div className="relative group w-8 h-8 rounded-full overflow-hidden border border-indigo-500/20">
                          <img 
                            src={rec._record_photo} 
                            alt="Record inline" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-800/80 border border-white/5 flex items-center justify-center text-[10px] font-mono font-bold text-gray-500 uppercase">
                          {model.className.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-[#8E95A3] font-mono text-[10px] uppercase font-bold">{rec.id.substring(11)}</td>
                    {visibleFields.map((fName) => {
                      const mField = model.fields.find((f) => f.name === fName);
                      const val = rec[fName];

                      let strVal = String(val);
                      if (mField?.type === 'boolean') {
                        strVal = val ? 'Yes' : 'No';
                      }

                      return (
                        <td key={fName} className={cn("p-3 text-white", mField?.type === 'boolean' ? "font-bold text-emerald-450" : "")}>
                          {strVal}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD RECORD POPUP DIALOG */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#14171D] rounded-xl border border-[#252A33] shadow-xl w-full max-w-md flex flex-col overflow-hidden text-white">
            <div className="p-4 bg-[#111419] border-b border-[#252A33] flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block font-mono">Odoo record form template</span>
                <h3 className="font-bold text-white text-base">New {addon.shortdesc} Entry</h3>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-[#8E95A3] hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              {model.fields.map((field) => {
                return (
                  <div key={field.name} className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#8E95A3] block font-mono">{field.string} ({field.type.toUpperCase()})</label>
                    {field.type === 'boolean' ? (
                      <div className="flex items-center gap-2 mt-1 py-1.5">
                        <input
                          type="checkbox"
                          checked={formFieldsState[field.name] || false}
                          onChange={(e) => setFormFieldsState((prev) => ({ ...prev, [field.name]: e.target.checked }))}
                          className="h-4 w-4 bg-[#1A1E24] border border-[#252A33] text-indigo-600 rounded focus:ring-0 accent-indigo-600 cursor-pointer"
                        />
                        <span className="text-xs text-[#8E95A3] font-semibold">Flag value as True</span>
                      </div>
                    ) : field.type === 'integer' || field.type === 'float' ? (
                      <input
                        type="number"
                        step={field.type === 'float' ? '0.01' : '1'}
                        value={formFieldsState[field.name] || ''}
                        onChange={(e) => setFormFieldsState((prev) => ({ ...prev, [field.name]: parseFloat(e.target.value) || 0 }))}
                        className="w-full text-xs bg-[#1A1E24] text-white border border-[#252A33] p-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
                      />
                    ) : (
                      <input
                        type="text"
                        value={formFieldsState[field.name] || ''}
                        onChange={(e) => setFormFieldsState((prev) => ({ ...prev, [field.name]: e.target.value }))}
                        className="w-full text-xs bg-[#1A1E24] text-white border border-[#252A33] p-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-[#111419] border-t border-[#252A33] flex justify-between items-center text-xs">
              {/* Photo Upload Handler inside the footer as targeted */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="record-photo-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormFieldsState((prev) => ({ ...prev, _record_photo: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button
                  type="button"
                  id="trigger-photo-upload-selector"
                  onClick={() => document.getElementById('record-photo-upload')?.click()}
                  className="flex items-center gap-1.5 bg-[#1C2129] hover:bg-[#252B35] text-zinc-300 hover:text-white px-3 py-2 rounded-lg font-bold transition cursor-pointer border border-[#2D3442]"
                >
                  <Upload className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{formFieldsState._record_photo ? "Change Photo" : "Upload Photo"}</span>
                </button>
                {formFieldsState._record_photo && (
                  <div className="relative group w-8 h-8 rounded-lg overflow-hidden border border-indigo-500/25">
                    <img 
                      src={formFieldsState._record_photo} 
                      alt="Attach Preview" 
                      className="w-full h-full object-cover" 
                    />
                    <button
                      type="button"
                      onClick={() => setFormFieldsState((prev) => ({ ...prev, _record_photo: undefined }))}
                      className="absolute inset-0 bg-red-650/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-[9px] font-bold text-white uppercase font-mono"
                    >
                      Del
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-[#8E95A3] px-4 py-2 hover:bg-[#1A1E24] rounded-lg font-bold hover:text-white transition cursor-pointer"
                >
                  Discard
                </button>
                <button
                  onClick={handleCreateRecord}
                  className="text-xs bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-indigo-700 transition cursor-pointer"
                >
                  Insert Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
