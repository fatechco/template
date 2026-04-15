"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const GRADE_CONFIG = {
  strong_buy: { label: "⭐ Strong Buy", color: "bg-green-600 text-white" },
  buy_now:    { label: "✅ Buy Now",    color: "bg-green-500 text-white" },
  hold:       { label: "⏸ Hold",       color: "bg-amber-500 text-white" },
  wait:       { label: "⌛ Wait",       color: "bg-orange-500 text-white" },
  avoid:      { label: "⚠️ Avoid",      color: "bg-red-600 text-white" },
};

function ForecastCard({ months, data }) {
  if (!data) return null;
  const pct = data.changePercent ?? data.change_percent ?? 0;
  const isUp = pct >= 0;
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
      <p className="text-[10px] text-gray-400 font-bold mb-1">{months} Months</p>
      <div className={`flex items-center justify-center gap-1 text-lg font-black ${isUp ? "text-green-600" : "text-red-600"}`}>
        {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        {isUp ? "+" : ""}{Number(pct).toFixed(1)}%
      </div>
    </div>
  );
}

export default function PropertyPredictSection({ property }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!property?.city_id) { setLoading(false); return; }

    const query = { cityId: property.city_id, isPublished: true };
    apiClient.list("/api/v1/priceprediction", query, "-generatedAt", 1)
      .then(data => { if (data?.[0]) setPrediction(data[0]); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [property?.city_id]);

  if (loading) return null;

  // No prediction available — show placeholder
  if (!prediction) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1 h-5 bg-indigo-600 rounded-full" />
          <h3 className="font-black text-gray-900 text-base">🧠 ThinkDar™ Market Forecast</h3>
          <span className="text-[9px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full ml-auto">Powered by ThinkDar™</span>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-3xl mb-2">📊</p>
          <p className="font-bold text-gray-700 text-sm">Market forecast not yet available for this area.</p>
          <p className="text-xs text-gray-400 mt-1 mb-3">Check back soon — we're expanding our coverage.</p>
          <Link href="/kemedar/predict" className="inline-flex items-center gap-1 text-indigo-600 text-sm font-bold hover:underline">
            Request Area Forecast <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const grade = GRADE_CONFIG[prediction.investmentGrade] || GRADE_CONFIG.hold;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-5 bg-indigo-600 rounded-full" />
        <h3 className="font-black text-gray-900 text-base">🧠 ThinkDar™ Market Forecast</h3>
        <span className="text-[9px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full ml-auto">Powered by ThinkDar™</span>
      </div>

      {/* Location + Grade */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{prediction.locationLabel || "Market Area"}</p>
        <span className={`text-xs font-black px-3 py-1 rounded-full ${grade.color}`}>{grade.label}</span>
      </div>

      {/* 4 forecast cards (2×2) */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <ForecastCard months={6} data={prediction.prediction6Months} />
        <ForecastCard months={12} data={prediction.prediction12Months} />
        <ForecastCard months={24} data={prediction.prediction24Months} />
        <ForecastCard months={36} data={prediction.prediction36Months} />
      </div>

      {/* AI Summary */}
      {prediction.aiSummary && (
        <p className="text-xs text-gray-500 leading-relaxed mb-4 bg-indigo-50 rounded-lg p-3">
          {prediction.aiSummary}
        </p>
      )}

      {/* CTA */}
      <Link href="/kemedar/predict"
        className="flex items-center justify-center gap-2 w-full text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50 font-bold text-sm py-2.5 rounded-xl transition-colors">
        View Full Predict™ Analysis <ArrowRight size={14} />
      </Link>
    </div>
  );
}