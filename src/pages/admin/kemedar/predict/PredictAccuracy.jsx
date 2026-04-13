import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Save, ChevronRight, RefreshCw } from "lucide-react";

export default function PredictAccuracy() {
  const [tracks, setTracks] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ predictionId: "", trackingDate: new Date().toISOString().slice(0,10), actualPricePerSqm: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [t, p] = await Promise.all([
        base44.entities.PredictionHistoricalTrack.list('-created_date', 100),
        base44.entities.PricePrediction.filter({ isPublished: true }),
      ]);
      setTracks(t);
      setPredictions(p);
      setLoading(false);
    };
    load();
  }, []);

  const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  const accuracy6m = avg(tracks.filter(t => t.accuracyPercent).map(t => t.accuracyPercent));
  const within10 = tracks.filter(t => t.accuracyPercent >= 90).length;
  const within5  = tracks.filter(t => t.accuracyPercent >= 95).length;

  const handleSave = async () => {
    if (!form.predictionId || !form.actualPricePerSqm) return;
    setSaving(true);
    const pred = predictions.find(p => p.id === form.predictionId);
    const predicted = pred?.prediction12Months?.pricePerSqm || pred?.baselinePricePerSqm || 0;
    const actual = parseFloat(form.actualPricePerSqm);
    const accuracy = predicted > 0 ? Math.max(0, 100 - Math.abs((actual - predicted) / predicted * 100)) : 0;

    await base44.entities.PredictionHistoricalTrack.create({
      ...form,
      actualPricePerSqm: actual,
      predictedPricePerSqm: predicted,
      accuracyPercent: Math.round(accuracy * 10) / 10,
    });

    const t = await base44.entities.PredictionHistoricalTrack.list('-created_date', 100);
    setTracks(t);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
    setForm({ predictionId: "", trackingDate: new Date().toISOString().slice(0,10), actualPricePerSqm: "", notes: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <span>Admin</span><ChevronRight size={11} /><span>Kemedar Predict™</span><ChevronRight size={11} />
        <span className="text-gray-700 font-semibold">Accuracy Tracking</span>
      </div>

      <div>
        <h1 className="text-2xl font-black text-gray-900">Prediction Accuracy Tracking</h1>
        <p className="text-gray-500 text-sm">How well are our predictions performing?</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "6-Month Accuracy", val: tracks.length ? `${accuracy6m.toFixed(1)}%` : "—", color: "text-green-600" },
          { label: "12-Month Accuracy", val: "—", color: "text-blue-600" },
          { label: "Within 5% Rate", val: tracks.length ? `${Math.round(within5/tracks.length*100)}%` : "—", color: "text-teal-600" },
          { label: "Within 10% Rate", val: tracks.length ? `${Math.round(within10/tracks.length*100)}%` : "—", color: "text-orange-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className={`text-3xl font-black ${k.color}`}>{k.val}</p>
            <p className="text-sm font-semibold text-gray-600 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-black text-gray-900">Accuracy by Prediction</h2>
          </div>
          {loading ? (
            <div className="py-12 text-center"><RefreshCw size={20} className="animate-spin text-gray-300 mx-auto" /></div>
          ) : tracks.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <p className="text-2xl mb-2">📊</p>
              <p className="font-semibold">No tracking data yet</p>
              <p className="text-sm">Log actual price data to track accuracy</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Date","Prediction","Actual/m²","Predicted/m²","Accuracy","Notes"].map(h => (
                      <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tracks.map(t => {
                    const pred = predictions.find(p => p.id === t.predictionId);
                    const acc = t.accuracyPercent || 0;
                    return (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3 text-gray-500">{t.trackingDate}</td>
                        <td className="px-3 py-3 font-semibold text-gray-900">{pred?.locationLabel || '—'}</td>
                        <td className="px-3 py-3 font-bold">{t.actualPricePerSqm?.toLocaleString()}</td>
                        <td className="px-3 py-3 text-gray-600">{t.predictedPricePerSqm?.toLocaleString()}</td>
                        <td className="px-3 py-3">
                          <span className={`font-black text-sm ${acc >= 90 ? 'text-green-600' : acc >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {acc.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-3 py-3 text-gray-400 max-w-[120px] truncate">{t.notes || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Manual Entry */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit">
          <h3 className="font-black text-gray-900 mb-4">📝 Log Actual Price Data</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Prediction *</label>
              <select value={form.predictionId} onChange={e => setForm(f => ({...f, predictionId: e.target.value}))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-400">
                <option value="">Select prediction…</option>
                {predictions.map(p => (
                  <option key={p.id} value={p.id}>{p.locationLabel} ({p.propertyType})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Tracking Date *</label>
              <input type="date" value={form.trackingDate} onChange={e => setForm(f => ({...f, trackingDate: e.target.value}))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Actual Price/m² *</label>
              <input type="number" value={form.actualPricePerSqm} onChange={e => setForm(f => ({...f, actualPricePerSqm: e.target.value}))}
                placeholder="e.g. 48500"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Notes</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} rows={2}
                placeholder="Any relevant notes..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-400 resize-none" />
            </div>
            <button onClick={handleSave} disabled={saving || !form.predictionId || !form.actualPricePerSqm}
              className={`w-full font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 ${saved ? 'bg-green-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-40'}`}>
              <Save size={14} /> {saved ? 'Saved!' : saving ? 'Saving…' : 'Log Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}