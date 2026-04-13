import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { MapPin, Calendar, Edit2, ChevronDown, ChevronUp, Home, Share2, Info, X } from "lucide-react";
import { format, differenceInDays, isToday, isPast, parseISO } from "date-fns";
import ConciergeTaskCard from "@/components/concierge/ConciergeTaskCard";

const TABS = ["All", "Kemework", "Kemetro", "Done"];

function dueDateLabel(dueDate) {
  if (!dueDate) return null;
  const d = parseISO(dueDate);
  const today = new Date();
  const diff = differenceInDays(d, today);
  if (isToday(d)) return { text: "Due today", color: "text-orange-500 font-bold" };
  if (isPast(d)) return { text: `Overdue by ${Math.abs(diff)} day${Math.abs(diff) > 1 ? "s" : ""}`, color: "text-red-500 font-bold" };
  if (diff <= 3) return { text: `Due in ${diff} day${diff > 1 ? "s" : ""}`, color: "text-orange-400" };
  return { text: `Due: ${format(d, "MMM d, yyyy")}`, color: "text-gray-400" };
}

export default function ConciergeHub() {
  const { journeyId } = useParams();
  const navigate = useNavigate();
  const [journey, setJourney] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [showCompleted, setShowCompleted] = useState(false);
  const [editingDate, setEditingDate] = useState(false);
  const [moveInDate, setMoveInDate] = useState("");
  const [showDateHelper, setShowDateHelper] = useState(false);
  const [savingDate, setSavingDate] = useState(false);

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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    // Refresh journey completion
    base44.entities.ConciergeJourney.filter({ id: journeyId }).then(res => {
      if (res[0]) setJourney(res[0]);
    });
  };

  const handleSaveMoveInDate = async () => {
    if (!moveInDate) return;
    setSavingDate(true);
    try {
      await base44.functions.invoke("setMoveInDate", { journeyId, moveInDate });
      await loadData();
      setEditingDate(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingDate(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-gray-400">
        <span className="text-5xl">🗝️</span>
        <p className="font-bold text-lg">Journey not found</p>
        <Link to="/dashboard/buyer-organizer" className="text-orange-500 text-sm underline">Back to Organizer</Link>
      </div>
    );
  }

  const activeTasks = tasks.filter(t => t.status !== "Completed" && t.status !== "Skipped");
  const completedTasks = tasks.filter(t => t.status === "Completed" || t.status === "Skipped");

  const tabFilter = (task) => {
    if (activeTab === "Done") return task.status === "Completed" || task.status === "Skipped";
    if (activeTab === "Kemework") return task.moduleTarget === "kemework" && task.status !== "Completed" && task.status !== "Skipped";
    if (activeTab === "Kemetro") return task.moduleTarget === "kemetro" && task.status !== "Completed" && task.status !== "Skipped";
    return task.status !== "Completed" && task.status !== "Skipped";
  };

  const tabCounts = {
    "All": activeTasks.length,
    "Kemework": tasks.filter(t => t.moduleTarget === "kemework" && t.status !== "Completed" && t.status !== "Skipped").length,
    "Kemetro": tasks.filter(t => t.moduleTarget === "kemetro" && t.status !== "Completed" && t.status !== "Skipped").length,
    "Done": completedTasks.length,
  };

  const filteredTasks = tasks.filter(tabFilter);
  const pct = Math.round(journey.completionPercentage || 0);
  const isComplete = pct === 100;

  return (
    <div className="space-y-0 -mx-4 sm:-mx-6" style={{ background: "#F8FAFC", minHeight: "100vh" }}>

      {/* ── PAGE HEADER ────────────────────────── */}
      <div className="bg-white shadow-sm px-6 py-6 mb-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
          <Link to="/dashboard" className="hover:text-orange-500">Dashboard</Link>
          <span>›</span>
          <span className="text-gray-600 font-medium">My Move-In Concierge</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-gray-900 mb-1">Your Move-In Journey</h1>
            {property && (
              <>
                <p className="text-base text-gray-500 truncate font-medium">{property.title}</p>
                <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPin size={13} /> {property.city_name || ""}{property.district_name ? `, ${property.district_name}` : ""}
                </p>
              </>
            )}
          </div>

          {/* Right: Progress */}
          <div className="lg:w-64">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{journey.completedTasks || 0} of {journey.totalTasks || tasks.length} tasks completed</span>
              <span className="text-lg font-black text-orange-500">{pct}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-orange-500 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Move-In Date Row */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-500 flex items-center gap-1.5"><Calendar size={15} /> Target Move-In Date:</span>
            {!editingDate ? (
              <>
                <span className={`text-sm font-bold ${journey.moveInDate ? "text-gray-900" : "text-gray-400 italic"}`}>
                  {journey.moveInDate ? format(parseISO(journey.moveInDate), "MMMM d, yyyy") : "Not set yet"}
                </span>
                <button onClick={() => setEditingDate(true)} className="text-teal-600 text-sm font-medium flex items-center gap-1 hover:text-teal-700">
                  <Edit2 size={13} /> Edit
                </button>
                <button onClick={() => setShowDateHelper(!showDateHelper)} className="text-gray-400 hover:text-gray-600">
                  <Info size={14} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={moveInDate}
                  onChange={e => setMoveInDate(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
                <button
                  onClick={handleSaveMoveInDate}
                  disabled={savingDate}
                  className="bg-teal-500 text-white text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-teal-600 disabled:opacity-50"
                >
                  {savingDate ? "Saving…" : "Save"}
                </button>
                <button onClick={() => setEditingDate(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
              </div>
            )}
          </div>
          {showDateHelper && (
            <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-xs text-blue-700 max-w-lg">
              📅 Editing your move-in date adjusts all task due dates automatically. Tasks marked relative to your move-in date (e.g. "7 days before") will reschedule accordingly.
            </div>
          )}
        </div>
      </div>

      <div className="px-6">
        {/* ── COMPLETION CELEBRATION ─────────────── */}
        {isComplete && (
          <div className="rounded-2xl p-8 text-center mb-6 text-white" style={{ background: "linear-gradient(135deg, #FF6B00, #f59e0b)" }}>
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-2xl font-black mb-2">You're all moved in!</h2>
            <p className="text-orange-100 mb-6">You completed your move-in journey for {property?.title || "your new home"}. Enjoy your new home!</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <button className="border-2 border-white text-white font-bold px-5 py-2.5 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2">
                <Share2 size={16} /> Share your journey
              </button>
              <Link to="/dashboard/my-properties" className="bg-white text-orange-500 font-bold px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors">
                View My Properties →
              </Link>
            </div>
          </div>
        )}

        {/* ── FILTER TABS ────────────────────────── */}
        <div className="flex gap-1 mb-5 bg-white rounded-xl p-1 shadow-sm w-fit">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
            >
              {tab === "Kemework" ? "👷" : tab === "Kemetro" ? "🛒" : tab === "Done" ? "✅" : ""} {tab} <span className="text-[11px] opacity-70">({tabCounts[tab]})</span>
            </button>
          ))}
        </div>

        {/* ── TASK TIMELINE ──────────────────────── */}
        {filteredTasks.length === 0 && activeTab !== "Done" ? (
          <div className="bg-white rounded-2xl shadow-sm p-14 text-center">
            <div className="text-5xl mb-3">🏠</div>
            <p className="font-bold text-gray-700 text-lg">All caught up!</p>
            <p className="text-gray-400 text-sm mt-1">No pending tasks right now. We'll notify you as your move-in date approaches.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 z-0" />

            <div className="space-y-4">
              {filteredTasks.map((task, i) => (
                <ConciergeTaskCard
                  key={task.id}
                  task={task}
                  property={property}
                  dueDateLabel={dueDateLabel(task.dueDate)}
                  onUpdate={handleTaskUpdate}
                  isLast={i === filteredTasks.length - 1}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── COMPLETED SECTION ──────────────────── */}
        {completedTasks.length > 0 && activeTab !== "Done" && (
          <div className="mt-6">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 bg-white px-5 py-3 rounded-xl shadow-sm w-full"
            >
              {showCompleted ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              ✅ {completedTasks.length} completed task{completedTasks.length > 1 ? "s" : ""} — click to {showCompleted ? "hide" : "show"}
            </button>
            {showCompleted && (
              <div className="mt-3 space-y-3 opacity-60">
                {completedTasks.map(task => (
                  <ConciergeTaskCard
                    key={task.id}
                    task={task}
                    property={property}
                    dueDateLabel={dueDateLabel(task.dueDate)}
                    onUpdate={handleTaskUpdate}
                    dimmed
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="h-12" />
      </div>
    </div>
  );
}