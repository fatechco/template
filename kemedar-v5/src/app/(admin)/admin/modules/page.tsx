"use client";

import { useState } from "react";
import { Building2, ShoppingBag, Hammer, Settings, Check, X, Layers } from "lucide-react";

interface ModuleItem {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  icon: any;
  color: string;
  isEnabled: boolean;
  features: string[];
}

const MODULES: ModuleItem[] = [
  {
    id: "kemedar",
    name: "Kemedar",
    nameAr: "كيميدار",
    description: "Real estate marketplace — buy, sell, rent properties with AI tools",
    icon: Building2,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    isEnabled: true,
    features: ["Properties", "Auctions", "KemeFrac", "Swap", "Escrow", "Match", "Advisor", "Coach", "Life Score", "DNA", "Verify Pro", "Predict", "Negotiate", "Live Events", "Community"],
  },
  {
    id: "kemetro",
    name: "Kemetro",
    nameAr: "كيميترو",
    description: "Building materials marketplace — products, flash deals, KemeKits",
    icon: ShoppingBag,
    color: "bg-green-50 text-green-600 border-green-200",
    isEnabled: true,
    features: ["Products", "Flash Deals", "KemeKits", "Surplus Market", "Shop the Look", "Group Buy", "Seller Dashboard", "Shipper App"],
  },
  {
    id: "kemework",
    name: "Kemework",
    nameAr: "كيميورك",
    description: "Home services marketplace — find professionals, post tasks",
    icon: Hammer,
    color: "bg-orange-50 text-orange-600 border-orange-200",
    isEnabled: true,
    features: ["Service Orders", "Snap & Fix", "Professionals", "Accreditation", "Finishing Projects"],
  },
];

export default function AdminModulesPage() {
  const [modules, setModules] = useState(MODULES);

  const toggleModule = (id: string) => {
    setModules((prev) => prev.map((m) => m.id === id ? { ...m, isEnabled: !m.isEnabled } : m));
    // TODO: call API to persist
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Modules</h1>
          <p className="text-sm text-slate-500 mt-1">Enable or disable platform modules</p>
        </div>
      </div>

      <div className="grid gap-4">
        {modules.map((mod) => (
          <div key={mod.id} className={`bg-white border rounded-xl p-6 ${!mod.isEnabled ? "opacity-60" : ""}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${mod.color}`}>
                  <mod.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{mod.name}</h3>
                    <span className="text-sm text-slate-400">{mod.nameAr}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{mod.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {mod.features.map((f) => (
                      <span key={f} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleModule(mod.id)}
                className={`relative w-12 h-6 rounded-full transition ${mod.isEnabled ? "bg-blue-600" : "bg-slate-300"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${mod.isEnabled ? "left-6" : "left-0.5"}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
