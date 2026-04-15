"use client";
// @ts-nocheck
import { useState } from "react";
import { apiClient } from "@/lib/api-client";

const SEVERITY_STYLES = {
  critical: "bg-red-100 text-red-700",
  major: "bg-orange-100 text-orange-700",
  moderate: "bg-yellow-100 text-yellow-700",
  minor: "bg-green-100 text-green-700",
};

const STATUS_STYLES = {
  open: "bg-red-100 text-red-600",
  assigned: "bg-blue-100 text-blue-600",
  fix_in_progress: "bg-yellow-100 text-yellow-700",
  fixed_pending_review: "bg-purple-100 text-purple-700",
  resolved: "bg-green-100 text-green-700",
};

// Demo snags
const DEMO_SNAGS = [
  { id: "s1", itemNumber: 1, issueType: "alignment_issue", description: "Tile lippage visible on living room floor — 3 tiles need replacement", roomArea: "Living Room", severity: "major", status: "assigned", aiDetected: true, paymentImpact: 1500 },
  { id: "s2", itemNumber: 2, issueType: "finish_defect", description: "Paint not evenly applied on master bedroom ceiling", roomArea: "Master Bedroom", severity: "moderate", status: "open", aiDetected: false, paymentImpact: 500 },
  { id: "s3", itemNumber: 3, issueType: "cleaning_required", description: "Cement residue on bathroom tiles", roomArea: "Bathroom 1", severity: "minor", status: "fix_in_progress", aiDetected: true, paymentImpact: 0 },
];

export default function FinishTabSnagging({ project, snags, setSnags, phases }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ description: "", roomArea: "", severity: "moderate", issueType: "quality_defect" });
  const [saving, setSaving] = useState(false);

  const displaySnags = snags.length > 0 ? snags : DEMO_SNAGS;
  const open = displaySnags.filter(s => !["resolved", "accepted_as_is"].includes(s.status));

  const counts = { critical: 0, major: 0, moderate: 0, minor: 0 };
  displaySnags.forEach(s => { if (counts[s.severity] !== undefined) counts[s.severity]++; });

  const handleAdd = async () => {
    setSaving(true);
    const newSnag = await apiClient.post("/api/v1/finishsnaggingitem", {
      projectId: project.id,
      itemNumber: displaySnags.length + 1,
      ...form,
      status: "open",
      photoUrls: [],
    });
    setSnags(prev => [...prev, newSnag]);
    setShowForm(false);
    setForm({ description: "", roomArea: "", severity: "moderate", issueType: "quality_defect" });
    setSaving(false);
  };

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: "Critical", val: counts.critical, color: "text-red-600", bg: "bg-red-50" },
          { label: "Major", val: counts.major, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Moderate", val: counts.moderate, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Minor", val: counts.minor, color: "text-green-600", bg: "bg-green-50" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-[10px] text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* AI report */}
      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 mb-4 flex items-center gap-3">
        <span className="text-2xl">🤖</span>
        <div className="flex-1">
          <p className="font-bold text-purple-800 text-sm">AI detected {DEMO_SNAGS.filter(s => s.aiDetected).length} potential issues from progress photos</p>
          <p className="text-xs text-purple-600">Auto-generated from photo analysis</p>
        </div>
      </div>

      {/* Add button */}
      <button onClick={() => setShowForm(!showForm)} className="w-full mb-4 border-2 border-dashed border-orange-300 text-orange-600 font-bold py-3 rounded-xl text-sm hover:bg-orange-50 transition-colors">
        + Add Snag Item
      </button>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4">
          <p className="font-bold text-gray-900 mb-3 text-sm">Add Snagging Item</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">Issue Type</label>
              <select value={form.issueType} onChange={e => setForm(p => ({ ...p, issueType: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
                {["quality_defect", "alignment_issue", "finish_defect", "wrong_material", "incomplete_work", "cleaning_required", "damage", "other"].map(t => (
                  <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">Description *</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Room/Area</label>
                <input value={form.roomArea} onChange={e => setForm(p => ({ ...p, roomArea: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Severity</label>
                <select value={form.severity} onChange={e => setForm(p => ({ ...p, severity: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
                  {["minor", "moderate", "major", "critical"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2 rounded-xl text-sm">Cancel</button>
            <button onClick={handleAdd} disabled={saving || !form.description} className="flex-1 bg-orange-500 text-white font-bold py-2 rounded-xl text-sm disabled:opacity-60">
              {saving ? "Saving..." : "Add Issue"}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {displaySnags.map((snag, i) => (
          <div key={snag.id || i} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-start gap-2 mb-2">
              <span className="text-xs font-bold text-gray-400">#{snag.itemNumber}</span>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">{snag.description}</p>
                <p className="text-xs text-gray-400">{snag.roomArea} · {snag.issueType?.replace(/_/g, " ")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${SEVERITY_STYLES[snag.severity]}`}>{snag.severity}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[snag.status]}`}>{snag.status?.replace(/_/g, " ")}</span>
              {snag.aiDetected && <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">🤖 AI Detected</span>}
              {snag.paymentImpact > 0 && <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full">💰 {new Intl.NumberFormat("en-EG").format(snag.paymentImpact)} EGP withheld</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}