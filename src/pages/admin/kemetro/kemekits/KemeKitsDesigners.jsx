import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function KemeKitsDesigners() {
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCommission, setEditingCommission] = useState(null);
  const [commissionValue, setCommissionValue] = useState("");

  useEffect(() => {
    // Get all kits, group by creator
    base44.entities.KemeKitTemplate.list("-created_date", 200).then(kits => {
      const map = {};
      kits.forEach(k => {
        if (!k.creatorId) return;
        if (!map[k.creatorId]) {
          map[k.creatorId] = {
            id: k.creatorId,
            name: k.creatorName,
            kits: [],
            commissionPercent: k.commissionPercent || 3,
          };
        }
        map[k.creatorId].kits.push(k);
      });
      setDesigners(Object.values(map));
      setLoading(false);
    });
  }, []);

  const saveCommission = async (designer) => {
    const pct = parseFloat(commissionValue);
    if (isNaN(pct) || pct < 0 || pct > 100) return;
    // Update all kits for this designer
    await Promise.all(designer.kits.map(k =>
      base44.entities.KemeKitTemplate.update(k.id, { commissionPercent: pct })
    ));
    setDesigners(prev => prev.map(d => d.id === designer.id ? { ...d, commissionPercent: pct } : d));
    setEditingCommission(null);
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-black text-gray-900">KemeKit Designers</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Designer", "Active Kits", "Pending", "Total Kits", "Calculations", "GMV", "Commissions Earned", "Commission %", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs text-gray-400 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  ))}
                </tr>
              ))
              : designers.map(d => {
                const activeKits = d.kits.filter(k => k.status === "active");
                const pendingKits = d.kits.filter(k => k.status === "pending_approval");
                const totalCalcs = d.kits.reduce((s, k) => s + (k.totalCalculationsRun || 0), 0);
                const totalGMV = d.kits.reduce((s, k) => s + (k.totalGMVEGP || 0), 0);
                const commissions = d.kits.reduce((s, k) => s + (k.totalCommissionsEarnedEGP || 0), 0);

                return (
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-gray-900">{d.name}</td>
                    <td className="px-4 py-3">
                      <span className="text-green-600 font-bold">{activeKits.length}</span>
                    </td>
                    <td className="px-4 py-3">
                      {pendingKits.length > 0
                        ? <span className="text-yellow-600 font-bold">{pendingKits.length}</span>
                        : <span className="text-gray-300">0</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{d.kits.length}</td>
                    <td className="px-4 py-3 text-gray-700">{totalCalcs.toLocaleString()}</td>
                    <td className="px-4 py-3 text-yellow-600 font-semibold">{totalGMV.toLocaleString()} EGP</td>
                    <td className="px-4 py-3 text-purple-600 font-semibold">{commissions.toLocaleString()} EGP</td>
                    <td className="px-4 py-3">
                      {editingCommission === d.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={commissionValue}
                            onChange={e => setCommissionValue(e.target.value)}
                            className="w-14 border border-gray-300 rounded px-2 py-1 text-xs outline-none"
                            min="0" max="100"
                          />
                          <span className="text-xs text-gray-500">%</span>
                          <button onClick={() => saveCommission(d)} className="text-xs bg-blue-600 text-white px-2 py-1 rounded font-bold">Save</button>
                          <button onClick={() => setEditingCommission(null)} className="text-xs text-gray-400">✕</button>
                        </div>
                      ) : (
                        <span className="font-bold text-gray-800">{d.commissionPercent}%</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        <button className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded font-semibold">Profile</button>
                        <button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded font-semibold">Kits</button>
                        <button
                          onClick={() => { setEditingCommission(d.id); setCommissionValue(String(d.commissionPercent)); }}
                          className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1 rounded font-semibold"
                        >
                          Commission %
                        </button>
                        <button className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 px-2 py-1 rounded font-semibold">Feature</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {!loading && designers.length === 0 && (
          <div className="text-center py-12 text-gray-400">No designers yet.</div>
        )}
      </div>
    </div>
  );
}