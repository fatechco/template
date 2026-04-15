"use client";

import { useState } from "react";
import { CreditCard, Plus, Edit, Trash2, Check, Star } from "lucide-react";

const MOCK_PLANS = [
  { id: "1", name: "Buyer Free", code: "BUYER_FREE", priceMonthly: 0, priceYearly: 0, isActive: true, subscribers: 1200 },
  { id: "2", name: "Buyer Pro", code: "BUYER_PRO", priceMonthly: 99, priceYearly: 990, isActive: true, subscribers: 340 },
  { id: "3", name: "Buyer Premium", code: "BUYER_PREMIUM", priceMonthly: 299, priceYearly: 2990, isActive: true, subscribers: 85 },
  { id: "4", name: "Seller Free", code: "SELLER_FREE", priceMonthly: 0, priceYearly: 0, isActive: true, subscribers: 800 },
  { id: "5", name: "Seller Pro", code: "SELLER_PRO", priceMonthly: 199, priceYearly: 1990, isActive: true, subscribers: 156 },
  { id: "6", name: "Agent Starter", code: "AGENT_STARTER", priceMonthly: 149, priceYearly: 1490, isActive: true, subscribers: 220 },
  { id: "7", name: "Agent Pro", code: "AGENT_PRO", priceMonthly: 499, priceYearly: 4990, isActive: true, subscribers: 95 },
  { id: "8", name: "Developer Pro", code: "DEVELOPER_PRO", priceMonthly: 999, priceYearly: 9990, isActive: true, subscribers: 30 },
];

export default function AdminSubscriptionPlansPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Subscription Plans</h1>
          <p className="text-sm text-slate-500 mt-1">17 plan types across all modules</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Plan
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {MOCK_PLANS.map((plan) => (
          <div key={plan.id} className="bg-white border rounded-xl p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                {plan.priceMonthly === 0 ? <Star className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${plan.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                {plan.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <h3 className="font-bold">{plan.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{plan.code}</p>
            <div className="mt-3">
              {plan.priceMonthly === 0 ? (
                <div className="text-2xl font-bold text-green-600">Free</div>
              ) : (
                <div>
                  <span className="text-2xl font-bold">{plan.priceMonthly}</span>
                  <span className="text-sm text-slate-500"> EGP/mo</span>
                </div>
              )}
              {plan.priceYearly > 0 && (
                <div className="text-xs text-slate-500 mt-0.5">{plan.priceYearly} EGP/year</div>
              )}
            </div>
            <div className="mt-3 pt-3 border-t flex items-center justify-between">
              <span className="text-sm text-slate-500">{plan.subscribers} subscribers</span>
              <button className="text-slate-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
