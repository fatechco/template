import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Beauty', 'Books', 'Toys', 'Automotive', 'Food & Beverages', 'Other'];
const CONDITIONS = ['New', 'Used - Like New', 'Used - Good', 'Refurbished'];

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 font-black text-gray-900 hover:bg-gray-50 transition-colors"
      >
        <span>{title}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="px-6 pb-6 pt-2">{children}</div>}
    </div>
  );
}

function FormField({ label, required, children, hint }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-bold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export default function AddProductDesktop() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    name_ar: '',
    category: '',
    condition: 'New',
    sku: '',
    barcode: '',
    description: '',
    description_ar: '',
    price: '',
    compare_price: '',
    cost: '',
    stock: '',
    low_stock_threshold: '5',
    weight: '',
    length: '',
    width: '',
    height: '',
    tags: '',
    is_active: true,
    track_quantity: true,
    free_shipping: false,
  });
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const addVariant = () => setVariants(v => [...v, { id: Date.now(), name: '', options: '', price: '', stock: '' }]);
  const removeVariant = (id) => setVariants(v => v.filter(x => x.id !== id));
  const updateVariant = (id, key, value) => setVariants(v => v.map(x => x.id === id ? { ...x, [key]: value } : x));

  const handleImageAdd = () => {
    // Simulate image upload
    setImages(imgs => [...imgs, `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80`]);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      navigate('/kemetro/seller/products');
    }, 1000);
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200";
  const textareaClass = "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 resize-none";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/kemetro/seller/products')}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900">Add New Product</h1>
            <p className="text-xs text-gray-500">Fill in the details below to list your product</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/kemetro/seller/products')}
            className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => set('is_active', false)}
            className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            Save as Draft
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {saving ? 'Publishing...' : 'Publish Product'}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column (2/3) */}
          <div className="col-span-2">

            {/* Basic Info */}
            <Section title="Basic Information">
              <FormField label="Product Name (English)" required>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="e.g. Wireless Bluetooth Headphones"
                  className={inputClass}
                />
              </FormField>
              <FormField label="Product Name (Arabic)" hint="Optional — shown to Arabic-speaking customers">
                <input
                  type="text"
                  value={form.name_ar}
                  onChange={e => set('name_ar', e.target.value)}
                  placeholder="اسم المنتج بالعربية"
                  className={inputClass}
                  dir="rtl"
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Category" required>
                  <select value={form.category} onChange={e => set('category', e.target.value)} className={inputClass}>
                    <option value="">Select category...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Condition">
                  <select value={form.condition} onChange={e => set('condition', e.target.value)} className={inputClass}>
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="SKU" hint="Stock Keeping Unit — your internal reference">
                  <input type="text" value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="e.g. WBH-001" className={inputClass} />
                </FormField>
                <FormField label="Barcode / UPC">
                  <input type="text" value={form.barcode} onChange={e => set('barcode', e.target.value)} placeholder="e.g. 123456789012" className={inputClass} />
                </FormField>
              </div>
            </Section>

            {/* Description */}
            <Section title="Description">
              <FormField label="Description (English)" required>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Describe your product in detail — features, materials, use cases..."
                  className={textareaClass}
                  rows={5}
                />
              </FormField>
              <FormField label="Description (Arabic)" hint="Optional">
                <textarea
                  value={form.description_ar}
                  onChange={e => set('description_ar', e.target.value)}
                  placeholder="وصف المنتج بالعربية..."
                  className={textareaClass}
                  rows={4}
                  dir="rtl"
                />
              </FormField>
              <FormField label="Tags" hint="Comma-separated keywords to help customers find your product">
                <input type="text" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="e.g. wireless, headphones, bluetooth, audio" className={inputClass} />
              </FormField>
            </Section>

            {/* Pricing */}
            <Section title="Pricing">
              <div className="grid grid-cols-3 gap-4">
                <FormField label="Selling Price ($)" required>
                  <input type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" className={inputClass} />
                </FormField>
                <FormField label="Compare-at Price ($)" hint="Original / crossed-out price">
                  <input type="number" min="0" value={form.compare_price} onChange={e => set('compare_price', e.target.value)} placeholder="0.00" className={inputClass} />
                </FormField>
                <FormField label="Cost per Item ($)" hint="Not shown to customers">
                  <input type="number" min="0" value={form.cost} onChange={e => set('cost', e.target.value)} placeholder="0.00" className={inputClass} />
                </FormField>
              </div>
              {form.price && form.compare_price && parseFloat(form.compare_price) > parseFloat(form.price) && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-sm text-green-700 font-bold">
                  💸 Discount: {Math.round((1 - parseFloat(form.price) / parseFloat(form.compare_price)) * 100)}% off
                </div>
              )}
            </Section>

            {/* Inventory */}
            <Section title="Inventory & Stock">
              <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
                <input type="checkbox" id="track_qty" checked={form.track_quantity} onChange={e => set('track_quantity', e.target.checked)} className="w-4 h-4 accent-blue-600" />
                <label htmlFor="track_qty" className="text-sm font-bold text-gray-700 cursor-pointer">Track inventory quantity</label>
              </div>
              {form.track_quantity && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Stock Quantity" required>
                    <input type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" className={inputClass} />
                  </FormField>
                  <FormField label="Low Stock Alert Threshold" hint="Get notified when stock falls below this">
                    <input type="number" min="0" value={form.low_stock_threshold} onChange={e => set('low_stock_threshold', e.target.value)} placeholder="5" className={inputClass} />
                  </FormField>
                </div>
              )}
            </Section>

            {/* Variants */}
            <Section title="Variants (Optional)" defaultOpen={false}>
              <p className="text-sm text-gray-500 mb-4">Add variants like sizes, colors, or styles if your product comes in multiple options.</p>
              {variants.map(v => (
                <div key={v.id} className="border border-gray-200 rounded-xl p-4 mb-3 grid grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Variant Name</label>
                    <input type="text" value={v.name} onChange={e => updateVariant(v.id, 'name', e.target.value)} placeholder="e.g. Color" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Options</label>
                    <input type="text" value={v.options} onChange={e => updateVariant(v.id, 'options', e.target.value)} placeholder="e.g. Red, Blue, Green" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Price Adjustment</label>
                    <input type="number" value={v.price} onChange={e => updateVariant(v.id, 'price', e.target.value)} placeholder="+0.00" className={inputClass} />
                  </div>
                  <button onClick={() => removeVariant(v.id)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-200">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button onClick={addVariant} className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50">
                <Plus size={16} /> Add Variant
              </button>
            </Section>

            {/* Shipping */}
            <Section title="Shipping" defaultOpen={false}>
              <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
                <input type="checkbox" id="free_shipping" checked={form.free_shipping} onChange={e => set('free_shipping', e.target.checked)} className="w-4 h-4 accent-blue-600" />
                <label htmlFor="free_shipping" className="text-sm font-bold text-gray-700 cursor-pointer">Offer free shipping for this product</label>
              </div>
              <p className="text-sm font-bold text-gray-700 mb-4">Package Dimensions</p>
              <div className="grid grid-cols-4 gap-4">
                <FormField label="Weight (kg)">
                  <input type="number" min="0" step="0.1" value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="0.0" className={inputClass} />
                </FormField>
                <FormField label="Length (cm)">
                  <input type="number" min="0" value={form.length} onChange={e => set('length', e.target.value)} placeholder="0" className={inputClass} />
                </FormField>
                <FormField label="Width (cm)">
                  <input type="number" min="0" value={form.width} onChange={e => set('width', e.target.value)} placeholder="0" className={inputClass} />
                </FormField>
                <FormField label="Height (cm)">
                  <input type="number" min="0" value={form.height} onChange={e => set('height', e.target.value)} placeholder="0" className={inputClass} />
                </FormField>
              </div>
            </Section>
          </div>

          {/* Right Column (1/3) */}
          <div>
            {/* Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
              <h3 className="font-black text-gray-900 mb-4">Product Status</h3>
              <div className="space-y-2">
                {[{ value: true, label: 'Active', desc: 'Visible to customers', color: 'green' },
                  { value: false, label: 'Draft', desc: 'Hidden from store', color: 'gray' }].map(opt => (
                  <label key={String(opt.value)} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${form.is_active === opt.value ? 'border-blue-400 bg-blue-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <input type="radio" name="status" checked={form.is_active === opt.value} onChange={() => set('is_active', opt.value)} className="accent-blue-600" />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{opt.label}</p>
                      <p className="text-xs text-gray-500">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
              <h3 className="font-black text-gray-900 mb-4">Product Images</h3>

              {/* Main upload zone */}
              <button
                onClick={handleImageAdd}
                className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-colors mb-3 group"
              >
                <Upload size={28} className="text-gray-400 group-hover:text-blue-500 mb-2" />
                <p className="text-sm font-bold text-gray-500 group-hover:text-blue-600">Click to upload images</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
              </button>

              {/* Image thumbnails */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((src, i) => (
                    <div key={i} className="relative group">
                      <img src={src} alt="" className="w-full h-20 object-cover rounded-lg" />
                      <button
                        onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >×</button>
                      {i === 0 && <span className="absolute bottom-1 left-1 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">Main</span>}
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-3">First image will be the main product photo. Drag to reorder.</p>
            </div>

            {/* Quick Stats Preview */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
              <h3 className="font-black mb-4">Price Preview</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-200">Selling Price</span>
                  <span className="font-black">{form.price ? `$${parseFloat(form.price).toFixed(2)}` : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Platform Fee (5%)</span>
                  <span className="font-black text-red-300">{form.price ? `-$${(parseFloat(form.price) * 0.05).toFixed(2)}` : '—'}</span>
                </div>
                <div className="border-t border-blue-500 pt-3 flex justify-between">
                  <span className="text-blue-200 font-bold">You Receive</span>
                  <span className="font-black text-lg">{form.price ? `$${(parseFloat(form.price) * 0.95).toFixed(2)}` : '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
          <p className="text-sm text-gray-500">All fields marked with <span className="text-red-500 font-bold">*</span> are required before publishing.</p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/kemetro/seller/products')} className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60">
              {saving ? 'Publishing...' : '🚀 Publish Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}