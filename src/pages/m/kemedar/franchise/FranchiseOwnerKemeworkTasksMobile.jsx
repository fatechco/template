import { useState } from 'react';
import { ChevronLeft, Search, Settings, Plus, Eye, UserPlus, Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TASKS_DATA = [
  { id: 1, title: "Plumbing Repair - Kitchen Leak", category: "Plumbing", postedBy: "Ahmed Hassan", assignedTo: "Hassan Ibrahim", location: "Giza", budget: "$150-200", status: "in-progress", date: "2025-03-20", bids: 5, catColor: "bg-blue-100" },
  { id: 2, title: "Electrical Installation - 3 Outlets", category: "Electrical", postedBy: "Sara Mohamed", assignedTo: null, location: "Cairo", budget: "$200-300", status: "open", date: "2025-03-19", bids: 3, catColor: "bg-yellow-100" },
  { id: 3, title: "Wall Painting & Finishing", category: "Painting", postedBy: "Fatima Khalil", assignedTo: "Karim Ali", location: "New Cairo", budget: "$300-400", status: "in-progress", date: "2025-03-18", bids: 2, catColor: "bg-purple-100" },
];

export default function FranchiseOwnerKemeworkTasksMobile() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningTask, setAssigningTask] = useState(null);

  const filteredTasks = TASKS_DATA.filter(t => {
    const tabMatch = selectedTab === "All" ||
                    (selectedTab === "Recent" && t.date > "2025-03-15") ||
                    (selectedTab === "In Progress" && t.status === "in-progress") ||
                    (selectedTab === "Done" && t.status === "done");
    const searchMatch = searchQuery === "" || t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return tabMatch && searchMatch;
  });

  const startAssign = (task) => {
    setAssigningTask(task);
    setShowAssignModal(true);
  };

  return (
    <div className="min-h-full bg-gray-50 pb-28 max-w-[480px] mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-base font-black text-gray-900">Kemework — My Area</h1>
        <button className="p-1.5 hover:bg-gray-100 rounded-lg">
          <Plus size={22} className="text-gray-900" />
        </button>
      </div>

      {/* Stats Strip */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { label: "Tasks", value: TASKS_DATA.length },
          { label: "In Progress", value: TASKS_DATA.filter(t => t.status === "in-progress").length },
          { label: "Done", value: TASKS_DATA.filter(t => t.status === "done").length },
          { label: "Pros", value: 12 },
        ].map((stat, i) => (
          <div key={i} className="flex-shrink-0 bg-white rounded-full px-3 py-1.5 border border-gray-200 text-xs">
            <span className="font-black text-teal-600">{stat.value}</span>
            <span className="text-gray-500 ml-1">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-100 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {["All", "Recent", "Mine", "In Progress", "Done"].map(tab => (
          <button key={tab} onClick={() => setSelectedTab(tab)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
              selectedTab === tab
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="sticky top-28 z-20 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-teal-400"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Settings size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Task Cards */}
      <div className="px-4 py-4 space-y-3">
        {filteredTasks.map(task => (
          <div key={task.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex">
            {/* Category Icon */}
            <div className={`${task.catColor} w-16 flex-shrink-0 flex items-center justify-center font-black text-xl`}>
              {task.category === "Plumbing" && "🔧"}
              {task.category === "Electrical" && "⚡"}
              {task.category === "Painting" && "🎨"}
            </div>

            {/* Content */}
            <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
              <div>
                <p className="font-bold text-gray-900 text-sm line-clamp-2">{task.title}</p>
                <div className="flex gap-1 mt-1 text-xs text-gray-600">
                  <span>📍 {task.location}</span>
                  <span>💰 {task.budget}</span>
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Posted by {task.postedBy}
                {task.assignedTo && <p className="font-bold text-teal-600 mt-0.5">👤 {task.assignedTo}</p>}
                {!task.assignedTo && <p className="text-orange-600 font-bold mt-0.5">{task.bids} bids received</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="p-2 flex flex-col gap-2 flex-shrink-0">
              <span className={`text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap ${
                task.status === "in-progress" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
              }`}>
                {task.status === "in-progress" ? "In Progress" : "Open"}
              </span>
              <div className="flex gap-1">
                <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Eye size={14} /></button>
                {task.status === "open" && <button onClick={() => startAssign(task)} className="p-1.5 hover:bg-gray-100 rounded text-teal-600"><UserPlus size={14} /></button>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Modal */}
      {showAssignModal && assigningTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h2 className="text-lg font-black text-gray-900 mb-4">Assign Task</h2>
            <p className="text-xs text-gray-600 mb-4">{assigningTask.title}</p>

            <div className="space-y-2 mb-6">
              {["Hassan Ibrahim - ⭐ 4.9", "Karim Ali - ⭐ 4.8", "Mohamed Ahmed - ⭐ 4.7"].map((pro, i) => (
                <label key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="professional" className="w-4 h-4" />
                  <span className="text-sm font-bold text-gray-900">{pro}</span>
                </label>
              ))}
            </div>

            <button onClick={() => { setShowAssignModal(false); setAssigningTask(null); }} className="w-full bg-teal-600 text-white font-bold py-2.5 rounded-lg">✅ Assign Task</button>
          </div>
        </div>
      )}

      {/* FAB Menu */}
      <div className="fixed bottom-6 right-4 space-y-3">
        <button className="w-14 h-14 rounded-full bg-teal-600 text-white flex items-center justify-center font-black text-xl shadow-lg hover:bg-teal-700">
          📋
        </button>
        <button className="w-14 h-14 rounded-full bg-orange-600 text-white flex items-center justify-center font-black text-xl shadow-lg hover:bg-orange-700">
          🤝
        </button>
        <button className="w-14 h-14 rounded-full bg-yellow-600 text-white flex items-center justify-center font-black text-xl shadow-lg hover:bg-yellow-700">
          🏅
        </button>
      </div>
    </div>
  );
}