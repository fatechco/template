"use client";
// @ts-nocheck
import { useState } from "react";

const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400";
const labelClass = "block text-sm font-bold text-gray-700 mb-1.5";

export default function KemetroShipperPayout() {
  const [form, setForm] = useState({ bankName: "", accountName: "", iban: "" });
  const set = (k, v) => setForm({ ...form, [k]: v });

  return (
    <div className="space-y-5 max-w-xl">
      <h1 className="text-2xl font-black text-gray-900">Payout Settings</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="font-black text-gray-800">Bank Account Details</h3>
        <div>
          <label className={labelClass}>Bank Name</label>
          <input value={form.bankName} onChange={e => set("bankName", e.target.value)} className={inputClass} placeholder="e.g. National Bank of Egypt" />
        </div>
        <div>
          <label className={labelClass}>Account Holder Name</label>
          <input value={form.accountName} onChange={e => set("accountName", e.target.value)} className={inputClass} placeholder="As shown on your bank account" />
        </div>
        <div>
          <label className={labelClass}>IBAN</label>
          <input value={form.iban} onChange={e => set("iban", e.target.value)} className={inputClass} placeholder="EG00 0000 0000 0000 0000 0000 0000" />
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 text-white font-black py-3 px-6 rounded-xl transition-colors">Save Bank Details</button>
      </div>
    </div>
  );
}