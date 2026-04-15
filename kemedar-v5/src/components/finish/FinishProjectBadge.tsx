"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react";

function fmt(n) { return new Intl.NumberFormat("en-EG").format(Math.round(n || 0)); }

/**
 * Shows a Finish™ badge on property listings.
 * If a project exists → show status & link to dashboard.
 * If no project → CTA to start one.
 */
export default function FinishProjectBadge({ propertyId, compact = false }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) { setLoading(false); return; }
    apiClient.list("/api/v1/finishproject", { propertyId })
      .then(results => { setProject(results[0] || null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [propertyId]);

  if (loading) return null;

  if (project) {
    const pct = project.completionPercent || 0;
    const isComplete = pct >= 95;

    if (compact) {
      return (
        <Link href={`/kemedar/finish/${project.id}`}
          className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-black px-2.5 py-1 rounded-full hover:bg-orange-200 transition-colors">
          🏗️ Finish™ {pct}%
        </Link>
      );
    }

    return (
      <div className={`rounded-2xl border-2 p-4 ${isComplete ? "border-green-400 bg-green-50" : "border-orange-300 bg-orange-50"}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${isComplete ? "bg-green-100" : "bg-orange-100"}`}>
            {isComplete ? "✅" : "🏗️"}
          </div>
          <div className="flex-1">
            <p className="font-black text-gray-900 text-sm">Kemedar Finish™</p>
            <p className="text-xs text-gray-500">{project.projectName}</p>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isComplete ? "bg-green-200 text-green-700" : "bg-orange-200 text-orange-700"}`}>
            {pct}%
          </span>
        </div>

        <div className="h-2 bg-white rounded-full overflow-hidden mb-2">
          <div className={`h-full rounded-full transition-all ${isComplete ? "bg-green-500" : "bg-orange-500"}`} style={{ width: `${pct}%` }} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2 text-[10px] text-gray-500">
            <span>💰 {fmt(project.estimatedBudget)} EGP</span>
            <span>·</span>
            <span className="capitalize">{project.finishingLevel} finish</span>
          </div>
          <Link href={`/kemedar/finish/${project.id}`}
            className="text-xs text-orange-600 font-bold flex items-center gap-1 hover:underline">
            View Project <ArrowRight size={11} />
          </Link>
        </div>

        {isComplete && (
          <div className="mt-3 bg-green-100 border border-green-200 rounded-xl p-2 flex items-center gap-2">
            <TrendingUp size={14} className="text-green-600" />
            <p className="text-xs text-green-700 font-bold">Finished property — higher listing value unlocked!</p>
          </div>
        )}
      </div>
    );
  }

  // No project — CTA
  if (compact) {
    return (
      <Link href={`/kemedar/finish/new`}
        className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full hover:bg-orange-100 hover:text-orange-700 transition-colors">
        <Sparkles size={10} /> Start Finishing
      </Link>
    );
  }

  return (
    <Link href="/kemedar/finish/new" className="block rounded-2xl border-2 border-dashed border-orange-300 p-4 hover:border-orange-500 hover:bg-orange-50 transition-all group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-100 group-hover:bg-orange-200 rounded-xl flex items-center justify-center text-xl transition-colors">🏗️</div>
        <div className="flex-1">
          <p className="font-black text-gray-900 text-sm group-hover:text-orange-700 transition-colors">Start a Finish™ Project</p>
          <p className="text-xs text-gray-400">AI-managed renovation → higher property value</p>
        </div>
        <ArrowRight size={16} className="text-orange-400 group-hover:text-orange-600 transition-colors" />
      </div>
    </Link>
  );
}