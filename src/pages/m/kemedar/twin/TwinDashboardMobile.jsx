import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

export default function TwinDashboardMobile() {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("tours");

  useEffect(() => {
    base44.auth.me().then(u => {
      Promise.all([
        base44.entities.VirtualTour.list("-created_date", 30),
        base44.entities.LiveTourSession.list("-created_date", 30),
      ]).then(([t, s]) => {
        setTours(t || []);
        setSessions(s || []);
        setLoading(false);
      });
    }).catch(() => setLoading(false));
  }, []);

  const STATUS_COLOR = {
    published: "bg-green-100 text-green-700",
    draft: "bg-gray-100 text-gray-600",
    processing: "bg-amber-100 text-amber-700",
    scheduled: "bg-blue-100 text-blue-700",
    live: "bg-red-100 text-red-700",
    ended: "bg-gray-100 text-gray-600",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f9fafb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ background: "linear-gradient(135deg, #4C1D95, #1E3A5F)", flexShrink: 0, paddingTop: "max(12px, env(safe-area-inset-top))" }}
        className="px-4 pb-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
          <ArrowLeft size={18} color="white" />
        </button>
        <p className="font-black text-white text-sm">📊 My Twin™ Dashboard</p>
        <button onClick={() => navigate("/m/kemedar/twin/new")}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
          <Plus size={18} color="white" />
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex-shrink-0">
        <div className="grid grid-cols-3 gap-3">
          {[
            { val: tours.filter(t => t.status === "published").length, label: "Active Tours", icon: "🎬" },
            { val: sessions.filter(s => s.status === "scheduled").length, label: "Upcoming Live", icon: "📡" },
            { val: tours.reduce((a, t) => a + (t.totalViews || 0), 0), label: "Total Views", icon: "👁" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-lg">{s.icon}</p>
              <p className="text-base font-black text-gray-900">{s.val}</p>
              <p className="text-[9px] text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 flex-shrink-0">
        <div className="flex gap-2">
          {[["tours", `🎬 Tours (${tours.length})`], ["sessions", `📡 Live (${sessions.length})`]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className="flex-1 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: tab === k ? "#7C3AED" : "#f3f4f6", color: tab === k ? "#fff" : "#6b7280" }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }} className="px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-purple-500" /></div>
        ) : tab === "tours" ? (
          tours.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2">🎬</p>
              <p className="font-bold text-sm">No virtual tours yet</p>
              <p className="text-xs mt-1">Create your first AI-powered tour</p>
              <button onClick={() => navigate("/m/kemedar/twin/new")}
                className="mt-3 font-bold px-5 py-2 rounded-xl text-xs text-white" style={{ background: "#7C3AED" }}>
                ✨ Create Tour
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {tours.map(tour => {
                const sc = STATUS_COLOR[tour.status] || "bg-gray-100 text-gray-600";
                return (
                  <div key={tour.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex">
                      <div className="w-20 h-20 bg-gray-100 flex-shrink-0 flex items-center justify-center text-2xl">
                        {tour.thumbnailUrl ? <img src={tour.thumbnailUrl} alt="" className="w-full h-full object-cover" /> : "🏠"}
                      </div>
                      <div className="flex-1 p-3 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="font-black text-gray-900 text-xs truncate">{tour.tourType || "Virtual Tour"}</p>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${sc}`}>{tour.status}</span>
                        </div>
                        <p className="text-[10px] text-gray-400">{tour.tourScenes?.length || 0} scenes · {tour.totalViews || 0} views</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {tour.status === "published" && (
                            <Link to={`/kemedar/tour/${tour.id}`}
                              className="text-[10px] font-black px-2.5 py-1 rounded-lg text-white" style={{ background: "#7C3AED" }}>
                              👁 View
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          sessions.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2">📡</p>
              <p className="font-bold text-sm">No live sessions</p>
              <p className="text-xs mt-1">Schedule your first live property tour</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map(session => {
                const sc = STATUS_COLOR[session.status] || "bg-gray-100 text-gray-600";
                return (
                  <div key={session.id} className="bg-white rounded-2xl border border-gray-100 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-black text-gray-900 text-xs">{session.title || "Live Session"}</p>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${sc}`}>{session.status}</span>
                    </div>
                    <p className="text-[10px] text-gray-400">{session.sessionType} · {new Date(session.scheduledFor).toLocaleDateString("en-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    {session.status === "live" && (
                      <Link to={`/kemedar/live/${session.id}`}
                        className="inline-block mt-2 text-[10px] font-black px-3 py-1 rounded-lg bg-red-500 text-white">
                        🔴 Join Live
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}

        <div className="h-20" />
      </div>
      <MobileBottomNav />
    </div>
  );
}