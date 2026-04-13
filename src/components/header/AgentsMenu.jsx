import { Link } from "react-router-dom";
import { useModules } from "@/lib/ModuleContext";

const KEMEDAR_ITEMS = [
  { label: "Real Estate Agents", icon: "👤", desc: "Find certified agents", to: "/find-profile/real-estate-agents" },
  { label: "Real Estate Agencies", icon: "🏢", desc: "Browse top agencies", to: "/find-profile/agency" },
  { label: "Real Estate Developers", icon: "🏗️", desc: "Explore developers", to: "/find-profile/developer" },
  { label: "Franchise Owners", icon: "🌐", desc: "Kemedar network", to: "/find-profile/franchise-owner" },
];

const KEMEWORK_ITEMS = [
  { label: "Find a Professional", icon: "🔧", desc: "Home service professionals", to: "/kemework/find-professionals", module: "kemework" },
];

export default function AgentsMenu() {
  const { isModuleActive } = useModules();
  const items = [
    ...KEMEDAR_ITEMS,
    ...(isModuleActive('kemework') ? KEMEWORK_ITEMS : []),
  ];
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 bg-white rounded-b-xl shadow-2xl border border-gray-100 z-[150] w-[320px]">
      <div className="py-3 px-3">
        {items.map((item) => (
          <Link key={item.label} to={item.to} className="flex items-start gap-3 w-full text-left px-3 py-3 rounded-lg hover:bg-orange-50 transition-colors group">
            <span className="text-2xl mt-0.5">{item.icon}</span>
            <div>
              <p className="text-sm font-medium text-gray-800 group-hover:text-[#FF6B00] transition-colors">{item.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}