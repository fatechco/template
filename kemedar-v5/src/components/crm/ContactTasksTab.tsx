"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { Plus, CheckCircle, Clock, AlertCircle, RefreshCw, ChevronDown } from "lucide-react";

const MOCK_TASKS = [
  { id: "t1", title: "Follow-up call", type: "call", priority: "high", status: "open", dueAt: "Tomorrow 10:00", assignedTo: "You", overdue: false },
  { id: "t2", title: "Send renewal proposal", type: "email", priority: "medium", status: "open", dueAt: "Apr 5", assignedTo: "You", overdue: false },
  { id: "t3", title: "Verify business license", type: "task", priority: "high", status: "open", dueAt: "Mar 30", assignedTo: "You", overdue: true },
  { id: "t4", title: "Schedule demo call", type: "meeting", priority: "low", status: "open", dueAt: "Apr 10", assignedTo: "Adel M.", overdue: false },
  { id: "t5", title: "Send welcome email", type: "email", priority: "medium", status: "done", dueAt: "Mar 20", assignedTo: "Sara K.", overdue: false, completedAt: "Mar 20" },
  { id: "t6", title: "Initial contact", type: "call", priority: "high", status: "done", dueAt: "Mar 15", assignedTo: "You", overdue: false, completedAt: "Mar 15" },
];

const TYPE_ICON = { call: "📞", email: "📧", whatsapp: "💬", meeting: "🤝", task: "📋", reminder: "⏰", follow_up: "🔄" };
const PRIORITY_DOT = { urgent: "bg-red-500", high: "bg-orange-400", medium: "bg-yellow-400", low: "bg-gray-300" };

function TaskRow({ task, onComplete }) {
  const [expanded, setExpanded] = useState(false);
  const [outcome, setOutcome] = useState("");

  return (
    <div className={`border rounded-xl mb-2 overflow-hidden ${task.overdue ? "border-red-200 bg-red-50/30" : "border-gray-100 bg-white"}`}>
      <div className="flex items-center gap-3 p-3">
        {/* Status toggle */}
        <button onClick={() => task.status === "open" && onComplete(task.id)}
          className={`flex-shrink-0 ${task.status === "done" ? "text-green-500" : "text-gray-300 hover:text-green-500"}`}>
          <CheckCircle size={16} />
        </button>

        {/* Type icon */}
        <span className="text-sm flex-shrink-0">{TYPE_ICON[task.type] || "📋"}</span>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold ${task.status === "done" ? "line-through text-gray-400" : "text-gray-900"}`}>{task.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {task.overdue && <span className="text-[10px] text-red-500 font-bold flex items-center gap-0.5"><AlertCircle size={9} /> Overdue</span>}
            <span className="text-[10px] text-gray-400">{task.dueAt}</span>
            <span className="text-[10px] text-gray-300">·</span>
            <span className="text-[10px] text-gray-400">{task.assignedTo}</span>
          </div>
        </div>

        {/* Priority */}
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[task.priority]}`} />

        {/* Expand for outcome logging */}
        {task.status === "open" && (
          <button onClick={() => setExpanded(!expanded)} className="text-gray-300 hover:text-gray-600 flex-shrink-0">
            <ChevronDown size={14} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}

        {task.status === "done" && (
          <span className="text-[10px] text-green-600 font-bold flex-shrink-0">Done ✓</span>
        )}
      </div>

      {/* Outcome logging */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-gray-100 bg-gray-50/50">
          <div className="pt-3 space-y-2">
            <select value={outcome} onChange={e => setOutcome(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none">
              <option value="">Log outcome...</option>
              <option value="completed">Completed</option>
              <option value="no_answer">No Answer</option>
              <option value="callback">Callback Scheduled</option>
              <option value="not_interested">Not Interested</option>
              <option value="snooze">Snooze 24h</option>
            </select>
            <div className="flex gap-2">
              <button className="flex-1 bg-green-500 text-white text-xs font-bold py-1.5 rounded-lg hover:bg-green-600">
                Complete
              </button>
              <button className="flex-1 border border-gray-200 text-gray-600 text-xs font-bold py-1.5 rounded-lg hover:bg-gray-50">
                Reassign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContactTasksTab({ contact, autoOpenCreate, onFormOpened }) {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [showCreate, setShowCreate] = useState(false);
  const [tab, setTab] = useState("open");
  const [newTask, setNewTask] = useState({ title: "", type: "task", priority: "medium", dueAt: "" });

  useEffect(() => {
    if (autoOpenCreate) {
      setShowCreate(true);
      onFormOpened?.();
    }
  }, [autoOpenCreate]);

  const handleComplete = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "done", completedAt: "Now" } : t));
  };

  const open = tasks.filter(t => t.status === "open" && !t.overdue);
  const overdue = tasks.filter(t => t.overdue && t.status === "open");
  const done = tasks.filter(t => t.status === "done");

  const displayed = tab === "open" ? [...overdue, ...open] : tab === "done" ? done : tasks;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-0 border-b border-gray-200">
          {[
            { id: "open", label: `Open (${open.length + overdue.length})` },
            { id: "done", label: `Done (${done.length})` },
            { id: "all", label: "All" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${tab === t.id ? "text-violet-600 border-violet-600" : "text-gray-500 border-transparent"}`}>
              {t.label}
            </button>
          ))}
        </div>
        <button onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold px-3 py-2 rounded-lg text-xs">
          <Plus size={12} /> New Task
        </button>
      </div>

      {showCreate && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 space-y-3">
          <input value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
            placeholder="Task title..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-400" />
          <div className="grid grid-cols-3 gap-2">
            <select value={newTask.type} onChange={e => setNewTask(p => ({ ...p, type: e.target.value }))}
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none">
              {["call","email","whatsapp","meeting","task","follow_up","reminder"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={newTask.priority} onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none">
              {["urgent","high","medium","low"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input type="date" value={newTask.dueAt} onChange={e => setNewTask(p => ({ ...p, dueAt: e.target.value }))}
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)} className="text-xs text-gray-500 font-bold">Cancel</button>
            <button onClick={() => {
              if (!newTask.title.trim()) return;
              setTasks(prev => [...prev, { id: `t${Date.now()}`, ...newTask, status: "open", overdue: false, assignedTo: "You" }]);
              setNewTask({ title: "", type: "task", priority: "medium", dueAt: "" });
              setShowCreate(false);
            }} className="bg-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-violet-700">Create Task</button>
          </div>
        </div>
      )}

      {overdue.length > 0 && tab === "open" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-2">
          <p className="text-xs font-black text-red-600 mb-2 flex items-center gap-1"><AlertCircle size={12} /> {overdue.length} Overdue</p>
          {overdue.map(t => <TaskRow key={t.id} task={t} onComplete={handleComplete} />)}
        </div>
      )}

      {displayed.filter(t => !t.overdue || tab !== "open").map(t => (
        <TaskRow key={t.id} task={t} onComplete={handleComplete} />
      ))}

      {displayed.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <CheckCircle size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold">No tasks in this view</p>
        </div>
      )}
    </div>
  );
}