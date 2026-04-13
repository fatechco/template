import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const TABS = [
  { label: "📊 Overview", to: "/admin/kemetro/build" },
  { label: "📋 Projects", to: "/admin/kemetro/build/projects" },
  { label: "👥 Group Buys", to: "/admin/kemetro/build/group-buys" },
  { label: "⚙️ Settings", to: "/admin/kemetro/build/settings" },
];

export default function AdminBuildOverview() {
  const { pathname } = useLocation();
  const [projects, setProjects] = useState([]);
  const [groupBuys, setGroupBuys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.BuildProject.list("-created_date", 50).catch(() => []),
      base44.entities.GroupBuySession.list("-created_date", 50).catch(() => []),
    ]).then(([p, g]) => {
      setProjects(p);
      setGroupBuys(g);
      setLoading(false);
    });
  }, []);

  const activeProjects = projects.filter(p => p.status === "active" || p.status === "in_progress").length;
  const activeGroupBuys = groupBuys.filter(g => g.status === "open" || g.status === "active").length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-900">🏗️ Kemetro Build™ Admin</h1>

      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {TABS.map(t => (
          <Link key={t.to} to={t.to}
            className={`px-3 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${pathname === t.to ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Projects", val: loading ? "—" : projects.length, icon: "📋", color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Active Group Buys", val: loading ? "—" : activeGroupBuys, icon: "👥", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active Projects", val: loading ? "—" : activeProjects, icon: "🏗️", color: "text-green-600", bg: "bg-green-50" },
        ].map(k => (
          <div key={k.label} className={`${k.bg} rounded-2xl p-5 border border-white shadow-sm`}>
            <p className="text-3xl mb-1">{k.icon}</p>
            <p className={`text-2xl font-black ${k.color}`}>{k.val}</p>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="font-black text-gray-900 mb-2">About Kemetro Build™</p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Kemetro Build™ enables group buying of construction materials and products, 
          helping buyers pool demand to unlock volume discounts from suppliers. 
          Manage projects, track group buy sessions, and monitor demand signals here.
        </p>
      </div>

      {projects.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="font-black text-gray-900">Recent Projects</p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
              <tr>
                {["Project", "Status", "Budget", "Created"].map(h => (
                  <th key={h} className="text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 10).map(p => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{p.projectName || p.title || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full capitalize">{p.status || "draft"}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.totalBudget ? `${Number(p.totalBudget).toLocaleString()} EGP` : "—"}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{p.created_date ? new Date(p.created_date).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}