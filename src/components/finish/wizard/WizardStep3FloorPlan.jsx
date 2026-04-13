import { useState } from "react";
import { Upload, X } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function WizardStep3FloorPlan({ form, update }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      update({ floorPlanUrl: file_url, floorPlanMethod: "upload" });
    } catch {
      update({ floorPlanUrl: URL.createObjectURL(file), floorPlanMethod: "upload" });
    } finally {
      setUploading(false);
    }
  };

  const method = form.floorPlanMethod || "estimate";

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-1">Help AI understand your space</h2>
      <p className="text-gray-500 text-sm mb-6">The more detail you provide, the more accurate your BOQ</p>

      {/* Option A: Upload */}
      <div
        onClick={() => update({ floorPlanMethod: "upload" })}
        className={`bg-white rounded-2xl border-2 p-5 mb-4 cursor-pointer transition-all ${method === "upload" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-200"}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">📐</span>
          <div>
            <p className="font-black text-gray-900 text-sm">Upload Floor Plan</p>
            <p className="text-xs text-gray-500">Best accuracy — AI extracts room dimensions</p>
          </div>
          {method === "upload" && <div className="ml-auto w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
        </div>

        {method === "upload" && (
          <div>
            {form.floorPlanUrl ? (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                <span className="text-green-600 text-xl">✅</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-green-800">Floor plan uploaded</p>
                  <p className="text-xs text-green-600">AI will analyze dimensions automatically</p>
                </div>
                <button onClick={e => { e.stopPropagation(); update({ floorPlanUrl: "" }); }} className="text-red-400 hover:text-red-600">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-orange-300 rounded-xl bg-white cursor-pointer hover:bg-orange-50 transition-all" onClick={e => e.stopPropagation()}>
                {uploading ? <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /> : (
                  <>
                    <Upload size={22} className="text-orange-400 mb-1" />
                    <p className="text-sm font-bold text-gray-600">Click to upload floor plan</p>
                    <p className="text-xs text-gray-400">PDF, JPG, PNG accepted</p>
                  </>
                )}
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => handleUpload(e.target.files?.[0])} />
              </label>
            )}
            <p className="text-xs text-green-700 mt-2">✅ AI will use this for accurate measurements</p>
          </div>
        )}
      </div>

      {/* Option B: Enter manually */}
      <div
        onClick={() => update({ floorPlanMethod: "manual" })}
        className={`bg-white rounded-2xl border-2 p-5 mb-4 cursor-pointer transition-all ${method === "manual" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-200"}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">📏</span>
          <div>
            <p className="font-black text-gray-900 text-sm">Enter Room Sizes</p>
            <p className="text-xs text-gray-500">Input dimensions for each room manually</p>
          </div>
          {method === "manual" && <div className="ml-auto w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
        </div>
        {method === "manual" && (
          <p className="text-xs text-gray-500 bg-white rounded-xl p-3">You can enter exact room dimensions after project creation in the BOQ section. AI will use your total area for now.</p>
        )}
      </div>

      {/* Option C: AI Estimate */}
      <div
        onClick={() => update({ floorPlanMethod: "estimate" })}
        className={`bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all ${method === "estimate" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-200"}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🤖</span>
          <div>
            <p className="font-black text-gray-900 text-sm">AI Estimate</p>
            <p className="text-xs text-gray-500">Based on property type and area — fast & easy</p>
          </div>
          {method === "estimate" && <div className="ml-auto w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
        </div>
        {method === "estimate" && (
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
            <p className="text-xs font-bold text-purple-800 mb-2">📊 AI estimated room breakdown ({form.totalAreaSqm}m²):</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-purple-700">
              <span>Living/Dining: {Math.round(form.totalAreaSqm * 0.22)}m²</span>
              <span>Bedrooms: {Math.round(form.totalAreaSqm * 0.38)}m²</span>
              <span>Kitchen: {Math.round(form.totalAreaSqm * 0.12)}m²</span>
              <span>Bathrooms: {Math.round(form.totalAreaSqm * 0.10)}m²</span>
              <span>Other areas: {Math.round(form.totalAreaSqm * 0.18)}m²</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}