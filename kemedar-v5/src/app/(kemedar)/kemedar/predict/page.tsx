"use client";

import { useState } from "react";
import { TrendingUp, MapPin, Home, Calculator } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function PredictPage() {
  const [form, setForm] = useState({ area: "", propertyType: "apartment", bedrooms: "2", size: "" });
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!form.area || !form.size) return;
    setLoading(true);
    try {
      const res = await apiClient.post<any>("/api/v1/ai/predict-price", form);
      setPrediction(res);
    } catch { /* handled */ } finally { setLoading(false); }
  };

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="text-center mb-8">
        <TrendingUp className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
        <h1 className="text-3xl font-bold">Price Prediction</h1>
        <p className="text-slate-500 mt-2">AI-powered property price estimation based on market data</p>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Area / Location</label>
            <input type="text" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="e.g. New Cairo, Maadi" className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Property Type</label>
            <select value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="duplex">Duplex</option>
              <option value="studio">Studio</option>
              <option value="penthouse">Penthouse</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bedrooms</label>
            <select value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
              {["1", "2", "3", "4", "5+"].map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Size (sqm)</label>
            <input type="number" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="e.g. 150" className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
        </div>
        <button onClick={handlePredict} disabled={loading} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2">
          <Calculator className="w-4 h-4" />{loading ? "Predicting..." : "Predict Price"}
        </button>
      </div>

      {prediction && (
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-sm text-slate-500 mb-1">Estimated Market Price</div>
          <div className="text-4xl font-bold text-emerald-600">{prediction.estimatedPrice?.toLocaleString() || "—"} EGP</div>
          <div className="text-sm text-slate-400 mt-2">Confidence: {prediction.confidence || "—"}%</div>
          {prediction.priceRange && (
            <div className="mt-4 text-sm text-slate-600">
              Range: {prediction.priceRange.min?.toLocaleString()} - {prediction.priceRange.max?.toLocaleString()} EGP
            </div>
          )}
        </div>
      )}
    </div>
  );
}
