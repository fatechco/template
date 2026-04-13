import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import { X } from "lucide-react";

const STATS = [
  { label: "Total Sent", val: "24,812", color: "text-gray-900" },
  { label: "Opened", val: "8,442 (34%)", color: "text-green-600" },
  { label: "Clicked", val: "2,978 (12%)", color: "text-blue-600" },
  { label: "Instant Alerts", val: "4,128", color: "text-red-600" },
  { label: "Daily Digests", val: "12,340", color: "text-orange-600" },
];

const OPEN_RATE_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: `Mar ${i + 1}`,
  rate: 22 + Math.floor(Math.random() * 24),
  benchmark: 22,
}));

const CHANNEL_DATA = [
  { channel: "App", sent: 12400, opened: 5200, clicked: 1800 },
  { channel: "Email", sent: 8900, opened: 2400, clicked: 890 },
  { channel: "SMS", sent: 2100, opened: 1640, clicked: 210 },
  { channel: "WhatsApp", sent: 1412, opened: 1200, clicked: 78 },
];

const TYPE_CARDS = [
  { label: "Instant (90%+)", sent: 4128, open: 62, icon: "🚨", color: "text-red-600 bg-red-50 border-red-200" },
  { label: "Daily (80–89%)", sent: 12340, open: 34, icon: "📅", color: "text-blue-600 bg-blue-50 border-blue-200" },
  { label: "Weekly (70–79%)", sent: 6890, open: 28, icon: "📅", color: "text-teal-600 bg-teal-50 border-teal-200" },
  { label: "Price Drop", sent: 1454, open: 48, icon: "💰", color: "text-green-600 bg-green-50 border-green-200" },
];

const MOCK_NOTIFS = Array.from({ length: 15 }, (_, i) => ({
  user: ["Ahmed Hassan", "Sara Mohamed", "Anonymous", "Karim Ali", "Nour Hassan"][i % 5],
  propTitle: ["Modern Apartment New Cairo", "Villa Sheikh Zayed", "Studio Maadi"][i % 3],
  score: 72 + (i % 25),
  type: ["instant", "daily", "weekly", "price_drop", "monthly"][i % 5],
  channels: [["app", "email"], ["app"], ["email", "sms"], ["app", "email", "whatsapp"], ["app"]],
  sentAt: `2026-03-${String((i % 20) + 1).padStart(2, "0")} ${10 + i % 8}:${String((i * 7) % 60).padStart(2, "0")}`,
  opened: i % 3 !== 0,
  openedAt: i % 3 !== 0 ? `+${i + 1}h` : null,
  clicked: i % 5 === 0,
  actionAfter: [null, "viewed", "saved", null, "contacted"][i % 5],
}));

const TYPE_CONFIG = {
  instant: { label: "Instant", bg: "bg-red-100 text-red-700" },
  daily: { label: "Daily Digest", bg: "bg-blue-100 text-blue-700" },
  weekly: { label: "Weekly", bg: "bg-teal-100 text-teal-700" },
  price_drop: { label: "Price Drop", bg: "bg-green-100 text-green-700" },
  monthly: { label: "Monthly Report", bg: "bg-purple-100 text-purple-700" },
};

