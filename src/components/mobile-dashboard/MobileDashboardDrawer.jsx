import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { X, ChevronDown } from 'lucide-react';

// ─── Role Config ────────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  common_user:        { label: 'Common User',          icon: '👤', color: '#6B7280', module: 'kemedar' },
  agent:              { label: 'Agent',                 icon: '🤝', color: '#2563EB', module: 'kemedar' },
  agency:             { label: 'Agency',                icon: '🏢', color: '#7C3AED', module: 'kemedar' },
  developer:          { label: 'Developer',             icon: '🏗',  color: '#1E3A5F', module: 'kemedar' },
  franchise_owner_area:    { label: 'Franchise Owner (Area)',    icon: '🗺', color: '#EA580C', module: 'kemedar' },
  franchise_owner_country: { label: 'Franchise Owner (Country)', icon: '🗺', color: '#C2410C', module: 'kemedar' },
  admin:              { label: 'Admin',                 icon: '🔑', color: '#DC2626', module: 'kemedar' },
  product_buyer:      { label: 'Product Buyer',         icon: '🛒', color: '#0EA5E9', module: 'kemetro' },
  product_seller:     { label: 'Product Seller',        icon: '🏪', color: '#0D9488', module: 'kemetro' },
  customer:           { label: 'Customer (Kemework)',   icon: '👤', color: '#10B981', module: 'kemework' },
  professional:       { label: 'Professional',          icon: '👷', color: '#0F766E', module: 'kemework' },
  finishing_company:  { label: 'Finishing Company',     icon: '🏢', color: '#92400E', module: 'kemework' },
};

const ALL_ROLES = Object.keys(ROLE_CONFIG);

// ─── Menu Structures per Role ────────────────────────────────────────────────
const COMMON_ACCOUNT = {
  label: 'Account', icon: '👤',
  children: [
    { label: 'My Profile', path: '/m/dashboard/profile' },
    { label: 'Subscription & Billing', path: '/m/dashboard/subscription' },
    { label: 'Messages', path: '/m/dashboard/messages' },
    { label: 'Notifications', path: '/m/dashboard/notifications' },
    { label: 'Settings', path: '/m/settings' },
  ],
};

const COMMON_USER_MENU = [
  { label: 'Dashboard', icon: '📊', path: '/m/dashboard' },
  { sectionLabel: 'KEMEDAR', color: '#EA580C' },
  { label: 'Find Property', icon: '🔍', path: '/m/find/property' },
  { label: 'My Properties', icon: '🏠', path: '/m/dashboard/my-properties' },
  { label: 'Add New Property', icon: '➕', path: '/m/add/property' },
  { label: 'My Favorites', icon: '❤️', path: '/m/dashboard/favorites' },
  { label: 'Compare Properties', icon: '⚖️', path: '/m/dashboard/compare' },
  { label: 'Buy Requests', icon: '📋', children: [
    { label: 'Add Buy Request', path: '/m/add/buy-request' },
    { label: 'My Buy Requests', path: '/m/dashboard/my-buy-requests' },
    { label: 'Search Buy Requests', path: '/m/find/buy-request' },
  ]},
  { label: 'Projects', icon: '🏗', children: [
    { label: 'Find Project', path: '/m/find/project' },
    { label: 'My Projects', path: '/m/dashboard/my-properties' },
    { label: 'Add New Project', path: '/m/add/project' },
  ]},
  { label: 'Buyer Organizer (Kanban)', icon: '📊', path: '/m/dashboard/buyer-organizer' },
  { label: 'Seller Organizer (Kanban)', icon: '📊', path: '/m/dashboard/seller-organizer' },
  { sectionLabel: 'KEMEWORK', color: '#0F766E' },
  { label: 'Post a Task', icon: '➕', path: '/m/add/task' },
  { label: 'My Tasks', icon: '📋', path: '/m/dashboard/kemework/my-tasks' },
  { label: 'My Task Orders', icon: '📦', path: '/m/dashboard/kemework/orders' },
  { label: 'Find Professionals', icon: '👷', path: '/m/find/professional' },
  { label: 'Browse Services', icon: '🔧', path: '/m/find/service' },
  { label: 'Browse Tasks', icon: '📋', path: '/m/find/buy-request' },
  { label: 'Bookmarked Pros & Services', icon: '🔖', path: '/m/dashboard/kemework/bookmarks' },
  { sectionLabel: 'KEMETRO', color: '#0EA5E9' },
  { label: 'Browse Products', icon: '🛍', path: '/m/find/product' },
  { label: 'My Cart', icon: '🛒', path: '/m/kemetro/cart' },
  { label: 'My Orders', icon: '📦', path: '/m/kemetro/buyer/orders' },
  { label: 'My RFQs', icon: '📝', path: '/m/kemetro/buyer/rfqs' },
  { label: 'Post New RFQ', icon: '➕', path: '/m/add/rfq' },
  { label: '💎 Premium Services', icon: '💎', path: '/m/benefits' },
  { sectionLabel: 'TOOLS & COMMUNICATIONS', color: '#0369A1' },
  { label: 'Messages', icon: '💬', path: '/m/dashboard/messages' },
  { label: 'Notifications', icon: '🔔', path: '/m/dashboard/notifications' },
  { label: 'My Profile', icon: '👤', path: '/m/dashboard/profile' },
  { label: 'Subscription & Billing', icon: '💳', path: '/m/dashboard/subscription' },
  { label: 'Settings', icon: '⚙️', path: '/m/settings' },
  { sectionLabel: 'HELP', color: '#6B7280' },
  { label: 'Support Tickets', icon: '🎫', path: '/m/dashboard/tickets' },
  { label: 'Help Center & FAQ', icon: '📚', path: '/m/dashboard/knowledge' },
  { label: 'Contact Us', icon: '📞', path: '/m/dashboard/contact-kemedar' },
];

