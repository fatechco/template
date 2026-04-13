import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Upload, Check } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const STEPS = ["Snap", "Details", "Ship"];

export default function SurplusAddMobile() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    condition: "brand_new",
    quantity: 1,
    unit: "pcs",
    originalPrice: "",
    surplusPrice: "",
    weight: "",
    pickupLocation: "",
  });
  const [published, setPublished] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const canContinue = step === 1 ? images.length > 0 : formData.title && formData.surplusPrice;

  if (published) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col items-center justify-center px-4 pb-28">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-black text-gray-900 text-center mb-2">Listing Published!</h2>
        <p className="text-gray-500 text-center text-sm mb-6">Your materials are now visible to buyers across Egypt.</p>
        <div className="flex gap-2 w-full">
          <button onClick={() => { setPublished(false); setStep(1); setImages([]); setFormData({ title: "", description: "", condition: "brand_new", quantity: 1, unit: "pcs", originalPrice: "", surplusPrice: "", weight: "", pickupLocation: "" }); }}
            className="flex-1 py-3 rounded-xl font-bold text-sm text-white" style={{ background: "#16A34A" }}>
            ♻️ List Another
          </button>
          <button onClick={() => navigate("/m/kemetro/surplus")}
            className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-700">
            View My Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)} className="p-1.5">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <p className="font-black text-gray-900 text-sm">List Surplus</p>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full text-green-700 bg-green-100">
          Step {step}/3
        </span>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-1">
          {STEPS.map((label, i) => {
            const num = i + 1;
            const isActive = step === num;
            const isDone = step > num;
            return (
              <div key={label} className="flex-1">
                <div className={`h-1 rounded-full ${isDone ? "bg-green-600" : isActive ? "bg-green-600" : "bg-gray-200"}`} />
                <p className="text-[9px] font-bold mt-1 text-center" style={{ color: isDone || isActive ? "#16A34A" : "#9CA3AF" }}>
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Photos */}
      {step === 1 && (
        <div className="p-4 space-y-4">
          <h2 className="font-black text-gray-900 text-base">📸 Snap Your Materials</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Take 2-3 clear photos from different angles. Good lighting helps buyers trust your listing.
          </p>

          <div className="grid grid-cols-2 gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative rounded-lg overflow-hidden bg-gray-100">
                <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-32 object-cover" />
                <button onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  ✕
                </button>
              </div>
            ))}

            {images.length < 4 && (
              <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-green-600 hover:bg-green-50 transition-colors">
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                <div className="text-center">
                  <Camera size={24} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-xs font-bold text-gray-500">Add Photo</p>
                </div>
              </label>
            )}
          </div>

          <p className="text-xs text-gray-400">{images.length}/4 photos added</p>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="p-4 space-y-4">
          <h2 className="font-black text-gray-900 text-base">📝 Material Details</h2>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">What are you selling? *</label>
            <input type="text" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Ceramic Tiles Box, Wooden Planks..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Condition</label>
            <select value={formData.condition} onChange={e => setFormData(p => ({ ...p, condition: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white">
              <option value="brand_new">✨ Brand New</option>
              <option value="open_box">📦 Open Box</option>
              <option value="lightly_used">👍 Lightly Used</option>
              <option value="salvaged">♻️ Salvaged</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Qty</label>
              <input type="number" min="1" value={formData.quantity} onChange={e => setFormData(p => ({ ...p, quantity: parseInt(e.target.value) || 1 }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Unit</label>
              <select value={formData.unit} onChange={e => setFormData(p => ({ ...p, unit: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white">
                <option value="pcs">Pieces</option>
                <option value="box">Box</option>
                <option value="kg">Kg</option>
                <option value="m2">M²</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Original Price</label>
              <input type="number" value={formData.originalPrice} onChange={e => setFormData(p => ({ ...p, originalPrice: e.target.value }))}
                placeholder="EGP" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Your Price *</label>
              <input type="number" value={formData.surplusPrice} onChange={e => setFormData(p => ({ ...p, surplusPrice: e.target.value }))}
                placeholder="EGP" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Description</label>
            <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              placeholder="Condition, grade, included items..." rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none" />
          </div>
        </div>
      )}

      {/* Step 3: Shipping */}
      {step === 3 && (
        <div className="p-4 space-y-4">
          <h2 className="font-black text-gray-900 text-base">📦 Pickup & Shipping</h2>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Approximate Weight (Kg)</label>
            <input type="number" value={formData.weight} onChange={e => setFormData(p => ({ ...p, weight: e.target.value }))}
              placeholder="e.g. 50" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Pickup Location</label>
            <input type="text" value={formData.pickupLocation} onChange={e => setFormData(p => ({ ...p, pickupLocation: e.target.value }))}
              placeholder="City/District" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-gray-600 leading-relaxed">
              <span className="font-bold text-green-700">🌱 Eco Impact:</span> Your listing will help divert waste and save buyers money. Kemetro Shippers can handle delivery.
            </p>
          </div>

          <button onClick={() => setPublished(true)}
            className="w-full py-3 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2" style={{ background: "#16A34A" }}>
            <Check size={16} /> Publish Listing
          </button>
        </div>
      )}

      {/* Bottom CTA */}
      {step < 3 && (
        <div className="fixed bottom-28 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
          <button onClick={() => setStep(s => s + 1)} disabled={!canContinue}
            className="w-full py-3 rounded-lg font-bold text-white text-sm" style={{ background: canContinue ? "#16A34A" : "#D1D5DB" }}>
            Continue →
          </button>
        </div>
      )}

      <MobileBottomNav />
    </div>
  );
}