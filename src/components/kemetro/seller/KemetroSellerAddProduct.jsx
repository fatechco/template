import { useState } from "react";
import { Upload, Plus, X, ChevronLeft, Check } from "lucide-react";

const CATEGORIES = [
  "Construction", "Masonry Materials", "Architectural", "Electrical",
  "Plumbing & HVAC", "Finishing & Decoration", "Tools & Equipment", "Furniture & Interior",
];

const SUBCATEGORIES = {
  "Construction": ["Ladders & Scaffoldings", "Heat Insulation", "Waterproofing", "Fireproofing", "Timber", "Building Glass"],
  "Masonry Materials": ["Cement", "Sand & Gravels", "Bricks & Blocks", "Steel", "Gypsum"],
  "Architectural": ["Doors & Windows", "Mosaics", "Paints", "Flooring & Accessories", "Tiles & Accessories", "Natural Stone"],
  "Electrical": ["Cables & Wires", "Switches & Sockets", "Lighting", "Circuit Breakers", "Solar Panels"],
  "Plumbing & HVAC": ["Pipes & Fittings", "Water Heaters", "Sanitary Ware", "Valves", "Air Conditioning"],
  "Finishing & Decoration": ["Interior Paints", "Exterior Paints", "Adhesives & Sealants", "Decorative Panels"],
  "Tools & Equipment": ["Power Tools", "Hand Tools", "Safety Equipment", "Measuring Tools"],
  "Furniture & Interior": ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office Furniture"],
};

const PRICE_UNITS = ["per piece", "per bag", "per m²", "per meter", "per kg", "per ton", "per box", "per liter", "per roll"];

const INITIAL_FORM = {
  name: "", nameAr: "", category: "", subcategory: "", brand: "", origin: "",
  sku: "", price: "", salePrice: "", priceUnit: "per piece", minOrderQuantity: 1,
  stock: "", weight: "", weightUnit: "kg", dimensions: "", material: "",
  warrantyMonths: "", description: "", descriptionAr: "",
};

export default function KemetroSellerAddProduct({ onBack }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [images, setImages] = useState([]);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Required";
    if (!form.category) e.category = "Required";
    if (!form.price) e.price = "Required";
    if (!form.stock) e.stock = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Field = ({ label, required, error, children }) => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  const inputClass = (key) =>
    `w-full border ${errors[key] ? "border-red-400" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors text-sm font-semibold">
          <ChevronLeft size={18} /> Back to Products
        </button>
      </div>
      <div>
        <h1 className="text-2xl font-black text-gray-900">Add New Product</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details to list your product on Kemetro</p>
      </div>

      {saved && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 font-semibold text-sm">
          <Check size={18} /> Product saved successfully! It will be reviewed before going live.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-black text-gray-900">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Product Name (English)" required error={errors.name}>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass("name")} placeholder="e.g. Premium Portland Cement 50kg" />
            </Field>
            <Field label="Product Name (Arabic)">
              <input value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} className={inputClass("nameAr")} placeholder="اسم المنتج بالعربية" dir="rtl" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" required error={errors.category}>
              <select value={form.category} onChange={(e) => { set("category", e.target.value); set("subcategory", ""); }} className={inputClass("category")}>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Subcategory">
              <select value={form.subcategory} onChange={(e) => set("subcategory", e.target.value)} className={inputClass("subcategory")} disabled={!form.category}>
                <option value="">Select subcategory</option>
                {(SUBCATEGORIES[form.category] || []).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Brand">
              <input value={form.brand} onChange={(e) => set("brand", e.target.value)} className={inputClass("brand")} placeholder="e.g. LafargeHolcim" />
            </Field>
            <Field label="Country of Origin">
              <input value={form.origin} onChange={(e) => set("origin", e.target.value)} className={inputClass("origin")} placeholder="e.g. Egypt" />
            </Field>
            <Field label="SKU / Product Code">
              <input value={form.sku} onChange={(e) => set("sku", e.target.value)} className={inputClass("sku")} placeholder="e.g. CEM-50KG-001" />
            </Field>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-black text-gray-900">Pricing & Stock</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Regular Price ($)" required error={errors.price}>
              <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} className={inputClass("price")} placeholder="0.00" />
            </Field>
            <Field label="Sale Price ($)">
              <input type="number" min="0" step="0.01" value={form.salePrice} onChange={(e) => set("salePrice", e.target.value)} className={inputClass("salePrice")} placeholder="Optional" />
            </Field>
            <Field label="Price Unit">
              <select value={form.priceUnit} onChange={(e) => set("priceUnit", e.target.value)} className={inputClass("priceUnit")}>
                {PRICE_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </Field>
            <Field label="Min. Order Qty">
              <input type="number" min="1" value={form.minOrderQuantity} onChange={(e) => set("minOrderQuantity", e.target.value)} className={inputClass("minOrderQuantity")} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Stock Quantity" required error={errors.stock}>
              <input type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} className={inputClass("stock")} placeholder="Available units" />
            </Field>
            <Field label="Warranty (months)">
              <input type="number" min="0" value={form.warrantyMonths} onChange={(e) => set("warrantyMonths", e.target.value)} className={inputClass("warrantyMonths")} placeholder="0 = no warranty" />
            </Field>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-black text-gray-900">Specifications</h2>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Weight">
              <div className="flex gap-2">
                <input type="number" min="0" value={form.weight} onChange={(e) => set("weight", e.target.value)} className={inputClass("weight")} placeholder="0" />
                <select value={form.weightUnit} onChange={(e) => set("weightUnit", e.target.value)} className="border border-gray-200 rounded-lg px-2 text-sm focus:outline-none">
                  {["g", "kg", "ton"].map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
            </Field>
            <Field label="Dimensions (L×W×H)">
              <input value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} className={inputClass("dimensions")} placeholder="e.g. 60×40×15 cm" />
            </Field>
            <Field label="Material">
              <input value={form.material} onChange={(e) => set("material", e.target.value)} className={inputClass("material")} placeholder="e.g. Portland Clinker" />
            </Field>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-black text-gray-900">Product Images</h2>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-teal-400 transition-colors cursor-pointer">
            <Upload size={32} className="mx-auto text-gray-400 mb-3" />
            <p className="font-semibold text-gray-700">Drag & drop images here, or click to upload</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB each · Max 8 images · First image = main thumbnail</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-black text-gray-900">Description</h2>
          <Field label="Description (English)" required>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={5}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 resize-none"
              placeholder="Describe your product in detail — features, specifications, use cases..."
            />
          </Field>
          <Field label="Description (Arabic)">
            <textarea
              value={form.descriptionAr}
              onChange={(e) => set("descriptionAr", e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 resize-none"
              placeholder="وصف المنتج بالعربية..."
              dir="rtl"
            />
          </Field>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pb-8">
          <button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-black py-3.5 rounded-xl transition-colors text-base">
            Submit Product for Review
          </button>
          <button type="button" onClick={onBack} className="px-8 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-gray-400 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}