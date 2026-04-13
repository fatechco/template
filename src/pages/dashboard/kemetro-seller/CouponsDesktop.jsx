import { useState } from 'react';
import { Plus, Search, RefreshCw, Copy, Edit, BarChart2, PauseCircle, Trash2, X, Tag, Truck, DollarSign } from 'lucide-react';

const MOCK_COUPONS = [
  { id: 1, code: 'SUMMER20', type: 'percentage', discount: 20, uses: 45, maxUses: 100, saved: 450, status: 'active', expires: '2025-06-30', minOrder: 50 },
  { id: 2, code: 'SAVE15', type: 'fixed', discount: 15, uses: 28, maxUses: 50, saved: 420, status: 'active', expires: '2025-04-15', minOrder: 0 },
  { id: 3, code: 'FREESHIP', type: 'shipping', discount: 5.99, uses: 12, maxUses: null, saved: 71.88, status: 'scheduled', expires: '2025-03-25', minOrder: 30 },
];

const DISCOUNT_TYPES = [
  { id: 'percentage', label: '🏷 Percentage Discount', icon: Tag },
  { id: 'fixed', label: '💵 Fixed Amount Off', icon: DollarSign },
  { id: 'shipping', label: '🚚 Free Shipping', icon: Truck },
];

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'expired', label: 'Expired' },
  { id: 'disabled', label: 'Disabled' },
];

const TYPE_GRADIENT = {
  percentage: 'from-blue-500 to-blue-600',
  fixed: 'from-green-500 to-green-600',
  shipping: 'from-purple-500 to-purple-600',
};

const STATUS_BADGE = {
  active: 'bg-green-100 text-green-700',
  scheduled: 'bg-yellow-100 text-yellow-700',
  expired: 'bg-red-100 text-red-700',
  disabled: 'bg-gray-100 text-gray-600',
};

const STATUS_LABEL = { active: '✅ Active', scheduled: '⏰ Scheduled', expired: '❌ Expired', disabled: '⏸ Disabled' };

const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400';

function CouponPreview({ form }) {
  return (
    <div className={`bg-gradient-to-r ${TYPE_GRADIENT[form.type] || 'from-purple-500 to-purple-600'} rounded-xl p-5 text-white text-center`}>
      <p className="text-3xl font-black">
        {form.type === 'percentage' ? `${form.discount || 0}% OFF` : form.type === 'fixed' ? `$${form.fixedAmount || 0} OFF` : 'FREE SHIP'}
      </p>
      <p className="font-mono font-bold text-lg mt-1 opacity-90">{form.code || 'YOUR-CODE'}</p>
      {form.minOrder > 0 && <p className="text-xs opacity-75 mt-1">Min. order ${form.minOrder}</p>}
    </div>
  );
}

function CreateModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    code: '', type: 'percentage', discount: 20, fixedAmount: 15,
    maxUses: 100, minOrder: 0, usesPerCustomer: 1, startDate: '', endDate: '', active: true,
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const generateCode = () => set('code', `KT${Math.random().toString(36).substring(2, 8).toUpperCase()}`);

  const handleSave = () => {
    if (!form.code) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h2 className="text-2xl font-black text-gray-900">Create Coupon</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>

        <div className="grid grid-cols-2 gap-8 p-8">
          {/* Left column – form */}
          <div className="space-y-6">
            {/* Code */}
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1.5">Coupon Code *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.code}
                  onChange={e => set('code', e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER20"
                  maxLength={20}
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono font-bold focus:outline-none focus:border-purple-400"
                />
                <button onClick={generateCode} className="px-3 py-2.5 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200" title="Generate random code">
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1.5">Discount Type *</label>
              <div className="grid grid-cols-3 gap-2">
                {DISCOUNT_TYPES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => set('type', t.id)}
                    className={`py-2.5 px-3 rounded-lg font-bold text-xs border-2 transition-all ${form.type === t.id ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-100 hover:border-gray-300 text-gray-600'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {form.type === 'percentage' && (
                <div className="mt-3 flex items-center gap-2">
                  <input type="number" min="1" max="100" value={form.discount} onChange={e => set('discount', parseInt(e.target.value))}
                    className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400" />
                  <span className="text-sm font-bold text-gray-700">% OFF</span>
                </div>
              )}
              {form.type === 'fixed' && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700">$</span>
                  <input type="number" min="0.01" step="0.01" value={form.fixedAmount} onChange={e => set('fixedAmount', parseFloat(e.target.value))}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400" />
                  <span className="text-sm font-bold text-gray-700">OFF</span>
                </div>
              )}
            </div>

            {/* Conditions */}
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-3">Conditions</label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Min. Order Amount ($)</label>
                  <input type="number" min="0" value={form.minOrder} onChange={e => set('minOrder', parseInt(e.target.value))} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Max Total Uses</label>
                  <input type="number" min="1" value={form.maxUses} onChange={e => set('maxUses', parseInt(e.target.value))} placeholder="Leave blank for unlimited" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Uses Per Customer</label>
                  <input type="number" min="1" max="10" value={form.usesPerCustomer} onChange={e => set('usesPerCustomer', parseInt(e.target.value))} className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          {/* Right column – validity + preview */}
          <div className="space-y-6">
            {/* Preview */}
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">Preview</label>
              <CouponPreview form={form} />
            </div>

            {/* Validity */}
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-3">Valid Period</label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">End Date (optional)</label>
                  <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Active toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="w-4 h-4 accent-purple-600" />
              <span className="text-sm font-bold text-gray-700">Activate coupon immediately</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100">
          <button onClick={onClose} className="px-6 py-2.5 border border-gray-200 font-bold rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-sm">🎫 Create Coupon</button>
        </div>
      </div>
    </div>
  );
}

export default function CouponsDesktop() {
  const [coupons, setCoupons] = useState(MOCK_COUPONS);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [copied, setCopied] = useState(null);

  const filtered = coupons.filter(c => {
    const matchStatus = activeFilter === 'all' || c.status === activeFilter;
    const matchSearch = c.code.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalSaved = coupons.reduce((s, c) => s + c.saved, 0);
  const totalUses = coupons.reduce((s, c) => s + c.uses, 0);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleDelete = (id) => setCoupons(c => c.filter(x => x.id !== id));

  const handleSave = (form) => {
    const newCoupon = {
      id: Date.now(),
      code: form.code,
      type: form.type,
      discount: form.type === 'fixed' ? form.fixedAmount : form.discount,
      uses: 0,
      maxUses: form.maxUses || null,
      saved: 0,
      status: form.active ? 'active' : 'disabled',
      expires: form.endDate || '—',
      minOrder: form.minOrder,
    };
    setCoupons(c => [newCoupon, ...c]);
    setShowCreate(false);
  };

  return (
    <div className="p-8">
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onSave={handleSave} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Coupons</h1>
          <p className="text-gray-600">Create and manage discount coupons for your store</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm">
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Coupons', value: coupons.length, color: 'text-gray-900' },
          { label: 'Active', value: coupons.filter(c => c.status === 'active').length, color: 'text-purple-600' },
          { label: 'Total Uses', value: totalUses, color: 'text-blue-600' },
          { label: 'Buyer Savings', value: `$${totalSaved.toFixed(0)}`, color: 'text-green-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 flex items-center gap-4">
        <div className="flex gap-2">
          {STATUS_FILTERS.map(f => {
            const count = f.id === 'all' ? coupons.length : coupons.filter(c => c.status === f.id).length;
            return (
              <button key={f.id} onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors ${activeFilter === f.id ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {f.label} ({count})
              </button>
            );
          })}
        </div>
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search coupon code..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-purple-400" />
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-bold text-gray-700">Coupon</th>
              <th className="px-6 py-3 text-left font-bold text-gray-700">Code</th>
              <th className="px-6 py-3 text-left font-bold text-gray-700">Discount</th>
              <th className="px-6 py-3 text-left font-bold text-gray-700">Uses</th>
              <th className="px-6 py-3 text-left font-bold text-gray-700">Savings</th>
              <th className="px-6 py-3 text-left font-bold text-gray-700">Expires</th>
              <th className="px-6 py-3 text-left font-bold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left font-bold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(coupon => (
              <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r ${TYPE_GRADIENT[coupon.type]} text-white font-black text-sm`}>
                    {coupon.type === 'percentage' ? `${coupon.discount}% OFF` : coupon.type === 'fixed' ? `$${coupon.discount} OFF` : 'FREE SHIP'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-900">{coupon.code}</span>
                    <button onClick={() => handleCopy(coupon.code)} className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="Copy code">
                      {copied === coupon.code ? <span className="text-green-600 text-xs font-bold">✓</span> : <Copy size={14} />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {coupon.type === 'percentage' ? `${coupon.discount}%` : coupon.type === 'fixed' ? `$${coupon.discount}` : 'Free Shipping'}
                  {coupon.minOrder > 0 && <span className="text-xs text-gray-400 block">min. ${coupon.minOrder}</span>}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{coupon.uses}</span>
                    <span className="text-gray-400">/ {coupon.maxUses ?? '∞'}</span>
                  </div>
                  {coupon.maxUses && (
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(100, (coupon.uses / coupon.maxUses) * 100)}%` }} />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-bold text-green-600">${coupon.saved.toFixed(2)}</td>
                <td className="px-6 py-4 text-gray-600">{coupon.expires}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_BADGE[coupon.status]}`}>
                    {STATUS_LABEL[coupon.status]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit"><Edit size={15} /></button>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Stats"><BarChart2 size={15} /></button>
                    <button className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg" title="Disable"><PauseCircle size={15} /></button>
                    <button onClick={() => handleDelete(coupon.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🎫</p>
            <p className="font-bold text-gray-600">No coupons found</p>
            <p className="text-sm mt-1">Create your first coupon to attract more buyers</p>
          </div>
        )}
      </div>
    </div>
  );
}