const MY_BUSINESS_AGENT = [
  { sectionLabel: 'MY BUSINESS', color: '#059669' },
  { label: 'Business Profile', icon: '🏢', path: '/m/kemedar/agent/business-profile' },
  { label: 'Performance Stats', icon: '📊', path: '/m/kemedar/agent/analytics' },
  { label: 'My Clients', icon: '👥', path: '/m/kemedar/agent/clients' },
  { label: 'Appointments', icon: '📅', path: '/m/kemedar/agent/appointments' },
];

const AGENT_MENU = [
  { label: 'Dashboard', icon: '📊', path: '/m/kemedar/agent/dashboard' },
  ...MY_BUSINESS_AGENT,
  ...COMMON_USER_MENU.slice(1), // everything after Dashboard
  COMMON_ACCOUNT,
];

const AGENCY_MENU = [
  { label: 'Dashboard', icon: '📊', path: '/m/kemedar/agency/dashboard' },
  { sectionLabel: 'MY BUSINESS', color: '#059669' },
  { label: 'Business Profile', icon: '🏢', path: '/m/kemedar/agent/business-profile' },
  { label: 'Performance Stats', icon: '📊', path: '/m/kemedar/agency/analytics' },
  { label: 'My Clients', icon: '👥', path: '/m/kemedar/agent/clients' },
  { label: 'Appointments', icon: '📅', path: '/m/kemedar/agent/appointments' },
  { label: 'My Agents', icon: '👨‍💼', children: [
    { label: 'Agents List', path: '/m/kemedar/agency/my-agents' },
    { label: 'Invite New Agent', path: '/m/kemedar/agency/my-agents' },
    { label: 'Agent Performance', path: '/m/kemedar/agency/analytics' },
  ]},
  { label: 'Agency Analytics', icon: '📊', path: '/m/kemedar/agency/analytics' },
  ...COMMON_USER_MENU.slice(1), // everything after Dashboard
  COMMON_ACCOUNT,
];

