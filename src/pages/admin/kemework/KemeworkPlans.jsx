import { useState } from "react";
import { Pencil, X, Plus, Trash2 } from "lucide-react";

const DEFAULT_PLANS = [
  { id: 1, name: "Free", price: 0, maxServices: 2, commission: 15, features: ["2 active services", "Basic profile", "Standard support"] },
  { id: 2, name: "Starter", price: 20, maxServices: 10, commission: 10, features: ["10 active services", "Priority profile listing", "Verified badge", "Email support"] },
  { id: 3, name: "Professional", price: 50, maxServices: -1, commission: 7, features: ["Unlimited services", "Top profile placement", "Verified + Featured badge", "Dedicated account manager", "Analytics dashboard", "Priority dispute resolution"] },
];

function PlanModal({ plan, onClose }) {
  const [form, setForm] = useState(plan ? { ...plan } : { name: "", price: 0, maxServices: 5, commission: 10, features: [] });
  const [featureInput, setFeatureInput] = useState("");

  const addFeature = () => { if (featureInput.trim()) { setForm(f => ({ ...f, features: [...f.features, featureInput.trim()] })); setFeatureInput(""); } };
  const removeFeature = (i) => setForm(f => ({ ...f, features: f.features.filter((_, j) => j !== i) }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="font-black text-gray-900">{plan ? `Edit ${plan.name} Plan` : "Add Plan"}</p>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Plan Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Professional" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Price/mo ($)</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Max Services</label>
              <input type="number" value={form.maxServices} onChange={e => setForm(f => ({ ...f, maxServices: +e.target.value }))} placeholder="-1 = unlimited" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Commission %</label>
              <input type="number" value={form.commission} onChange={e => setForm(f => ({ ...f, commission: +e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Features</label>
            <div className="flex gap-2 mb-2">
              <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())} placeholder="Add feature..." className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-400" />
              <button type="button" onClick={addFeature} className="px-3 py-2 rounded-xl bg-teal-50 text-teal-700 font-bold text-sm">
                <Plus size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
              {form.features.map((feat, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-xs text-gray-700">✓ {feat}</span>
                  <button onClick={() => removeFeature(i)} className="text-gray-300 hover:text-red-500"><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="w-full py-3 rounded-xl font-bold text-sm text-white mt-1" style={{ background: "#0D9488" }}>Save Plan</button>
        </div>
      </div>
    </div>
  );
}

export default function KemeworkPlans() {
  const [plans] = useState(DEFAULT_PLANS);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Subscription Plans</h1>
          <p className="text-sm text-gray-500">Manage Kemework professional plans</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold" style={{ background: "#0D9488" }}>
          <Plus size={14} /> Add Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map(plan => (
          <div key={plan.id} className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col ${plan.name === "Professional" ? "border-teal-400 ring-2 ring-teal-100" : "border-gray-100"}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-black text-gray-900 text-lg">{plan.name}</p>
                <p className="text-3xl font-black mt-1">
                  {plan.price === 0 ? <span className="text-gray-500">Free</span> : <><span style={{ color: "#0D9488" }}>${plan.price}</span><span className="text-sm text-gray-400 font-normal">/mo</span></>}
                </p>
              </div>
              <button onClick={() => { setEditing(plan); setShowModal(true); }} className="p-2 rounded-lg hover:bg-gray-100">
                <Pencil size={14} className="text-gray-400" />
              </button>
            </div>
            <div className="flex gap-4 text-xs text-gray-500 mb-4 pb-3 border-b border-gray-100">
              <span>📦 {plan.maxServices === -1 ? "Unlimited" : plan.maxServices} services</span>
              <span>💰 {plan.commission}% commission</span>
            </div>
            <ul className="flex flex-col gap-1.5 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="text-teal-500 flex-shrink-0">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {showModal && <PlanModal plan={editing} onClose={() => setShowModal(false)} />}
    </div>
  );
}