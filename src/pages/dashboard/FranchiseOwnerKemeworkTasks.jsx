import { useState } from 'react';
import { Search, Filter, RotateCcw, Download, Eye, Edit, Check, Trash2, UserPlus, Clipboard, MapPin, DollarSign, Clock, AlertCircle } from 'lucide-react';

const TASKS_DATA = [
  { id: 1, title: "Plumbing Repair - Kitchen Leak", category: "Plumbing", postedBy: "Ahmed Hassan", assignedTo: "Hassan Ibrahim", location: "Giza", budget: "$150-200", status: "in-progress", date: "2025-03-20", views: 12, bids: 5, images: ["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&q=70"] },
  { id: 2, title: "Electrical Installation - 3 Outlets", category: "Electrical", postedBy: "Sara Mohamed", assignedTo: null, location: "Cairo", budget: "$200-300", status: "open", date: "2025-03-19", views: 23, bids: 3, images: [] },
  { id: 3, title: "Wall Painting & Finishing", category: "Painting", postedBy: "Fatima Khalil", assignedTo: "Karim Ali", location: "New Cairo", budget: "$300-400", status: "in-progress", date: "2025-03-18", views: 8, bids: 2, images: [] },
  { id: 4, title: "Carpentry Work - Custom Shelves", category: "Carpentry", postedBy: "Leila Ahmed", assignedTo: "Hassan Ibrahim", location: "Heliopolis", budget: "$500-700", status: "done", date: "2025-03-10", views: 34, bids: 7, images: [] },
  { id: 5, title: "HVAC System Maintenance", category: "HVAC", postedBy: "Ahmed Hassan", assignedTo: null, location: "Giza", budget: "$800-1000", status: "open", date: "2025-03-17", views: 15, bids: 4, images: [] },
];

const TASK_TABS = ["All Tasks", "Recent", "I Posted", "In Progress", "Done", "Kemedar Working On"];

const CATEGORY_COLORS = {
  Plumbing: "bg-blue-100 text-blue-700",
  Electrical: "bg-yellow-100 text-yellow-700",
  Painting: "bg-purple-100 text-purple-700",
  Carpentry: "bg-orange-100 text-orange-700",
  HVAC: "bg-cyan-100 text-cyan-700",
};

const STATUS_COLORS = {
  open: "bg-green-100 text-green-700",
  "in-progress": "bg-blue-100 text-blue-700",
  done: "bg-gray-100 text-gray-700",
};

