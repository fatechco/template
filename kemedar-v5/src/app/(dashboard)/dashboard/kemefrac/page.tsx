"use client";

import { BarChart3 } from "lucide-react";

export default function KemeFracPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">KemeFrac Portfolio</h1>
      <div className="bg-white border rounded-xl p-12 text-center text-slate-400">
        <BarChart3 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <h3 className="font-semibold text-slate-600">No KemeFrac holdings</h3>
        <p className="text-sm mt-1">Invest in fractional property ownership through KemeFrac</p>
      </div>
    </div>
  );
}
