import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const STATUS_OPTS = ["All", "active", "pending_approval", "draft", "archived", "rejected"];
const ROOM_OPTS = ["All", "bathroom", "kitchen", "living_room", "bedroom", "outdoor", "office", "kids_room"];
const STYLE_OPTS = ["All", "modern", "classic", "bohemian", "industrial", "scandinavian", "art_deco", "contemporary", "rustic"];
const BUDGET_OPTS = ["All", "economy", "standard", "premium", "luxury"];

const STATUS_BADGE = {
  active: "bg-green-100 text-green-700",
  pending_approval: "bg-yellow-100 text-yellow-700",
  draft: "bg-gray-100 text-gray-600",
  archived: "bg-orange-100 text-orange-600",
  rejected: "bg-red-100 text-red-600",
};

export default function KemeKitsAllKits() {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "All", room: "All", style: "All", budget: "All", designer: "" });

  useEffect(() => {
    base44.entities.KemeKitTemplate.list("-created_date", 100).then(data => {
      setKits(data);
      setLoading(false);
    });
  }, []);

  const filtered = kits.filter(k => {
    if (filters.status !== "All" && k.status !== filters.status) return false;
    if (filters.room !== "All" && k.roomType !== filters.room) return false;
    if (filters.style !== "All" && k.styleCategory !== filters.style) return false;
    if (filters.budget !== "All" && k.budgetTier !== filters.budget) return false;
    if (filters.designer && !k.creatorName?.toLowerCase().includes(filters.designer.toLowerCase())) return false;
    return true;
  });

  const handleAction = async (kit, action) => {
    const updates = {
      feature: { isFeatured: !kit.isFeatured },
      pick: { isEditorsPick: !kit.isEditorsPick },
      archive: { status: "archived" },
      reject: { status: "rejected" },
    };
    if (!updates[action]) return;
    await base44.entities.KemeKitTemplate.update(kit.id, updates[action]);
    setKits(prev => prev.map(k => k.id === kit.id ? { ...k, ...updates[action] } : k));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">All KemeKits</h1>
        <span className="bg-gray-100 text-gray-700 text-sm font-bold px-3 py-1 rounded-full">{filtered.length} kits</span>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-end">
        {[
          { label: "Status", key: "status", opts: STATUS_OPTS },
          { label: "Room", key: "room", opts: ROOM_OPTS },
          { label: "Style", key: "style", opts: STYLE_OPTS },
          { label: "Budget", key: "budget", opts: BUDGET_OPTS },
        ].map(f => (
          <div key={f.key}>
            <p className="text-xs text-gray-400 mb-1">{f.label}</p>
            <select
              value={filters[f.key]}
              onChange={e => setFilters(p => ({ ...p, [f.key]: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none"
            >
              {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div>
          <p className="text-xs text-gray-400 mb-1">Designer</p>
          <input
            value={filters.designer}
            onChange={e => setFilters(p => ({ ...p, designer: e.target.value }))}
            placeholder="Search designer..."
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none"
          />
        </div>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold px-4 py-1.5 rounded-lg ml-auto">
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["", "Title", "Designer", "Room", "Products", "Calcs", "GMV", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs text-gray-400 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.map(kit => (
              <tr key={kit.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {kit.heroImageUrl && <img src={kit.heroImageUrl} alt="" className="w-full h-full object-cover" />}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-bold text-gray-900 text-sm line-clamp-1 max-w-[180px]">{kit.title}</p>
                  <div className="flex gap-1 mt-0.5">
                    {kit.isFeatured && <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-bold">⭐ Featured</span>}
                    {kit.isEditorsPick && <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full font-bold">✏️ Editor's Pick</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{kit.creatorName || "—"}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{kit.roomType?.replace("_", " ") || "—"}</td>
                <td className="px-4 py-3 text-gray-700 font-semibold">—</td>
                <td className="px-4 py-3 text-gray-700">{(kit.totalCalculationsRun || 0).toLocaleString()}</td>
                <td className="px-4 py-3 text-yellow-600 font-semibold">{(kit.totalGMVEGP || 0).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[kit.status] || "bg-gray-100 text-gray-500"}`}>
                    {kit.status?.replace("_", " ") || "draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    <button className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded font-semibold">View</button>
                    <button onClick={() => handleAction(kit, "feature")} className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 px-2 py-1 rounded font-semibold">
                      {kit.isFeatured ? "Unfeature" : "Feature"}
                    </button>
                    <button onClick={() => handleAction(kit, "pick")} className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1 rounded font-semibold">
                      {kit.isEditorsPick ? "Unpick" : "Pick"}
                    </button>
                    <button onClick={() => handleAction(kit, "archive")} className="text-xs bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded font-semibold">Archive</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">No kits match the current filters.</div>
        )}
      </div>
    </div>
  );
}