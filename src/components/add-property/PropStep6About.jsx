import { useState } from "react";
import AIGenerateButton from "@/components/ai/AIGenerateButton";

const PUBLISHER_TYPES = [
  { key: "owner", icon: "🏠", label: "I'm the Owner" },
  { key: "agent", icon: "🤝", label: "I'm an Agent / Broker" },
  { key: "developer", icon: "🏗", label: "I'm the Developer" },
];

const BOOST_SERVICES = [
  { key: "boost_veri", icon: "✅", name: "KEMEDAR VERI", desc: "Verified listing badge", price: "$100" },
  { key: "boost_up", icon: "🚀", name: "KEMEDAR UP", desc: "Boost in search results", price: "$50/mo" },
  { key: "boost_campaign", icon: "📢", name: "KEMEDAR CAMPAIGN", desc: "Full marketing package", price: "Custom" },
];

export default function PropStep6About({ form, update, onNext, canProceed }) {
  const [arTitle, setArTitle] = useState(false);
  const [arDesc, setArDesc] = useState(false);

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 text-center mb-6">Almost done! 🎉</h2>

      {/* Publisher type */}
      <p className="text-sm font-black text-gray-700 mb-2">I am listing as:</p>
      <div className="space-y-2 mb-5">
        {PUBLISHER_TYPES.map(p => (
          <button key={p.key} onClick={() => update({ publisher_type: p.key })}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border-2 ${form.publisher_type === p.key ? "border-orange-600 bg-orange-50" : "border-gray-200 bg-white"}`}>
            <span className="text-2xl">{p.icon}</span>
            <span className={`text-base font-black ${form.publisher_type === p.key ? "text-orange-600" : "text-gray-800"}`}>{p.label}</span>
            {form.publisher_type === p.key && <span className="ml-auto text-orange-600 font-black">✓</span>}
          </button>
        ))}
      </div>

      {/* Preferences */}
      <p className="text-sm font-black text-gray-700 mb-2">Special preferences:</p>
      <div className="bg-gray-50 rounded-2xl p-4 mb-5 space-y-3">
        {[
          { key: "video_meeting", label: "Ready for video meeting with buyers" },
          { key: "in_person", label: "Can show property in person" },
          { key: "no_agents", label: "No agents — direct buyers only" },
        ].map(pref => (
          <label key={pref.key} className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => update({ [pref.key]: !form[pref.key] })}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${form[pref.key] ? "bg-orange-600 border-orange-600" : "border-gray-300"}`}>
              {form[pref.key] && <span className="text-white text-xs font-black">✓</span>}
            </div>
            <span className="text-sm text-gray-700">{pref.label}</span>
          </label>
        ))}
      </div>

      {/* Title */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-sm font-black text-gray-700">Listing Title <span className="text-red-500">*</span></p>
          <span className="text-xs text-gray-400">{(form.title || "").length}/100</span>
        </div>
        <input value={form.title || ""} onChange={e => update({ title: e.target.value.slice(0, 100) })}
          placeholder="e.g. Luxury Apartment with Sea View"
          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-base outline-none focus:border-orange-400" />
        {!arTitle ? (
          <button onClick={() => setArTitle(true)} className="text-xs text-orange-600 font-semibold mt-1.5">+ Add Arabic title</button>
        ) : (
          <input value={form.title_ar || ""} onChange={e => update({ title_ar: e.target.value })}
            placeholder="العنوان بالعربية"
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-base outline-none focus:border-orange-400 mt-2 text-right" dir="rtl" />
        )}
      </div>

      {/* Description */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-sm font-black text-gray-700">Description</p>
          <span className="text-xs text-gray-400">{(form.description || "").length}/2000</span>
        </div>
        <textarea value={form.description || ""} onChange={e => update({ description: e.target.value.slice(0, 2000) })}
          placeholder="Describe the property, neighborhood, nearby facilities..."
          rows={5} className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-base outline-none focus:border-orange-400 resize-none" />
        {!arDesc ? (
          <button onClick={() => setArDesc(true)} className="text-xs text-orange-600 font-semibold mt-1.5">+ Add Arabic description</button>
        ) : (
          <textarea value={form.description_ar || ""} onChange={e => update({ description_ar: e.target.value })}
            placeholder="الوصف بالعربية..." rows={4}
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-base outline-none focus:border-orange-400 resize-none mt-2 text-right" dir="rtl" />
        )}
      </div>

      {/* Boost services */}
      <div className="mb-8">
        <p className="text-sm font-black text-gray-700 mb-1">Boost your listing 🚀</p>
        <p className="text-xs text-gray-400 mb-3">Optional paid services to promote your listing</p>
        <div className="space-y-2">
          {BOOST_SERVICES.map(svc => (
            <label key={svc.key} className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 cursor-pointer">
              <div onClick={() => update({ [svc.key]: !form[svc.key] })}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${form[svc.key] ? "bg-orange-600 border-orange-600" : "border-gray-300"}`}>
                {form[svc.key] && <span className="text-white text-xs font-black">✓</span>}
              </div>
              <span className="text-xl">{svc.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-black text-gray-800">{svc.name}</p>
                <p className="text-xs text-gray-400">{svc.desc}</p>
              </div>
              <span className="text-sm font-black text-orange-600">{svc.price}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={onNext} disabled={!canProceed}
        className="fixed bottom-0 left-0 right-0 bg-orange-600 text-white font-black py-5 text-base disabled:opacity-40"
        style={{ paddingBottom: "max(20px,env(safe-area-inset-bottom))" }}>
        Preview Listing →
      </button>
    </div>
  );
}