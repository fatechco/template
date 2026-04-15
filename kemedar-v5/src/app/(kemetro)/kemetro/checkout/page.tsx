"use client";

import { useState } from "react";
import { CreditCard, MapPin, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

const STEPS = ["Address", "Payment", "Confirm"];

export default function KemetroCheckoutPage() {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({ fullName: "", phone: "", street: "", city: "", area: "" });
  const [payment, setPayment] = useState("cod");

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= step ? "bg-green-600 text-white" : "bg-slate-100 text-slate-400"}`}>
              {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-sm ${i <= step ? "font-medium" : "text-slate-400"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-slate-200" />}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {step === 0 && (
            <div className="bg-white border rounded-xl p-6 space-y-3">
              <h2 className="font-bold flex items-center gap-2"><MapPin className="w-4 h-4" /> Delivery Address</h2>
              <input value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} placeholder="Full name" className="w-full px-4 py-2.5 border rounded-lg text-sm" />
              <input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="Phone number" className="w-full px-4 py-2.5 border rounded-lg text-sm" />
              <input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="Street address" className="w-full px-4 py-2.5 border rounded-lg text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="City" className="px-4 py-2.5 border rounded-lg text-sm" />
                <input value={address.area} onChange={(e) => setAddress({ ...address, area: e.target.value })} placeholder="Area / District" className="px-4 py-2.5 border rounded-lg text-sm" />
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="bg-white border rounded-xl p-6">
              <h2 className="font-bold flex items-center gap-2 mb-4"><CreditCard className="w-4 h-4" /> Payment Method</h2>
              <div className="space-y-2">
                {[{ id: "cod", label: "Cash on Delivery" }, { id: "card", label: "Credit / Debit Card" }, { id: "bank", label: "Bank Transfer" }, { id: "wallet", label: "Kemedar Wallet" }].map((m) => (
                  <label key={m.id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 ${payment === m.id ? "border-green-500 bg-green-50" : ""}`}>
                    <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} className="accent-green-600" />
                    <span className="text-sm font-medium">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="bg-white border rounded-xl p-6 space-y-4">
              <h2 className="font-bold">Review Order</h2>
              <div className="text-sm space-y-2">
                <div className="flex justify-between"><span className="text-slate-500">Deliver to:</span><span>{address.fullName || "Not set"}, {address.city || "N/A"}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Phone:</span><span>{address.phone || "Not set"}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Payment:</span><span className="capitalize">{payment === "cod" ? "Cash on Delivery" : payment}</span></div>
              </div>
            </div>
          )}
          <div className="flex gap-3 mt-4">
            {step > 0 && <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 px-4 py-2 border rounded-lg text-sm hover:bg-slate-50"><ArrowLeft className="w-3 h-3" /> Back</button>}
            {step < 2 ? (
              <button onClick={() => setStep(step + 1)} className="flex items-center gap-1 px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 ml-auto">Next <ArrowRight className="w-3 h-3" /></button>
            ) : (
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 ml-auto">Place Order</button>
            )}
          </div>
        </div>
        <div className="bg-white border rounded-xl p-5 h-fit sticky top-20">
          <h2 className="font-bold mb-3">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Items (3)</span><span>4,940 EGP</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span className="text-green-600">Free</span></div>
            <div className="border-t pt-2 flex justify-between font-bold"><span>Total</span><span>4,940 EGP</span></div>
          </div>
          <Link href="/kemetro/cart" className="text-xs text-blue-600 hover:underline mt-3 inline-block">Edit Cart</Link>
        </div>
      </div>
    </div>
  );
}
