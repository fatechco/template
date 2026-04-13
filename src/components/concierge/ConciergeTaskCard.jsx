import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";

const STATUS_BADGE = {
  Pending:   { label: "Upcoming",    cls: "bg-gray-100 text-gray-500" },
  Due:       { label: "● Due now",   cls: "bg-orange-100 text-orange-600 animate-pulse font-black" },
  Actioned:  { label: "In progress", cls: "bg-teal-100 text-teal-700" },
  Completed: { label: "✓ Done",      cls: "bg-green-100 text-green-700" },
  Skipped:   { label: "Skipped",     cls: "bg-gray-100 text-gray-400" },
};

const MODULE_BTN = {
  kemework: { label: "👷 Find on Kemework", cls: "bg-teal-500 hover:bg-teal-600 text-white" },
  kemetro:  { label: "🛒 Shop on Kemetro",  cls: "bg-blue-600 hover:bg-blue-700 text-white" },
  kemedar:  { label: "🏠 View on Kemedar",  cls: "bg-orange-500 hover:bg-orange-600 text-white" },
};

export default function ConciergeTaskCard({ task, property, dueDateLabel, onUpdate, dimmed, isLast }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(null); // "actioned" | "done" | "skip"
  const [confetti, setConfetti] = useState(false);

  const accent = task.accentColor || "#FF6B00";
  const isDone = task.status === "Completed" || task.status === "Skipped";

  const updateStatus = async (newStatus) => {
    setLoading(newStatus);
    try {
      const res = await base44.functions.invoke("updateTaskStatus", {
        taskId: task.id,
        status: newStatus,
      });
      if (newStatus === "Completed") setConfetti(true);
      onUpdate({ ...task, status: newStatus, ...res?.data?.task });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
      setTimeout(() => setConfetti(false), 1500);
    }
  };

  const handleCTA = async () => {
    // Build URL with auto-fill params
    let path = task.deepLinkPath || "";
    const params = new URLSearchParams();

    if (task.autoFillParams) {
      Object.entries(task.autoFillParams).forEach(([k, v]) => params.set(k, v));
    }
    if (task.categoryTarget) params.set("category", task.categoryTarget);
    if (property) {
      const loc = [property.city_name, property.district_name].filter(Boolean).join(", ");
      if (loc) params.set("location", loc);
    }
    if (task.discountCode) {
      params.set("promo", task.discountCode);
      // Show toast for kemetro discount
      if (task.moduleTarget === "kemetro") {
        const event = new CustomEvent("show-toast", {
          detail: `Code ${task.discountCode} applied — ${task.discountPercent}% off your order! 🎉`
        });
        window.dispatchEvent(event);
      }
    }

    const qs = params.toString();
    const url = qs ? `${path}?${qs}` : path;

    // Mark as actioned
    await updateStatus("Actioned");
    navigate(url);
  };

  const badge = STATUS_BADGE[task.status] || STATUS_BADGE.Pending;
  const btnConfig = MODULE_BTN[task.moduleTarget] || MODULE_BTN.kemedar;

  return (
    <div className={`relative flex gap-4 ${dimmed ? "opacity-60" : ""}`}>
      {/* Timeline dot */}
      <div className="relative z-10 flex-shrink-0 w-10">
        <div
          className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-sm mt-4"
          style={{
            backgroundColor: isDone ? "#22c55e" : task.status === "Due" ? "#FF6B00" : accent,
            animation: task.status === "Due" && !isDone ? "pulse 2s infinite" : "none",
          }}
        >
          {isDone && <span className="text-[8px] text-white font-black">✓</span>}
        </div>
      </div>

      {/* Card */}
      <div
        className={`flex-1 bg-white rounded-2xl shadow-sm overflow-hidden ${confetti ? "ring-2 ring-green-400" : ""}`}
        style={{ borderLeft: `4px solid ${accent}` }}
      >
        {confetti && (
          <div className="bg-green-50 text-green-700 text-xs font-bold px-4 py-2 text-center">
            🎉 Task completed!
          </div>
        )}

        <div className="p-4">
          {/* Row 1: icon + title + status */}
          <div className="flex items-start gap-3">
            {/* Icon circle */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: `${accent}20` }}
            >
              {task.icon || "📋"}
            </div>

            {/* Title & description */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">{task.title}</p>
              {task.description && (
                <p className={`text-xs text-gray-500 mt-0.5 leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}>
                  {task.description}
                </p>
              )}
              {task.description && task.description.length > 100 && (
                <button onClick={() => setExpanded(!expanded)} className="text-xs text-teal-500 hover:underline mt-0.5">
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>

            {/* Status badge */}
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${badge.cls}`}>
              {badge.label}
            </span>
          </div>

          {/* Row 2: due date */}
          {dueDateLabel && (
            <p className={`text-xs mt-3 ml-13 ${dueDateLabel.color}`} style={{ marginLeft: "52px" }}>
              📅 {dueDateLabel.text}
            </p>
          )}

          {/* Row 3: action buttons */}
          {!isDone && (
            <div className="mt-4 flex flex-col gap-2" style={{ marginLeft: "52px" }}>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleCTA}
                  disabled={loading === "Actioned"}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${btnConfig.cls} disabled:opacity-50`}
                >
                  {btnConfig.label.replace(
                    task.moduleTarget === "kemework" ? "on Kemework" : "on Kemetro",
                    task.categoryTarget ? `${task.categoryTarget} on ${task.moduleTarget === "kemework" ? "Kemework" : "Kemetro"}` : (task.moduleTarget === "kemework" ? "on Kemework" : "on Kemetro")
                  )}
                </button>
                <div className="flex gap-3 ml-auto text-xs text-gray-400">
                  <button
                    onClick={() => updateStatus("Completed")}
                    disabled={loading === "Completed"}
                    className="hover:text-green-600 transition-colors font-medium disabled:opacity-40"
                  >
                    ✅ Mark as Done
                  </button>
                  <button
                    onClick={() => updateStatus("Skipped")}
                    disabled={loading === "Skipped"}
                    className="hover:text-gray-600 transition-colors disabled:opacity-40"
                  >
                    Skip
                  </button>
                </div>
              </div>
              {task.discountCode && (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 font-medium">
                  🎁 {task.discountPercent}% off with code <span className="font-black">{task.discountCode}</span> — applied automatically
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}