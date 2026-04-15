"use client";
// @ts-nocheck
import { useState } from "react";
import { Plus, X } from "lucide-react";

const VERDICTS = [
  { id: "pass", label: "Clean — Everything checks out", color: "border-green-500 bg-green-50 text-green-700" },
  { id: "partial", label: "Minor Issues — Small problems, still passable", color: "border-amber-400 bg-amber-50 text-amber-700" },
  { id: "fail_major", label: "Major Issues — Significant problems found", color: "border-orange-500 bg-orange-50 text-orange-700" },
  { id: "fail", label: "Failed — Property does not match listing", color: "border-red-500 bg-red-50 text-red-700" },
];

const RECOMMENDATIONS = ["approve", "approve_with_notes", "reject", "reinspect"];

export default function InspectionVerdict({ verdict, onChange, onNext, photos }) {
  const update = (key, val) => onChange(prev => ({ ...prev, [key]: val }));

  const addIssue = () => {
    onChange(prev => ({
      ...prev,
      issues: [...(prev.issues || []), { description: "", severity: "medium", photoKey: "" }]
    }));
  };

  const updateIssue = (i, key, val) => {
    const issues = [...(verdict.issues || [])];
    issues[i] = { ...issues[i], [key]: val };
    onChange(prev => ({ ...prev, issues }));
  };

  const removeIssue = (i) => {
    const issues = (verdict.issues || []).filter((_, idx) => idx !== i);
    onChange(prev => ({ ...prev, issues }));
  };

  const canContinue = !!verdict.overall && !!verdict.recommendation;
  const showIssues = verdict.overall && verdict.overall !== "pass";

  return (
    <div className="px-4 py-6">
      <div className="text-center mb-6">
        <p className="text-2xl mb-1">📝</p>
        <h2 className="text-xl font-black text-gray-900">Your Verdict</h2>
      </div>

      {/* Overall Verdict */}
      <p className="text-sm font-bold text-gray-700 mb-3">Overall Verdict</p>
      <div className="space-y-2 mb-6">
        {VERDICTS.map(v => (
          <label key={v.id} className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${verdict.overall === v.id ? v.color : "border-gray-200 bg-white"}`}>
            <input type="radio" name="verdict" checked={verdict.overall === v.id} onChange={() => update("overall", v.id)} className="accent-orange-500 w-4 h-4" />
            <span className="text-sm font-semibold">{v.label}</span>
          </label>
        ))}
      </div>

      {/* Issues */}
      {showIssues && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-700">Issues Found</p>
            <button onClick={addIssue} className="flex items-center gap-1 text-xs font-bold text-orange-500 border border-orange-300 px-3 py-1.5 rounded-lg hover:bg-orange-50">
              <Plus size={12} /> Add Issue
            </button>
          </div>
          {(verdict.issues || []).map((issue, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 mb-2">
              <div className="flex items-start gap-2 mb-2">
                <input value={issue.description} onChange={e => updateIssue(i, "description", e.target.value)}
                  placeholder="Describe the issue..."
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                <button onClick={() => removeIssue(i)} className="text-gray-400 hover:text-red-500 mt-2"><X size={14} /></button>
              </div>
              <div className="flex gap-2">
                {["low", "medium", "high"].map(s => (
                  <button key={s} onClick={() => updateIssue(i, "severity", s)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${issue.severity === s ? (s === "low" ? "bg-blue-100 text-blue-700" : s === "medium" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700") : "bg-gray-100 text-gray-500"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
      <div className="mb-6">
        <p className="text-sm font-bold text-gray-700 mb-2">Notes to admin</p>
        <textarea value={verdict.notes} onChange={e => update("notes", e.target.value)}
          placeholder="Any additional observations..."
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 h-24 resize-none" />
      </div>

      {/* Recommendation */}
      <div className="mb-8">
        <p className="text-sm font-bold text-gray-700 mb-2">Recommendation</p>
        <select value={verdict.recommendation} onChange={e => update("recommendation", e.target.value)}
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none bg-white">
          <option value="">Select recommendation...</option>
          <option value="approve">Approve</option>
          <option value="approve_with_notes">Approve with notes</option>
          <option value="reject">Reject</option>
          <option value="reinspect">Re-inspect</option>
        </select>
      </div>

      <button onClick={onNext} disabled={!canContinue}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-4 rounded-2xl text-base transition-colors">
        Review & Submit →
      </button>
    </div>
  );
}