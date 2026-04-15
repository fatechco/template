"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { Plus, ChevronRight, TrendingUp, DollarSign } from "lucide-react";

const DEFAULT_OPPS = [
  { id: "op1", title: "Pro Plan Renewal", pipeline: "Renewals", stage: "Proposal", owner: "You", value: "EGP 1,200", probability: 70, expectedClose: "May 1, 2026", status: "open", nextStep: "Send final offer" },
  { id: "op2", title: "Featured Listing Upsell", pipeline: "Upsells", stage: "Contacted", owner: "You", value: "EGP 400", probability: 40, expectedClose: "Apr 15, 2026", status: "open", nextStep: "Follow up call" },
  { id: "op3", title: "Agency Package", pipeline: "New Sales", stage: "Won", owner: "Adel M.", value: "EGP 8,000", probability: 100, expectedClose: "Mar 10, 2026", status: "won", nextStep: null },
];

const STAGE_COLORS = {
  "New Lead": "bg-gray-100 text-gray-600",
  "Contacted": "bg-blue-100 text-blue-700",
  "Qualified": "bg-teal-100 text-teal-700",
  "Proposal": "bg-orange-100 text-orange-700",
  "Negotiation": "bg-yellow-100 text-yellow-700",
  "Won": "bg-green-100 text-green-700",
  "Lost": "bg-red-100 text-red-600",
};

export default function ContactOpportunitiesTab({ contact, autoOpenCreate, onFormOpened }) {
  const [showCreate, setShowCreate] = useState(false);
  const [opps, setOpps] = useState(DEFAULT_OPPS);
  const [newOpp, setNewOpp] = useState({ title: "", pipeline: "Renewals", value: "" });

  useEffect(() => {
    if (autoOpenCreate) {
      setShowCreate(true);
      onFormOpened?.();
    }
  }, [autoOpenCreate]);

  const open = opps.filter(o => o.status === "open");
  const closed = opps.filter(o => o.status !== "open");

  const handleCreate = () => {
    if (!newOpp.title.trim()) return;
    setOpps(prev => [...prev, {
      id: `op${Date.now()}`, ...newOpp,
      stage: "New Lead", owner: "You", probability: 10,
      expectedClose: "TBD", status: "open", nextStep: null,
    }]);
    setNewOpp({ title: "", pipeline: "Renewals", value: "" });
    setShowCreate(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-900">Opportunities</h3>
        <button onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold px-3 py-2 rounded-lg text-xs">
          <Plus size={12} /> New Opportunity
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
          <p className="text-xl font-black text-violet-600">{open.length}</p>
          <p className="text-[11px] text-gray-500">Open</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
          <p className="text-xl font-black text-green-600">{opps.filter(o => o.status === "won").length}</p>
          <p className="text-[11px] text-gray-500">Won</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
          <p className="text-xl font-black text-gray-900">EGP 1,600</p>
          <p className="text-[11px] text-gray-500">Open Value</p>
        </div>
      </div>

      {showCreate && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 space-y-3">
          <input value={newOpp.title} onChange={e => setNewOpp(p => ({ ...p, title: e.target.value }))}
            placeholder="Opportunity title..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-400" />
          <div className="grid grid-cols-2 gap-2">
            <select value={newOpp.pipeline} onChange={e => setNewOpp(p => ({ ...p, pipeline: e.target.value }))}
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs">
              <option>Renewals</option><option>New Sales</option><option>Upsells</option><option>Reactivation</option>
            </select>
            <input value={newOpp.value} onChange={e => setNewOpp(p => ({ ...p, value: e.target.value }))}
              placeholder="Value (EGP)" className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)} className="text-xs text-gray-500 font-bold">Cancel</button>
            <button onClick={handleCreate} className="bg-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-violet-700">Create</button>
          </div>
        </div>
      )}

      {/* Open opportunities */}
      {open.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-black text-gray-500 uppercase tracking-wide">Open</p>
          {open.map(o => (
            <div key={o.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{o.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{o.pipeline}</p>
                </div>
                <span className="text-sm font-black text-violet-600 flex-shrink-0">{o.value}</span>
              </div>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STAGE_COLORS[o.stage] || "bg-gray-100 text-gray-600"}`}>{o.stage}</span>
                <span className="text-[10px] text-gray-400">{o.probability}% probability</span>
                <span className="text-[10px] text-gray-400">Close: {o.expectedClose}</span>
                <span className="text-[10px] text-gray-400">Owner: {o.owner}</span>
              </div>
              {/* Probability bar */}
              <div className="mt-3">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${o.probability >= 70 ? "bg-green-500" : o.probability >= 40 ? "bg-yellow-400" : "bg-red-400"}`}
                    style={{ width: `${o.probability}%` }} />
                </div>
              </div>
              {o.nextStep && (
                <p className="text-[11px] text-gray-500 mt-2">→ Next: {o.nextStep}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Closed */}
      {closed.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-black text-gray-400 uppercase tracking-wide">Closed</p>
          {closed.map(o => (
            <div key={o.id} className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-600 line-through">{o.title}</p>
                <p className="text-[10px] text-gray-400">{o.pipeline} · {o.expectedClose}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STAGE_COLORS[o.stage] || "bg-gray-100 text-gray-600"}`}>{o.stage}</span>
              <span className="text-xs font-bold text-gray-500">{o.value}</span>
            </div>
          ))}
        </div>
      )}

      {opps.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <TrendingUp size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold">No opportunities yet</p>
        </div>
      )}
    </div>
  );
}