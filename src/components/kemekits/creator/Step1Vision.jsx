import { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, X, Plus, Minus } from "lucide-react";

const ROOM_TYPES = ["bathroom", "kitchen", "living_room", "bedroom", "dining_room", "outdoor", "office", "kids_room"];
const ROOM_LABELS = { bathroom: "Bathroom", kitchen: "Kitchen", living_room: "Living Room", bedroom: "Bedroom", dining_room: "Dining Room", outdoor: "Outdoor", office: "Office", kids_room: "Kids Room" };
const STYLES = ["modern", "classic", "bohemian", "industrial", "scandinavian", "art_deco", "contemporary", "rustic"];
const STYLE_LABELS = { modern: "Modern", classic: "Classic", bohemian: "Bohemian", industrial: "Industrial", scandinavian: "Scandinavian", art_deco: "Art Deco", contemporary: "Contemporary", rustic: "Rustic" };
const BUDGET_TIERS = [
  { value: "economy", label: "Economy", emoji: "💚", color: "bg-green-500 text-white", border: "border-green-500" },
  { value: "standard", label: "Standard", emoji: "💛", color: "bg-yellow-400 text-white", border: "border-yellow-400" },
  { value: "premium", label: "Premium", emoji: "🔵", color: "bg-blue-500 text-white", border: "border-blue-500" },
  { value: "luxury", label: "Luxury", emoji: "💎", color: "bg-purple-600 text-white", border: "border-purple-600" },
];

export default function Step1Vision({ data, onChange }) {
  const heroInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleHeroUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange({ heroImageUrl: file_url });
    setUploading(false);
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    const urls = await Promise.all(files.map(f => base44.integrations.Core.UploadFile({ file: f }).then(r => r.file_url)));
    onChange({ gallery: [...(data.gallery || []), ...urls].slice(0, 10) });
    setUploading(false);
  };

  const set = (key, val) => onChange({ [key]: val });

  return (
    <div className="space-y-5">
      {/* Hero Upload */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-500 rounded-full" /> Hero Room Photo
        </h3>
        {data.heroImageUrl ? (
          <div className="relative rounded-2xl overflow-hidden" style={{ height: 300 }}>
            <img src={data.heroImageUrl} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => onChange({ heroImageUrl: null })}
              className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white"
            >
              <X size={14} className="text-gray-700" />
            </button>
            <button
              onClick={() => heroInputRef.current?.click()}
              className="absolute bottom-3 left-3 bg-white/90 text-gray-800 font-bold text-xs px-4 py-2 rounded-xl shadow-md hover:bg-white"
            >
              Retake
            </button>
          </div>
        ) : (
          <div
            onClick={() => heroInputRef.current?.click()}
            className="border-2 border-dashed border-blue-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
            style={{ height: 300 }}
          >
            {uploading ? (
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-4xl mb-3">📸</span>
                <p className="font-bold text-gray-700 text-sm">Upload the Hero Room Photo</p>
                <p className="text-gray-400 text-xs mt-1 text-center px-8">
                  3D render or real photo of the finished design. This is what sells the kit.
                </p>
                <p className="text-gray-300 text-xs mt-3">JPG, PNG, WEBP — max 15MB</p>
              </>
            )}
          </div>
        )}
        <input ref={heroInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />

        {/* Gallery */}
        <div className="mt-4">
          <p className="text-xs font-bold text-gray-500 mb-2">Add more photos (optional)</p>
          <div className="flex gap-2 flex-wrap">
            {(data.gallery || []).map((url, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => onChange({ gallery: data.gallery.filter((_, idx) => idx !== i) })}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
                >
                  <X size={10} color="white" />
                </button>
              </div>
            ))}
            {(data.gallery || []).length < 10 && (
              <button
                onClick={() => galleryInputRef.current?.click()}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <Plus size={20} className="text-gray-400" />
              </button>
            )}
          </div>
          <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
        </div>
      </div>

      {/* Design Identity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-500 rounded-full" /> Design Identity
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Title (English) *</label>
            <input
              value={data.title || ""}
              onChange={e => set("title", e.target.value)}
              placeholder="e.g. Modern Matte Black Master Bathroom"
              className="field-input"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Title (Arabic)</label>
            <input
              value={data.titleAr || ""}
              onChange={e => set("titleAr", e.target.value)}
              placeholder="العنوان بالعربي"
              className="field-input text-right"
              dir="rtl"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Room Type *</label>
            <select value={data.roomType || ""} onChange={e => set("roomType", e.target.value)} className="field-input">
              <option value="">Select room type</option>
              {ROOM_TYPES.map(r => <option key={r} value={r}>{ROOM_LABELS[r]}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Style *</label>
            <select value={data.styleCategory || ""} onChange={e => set("styleCategory", e.target.value)} className="field-input">
              <option value="">Select style</option>
              {STYLES.map(s => <option key={s} value={s}>{STYLE_LABELS[s]}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-2">Budget Tier *</label>
          <div className="flex gap-2">
            {BUDGET_TIERS.map(t => (
              <button
                key={t.value}
                onClick={() => set("budgetTier", t.value)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                  data.budgetTier === t.value ? `${t.color} ${t.border}` : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Description (English)</label>
          <textarea
            value={data.description || ""}
            onChange={e => set("description", e.target.value.slice(0, 500))}
            rows={4}
            placeholder="Describe the design philosophy, materials used, and what makes this look unique..."
            className="field-input resize-none"
          />
          <p className="text-right text-xs text-gray-400 mt-1">{(data.description || "").length}/500</p>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Description (Arabic)</label>
          <textarea
            value={data.descriptionAr || ""}
            onChange={e => set("descriptionAr", e.target.value)}
            rows={3}
            placeholder="وصف التصميم بالعربي..."
            className="field-input resize-none text-right"
            dir="rtl"
          />
        </div>
      </div>

      {/* Installation Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-500 rounded-full" /> Kemework Installation Estimate
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Labor rate per sqm (EGP) *</label>
            <input
              type="number"
              value={data.baseLaborRatePerSqmEGP || ""}
              onChange={e => set("baseLaborRatePerSqmEGP", parseFloat(e.target.value) || 0)}
              placeholder="e.g. 250 EGP/sqm"
              className="field-input"
            />
            <p className="text-xs text-gray-400 mt-1">Used to show buyers an installation quote</p>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Required Skill</label>
            <input
              value={data.requiredProfessionalSkill || ""}
              onChange={e => set("requiredProfessionalSkill", e.target.value)}
              placeholder="e.g. Tiler + Plumber"
              className="field-input"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-2">Estimated Install Days</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => set("estimatedInstallDays", Math.max(1, (data.estimatedInstallDays || 1) - 1))}
              className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="text-xl font-black text-gray-900 min-w-[40px] text-center">
              {data.estimatedInstallDays || 1}
            </span>
            <button
              onClick={() => set("estimatedInstallDays", (data.estimatedInstallDays || 1) + 1)}
              className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Plus size={16} />
            </button>
            <span className="text-sm text-gray-500">days</span>
          </div>
        </div>
      </div>
    </div>
  );
}