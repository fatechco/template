import { useState } from "react";

const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400";
const labelClass = "block text-sm font-bold text-gray-700 mb-1.5";

export default function KemetroShipperProfile() {
  const [form, setForm] = useState({ name: "FastDeliver Co.", type: "Company", phone: "+20 122 555 7777", whatsapp: "+20 122 555 7777", cities: "Cairo, Giza, Alexandria", pricePerKm: "2.5", pricePerKg: "0.5", minPrice: "20", maxWeight: "1000" });
  const set = (k, v) => setForm({ ...form, [k]: v });

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-black text-gray-900">Profile & Coverage Area</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="font-black text-gray-800">Basic Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>Company / Name</label><input value={form.name} onChange={e => set("name", e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Shipper Type</label>
            <select value={form.type} onChange={e => set("type", e.target.value)} className={inputClass}>
              {["Company", "Individual", "Freight Company", "Taxi Owner"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div><label className={labelClass}>Phone</label><input value={form.phone} onChange={e => set("phone", e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>WhatsApp</label><input value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} className={inputClass} /></div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="font-black text-gray-800">Coverage Area</h3>
        <div><label className={labelClass}>Service Cities (comma-separated)</label><input value={form.cities} onChange={e => set("cities", e.target.value)} className={inputClass} /></div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-teal-500" />
          <span className="text-sm font-medium text-gray-700">I also offer international shipping</span>
        </label>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="font-black text-gray-800">Pricing</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>Price per km ($)</label><input type="number" value={form.pricePerKm} onChange={e => set("pricePerKm", e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Price per kg ($)</label><input type="number" value={form.pricePerKg} onChange={e => set("pricePerKg", e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Min Shipment Price ($)</label><input type="number" value={form.minPrice} onChange={e => set("minPrice", e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Max Weight (kg)</label><input type="number" value={form.maxWeight} onChange={e => set("maxWeight", e.target.value)} className={inputClass} /></div>
        </div>
      </div>
      <button className="bg-teal-600 hover:bg-teal-700 text-white font-black py-3 px-8 rounded-xl transition-colors">Save Changes</button>
    </div>
  );
}