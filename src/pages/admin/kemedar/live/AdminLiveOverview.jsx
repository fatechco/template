import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { EVENT_TYPE_META, fmtViewers } from "@/lib/liveEventUtils";

const TABS = [
  { label: "📊 Overview", to: "/admin/kemedar/live" },
  { label: "📋 All Events", to: "/admin/kemedar/live/events" },
  { label: "⏳ Approval Queue", to: "/admin/kemedar/live/approval" },
  { label: "🎙️ Hosts", to: "/admin/kemedar/live/hosts" },
  { label: "⚙️ Settings", to: "/admin/kemedar/live/settings" },
];

const STATUS_COLORS = {
  scheduled: 'bg-gray-100 text-gray-600',
  live: 'bg-red-100 text-red-700',
  ended: 'bg-gray-100 text-gray-500',
  replay_available: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-500',
};

export default function AdminLiveOverview() {
  const { pathname } = useLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    requireApproval: true, maxDurationHours: 4, minNoticeHours: 24,
    purchaseEnabled: true, maxReservationWindowHours: 72,
    recordAll: true, autoPublishReplays: true, retentionDays: 90,
    chatModeration: 'auto_ai',
  });

  useEffect(() => {
    base44.entities.LiveEvent.list('-created_date', 100)
      .then(data => { setEvents(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const activeTab = TABS.find(t => t.to === pathname)?.to || "/admin/kemedar/live";

  const liveNow = events.filter(e => e.streamStatus === 'live');
  const upcoming7 = events.filter(e => {
    const s = new Date(e.scheduledStartAt);
    const d = (s - new Date()) / 86400000;
    return e.streamStatus === 'scheduled' && d >= 0 && d <= 7;
  });
  const pendingApproval = events.filter(e => !e.isApproved && e.streamStatus === 'scheduled');
  const totalRegistered = events.reduce((s, e) => s + (e.totalRegistered || 0), 0);
  const totalReservations = events.reduce((s, e) => s + (e.reservationsDuringEvent || 0), 0);

  const approveEvent = async (eventId) => {
    const user = await base44.auth.me();
    await base44.entities.LiveEvent.update(eventId, { isApproved: true, approvedBy: user.id });
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, isApproved: true } : e));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">📺 Kemedar Live™ Admin</h1>
        <Link to="/kemedar/live" target="_blank" className="text-xs text-orange-600 font-bold hover:underline">View Public Page →</Link>
      </div>

      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {TABS.map(t => (
          <Link key={t.to} to={t.to}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === t.to ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
            {t.to === '/admin/kemedar/live/approval' && pendingApproval.length > 0 && (
              <span className="ml-1.5 bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{pendingApproval.length}</span>
            )}
          </Link>
        ))}
      </div>

      {/* Overview */}
      {activeTab === '/admin/kemedar/live' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: '🔴 Live Now', val: liveNow.length, color: 'text-red-600', bg: 'bg-red-50' },
              { label: '📅 Next 7 Days', val: upcoming7.length, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: '⏳ Pending Approval', val: pendingApproval.length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { label: '👥 Total Registrations', val: fmtViewers(totalRegistered), color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: '🏠 Units Reserved', val: totalReservations, color: 'text-green-600', bg: 'bg-green-50' },
            ].map(k => (
              <div key={k.label} className={`${k.bg} rounded-2xl p-4 border border-white shadow-sm`}>
                <p className={`text-2xl font-black ${k.color}`}>{loading ? '—' : k.val}</p>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">{k.label}</p>
              </div>
            ))}
          </div>

          {liveNow.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="font-black text-red-800 mb-3">🔴 Currently Live ({liveNow.length})</p>
              {liveNow.map(e => (
                <div key={e.id} className="flex items-center justify-between bg-white rounded-xl p-3 mb-2 last:mb-0">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{e.title}</p>
                    <p className="text-xs text-gray-500">{e.organizationName} · 👀 {fmtViewers(e.peakViewers)} · 🏠 {e.reservationsDuringEvent || 0} reservations</p>
                  </div>
                  <Link to={`/kemedar/live/watch/${e.id}`} className="text-xs bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-red-600">Monitor →</Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* All Events */}
      {activeTab === '/admin/kemedar/live/events' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  {['Event', 'Host', 'Type', 'Date', 'Registered', 'Reservations', 'Status', 'Approved', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map(e => (
                  <tr key={e.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 text-sm truncate max-w-xs">{e.title}</p>
                      <p className="text-[10px] text-gray-400">{e.eventNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{e.organizationName || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${EVENT_TYPE_META[e.eventType]?.color}`}>
                        {EVENT_TYPE_META[e.eventType]?.icon} {EVENT_TYPE_META[e.eventType]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{new Date(e.scheduledStartAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-center font-bold">{e.totalRegistered || 0}</td>
                    <td className="px-4 py-3 text-center font-bold text-green-700">{e.reservationsDuringEvent || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[e.streamStatus]}`}>
                        {e.streamStatus?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {e.isApproved ? <span className="text-xs text-green-600 font-bold">✅ Yes</span> : <span className="text-xs text-orange-600 font-bold">⏳ Pending</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Link to={`/kemedar/live/event/${e.id}`} className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-lg">👁 View</Link>
                        {!e.isApproved && <button onClick={() => approveEvent(e.id)} className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-1 rounded-lg">✅ Approve</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Approval Queue */}
      {activeTab === '/admin/kemedar/live/approval' && (
        <div className="space-y-4">
          {pendingApproval.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
              <p className="text-4xl mb-2">✅</p><p className="font-bold">All clear — no pending approvals</p>
            </div>
          ) : pendingApproval.map(e => (
            <div key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${EVENT_TYPE_META[e.eventType]?.color}`}>
                      {EVENT_TYPE_META[e.eventType]?.icon} {EVENT_TYPE_META[e.eventType]?.label}
                    </span>
                  </div>
                  <h3 className="font-black text-gray-900 mb-1">{e.title}</h3>
                  <p className="text-sm text-gray-500 mb-1">{e.organizationName} · {e.hostType?.replace(/_/g, ' ')}</p>
                  <p className="text-sm text-gray-500">📅 {new Date(e.scheduledStartAt).toLocaleDateString('en-EG', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  {e.description && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{e.description}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button onClick={() => approveEvent(e.id)} className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">✅ Approve</button>
                  <button className="bg-red-100 hover:bg-red-200 text-red-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">❌ Reject</button>
                  <Link to={`/kemedar/live/event/${e.id}`} className="text-xs text-gray-500 text-center hover:underline">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings */}
      {activeTab === '/admin/kemedar/live/settings' && (
        <div className="space-y-5 max-w-xl">
          {[
            { key: 'requireApproval', label: 'Require admin approval for all events', type: 'toggle' },
            { key: 'maxDurationHours', label: 'Max event duration (hours)', type: 'number', min: 1, max: 8 },
            { key: 'minNoticeHours', label: 'Minimum notice required (hours)', type: 'number', min: 1 },
            { key: 'purchaseEnabled', label: 'Allow unit reservations during events', type: 'toggle' },
            { key: 'maxReservationWindowHours', label: 'Max reservation window after event (hours)', type: 'number' },
            { key: 'recordAll', label: 'Record all events automatically', type: 'toggle' },
            { key: 'autoPublishReplays', label: 'Auto-publish replays', type: 'toggle' },
            { key: 'retentionDays', label: 'Recording retention (days)', type: 'number' },
          ].map(f => (
            <div key={f.key} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
              <span className="text-sm text-gray-800">{f.label}</span>
              {f.type === 'toggle' ? (
                <button onClick={() => setSettings(s => ({ ...s, [f.key]: !s[f.key] }))}
                  className={`w-11 h-6 rounded-full relative transition-colors ${settings[f.key] ? 'bg-orange-500' : 'bg-gray-200'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${settings[f.key] ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              ) : (
                <input type="number" value={settings[f.key]} min={f.min} max={f.max}
                  onChange={e => setSettings(s => ({ ...s, [f.key]: Number(e.target.value) }))}
                  className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:border-orange-400" />
              )}
            </div>
          ))}
          <button className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-3 rounded-xl transition-colors">💾 Save Settings</button>
        </div>
      )}
    </div>
  );
}