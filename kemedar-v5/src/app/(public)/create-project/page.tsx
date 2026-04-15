"use client";

import { useState } from "react";
import { Building2, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

const STEPS = ["Type", "Info", "Location", "Media", "Units", "Description", "Preview"];

export default function CreateProjectPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ type: "", name: "", developer: "", city: "", area: "", description: "" });

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="text-center mb-8">
        <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h1 className="text-2xl font-bold">Add a Project</h1>
        <p className="text-slate-500 mt-2">List your real estate development project</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-1 mb-8 flex-wrap">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i < step ? "bg-green-500 text-white" : i === step ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
              {i < step ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-xs hidden sm:inline ${i === step ? "font-medium" : "text-slate-400"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-4 h-px bg-slate-200" />}
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-xl p-6">
        {step === 0 && (
          <div className="space-y-3">
            <h2 className="font-bold mb-2">Project Type</h2>
            <div className="grid grid-cols-2 gap-3">
              {["Residential Compound", "Commercial Complex", "Mixed Use", "Standalone Tower"].map((t) => (
                <button key={t} onClick={() => update("type", t)} className={`p-4 border rounded-lg text-sm font-medium transition ${form.type === t ? "border-blue-500 bg-blue-50 text-blue-700" : "hover:border-slate-300"}`}>{t}</button>
              ))}
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-3">
            <h2 className="font-bold mb-2">Basic Information</h2>
            <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Project name" className="w-full px-4 py-2.5 border rounded-lg text-sm" />
            <input value={form.developer} onChange={(e) => update("developer", e.target.value)} placeholder="Developer name" className="w-full px-4 py-2.5 border rounded-lg text-sm" />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <h2 className="font-bold mb-2">Location</h2>
            <select value={form.city} onChange={(e) => update("city", e.target.value)} className="w-full px-4 py-2.5 border rounded-lg text-sm">
              <option value="">Select city...</option>
              <option value="cairo">Cairo</option>
              <option value="new-cairo">New Cairo</option>
              <option value="6th-october">6th of October</option>
              <option value="north-coast">North Coast</option>
            </select>
            <input value={form.area} onChange={(e) => update("area", e.target.value)} placeholder="Area / District" className="w-full px-4 py-2.5 border rounded-lg text-sm" />
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <h2 className="font-bold mb-2">Media</h2>
            <div className="border-2 border-dashed rounded-lg p-8 text-center text-slate-400">
              <p className="text-sm">Drag and drop images here or click to upload</p>
              <p className="text-xs mt-1">Master plan, renders, photos (max 20)</p>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-3">
            <h2 className="font-bold mb-2">Unit Types</h2>
            <p className="text-sm text-slate-500">Define unit types, sizes, and starting prices for your project.</p>
            <div className="border rounded-lg p-4 text-center text-slate-400 text-sm">Unit configuration form placeholder</div>
          </div>
        )}
        {step === 5 && (
          <div className="space-y-3">
            <h2 className="font-bold mb-2">Description</h2>
            <textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe your project, amenities, payment plans..." rows={5} className="w-full px-4 py-2.5 border rounded-lg text-sm resize-none" />
          </div>
        )}
        {step === 6 && (
          <div className="space-y-3">
            <h2 className="font-bold mb-2">Preview</h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-slate-500">Type:</span><span>{form.type || "Not set"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Name:</span><span>{form.name || "Not set"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Developer:</span><span>{form.developer || "Not set"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">City:</span><span>{form.city || "Not set"}</span></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-4">
        <div>
          {step > 0 && <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 px-4 py-2 border rounded-lg text-sm hover:bg-slate-50"><ArrowLeft className="w-3 h-3" /> Back</button>}
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard" className="px-4 py-2 border rounded-lg text-sm text-slate-500 hover:bg-slate-50">Cancel</Link>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="flex items-center gap-1 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Next <ArrowRight className="w-3 h-3" /></button>
          ) : (
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Submit Project</button>
          )}
        </div>
      </div>
    </div>
  );
}
