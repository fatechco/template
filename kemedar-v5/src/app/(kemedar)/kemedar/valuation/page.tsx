"use client";

import { useState } from "react";
import { BadgeDollarSign, ChevronRight, ChevronLeft, Check, Upload } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const STEPS = ["Property Details", "Location & Area", "Condition & Age", "Upload Photos", "Get Valuation"];

export default function ValuationPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ type: "apartment", area: "", sizeSqm: "", bedrooms: "2", bathrooms: "1", age: "", condition: "good" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post<any>("/api/v1/ai/valuation", form);
      setResult(res);
    } catch { /* handled */ } finally { setLoading(false); }
  };

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="text-center mb-8">
        <BadgeDollarSign className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h1 className="text-3xl font-bold">Property Valuation</h1>
        <p className="text-slate-500 mt-2">Get an AI-powered market valuation for any property</p>
      </div>

      <div className="flex gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 text-center">
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold ${i < step ? "bg-green-600 text-white" : i === step ? "bg-green-600 text-white" : "bg-slate-200 text-slate-400"}`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <div className="text-xs mt-1 text-slate-500 hidden md:block">{s}</div>
          </div>
        ))}
      </div>

      {result ? (
        <div className="bg-white rounded-xl border p-8 text-center">
          <div className="text-sm text-slate-500 mb-1">Estimated Valuation</div>
          <div className="text-4xl font-bold text-green-600 mb-2">{result.estimatedValue?.toLocaleString() || "—"} EGP</div>
          <div className="text-sm text-slate-400 mb-4">Confidence: {result.confidence || "—"}%</div>
          {result.range && <p className="text-sm text-slate-600">Range: {result.range.min?.toLocaleString()} - {result.range.max?.toLocaleString()} EGP</p>}
          <button onClick={() => { setResult(null); setStep(0); }} className="mt-6 text-sm text-green-600 hover:underline">Start new valuation</button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-8">
          <h2 className="text-xl font-bold mb-4">{STEPS[step]}</h2>

          {step === 0 && (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Property Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="apartment">Apartment</option><option value="villa">Villa</option><option value="duplex">Duplex</option><option value="studio">Studio</option>
                </select></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium mb-1">Bedrooms</label><select value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">{["1","2","3","4","5+"].map(b=><option key={b}>{b}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1">Bathrooms</label><select value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">{["1","2","3","4"].map(b=><option key={b}>{b}</option>)}</select></div>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Area / Location</label><input type="text" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="e.g. New Cairo" className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Size (sqm)</label><input type="number" value={form.sizeSqm} onChange={(e) => setForm({ ...form, sizeSqm: e.target.value })} placeholder="e.g. 150" className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Building Age (years)</label><input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="e.g. 5" className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">Condition</label>
                <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="new">New</option><option value="excellent">Excellent</option><option value="good">Good</option><option value="fair">Fair</option><option value="needs_renovation">Needs Renovation</option>
                </select></div>
            </div>
          )}
          {step === 3 && (
            <div className="border-2 border-dashed rounded-lg p-8 text-center text-slate-400">
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Drag and drop property photos here or click to browse</p>
              <p className="text-xs mt-1">Optional - photos improve valuation accuracy</p>
            </div>
          )}
          {step === 4 && (
            <div className="text-center py-4">
              <p className="text-slate-600 mb-4">Ready to generate your property valuation?</p>
              <button onClick={handleSubmit} disabled={loading} className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50">
                {loading ? "Generating..." : "Generate Valuation"}
              </button>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-4 py-2 border rounded-lg disabled:opacity-50 flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />Back
            </button>
            {step < 4 && (
              <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-1">
                Next<ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
