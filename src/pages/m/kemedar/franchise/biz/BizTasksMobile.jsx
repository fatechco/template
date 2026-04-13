import { useState } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TASK_TABS = [
  { id: "todo", title: "Todo", count: 2 },
  { id: "inprogress", title: "In Progress", count: 1 },
  { id: "done", title: "Done", count: 1 },
];

const TASKS = [
  { id: 1, title: "Update client proposal", priority: "high", assigned: "Sara", due: "2026-03-25", status: "todo" },
  { id: 2, title: "Follow up with leads", priority: "medium", assigned: "Omar", due: "2026-03-24", status: "todo" },
  { id: 3, title: "Prepare invoice batch", priority: "medium", assigned: "Fatima", due: "2026-03-23", status: "inprogress" },
  { id: 4, title: "Schedule team meeting", priority: "low", assigned: "Sara", due: "2026-03-20", status: "done" },
];

export default function BizTasksMobile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("todo");

  const filtered = TASKS.filter(t => t.status === activeTab);
  const priorityIcon = (p) => p === "high" ? "🔴" : p === "medium" ? "🟡" : "🟢";

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-[480px] mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-base font-black text-gray-900">Tasks</h1>
        <button className="p-1.5">
          <Plus size={22} className="text-cyan-600" />
        </button>
      </div>

      {/* Task Tabs */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-100 px-2 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {TASK_TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
              activeTab === tab.id ? "bg-cyan-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab.title} ({tab.count})
          </button>
        ))}
      </div>

      {/* Task Cards */}
      <div className="p-4 space-y-2">
        {filtered.map(task => (
          <div key={task.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-start gap-2 mb-2">
              <span className="text-lg">{priorityIcon(task.priority)}</span>
              <p className="font-bold text-gray-900 flex-1">{task.title}</p>
            </div>
            <p className="text-xs text-gray-600 mb-2">👤 {task.assigned} • 📅 {task.due}</p>
            <div className="flex gap-2">
              <button className="flex-1 text-xs text-gray-600 border border-gray-200 py-2 rounded-lg hover:bg-gray-50">Edit</button>
              <button className="flex-1 text-xs text-green-600 bg-green-50 py-2 rounded-lg font-bold">Mark Done</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}