const DEVELOPER_MENU = [
  { label: 'Dashboard', icon: '📊', path: '/m/kemedar/developer/dashboard' },
  { sectionLabel: 'MY BUSINESS', color: '#059669' },
  { label: 'Business Profile', icon: '🏢', path: '/m/kemedar/agent/business-profile' },
  { label: 'Performance Stats', icon: '📊', path: '/m/kemedar/developer/analytics' },
  { label: 'My Clients', icon: '👥', path: '/m/kemedar/agent/clients' },
  { label: 'Appointments', icon: '📅', path: '/m/kemedar/agent/appointments' },
  { sectionLabel: 'PROJECTS', color: '#1E3A5F' },
  { label: 'My Projects', icon: '🏗', children: [
    { label: 'All Projects', path: '/m/kemedar/developer/projects' },
    { label: 'Add New Project', path: '/m/kemedar/add/project' },
  ]},
  { label: 'Find Project', icon: '🔍', path: '/m/find/project' },
  { sectionLabel: 'KEMEDAR', color: '#EA580C' },
  { label: 'Find Property', icon: '🔍', path: '/m/find/property' },
  { label: 'My Properties', icon: '🏠', path: '/m/dashboard/my-properties' },
  { label: 'Add New Property', icon: '➕', path: '/m/kemedar/add/property' },
  { label: 'My Favorites', icon: '❤️', path: '/m/dashboard/favorites' },
  { label: 'Buy Requests', icon: '📋', children: [
    { label: 'Add Buy Request', path: '/m/kemedar/add/buy-request' },
    { label: 'My Buy Requests', path: '/m/dashboard/my-buy-requests' },
  ]},
  { sectionLabel: 'KEMETRO', color: '#0EA5E9' },
  { label: 'Browse Products', icon: '🛍', path: '/m/kemetro/search' },
  { label: 'My Cart', icon: '🛒', path: '/m/kemetro/cart' },
  { label: 'My Orders', icon: '📦', path: '/m/kemetro/buyer/orders' },
  { label: 'My RFQs', icon: '📝', path: '/m/kemetro/buyer/rfqs' },
  { label: '💎 Premium Services', icon: '💎', path: '/m/benefits' },
  { sectionLabel: 'TOOLS & COMMUNICATIONS', color: '#0369A1' },
  { label: 'Messages', icon: '💬', path: '/m/dashboard/messages' },
  { label: 'Notifications', icon: '🔔', path: '/m/dashboard/notifications' },
  { label: 'Settings', icon: '⚙️', path: '/m/settings' },
  { sectionLabel: 'HELP', color: '#6B7280' },
  { label: 'Support Tickets', icon: '🎫', path: '/m/dashboard/tickets' },
  { label: 'Help Center & FAQ', icon: '📚', path: '/m/dashboard/knowledge' },
  { label: 'Contact Us', icon: '📞', path: '/m/dashboard/contact-kemedar' },
  COMMON_ACCOUNT,
];

const FO_AREA_MENU = [
  { label: 'Dashboard', icon: '📊', path: '/m/kemedar/franchise/dashboard' },
  { sectionLabel: 'MY AREA', color: '#EA580C' },
  { label: 'Users in My Area', icon: '👥', path: '/m/kemedar/franchise/area-users' },
  { label: 'Area Properties', icon: '🏠', path: '/m/kemedar/franchise/area-properties' },
  { label: 'Area Projects', icon: '🏗', path: '/m/kemedar/franchise/area-projects' },
  { sectionLabel: 'KEMEWORK', color: '#0F766E' },
  { label: 'Find Handyman', icon: '👷', path: '/m/kemedar/franchise/handymen' },
  { label: '💎 Premium Services', icon: '💎', path: '/m/benefits' },
  { sectionLabel: 'MONEY', color: '#D97706' },
  { label: 'Revenue / Wallet', icon: '👛', path: '/m/kemedar/franchise/revenue' },
  { sectionLabel: 'TOOLS', color: '#0369A1' },
  { label: 'Messages', icon: '💬', path: '/m/dashboard/messages' },
  { label: 'Notifications', icon: '🔔', path: '/m/dashboard/notifications' },
  { sectionLabel: 'HELP', color: '#6B7280' },
  { label: 'Support Tickets', icon: '🎫', path: '/m/dashboard/tickets' },
  { label: 'Contact Kemedar', icon: '📞', path: '/m/dashboard/contact-kemedar' },
  { label: 'Knowledge Base', icon: '📚', path: '/m/dashboard/knowledge' },
  COMMON_ACCOUNT,
];

