import { X } from "lucide-react";
import AIGenerateButton from "@/components/ai/AIGenerateButton";

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

const CITIES = ["Cairo", "Alexandria", "Giza", "Sharm El Sheikh", "Hurghada", "Mansoura"];

export default function TaskStep1({ form, update }) {
  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((f) => URL.createObjectURL(f));
    update({ photo_urls: [...form.photo_urls, ...urls].slice(0, 3) });
  };

  const removePhoto = (i) => {
    update({ photo_urls: form.photo_urls.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-6">
      <p className="font-black text-gray-900 text-base">What needs to be done?</p>

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

      {/* Task title */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Task Title <span className="text-red-500">*</span></label>
        <input
          type="text"
          placeholder="e.g. Fix leaking kitchen faucet"
          value={form.title}
          onChange={(e) => update({ title: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Description <span className="text-red-500">*</span></label>
        <textarea
          rows={5}
          placeholder="Describe the task in detail. The more detail, the better bids you'll get. Include current situation, what you expect to be done, and any constraints."
          value={form.description}
          onChange={(e) => update({ description: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none"
        />
      </div>

      {/* Photos */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">
          Photos (optional) — Show the problem
        </label>
        <div className="grid grid-cols-3 gap-2">
          {form.photo_urls.map((url, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden bg-gray-100" style={{ aspectRatio: "1" }}>
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
              >
                <X size={10} color="white" />
              </button>
            </div>
          ))}
          {form.photo_urls.length < 3 && (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50" style={{ aspectRatio: "1" }}>
              <span className="text-xl text-gray-400">📷</span>
              <span className="text-[10px] text-gray-400 mt-1">Add photo</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
            </label>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Location</label>
        <input
          type="text"
          placeholder="Your address"
          value={form.address}
          onChange={(e) => update({ address: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 mb-2"
        />
        <select
          value={form.city}
          onChange={(e) => update({ city: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm bg-white focus:outline-none focus:border-orange-400"
        >
          <option value="">Select city</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </div>
  );
}