import { useState, useEffect } from "react";
import { Plus, Save, RefreshCw, Pencil } from "lucide-react";
import { base44 } from "@/api/base44Client";

const TIERS = ["Economy", "Standard", "Premium", "Luxury"];

function RateRow({ rate, cities, onSave }) {
  const [editing, setEditing] = useState(false);
  const [mat, setMat] = useState(rate.baseMaterialCostPerSqm || 0);
  const [lab, setLab] = useState(rate.baseLaborCostPerSqm || 0);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await base44.entities.FinishingCostIndex.update(rate.id, {
      baseMaterialCostPerSqm: Number(mat),
      baseLaborCostPerSqm: Number(lab),
      lastUpdated: new Date().toISOString(),
    });
    setSaving(false);
    setEditing(false);
    onSave();
  };

  const city = cities.find(c => c.id === rate.cityId);

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm font-semibold text-gray-800">{city?.name || "Country Default"}</td>
      <td className="px-4 py-3">
        <span className="text-xs font-bold px-2 py-1 rounded-full bg-purple-100 text-purple-700">{rate.qualityTier}</span>
      </td>
      <td className="px-4 py-3">
        {editing ? (
          <input type="number" value={mat} onChange={e => setMat(e.target.value)}
            className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-xs" />
        ) : (
          <span className="text-sm text-gray-700">{Number(rate.baseMaterialCostPerSqm || 0).toLocaleString()} EGP</span>
        )}
      </td>
      <td className="px-4 py-3">
        {editing ? (
          <input type="number" value={lab} onChange={e => setLab(e.target.value)}
            className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-xs" />
        ) : (
          <span className="text-sm text-gray-700">{Number(rate.baseLaborCostPerSqm || 0).toLocaleString()} EGP</span>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-gray-400">{rate.lastUpdated ? new Date(rate.lastUpdated).toLocaleDateString() : "—"}</td>
      <td className="px-4 py-3">
        {editing ? (
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="bg-green-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 disabled:opacity-50">
              <Save size={11} /> {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setEditing(false)} className="border border-gray-200 text-gray-600 font-bold px-3 py-1.5 rounded-lg text-xs">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800">
            <Pencil size={11} /> Edit
          </button>
        )}
      </td>
    </tr>
  );
}

export default function FinishingRatesIndex() {
  const [rates, setRates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newRate, setNewRate] = useState({ cityId: "", qualityTier: "Standard", baseMaterialCostPerSqm: "", baseLaborCostPerSqm: "" });

  const fetchAll = async () => {
    setLoading(true);
    const [r, c, co] = await Promise.all([
      base44.entities.FinishingCostIndex.list("-created_date", 200),
      base44.entities.City.list(),
      base44.entities.Country.list(),
    ]);
    setRates(r);
    setCities(c);
    setCountries(co);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAdd = async () => {
    await base44.entities.FinishingCostIndex.create({
      ...newRate,
      baseMaterialCostPerSqm: Number(newRate.baseMaterialCostPerSqm),
      baseLaborCostPerSqm: Number(newRate.baseLaborCostPerSqm),
      countryId: countries[0]?.id || "",
      lastUpdated: new Date().toISOString(),
    });
    setAdding(false);
    setNewRate({ cityId: "", qualityTier: "Standard", baseMaterialCostPerSqm: "", baseLaborCostPerSqm: "" });
    fetchAll();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900">📐 Finishing Rates Index</h1>
          <p className="text-sm text-gray-500">Control the baseline cost data the AI Finishing Simulator uses per city and quality tier.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAll} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-lg text-sm">
            <Plus size={14} /> Add Rate
          </button>
        </div>
      </div>

      {adding && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">City</label>
            <select value={newRate.cityId} onChange={e => setNewRate(p => ({ ...p, cityId: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
              <option value="">Country Default</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Tier</label>
            <select value={newRate.qualityTier} onChange={e => setNewRate(p => ({ ...p, qualityTier: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
              {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Material EGP/sqm</label>
            <input type="number" value={newRate.baseMaterialCostPerSqm} onChange={e => setNewRate(p => ({ ...p, baseMaterialCostPerSqm: e.target.value }))}
              className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="2200" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Labor EGP/sqm</label>
            <input type="number" value={newRate.baseLaborCostPerSqm} onChange={e => setNewRate(p => ({ ...p, baseLaborCostPerSqm: e.target.value }))}
              className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="1400" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="bg-purple-600 text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-purple-700">Add</button>
            <button onClick={() => setAdding(false)} className="border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-lg text-xs">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        ) : rates.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <p className="text-3xl mb-2">📐</p>
            <p className="text-sm">No rates configured yet. Add your first rate above.</p>
            <p className="text-xs mt-1 text-gray-300">The AI will use built-in fallback values until rates are set.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["City", "Quality Tier", "Material EGP/sqm", "Labor EGP/sqm", "Last Updated", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rates.map(rate => (
                  <RateRow key={rate.id} rate={rate} cities={cities} onSave={fetchAll} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}