import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Store,
  Package,
  ShoppingCart,
  Tag,
  DollarSign,
  Star,
  Megaphone,
  CreditCard,
  Truck,
  LogOut,
  ArrowLeftRight,
  Sparkles,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { id: "overview", icon: BarChart3, label: "Kemetro Overview" },
  { id: "sellers", icon: Store, label: "Sellers Management" },
  { id: "products", icon: Package, label: "Products Pending" },
  { id: "orders", icon: ShoppingCart, label: "Orders Management" },
  { id: "categories", icon: Tag, label: "Categories" },
  { id: "commissions", icon: DollarSign, label: "Commissions" },
  { id: "reviews", icon: Star, label: "Reviews" },
  { id: "promotions", icon: Megaphone, label: "Promotions" },
  { id: "packages", icon: CreditCard, label: "Packages & Services" },
  { id: "shipping", icon: Truck, label: "Shipping Management" },
];

const STL_LINKS = [
  { label: "Analytics", path: "/admin/kemetro/shop-the-look" },
  { label: "Images", path: "/admin/kemetro/shop-the-look/images" },
  { label: "Manual Tag", path: "/admin/kemetro/shop-the-look/tag" },
  { label: "Sponsorships", path: "/admin/kemetro/shop-the-look/sponsorships" },
  { label: "Settings", path: "/admin/kemetro/shop-the-look/settings" },
];

export default function KemetroAdminSidebar({ activeSection, setActiveSection }) {
  const location = useLocation();
  const [stlOpen, setStlOpen] = useState(location.pathname.startsWith("/admin/kemetro/shop-the-look"));

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="font-black text-lg text-gray-900">🛒 Kemetro Admin</h2>
      </div>

      <nav className="px-3 space-y-1">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors text-left ${
              activeSection === id
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}

        {/* Shop the Look section */}
        <div>
          <button
            onClick={() => setStlOpen(o => !o)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors text-left ${
              location.pathname.startsWith("/admin/kemetro/shop-the-look")
                ? "bg-teal-100 text-teal-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Sparkles size={18} />
            <span className="flex-1">Shop the Look</span>
            {stlOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {stlOpen && (
            <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-teal-100 pl-3">
              {STL_LINKS.map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    location.pathname === path
                      ? "bg-teal-100 text-teal-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="p-3 mt-6 border-t space-y-1">
        <Link
          to="/admin"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors"
        >
          <ArrowLeftRight size={16} />
          Switch to Kemedar Admin
        </Link>
        <button className="w-full flex items-center justify-center gap-2 text-gray-700 hover:text-red-600 font-semibold text-sm py-2 transition-colors">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}