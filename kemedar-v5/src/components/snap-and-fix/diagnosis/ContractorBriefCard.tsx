"use client";
// @ts-nocheck
import { useState } from "react";

export default function ContractorBriefCard({ session, description, setDescription, arabicDescription, setArabicDescription, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showArabic, setShowArabic] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    onEdit?.();
  };

  const MAX = 1000;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <span className="text-base font-black text-gray-900">Contractor Brief</span>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="text-teal-600 text-[13px] font-bold hover:text-teal-700 transition-colors flex items-center gap-1"
          >
            ✏️ Edit
          </button>
        )}
        {isEditing && (
          <button
            onClick={() => setIsEditing(false)}
            className="text-teal-600 text-[13px] font-bold hover:text-teal-700 transition-colors"
          >
            ✓ Done
          </button>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        {/* English textarea */}
        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, MAX))}
            readOnly={!isEditing}
            rows={5}
            className="w-full text-[14px] text-gray-800 leading-[1.7] rounded-xl px-3.5 py-3 resize-none outline-none transition-all"
            style={{
              background: isEditing ? "#fff" : "#F8FAFC",
              border: isEditing ? "1.5px solid #14B8A6" : "1px solid #E5E7EB",
              minHeight: 120,
            }}
          />
          {isEditing && (
            <span className="absolute bottom-2 right-3 text-[11px] text-gray-400 pointer-events-none">
              {description?.length || 0}/{MAX}
            </span>
          )}
        </div>

        {/* Arabic toggle */}
        {session?.technicalDescriptionAr && (
          <button
            onClick={() => setShowArabic((v) => !v)}
            className="mt-2 flex items-center gap-1 text-[13px] text-gray-500 hover:text-teal-600 transition-colors"
          >
            <span>{showArabic ? "▲" : "▼"}</span>
            <span>{showArabic ? "Hide Arabic version" : "Show in Arabic"}</span>
          </button>
        )}

        {showArabic && session?.technicalDescriptionAr && (
          <div className="relative mt-2">
            <textarea
              dir="rtl"
              value={arabicDescription}
              onChange={(e) => setArabicDescription(e.target.value.slice(0, MAX))}
              readOnly={!isEditing}
              rows={4}
              className="w-full text-[14px] text-gray-800 leading-[1.7] rounded-xl px-3.5 py-3 resize-none outline-none transition-all"
              style={{
                background: isEditing ? "#fff" : "#F8FAFC",
                border: isEditing ? "1.5px solid #14B8A6" : "1px solid #E5E7EB",
                minHeight: 100,
              }}
            />
            {isEditing && (
              <span className="absolute bottom-2 left-3 text-[11px] text-gray-400 pointer-events-none">
                {arabicDescription?.length || 0}/{MAX}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}