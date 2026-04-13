import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const fmt = n => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

const PRICE_TIERS = [
  { minUnits: 3, discount: 10, label: "3+ units" },
  { minUnits: 5, discount: 15, label: "5+ units" },
  { minUnits: 10, discount: 20, label: "10+ units" },
  { minUnits: 20, discount: 28, label: "20+ units" },
];

export default function KemetroBuildGroupBuy() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ minParticipants: 5, totalUnits: 20, compoundName: "", closingDays: 14 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.BuildProject.filter({ id: projectId }).then(d => setProject(d[0]));
  }, [projectId]);

  const tileArea = project?.totalAreaSqm ? project.totalAreaSqm * 0.65 : 80;
  const unitPrice = 220;
  const retailTotal = Math.round(tileArea * unitPrice);
  const activeTier = PRICE_TIERS.slice().reverse().find(t => form.minParticipants >= t.minUnits) || PRICE_TIERS[0];
  const discountedPrice = Math.round(retailTotal * (1 - activeTier.discount / 100));
  const savings = retailTotal - discountedPrice;

  const waText = encodeURIComponent(`السلام عليكم! كنت بطلب مواد تشطيب للشقة. لو اشترينا سوا هنوفر ${activeTier.discount}%!\n\nالعمارة: ${form.compoundName}\nالمادة: بلاط 60×60\nالكمية: ${Math.round(tileArea)} م²\n\nانضم هنا: ${window.location.origin}/kemetro/build/${projectId}/group-buy`);

  const handleCreate = async () => {
    setSaving(true);
    const sessionNumber = `KGB-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const user = await base44.auth.me().catch(() => null);
    const closing = new Date();
    closing.setDate(closing.getDate() + form.closingDays);
    const session = await base44.entities.GroupBuySession.create({
      sessionNumber,
      initiatorId: user?.id || "guest",
      groupName: `${form.compoundName || "Group"} — Tiles`,
      targetMaterial: `60×60 Porcelain Tiles (${Math.round(tileArea)} m² per unit)`,
      targetQuantityPerUnit: Math.round(tileArea),
      minimumParticipants: form.minParticipants,
      maximumParticipants: form.totalUnits,
      currentParticipants: 1,
      retailPrice: unitPrice,
      targetDiscountPercent: activeTier.discount,
      priceBreakdown: PRICE_TIERS,
      compoundName: form.compoundName,
      status: "forming",
      closingDate: closing.toISOString(),
      participants: [{ userId: user?.id || "guest", projectId, quantity: Math.round(tileArea), joinedAt: new Date().toISOString(), paid: false }],
    });
    await base44.entities.BuildProject.update(projectId, { isGroupBuy: true, groupBuyId: session.id });
    navigate(`/kemetro/group-buy/${session.id}`);
  };

  if (!project) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-teal-600 text-white px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-teal-200 text-sm mb-1">🏗️ Kemetro Build™</p>
          <h1 className="text-2xl font-black">👥 Start a Group Buy</h1>
          <p className="text-teal-200 text-sm mt-1">Save {activeTier.discount}% by coordinating with neighbors</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Savings preview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><p className="text-2xl font-black text-gray-900">{fmt(retailTotal)}</p><p className="text-xs text-gray-400">Retail price (EGP)</p></div>
            <div><p className="text-2xl font-black text-green-600">-{activeTier.discount}%</p><p className="text-xs text-gray-400">Group discount</p></div>
            <div><p className="text-2xl font-black text-teal-600">{fmt(discountedPrice)}</p><p className="text-xs text-gray-400">Your group price</p></div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-3 mt-4 text-center">
            <p className="font-black text-yellow-800">🎉 Your savings: {fmt(savings)} EGP</p>
          </div>
        </div>

        {/* Step 1 — Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-black text-gray-900 mb-3">Materials for Group Buy</h3>
          {[
            { name: "60×60 Porcelain Floor Tiles", qty: Math.round(tileArea), unit: "m²" },
            { name: "Interior Wall Paint", qty: Math.round(project.totalAreaSqm * 0.4), unit: "liters" },
            { name: "Tile Adhesive", qty: Math.round(tileArea * 0.25), unit: "bags" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
              <input type="checkbox" defaultChecked className="accent-teal-500" />
              <span className="flex-1 text-sm text-gray-800">{item.name}</span>
              <span className="text-sm font-bold text-gray-600">{item.qty} {item.unit}</span>
            </div>
          ))}
        </div>

        {/* Group params */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-black text-gray-900">Group Parameters</h3>
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1 block">Total units in your building</label>
            <input type="number" value={form.totalUnits} onChange={e => setForm(p => ({ ...p, totalUnits: parseInt(e.target.value) || 5 }))}
              className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-center font-black focus:outline-none focus:border-teal-400" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 mb-2 block">Minimum units to proceed</label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 10, 20].map(n => (
                <button key={n} onClick={() => setForm(p => ({ ...p, minParticipants: n }))}
                  className={`py-2 rounded-xl border-2 text-sm font-bold transition-all ${form.minParticipants === n ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200"}`}>
                  {n} units
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1 block">Closing date</label>
            <div className="flex gap-2">
              {[7, 14, 30].map(d => (
                <button key={d} onClick={() => setForm(p => ({ ...p, closingDays: d }))}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${form.closingDays === d ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200"}`}>
                  {d} days
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1 block">Compound / Building name</label>
            <input value={form.compoundName} onChange={e => setForm(p => ({ ...p, compoundName: e.target.value }))} placeholder="e.g. Compound Madinaty, Building 12"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-400" />
          </div>
        </div>

        {/* Discount tiers */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-black text-gray-900 mb-3">Discount Tiers</h3>
          {PRICE_TIERS.map(t => (
            <div key={t.minUnits} className={`flex items-center gap-3 py-2 rounded-xl px-3 mb-1 ${form.minParticipants >= t.minUnits ? "bg-teal-50" : "bg-gray-50"}`}>
              <span className={`w-4 h-4 rounded-full flex-shrink-0 ${form.minParticipants >= t.minUnits ? "bg-teal-500" : "bg-gray-300"}`} />
              <span className="flex-1 text-sm text-gray-700">{t.label} join</span>
              <span className={`font-black text-sm ${form.minParticipants >= t.minUnits ? "text-teal-600" : "text-gray-400"}`}>-{t.discount}%</span>
            </div>
          ))}
        </div>

        {/* Invite */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-black text-gray-900 mb-3">Invite Neighbors</h3>
          <a href={`https://wa.me/?text=${waText}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 bg-green-500 text-white font-black px-5 py-3 rounded-xl hover:bg-green-600 transition-colors mb-3">
            <span className="text-2xl">📲</span> Share via WhatsApp
          </a>
          <button onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/kemetro/build/${projectId}/group-buy`)}
            className="w-full border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">
            📋 Copy Invite Link
          </button>
        </div>

        <button onClick={handleCreate} disabled={saving}
          className="w-full bg-teal-500 hover:bg-teal-400 text-white font-black py-4 rounded-2xl text-lg transition-colors disabled:opacity-60">
          {saving ? "Creating..." : "🚀 Launch Group Buy"}
        </button>
      </div>
    </div>
  );
}