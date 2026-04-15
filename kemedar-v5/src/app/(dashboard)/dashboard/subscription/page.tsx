"use client";

import { useMySubscription, useSubscriptionPlans } from "@/hooks/use-subscriptions";
import { CreditCard } from "lucide-react";

export default function SubscriptionPage() {
  const { data: plan } = useMySubscription();
  const { data: plans } = useSubscriptionPlans();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Subscription</h1>
      <div className="bg-white border rounded-xl p-6 mb-6">
        <h2 className="font-bold mb-2">Current Plan</h2>
        <div className="text-2xl font-bold text-blue-600">{plan ? "Active" : "Free"}</div>
        <p className="text-sm text-slate-500 mt-1">Upgrade for more features</p>
      </div>
      <h2 className="font-bold mb-4">Available Plans</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {(plans?.data || []).map((p: any) => (
          <div key={p.id} className="bg-white border rounded-xl p-5">
            <h3 className="font-bold">{p.name}</h3>
            <div className="text-xl font-bold text-blue-600 my-2">{p.priceMonthlyEGP || 0} EGP/mo</div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 mt-2">
              Upgrade
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
