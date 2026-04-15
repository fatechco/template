"use client";
// @ts-nocheck
import { useState } from "react";
import { X } from "lucide-react";
import AIGenerateButton from "@/components/ai/AIGenerateButton";
import VisionCheckButton from "@/components/vision/VisionCheckButton";

const CATEGORIES = [
  { id: "handyman",     emoji: "🔧", label: "Handyman" },
  { id: "electrical",  emoji: "⚡", label: "Electrical" },
  { id: "plumbing",    emoji: "🔩", label: "Plumbing" },
  { id: "painting",    emoji: "🎨", label: "Painting" },
  { id: "carpentry",   emoji: "🪟", label: "Carpentry" },
  { id: "ac",          emoji: "❄️", label: "AC & HVAC" },
  { id: "construction",emoji: "🏗", label: "Construction" },
  { id: "finishing",   emoji: "🏢", label: "Finishing" },
  { id: "landscaping", emoji: "🌿", label: "Landscaping" },
  { id: "security",    emoji: "🔐", label: "Security" },
  { id: "smart_home",  emoji: "🖥", label: "Smart Home" },
  { id: "other",       emoji: "🛠", label: "Other" },
];

export default function ServiceStep1({ form, update }) {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      update({ tags: [...form.tags, t] });
    }
    setTagInput("");
  };

  const removeTag = (t) => update({ tags: form.tags.filter((x) => x !== t) });

  return (
    <div className="space-y-6">
      <p className="font-black text-gray-900 text-base">What service do you offer?</p>

      {/* Category grid */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">Category <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => update({ category: cat.id })}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl border-2 transition-all ${
                form.category === cat.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <span className="text-2xl mb-1">{cat.emoji}</span>
              <span className={`text-xs font-bold ${form.category === cat.id ? "text-orange-600" : "text-gray-600"}`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Service Title <span className="text-red-500">*</span></label>
        <input
          type="text"
          placeholder="e.g. Professional Electrical Wiring"
          value={form.title}
          onChange={(e) => update({ title: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Description <span className="text-red-500">*</span></label>
        <textarea
          rows={4}
          placeholder="What do you do, what's included, your experience..."
          value={form.description}
          onChange={(e) => update({ description: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">Skills / Specializations</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.tags.map((t) => (
            <span key={t} className="flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              {t}
              <button onClick={() => removeTag(t)}><X size={10} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a skill tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
          />
          <button onClick={addTag} className="bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm">
            Add
          </button>
        </div>
      </div>

      {/* Profile photo */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Profile Photo</label>
        <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-2xl p-4 cursor-pointer bg-gray-50">
          {form.photo_url ? (
            <img src={form.photo_url} alt="" className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl">👤</div>
          )}
          <div>
            <p className="text-sm font-bold text-gray-700">Upload profile photo</p>
            <p className="text-xs text-gray-400 mt-0.5">Shown to potential clients</p>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            if (e.target.files[0]) update({ photo_url: URL.createObjectURL(e.target.files[0]) });
          }} />
        </label>
        {form.photo_url && (
          <div className="mt-2 flex justify-end">
            <VisionCheckButton imageUrls={[form.photo_url]} />
          </div>
        )}
      </div>

      {/* Experience */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">Years of Experience</label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => update({ experience_years: Math.max(0, form.experience_years - 1) })}
            className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center text-xl font-bold"
          >−</button>
          <span className="text-xl font-black w-12 text-center">{form.experience_years}</span>
          <button
            onClick={() => update({ experience_years: form.experience_years + 1 })}
            className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-xl font-bold text-white"
          >+</button>
          <span className="text-sm text-gray-500">years</span>
        </div>
      </div>
    </div>
  );
}