import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { X } from "lucide-react";

const MODULE_BTN = {
  kemework: { label: "Do this now →", cls: "bg-teal-500 hover:bg-teal-600" },
  kemetro:  { label: "Do this now →", cls: "bg-blue-600 hover:bg-blue-700" },
  kemedar:  { label: "Do this now →", cls: "bg-orange-500 hover:bg-orange-600" },
};

const WHY_TEXT = {
  kemework: "Booking professionals early means availability is guaranteed and prices are locked in before demand spikes around your move date.",
  kemetro:  "Ordering supplies and furniture ahead of time ensures delivery arrives before you move in, so you're comfortable from day one.",
  kemedar:  "Completing this step on Kemedar will help you get the most out of your property and ensure everything is set up correctly.",
};

export default function ConciergeTaskBottomSheet({ task, property, onClose, onUpdate }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [topProfiles, setTopProfiles] = useState([]);

  const accent = task.accentColor || "#FF6B00";
  const btnConfig = MODULE_BTN[task.moduleTarget] || MODULE_BTN.kemedar;
  const whyText = WHY_TEXT[task.moduleTarget] || WHY_TEXT.kemedar;

  const updateStatus = async (newStatus) => {
    setLoading(newStatus);
    try {
      const res = await base44.functions.invoke("updateTaskStatus", { taskId: task.id, status: newStatus });
      onUpdate({ ...task, status: newStatus, ...res?.data?.task });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const handleCTA = async () => {
    let path = task.deepLinkPath || "";
    const params = new URLSearchParams();
    if (task.autoFillParams) Object.entries(task.autoFillParams).forEach(([k, v]) => params.set(k, v));
    if (task.categoryTarget) params.set("category", task.categoryTarget);
    if (property) {
      const loc = [property.city_name, property.district_name].filter(Boolean).join(", ");
      if (loc) params.set("location", loc);
    }
    if (task.discountCode) params.set("promo", task.discountCode);
    const qs = params.toString();
    const url = qs ? `${path}?${qs}` : path;
    await updateStatus("Actioned");
    navigate(url);
  };

  const isDone = task.status === "Completed" || task.status === "Skipped";

  // Mock preview items (would come from Kemework/Kemetro API in prod)
  const PREVIEW_ITEMS = task.moduleTarget === "kemework"
    ? [
        { name: "Ahmed Cleaners", rating: 4.8, price: "From 250 EGP", avatar: "🧹" },
        { name: "Pro Mover Team", rating: 4.7, price: "From 500 EGP", avatar: "📦" },
        { name: "ShineUp Services", rating: 4.9, price: "From 300 EGP", avatar: "✨" },
      ]
    : [
        { name: "Deep Clean Kit", rating: 4.6, price: "120 EGP", avatar: "🧴" },
        { name: "Moving Boxes Set", rating: 4.8, price: "85 EGP", avatar: "📦" },
        { name: "Furniture Pads", rating: 4.5, price: "60 EGP", avatar: "🛋️" },
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ backgroundColor: "rgba(10,22,40,0.6)" }}>
      <div className="bg-white w-full rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {/* Close */}
          <div className="flex justify-end mb-2">
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200">
              <X size={16} />
            </button>
          </div>

          {/* Icon + Title */}
          <div className="text-center mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-4xl mx-auto mb-3"
              style={{ backgroundColor: `${accent}20` }}
            >
              {task.icon || "📋"}
            </div>
            <h2 className="text-xl font-black text-gray-900">{task.title}</h2>
          </div>

          {/* Full description */}
          {task.description && (
            <p className="text-sm text-gray-600 leading-relaxed mb-5 text-center">{task.description}</p>
          )}

          {/* Why this matters */}
          <div className="bg-teal-50 border border-teal-100 rounded-2xl px-4 py-3 mb-5">
            <p className="text-xs font-black text-teal-700 mb-1">💡 Why this matters</p>
            <p className="text-xs text-teal-600 leading-relaxed">{whyText}</p>
          </div>

          {/* Mini preview carousel */}
          <div className="mb-5">
            <p className="text-xs font-black text-gray-700 mb-2 uppercase tracking-wide">
              {task.moduleTarget === "kemework" ? "Top Professionals Near You" : "Top Products"}
            </p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {PREVIEW_ITEMS.map((item, i) => (
                <div key={i} className="flex-shrink-0 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 flex items-center gap-2.5 min-w-[160px]">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg flex-shrink-0">
                    {item.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{item.name}</p>
                    <p className="text-[10px] text-yellow-500 font-bold">⭐ {item.rating}</p>
                    <p className="text-[10px] text-gray-500">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discount banner */}
          {task.discountCode && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-center">
              <p className="text-sm font-black text-amber-700">
                🎁 {task.discountPercent}% off with code <span className="bg-amber-100 px-2 py-0.5 rounded font-black">{task.discountCode}</span> — applied automatically!
              </p>
            </div>
          )}
        </div>

        {/* CTA sticky bottom */}
        {!isDone && (
          <div className="px-5 pb-8 pt-4 border-t border-gray-100 space-y-3 bg-white">
            <button
              onClick={handleCTA}
              className={`w-full py-4 rounded-2xl text-white font-black text-base transition-colors ${btnConfig.cls}`}
            >
              {btnConfig.label}
            </button>
            <div className="flex gap-4 justify-center text-sm text-gray-400">
              <button onClick={() => updateStatus("Completed")} disabled={loading === "Completed"} className="hover:text-green-600 font-medium disabled:opacity-40">
                ✅ Mark as Done
              </button>
              <span className="text-gray-200">|</span>
              <button onClick={() => updateStatus("Skipped")} disabled={loading === "Skipped"} className="hover:text-gray-600 disabled:opacity-40">
                Skip this task
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}