export default function FranchiseOwnerKemeworkTasks() {
  const [activeTab, setActiveTab] = useState("All Tasks");
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTabDetail, setSelectedTabDetail] = useState("Details");
  const [showAssignModal, setShowAssignModal] = useState(false);

  const categories = ["All", "Plumbing", "Electrical", "Painting", "Carpentry", "HVAC"];

  const filteredTasks = TASKS_DATA.filter(t => {
    const tabMatch = activeTab === "All Tasks" ||
                    (activeTab === "Recent" && t.date > "2025-03-15") ||
                    (activeTab === "I Posted" && t.postedBy === "Ahmed Hassan") ||
                    (activeTab === "In Progress" && t.status === "in-progress") ||
                    (activeTab === "Done" && t.status === "done") ||
                    (activeTab === "Kemedar Working On" && t.assignedTo === "Hassan Ibrahim");
    const searchMatch = searchQuery === "" || t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = selectedCategory === "All" || t.category === selectedCategory;
    return tabMatch && searchMatch && categoryMatch;
  });

  const statCards = [
    { label: "All Tasks", value: TASKS_DATA.length, color: "text-teal-600" },
    { label: "Recent", value: TASKS_DATA.filter(t => t.date > "2025-03-15").length, color: "text-blue-600" },
    { label: "In Progress", value: TASKS_DATA.filter(t => t.status === "in-progress").length, color: "text-orange-600" },
    { label: "Done", value: TASKS_DATA.filter(t => t.status === "done").length, color: "text-green-600" },
    { label: "Professionals", value: 12, color: "text-purple-600" },
  ];

  const handleSelectTask = (id) => {
    setSelectedTasks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-4 border-teal-600 pl-4">
        <p className="text-xs text-gray-500 mb-1">Dashboard {">"} My Area {">"} Kemework</p>
        <h1 className="text-3xl font-black text-gray-900">Kemework — My Area</h1>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Task Status Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {TASK_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-xs transition-all border-b-2 ${
              activeTab === tab
                ? "bg-teal-50 text-teal-600 border-teal-600"
                : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search tasks by title..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
            />
          </div>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 cursor-pointer font-bold"
          >
            {categories.map(cat => <option key={cat}>{cat}</option>)}
          </select>
          <button className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold"><Filter size={14} className="inline mr-1" /> Filter</button>
          <button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }} className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold"><RotateCcw size={14} className="inline mr-1" /> Reset</button>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left"><input type="checkbox" className="rounded w-4 h-4" /></th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Title & Category</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Posted By</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Assigned To</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Location</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Budget</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTasks.map(task => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3"><input type="checkbox" onChange={() => handleSelectTask(task.id)} className="rounded w-4 h-4" /></td>
                  <td className="px-4 py-3 cursor-pointer" onClick={() => setSelectedTask(task)}>
                    <div>
                      <p className="font-bold text-gray-900">{task.title}</p>
                      <span className={`inline-block text-xs font-bold px-2 py-1 rounded mt-1 ${CATEGORY_COLORS[task.category]}`}>{task.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{task.postedBy}</td>
                  <td className="px-4 py-3 text-gray-600">{task.assignedTo || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{task.location}</td>
                  <td className="px-4 py-3 font-bold text-teal-600">{task.budget}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-bold px-2 py-1 rounded ${STATUS_COLORS[task.status]}`}>
                      {task.status === "in-progress" ? "In Progress" : task.status === "open" ? "Open" : "Done"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{task.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedTask(task)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Eye size={16} /></button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Edit size={16} /></button>
                      {task.status === "open" && <button onClick={() => setShowAssignModal(true)} className="p-1.5 hover:bg-gray-100 rounded text-teal-600"><UserPlus size={16} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Detail Panel */}
      {selectedTask && (
        <div className="fixed right-0 top-0 bottom-0 w-[480px] bg-white shadow-2xl border-l border-gray-200 z-40 overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-5 flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900">Task Details</h2>
            <button onClick={() => setSelectedTask(null)} className="text-gray-400 text-2xl">×</button>
          </div>

          {/* Image */}
          {selectedTask.images.length > 0 && <img src={selectedTask.images[0]} alt="Task" className="w-full h-48 object-cover" />}

          {/* Title + Status */}
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-2xl font-black text-gray-900 mb-2">{selectedTask.title}</h3>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-1 rounded ${CATEGORY_COLORS[selectedTask.category]}`}>{selectedTask.category}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${STATUS_COLORS[selectedTask.status]}`}>
                {selectedTask.status === "in-progress" ? "In Progress" : selectedTask.status === "open" ? "Open" : "Done"}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-100 flex px-5">
            {["Details", "Bids", "Progress"].map(tab => (
              <button key={tab} onClick={() => setSelectedTabDetail(tab)}
                className={`flex-1 py-3 font-bold text-xs border-b-2 ${tab === selectedTabDetail ? "text-teal-600 border-teal-600" : "text-gray-600 border-transparent"}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-5 space-y-4">
            {selectedTabDetail === "Details" && (
              <>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">Location</p>
                  <p className="text-sm font-bold text-gray-900 flex items-center gap-1"><MapPin size={14} /> {selectedTask.location}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">Budget</p>
                  <p className="text-sm font-black text-teal-600">{selectedTask.budget}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">Posted By</p>
                  <p className="text-sm font-bold text-gray-900">{selectedTask.postedBy}</p>
                </div>
              </>
            )}

            {selectedTabDetail === "Bids" && (
              <>
                <p className="text-sm font-bold text-gray-900">{selectedTask.bids} Bids Received</p>
                {selectedTask.bids > 0 && (
                  <button onClick={() => setShowAssignModal(true)} className="w-full bg-teal-600 text-white font-bold py-2.5 rounded-lg hover:bg-teal-700">
                    🤝 Assign to Professional
                  </button>
                )}
              </>
            )}

            {selectedTabDetail === "Progress" && selectedTask.assignedTo && (
              <>
                <p className="text-sm font-bold text-gray-900">Assigned to: {selectedTask.assignedTo}</p>
                <button className="w-full border border-teal-600 text-teal-600 font-bold py-2.5 rounded-lg hover:bg-teal-50">✅ Mark as Done</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-4">Assign Task</h2>
            <p className="text-sm text-gray-600 mb-6">{selectedTask.title}</p>

            <div className="space-y-3 mb-6">
              {["Hassan Ibrahim - Plumbing Specialist", "Karim Ali - General Handyman", "Mohamed Ahmed - Electrical Expert"].map((pro, i) => (
                <label key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="professional" className="w-4 h-4" />
                  <span className="text-sm font-bold text-gray-900">{pro}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowAssignModal(false)} className="flex-1 border border-gray-300 text-gray-900 font-bold py-2.5 rounded-lg">Cancel</button>
              <button onClick={() => { setShowAssignModal(false); setSelectedTask(null); }} className="flex-1 bg-teal-600 text-white font-bold py-2.5 rounded-lg hover:bg-teal-700">✅ Assign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}