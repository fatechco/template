import AIGenerateButton from "@/components/ai/AIGenerateButton";

const CATEGORIES = [
  "Furniture", "Lighting", "Flooring", "Building Materials",
  "Electrical", "Plumbing", "Paint", "Sanitary Ware",
  "Hardware & Tools", "Glass & Aluminum", "HVAC", "Other",
];
const SUBCATS = {
  "Furniture": ["Sofas", "Beds", "Tables", "Chairs", "Wardrobes", "Office Furniture"],
  "Lighting": ["Indoor", "Outdoor", "Decorative", "Industrial"],
  "Flooring": ["Tiles", "Marble", "Wood", "Carpet", "Vinyl"],
};
const COUNTRIES = ["Egypt", "China", "UAE", "Turkey", "Italy", "Germany", "USA", "India", "Other"];

export default function ProductStep1({ form, update }) {
  const subcats = SUBCATS[form.category] || [];

  return (
    <div className="space-y-4">
      <p className="font-black text-gray-900 text-base">Product Information</p>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Product Name (English) <span className="text-red-500">*</span></label>
        <input
          type="text"
          placeholder="e.g. Premium Oak Hardwood Flooring"
          value={form.name_en}
          onChange={(e) => update({ name_en: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Product Name (Arabic)</label>
        <input
          type="text"
          placeholder="اسم المنتج بالعربية"
          value={form.name_ar}
          onChange={(e) => update({ name_ar: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
          dir="rtl"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Category <span className="text-red-500">*</span></label>
        <select
          value={form.category}
          onChange={(e) => update({ category: e.target.value, subcategory: "" })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm bg-white focus:outline-none focus:border-orange-400"
        >
          <option value="">Select category</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {subcats.length > 0 && (
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1.5 block">Subcategory</label>
          <select
            value={form.subcategory}
            onChange={(e) => update({ subcategory: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm bg-white focus:outline-none focus:border-orange-400"
          >
            <option value="">Select subcategory</option>
            {subcats.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1.5 block">Brand</label>
          <input
            type="text"
            placeholder="Brand name"
            value={form.brand}
            onChange={(e) => update({ brand: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1.5 block">SKU / Model</label>
          <input
            type="text"
            placeholder="Optional"
            value={form.sku}
            onChange={(e) => update({ sku: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Country of Origin</label>
        <select
          value={form.origin_country}
          onChange={(e) => update({ origin_country: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm bg-white focus:outline-none focus:border-orange-400"
        >
          <option value="">Select country</option>
          {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Short Description</label>
        <textarea
          rows={2}
          placeholder="Brief product summary..."
          value={form.short_description}
          onChange={(e) => update({ short_description: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Full Description</label>
        <textarea
          rows={5}
          placeholder="Detailed product description, features, specifications..."
          value={form.full_description}
          onChange={(e) => update({ full_description: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none"
        />
      </div>
    </div>
  );
}