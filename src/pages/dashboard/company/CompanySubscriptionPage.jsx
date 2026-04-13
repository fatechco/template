import { CheckCircle, Download, Zap, Star } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    price: 79,
    color: "border-gray-300 bg-gray-50",
    badge: "bg-gray-100 text-gray-700",
    features: ["Up to 10 Team Members", "Basic Profile Listing", "Standard Search Visibility", "Email Support", "10 Projects / Month"],
  },
  {
    name: "Professional",
    price: 149,
    color: "border-amber-400 bg-amber-50 ring-2 ring-amber-300",
    badge: "bg-amber-100 text-amber-700",
    features: ["Unlimited Team Members", "Verified Badge 🏅", "Priority Search Ranking", "Unlimited Projects", "Analytics Dashboard", "Client Leads", "Priority Support"],
    popular: true,
  },
  {
    name: "Premium",
    price: 249,
    color: "border-orange-400 bg-orange-50",
    badge: "bg-orange-100 text-orange-700",
    features: ["Everything in Professional", "Dedicated Account Manager", "Custom Company Banner", "Marketing Campaigns", "White-label Portal", "24/7 Support", "Annual Discount"],
  },
];

const HISTORY = [
  { date: "Mar 1, 2026", plan: "Professional", amount: "$149", status: "Paid", method: "Visa •••• 4242" },
  { date: "Feb 1, 2026", plan: "Professional", amount: "$149", status: "Paid", method: "Visa •••• 4242" },
  { date: "Jan 1, 2026", plan: "Starter", amount: "$79", status: "Paid", method: "Visa •••• 4242" },
  { date: "Dec 1, 2025", plan: "Starter", amount: "$79", status: "Paid", method: "Visa •••• 4242" },
];

export default function CompanySubscriptionPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-gray-900">💎 Subscription & Billing</h1>

      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Current Plan</p>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-gray-900">Professional Plan</h2>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle size={11} /> Active
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Renews on <span className="font-semibold text-gray-900">Apr 1, 2026</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-amber-600">$149<span className="text-base font-semibold text-gray-500">/mo</span></p>
            <p className="text-xs text-gray-500 mt-1">Billed monthly · Cancel anytime</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-2">Included Features:</p>
          <div className="flex flex-wrap gap-2">
            {PLANS[1].features.map(f => (
              <span key={f} className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                <CheckCircle size={11} /> {f}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel Subscription
          </button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
            Update Payment Method
          </button>
        </div>
      </div>

      {/* Upgrade Plans */}
      <div>
        <h2 className="text-lg font-black text-gray-900 mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map(plan => (
            <div key={plan.name} className={`relative rounded-xl border-2 p-5 space-y-4 ${plan.color}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-black px-4 py-1 rounded-full flex items-center gap-1">
                  <Star size={10} className="fill-white" /> RECOMMENDED
                </div>
              )}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900">{plan.name}</h3>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${plan.badge}`}>{plan.name}</span>
              </div>
              <p className="text-3xl font-black text-gray-900">
                ${plan.price}<span className="text-sm font-semibold text-gray-500">/mo</span>
              </p>
              <ul className="space-y-2">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={14} className="text-green-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm
                ${plan.popular
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : "bg-orange-500 hover:bg-orange-600 text-white"}`}>
                <Zap size={15} />
                {plan.name === "Professional" ? "Current Plan" : `Switch to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-900">Payment History</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Date", "Plan", "Amount", "Payment Method", "Status", "Receipt"].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HISTORY.map((h, i) => (
              <tr key={i} className={`border-b border-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                <td className="px-6 py-3 text-gray-600">{h.date}</td>
                <td className="px-6 py-3 font-semibold text-gray-900">{h.plan}</td>
                <td className="px-6 py-3 font-black text-gray-900">{h.amount}</td>
                <td className="px-6 py-3 text-gray-500">{h.method}</td>
                <td className="px-6 py-3">
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">{h.status}</span>
                </td>
                <td className="px-6 py-3">
                  <button className="flex items-center gap-1.5 text-blue-600 hover:underline text-xs font-semibold">
                    <Download size={13} /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}