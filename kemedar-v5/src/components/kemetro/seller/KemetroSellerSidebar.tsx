// @ts-nocheck
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Package,
  Plus,
  ShoppingCart,
  DollarSign,
  Star,
  Settings,
  Megaphone,
  Truck,
  Ticket,
  TrendingUp,
  CreditCard,
  Phone,
  LogOut,
  Upload,
  Store,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: BarChart3, label: "Overview", to: "/kemetro/seller/dashboard" },
  { icon: Package, label: "My Products", to: "/kemetro/seller/products" },
  { icon: Plus, label: "Add Product", to: "/kemetro/seller/add-product" },
  { icon: ShoppingCart, label: "Orders", to: "/kemetro/seller/orders" },
  { icon: Store, label: "Edit Store", to: "/kemetro/seller/edit-store" },
  { icon: Megaphone, label: "Promotions", to: "/kemetro/seller/promotions" },
  { icon: Ticket, label: "Coupons", to: "/kemetro/seller/coupons" },
  { icon: Truck, label: "Shipping Settings", to: "/kemetro/seller/shipping" },
  { icon: DollarSign, label: "Earnings", to: "/kemetro/seller/earnings" },
  { icon: Star, label: "Reviews", to: "/kemetro/seller/reviews" },
  { icon: TrendingUp, label: "Analytics", to: "/kemetro/seller/analytics" },
  { icon: Settings, label: "Store Settings", to: "/kemetro/seller/settings" },
  { icon: CreditCard, label: "Subscriptions & Services", to: "/kemetro/seller/subscription" },
  { icon: Phone, label: "Support", to: "/kemetro/seller/support" },
];

export default function KemetroSellerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="font-black text-lg text-gray-900">Seller Center</h2>
      </div>

      <nav className="px-3 space-y-1">
        {NAV_ITEMS.map(({ icon: Icon, label, to }) => (
          <Link
            key={label}
            href={to || "#"}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
              pathname === to
                ? "bg-teal-100 text-teal-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 mt-6 border-t">
        <button className="w-full flex items-center justify-center gap-2 text-gray-700 hover:text-red-600 font-semibold text-sm py-2 transition-colors">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}