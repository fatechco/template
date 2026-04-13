import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Loader2 } from "lucide-react";

const DIMENSIONS = ["walkability", "noise", "green", "safety", "connectivity", "education", "convenience", "healthcare"];
const DATA_TYPES = ["amenity", "transport", "safety_report", "noise_reading", "school_info", "healthcare_info", "connectivity", "green_space", "fo_report", "admin_entry"];

export default function LifeScoreDataManagement() {
  const [dataPoints, setDataPoints] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    cityId: "",
    dimension: "walkability",
    dataType: "admin_entry",
    source: "Admin",
    accuracy: "confirmed",
    value: "{}"
  });

  useEffect(() => {
    const load = async () => {
      const [dp, sc] = await Promise.all([
        base44.entities.LifeScoreDataPoint.filter({ isActive: true }, "-created_date", 100),
        base44.entities.NeighborhoodLifeScore.list("-overallLifeScore", 50)
      ]);
      setDataPoints(dp);
      setScores(sc);
      setLoading(false);
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let parsedValue;
      try {
        parsedValue = JSON.parse(form.value);
      } catch (_) {
        parsedValue = { value: form.value };
      }
      await base44.entities.LifeScoreDataPoint.create({
        ...form,
        value: parsedValue,
        isActive: true
      });
      setShowForm(false);
      const dp = await base44.entities.LifeScoreDataPoint.filter({ isActive: true }, "-created_date", 100);
      setDataPoints(dp);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">📋 Data Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Plus size={14} /> Add Data Point
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-orange-200 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Add Data Point</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Area Score</label>
              <select
                value={form.cityId}
                onChange={e => setForm({ ...form, cityId: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
              >
                <option value="">Select area...</option>
                {scores.map(s => (
                  <option key={s.id} value={s.cityId}>{s.displayName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Dimension</label>
              <select
                value={form.dimension}
                onChange={e => setForm({ ...form, dimension: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
              >
                {DIMENSIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Data Type</label>
              <select
                value={form.dataType}
                onChange={e => setForm({ ...form, dataType: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
              >
                {DATA_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Accuracy</label>
              <select
                value={form.accuracy}
                onChange={e => setForm({ ...form, accuracy: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
              >
                <option value="confirmed">Confirmed</option>
                <option value="estimated">Estimated</option>
                <option value="user_reported">User Reported</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Value (JSON)</label>
              <textarea
                value={form.value}
                onChange={e => setForm({ ...form, value: e.target.value })}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-orange-400"
                placeholder='{"parkCount": 2, "nearestPark": 300}'
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                Save Data Point
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-200 text-gray-600 font-bold px-6 py-2 rounded-lg text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Data Points Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 font-bold text-gray-700">Dimension</th>
              <th className="text-left py-3 px-4 font-bold text-gray-700">Type</th>
              <th className="text-left py-3 px-4 font-bold text-gray-700">Source</th>
              <th className="text-left py-3 px-4 font-bold text-gray-700">Accuracy</th>
              <th className="text-left py-3 px-4 font-bold text-gray-700">Added</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8"><Loader2 className="animate-spin mx-auto text-gray-400" size={24} /></td></tr>
            ) : dataPoints.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">No data points yet</td></tr>
            ) : dataPoints.map(dp => (
              <tr key={dp.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4 font-semibold capitalize">{dp.dimension}</td>
                <td className="py-3 px-4 text-gray-500">{dp.dataType}</td>
                <td className="py-3 px-4 text-gray-500">{dp.source}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    dp.accuracy === "confirmed" ? "bg-green-100 text-green-700" :
                    dp.accuracy === "estimated" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {dp.accuracy}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-400 text-xs">
                  {new Date(dp.created_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}