import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const TASKS = [
  { id: 1, title: "Plumbing Repair", postedBy: "Ahmed Hassan", assignedTo: "Hassan Ibrahim", location: "Giza", budget: "$150-200", deadline: "Today", status: "in-progress" },
  { id: 2, title: "Electrical Installation", postedBy: "Sara Mohamed", assignedTo: "Karim Ali", location: "Downtown", budget: "$300-400", deadline: "Tomorrow", status: "pending" },
  { id: 3, title: "Wall Painting", postedBy: "Fatima Khalil", assignedTo: "Hussein Ahmed", location: "Heliopolis", budget: "$200-250", deadline: "2 days", status: "in-progress" },
  { id: 4, title: "Carpentry Work", postedBy: "Leila Ahmed", assignedTo: "Hassan Ibrahim", location: "New Cairo", budget: "$500-600", deadline: "3 days", status: "pending" },
];

const TASK_TABS = ["All Tasks", "In Progress", "Completed", "I Posted", "Kemedar Working On"];

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  "in-progress": "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

const CATEGORIES = {
  plumbing: "🔧",
  electrical: "⚡",
  painting: "🎨",
  carpentry: "🪵",
};

export default function FranchiseOwnerKemeworkTasks() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All Tasks");
  const [selectedTask, setSelectedTask] = useState(null);

  const filteredTasks = TASKS.filter(t => {
    if (activeTab === "All Tasks") return true;
    if (activeTab === "In Progress") return t.status === "in-progress";
    if (activeTab === "Completed") return t.status === "completed";
    if (activeTab === "I Posted") return t.postedBy === "Ahmed Hassan";
    if (activeTab === "Kemedar Working On") return t.assignedTo === "Hassan Ibrahim";
    return true;
  });

  return (
    <div className="min-h-full bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3" style={{ height: 56 }}>
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-black text-gray-900">Tasks</h1>
      </div>

      {/* Tabs */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-200 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {TASK_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Task Cards */}
      <div className="px-4 py-4 pb-24 space-y-3">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            onClick={() => setSelectedTask(task)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex gap-3">
              {/* Category Icon */}
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                {CATEGORIES[task.title.toLowerCase().split(" ")[0]] || "📋"}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900">{task.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">By {task.postedBy}</p>
                <p className="text-xs text-gray-500">Assigned to {task.assignedTo}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-gray-600">📍 {task.location}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${STATUS_COLORS[task.status]}`}>
                    {task.status === "in-progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Budget & Deadline */}
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold text-green-600">{task.budget}</p>
                <p className="text-[10px] text-gray-500 mt-1">⏰ {task.deadline}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-gray-900">{selectedTask.title}</h2>
              <button onClick={() => setSelectedTask(null)} className="text-gray-400 text-2xl">✕</button>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-sm text-gray-700"><strong>Posted by:</strong> {selectedTask.postedBy}</p>
                <p className="text-sm text-gray-700"><strong>Assigned to:</strong> {selectedTask.assignedTo}</p>
                <p className="text-sm text-gray-700"><strong>Location:</strong> 📍 {selectedTask.location}</p>
                <p className="text-sm text-gray-700"><strong>Budget:</strong> {selectedTask.budget}</p>
                <p className="text-sm text-gray-700"><strong>Deadline:</strong> {selectedTask.deadline}</p>
                <p className="text-sm text-gray-700">
                  <strong>Status:</strong>
                  <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded ${STATUS_COLORS[selectedTask.status]}`}>
                    {selectedTask.status === "in-progress" ? "In Progress" : selectedTask.status}
                  </span>
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <button className="flex-1 border border-gray-300 text-gray-900 font-bold py-3 rounded-lg">
                  View Details
                </button>
                <button className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700">
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}