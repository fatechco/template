"use client";
// @ts-nocheck
const ROLES = [
  {
    group: "👤 General",
    color: "#6B7280",
    roles: [
      { id: "user", icon: "👤", label: "Common User", desc: "Buy, sell or rent properties, shop products & request home services", benefitPath: "/m/benefits/property-buyer" },
      { id: "franchise_owner", icon: "🗺", label: "Franchise Owner", desc: "Local Kemedar representative in your area", benefitPath: "/m/benefits/franchise-owner-area" },
    ],
  },
  {
    group: "🏠 Kemedar — Real Estate",
    color: "#FF6B00",
    roles: [
      { id: "agent", icon: "🤝", label: "Real Estate Agent", desc: "Professional property broker", benefitPath: "/m/benefits/real-estate-agent" },
      { id: "agency", icon: "🏢", label: "Real Estate Agency", desc: "Agency or brokerage company", benefitPath: "/m/benefits/real-estate-agent" },
      { id: "developer", icon: "🏗", label: "Developer", desc: "Real estate developer", benefitPath: "/m/benefits/real-estate-developer" },
    ],
  },
  {
    group: "🛒 Kemetro — Marketplace",
    color: "#0077B6",
    roles: [
      { id: "product_seller", icon: "🏪", label: "Product Seller", desc: "Sell products on Kemetro", benefitPath: "/m/benefits/product-seller" },
    ],
  },
  {
    group: "🔧 Kemework — Home Services",
    color: "#2D6A4F",
    roles: [
      { id: "professional", icon: "👷", label: "Professional", desc: "Offer professional services", benefitPath: "/m/benefits/handyman-or-technician" },
      { id: "finishing_company", icon: "🏢", label: "Finishing Company", desc: "Company offering finishing services", benefitPath: "/m/benefits/handyman-or-technician" },
    ],
  },
];

import { useRouter } from 'next/navigation';

export default function Step2RoleSelection({ form, update }) {
  const router = useRouter();
  
  const toggleRole = (roleId) => {
    const cur = form.selectedRoles || [];
    const updated = cur.includes(roleId) ? cur.filter((r) => r !== roleId) : [...cur, roleId];
    update({ selectedRoles: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">What best describes you?</h2>
        <p className="text-gray-500 text-sm mt-1">Choose one or more roles to get started</p>
      </div>

      <div className="space-y-5">
        {ROLES.map((section) => (
          <div key={section.group}>
            {/* Section Header */}
            <h3
              className="text-xs font-black uppercase tracking-wide mb-3 px-1 py-1.5"
              style={{ color: section.color }}
            >
              {section.group}
            </h3>

            {/* Role Cards Grid */}
            <div className="grid grid-cols-1 gap-2.5">
              {section.roles.map((role) => {
                const isSelected = (form.selectedRoles || []).includes(role.id);
                return (
                  <div
                    key={role.id}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${
                      isSelected
                        ? `border-[${section.color}] bg-[${section.color}]/5`
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                    style={{
                      borderColor: isSelected ? section.color : undefined,
                      backgroundColor: isSelected ? `${section.color}12` : undefined,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleRole(role.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl flex-shrink-0">{role.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-bold text-sm"
                            style={{ color: isSelected ? section.color : "#1F2937" }}
                          >
                            {role.label}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">{role.desc}</p>
                        </div>
                        <div
                          className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5"
                          style={{
                            borderColor: isSelected ? section.color : "#d1d5db",
                            backgroundColor: isSelected ? section.color : "transparent",
                          }}
                        >
                          {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push(role.benefitPath)}
                      className="w-full text-left mt-2 pt-2 border-t border-gray-200"
                      style={{ borderColor: `${section.color}20` }}
                    >
                      <p className="text-xs font-bold transition-colors" style={{ color: section.color }}>
                        What do {role.label.includes('Company') || role.label.includes('Agency') ? 'these' : role.label === 'Real Estate Agent' ? 'Agents' : role.label === 'Franchise Owner' ? 'Franchise Owners' : role.label === 'Professional' ? 'Professionals' : role.label === 'Product Seller' ? 'Sellers' : role.label === 'Product Buyer' ? 'Buyers' : role.label.endsWith('s') ? role.label.slice(0, -1) : role.label} get? →
                      </p>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <p className="text-gray-600 text-xs leading-relaxed">
          You can add more roles later from your profile settings
        </p>
      </div>
    </div>
  );
}