const PRODUCT_BUYER_MENU = [
  { label: 'Dashboard', icon: '📊', path: '/m/dashboard' },
  { sectionLabel: 'KEMETRO', color: '#0EA5E9' },
  { label: 'Browse Products', icon: '🏪', path: '/m/find/product' },
  { label: 'My Wishlist', icon: '❤️', path: '/m/dashboard/wishlist' },
  { label: 'My Cart', icon: '🛒', path: '/m/kemetro/cart' },
  { label: 'My Orders', icon: '📦', path: '/m/kemetro/buyer/orders' },
  { label: 'My RFQs', icon: '📋', path: '/m/kemetro/buyer/rfqs' },
  { label: 'Post New RFQ', icon: '➕', path: '/m/add/rfq' },
  { label: 'Account', icon: '👤', children: [
    { label: 'My Profile', path: '/m/dashboard/profile' },
    { label: 'Payment Methods', path: '/m/dashboard/payment-methods' },
    { label: 'Notifications', path: '/m/dashboard/notifications' },
    { label: 'Settings', path: '/m/settings' },
  ]},
];

const PRODUCT_SELLER_MENU = [
  { label: 'Dashboard', icon: '📊', path: '/m/kemetro/seller/dashboard' },
  { sectionLabel: 'MY STORE', color: '#0D9488' },
  { label: 'My Products', icon: '📦', children: [
    { label: 'All Products', path: '/m/kemetro/seller/products' },
    { label: 'Add Product', path: '/m/kemetro/seller/products/add' },
  ]},
  { label: 'Orders', icon: '🛍', children: [
    { label: 'All Orders', path: '/m/kemetro/seller/orders' },
  ]},
  { label: 'Shipments', icon: '🚚', path: '/m/kemetro/seller/shipments' },
  { label: 'Earnings', icon: '💰', path: '/m/kemetro/seller/earnings' },
  { label: 'Analytics', icon: '📊', path: '/m/kemetro/seller/analytics' },
  { label: 'Promotions', icon: '📣', path: '/m/kemetro/seller/promotions' },
  { label: 'Coupons', icon: '🎫', path: '/m/kemetro/seller/coupons' },
  { label: 'Shipping Settings', icon: '📦', path: '/m/kemetro/seller/shipping' },
  { label: 'Store Settings', icon: '⚙️', path: '/m/kemetro/seller/store-settings' },
  { label: 'Subscription', icon: '💳', path: '/m/kemetro/seller/subscription' },
  { label: 'Support', icon: '🎫', path: '/m/kemetro/seller/support' },
  COMMON_ACCOUNT,
];

const CUSTOMER_MENU = [
  { label: 'Dashboard', icon: '📊', path: '/m/dashboard' },
  { sectionLabel: 'KEMEWORK', color: '#0F766E' },
  { label: 'Find Services', icon: '🔍', path: '/m/find/service' },
  { label: 'Find Professionals', icon: '👷', path: '/m/find/professional' },
  { label: 'Browse Tasks', icon: '📋', path: '/m/find/buy-request' },
  { label: 'Post New Task', icon: '➕', path: '/m/add/task' },
  { label: 'My Tasks', icon: '📋', path: '/m/dashboard/kemework/my-tasks' },
  { label: 'My Orders', icon: '📦', path: '/m/dashboard/kemework/orders' },
  { label: 'Bookmarks', icon: '🔖', path: '/m/dashboard/kemework/bookmarks' },
  { label: 'Messages', icon: '💬', path: '/m/dashboard/messages' },
  { label: 'Settings', icon: '⚙️', path: '/m/settings' },
  COMMON_ACCOUNT,
];

const PROFESSIONAL_MENU = [
  { label: 'Dashboard', icon: '📊', path: '/m/kemework/pro/dashboard' },
  { sectionLabel: 'MY SERVICES', color: '#0F766E' },
  { label: 'My Profile', icon: '👤', path: '/m/kemework/pro/profile' },
  { label: 'My Services', icon: '🔧', path: '/m/kemework/pro/services' },
  { label: 'Available Tasks', icon: '📋', path: '/m/find/buy-request' },
  { label: 'My Bids', icon: '📝', path: '/m/kemework/pro/bids' },
  { label: 'My Orders', icon: '📁', path: '/m/kemework/pro/orders' },
  { label: 'Earnings', icon: '💰', path: '/m/kemework/pro/earnings' },
  { label: 'Portfolio', icon: '🖼', path: '/m/kemework/pro/portfolio' },
  { label: 'Reviews', icon: '⭐', path: '/m/kemework/pro/reviews' },
  { label: 'Accreditation', icon: '🎓', path: '/m/kemework/pro/accreditation' },
  { label: 'Subscription', icon: '💳', path: '/m/kemework/pro/subscription' },
  { label: 'Support', icon: '🎫', path: '/m/kemework/pro/support' },
  { label: 'Messages', icon: '💬', path: '/m/dashboard/messages' },
  COMMON_ACCOUNT,
];

