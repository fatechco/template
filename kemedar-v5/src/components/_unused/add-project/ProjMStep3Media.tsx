// @ts-nocheck
import { Upload, Plus, X } from "lucide-react";

function UploadBox({ label, value, onAdd, onRemove, height = 120 }) {
  if (value) return (
    <div className="relative rounded-2xl overflow-hidden bg-gray-200 flex items-center justify-center" style={{ height }}>
      <span className="text-4xl">📷</span>
      <button onClick={onRemove} className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center">
        <X size={12} color="white" />
      </button>
    </div>
  );
  return (
    <button onClick={onAdd}
      className="w-full rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 flex flex-col items-center justify-center gap-1.5"
      style={{ height }}>
      <Plus size={22} className="text-orange-400" />
      {label && <span className="text-xs text-gray-500 font-semibold text-center px-2">{label}</span>}
    </button>
  );
}

export default function ProjMStep3Media({ form, update, onNext }) {
  const gallery = form.gallery || [];
  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 text-center mb-1">Project Media 📸</h2>
      <p className="text-sm text-gray-400 text-center mb-5">Logo, hero image & gallery</p>

      {/* Logo */}
      <p className="text-sm font-black text-gray-700 mb-2">Project Logo <span className="text-gray-400 font-normal">(optional)</span></p>
      <div className="flex gap-3 mb-5">
        <div style={{ width: 100 }}>
          <UploadBox label="Logo" value={form.logo} height={100} onAdd={() => update({ logo: "logo" })} onRemove={() => update({ logo: null })} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400 leading-relaxed">Square logo, min 200×200px. PNG with transparent background preferred.</p>
        </div>
      </div>

      {/* Hero image */}
      <p className="text-sm font-black text-gray-700 mb-2">Main / Hero Image <span className="text-red-500">*</span></p>
      <UploadBox label="Tap to add main project image" value={form.featured_image} height={160}
        onAdd={() => update({ featured_image: "hero" })} onRemove={() => update({ featured_image: null })} />
      <div className="mb-5" />

      {/* Gallery */}
      <p className="text-sm font-black text-gray-700 mb-2">Gallery Photos</p>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {gallery.map((_, i) => (
          <UploadBox key={i} value="photo" height={100} onAdd={() => {}} onRemove={() => update({ gallery: gallery.filter((_, idx) => idx !== i) })} />
        ))}
        {gallery.length < 20 && <UploadBox height={100} onAdd={() => update({ gallery: [...gallery, "photo"] })} />}
      </div>

      {/* Videos */}
      <p className="text-sm font-black text-gray-700 mb-2">Video Links <span className="text-gray-400 font-normal">(optional)</span></p>
      <div className="space-y-2 mb-5">
        {(form.youtube_links || ["", ""]).map((link, i) => (
          <input key={i} value={link} onChange={e => {
            const links = [...(form.youtube_links || ["", ""])];
            links[i] = e.target.value;
            update({ youtube_links: links });
          }} placeholder={`YouTube / Promo URL ${i + 1}`}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400" />
        ))}
        <input value={form.vr_link || ""} onChange={e => update({ vr_link: e.target.value })}
          placeholder="VR / 360° tour link"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400" />
      </div>

      {/* Brochure */}
      <button onClick={() => update({ brochure: "file" })}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 mb-6 ${form.brochure ? "border-orange-600 bg-orange-50" : "border-dashed border-gray-300 bg-gray-50"}`}>
        <Upload size={18} className="text-gray-500" />
        <span className="text-sm font-semibold text-gray-700">{form.brochure ? "✅ Brochure uploaded" : "📋 Upload Brochure PDF"}</span>
      </button>

      <button onClick={onNext}
        className="fixed bottom-0 left-0 right-0 bg-orange-600 text-white font-black py-5 text-base"
        style={{ paddingBottom: "max(20px,env(safe-area-inset-bottom))" }}>
        Continue →
      </button>
    </div>
  );
}