import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── MODULE CONFIG ────────────────────────────────────────────────────
const MODULES = [
  { key: 'kemedar', label: 'Kemedar', emoji: '🏠' },
  { key: 'kemetro', label: 'Kemetro', emoji: '🛒' },
  { key: 'kemework', label: 'Kemework', emoji: '🔧' },
];

const MODULE_CONTENT = {
  kemedar: {
    greeting: (name) => `Good morning, ${name}! 🏠`,
    sub: 'Here\'s what\'s happening in Kemedar',
    stats: [
      { emoji: '⭐', number: '5', label: 'Saved Properties', trend: '↑ +5% from last month', trendColor: 'text-green-600' },
      { emoji: '🏠', number: '3', label: 'My Properties', trend: '↑ +1 this month', trendColor: 'text-green-600' },
      { emoji: '📋', number: '2', label: 'Buy Requests', trend: 'No new requests', trendColor: 'text-gray-500' },
      { emoji: '👁', number: '128', label: 'Profile Views', trend: '↑ +32 this week', trendColor: 'text-green-600' },
    ],
    actions: [
      { emoji: '🏠', label: 'Browse Properties', path: '/m/find/property', bg: 'bg-gray-100' },
      { emoji: '📋', label: 'Post Buy Request', path: '/m/add/request', bg: 'bg-gray-100' },
      { emoji: '👤', label: 'Find an Agent', path: '/m/find/agent', bg: 'bg-gray-100' },
    ],
  },
  kemetro: {
    greeting: (name) => `Good morning, ${name}! 🛒`,
    sub: 'Here\'s what\'s happening in Kemetro',
    stats: [
      { emoji: '📦', number: '12', label: 'Orders', trend: '↑ +3 orders', trendColor: 'text-green-600' },
      { emoji: '❤️', number: '8', label: 'Wishlist', trend: '', trendColor: 'text-gray-500' },
      { emoji: '🛒', number: '5', label: 'In Cart', trend: '', trendColor: 'text-gray-500' },
      { emoji: '👁', number: '45', label: 'Store Views', trend: '', trendColor: 'text-gray-500' },
    ],
    actions: [
      { emoji: '🛍', label: 'Browse Products', path: '/m/find/product', bg: 'bg-blue-100' },
      { emoji: '❤️', label: 'My Wishlist', path: '/m/dashboard/wishlist', bg: 'bg-red-100' },
      { emoji: '🛒', label: 'My Cart', path: '/m/cart', bg: 'bg-teal-100' },
      { emoji: '📦', label: 'My Orders', path: '/m/dashboard/kemetro-orders', bg: 'bg-blue-900/10' },
      { emoji: '📝', label: 'My RFQs', path: '/m/dashboard/rfqs', bg: 'bg-purple-100' },
    ],
  },
  kemework: {
    greeting: (name) => `Good morning, ${name}! 🔧`,
    sub: 'Here\'s what\'s happening in Kemework',
    stats: [
      { emoji: '📋', number: '8', label: 'Tasks Posted', trend: '', trendColor: 'text-gray-500' },
      { emoji: '🔄', number: '3', label: 'In Progress', trend: '', trendColor: 'text-gray-500' },
      { emoji: '✅', number: '5', label: 'Completed', trend: '', trendColor: 'text-green-600' },
      { emoji: '⭐', number: '4', label: 'Reviews Given', trend: '', trendColor: 'text-gray-500' },
    ],
    actions: [
      { emoji: '📋', label: 'Post a Task', path: '/m/kemework/post-task', bg: 'bg-red-100' },
      { emoji: '👷', label: 'Find Professionals', path: '/m/find/professional', bg: 'bg-teal-100' },
      { emoji: '🔧', label: 'Browse Services', path: '/m/kemework/find', bg: 'bg-teal-900/10' },
      { emoji: '📦', label: 'My Task Orders', path: '/m/dashboard/kemework/orders', bg: 'bg-blue-900/10' },
    ],
  },
};

// Role → default module
function getDefaultModule(role) {
  if (role === 'product_seller' || role === 'product_buyer') return 'kemetro';
  if (role === 'customer' || role === 'professional' || role === 'finishing_company') return 'kemework';
  return 'kemedar';
}

export default function MobileDashboard() {
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const [activeModule, setActiveModule] = useState(() => {
    return localStorage.getItem('kemedar_active_module') || 'kemedar';
  });

  // Set default based on role once loaded
  useEffect(() => {
    if (user?.role) {
      const saved = localStorage.getItem('kemedar_active_module');
      if (!saved) {
        const def = getDefaultModule(user.role);
        setActiveModule(def);
        localStorage.setItem('kemedar_active_module', def);
      }
    }
  }, [user?.role]);

  const handleTabChange = (key) => {
    setActiveModule(key);
    localStorage.setItem('kemedar_active_module', key);
  };

  const firstName = user?.full_name?.split(' ')[0] || 'User';
  const content = MODULE_CONTENT[activeModule] || MODULE_CONTENT.kemedar;

  return (
    <div className="min-h-full bg-gray-50 flex flex-col">
      {/* Module Tab Switcher */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex gap-2">
          {MODULES.map((mod) => {
            const isActive = activeModule === mod.key;
            return (
              <button
                key={mod.key}
                onClick={() => handleTabChange(mod.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <span>{mod.emoji}</span>
                <span>{mod.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-6 space-y-4 pt-4 px-4">
        {/* Greeting Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h1 className="text-xl font-black text-gray-900">{content.greeting(firstName)}</h1>
          <p className="text-sm text-gray-500 mt-1">{content.sub}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {content.stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <p className="text-2xl font-black text-orange-600">{stat.number}</p>
                <span className="text-xl">{stat.emoji}</span>
              </div>
              <p className="text-xs font-semibold text-gray-700">{stat.label}</p>
              {stat.trend ? (
                <p className={`text-xs mt-1 ${stat.trendColor}`}>{stat.trend}</p>
              ) : null}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <h2 className="font-black text-gray-900 text-base">Quick Actions</h2>
          </div>
          <div>
            {content.actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors border-t border-gray-100 first:border-0 active:bg-gray-100"
              >
                <div className={`w-9 h-9 rounded-full ${action.bg} flex items-center justify-center text-lg flex-shrink-0`}>
                  {action.emoji}
                </div>
                <span className="flex-1 font-bold text-sm text-gray-900 text-left">{action.label}</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Subscription Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-orange-600">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500 font-medium">Current Plan</p>
              <p className="text-lg font-black text-gray-900 mt-0.5">Bronze</p>
            </div>
            <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">✅ Active</span>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Listings used</span>
              <span className="font-bold">10 / 25</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-orange-600 w-2/5" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-3">Renews in 28 days</p>
          <button
            onClick={() => navigate('/m/dashboard/subscription')}
            className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-orange-700 transition-colors"
          >
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
}