import { useNavigate } from 'react-router-dom';
import MobileTopBar from '@/components/mobile-v2/MobileTopBar';
import { ChevronRight } from 'lucide-react';

const BENEFITS_CONFIG = [
  {
    section: 'Kemedar® — Real Estate',
    icon: '🏠',
    color: 'from-orange-500 to-orange-600',
    roles: [
      { emoji: '🏠', name: 'Property Owner', path: '/m/benefits/property-seller' },
      { emoji: '🔍', name: 'Property Buyer', path: '/m/benefits/property-buyer' },
      { emoji: '🤝', name: 'Real Estate Agent', path: '/m/benefits/real-estate-agent' },
      { emoji: '🏗', name: 'Developer', path: '/m/benefits/real-estate-developer' },
      { emoji: '💰', name: 'Investor', path: '/m/benefits/investor' },
      { emoji: '🗺', name: 'Franchise Owner', path: '/m/benefits/franchise-owner-area' },
    ],
  },
  {
    section: 'Kemetro® — Marketplace',
    icon: '🛒',
    color: 'from-blue-500 to-blue-600',
    roles: [
      { emoji: '🏪', name: 'Product Seller', path: '/m/benefits/product-seller' },
      { emoji: '🛒', name: 'Product Buyer', path: '/m/benefits/product-buyer' },
    ],
  },
  {
    section: 'Kemework® — Home Services',
    icon: '🔧',
    color: 'from-teal-500 to-teal-600',
    roles: [
      { emoji: '🔧', name: 'Professional', path: '/m/benefits/handyman-or-technician' },
    ],
  },
];

export default function MobileBenefitsHub() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileTopBar title="User Benefits" showBack />

      <div className="pb-8">
        {/* Hero Card */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-4 py-8 space-y-3">
          <div className="text-center">
            <div className="text-4xl mb-4">🌟</div>
            <h1 className="text-2xl font-black leading-tight">Choose Your Role</h1>
            <p className="text-sm text-gray-300 mt-2">Discover what Kemedar offers you</p>
            <p className="text-xs text-gray-400 mt-3">9 roles | 3 platforms | Unlimited benefits</p>
          </div>
        </div>

        {/* Benefit Sections */}
        <div className="px-4 py-6 space-y-6">
          {BENEFITS_CONFIG.map((section, idx) => (
            <div key={idx}>
              {/* Section Header */}
              <div className={`bg-gradient-to-r ${section.color} text-white px-4 py-3 rounded-t-2xl font-bold text-sm flex items-center gap-2`}>
                <span className="text-lg">{section.icon}</span>
                {section.section}
              </div>

              {/* Role Rows */}
              <div className="bg-white border border-gray-200 border-t-0 rounded-b-2xl overflow-hidden">
                {section.roles.map((role, roleIdx) => (
                  <button
                    key={roleIdx}
                    onClick={() => navigate(role.path)}
                    className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left"
                    style={{ borderBottom: roleIdx < section.roles.length - 1 ? '1px solid #f3f4f6' : 'none' }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                      {role.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-900">{role.name}</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Not Sure CTA */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-4 rounded-2xl text-center mt-8">
            <p className="font-bold text-sm mb-2">Not Sure Which Role?</p>
            <button
              onClick={() => navigate('/m/contact')}
              className="text-sm font-bold underline hover:no-underline"
            >
              Contact our team for guidance →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}