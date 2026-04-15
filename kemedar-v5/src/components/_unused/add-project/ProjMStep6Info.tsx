"use client";
// @ts-nocheck
import { useState } from "react";
import { Upload } from "lucide-react";
import AIGenerateButton from "@/components/ai/AIGenerateButton";

export default function ProjMStep6Info({ form, update, onNext, canProceed }) {
  const [arTitle, setArTitle] = useState(false);
  const [arDesc, setArDesc] = useState(false);

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 text-center mb-6">Project Information</h2>

      {/* Project title */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-sm font-black text-gray-700">Project Name <span className="text-red-500">*</span></p>
          <span className="text-xs text-gray-400">{(form.title || "").length}/100</span>
        </div>
        <input value={form.title || ""} onChange={e => update({ title: e.target.value.slice(0, 100) })}
          placeholder="e.g. Al Noor Compound — New Cairo"
          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-base outline-none focus:border-orange-400" />
        {!arTitle ? (
          <button onClick={() => setArTitle(true)} className="text-xs text-orange-600 font-semibold mt-1.5">+ Add Arabic name</button>
        ) : (
          <input value={form.title_ar || ""} onChange={e => update({ title_ar: e.target.value })}
            placeholder="اسم المشروع بالعربية" dir="rtl"
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-base outline-none focus:border-orange-400 mt-2 text-right" />
        )}
      </div>

      {/* Description */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-sm font-black text-gray-700">Description</p>
          <span className="text-xs text-gray-400">{(form.description || "").length}/2000</span>
        </div>
        <textarea value={form.description || ""} onChange={e => update({ description: e.target.value.slice(0, 2000) })}
          placeholder="Describe the project vision, location advantages, amenities..." rows={5}
          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-base outline-none focus:border-orange-400 resize-none" />
        {!arDesc ? (
          <button onClick={() => setArDesc(true)} className="text-xs text-orange-600 font-semibold mt-1.5">+ Add Arabic description</button>
        ) : (
          <textarea value={form.description_ar || ""} onChange={e => update({ description_ar: e.target.value })}
            placeholder="وصف المشروع بالعربية..." rows={4} dir="rtl"
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-base outline-none focus:border-orange-400 resize-none mt-2 text-right" />
        )}
      </div>

      {/* Developer info */}
      <p className="text-sm font-black text-gray-700 mb-3">Developer Information</p>
      <div className="bg-gray-50 rounded-2xl p-4 mb-4 space-y-3">
        <div>
          <p className="text-xs font-bold text-gray-500 mb-1.5">Developer / Company Name</p>
          <input value={form.developer_name || ""} onChange={e => update({ developer_name: e.target.value })}
            placeholder="e.g. Emaar Properties"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400" />
        </div>
        <button onClick={() => update({ developer_logo: "logo" })}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border ${form.developer_logo ? "border-orange-600 bg-orange-50" : "border-dashed border-gray-300"}`}>
          <Upload size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">{form.developer_logo ? "✅ Logo uploaded" : "Upload developer logo"}</span>
        </button>
      </div>

      {/* Marketing agent */}
      <div className="mb-8">
        <p className="text-sm font-bold text-gray-700 mb-1.5">Marketing Agent <span className="text-gray-400 font-normal">(optional)</span></p>
        <input value={form.marketing_agent || ""} onChange={e => update({ marketing_agent: e.target.value })}
          placeholder="Agent / agency name"
          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-base outline-none focus:border-orange-400" />
      </div>

      <button onClick={onNext} disabled={!canProceed}
        className="fixed bottom-0 left-0 right-0 bg-orange-600 text-white font-black py-5 text-base disabled:opacity-40"
        style={{ paddingBottom: "max(20px,env(safe-area-inset-bottom))" }}>
        Preview Project →
      </button>
    </div>
  );
}