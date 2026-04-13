import { useState } from "react";
import { Send, Bell, Mail, MessageCircle, Smartphone, Search } from "lucide-react";

const MOCK_SENT = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: ["Welcome to Kemedar!", "New Properties in Your Area", "Subscription Renewal Reminder", "Verify Your Account", "Featured Listing Available", "New Message Received", "Property Price Update", "Account Approved", "System Maintenance Notice", "New Agent Joined", "Your Listing Expired", "Special Offer Inside"][i],
  target: ["All Users", "Agents", "Egypt", "Pending Users", "Premium Users", "Specific User", "All Users", "New Users", "All Users", "Admin", "Property Owners", "Premium Users"][i],
  type: [["Push", "Email"], ["Email"], ["Email", "SMS"], ["Push"], ["Email", "Push"], ["In-App"], ["Push"], ["Email", "In-App"], ["SMS", "Push"], ["In-App"], ["Email"], ["Email", "Push"]][i],
  sent: [12000, 340, 890, 54, 210, 1, 5820, 430, 12000, 5, 780, 210][i],
  opened: [4300, 180, 520, 38, 160, 1, 2100, 280, 8400, 5, 390, 150][i],
  date: `2026-03-${String((i % 17) + 1).padStart(2, "0")}`,
}));

const TYPE_COLORS = {
  "Push": "bg-purple-100 text-purple-700",
  "Email": "bg-blue-100 text-blue-700",
  "SMS": "bg-green-100 text-green-700",
  "In-App": "bg-orange-100 text-orange-700",
};

function SentTab() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Title</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Target</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Channels</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Sent</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Opened</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Open Rate</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_SENT.map((n, i) => (
              <tr key={n.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                <td className="px-4 py-3 font-semibold text-gray-800">{n.title}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{n.target}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {n.type.map((t) => (
                      <span key={t} className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${TYPE_COLORS[t]}`}>{t}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 font-bold text-gray-800">{n.sent.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">{n.opened.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: `${Math.round((n.opened / n.sent) * 100)}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-600">{Math.round((n.opened / n.sent) * 100)}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{n.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ComposeTab() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all");
  const [role, setRole] = useState("");
  const [country, setCountry] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [channels, setChannels] = useState({ inapp: true, email: false, sms: false, push: false });
  const [schedule, setSchedule] = useState("now");
  const [scheduleTime, setScheduleTime] = useState("");
  const [sent, setSent] = useState(false);

  const toggle = (ch) => setChannels((c) => ({ ...c, [ch]: !c[ch] }));

  const handleSend = () => {
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-5">
      {sent && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 font-semibold text-sm">
          ✅ Notification sent successfully!
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Write your message..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-orange-400" />
        </div>

        {/* Target */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-2">Target Audience</label>
          <div className="space-y-2">
            {[
              { value: "all", label: "All Users" },
              { value: "role", label: "By Role" },
              { value: "country", label: "By Country" },
              { value: "user", label: "Specific User" },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value={value} checked={target === value} onChange={(e) => setTarget(e.target.value)} className="accent-orange-500" />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
          {target === "role" && (
            <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-2 border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none cursor-pointer">
              <option value="">Select role...</option>
              <option>agent</option><option>agency</option><option>developer</option>
              <option>franchise_owner</option><option>user</option><option>admin</option>
            </select>
          )}
          {target === "country" && (
            <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country name..."
              className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
          )}
          {target === "user" && (
            <div className="mt-2 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="Search user by name or email..."
                className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
            </div>
          )}
        </div>

        {/* Channels */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-2">Channels</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "inapp", label: "In-App Notification", Icon: Bell },
              { key: "email", label: "Email", Icon: Mail },
              { key: "sms", label: "SMS", Icon: MessageCircle },
              { key: "push", label: "Push Notification", Icon: Smartphone },
            ].map(({ key, label, Icon }) => (
              <label key={key} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-colors ${channels[key] ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                <input type="checkbox" checked={channels[key]} onChange={() => toggle(key)} className="accent-orange-500" />
                <Icon size={14} className={channels[key] ? "text-orange-500" : "text-gray-400"} />
                <span className="text-xs font-semibold text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-2">Schedule</label>
          <div className="flex gap-4 mb-2">
            {[{ value: "now", label: "Send Now" }, { value: "later", label: "Schedule for Later" }].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value={value} checked={schedule === value} onChange={(e) => setSchedule(e.target.value)} className="accent-orange-500" />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
          {schedule === "later" && (
            <input type="datetime-local" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
          )}
        </div>

        <button onClick={handleSend} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors w-full justify-center">
          <Send size={15} /> {schedule === "now" ? "Send Notification" : "Schedule Notification"}
        </button>
      </div>
    </div>
  );
}

export default function AdminNotifications() {
  const [tab, setTab] = useState("sent");

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-black text-gray-900">Notifications</h1>
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[{ id: "sent", label: "📋 All Sent" }, { id: "compose", label: "✉️ New Notification" }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${tab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "sent" ? <SentTab /> : <ComposeTab />}
    </div>
  );
}