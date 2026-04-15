// @ts-nocheck
import { Package, Tag, TrendingUp, Info, Star, FileText } from "lucide-react";

const TABS = [
  { id: "products", label: "All Products", icon: Package },
  { id: "categories", label: "Categories", icon: Tag },
  { id: "top-sellers", label: "Top Sellers", icon: TrendingUp },
  { id: "about", label: "About", icon: Info },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "policies", label: "Policies", icon: FileText },
];

export default function KemetroStoreNav({ currentTab, setCurrentTab }) {
  return (
    <div className="sticky top-[200px] bg-white border-b z-10">
      <div className="flex gap-1 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setCurrentTab(id)}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${
              currentTab === id
                ? "border-[#FF6B00] text-[#FF6B00]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}