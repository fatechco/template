"use client";
// @ts-nocheck
import { useState } from "react";
import { Plus, Truck, Edit, Trash2, Check, X, MapPin, Package } from "lucide-react";

const INITIAL_ZONES = [
  { id: "z1", name: "Cairo & Giza", regions: ["Cairo", "Giza"], method: "Standard", cost: 0, freeAbove: 50, minDays: 1, maxDays: 2, active: true },
  { id: "z2", name: "Delta Region", regions: ["Alexandria", "Mansoura", "Tanta", "Zagazig"], method: "Standard", cost: 10, freeAbove: 200, minDays: 2, maxDays: 4, active: true },
  { id: "z3", name: "Upper Egypt", regions: ["Assiut", "Sohag", "Luxor", "Aswan"], method: "Standard", cost: 20, freeAbove: 500, minDays: 4, maxDays: 7, active: true },
  { id: "z4", name: "International", regions: ["Saudi Arabia", "UAE", "Kuwait", "Jordan"], method: "Express", cost: 50, freeAbove: 1000, minDays: 7, maxDays: 14, active: false },
];

const EMPTY_ZONE = { name: "", regions: "", method: "Standard", cost: "", freeAbove: "", minDays: "", maxDays: "", active: true };

const METHODS = ["Standard", "Express", "Pickup Only", "Free Shipping"];