function SendModal({ onClose }) {
  const [targetType, setTargetType] = useState("all");
  const [notifType, setNotifType] = useState("match");
  const [channels, setChannels] = useState({ app: true, email: true, sms: false, whatsapp: false });
  const [schedule, setSchedule] = useState("now");
  const [customTitle, setCustomTitle] = useState("");
  const [customMsg, setCustomMsg] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900">📤 Send Manual Notification</h2>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs font-black text-gray-700 mb-2">TO:</p>
            <div className="space-y-2">
              {[["all", "All active profiles"], ["filter", "Profiles matching filter"], ["specific", "Specific user"]].map(([v, l]) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="target" value={v} checked={targetType === v} onChange={() => setTargetType(v)} className="accent-orange-500" />
                  <span className="text-sm text-gray-700">{l}</span>
                </label>
              ))}
            </div>
            <div className="mt-2 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2 text-xs text-orange-700">
              This will send to approximately <strong>3,247 users</strong>
            </div>
          </div>

          <div>
            <p className="text-xs font-black text-gray-700 mb-2">TYPE:</p>
            <div className="grid grid-cols-2 gap-2">
              {[["match", "Property Match"], ["market", "Market Update"], ["reengagement", "Re-engagement"], ["custom", "Custom Message"]].map(([v, l]) => (
                <button key={v} onClick={() => setNotifType(v)}
                  className={`border-2 rounded-xl py-2 text-xs font-bold transition-all ${notifType === v ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {notifType === "custom" && (
            <div className="space-y-2">
              <input value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="Notification title..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              <textarea value={customMsg} onChange={e => setCustomMsg(e.target.value.slice(0, 200))} placeholder="Message body (200 chars max)..." rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none" />
              <p className="text-xs text-gray-400 text-right">{customMsg.length}/200</p>
            </div>
          )}

          <div>
            <p className="text-xs font-black text-gray-700 mb-2">CHANNELS:</p>
            <div className="flex gap-2 flex-wrap">
              {[["app", "🔔 App"], ["email", "📧 Email"], ["sms", "📱 SMS"], ["whatsapp", "💬 WhatsApp"]].map(([key, label]) => (
                <button key={key} onClick={() => setChannels(p => ({ ...p, [key]: !p[key] }))}
                  className={`px-3 py-1.5 rounded-full border-2 text-xs font-bold ${channels[key] ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-500"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-black text-gray-700 mb-2">SCHEDULE:</p>
            <div className="flex gap-3">
              {[["now", "Send Now"], ["schedule", "Schedule"]].map(([v, l]) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="sched" value={v} checked={schedule === v} onChange={() => setSchedule(v)} className="accent-orange-500" />
                  <span className="text-sm text-gray-700">{l}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl">Cancel</button>
          <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-black py-2.5 rounded-xl">📤 Send Notification</button>
        </div>
      </div>
    </div>
  );
}

export default function AdvisorNotifications() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Advisor Notifications Log</h1>
          <p className="text-gray-500 text-sm">All automated match notifications sent to users</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-xl text-sm">
          📤 Send Manual Notification
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-xs font-bold text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-black text-gray-900">Open Rate Trend (30 days)</h2>
          </div>
          <p className="text-xs text-gray-500 mb-3">Your avg: <strong className="text-orange-600">34%</strong> vs benchmark <strong className="text-gray-600">22%</strong></p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={OPEN_RATE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={4} />
              <YAxis tick={{ fontSize: 10 }} unit="%" />
              <Tooltip formatter={v => `${v}%`} />
              <ReferenceLine y={22} stroke="#9CA3AF" strokeDasharray="4 4" label={{ value: "Benchmark 22%", fontSize: 9, fill: "#9CA3AF" }} />
              <Line type="monotone" dataKey="rate" stroke="#FF6B00" dot={false} strokeWidth={2} name="Open rate" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-black text-gray-900 mb-4">Channel Performance</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={CHANNEL_DATA}>
              <XAxis dataKey="channel" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="sent" fill="#E5E7EB" name="Sent" radius={[2, 2, 0, 0]} />
              <Bar dataKey="opened" fill="#FF6B00" name="Opened" radius={[2, 2, 0, 0]} />
              <Bar dataKey="clicked" fill="#10B981" name="Clicked" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Type cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {TYPE_CARDS.map(t => (
          <div key={t.label} className={`rounded-2xl border p-5 ${t.color}`}>
            <p className="text-2xl mb-2">{t.icon}</p>
            <p className="text-xl font-black">{t.sent.toLocaleString()}</p>
            <p className="text-xs font-bold mt-0.5">{t.label}</p>
            <p className="text-sm font-black mt-2">{t.open}% open rate</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-black text-gray-900 mb-4">Notification Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                {["User", "Property", "Score", "Type", "Channels", "Sent At", "Opened", "Clicked", "Action After", ""].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-bold text-gray-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_NOTIFS.map((n, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-[9px] font-black flex items-center justify-center flex-shrink-0">
                        {n.user[0]}
                      </div>
                      <span className="font-semibold text-gray-700">{n.user}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 max-w-[120px] truncate font-semibold text-gray-700">{n.propTitle}</td>
                  <td className="px-3 py-3 font-black text-orange-600">{n.score}%</td>
                  <td className="px-3 py-3">
                    <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${TYPE_CONFIG[n.type].bg}`}>{TYPE_CONFIG[n.type].label}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      {(n.channels[i % 5] || []).map(ch => (
                        <span key={ch} className="text-sm">{ch === "app" ? "🔔" : ch === "email" ? "📧" : ch === "sms" ? "📱" : "💬"}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-400 whitespace-nowrap">{n.sentAt}</td>
                  <td className="px-3 py-3">{n.opened ? <span className="text-green-600 font-bold">✅ {n.openedAt}</span> : <span className="text-gray-300">—</span>}</td>
                  <td className="px-3 py-3">{n.clicked ? <span className="text-blue-600 font-bold">✅</span> : <span className="text-gray-300">—</span>}</td>
                  <td className="px-3 py-3">
                    {n.actionAfter ? <span className="bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full capitalize">{n.actionAfter}</span> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-3 py-3">
                    <button className="text-orange-500 hover:text-orange-600 font-bold text-[10px]">🔔 Resend</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <SendModal onClose={() => setShowModal(false)} />}
    </div>
  );
}