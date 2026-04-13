import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, X } from "lucide-react";
import { format, differenceInDays, isToday, isPast, parseISO } from "date-fns";
import ConciergeTaskBottomSheet from "@/components/concierge/ConciergeTaskBottomSheet";

const STATUS_BADGE = {
  Pending:   { label: "Upcoming",    cls: "bg-gray-100 text-gray-500 text-[10px]" },
  Due:       { label: "● Due now",   cls: "bg-orange-100 text-orange-600 animate-pulse text-[10px] font-black" },
  Actioned:  { label: "In progress", cls: "bg-teal-100 text-teal-700 text-[10px]" },
  Completed: { label: "✓ Done",      cls: "bg-green-100 text-green-700 text-[10px]" },
  Skipped:   { label: "Skipped",     cls: "bg-gray-100 text-gray-400 text-[10px]" },
};

const MODULE_BTN_CLS = {
  kemework: "bg-teal-500 text-white",
  kemetro:  "bg-blue-600 text-white",
  kemedar:  "bg-orange-500 text-white",
};

function dueDateLabel(dueDate) {
  if (!dueDate) return null;
  const d = parseISO(dueDate);
  const today = new Date();
  const diff = differenceInDays(d, today);
  if (isToday(d)) return { text: "Due today", color: "text-orange-500 font-bold" };
  if (isPast(d)) return { text: `Overdue ${Math.abs(diff)}d`, color: "text-red-500 font-bold" };
  return { text: `In ${diff}d`, color: "text-gray-400" };
}

function MobileTaskCard({ task, property, onTap, onUpdate }) {
  const accent = task.accentColor || "#FF6B00";
  const isDone = task.status === "Completed" || task.status === "Skipped";
  const badge = STATUS_BADGE[task.status] || STATUS_BADGE.Pending;
  const dl = dueDateLabel(task.dueDate);
  const btnCls = MODULE_BTN_CLS[task.moduleTarget] || MODULE_BTN_CLS.kemedar;
  const [loading, setLoading] = useState(null);

  const updateStatus = async (newStatus, e) => {
    e?.stopPropagation();
    setLoading(newStatus);
    try {
      const res = await base44.functions.invoke("updateTaskStatus", { taskId: task.id, status: newStatus });
      onUpdate({ ...task, status: newStatus, ...res?.data?.task });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-3 active:scale-[0.99] transition-transform"
      style={{ borderTop: `4px solid ${accent}` }}
    >
      <div className="p-4" onClick={() => onTap(task)}>
        {/* Header row */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: `${accent}20` }}>
            {task.icon || "📋"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 leading-tight">{task.title}</p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className={`px-2 py-0.5 rounded-full font-bold ${badge.cls}`}>{badge.label}</span>
            {dl && <span className={`text-[10px] ${dl.color}`}>{dl.text}</span>}
          </div>
        </div>

        {/* Description (truncated) */}
        {task.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{task.description}</p>
        )}
      </div>

      {/* CTA + secondary actions */}
      {!isDone && (
        <div className="px-4 pb-4 space-y-2">
          <button
            onClick={(e) => { e.stopPropagation(); onTap(task); }}
            className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${btnCls}`}
          >
            {task.moduleTarget === "kemework" ? "👷" : task.moduleTarget === "kemetro" ? "🛒" : "🏠"} {task.title}
          </button>
          <div className="flex gap-4 justify-center text-xs text-gray-400 pt-1">
            <button onClick={(e) => updateStatus("Completed", e)} disabled={loading === "Completed"} className="hover:text-green-600 font-medium disabled:opacity-40">
              ✅ Mark Done
            </button>
            <button onClick={(e) => updateStatus("Skipped", e)} disabled={loading === "Skipped"} className="hover:text-gray-600 disabled:opacity-40">
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConciergeMobileHub() {
  const { journeyId } = useParams();
  const navigate = useNavigate();
  const [journey, setJourney] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingDate, setEditingDate] = useState(false);
  const [moveInDate, setMoveInDate] = useState("");

  useEffect(() => { loadData(); }, [journeyId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [journeys, allTasks] = await Promise.all([
        base44.entities.ConciergeJourney.filter({ id: journeyId }),
        base44.entities.ConciergeTask.filter({ journeyId }, "sortOrder", 100),
      ]);
      const j = journeys[0];
      if (!j) { setLoading(false); return; }
      setJourney(j);
      setTasks(allTasks);
      setMoveInDate(j.moveInDate || "");
      if (j.propertyId) {
        const props = await base44.entities.Property.filter({ id: j.propertyId });
        setProperty(props[0] || null);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    base44.entities.ConciergeJourney.filter({ id: journeyId }).then(res => {
      if (res[0]) setJourney(res[0]);
    });
    setSelectedTask(null);
  };

  const handleSaveDate = async () => {
    if (!moveInDate) return;
    try {
      await base44.functions.invoke("setMoveInDate", { journeyId, moveInDate });
      setEditingDate(false);
      await loadData();
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8FAFC" }}>
        <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: "#F8FAFC" }}>
        <span className="text-5xl">🗝️</span>
        <p className="font-bold text-gray-700">Journey not found</p>
        <Link to="/m/dashboard" className="text-orange-500 text-sm underline">Back to Dashboard</Link>
      </div>
    );
  }

  const pct = Math.round(journey.completionPercentage || 0);
  const TABS = ["All", "Kemework", "Kemetro", "Done"];

  const filteredTasks = tasks.filter(t => {
    if (activeTab === "Done") return t.status === "Completed" || t.status === "Skipped";
    if (activeTab === "Kemework") return t.moduleTarget === "kemework" && t.status !== "Completed" && t.status !== "Skipped";
    if (activeTab === "Kemetro") return t.moduleTarget === "kemetro" && t.status !== "Completed" && t.status !== "Skipped";
    return t.status !== "Completed" && t.status !== "Skipped";
  });

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-black text-gray-900 text-base">My Move-In Journey</h1>
          <button onClick={() => setEditingDate(true)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
            <Calendar size={16} />
          </button>
        </div>
        {/* Progress bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>{journey.completedTasks || 0} of {journey.totalTasks || tasks.length} complete</span>
            <span className="font-black text-orange-500">{pct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="h-2 rounded-full bg-orange-500 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
        {/* Tabs */}
        <div className="flex border-t border-gray-100 overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs font-bold whitespace-nowrap px-2 transition-all border-b-2 ${activeTab === tab ? "border-orange-500 text-orange-500" : "border-transparent text-gray-400"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      <div className="px-4 pt-4 pb-24">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🏠</div>
            <p className="font-bold text-gray-700">All caught up!</p>
            <p className="text-xs text-gray-400 mt-1">No pending tasks right now.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <MobileTaskCard
              key={task.id}
              task={task}
              property={property}
              onTap={setSelectedTask}
              onUpdate={handleTaskUpdate}
            />
          ))
        )}
      </div>

      {/* Date edit overlay */}
      {editingDate && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900">Edit Move-In Date</h3>
              <button onClick={() => setEditingDate(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <input
              type="date"
              value={moveInDate}
              onChange={e => setMoveInDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 mb-4"
            />
            <p className="text-xs text-blue-600 bg-blue-50 rounded-xl px-3 py-2 mb-4">
              📅 Editing this adjusts all task due dates automatically.
            </p>
            <button onClick={handleSaveDate} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600">
              Save Date
            </button>
          </div>
        </div>
      )}

      {/* Task bottom sheet */}
      {selectedTask && (
        <ConciergeTaskBottomSheet
          task={selectedTask}
          property={property}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
}