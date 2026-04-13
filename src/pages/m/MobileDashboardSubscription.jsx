import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'Forever',
    listings: 3,
    features: ['3 Listings', 'Basic Profile', 'Standard Support'],
  },
  {
    name: 'Bronze',
    price: '$49',
    period: '/month',
    listings: 25,
    current: true,
    features: ['25 Listings', 'Featured Badge', 'Priority Support', 'Analytics'],
  },
  {
    name: 'Silver',
    price: '$99',
    period: '/month',
    listings: 100,
    features: ['100 Listings', 'Premium Badge', 'Advanced Analytics', '24/7 Support'],
  },
  {
    name: 'Gold',
    price: '$199',
    period: '/month',
    listings: 'Unlimited',
    features: ['Unlimited Listings', 'VIP Badge', 'Custom Domain', 'Dedicated Support'],
  },
];

const INVOICES = [
  { date: 'Mar 15, 2026', plan: 'Bronze Plan', amount: '$49.00', status: 'Paid' },
  { date: 'Feb 15, 2026', plan: 'Bronze Plan', amount: '$49.00', status: 'Paid' },
  { date: 'Jan 15, 2026', plan: 'Free Plan', amount: '$0.00', status: 'Paid' },
];

export default function MobileDashboardSubscription() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Current Plan Card */}
      <div className="px-4 pt-4 pb-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-orange-600">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500 font-medium">Current Plan</p>
              <p className="text-2xl font-black text-gray-900 mt-1">Bronze</p>
            </div>
            <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
              ✅ Active
            </span>
          </div>

          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Listings used</span>
              <span className="font-bold">10 / 25</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-orange-600 w-2/5" />
            </div>
          </div>

          <p className="text-xs text-gray-600 mb-4">Renews on April 15, 2026</p>

          <button className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-orange-700 transition-colors">
            Manage Subscription
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Available Plans</h3>
        <div className="space-y-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg p-4 border-2 transition-all ${
                plan.current
                  ? 'bg-blue-50 border-blue-600 shadow-md'
                  : 'bg-white border-gray-200 hover:border-orange-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900">{plan.name}</p>
                  <p className="text-lg font-black text-orange-600 mt-1">
                    {plan.price}
                    <span className="text-xs text-gray-500 font-medium">
                      {plan.period}
                    </span>
                  </p>
                </div>
                {plan.current && (
                  <span className="px-2.5 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                    Current
                  </span>
                )}
              </div>

              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                    <Check size={14} className="text-green-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.current ? (
                <button className="w-full border border-blue-600 text-blue-600 font-bold py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                  Current Plan
                </button>
              ) : (
                <button className="w-full bg-orange-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors">
                  Upgrade to {plan.name}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="px-4 pb-8">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Payment History</h3>
        <div className="space-y-2">
          {INVOICES.map((invoice, idx) => (
            <div key={idx} className="bg-white rounded-lg p-3 border border-gray-100 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium">{invoice.date}</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{invoice.plan}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-gray-900">{invoice.amount}</p>
                <span className="text-xs text-green-600 font-bold">{invoice.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}