import { useState, useEffect } from 'react';
import { Plus, Tag, Percent, Gift, Zap, Eye, Edit, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SponsorRoomTab from '@/components/shop-the-look/SponsorRoomTab';

const PROMO_TABS = ['All', 'Active', 'Scheduled', 'Expired'];

const PROMOTIONS = [
  { id: 1, name: 'Spring Sale 20% Off', type: 'Discount', discount: '20%', minOrder: '$50', startDate: '2026-03-01', endDate: '2026-04-01', uses: 134, maxUses: 500, status: 'active' },
  { id: 2, name: 'Buy 2 Get 1 Free', type: 'Bundle', discount: 'B2G1', minOrder: '$0', startDate: '2026-03-15', endDate: '2026-03-31', uses: 67, maxUses: 200, status: 'active' },
  { id: 3, name: 'Flash Deal - 30% Off', type: 'Flash', discount: '30%', minOrder: '$30', startDate: '2026-04-05', endDate: '2026-04-06', uses: 0, maxUses: 100, status: 'scheduled' },
  { id: 4, name: 'New Year Promo', type: 'Discount', discount: '15%', minOrder: '$20', startDate: '2026-01-01', endDate: '2026-01-31', uses: 312, maxUses: 300, status: 'expired' },
];

const TYPE_ICONS = {
  Discount: Percent,
  Bundle: Gift,
  Flash: Zap,
};

const TYPE_COLORS = {
  Discount: 'bg-blue-100 text-blue-700',
  Bundle: 'bg-purple-100 text-purple-700',
  Flash: 'bg-orange-100 text-orange-700',
};

const PAGE_TABS = ['Promotions', '🛋️ Sponsor a Room'];

export default function PromotionsDesktop() {
  const [pageTab, setPageTab] = useState('Promotions');
  const [activeTab, setActiveTab] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [promoType, setPromoType] = useState('Discount');
  const [sellerId, setSellerId] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => setSellerId(u?.id)).catch(() => {});
  }, []);

  const filtered = PROMOTIONS.filter(p =>
    activeTab === 'All' ||
    (activeTab === 'Active' && p.status === 'active') ||
    (activeTab === 'Scheduled' && p.status === 'scheduled') ||
    (activeTab === 'Expired' && p.status === 'expired')
  );

  const stats = [
    { label: 'Active Promotions', value: PROMOTIONS.filter(p => p.status === 'active').length, icon: '🎯', color: 'bg-green-50 text-green-700' },
    { label: 'Scheduled', value: PROMOTIONS.filter(p => p.status === 'scheduled').length, icon: '📅', color: 'bg-blue-50 text-blue-700' },
    { label: 'Total Uses', value: PROMOTIONS.reduce((s, p) => s + p.uses, 0), icon: '📊', color: 'bg-purple-50 text-purple-700' },
    { label: 'Avg Discount', value: '21%', icon: '💸', color: 'bg-orange-50 text-orange-700' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Promotions</h1>
          <p className="text-gray-600">Create and manage your store promotions and deals</p>
        </div>
        {pageTab === 'Promotions' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} /> Create Promotion
          </button>
        )}
      </div>

      {/* Page-level tab switcher */}
      <div className="flex gap-1 mb-8 border-b border-gray-200">
        {PAGE_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setPageTab(tab)}
            className={`px-5 py-3 font-bold text-sm border-b-2 transition-all ${
              pageTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sponsor a Room */}
      {pageTab === '🛋️ Sponsor a Room' && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-black text-gray-900">🛋️ Sponsor a Room — Shop the Look</h2>
            <p className="text-gray-600 mt-1">Pin your product to a specific item in a Kemedar property photo. Your product appears first when buyers tap that hotspot.</p>
          </div>
          <SponsorRoomTab sellerId={sellerId} />
        </div>
      )}

      {pageTab !== '🛋️ Sponsor a Room' && (
      <>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className={`${stat.color} rounded-2xl p-5`}>
            <p className="text-3xl mb-1">{stat.icon}</p>
            <p className="text-2xl font-black">{stat.value}</p>
            <p className="text-sm font-bold mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {PROMO_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-all ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab}
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
              {tab === 'All' ? PROMOTIONS.length :
               tab === 'Active' ? PROMOTIONS.filter(p => p.status === 'active').length :
               tab === 'Scheduled' ? PROMOTIONS.filter(p => p.status === 'scheduled').length :
               PROMOTIONS.filter(p => p.status === 'expired').length}
            </span>
          </button>
        ))}
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(promo => {
          const Icon = TYPE_ICONS[promo.type] || Tag;
          const usagePercent = promo.maxUses > 0 ? Math.min((promo.uses / promo.maxUses) * 100, 100) : 0;
          return (
            <div key={promo.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-shadow hover:shadow-lg ${
              promo.status === 'expired' ? 'border-gray-100 opacity-60' : 'border-gray-100'
            }`}>
              {/* Card Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${TYPE_COLORS[promo.type]}`}>
                    <Icon size={12} /> {promo.type}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                    promo.status === 'active' ? 'bg-green-100 text-green-700' :
                    promo.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {promo.status}
                  </span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">{promo.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>🏷 {promo.discount}</span>
                  <span>📦 Min. {promo.minOrder}</span>
                </div>
              </div>

              {/* Dates */}
              <div className="px-5 py-3 bg-gray-50 flex items-center justify-between text-xs text-gray-600">
                <span>📅 Start: <strong>{promo.startDate}</strong></span>
                <span>📅 End: <strong>{promo.endDate}</strong></span>
              </div>

              {/* Usage */}
              <div className="p-5">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2">
                  <span>Usage</span>
                  <span>{promo.uses} / {promo.maxUses}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full ${usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 60 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Eye size={14} /> View
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50">
                    <Edit size={14} /> Edit
                  </button>
                  {promo.status !== 'expired' && (
                    <button className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold text-red-700 border border-red-200 rounded-lg hover:bg-red-50">
                      <Trash2 size={14} /> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Promotion Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Create Promotion</h2>
            <div className="mb-6">
              <label className="text-xs font-bold text-gray-700 block mb-3">Promotion Type</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: 'Discount', icon: Percent, desc: 'Percentage off' },
                  { type: 'Bundle', icon: Gift, desc: 'Buy X get Y' },
                  { type: 'Flash', icon: Zap, desc: 'Limited time' },
                ].map(({ type, icon: Icon, desc }) => (
                  <button
                    key={type}
                    onClick={() => setPromoType(type)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      promoType === type ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={24} className={promoType === type ? 'text-blue-600 mx-auto' : 'text-gray-400 mx-auto'} />
                    <p className={`text-sm font-bold mt-2 ${promoType === type ? 'text-blue-700' : 'text-gray-700'}`}>{type}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Promotion Name</label>
                <input type="text" placeholder="e.g., Spring Sale 20% Off" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Discount Value</label>
                <input type="text" placeholder="e.g., 20% or $10 off" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Minimum Order Amount</label>
                <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">Start Date</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">End Date</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Max Uses (0 = unlimited)</label>
                <input type="number" placeholder="500" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={() => setShowCreateModal(false)} className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700">Create Promotion</button>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}