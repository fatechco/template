import { Plus, Edit, Trash2, X, Check } from "lucide-react";
import { useState } from "react";

const mockPlans = [
  { id: 1, name: "Free", price: 0, propertyLimit: 3, features: ["Basic listing", "1 photo"], active: true },
  { id: 2, name: "Bronze", price: 9.99, propertyLimit: 10, features: ["Promoted listing", "10 photos", "Analytics"], active: true },
  { id: 3, name: "Silver", price: 19.99, propertyLimit: 50, features: ["All Bronze features", "30 photos", "Priority support"], active: true },
  { id: 4, name: "Gold", price: 49.99, propertyLimit: -1, features: ["Unlimited properties", "Unlimited photos", "24/7 support", "Custom branding"], active: true },
];

const mockServices = [
  { id: 1, name: "KEMEDAR VERI", icon: "✅", description: "Property verification service", price: 29.99, category: "One-time", active: true },
  { id: 2, name: "KEMEDAR LIST", icon: "📋", description: "Premium listing enhancement", price: 19.99, category: "Monthly recurring", active: true },
  { id: 3, name: "KEMEDAR UP", icon: "📈", description: "Boost property visibility", price: "Custom", category: "One-time", active: true },
  { id: 4, name: "KEY WITH KEMEDAR", icon: "🔑", description: "Escrow & transaction service", price: "Custom", category: "One-time", active: false },
  { id: 5, name: "KEMEDAR CAMPAIGN", icon: "📢", description: "Marketing campaign package", price: 99.99, category: "Monthly recurring", active: true },
];

export default function ProductsServicesPage() {
  const [tab, setTab] = useState("plans");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Products & Services</h1>
          <p className="text-sm text-gray-600 mt-1">Manage subscription plans and paid services</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-4">
        {["plans", "services"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-bold rounded-t-lg transition-all border-b-2 ${
              tab === t
                ? "border-orange-600 text-orange-600 bg-orange-50"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {t === "plans" ? "Subscription Plans" : "Paid Services"}
          </button>
        ))}
      </div>

      {/* Subscription Plans */}
      {tab === "plans" && (
        <div className="space-y-6">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg font-bold text-sm hover:bg-orange-700">
            <Plus size={16} /> Add New Plan
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockPlans.map(plan => (
              <div key={plan.id} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-bold text-gray-900">${plan.price}</span>/month
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-600 font-bold">
                    Property limit: <span className="text-gray-900 font-bold">{plan.propertyLimit === -1 ? "Unlimited" : plan.propertyLimit}</span>
                  </p>
                  <div className="space-y-1">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Check size={14} className="text-green-600" />
                        <span className="text-gray-800">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button className="font-bold text-sm text-blue-600 hover:underline">Edit Plan</button>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={plan.active} className="rounded" />
                    <span className="text-xs font-bold text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paid Services */}
      {tab === "services" && (
        <div className="space-y-6">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg font-bold text-sm hover:bg-orange-700">
            <Plus size={16} /> Add New Service
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockServices.map(service => (
              <div key={service.id} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{service.icon}</span>
                    <div>
                      <h3 className="text-lg font-black text-gray-900">{service.name}</h3>
                      <p className="text-xs text-gray-600 mt-0.5">{service.description}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="text-xs text-gray-600 font-bold mb-1">Price</p>
                    <p className="text-sm font-bold text-gray-900">{typeof service.price === 'number' ? `$${service.price}` : service.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-bold mb-1">Category</p>
                    <p className="text-sm font-bold text-gray-900">{service.category}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button className="font-bold text-sm text-blue-600 hover:underline">Edit Service</button>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={service.active} className="rounded" />
                    <span className="text-xs font-bold text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}