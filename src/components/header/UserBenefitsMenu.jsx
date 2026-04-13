import { Link } from "react-router-dom";
import { useModules } from "@/lib/ModuleContext";

export default function UserBenefitsMenu() {
  const { isModuleActive } = useModules();
  const showKemetroKemework = isModuleActive('kemetro') || isModuleActive('kemework');
  return (
    <div className={`absolute top-full left-0 mt-0 bg-white rounded-b-xl shadow-2xl border border-gray-100 z-[150] ${showKemetroKemework ? 'w-[520px]' : 'w-[280px]'}`}>
      <div className={`${showKemetroKemework ? 'grid grid-cols-2' : 'flex flex-col'} gap-0 py-4`}>
        {/* LEFT COLUMN */}
        <div className={showKemetroKemework ? "border-r border-gray-100" : ""}>
          <div className="px-6 pb-3">
            <h4 className="font-black text-sm text-gray-900">🏠 Kemedar</h4>
          </div>
          <ul className="flex flex-col">
            {[
              { emoji: '🏠', title: 'Property Owner', desc: 'List, sell or rent your property', to: '/user-benefits/property-seller' },
              { emoji: '🔍', title: 'Property Buyer', desc: 'Find your perfect home', to: '/user-benefits/property-buyer' },
              { emoji: '🤝', title: 'Real Estate Agent', desc: 'Grow your business with Kemedar', to: '/user-benefits/real-estate-agent' },
              { emoji: '🏗', title: 'Real Estate Developer', desc: 'Showcase your projects globally', to: '/user-benefits/real-estate-developer' },
              { emoji: '💰', title: 'Investor', desc: 'Invest in global real estate', to: '/user-benefits/investor' },
              { emoji: '🗺', title: 'Franchise Owner (Area)', desc: 'Own your exclusive territory', to: '/user-benefits/franchise-owner-area' },
            ].map((item) => (
              <li key={item.title}>
                <Link to={item.to} className="flex items-start gap-3 px-6 py-3 hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-b-0">
                  <span className="text-base flex-shrink-0">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT COLUMN — only shown when kemetro or kemework is active */}
        {showKemetroKemework && (
          <div>
            <div className="px-6 pb-3">
              <h4 className="font-black text-sm text-gray-900">
                {isModuleActive('kemetro') && isModuleActive('kemework') ? '🛒 Kemetro & 🔧 Kemework' : isModuleActive('kemetro') ? '🛒 Kemetro' : '🔧 Kemework'}
              </h4>
            </div>
            <ul className="flex flex-col">
              {[
                isModuleActive('kemetro') && { emoji: '🏪', title: 'Product Seller (Store)', desc: 'Sell building & home products', to: '/user-benefits/product-seller' },
                isModuleActive('kemetro') && { emoji: '🛒', title: 'Product Buyer', desc: 'Shop home & building products', to: '/user-benefits/product-buyer' },
                isModuleActive('kemework') && { emoji: '🔧', title: 'Professional / Handyman', desc: 'Offer home services on Kemework', to: '/user-benefits/handyman-or-technician' },
              ].filter(Boolean).map((item) => (
                <li key={item.title}>
                  <Link to={item.to} className="flex items-start gap-3 px-6 py-3 hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-b-0">
                    <span className="text-base flex-shrink-0">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* BOTTOM ORANGE STRIP */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-t border-orange-200 px-6 py-3">
        <Link to="/user-benefits" className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors">
          Not sure which role? Explore All →
        </Link>
      </div>
    </div>
  );
}