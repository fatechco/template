import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, RefreshCw, Tag, DollarSign, Truck, Trash2 } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const DISCOUNT_TYPES = [
  { id: "percentage", label: "Percentage", icon: Tag, desc: "% off order" },
  { id: "fixed", label: "Fixed Amount", icon: DollarSign, desc: "$ off order" },
  { id: "shipping", label: "Free Shipping", icon: Truck, desc: "Free delivery" },
];

const MOCK_COUPON = {
  id: 1,
  code: "SUMMER20",
  type: "percentage",
  discount: 20,
  fixedAmount: 15,
  uses: 45,
  maxUses: 100,
  saved: 450,
  status: "active",
  expires: "2025-06-30",
  minOrder: 50,
  usesPerCustomer: 1,
  startDate: "2025-01-01",
  endDate: "2025-06-30",
  active: true,
};

export default function SellerCouponsEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    code: "",
    type: "percentage",
    discount: 20,
    fixedAmount: 15,
    maxUses: 100,
    minOrder: 0,
    usesPerCustomer: 1,
    startDate: "",
    endDate: "",
    active: true,
  });

  useEffect(() => {
    // Simulate fetching coupon data
    setTimeout(() => {
      setForm({
        code: MOCK_COUPON.code,
        type: MOCK_COUPON.type,
        discount: MOCK_COUPON.discount,
        fixedAmount: MOCK_COUPON.fixedAmount,
        maxUses: MOCK_COUPON.maxUses || 100,
        minOrder: MOCK_COUPON.minOrder || 0,
        usesPerCustomer: MOCK_COUPON.usesPerCustomer || 1,
        startDate: MOCK_COUPON.startDate || "",
        endDate: MOCK_COUPON.endDate || "",
        active: MOCK_COUPON.active,
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const generateCode = () => {
    set("code", `KT${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  };

  const handleSave = () => {
    if (!form.code) return;
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate("/m/dashboard/seller-coupons");
    }, 1500);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      navigate("/m/dashboard/seller-coupons");
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <MobileTopBar
        title="Edit Coupon"
        showBack={true}
        rightAction={
          <button
            onClick={handleSave}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
              saved ? "bg-green-600 text-white" : "bg-purple-600 text-white"
            }`}
          >
            {saved ? "✓ Saved" : <><Save size={12} /> Save</>}
          </button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Stats Card */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-4 text-white">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-black">{form.uses || 0}</p>
              <p className="text-xs opacity-80 mt-0.5">Uses</p>
            </div>
            <div>
              <p className="text-2xl font-black">${(form.saved || 0).toFixed(0)}</p>
              <p className="text-xs opacity-80 mt-0.5">Buyer Savings</p>
            </div>
            <div>
              <p className="text-2xl font-black">{form.maxUses || "∞"}</p>
              <p className="text-xs opacity-80 mt-0.5">Max Uses</p>
            </div>
          </div>
        </div>

        {/* Coupon Code */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <label className="text-xs font-bold text-gray-600 block mb-2">Coupon Code *</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={form.code}
              onChange={e => set("code", e.target.value.toUpperCase())}
              placeholder="e.g. SUMMER20"
              maxLength={20}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono font-bold focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={generateCode}
              className="px-3 py-2.5 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Discount Type */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <label className="text-xs font-bold text-gray-600 block mb-3">Discount Type</label>
          <div className="grid grid-cols-3 gap-2">
            {DISCOUNT_TYPES.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => set("type", t.id)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    form.type === t.id ? "border-purple-600 bg-purple-50" : "border-gray-100"
                  }`}
                >
                  <Icon size={20} className={`mx-auto mb-1 ${form.type === t.id ? "text-purple-600" : "text-gray-400"}`} />
                  <p className={`text-[10px] font-bold ${form.type === t.id ? "text-purple-700" : "text-gray-600"}`}>{t.label}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">{t.desc}</p>
                </button>
              );
            })}
          </div>

          {form.type === "percentage" && (
            <div className="mt-4">
              <label className="text-xs text-gray-500 block mb-1.5">Discount Percentage</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={form.discount}
                  onChange={e => set("discount", parseInt(e.target.value))}
                  className={`${inputClass} w-32`}
                />
                <span className="text-sm font-bold text-gray-700">%</span>
              </div>
            </div>
          )}

          {form.type === "fixed" && (
            <div className="mt-4">
              <label className="text-xs text-gray-500 block mb-1.5">Discount Amount ($)</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-700">$</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.fixedAmount}
                  onChange={e => set("fixedAmount", parseFloat(e.target.value))}
                  className={`${inputClass} flex-1`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Conditions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
          <label className="text-xs font-bold text-gray-600 block">Conditions</label>
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Min. Order Amount ($)</label>
            <input
              type="number"
              min="0"
              value={form.minOrder}
              onChange={e => set("minOrder", parseInt(e.target.value))}
              className={inputClass}
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Max Total Uses</label>
            <input
              type="number"
              min="1"
              value={form.maxUses}
              onChange={e => set("maxUses", parseInt(e.target.value))}
              className={inputClass}
              placeholder="Leave blank for unlimited"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Uses Per Customer</label>
            <input
              type="number"
              min="1"
              max="10"
              value={form.usesPerCustomer}
              onChange={e => set("usesPerCustomer", parseInt(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>

        {/* Validity Period */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
          <label className="text-xs font-bold text-gray-600 block">Valid Period</label>
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={e => set("startDate", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">End Date (optional)</label>
            <input
              type="date"
              value={form.endDate}
              onChange={e => set("endDate", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Active Toggle */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-bold text-gray-900">Activate Immediately</p>
              <p className="text-xs text-gray-500 mt-0.5">Make this coupon available to buyers</p>
            </div>
            <div className={`w-12 h-7 rounded-full transition-colors flex items-center px-0.5 ${form.active ? "bg-purple-600" : "bg-gray-300"}`}>
              <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${form.active ? "translate-x-5" : "translate-x-0"}`} />
            </div>
          </label>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <label className="text-xs font-bold text-gray-600 block mb-3">Preview</label>
          <div className={`rounded-xl p-5 text-white text-center bg-gradient-to-r ${
            form.type === "percentage" ? "from-blue-500 to-blue-600" :
            form.type === "fixed" ? "from-green-500 to-green-600" :
            "from-purple-500 to-purple-600"
          }`}>
            <p className="text-3xl font-black">
              {form.type === "percentage" ? `${form.discount}% OFF` :
               form.type === "fixed" ? `$${form.fixedAmount} OFF` :
               "FREE SHIP"}
            </p>
            <p className="font-mono font-bold text-lg mt-1 opacity-90">{form.code || "YOUR-CODE"}</p>
            {form.minOrder > 0 && <p className="text-xs opacity-75 mt-1">Min. order ${form.minOrder}</p>}
          </div>
        </div>

        {/* Delete Button */}
        <div className="pt-4">
          <button
            onClick={handleDelete}
            className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={16} /> Delete Coupon
          </button>
        </div>
      </div>
    </div>
  );
}