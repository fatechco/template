import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Upload, Image as ImageIcon, Package, Tag, DollarSign, FileText } from 'lucide-react';

export default function EditProductDesktop() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [saved, setSaved] = useState(false);

  const [product, setProduct] = useState({
    name: 'Wireless Headphones Pro',
    sku: 'WHP-001',
    category: 'Electronics',
    price: 89.99,
    comparePrice: 129.99,
    cost: 45.00,
    stock: 45,
    lowStockThreshold: 10,
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80',
    ],
    variants: [
      { name: 'Color', values: ['Black', 'White', 'Blue'] },
      { name: 'Size', values: ['Standard'] },
    ],
    shipping: { weight: 0.3, length: 20, width: 18, height: 8 },
    seoTitle: 'Wireless Headphones Pro - Premium Audio',
    seoDescription: 'Shop the best wireless headphones with noise cancellation.',
    status: 'active',
  });

  const set = (key, value) => setProduct(p => ({ ...p, [key]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate('/kemetro/seller/products');
    }, 1500);
  };

  const handleImageUpload = () => {
    // Simulate image upload
    const newImage = `https://images.unsplash.com/photo-${Date.now()}?w=400&q=80`;
    set('images', [...product.images, newImage]);
  };

  const removeImage = (index) => {
    set('images', product.images.filter((_, i) => i !== index));
  };

  const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400';
  const labelClass = 'text-sm font-bold text-gray-700 block mb-2';

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Edit Product</h1>
          <p className="text-gray-600">Update product information and settings</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/kemetro/seller/products')}
            className="px-6 py-3 border border-gray-200 font-bold rounded-lg hover:bg-gray-50 text-sm">
            Cancel
          </button>
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all ${
              saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}>
            {saved ? <><Save size={18} /> Saved!</> : <><Save size={18} /> Save Changes</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <Package size={20} className="text-blue-600" /> Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Product Name *</label>
                <input type="text" value={product.name} onChange={e => set('name', e.target.value)} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>SKU *</label>
                  <input type="text" value={product.sku} onChange={e => set('sku', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select value={product.category} onChange={e => set('category', e.target.value)} className={inputClass}>
                    <option>Electronics</option>
                    <option>Masonry Materials</option>
                    <option>Finishing</option>
                    <option>Architectural</option>
                    <option>Electrical</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea value={product.description} onChange={e => set('description', e.target.value)} rows={4}
                  className={`${inputClass} resize-none`} />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-blue-600" /> Product Images
            </h2>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {product.images.map((img, i) => (
                <div key={i} className="relative group">
                  <img src={img} alt={`Product ${i + 1}`} className="w-full aspect-square object-cover rounded-lg border border-gray-200" />
                  <button onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button onClick={handleImageUpload}
                className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors">
                <Upload size={24} />
                <span className="text-xs mt-1">Upload</span>
              </button>
            </div>
            <p className="text-xs text-gray-500">First image will be the main product image. Drag to reorder (coming soon).</p>
          </div>

          {/* Variants */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <Tag size={20} className="text-blue-600" /> Variants
            </h2>
            <div className="space-y-4">
              {product.variants.map((variant, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <input type="text" value={variant.name} onChange={e => {
                    const newVariants = [...product.variants];
                    newVariants[i].name = e.target.value;
                    set('variants', newVariants);
                  }} placeholder="Variant name (e.g., Color)" className={`${inputClass} w-48`} />
                  <input type="text" value={variant.values.join(', ')} onChange={e => {
                    const newVariants = [...product.variants];
                    newVariants[i].values = e.target.value.split(',').map(v => v.trim());
                    set('variants', newVariants);
                  }} placeholder="Values (comma-separated)" className={`${inputClass} flex-1`} />
                </div>
              ))}
              <button onClick={() => set('variants', [...product.variants, { name: '', values: [] }])}
                className="text-sm font-bold text-blue-600 hover:text-blue-700">+ Add Variant</button>
            </div>
          </div>
        </div>

        {/* Right Column - Pricing, Inventory, SEO */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-green-600" /> Pricing
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Price ($)</label>
                <input type="number" step="0.01" value={product.price} onChange={e => set('price', parseFloat(e.target.value))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Compare-at Price</label>
                <input type="number" step="0.01" value={product.comparePrice} onChange={e => set('comparePrice', parseFloat(e.target.value))} className={inputClass} />
                <p className="text-xs text-gray-400 mt-1">Show original price for discounts</p>
              </div>
              <div>
                <label className={labelClass}>Cost per item ($)</label>
                <input type="number" step="0.01" value={product.cost} onChange={e => set('cost', parseFloat(e.target.value))} className={inputClass} />
                <p className="text-xs text-gray-400 mt-1">For profit calculation</p>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4">Inventory</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Stock Quantity</label>
                <input type="number" value={product.stock} onChange={e => set('stock', parseInt(e.target.value))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Low Stock Threshold</label>
                <input type="number" value={product.lowStockThreshold} onChange={e => set('lowStockThreshold', parseInt(e.target.value))} className={inputClass} />
                <p className="text-xs text-gray-400 mt-1">Get notified when stock falls below this</p>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select value={product.status} onChange={e => set('status', e.target.value)} className={inputClass}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4">Shipping</h2>
            <div className="space-y-3">
              <div>
                <label className={labelClass}>Weight (kg)</label>
                <input type="number" step="0.01" value={product.shipping.weight} onChange={e => set('shipping', { ...product.shipping, weight: parseFloat(e.target.value) })} className={inputClass} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">L (cm)</label>
                  <input type="number" value={product.shipping.length} onChange={e => set('shipping', { ...product.shipping, length: parseInt(e.target.value) })} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">W (cm)</label>
                  <input type="number" value={product.shipping.width} onChange={e => set('shipping', { ...product.shipping, width: parseInt(e.target.value) })} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">H (cm)</label>
                  <input type="number" value={product.shipping.height} onChange={e => set('shipping', { ...product.shipping, height: parseInt(e.target.value) })} className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-purple-600" /> SEO
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>SEO Title</label>
                <input type="text" value={product.seoTitle} onChange={e => set('seoTitle', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>SEO Description</label>
                <textarea value={product.seoDescription} onChange={e => set('seoDescription', e.target.value)} rows={3} className={`${inputClass} resize-none`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}