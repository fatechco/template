import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Calendar, List, Check, Edit2, X, StickyNote, ChevronDown, ChevronUp } from "lucide-react";

const APPOINTMENTS = [
  { id: 1, date: "2024-03-20", time: "10:00", client: "Ahmed Hassan", property: "Apartment Cairo", type: "visit", status: "pending", meetingNote: "" },
  { id: 2, date: "2024-03-20", time: "14:00", client: "Sara Mohamed", property: "Villa New Cairo", type: "video", status: "pending", meetingNote: "" },
  { id: 3, date: "2024-03-21", time: "09:00", client: "Karim Ali", property: "Office Space", type: "call", status: "pending", meetingNote: "" },
  { id: 4, date: "2024-03-22", time: "16:00", client: "Fatima Khalil", property: "Studio Downtown", type: "visit", status: "done", meetingNote: "Client was very interested. Wants to revisit with husband. Follow up Friday." },
];

const TYPE_ICONS = {
  visit: "🏠",
  video: "📹",
  call: "📞",
};

function AppointmentCard({ apt, onMarkDone, onCancel }) {
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState(apt.meetingNote || "");
  const [saved, setSaved] = useState(!!apt.meetingNote);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-black text-orange-600 text-sm">{apt.time}</p>
            <p className="text-xs text-gray-500">{new Date(apt.date).toLocaleDateString()}</p>
          </div>
          {apt.status === "done" && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">✅ Done</span>}
        </div>

        <div className="flex gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg flex items-center justify-center text-lg flex-shrink-0">👤</div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-900">{apt.client}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{apt.property}</p>
          </div>
          <div className="text-lg flex-shrink-0">{TYPE_ICONS[apt.type]}</div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-gray-50">
          {apt.status !== "done" && (
            <>
              <button onClick={() => onMarkDone(apt.id)} className="flex-1 flex items-center justify-center gap-1 bg-green-100 text-green-700 py-2 rounded-lg font-bold text-sm hover:bg-green-200">
                <Check size={15} /> Done
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 bg-blue-100 text-blue-700 py-2 rounded-lg font-bold text-sm hover:bg-blue-200">
                <Edit2 size={15} /> Edit
              </button>
              <button onClick={() => onCancel(apt.id)} className="flex-1 flex items-center justify-center gap-1 bg-red-100 text-red-700 py-2 rounded-lg font-bold text-sm hover:bg-red-200">
                <X size={15} /> Cancel
              </button>
            </>
          )}
          <button
            onClick={() => setShowNote(!showNote)}
            className={`flex items-center justify-center gap-1 py-2 px-3 rounded-lg font-bold text-sm transition-colors ${saved ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"} ${apt.status === "done" ? "flex-1" : ""}`}
          >
            <StickyNote size={15} />
            {saved && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />}
            {showNote ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {showNote && (
        <div className="border-t border-yellow-100 bg-yellow-50/50 p-4 space-y-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Meeting Note</p>
          <textarea
            value={note}
            onChange={e => { setNote(e.target.value); setSaved(false); }}
            placeholder="Write your meeting notes here..."
            rows={3}
            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-yellow-400 bg-white"
          />
          <button
            onClick={() => { setSaved(true); setShowNote(false); }}
            className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
          >
            <Check size={12} /> Save Note
          </button>
        </div>
      )}
    </div>
  );
}

export default function AgentAppointmentsPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("list"); // list or calendar
  const [appointments, setAppointments] = useState(APPOINTMENTS);
  const [showAddSheet, setShowAddSheet] = useState(false);

  const handleMarkDone = (id) => {
    setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: "done" } : apt));
  };

  const handleCancel = (id) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between" style={{ height: 56 }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <ChevronLeft size={22} className="text-gray-900" />
          </button>
          <h1 className="text-lg font-black text-gray-900">Appointments</h1>
        </div>
        <button onClick={() => setShowAddSheet(true)} className="text-orange-600 hover:bg-orange-50 p-2 rounded-lg">
          <Plus size={20} />
        </button>
      </div>

      {/* View Toggle */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-200 px-4 py-3 flex gap-2">
        <button
          onClick={() => setViewMode("list")}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-sm ${
            viewMode === "list" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"
          }`}
        >
          <List size={16} /> List
        </button>
        <button
          onClick={() => setViewMode("calendar")}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-sm ${
            viewMode === "calendar" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"
          }`}
        >
          <Calendar size={16} /> Calendar
        </button>
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <div className="px-4 py-4 pb-24 space-y-2">
          {appointments.length > 0 ? (
            appointments.map(apt => <AppointmentCard key={apt.id} apt={apt} onMarkDone={handleMarkDone} onCancel={handleCancel} />)
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">No appointments scheduled</p>
            </div>
          )}
        </div>
      )}

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <div className="px-4 py-4 pb-24">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 text-center">Calendar view coming soon</p>
          </div>
        </div>
      )}

      {/* Add Appointment Sheet */}
      {showAddSheet && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black text-gray-900">Add Appointment</h2>
              <button onClick={() => setShowAddSheet(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 pb-6">
              {/* Client */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Client</label>
                <input type="text" placeholder="Search client..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
              </div>

              {/* Date/Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">Date</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">Time</label>
                  <input type="time" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
                </div>
              </div>

              {/* Property */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Property</label>
                <input type="text" placeholder="Search property..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
              </div>

              {/* Type */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(TYPE_ICONS).map(([type, icon]) => (
                    <button
                      key={type}
                      className="py-2.5 rounded-lg border-2 border-gray-200 text-sm font-bold hover:border-orange-600 hover:bg-orange-50"
                    >
                      {icon} {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Notes</label>
                <textarea placeholder="Add notes..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none h-20" />
              </div>

              <button
                onClick={() => setShowAddSheet(false)}
                className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg mt-4"
              >
                Save Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}