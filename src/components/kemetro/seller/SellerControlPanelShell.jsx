import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Menu, Plus, Search, ShoppingBag, User, BarChart3, Package, Truck, DollarSign, Star, Settings, HelpCircle, LogOut, ChevronDown, ChevronRight, Store, Megaphone, Zap } from "lucide-react";

const MENU = [
  {
    label: "My Store",
    icon: Store,
    children: [
      { label: "Store Dashboard", path: "/m/cp/seller/dashboard", icon: BarChart3 },
      { label: "Store Profile", path: "/m/cp/seller/store-profile", icon: Store },
      { label: "Store Settings", path: "/m/cp/seller/store-settings", icon: Settings },
    ]
  },
  {
    label: "Products",
    icon: Package,
    children: [
      { label: "All Products", path: "/m/cp/seller/products", icon: Package },
      { label: "Add Product", path: "/m/cp/seller/add-product", icon: Plus, highlight: true },
    ]
  },
  {
    label: "Orders",
    icon: ShoppingBag,
    path: "/m/cp/seller/orders",
  },
  {
    label: "Shipments",
    icon: Truck,
    path: "/m/cp/seller/shipments",
  },
  {
    label: "Earnings",
    icon: DollarSign,
    path: "/m/cp/seller/earnings",
  },
  {
    label: "Reviews",
    icon: Star,
    path: "/m/cp/seller/reviews",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    path: "/m/cp/seller/analytics",
  },
  {
    label: "Promotions",
    icon: Megaphone,
    path: "/m/cp/seller/promotions",
  },
  {
    label: "Coupons",
    icon: Zap,
    path: "/m/cp/seller/coupons",
  },
  {
    label: "Shipping",
    icon: Truck,
    path: "/m/cp/seller/shipping",
  },
  {
    label: "Subscription",
    icon: DollarSign,
    path: "/m/cp/seller/subscription",
  },
  {
    label: "Support",
    icon: HelpCircle,
    path: "/m/cp/seller/support",
  },
];

const BOTTOM_TABS = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/m/cp/seller/dashboard" },
  { id: "products",  label: "Products",  icon: Package, path: "/m/cp/seller/products" },
  { id: "add",       label: "Add",       icon: Plus,   path: "/m/cp/seller/add-product", fab: true },
  { id: "orders",    label: "Orders",    icon: ShoppingBag, path: "/m/cp/seller/orders" },
  { id: "account",   label: "Account",   icon: User,   path: "/m/cp/seller/store-settings" },
];

function SubItem({ item, isActive, onNavigate }) {
  const ChildIcon = item.icon;
  const active = isActive(item.path);
  return (
    <button
      onClick={() => onNavigate(item.path)}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all
        ${active ? "bg-teal-50 text-teal-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
    >
      <ChildIcon size={14} className="flex-shrink-0" />
      <span>{item.label}</span>
      {item.highlight && <span className="ml-auto bg-teal-100 text-teal-700 text-[9px] font-black px-1.5 py-0.5 rounded-full">+</span>}
    </button>
  );
}

function NavItem({ item, isOpen, onToggle, isActive, onNavigate }) {
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  if (hasChildren) {
    const hasActiveChild = item.children.some(c => isActive(c.path));
    return (
      <div>
        <button
          onClick={onToggle}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-l-4
            ${hasActiveChild
              ? "bg-teal-50 text-teal-600 border-teal-500"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent"}`}
        >
          <Icon size={17} className="flex-shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {isOpen ? <ChevronDown size={13} className="opacity-40" /> : <ChevronRight size={13} className="opacity-40" />}
        </button>
        {isOpen && (
          <div className="ml-4 pl-3 border-l border-gray-200 mt-0.5 space-y-0.5">
            {item.children.map((child, ci) => (
              <SubItem key={child.path} item={child} isActive={isActive} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const active = isActive(item.path);
  return (
    <button
      onClick={() => onNavigate(item.path)}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-l-4
        ${active
          ? "bg-teal-50 text-teal-600 border-teal-500"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent"}`}
    >
      <Icon size={17} className="flex-shrink-0" />
      <span>{item.label}</span>
    </button>
  );
}

export default function SellerControlPanelShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  if (isLoadingUser) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  const toggleMenu = (label) => setExpandedMenus(prev => ({ ...prev, [label]: !prev[label] }));
  const isActive = (path) => path && location.pathname === path;
  const handleNavigate = (path) => { navigate(path); setSidebarOpen(false); };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 bottom-0 w-72 bg-white shadow-lg z-50 transition-transform flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
          <img
            src="https://media.base44.com/images/public/69b5eafc884b1597fb3ea66e/54d638672_kemetro-final.png"
            alt="Kemetro"
            className="h-7 object-contain"
          />
          <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded">
            <Menu size={20} className="text-gray-600" />
          </button>
        </div>

        {/* User Profile */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.full_name?.charAt(0).toUpperCase() || "S"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{user?.full_name || "Seller"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => handleNavigate("/m/cp/seller/store-profile")} className="text-xs text-teal-600 font-bold hover:underline">
            Manage Profile →
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {MENU.map((item, idx) => (
            <NavItem
              key={idx}
              item={item}
              isOpen={expandedMenus[item.label]}
              onToggle={() => toggleMenu(item.label)}
              isActive={isActive}
              onNavigate={handleNavigate}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 px-3 py-3">
          <button
            onClick={() => { base44.auth.logout(); setSidebarOpen(false); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-all w-full text-left"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={22} className="text-gray-600" />
          </button>
          <h2 className="font-bold text-gray-900 text-sm flex-1 text-center">Product Seller</h2>
          <div className="w-8" />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto pb-16">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-end z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)", minHeight: 64 }}
      >
        {BOTTOM_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = location.pathname.startsWith(tab.path) && tab.id !== "account";

          if (tab.fab) {
            return (
              <button key={tab.id} onClick={() => navigate(tab.path)} className="flex-1 flex flex-col items-center justify-end pb-2" style={{ minHeight: 64 }}>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center -mt-5 text-white shadow-lg">
                  <Icon size={26} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-medium text-gray-500 mt-1">{tab.label}</span>
              </button>
            );
          }

          return (
            <button key={tab.id} onClick={() => navigate(tab.path)} className="flex-1 flex flex-col items-center justify-center py-2 transition-colors" style={{ minHeight: 64 }}>
              <Icon size={24} color={active ? "#0D9488" : "#9CA3AF"} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] mt-0.5 font-medium ${active ? "text-teal-600" : "text-gray-400"}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}