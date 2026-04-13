import { useState } from "react";
import { Plus, X, Eye, UserCheck } from "lucide-react";

const TABS = ["All Tasks", "Recent Tasks", "Tasks I Posted", "In Progress", "Completed", "Kemedar Working On"];

const MOCK_TASKS = [
  { id: 1, title: "Kitchen Renovation", category: "Renovation", location: "New Cairo", budget: "$2,400", owner: "Ahmed Hassan", assigned: "Mahmoud Fixer", status: "In Progress", date: "Mar 10" },
  { id: 2, title: "Electrical Wiring Fix", category: "Electrical", location: "Maadi", budget: "$350", owner: "Sara Khaled", assigned: "Unassigned", status: "New", date: "Mar 12" },
  { id: 3, title: "Full Apartment Painting", category: "Painting", location: "Sheikh Zayed", budget: "$800", owner: "Omar Rashid", assigned: "Paint Pro Co.", status: "Completed", date: "Mar 5" },
  { id: 4, title: "Bathroom Plumbing Repair", category: "Plumbing", location: "Heliopolis", budget: "$180", owner: "Fatima Mohamed", assigned: "Unassigned", status: "New", date: "Mar 14" },
  { id: 5, title: "AC Installation x3 Units", category: "HVAC", location: "6th October", budget: "$650", owner: "Mohamed Nasser", assigned: "Cool Air Tech", status: "Completed", date: "Mar 8" },
];

const STATUS_COLORS = {
  "In Progress": "bg-yellow-100 text-yellow-700",
  New: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
};

const CATEGORIES = ["Electrical", "Plumbing", "Painting", "Renovation", "HVAC", "Carpentry", "Flooring", "Tiling", "Other"];

function PostTaskModal({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900">➕ Post New Finishing Task</h3>
            <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Task Title</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Category</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Budget</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" placeholder="$" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Location</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Deadline</label>
              <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Priority</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400">
                <option>Normal</option><option>High</option><option>Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Assign to Handyman</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" placeholder="Search handymen..." />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Description</label>
              <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none" />
            </div>
          </div>
          <button onClick={onClose} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-colors">
            Post Task
          </button>
        </div>
      </div>
    </>
  );
}

export default function KemeworkDashboard() {
  const [activeTab, setActiveTab] = useState("All Tasks");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-5">
      <div className="bg-teal-600 rounded-2xl px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">🔧 Kemework Dashboard</h1>
          <p className="text-teal-100 text-sm mt-1">Finishing Tasks in Your Area</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-white text-teal-700 font-black px-5 py-2.5 rounded-xl shadow hover:shadow-md transition-all text-sm">
          <Plus size={16} /> Post New Task
        </button>
      </div>

      {/* Sub-stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[{ label: "Tasks Posted", value: "156", color: "bg-teal-50 border-teal-200" }, { label: "In Progress", value: "28", color: "bg-yellow-50 border-yellow-200" }, { label: "Completed", value: "121", color: "bg-green-50 border-green-200" }, { label: "Handymen in Area", value: "43", color: "bg-blue-50 border-blue-200" }].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl border p-4 text-center`}>
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === t ? "bg-teal-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        {["Category", "Status", "Date", "Budget Range", "Assigned"].map(f => (
          <select key={f} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none text-gray-600 cursor-pointer">
            <option>{f}: All</option>
          </select>
        ))}
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {MOCK_TASKS.map(task => (
          <div key={task.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-gray-900">{task.title}</h3>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[task.status]}`}>{task.status}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full">{task.category}</span>
              <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">📍 {task.location}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div><span className="font-semibold">Budget:</span> {task.budget}</div>
              <div><span className="font-semibold">Date:</span> {task.date}</div>
              <div><span className="font-semibold">Owner:</span> {task.owner}</div>
              <div><span className="font-semibold">Assigned:</span> <span className={task.assigned === "Unassigned" ? "text-red-400" : "text-green-600"}>{task.assigned}</span></div>
            </div>
            <div className="flex gap-2 pt-1">
              <button className="flex-1 flex items-center justify-center gap-1 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold py-2 rounded-lg transition-colors"><Eye size={12} /> View</button>
              <button className="flex-1 flex items-center justify-center gap-1 bg-teal-600 text-white hover:bg-teal-700 text-xs font-bold py-2 rounded-lg transition-colors"><UserCheck size={12} /> Assign</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && <PostTaskModal onClose={() => setShowModal(false)} />}
    </div>
  );
}