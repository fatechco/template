import { useState } from "react";
import { Plus, X, ChevronLeft, ChevronRight, Video, Phone, MapPin, Check, XCircle, ChevronDown, ChevronUp, FileText, StickyNote } from "lucide-react";

const TYPE_ICONS = { "In Person": MapPin, "Video Call": Video, "Phone": Phone };
const TYPE_COLORS = { "In Person": "bg-blue-100 text-blue-700", "Video Call": "bg-purple-100 text-purple-700", "Phone": "bg-green-100 text-green-700" };
const STATUS_COLORS = { Scheduled: "bg-orange-100 text-orange-700", Completed: "bg-green-100 text-green-700", Cancelled: "bg-red-100 text-red-700" };

const MOCK_APPTS = [
  { id: 1, date: "2026-03-19", time: "10:00 AM", client: "Ahmed Hassan", property: "Modern Apartment New Cairo", type: "In Person", status: "Scheduled", notes: "Client wants to see the master bedroom view", meetingNote: "" },
  { id: 2, date: "2026-03-19", time: "02:30 PM", client: "Fatima Mohamed", property: "Villa Sheikh Zayed", type: "Video Call", status: "Scheduled", notes: "", meetingNote: "" },
  { id: 3, date: "2026-03-20", time: "11:00 AM", client: "Omar Rashid", property: "Studio in Maadi", type: "Phone", status: "Scheduled", notes: "Price negotiation call", meetingNote: "" },
  { id: 4, date: "2026-03-15", time: "09:00 AM", client: "Sara Khaled", property: "Office Downtown Cairo", type: "In Person", status: "Completed", notes: "", meetingNote: "Client loved the space. She's comparing with one other property. Will follow up by Thursday with contract draft." },
  { id: 5, date: "2026-03-14", time: "03:00 PM", client: "Mohamed Nasser", property: "Land 6th October", type: "Video Call", status: "Cancelled", notes: "Client cancelled", meetingNote: "Client had a family emergency. Agreed to reschedule next week." },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function Calendar({ appts, year, month, onMonthChange }) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  while (cells.length % 7 !== 0) cells.push(null);

  const apptsByDay = {};
  appts.forEach(a => {
    const d = new Date(a.date).getDate();
    if (!apptsByDay[d]) apptsByDay[d] = [];
    apptsByDay[d].push(a);
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <button onClick={() => onMonthChange(-1)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><ChevronLeft size={16} /></button>
        <h3 className="font-black text-gray-900">{MONTHS[month]} {year}</h3>
        <button onClick={() => onMonthChange(1)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><ChevronRight size={16} /></button>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
            const dayAppts = apptsByDay[day] || [];
            return (
              <div key={i} className={`min-h-[52px] rounded-lg p-1 text-center ${day ? "hover:bg-gray-50 cursor-pointer" : ""} ${isToday ? "bg-orange-50 border border-orange-200" : ""}`}>
                {day && (
                  <>
                    <p className={`text-xs font-bold mb-0.5 ${isToday ? "text-orange-500" : "text-gray-700"}`}>{day}</p>
                    {dayAppts.slice(0, 2).map((a, j) => (
                      <div key={j} className={`text-[9px] font-bold px-1 py-0.5 rounded mb-0.5 truncate ${TYPE_COLORS[a.type]}`}>{a.time}</div>
                    ))}
                    {dayAppts.length > 2 && <div className="text-[9px] text-gray-400">+{dayAppts.length - 2}</div>}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NewApptModal({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900">New Appointment</h3>
            <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
          </div>
          {[
            { label: "Client", type: "text", placeholder: "Search or type client name" },
            { label: "Property", type: "text", placeholder: "Search or type property" },
            { label: "Date", type: "date" },
            { label: "Time", type: "time" },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Type</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400">
              <option>In Person</option>
              <option>Video Call</option>
              <option>Phone</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Notes</label>
            <textarea rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-orange-400" />
          </div>
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors" onClick={onClose}>
            Save Appointment
          </button>
        </div>
      </div>
    </>
  );
}

function AppointmentCard({ a, TypeIcon }) {
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState(a.meetingNote || "");
  const [saved, setSaved] = useState(!!a.meetingNote);

  const handleSave = () => {
    setSaved(true);
    setShowNote(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4">
        {/* Top row: date/time + status */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 text-center flex-shrink-0">
              <p className="text-xs font-black text-orange-500">{new Date(a.date).toLocaleDateString("en-US", { month: "short" })}</p>
              <p className="text-xl font-black text-gray-900 leading-none">{new Date(a.date).getDate()}</p>
            </div>
            <div>
              <p className="font-black text-gray-900 text-sm">{a.client}</p>
              <p className="text-xs text-orange-500 font-bold mt-0.5">{a.time}</p>
            </div>
          </div>
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[a.status]}`}>{a.status}</span>
        </div>

        {/* Property */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 mb-3">
          <MapPin size={12} className="text-gray-400 flex-shrink-0" />
          <p className="text-xs text-gray-600 font-medium line-clamp-1">{a.property}</p>
        </div>

        {/* Type + notes row */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${TYPE_COLORS[a.type]}`}>
            <TypeIcon size={10} /> {a.type}
          </span>
          {a.notes && <p className="text-xs text-gray-400 italic line-clamp-1 flex-1">"{a.notes}"</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-50">
          {a.status === "Scheduled" && (
            <>
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-xl transition-colors">
                <Check size={12} /> Complete
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold py-2 rounded-xl transition-colors">
                <XCircle size={12} /> Cancel
              </button>
            </>
          )}
          <button
            onClick={() => setShowNote(!showNote)}
            className={`flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 rounded-xl transition-colors ${saved ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-600" : "bg-gray-50 hover:bg-gray-100 text-gray-500"} ${a.status === "Scheduled" ? "" : "flex-1"}`}
          >
            <StickyNote size={12} /> Note {saved && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 ml-0.5" />} {showNote ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
        </div>
      </div>

      {/* Note Panel */}
      {showNote && (
        <div className="border-t border-gray-100 bg-yellow-50/40 p-4 space-y-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Meeting Note</p>
          <textarea
            value={note}
            onChange={e => { setNote(e.target.value); setSaved(false); }}
            placeholder="Write your meeting notes here..."
            rows={3}
            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-yellow-400 bg-white"
          />
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
          >
            <Check size={12} /> Save Note
          </button>
        </div>
      )}
    </div>
  );
}

export default function Appointments() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [showModal, setShowModal] = useState(false);

  const changeMonth = (dir) => {
    let m = month + dir, y = year;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setMonth(m); setYear(y);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Appointments</h1>
          <p className="text-gray-500 text-sm">{MOCK_APPTS.filter(a => a.status === "Scheduled").length} upcoming appointments</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition-colors">
          <Plus size={16} /> New Appointment
        </button>
      </div>

      <Calendar appts={MOCK_APPTS} year={year} month={month} onMonthChange={changeMonth} />

      {/* Appointments Cards */}
      <div>
        <h3 className="font-black text-gray-900 mb-3">All Appointments</h3>
        <div className="space-y-3">
          {MOCK_APPTS.map((a) => {
            const TypeIcon = TYPE_ICONS[a.type];
            return <AppointmentCard key={a.id} a={a} TypeIcon={TypeIcon} />;
          })}
        </div>
      </div>

      {showModal && <NewApptModal onClose={() => setShowModal(false)} />}
    </div>
  );
}