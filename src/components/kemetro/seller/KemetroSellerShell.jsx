import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Store, Package, ShoppingCart, Truck, DollarSign, Star, Megaphone, Settings, Zap, BarChart3, HelpCircle, ChevronDown, Edit } from 'lucide-react';

const SIDEBAR_ITEMS = [
  { label: 'My Store', path: '/kemetro/seller/store-overview', icon: Store },
  { label: 'Store Overview', path: '/kemetro/seller/store-overview', icon: BarChart3 },
  { label: 'My Products', path: '/kemetro/seller/products', icon: Package },
  { label: 'Add Product', path: '/kemetro/seller/add-product', icon: Package, highlight: true },
  { label: 'My Orders', path: '/kemetro/seller/orders', icon: ShoppingCart },
  { label: 'Shipments', path: '/kemetro/seller/shipments', icon: Truck },
  { label: 'Earnings', path: '/kemetro/seller/earnings', icon: DollarSign },
  { label: 'Reviews', path: '/kemetro/seller/reviews', icon: Star },
  { label: 'Promotions', path: '/kemetro/seller/promotions', icon: Megaphone },
  { label: 'Shipping Settings', path: '/kemetro/seller/shipping', icon: Truck },
  { label: 'Coupons', path: '/kemetro/seller/coupons', icon: Zap },
  { label: 'Analytics', path: '/kemetro/seller/analytics', icon: BarChart3 },
  { label: 'Store Settings', path: '/kemetro/seller/settings', icon: Settings },
  { label: '— AI & Smart Tools —', path: null, icon: Zap, isSectionHeader: true },
  { label: '🤖 Kemetro Build™', path: '/kemetro/build', icon: Zap },
  { label: '⚡ Flash Deals', path: '/kemetro/seller/flash', icon: Zap },
];

export default function KemetroSellerShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const sellerInfo = {
    name: 'Dr. Abdullah Abass',
    email: 'abdullah.abass@kemedar.com',
    store: 'Product Seller (Kametro)',
    avatar: 'DA'
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 overflow-y-auto flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <img
              src="https://media.base44.com/images/public/69b5eafc884b1597fb3ea66e/54d638672_kemetro-final.png"
              alt="Kemetro"
              className="h-8 object-contain"
            />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Seller Profile Card */}
        {sidebarOpen && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-sm">
                {sellerInfo.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{sellerInfo.name}</p>
                <p className="text-xs text-gray-500 truncate">{sellerInfo.email}</p>
              </div>
            </div>
            <button className="w-full text-xs font-bold text-blue-600 hover:text-blue-700 text-left">
              Edit Profile →
            </button>
            <div className="mt-3 inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
              {sellerInfo.store}
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 p-2 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            if (item.isSectionHeader) {
              return sidebarOpen ? (
                <p key={item.label} className="px-3 pt-4 pb-1 text-[9px] font-black uppercase tracking-widest text-gray-400">AI & Smart Tools</p>
              ) : null;
            }
            const isActive = location.pathname === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                } ${item.highlight ? 'border-l-4 border-blue-500' : ''}`}
                title={!sidebarOpen ? item.label : ''}
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="truncate flex-1">{item.label}</span>
                    {item.highlight && <span className="text-xs font-bold text-blue-600">+</span>}
                  </>
                )}
              </a>
            );
          })}
        </nav>

        {/* Help Section */}
        <div className="p-4 border-t border-gray-200">
          <a
            href="/kemetro/seller/support"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            title="Help & Support"
          >
            <HelpCircle size={18} className="flex-shrink-0" />
            {sidebarOpen && <span>Help & Support</span>}
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}