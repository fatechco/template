import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Camera, Calendar, Play, Eye, BarChart2, Video } from "lucide-react";

const TABS = [
  { label: "📊 Overview", to: "/admin/kemedar/twin" },
  { label: "🎬 Virtual Tours", to: "/admin/kemedar/twin/tours" },
  { label: "📡 Live Sessions", to: "/admin/kemedar/twin/sessions" },
  { label: "📹 Recordings", to: "/admin/kemedar/twin/recordings" },
  { label: "⚙️ Settings", to: "/admin/kemedar/twin/settings" },
];

const MOCK_TOURS = [
  { id: "tour1", propertyId: "prop001", tourType: "photo_walkthrough", status: "published", totalViews: 342, tourScenes: [{}, {}, {}], created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "tour2", propertyId: "prop002", tourType: "virtual_360", status: "published", totalViews: 891, tourScenes: [{}, {}, {}, {}, {}], created_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "tour3", propertyId: "prop003", tourType: "floor_plan_3d", status: "draft", totalViews: 0, tourScenes: [{}, {}], created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "tour4", propertyId: "prop004", tourType: "hybrid", status: "published", totalViews: 523, tourScenes: [{}, {}, {}, {}], created_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
];

const MOCK_SESSIONS = [
  { id: "sess1", title: "Luxury Penthouse Tour", sessionType: "live_tour", status: "live", scheduledFor: new Date().toISOString(), totalViewers: 14, created_date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
  { id: "sess2", title: "New Capital Villa Showcase", sessionType: "property_verification", status: "scheduled", scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), totalViewers: 0, created_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "sess3", title: "Sheikh Zayed Compound Tour", sessionType: "live_tour", status: "ended", scheduledFor: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), totalViewers: 28, created_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "sess4", title: "Maadi Apartment Walkthrough", sessionType: "live_tour", status: "scheduled", scheduledFor: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), totalViewers: 0, created_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "sess5", title: "6th October Office Space", sessionType: "property_verification", status: "ended", scheduledFor: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), totalViewers: 8, created_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
];

