import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import MobileDashboardTopBar from './MobileDashboardTopBar';
import MobileDashboardDrawer from './MobileDashboardDrawer';
import { ModuleProvider } from '@/lib/ModuleContext';

// ── BOTTOM NAV ───────────────────────────────────────────────────────
const BOTTOM_TABS = [
  { icon: '⚙️', label: 'Settings', path: '/m/settings' },
  { icon: '🔍', label: 'Find', path: '/m/find' },
  { icon: '➕', label: 'Add', path: '/m/add', center: true },
  { icon: '🏷', label: 'Buy', path: '/m/buy' },
  { icon: '👤', label: 'Account', path: '/m/account' },
];

function DashboardBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex items-end"
      style={{ height: 64, maxWidth: 480, margin: '0 auto', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {BOTTOM_TABS.map((tab) => {
        const isActive = location.pathname === tab.path || location.pathname.startsWith(tab.path + '/');
        if (tab.center) {
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex-1 flex flex-col items-center justify-end pb-3"
            >
              <div className="w-14 h-14 rounded-full bg-orange-600 flex items-center justify-center shadow-lg -mt-5 text-2xl">
                {tab.icon}
              </div>
              <span className="text-[10px] font-bold text-orange-600 mt-0.5">{tab.label}</span>
            </button>
          );
        }
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className="flex-1 flex flex-col items-center justify-end pb-3 pt-2"
          >
            <span className="text-xl">{tab.icon}</span>
            <span className={`text-[10px] font-semibold mt-0.5 ${isActive ? 'text-orange-600' : 'text-gray-500'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── PAGE TITLES ──────────────────────────────────────────────────────
const BREADCRUMBS = {
  '/m/dashboard': 'Dashboard',
  '/m/dashboard/my-properties': 'My Properties',
  '/m/dashboard/favorites': 'Saved Properties',
  '/m/dashboard/compare': 'Compare Properties',
  '/m/dashboard/my-buy-requests': 'My Buy Requests',
  '/m/dashboard/search-requests': 'Search Buy Requests',
  '/m/dashboard/buyer-organizer': 'Buyer Organizer',
  '/m/dashboard/seller-organizer': 'Seller Organizer',
  '/m/dashboard/profile': 'My Profile',
  '/m/dashboard/subscription': 'Subscription & Billing',
  '/m/dashboard/messages': 'Messages',
  '/m/dashboard/notifications': 'Notifications',
  '/m/dashboard/settings': 'Settings',
  '/m/dashboard/business-profile': 'Business Profile',
  '/m/dashboard/performance': 'Performance',
  '/m/dashboard/clients': 'Clients',
  '/m/dashboard/appointments': 'Appointments',
  '/m/dashboard/analytics': 'Analytics',
  '/m/dashboard/my-agents': 'My Agents',
  '/m/dashboard/my-projects': 'My Projects',
  '/m/dashboard/wallet': 'My Wallet',
  '/m/dashboard/payment-methods': 'Payment Methods',
  '/m/dashboard/invoices': 'Invoices',
  '/m/dashboard/tickets': 'Support Tickets',
  '/m/dashboard/knowledge': 'Help Center',
  '/m/dashboard/contact-kemedar': 'Contact Us',
  '/m/dashboard/wishlist': 'My Wishlist',
  '/m/dashboard/kemetro-orders': 'Kemetro Orders',
  '/m/dashboard/rfqs': 'My RFQs',
  '/m/dashboard/kemework-tasks': 'My Tasks',
  '/m/dashboard/kemework/orders': 'Task Orders',
  '/m/dashboard/bookmarks': 'Bookmarks',
};

export default function MobileDashboardShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const pageTitle = BREADCRUMBS[location.pathname] || 'Dashboard';

  return (
    <ModuleProvider>
      <div className="relative flex flex-col min-h-screen bg-gray-50 max-w-[480px] mx-auto overflow-hidden">
        <MobileDashboardTopBar
          title={pageTitle}
          onMenuClick={() => setDrawerOpen(true)}
        />

        <MobileDashboardDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />

        <main className="flex-1 pb-16">
          <Outlet />
        </main>

        <DashboardBottomNav />
      </div>
    </ModuleProvider>
  );
}