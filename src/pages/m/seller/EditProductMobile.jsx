import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, X, Upload, ArrowLeft } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

export default function EditProductMobile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const [product, setProduct] = useState({
    name: "Premium Portland Cement 50kg",
    sku: "CEM-50KG",
    category: "Masonry Materials",
    price: 7.50,
    stock: 4500,
    description: "High-quality Portland cement for all your construction needs.",
    images: [
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80",
      "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&q=80",
    ],
    status: "active",
  });

  const set = (key, value) => setProduct(p => ({ ...p, [key]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate("/m/dashboard/seller-products");
    }, 1500);
  };

  const handleImageUpload = () => {
    const newImage = `https://images.unsplash.com/photo-${Date.now()}?w=400&q=80`;
    set("images", [...product.images, newImage]);
  };

  const removeImage = (index) => {
    set("images", product.images.filter((_, i) => i !== index));
  };

  const TABS = [
    { id: "details", label: "Details" },
    { id: "pricing", label: "Pricing" },
    { id: "inventory", label: "Stock" },
    { id: "images", label: "Images" },
  ];

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0077B6]";
  const labelClass = "text-xs font-bold text-gray-600 block mb-1.5";

  return (
    <div className="min-h-screen bg-[#F0F7FF] pb-24">
      <MobileTopBar
        title="Edit Product"
        showBack={true}
        rightAction={
          <button
            onClick={handleSave}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
              saved ? "bg-green-600 text-white" : "bg-[#0077B6] text-white"
            }`}
          >
            {saved ? <><Save size={12} /> Saved</> : <><Save size={12} /> Save</>}
          </button>
        }
      />

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-3 py-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap ${
                activeTab === tab.id ? "bg-[#0077B6] text-white" : "bg-white text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
            <div>
              <label className={labelClass}>Product Name *</label>
              <input type="text" value={product.name} onChange={e => set("name", e.target.value)} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>SKU *</label>
                <input type="text" value={product.sku} onChange={e => set("sku", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select value={product.category} onChange={e => set("category", e.target.value)} className={inputClass}>
                  <option>Masonry Materials</option>
                  <option>Finishing</option>
                  <option>Architectural</option>
                  <option>Electrical</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea value={product.description} onChange={e => set("description", e.target.value)} rows={4}
                className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={product.status} onChange={e => set("status", e.target.value)} className={inputClass}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === "pricing" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
            <div>
              <label className={labelClass}>Price ($)</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <span className="px-3 py-2.5 text-sm text-gray-600 bg-gray-50 font-bold">$</span>
                <input type="number" step="0.01" value={product.price} onChange={e => set("price", parseFloat(e.target.value))}
                  className="flex-1 px-3 py-2.5 text-sm focus:outline-none" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Compare-at Price</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <span className="px-3 py-2.5 text-sm text-gray-600 bg-gray-50 font-bold">$</span>
                <input type="number" step="0.01" value={product.comparePrice || ""} onChange={e => set("comparePrice", parseFloat(e.target.value))}
                  className="flex-1 px-3 py-2.5 text-sm focus:outline-none" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Show original price for discounts</p>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
            <div>
              <label className={labelClass}>Stock Quantity</label>
              <input type="number" value={product.stock} onChange={e => set("stock", parseInt(e.target.value))} className={inputClass} />
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-xs text-blue-800">
                📦 Current stock: <strong>{product.stock.toLocaleString()}</strong> units
              </p>
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === "images" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {product.images.map((img, i) => (
                <div key={i} className="relative group aspect-square">
                  <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover rounded-xl border border-gray-200" />
                  <button onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full">
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button onClick={handleImageUpload}
                className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-[#0077B6] hover:text-[#0077B6] transition-colors">
                <Upload size={20} />
                <span className="text-[10px] mt-1">Upload</span>
              </button>
            </div>
            <p className="text-xs text-gray-400">First image will be the main product image.</p>
          </div>
        )}
      </div>

      {/* Save Button (sticky bottom) */}
      <div className="fixed bottom-20 left-0 right-0 max-w-[480px] mx-auto px-4">
        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
            saved ? "bg-green-600 text-white" : "bg-[#0077B6] text-white"
          }`}
        >
          {saved ? "✓ Changes Saved!" : "💾 Save Changes"}
        </button>
      </div>
    </div>
  );
}