export default function TwinOverview() {
  const { pathname } = useLocation();
  const [tours, setTours] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.VirtualTour.list("-created_date", 200),
      base44.entities.LiveTourSession.list("-created_date", 200),
    ]).then(([t, s]) => { setTours(t.length > 0 ? t : MOCK_TOURS); setSessions(s.length > 0 ? s : MOCK_SESSIONS); setLoading(false); })
     .catch(() => { setTours(MOCK_TOURS); setSessions(MOCK_SESSIONS); setLoading(false); });
  }, []);

  const activeTours = tours.filter(t => t.status === "published");
  const liveSessions = sessions.filter(s => s.status === "live");
  const scheduledSessions = sessions.filter(s => s.status === "scheduled");
  const endedSessions = sessions.filter(s => s.status === "ended");

  const activeTab = TABS.find(t => t.to === pathname)?.to || "/admin/kemedar/twin";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-900">🏠 Kemedar Twin™ Admin</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map(t => (
          <Link key={t.to} to={t.to}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === t.to
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            {t.label}
          </Link>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "/admin/kemedar/twin" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Virtual Tours", val: tours.length, icon: Camera, color: "text-orange-600", bg: "bg-orange-50" },
              { label: "Published Tours", val: activeTours.length, icon: Eye, color: "text-green-600", bg: "bg-green-50" },
              { label: "Live Right Now", val: liveSessions.length, icon: Video, color: "text-red-600", bg: "bg-red-50" },
              { label: "Scheduled Sessions", val: scheduledSessions.length, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
            ].map(k => (
              <div key={k.label} className={`${k.bg} rounded-2xl p-5 border border-white shadow-sm`}>
                <k.icon size={20} className={k.color} />
                <p className={`text-3xl font-black mt-2 ${k.color}`}>{loading ? "—" : k.val}</p>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">{k.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-black text-gray-900">Recent Virtual Tours</h3>
                <Link to="/admin/kemedar/twin/tours" className="text-xs text-orange-500 hover:underline">View all</Link>
              </div>
              {tours.slice(0, 5).map(t => (
                <div key={t.id} className="flex items-center justify-between px-5 py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{t.tourType || "Virtual Tour"}</p>
                    <p className="text-xs text-gray-400">{t.totalViews || 0} views · {t.tourScenes?.length || 0} scenes</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {t.status}
                  </span>
                </div>
              ))}
              {tours.length === 0 && !loading && <p className="px-5 py-6 text-center text-gray-400 text-sm">No virtual tours yet</p>}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-black text-gray-900">Recent Live Sessions</h3>
                <Link to="/admin/kemedar/twin/sessions" className="text-xs text-orange-500 hover:underline">View all</Link>
              </div>
              {sessions.slice(0, 5).map(s => (
                <div key={s.id} className="flex items-center justify-between px-5 py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{s.title || "Live Session"}</p>
                    <p className="text-xs text-gray-400">{s.sessionType} · {s.scheduledFor ? new Date(s.scheduledFor).toLocaleDateString() : "—"}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    s.status === "live" ? "bg-red-100 text-red-600" :
                    s.status === "scheduled" ? "bg-blue-100 text-blue-600" :
                    "bg-gray-100 text-gray-500"
                  }`}>{s.status}</span>
                </div>
              ))}
              {sessions.length === 0 && !loading && <p className="px-5 py-6 text-center text-gray-400 text-sm">No sessions yet</p>}
            </div>
          </div>
        </>
      )}

      {/* Virtual Tours */}
      {activeTab === "/admin/kemedar/twin/tours" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-black text-gray-900">All Virtual Tours ({tours.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Property ID", "Type", "Status", "Scenes", "Views", "Created"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tours.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No virtual tours yet</td></tr>
                ) : tours.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{t.propertyId?.slice(0, 8)}...</td>
                    <td className="px-4 py-3 text-gray-700">{t.tourType || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{t.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{t.tourScenes?.length || 0}</td>
                    <td className="px-4 py-3 text-gray-600">{t.totalViews || 0}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(t.created_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Live Sessions */}
      {activeTab === "/admin/kemedar/twin/sessions" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-black text-gray-900">All Live Sessions ({sessions.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Title", "Type", "Status", "Scheduled", "Viewers", "Created"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sessions.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No sessions yet</td></tr>
                ) : sessions.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-800">{s.title || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{s.sessionType || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        s.status === "live" ? "bg-red-100 text-red-600" :
                        s.status === "scheduled" ? "bg-blue-100 text-blue-600" :
                        "bg-gray-100 text-gray-500"
                      }`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{s.scheduledFor ? new Date(s.scheduledFor).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{s.totalViewers || 0}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(s.created_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recordings */}
      {activeTab === "/admin/kemedar/twin/recordings" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-black text-gray-900">Recordings — Ended Sessions ({endedSessions.length})</h3>
          </div>
          {endedSessions.length === 0 ? (
            <p className="px-5 py-8 text-center text-gray-400">No recordings available yet</p>
          ) : endedSessions.map(s => (
            <div key={s.id} className="flex items-center justify-between px-5 py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-bold text-gray-800">{s.title || "Recording"}</p>
                <p className="text-xs text-gray-400">{new Date(s.scheduledFor).toLocaleDateString()} · {s.sessionType}</p>
              </div>
              <button className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200">▶ Play</button>
            </div>
          ))}
        </div>
      )}

      {/* Settings */}
      {activeTab === "/admin/kemedar/twin/settings" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-black text-gray-900">⚙️ Twin™ Settings</h3>
          {[
            { label: "Enable Virtual Tours", enabled: true },
            { label: "Enable Live Sessions", enabled: true },
            { label: "Allow Recordings", enabled: false },
            { label: "Show Floor Plan by Default", enabled: true },
            { label: "Show Measurements", enabled: true },
            { label: "Enable Watermark on Tours", enabled: true },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-800">{s.label}</span>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${s.enabled ? "bg-orange-500" : "bg-gray-300"}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${s.enabled ? "right-0.5" : "left-0.5"}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}