const FINISHING_COMPANY_MENU = [
  { label: 'Dashboard', icon: '📊', path: '/m/kemework/pro/dashboard' },
  { sectionLabel: 'MY BUSINESS', color: '#92400E' },
  { label: 'Company Profile', icon: '🏢', path: '/m/kemework/pro/profile' },
  { label: 'My Services', icon: '📋', path: '/m/kemework/pro/services' },
  { label: 'My Orders', icon: '📁', path: '/m/kemework/pro/orders' },
  { label: 'Earnings', icon: '💰', path: '/m/kemework/pro/earnings' },
  { label: 'Portfolio', icon: '🖼', path: '/m/kemework/pro/portfolio' },
  { label: 'Accreditation', icon: '🎓', path: '/m/kemework/pro/accreditation' },
  { label: 'Subscription', icon: '💳', path: '/m/kemework/pro/subscription' },
  { label: 'Support', icon: '🎫', path: '/m/kemework/pro/support' },
  { label: 'Messages', icon: '💬', path: '/m/dashboard/messages' },
  COMMON_ACCOUNT,
];

const MENU_BY_ROLE = {
  common_user: COMMON_USER_MENU,
  agent: AGENT_MENU,
  agency: AGENCY_MENU,
  developer: DEVELOPER_MENU,
  franchise_owner_area: FO_AREA_MENU,
  franchise_owner_country: FO_AREA_MENU,
  admin: FO_AREA_MENU,
  product_buyer: PRODUCT_BUYER_MENU,
  product_seller: PRODUCT_SELLER_MENU,
  customer: CUSTOMER_MENU,
  professional: PROFESSIONAL_MENU,
  finishing_company: FINISHING_COMPANY_MENU,
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function MobileDashboardDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [expandedItems, setExpandedItems] = useState(new Set());
  const [showRoleSheet, setShowRoleSheet] = useState(false);
  const [showSignOutSheet, setShowSignOutSheet] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [toast, setToast] = useState(null);

  const [activeRole, setActiveRole] = useState(
    () => localStorage.getItem('kemedar_active_role') || 'common_user'
  );

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const roleInfo = ROLE_CONFIG[activeRole] || ROLE_CONFIG.common_user;
  const menuItems = MENU_BY_ROLE[activeRole] || COMMON_USER_MENU;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleRoleSwitch = (roleKey) => {
    setShowRoleSheet(false);
    setSwitching(true);
    setTimeout(() => {
      setActiveRole(roleKey);
      localStorage.setItem('kemedar_active_role', roleKey);
      setExpandedItems(new Set());
      setSwitching(false);
      showToast(`✅ Switched to ${ROLE_CONFIG[roleKey]?.label}`);
      navigate('/m/dashboard');
    }, 500);
  };

  const handleSignOut = () => {
    localStorage.removeItem('kemedar_active_role');
    base44.auth.logout();
    navigate('/m/account/guest');
    onClose();
  };

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const toggleExpanded = (label) => {
    const next = new Set(expandedItems);
    next.has(label) ? next.delete(label) : next.add(label);
    setExpandedItems(next);
  };

  const isActive = (path) => path && location.pathname === path.split('?')[0];

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-40 overflow-hidden">
      {/* Toast */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[200] bg-green-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg whitespace-nowrap">
          {toast}
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute left-0 top-0 z-50 h-full w-[300px] max-w-[85%] bg-white overflow-y-auto flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-gray-900 text-sm">Menu</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg">
            <X size={22} className="text-gray-600" />
          </button>
        </div>

        {/* Profile */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
              style={{ background: roleInfo.color }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{user?.full_name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-white text-[10px] font-bold"
                style={{ background: roleInfo.color }}>
                {roleInfo.icon} {roleInfo.label}
              </span>
            </div>
          </div>
          <button className="text-xs text-blue-600 font-bold hover:underline mt-2 block"
            onClick={() => handleNavigate('/m/dashboard/profile')}>
            Edit Profile →
          </button>
        </div>

        {/* Switching spinner */}
        {switching && (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Menu Items */}
        {!switching && (
          <div className="flex-1 overflow-y-auto py-1">
            {menuItems.map((item, idx) => {
              // Section label
              if (item.sectionLabel) {
                return (
                  <div key={`sec-${idx}`} className="px-4 pt-4 pb-1">
                    <p className="text-[10px] font-black uppercase tracking-wider"
                      style={{ color: item.color || '#9CA3AF' }}>
                      {item.sectionLabel}
                    </p>
                  </div>
                );
              }

              const active = isActive(item.path);
              return (
                <div key={item.label}>
                  <button
                    onClick={() => {
                      if (item.children) toggleExpanded(item.label);
                      else if (item.path) handleNavigate(item.path);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      active ? 'bg-orange-50 text-orange-600' : 'text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                    <span className={`flex-1 text-sm ${active ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                    {item.children && (
                      <ChevronDown size={16} className={`text-gray-400 transition-transform flex-shrink-0 ${expandedItems.has(item.label) ? 'rotate-180' : ''}`} />
                    )}
                  </button>

                  {item.children && expandedItems.has(item.label) && (
                    <div className="bg-gray-50">
                      {item.children.map((child) => (
                        <button
                          key={child.path}
                          onClick={() => handleNavigate(child.path)}
                          className={`w-full text-left px-4 py-2 text-xs pl-11 transition-colors ${
                            isActive(child.path) ? 'bg-orange-100 text-orange-600 font-bold' : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 px-4 py-4 space-y-2 bg-gray-50">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">ACTIVE ROLE</p>
          <button
            onClick={() => setShowRoleSheet(true)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-white font-bold text-sm rounded-lg transition-colors"
            style={{ background: roleInfo.color }}
          >
            <span>{roleInfo.icon} {roleInfo.label}</span>
            <ChevronDown size={16} />
          </button>
          <button
            onClick={() => setShowSignOutSheet(true)}
            className="w-full px-4 py-2.5 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Role Selection Bottom Sheet */}
      {showRoleSheet && (
        <div className="absolute inset-0 z-[100] flex items-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowRoleSheet(false)} />
          <div className="relative bg-white w-full rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="px-4 pt-4 pb-2 border-b border-gray-100">
              <h3 className="font-black text-gray-900 text-lg">Switch Role</h3>
              <p className="text-gray-500 text-sm">Select your active role</p>
            </div>
            <div>
              {ALL_ROLES.map((key) => {
                const r = ROLE_CONFIG[key];
                const isSelected = key === activeRole;
                return (
                  <button
                    key={key}
                    onClick={() => handleRoleSwitch(key)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-base flex-shrink-0"
                      style={{ background: r.color }}>
                      {r.icon}
                    </div>
                    <span className={`flex-1 text-sm ${isSelected ? 'font-black text-gray-900' : 'font-medium text-gray-700'}`}>
                      {r.label}
                    </span>
                    {isSelected && <span className="text-orange-600 font-bold text-lg">✓</span>}
                  </button>
                );
              })}
            </div>
            <div className="px-4 py-3 space-y-2 border-t border-gray-100">
              <button
                onClick={() => { setShowRoleSheet(false); handleNavigate('/m/register'); }}
                className="w-full py-2.5 border-2 border-orange-500 text-orange-600 font-bold text-sm rounded-lg hover:bg-orange-50 transition-colors"
              >
                ➕ Add New Role
              </button>
              <button
                onClick={() => setShowRoleSheet(false)}
                className="w-full py-2 text-gray-500 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Sheet */}
      {showSignOutSheet && (
        <div className="absolute inset-0 z-[100] flex items-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSignOutSheet(false)} />
          <div className="relative bg-white w-full rounded-t-2xl px-4 py-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="text-4xl">🚪</div>
              <h3 className="font-black text-gray-900 text-lg">Sign Out?</h3>
              <p className="text-gray-500 text-sm">You will need to sign in again to access your dashboard.</p>
            </div>
            <button
              onClick={() => setShowSignOutSheet(false)}
              className="w-full py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSignOut}
              className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}