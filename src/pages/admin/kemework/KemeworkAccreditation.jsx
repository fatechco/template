import { useState } from "react";
import { X } from "lucide-react";

const TABS = ["Applications", "Interviews", "Accredited", "Rejected"];

const APPLICATIONS = [
  { id: 1, name: "Ahmed Hassan", category: "Interior Design", applied: "Mar 15, 2026", experience: 8, status: "Pending", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=70" },
  { id: 2, name: "Rania Hassan", category: "Painting", applied: "Mar 17, 2026", experience: 4, status: "Pending", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&q=70" },
  { id: 3, name: "Youssef Reda", category: "HVAC", applied: "Mar 19, 2026", experience: 7, status: "Pending", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&q=70" },
];

const INTERVIEWS = [
  { id: 4, name: "Omar Khalid", category: "Plumbing", date: "Apr 2, 2026", time: "10:00 AM", location: "HQ", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=70" },
];

const ACCREDITED = [
  { id: 5, name: "Layla Nour", category: "Landscaping", accreditedDate: "Feb 28, 2026", idCard: "KPP-2026-04812", status: "Active", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&q=70" },
  { id: 6, name: "Nadia Ali", category: "Interior Design", accreditedDate: "Jan 15, 2026", idCard: "KPP-2026-03201", status: "Active", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=70" },
];

function ScheduleModal({ pro, onClose }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("HQ");
  const [notes, setNotes] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <p className="font-black text-gray-900">Schedule Interview</p>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 mb-4 flex items-center gap-3">
          {pro.avatar && <img src={pro.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />}
          <div>
            <p className="font-bold text-gray-900 text-sm">{pro.name}</p>
            <p className="text-xs text-gray-400">{pro.category} · {pro.experience} yrs experience</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Interview Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Location</label>
            <div className="flex gap-2">
              {["HQ Address", "Video Call", "Phone"].map(l => (
                <label key={l} className={`flex-1 flex items-center justify-center py-2 rounded-xl border cursor-pointer text-xs font-bold transition-all ${location === l ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                  <input type="radio" name="location" value={l} checked={location === l} onChange={() => setLocation(l)} className="hidden" />
                  {l === "HQ Address" ? "🏢" : l === "Video Call" ? "💻" : "📞"} {l}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Notes</label>
            <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Interview notes or instructions..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 resize-none" />
          </div>
          <button disabled={!date || !time} onClick={onClose} className="w-full py-3 rounded-xl font-bold text-sm text-white disabled:opacity-40" style={{ background: "#0D9488" }}>
            Schedule & Notify Professional
          </button>
        </div>
      </div>
    </div>
  );
}

function IDCardModal({ pro, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <p className="font-black text-gray-900">Professional ID Card</p>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        {/* ID Card Preview */}
        <div className="rounded-2xl overflow-hidden shadow-lg mb-4" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}>
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-xs font-black text-amber-900">K</div>
              <span className="text-white font-black text-sm">Kemedar Kemework®</span>
            </div>
            <span className="text-[10px] font-black text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full">🏅 PREFERRED PRO</span>
          </div>
          <div className="p-5 flex gap-4">
            <img src={pro.avatar} alt="" className="w-16 h-16 rounded-xl object-cover border-2 border-amber-400" />
            <div>
              <p className="text-xl font-black text-white">{pro.name}</p>
              <p className="text-amber-300 text-xs font-semibold">{pro.category} Specialist</p>
              <p className="text-gray-400 text-xs mt-1">ID: {pro.idCard}</p>
              <p className="text-gray-400 text-xs">Accredited: {pro.accreditedDate}</p>
              <p className="text-gray-400 text-xs">Valid Until: Feb 2028</p>
            </div>
          </div>
          <div className="px-5 pb-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl">⬛</div>
            <div>
              <p className="text-[10px] text-gray-400">Scan to verify</p>
              <p className="text-[10px] text-gray-400">kemework.kemedar.com/pro/{pro.idCard}</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-xl font-bold text-sm" style={{ background: "#D4A017", color: "#1a1a2e" }}>
          Download as PDF
        </button>
      </div>
    </div>
  );
}

export default function KemeworkAccreditation() {
  const [activeTab, setActiveTab] = useState("Applications");
  const [scheduleFor, setScheduleFor] = useState(null);
  const [idCardFor, setIdCardFor] = useState(null);

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-black text-gray-900">Accreditation Program</h1>
        <p className="text-sm text-gray-500">Manage Kemedar Preferred Professional applications</p>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
            style={{ background: activeTab === t ? "#0D9488" : "#fff", color: activeTab === t ? "#fff" : "#374151", border: activeTab === t ? "none" : "1px solid #e5e7eb" }}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === "Applications" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Professional", "Category", "Applied", "Experience", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-black text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {APPLICATIONS.map(app => (
                <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={app.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <p className="text-xs font-bold text-gray-900">{app.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{app.category}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{app.applied}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-gray-700">{app.experience} yrs</td>
                  <td className="px-4 py-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{app.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button className="px-2 py-1 text-[10px] font-bold bg-teal-100 text-teal-700 rounded-lg">Review</button>
                      <button onClick={() => setScheduleFor(app)} className="px-2 py-1 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-lg">📅 Schedule</button>
                      <button className="px-2 py-1 text-[10px] font-bold bg-red-100 text-red-700 rounded-lg">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "Interviews" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Professional", "Category", "Date", "Time", "Location", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-black text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INTERVIEWS.map(int => (
                <tr key={int.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={int.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <p className="text-xs font-bold text-gray-900">{int.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{int.category}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-gray-700">{int.date}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{int.time}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{int.location}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button className="px-2 py-1 text-[10px] font-bold bg-green-100 text-green-700 rounded-lg">🏅 Accredit</button>
                      <button className="px-2 py-1 text-[10px] font-bold bg-amber-100 text-amber-700 rounded-lg">Reschedule</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "Accredited" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Professional", "Category", "Accredited Date", "ID Card #", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-black text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ACCREDITED.map(pro => (
                <tr key={pro.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={pro.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <p className="text-xs font-bold text-gray-900">{pro.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{pro.category}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{pro.accreditedDate}</td>
                  <td className="px-4 py-3 text-xs font-bold text-amber-700">{pro.idCard}</td>
                  <td className="px-4 py-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">{pro.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => setIdCardFor(pro)} className="px-2 py-1 text-[10px] font-bold bg-amber-100 text-amber-700 rounded-lg">🪪 ID Card</button>
                      <button className="px-2 py-1 text-[10px] font-bold bg-red-100 text-red-700 rounded-lg">Revoke</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "Rejected" && (
        <div className="text-center py-12">
          <p className="text-4xl mb-2">❌</p>
          <p className="text-gray-500">No rejected applications</p>
        </div>
      )}

      {scheduleFor && <ScheduleModal pro={scheduleFor} onClose={() => setScheduleFor(null)} />}
      {idCardFor && <IDCardModal pro={idCardFor} onClose={() => setIdCardFor(null)} />}
    </div>
  );
}