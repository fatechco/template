import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const fmt = n => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

const STATUS_STYLES = {
  not_generated: "bg-gray-100 text-gray-600",
  generating: "bg-yellow-100 text-yellow-700",
  ready: "bg-teal-100 text-teal-700",
  modified: "bg-blue-100 text-blue-700",
  ordered: "bg-green-100 text-green-700",
};

const STATUS_LABELS = {
  not_generated: "Draft",
  generating: "Generating...",
  ready: "BOQ Ready",
  modified: "Modified",
  ordered: "Ordered",
};

const ORDER_STYLES = {
  not_ordered: "⏳ Not ordered",
  cart_created: "🛒 In cart",
  partially_ordered: "📦 Partial order",
  fully_ordered: "✅ Fully ordered",
};

export default function KemetroBuildMyProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    base44.entities.BuildProject.list("-created_date", 50)
      .then(data => { setProjects(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = projects.filter(p => {
    if (tab === "active") return ["not_generated", "generating", "ready", "modified"].includes(p.boqStatus);
    if (tab === "ordered") return p.orderStatus === "fully_ordered" || p.boqStatus === "ordered";
    return true;
  });

  const handleDelete = async (id) => {
    await base44.entities.BuildProject.delete(id);
    setProjects(p => p.filter(x => x.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">🏗️ My Build Projects</h1>
            <p className="text-gray-500 text-sm mt-0.5">{projects.length} projects saved</p>
          </div>
          <button onClick={() => navigate("/kemetro/build/new")}
            className="bg-teal-500 hover:bg-teal-400 text-white font-black px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2">
            + New BOQ
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {[
            { id: "all", label: `📋 All (${projects.length})` },
            { id: "active", label: "🔄 Active" },
            { id: "ordered", label: "✅ Ordered" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${tab === t.id ? "bg-white shadow text-teal-600" : "text-gray-500"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-gray-100" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-6">Create your first BOQ in under 5 minutes</p>
            <button onClick={() => navigate("/kemetro/build/new")} className="bg-teal-500 text-white font-black px-6 py-3 rounded-xl hover:bg-teal-400 transition-colors">
              + Create New BOQ
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[p.boqStatus] || "bg-gray-100 text-gray-600"}`}>
                      {STATUS_LABELS[p.boqStatus] || p.boqStatus}
                    </span>
                    <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 hover:text-red-600">🗑</button>
                  </div>
                  <h3 className="font-black text-gray-900 mb-1">{p.projectName || "Untitled Project"}</h3>
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full capitalize">{p.projectType?.replace(/_/g, " ")}</span>
                    <span className="text-xs text-gray-400">{new Date(p.created_date).toLocaleDateString()}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3 text-center bg-gray-50 rounded-xl p-2">
                    <div><p className="font-black text-gray-900 text-sm">{p.totalAreaSqm}</p><p className="text-[10px] text-gray-400">m²</p></div>
                    <div><p className="font-black text-gray-900 text-sm">{p.numberOfRooms}</p><p className="text-[10px] text-gray-400">rooms</p></div>
                    <div><p className="font-black text-teal-600 text-sm">{p.grandTotal ? fmt(p.grandTotal) : "—"}</p><p className="text-[10px] text-gray-400">EGP</p></div>
                  </div>
                  {p.orderStatus && p.orderStatus !== "not_ordered" && (
                    <p className="text-xs text-gray-500 mb-3">{ORDER_STYLES[p.orderStatus] || p.orderStatus}</p>
                  )}
                  <div className="flex gap-2">
                    {p.boqStatus === "ready" || p.boqStatus === "modified" || p.boqStatus === "ordered" ? (
                      <Link to={`/kemetro/build/${p.id}/boq`} className="flex-1 text-center text-xs bg-teal-500 text-white font-bold py-2 rounded-xl hover:bg-teal-400 transition-colors">
                        📋 View BOQ
                      </Link>
                    ) : (
                      <Link to="/kemetro/build/new" className="flex-1 text-center text-xs border border-teal-300 text-teal-600 font-bold py-2 rounded-xl hover:bg-teal-50">
                        ✏️ Continue
                      </Link>
                    )}
                    <button className="px-3 py-2 text-xs border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50">📤</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}