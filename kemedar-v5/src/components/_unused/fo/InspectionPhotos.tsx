"use client";
// @ts-nocheck
import { useState, useRef } from "react";
import { Camera, RotateCcw, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const PHOTO_ITEMS = [
  { key: "exterior", label: "Building Exterior (front view)" },
  { key: "entrance", label: "Building Entrance / Lobby" },
  { key: "living", label: "Living Room" },
  { key: "bedroom", label: "Master Bedroom" },
  { key: "kitchen", label: "Kitchen" },
  { key: "bathroom", label: "Bathroom" },
  { key: "window", label: "View from Window" },
  { key: "street", label: "Street View (from outside)" },
];

export default function InspectionPhotos({ photos, onChange, onNext }) {
  const [uploading, setUploading] = useState({});
  const fileInputs = useRef({});

  const captured = Object.keys(photos).length;
  const allDone = captured >= PHOTO_ITEMS.length;

  const handleCapture = async (key, file) => {
    if (!file) return;
    setUploading(p => ({ ...p, [key]: true }));
    const { file_url } = await /* integration Core.UploadFile TODO */ ({ file }).catch(() => ({ file_url: URL.createObjectURL(file) }));
    onChange(prev => ({ ...prev, [key]: file_url }));
    setUploading(p => ({ ...p, [key]: false }));
  };

  return (
    <div className="px-4 py-6">
      <div className="text-center mb-6">
        <p className="text-2xl mb-1">📸</p>
        <h2 className="text-xl font-black text-gray-900">Required Photos</h2>
        <p className="text-sm text-gray-500 mt-1">Tap each item to capture</p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-2 bg-orange-500 rounded-full transition-all" style={{ width: `${(captured / PHOTO_ITEMS.length) * 100}%` }} />
          </div>
          <span className="text-sm font-black text-gray-700 whitespace-nowrap">{captured} of {PHOTO_ITEMS.length}</span>
        </div>
      </div>

      <div className="space-y-2 mb-8">
        {PHOTO_ITEMS.map(item => {
          const captured = !!photos[item.key];
          const loading = uploading[item.key];
          return (
            <label key={item.key} className={`flex items-center gap-4 w-full h-16 rounded-xl px-4 cursor-pointer transition-all border-2 ${
              captured ? "border-green-400 bg-green-50" : "border-gray-200 bg-white hover:border-orange-300"
            }`}>
              <div className="flex-shrink-0 w-10 h-10">
                {loading ? (
                  <div className="w-10 h-10 rounded-lg border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                ) : captured ? (
                  <div className="relative w-10 h-10">
                    <img src={photos[item.key]} alt={item.label} className="w-10 h-10 rounded-lg object-cover" />
                    <CheckCircle2 size={16} className="absolute -top-1 -right-1 text-green-500 bg-white rounded-full" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Camera size={18} className="text-gray-400" />
                  </div>
                )}
              </div>
              <span className={`flex-1 text-sm font-semibold ${captured ? "text-green-700" : "text-gray-700"}`}>{item.label}</span>
              {captured && (
                <button onClick={e => { e.preventDefault(); fileInputs.current[item.key]?.click(); }}
                  className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-orange-500">
                  <RotateCcw size={10} /> Retake
                </button>
              )}
              <input
                ref={el => fileInputs.current[item.key] = el}
                type="file" accept="image/*" capture="environment"
                className="hidden"
                onChange={e => handleCapture(item.key, e.target.files?.[0])}
              />
            </label>
          );
        })}
      </div>

      <button onClick={onNext} disabled={!allDone}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-4 rounded-2xl text-base transition-colors">
        {allDone ? "Continue to Checklist →" : `Capture ${PHOTO_ITEMS.length - captured} more photo${PHOTO_ITEMS.length - captured > 1 ? "s" : ""}`}
      </button>
    </div>
  );
}