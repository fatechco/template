import { useState } from 'react';
import { useModules } from '@/lib/ModuleContext';
import MobileTopBar from '@/components/mobile-v2/MobileTopBar';
import { Check, Download, TrendingUp } from 'lucide-react';

const PLANS = {
  kemedar: [
    {
      name: 'Starter',
      price: 'Free',
      properties: '5',
      features: ['5 listings', 'Basic stats', 'Email support'],
    },
    {
      name: 'Bronze',
      price: '$29/mo',
      properties: '25',
      features: ['25 listings', 'Advanced analytics', 'Priority support'],
      current: true,
    },
    {
      name: 'Silver',
      price: '$79/mo',
      properties: 'Unlimited',
      features: ['Unlimited listings', 'Full analytics', 'Dedicated manager'],
    },
  ],
  kemetro: [
    {
      name: 'Buyer',
      price: 'Free',
      features: ['Browse products', 'Wishlist', 'Basic reviews'],
    },
    {
      name: 'Seller',
      price: '$49/mo',
      products: '100',
      features: ['100 products', 'Store dashboard', 'Analytics', 'Promotions'],
      current: true,
    },
    {
      name: 'Pro Seller',
      price: '$149/mo',
      products: 'Unlimited',
      features: ['Unlimited products', 'Premium store', 'Full analytics', 'API access'],
    },
  ],
  kemework: [
    {
      name: 'Starter',
      price: 'Free',
      features: ['Post tasks', 'Browse pros', 'Basic messaging'],
    },
    {
      name: 'Pro',
      price: '$39/mo',
      jobs: '50',
      features: ['50 active jobs', 'Advanced tools', 'Priority listing'],
      current: true,
    },
    {
      name: 'Business',
      price: '$99/mo',
      jobs: 'Unlimited',
      features: ['Unlimited jobs', 'Team management', 'Analytics', 'API'],
    },
  ],
};

const INVOICES = [
  { date: 'Mar 1, 2026', plan: 'Bronze Plan', amount: '$29.00', status: 'paid' },
  { date: 'Feb 1, 2026', plan: 'Bronze Plan', amount: '$29.00', status: 'paid' },
  { date: 'Jan 1, 2026', plan: 'Bronze Plan', amount: '$29.00', status: 'paid' },
];

export default function SubscriptionPage() {
  const { activeGlobalModules } = useModules();
  const activeModule = activeGlobalModules[0] || 'kemedar';
  const [showHistory, setShowHistory] = useState(false);

  const plans = PLANS[activeModule] || PLANS.kemedar;
  const currentPlan = plans.find(p => p.current);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <MobileTopBar title="Subscription & Billing" showBack />

      <div className="px-4 py-4 space-y-4">
        {/* Current Plan Card */}
        {currentPlan && (
          <div className="bg-white rounded-2xl p-5 border border-orange-200 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500 font-medium">CURRENT PLAN</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{currentPlan.name}</p>
              </div>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                Active ✅
              </span>
            </div>

            {/* Usage Progress */}
            {currentPlan.properties && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-600">Properties used</p>
                  <p className="text-xs font-bold text-gray-900">{currentPlan.properties} available</p>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-600 w-1/3" />
                </div>
              </div>
            )}

            {currentPlan.products && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-600">Products listed</p>
                  <p className="text-xs font-bold text-gray-900">{currentPlan.products} max</p>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-600 w-1/2" />
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-3">Renews on April 1, 2026</p>
            <button className="w-full mt-4 border-2 border-orange-600 text-orange-600 font-bold py-2.5 rounded-lg hover:bg-orange-50 transition-colors text-sm">
              Manage Plan
            </button>
          </div>
        )}

        {/* Upgrade Options */}
        <div>
          <p className="text-sm font-black text-gray-900 mb-3">Other Plans</p>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`flex-shrink-0 w-48 rounded-2xl p-4 transition-all ${
                  plan.current
                    ? 'bg-orange-600 text-white border-2 border-orange-600'
                    : 'bg-white border border-gray-200 text-gray-900 hover:border-orange-200'
                }`}
              >
                <p className={`text-sm font-bold mb-1 ${plan.current ? 'text-white/80' : 'text-gray-500'}`}>
                  {plan.name}
                </p>
                <p className={`text-xl font-black mb-3 ${plan.current ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}
                </p>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-2 text-xs">
                      <Check size={14} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {!plan.current && (
                  <button className={`w-full font-bold py-2 rounded-lg text-sm transition-colors ${
                    plan.current
                      ? 'bg-white text-orange-600'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}>
                    Upgrade
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment History Toggle */}
        <div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 hover:border-gray-300"
          >
            <span className="font-bold text-gray-900 text-sm">Payment History</span>
            <span className={`transition-transform ${showHistory ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {showHistory && (
            <div className="mt-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {INVOICES.map((invoice, idx) => (
                  <div key={idx} className="px-4 py-3 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">{invoice.plan}</p>
                      <p className="text-xs text-gray-500">{invoice.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{invoice.amount}</p>
                      <button className="text-xs text-orange-600 font-bold hover:underline flex items-center gap-1 mt-0.5">
                        <Download size={12} /> Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FAQ */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <p className="text-sm font-bold text-blue-900 mb-2">Need help?</p>
          <p className="text-xs text-blue-700 mb-3">
            Visit our support center for FAQs and billing information.
          </p>
          <button className="text-xs font-bold text-blue-600 hover:underline">
            View Support Center →
          </button>
        </div>
      </div>
    </div>
  );
}