import { useState } from "react";
import { Phone, MessageCircle, Mail, Video, Send } from "lucide-react";

const ONLINE_REPS = [
  { initials: "KA", name: "Karim Ahmed", role: "Franchise Support Specialist", online: true },
  { initials: "NM", name: "Nour Mohamed", role: "Technical Support", online: true },
  { initials: "RS", name: "Rania Samir", role: "Finance Support", online: false },
  { initials: "TO", name: "Tarek Omar", role: "Area Development Manager", online: true },
];

const AREA_REPS = [
  { initials: "MA", name: "Mohamed Adel", coverage: "Cairo - Country FO", badge: "Country FO" },
  { initials: "AH", name: "Ahmed Hassan", coverage: "Alexandria Area", badge: "Area FO" },
  { initials: "SK", name: "Sara Khaled", coverage: "North Coast Area", badge: "Area FO" },
];

const ACTION_BUTTONS = [
  { icon: MessageCircle, label: "Message Chat", color: "bg-blue-500", action: () => {} },
  { icon: Phone, label: "Voice Chat", color: "bg-green-500", action: () => {} },
  { icon: Video, label: "Video Chat", color: "bg-purple-500", action: () => {} },
  { icon: Phone, label: "Call Kemedar", color: "bg-orange-500", action: () => {} },
  { icon: Send, label: "Send Inquiry", color: "bg-teal-500", action: () => {} },
  { icon: MessageCircle, label: "Feedback & Suggestions", color: "bg-[#1a1a2e]", action: () => {} },
];

const RECEIVED_CALLS = [
  { date: "Mar 18, 10:20 AM", from: "Ahmed Hassan", duration: "8 min", notes: "Property verification inquiry", outcome: "Resolved", action: "Sent email" },
  { date: "Mar 17, 03:45 PM", from: "Kemedar HQ", duration: "15 min", notes: "Monthly review call", outcome: "Follow-up needed", action: "Scheduled meeting" },
  { date: "Mar 16, 11:00 AM", from: "Sara Khaled", duration: "4 min", notes: "Subscription renewal question", outcome: "Resolved", action: "Sent payment link" },
];

export default function FranchiseContactKemedar() {
  const [inquiryForm, setInquiryForm] = useState({ subject: "", message: "", priority: "Normal" });
  const [broadcastForm, setBroadcastForm] = useState({ subject: "", message: "", priority: "Normal" });

  return (
    <div className="space-y-6">
      <div className="bg-orange-500 rounded-2xl px-6 py-5">
        <h1 className="text-2xl font-black text-white">📞 Contact Kemedar</h1>
        <p className="text-orange-100 text-sm mt-1">Reach your Kemedar team, representatives, and support channels</p>
      </div>

      {/* Section 1 — Phone & PBX */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-black text-gray-900 mb-3">📞 Your Kemedar Extension</h2>
        <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
          <div className="w-14 h-14 rounded-full bg-orange-500 text-white font-black text-lg flex items-center justify-center flex-shrink-0">🎙</div>
          <div>
            <p className="font-bold text-gray-900">Your Extension Number: <span className="text-orange-500 text-xl font-black">2047</span></p>
            <p className="text-sm text-gray-500 mt-1">Use this extension to call Kemedar headquarters via the company PBX system.</p>
            <a href="#" className="text-xs text-blue-600 hover:underline mt-1 inline-block">📱 How to install the Kemedar chat app on mobile →</a>
          </div>
        </div>
      </div>

      {/* Section 2 — Who's Online Now */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-black text-gray-900 mb-4">🟢 Who's Online Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ONLINE_REPS.map((r, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 text-center">
              <div className="relative w-12 h-12 rounded-full bg-[#1a1a2e] text-white font-bold text-sm flex items-center justify-center mx-auto mb-2">
                {r.initials}
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${r.online ? "bg-green-500" : "bg-gray-300"}`} />
              </div>
              <p className="font-bold text-gray-900 text-xs">{r.name}</p>
              <p className="text-[10px] text-gray-500 mb-2">{r.role}</p>
              <p className={`text-[10px] font-bold ${r.online ? "text-green-500" : "text-gray-400"}`}>{r.online ? "🟢 Online" : "⚫ Offline"}</p>
              {r.online && (
                <button className="mt-2 text-xs bg-blue-500 text-white font-bold px-3 py-1 rounded-lg w-full hover:bg-blue-600 transition-colors">Chat</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 3 — Other Reps */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-black text-gray-900 mb-4">👥 Other Kemedar Representatives</h2>
        <div className="space-y-3">
          {AREA_REPS.map((r, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-[#1a1a2e] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{r.initials}</div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                <p className="text-xs text-gray-500">{r.coverage}</p>
              </div>
              <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">{r.badge}</span>
              <div className="flex gap-1">
                <button className="w-7 h-7 rounded-lg hover:bg-green-50 text-green-600 flex items-center justify-center"><Phone size={13} /></button>
                <button className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center"><MessageCircle size={13} /></button>
                <button className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center justify-center"><Mail size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4 — Contact Options */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-black text-gray-900 mb-4">🔘 Contact Options</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ACTION_BUTTONS.map(({ icon: Icon, label, color }) => (
            <button key={label} className={`${color} text-white font-bold py-4 rounded-xl flex flex-col items-center gap-2 hover:opacity-90 transition-opacity text-sm`}>
              <Icon size={22} />{label}
            </button>
          ))}
        </div>
      </div>

      {/* Section 5 — Country FO Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center max-w-sm">
        <div className="w-20 h-20 rounded-full bg-[#1a1a2e] text-white font-black text-xl flex items-center justify-center mx-auto mb-4">MA</div>
        <p className="text-xl font-black text-gray-900">Mohamed Adel</p>
        <p className="text-sm text-orange-500 font-bold mb-1">Your Country Franchise Owner</p>
        <p className="text-xs text-gray-400 mb-5">Coverage: Egypt 🇪🇬</p>
        <div className="flex gap-2 justify-center">
          <button className="flex items-center gap-1.5 bg-green-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm"><Phone size={14} /> Call</button>
          <button className="flex items-center gap-1.5 bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm"><MessageCircle size={14} /> Chat</button>
          <button className="flex items-center gap-1.5 bg-gray-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm"><Mail size={14} /> Email</button>
        </div>
      </div>

      {/* Section 6 — Broadcast to All Reps */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="font-black text-gray-900">📣 Broadcast to All Representatives</h2>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Subject</label>
          <input value={broadcastForm.subject} onChange={e => setBroadcastForm(f => ({ ...f, subject: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Message</label>
          <textarea rows={3} value={broadcastForm.message} onChange={e => setBroadcastForm(f => ({ ...f, message: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Priority</label>
          <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400">
            <option>Normal</option><option>High</option><option>Urgent</option>
          </select>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">📣 Send to All Representatives</button>
      </div>

      {/* Section 7 — Received Calls Reports */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-900">📊 Received Calls Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Date", "From", "Duration", "Notes", "Outcome", "Action Taken"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-gray-700 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECEIVED_CALLS.map((c, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{c.date}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{c.from}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{c.duration}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{c.notes}</td>
                  <td className="px-4 py-3 text-gray-700 text-xs">{c.outcome}</td>
                  <td className="px-4 py-3 text-xs text-blue-600">{c.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}