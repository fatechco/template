"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Leaf, X, ChevronRight, AlertCircle } from "lucide-react";

export default function KemeworkProfessionalAlert({ task }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!task?.cityId || dismissed) return;
    const load = async () => {
      try {
        const results = await apiClient.post("/api/v1/ai/querySurplusForProfessional", {
          cityId: task.cityId,
          categoryIds: task.materialCategories || [],
          latitude: task.latitude,
          longitude: task.longitude,
          radius: 10
        });
        setItems(results?.data?.items || []);
        if ((results?.data?.items || []).length > 0) {
          /* apiClient TODO */({
            eventName: "kemework_surplus_alert_shown",
            properties: { taskId: task.id, itemCount: results.data.items.length }
          });
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, [task, dismissed]);

  if (dismissed || loading || items.length === 0) return null;

  const maxDiscount = Math.max(...items.map(i => i.discountPercent || 0));
  const avgDistance = (items.reduce((s, i) => s + (i.distanceFromTaskKm || 0), 0) / items.length).toFixed(1);

  const searchParams = new URLSearchParams({
    cityId: task.cityId,
    category: items[0]?.categoryId,
    lat: task.latitude,
    lng: task.longitude,
    radius: "10"
  }).toString();

  const handleClick = () => {
    /* apiClient TODO */({
      eventName: "kemework_surplus_alert_clicked",
      properties: { taskId: task.id, itemCount: items.length }
    });
  };

  const handleDismiss = () => {
    /* apiClient TODO */({
      eventName: "kemework_surplus_alert_dismissed",
      properties: { taskId: task.id }
    });
    setDismissed(true);
  };

  return (
    <div className="bg-white rounded-2xl border-l-4 border-green-600 shadow-sm p-5 mb-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Leaf size={20} className="text-green-600" />
          <p className="font-black text-gray-900 text-sm">Increase Your Profit Margin</p>
        </div>
        <button onClick={handleDismiss} className="p-1 hover:bg-gray-100 rounded-lg">
          <X size={16} className="text-gray-400" />
        </button>
      </div>

      <p className="text-xs text-gray-600 mb-4 leading-relaxed">
        There are <span className="font-bold text-gray-900">{items.length} matching material listings</span> in the Kemetro Surplus Market just <span className="font-bold text-gray-900">{avgDistance} km</span> from this job site — at up to <span className="font-bold text-green-700">{maxDiscount}%</span> off retail.
      </p>

      {/* Preview scroll */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
        {items.slice(0, 3).map(item => (
          <div key={item.id} className="flex-shrink-0 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
            <img src={item.primaryImageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">{item.title.split(" ").slice(0, 2).join(" ")}</p>
              <div className="flex items-center gap-1">
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                  {item.discountPercent}% off
                </span>
                <span className="text-gray-400 text-[10px]">{item.distanceFromTaskKm}km</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <a
        href={`/kemetro/surplus?${searchParams}`}
        onClick={handleClick}
        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors"
      >
        <Leaf size={16} /> View Surplus Materials Near Job
        <ChevronRight size={14} />
      </a>
    </div>
  );
}