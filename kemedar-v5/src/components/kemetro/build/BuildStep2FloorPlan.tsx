"use client";
// @ts-nocheck
import { useState } from "react";
import { apiClient } from "@/lib/api-client";

export default function BuildStep2FloorPlan({ form, update }) {
  const [uploading, setUploading] = useState(false);

  const PLAN_TYPES = [
    { id: "no_plan_estimate", label: "📐 No plan — estimate by area", desc: "AI will estimate room sizes from total area" },
    { id: "upload_plan", label: "📤 Upload floor plan", desc: "AI extracts rooms from your PDF/image" },
    { id: "manual_rooms", label: "✏️ Enter rooms manually", desc: "Specify each room's dimensions yourself" },
  ];

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await /* integration Core.UploadFile TODO */ ({ file });
    update({ floorPlanUrl: file_url, floorPlanType: "upload_plan" });
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Floor Plan</h2>
        <p className="text-gray-500 text-sm">A floor plan improves BOQ accuracy. You can also proceed without one.</p>
      </div>

      <div className="space-y-3">
        {PLAN_TYPES.map(t => (
          <button key={t.id} onClick={() => update({ floorPlanType: t.id })}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${form.floorPlanType === t.id ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-teal-300"}`}>
            <p className="font-bold text-gray-900 text-sm">{t.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
          </button>
        ))}
      </div>

      {form.floorPlanType === "upload_plan" && (
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-6 text-center">
          {form.floorPlanUrl ? (
            <div>
              <p className="text-teal-600 font-bold text-sm mb-2">✅ Floor plan uploaded</p>
              <button onClick={() => update({ floorPlanUrl: null })} className="text-xs text-red-500 underline">Remove</button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <p className="text-gray-500 text-sm mb-2">{uploading ? "Uploading..." : "Click to upload PDF or image"}</p>
              <p className="text-xs text-gray-400">Supports PDF, PNG, JPG</p>
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          )}
        </div>
      )}

      {form.floorPlanType === "manual_rooms" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
          ℹ️ Manual room entry is available on the next step. Continue to proceed.
        </div>
      )}
    </div>
  );
}