export default function KemetroSellerShipping() {
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_ZONE);
  const [editId, setEditId] = useState(null);
  const [saved, setSaved] = useState(false);

  const [globalSettings, setGlobalSettings] = useState({
    freeShippingEnabled: true,
    freeShippingThreshold: "50",
    handlingFee: "0",
    processingDays: "1",
    shipsInternationally: false,
    carrierNotes: "",
  });

  const setG = (k, v) => setGlobalSettings((s) => ({ ...s, [k]: v }));
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = (e) => {
    e.preventDefault();
    const zoneData = {
      ...form,
      id: editId || `z-${Date.now()}`,
      regions: typeof form.regions === "string" ? form.regions.split(",").map((r) => r.trim()) : form.regions,
    };
    if (editId) {
      setZones(zones.map((z) => (z.id === editId ? zoneData : z)));
    } else {
      setZones([...zones, zoneData]);
    }
    setForm(EMPTY_ZONE);
    setEditId(null);
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const deleteZone = (id) => { if (confirm("Delete this shipping zone?")) setZones(zones.filter((z) => z.id !== id)); };
  const toggleZone = (id) => setZones(zones.map((z) => z.id === id ? { ...z, active: !z.active } : z));
  const editZone = (zone) => { setForm({ ...zone, regions: Array.isArray(zone.regions) ? zone.regions.join(", ") : zone.regions }); setEditId(zone.id); setShowForm(true); };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500";
  const Field = ({ label, children, hint }) => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Shipping Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Configure shipping zones, costs, and delivery rules</p>
        </div>
        <button onClick={() => { setForm(EMPTY_ZONE); setEditId(null); setShowForm(true); }} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors">
          <Plus size={18} /> Add Zone
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 font-semibold text-sm">
          <Check size={18} /> Shipping settings saved!
        </div>
      )}

      {/* Global Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2"><Package size={18} /> Global Shipping Rules</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Handling Fee ($)" hint="Added to all orders">
            <input type="number" min="0" step="0.01" value={globalSettings.handlingFee} onChange={(e) => setG("handlingFee", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Processing Time" hint="Before dispatch">
            <div className="flex items-center gap-2">
              <input type="number" min="0" value={globalSettings.processingDays} onChange={(e) => setG("processingDays", e.target.value)} className={inputClass} />
              <span className="text-sm text-gray-500 whitespace-nowrap">days</span>
            </div>
          </Field>
          <Field label="Free Shipping Above ($)">
            <input type="number" min="0" value={globalSettings.freeShippingThreshold} onChange={(e) => setG("freeShippingThreshold", e.target.value)} className={inputClass} disabled={!globalSettings.freeShippingEnabled} />
          </Field>
          <Field label=" ">
            <div className="flex items-center gap-3 mt-2">
              <button type="button" onClick={() => setG("freeShippingEnabled", !globalSettings.freeShippingEnabled)} className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${globalSettings.freeShippingEnabled ? "bg-teal-500" : "bg-gray-300"}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${globalSettings.freeShippingEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
              <span className="text-sm font-semibold text-gray-700">Enable free shipping</span>
            </div>
          </Field>
        </div>
        <Field label="Carrier / Notes">
          <input value={globalSettings.carrierNotes} onChange={(e) => setG("carrierNotes", e.target.value)} className={inputClass} placeholder="e.g. We use Aramex and our own fleet for local deliveries" />
        </Field>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <p className="font-bold text-gray-900 text-sm">Accept International Orders</p>
            <p className="text-xs text-gray-500">Enable shipping to customers outside your country</p>
          </div>
          <button type="button" onClick={() => setG("shipsInternationally", !globalSettings.shipsInternationally)} className={`w-11 h-6 rounded-full transition-colors relative ${globalSettings.shipsInternationally ? "bg-teal-500" : "bg-gray-300"}`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${globalSettings.shipsInternationally ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>

      {/* Zone Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-900 text-lg">{editId ? "Edit" : "Add"} Shipping Zone</h3>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400 hover:text-gray-700" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <Field label="Zone Name *">
                <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} placeholder="e.g. Cairo & Giza" />
              </Field>
              <Field label="Covered Regions" hint="Comma-separated list of cities or countries">
                <input value={form.regions} onChange={(e) => set("regions", e.target.value)} className={inputClass} placeholder="Cairo, Giza, New Cairo" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Shipping Method">
                  <select value={form.method} onChange={(e) => set("method", e.target.value)} className={inputClass}>
                    {METHODS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </Field>
                <Field label="Shipping Cost ($)">
                  <input type="number" min="0" step="0.01" value={form.cost} onChange={(e) => set("cost", e.target.value)} className={inputClass} placeholder="0 = free" />
                </Field>
                <Field label="Free Above ($)">
                  <input type="number" min="0" value={form.freeAbove} onChange={(e) => set("freeAbove", e.target.value)} className={inputClass} placeholder="Order amount" />
                </Field>
                <Field label="Delivery Days">
                  <div className="flex items-center gap-2">
                    <input type="number" min="1" value={form.minDays} onChange={(e) => set("minDays", e.target.value)} className={inputClass} placeholder="Min" />
                    <span className="text-gray-400">–</span>
                    <input type="number" min="1" value={form.maxDays} onChange={(e) => set("maxDays", e.target.value)} className={inputClass} placeholder="Max" />
                  </div>
                </Field>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl transition-colors">{editId ? "Update" : "Add"} Zone</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Zones Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 flex items-center gap-2"><MapPin size={16} /> Shipping Zones</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Zone</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Regions</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Method</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Cost</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Free Above</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Delivery</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((z, i) => (
                <tr key={z.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 font-bold text-gray-900">{z.name}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-[160px]">
                    {(Array.isArray(z.regions) ? z.regions : [z.regions]).join(", ")}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{z.method}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{z.cost === 0 ? <span className="text-green-600">Free</span> : `$${z.cost}`}</td>
                  <td className="px-4 py-3 text-gray-600">${z.freeAbove}</td>
                  <td className="px-4 py-3 text-gray-600">{z.minDays}–{z.maxDays} days</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleZone(z.id)} className={`text-xs font-bold px-2.5 py-1 rounded-full ${z.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {z.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => editZone(z)} className="text-gray-400 hover:text-teal-600 transition-colors"><Edit size={15} /></button>
                      <button onClick={() => deleteZone(z.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}