import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Percent, Gift, Zap } from "lucide-react";

const PROMO_TYPES = [
  { type: "Discount", icon: Percent, desc: "Percentage off" },
  { type: "Bundle", icon: Gift, desc: "Buy X get Y" },
  { type: "Flash", icon: Zap, desc: "Limited time" },
];

export default function SellerPromotionsAddPage() {
  const navigate = useNavigate();
  const [promoType, setPromoType] = useState("Discount");
  const [form, setForm] = useState({
    name: "",
    discount: "",
    minOrder: "0",
    startDate: "",
    endDate: "",
    maxUses: "100",
    description: "",
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    // Save promotion logic here
    navigate("/m/dashboard/seller-promotions");
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white flex items-center px-4 gap-3" style={{ height: 56, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
        <button onClick={() => navigate(-1)} className="p-1 -ml-1"><ArrowLeft size={24} className="text-gray-900" /></button>
        <span className="flex-1 font-black text-base text-gray-900 text-center">Add Promotion</span>
        <div className="w-6" />
      </div>

      <div className="pb-8 pt-4 px-4 space-y-4">
        {/* Promotion Type Selection */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="font-black text-gray-900 text-sm mb-3">Promotion Type</p>
          <div className="grid grid-cols-3 gap-2">
            {PROMO_TYPES.map(({ type, icon: Icon, desc }) => (
              <button
                key={type}
                onClick={() => setPromoType(type)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  promoType === type ? "border-[#0077B6] bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Icon size={20} className={`mx-auto mb-1 ${promoType === type ? "text-[#0077B6]" : "text-gray-400"}`} />
                <p className={`text-xs font-bold ${promoType === type ? "text-[#0077B6]" : "text-gray-700"}`}>{type}</p>
                <p className="text-[9px] text-gray-400 mt-0.5">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Promotion Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => set("name", e.target.value)}
              placeholder="e.g., Spring Sale 20% Off"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0077B6]"
            />
          </div>

          {promoType === "Discount" && (
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">Discount Percentage *</label>
              <input
                type="number"
                min="1"
                max="100"
                value={form.discount}
                onChange={e => set("discount", e.target.value)}
                placeholder="20"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0077B6]"
              />
            </div>
          )}

          {promoType === "Bundle" && (
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">Bundle Deal *</label>
              <input
                type="text"
                value={form.discount}
                onChange={e => set("discount", e.target.value)}
                placeholder="e.g., Buy 2 Get 1 Free"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0077B6]"
              />
            </div>
          )}

          {promoType === "Flash" && (
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">Discount Value *</label>
              <input
                type="text"
                value={form.discount}
                onChange={e => set("discount", e.target.value)}
                placeholder="e.g., 30% OFF or $10 OFF"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0077B6]"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Minimum Order Amount ($)</label>
            <input
              type="number"
              min="0"
              value={form.minOrder}
              onChange={e => set("minOrder", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0077B6]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">Start Date *</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => set("startDate", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0077B6]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">End Date *</label>
              <input
                type="date"
                value={form.endDate}
                onChange={e => set("endDate", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0077B6]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Max Uses (0 = unlimited)</label>
            <input
              type="number"
              min="0"
              value={form.maxUses}
              onChange={e => set("maxUses", e.target.value)}
              placeholder="100"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0077B6]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Additional details about this promotion..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0077B6] resize-none"
            />
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={handleSubmit}
          disabled={!form.name || !form.discount || !form.startDate || !form.endDate}
          className="w-full bg-[#0077B6] hover:bg-[#00689F] disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
        >
          🎫 Create Promotion
        </button>
      </div>
    </div>
  );
}