"use client";
// @ts-nocheck
import { useState } from "react";
import { ExternalLink, Link as LinkIcon, X } from "lucide-react";

const TWIN_OPTIONS = [
  {
    key: "kemetour",
    icon: "🌐",
    label: "Paste KemeTour VR Link",
    desc: "Already have a VR tour from KemeTour? Paste the link below.",
    color: "#0077B6",
    bg: "#E0F2FE",
  },
  {
    key: "kemedar_twin",
    icon: "🎥",
    label: "Create with Kemedar Twin™ AI",
    desc: "Let AI generate a Digital Twin from your uploaded photos — opens in a new window.",
    color: "#7C3AED",
    bg: "#F3E8FF",
    badge: "AI-Powered",
  },
];

export default function DigitalTwinSection({ vrLink, onVrLinkChange }) {
  const [selected, setSelected] = useState(vrLink ? "kemetour" : null);

  const handleSelectOption = (key) => {
    setSelected(key === selected ? null : key);
  };

  const handleOpenTwin = () => {
    window.open("/kemedar/twin/new", "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "2px solid #E0E7FF", background: "linear-gradient(135deg, #F5F3FF 0%, #EFF6FF 100%)" }}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl flex-shrink-0">
          🏠
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-black text-gray-900 text-[15px]">Digital Twin — Virtual Tour</h4>
            <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded-full">
              Kemedar Twin™
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            Create an immersive virtual tour for remote buyers and expats. Choose your preferred method below.
          </p>
        </div>
      </div>

      {/* Option Cards */}
      <div className="px-5 pb-4 flex flex-col sm:flex-row gap-3">
        {TWIN_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => handleSelectOption(opt.key)}
            className={`flex-1 text-left p-4 rounded-xl border-2 transition-all ${
              selected === opt.key
                ? "shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
            style={{
              borderColor: selected === opt.key ? opt.color : undefined,
              background: selected === opt.key ? opt.bg : undefined,
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">{opt.icon}</span>
              <span className="font-bold text-sm text-gray-900">{opt.label}</span>
              {opt.badge && (
                <span
                  className="text-[9px] font-black px-2 py-0.5 rounded-full text-white"
                  style={{ background: opt.color }}
                >
                  {opt.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{opt.desc}</p>

            {/* Radio indicator */}
            <div className="flex items-center gap-2 mt-3">
              <div
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                style={{
                  borderColor: selected === opt.key ? opt.color : "#D1D5DB",
                }}
              >
                {selected === opt.key && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: opt.color }}
                  />
                )}
              </div>
              <span
                className="text-xs font-bold"
                style={{ color: selected === opt.key ? opt.color : "#9CA3AF" }}
              >
                {selected === opt.key ? "Selected" : "Select this option"}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Expanded content based on selection */}
      {selected === "kemetour" && (
        <div className="px-5 pb-5">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <label className="text-xs font-bold text-gray-700 mb-2 block">
              KemeTour VR Tour Link
            </label>
            <div className="relative">
              <LinkIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                placeholder="https://kemetour.kemedar.com/tour/..."
                value={vrLink || ""}
                onChange={(e) => onVrLinkChange(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#0077B6]"
              />
              {vrLink && (
                <button
                  type="button"
                  onClick={() => onVrLinkChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5">
              Paste the VR tour link generated from KemeTour system. Supports Matterport, KemeTour, or any 360° tour URL.
            </p>
            {vrLink && (
              <a
                href={vrLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-[#0077B6] hover:underline"
              >
                <ExternalLink size={12} /> Preview Tour
              </a>
            )}
          </div>
        </div>
      )}

      {selected === "kemedar_twin" && (
        <div className="px-5 pb-5">
          <div className="bg-white rounded-xl border border-purple-200 p-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-lg flex-shrink-0">
                ✨
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">
                  Kemedar Twin™ AI Virtual Tour Generator
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Upload your property photos and our AI will generate an immersive
                  3D Digital Twin virtual tour. The process opens in a new window —
                  your progress here is saved.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleOpenTwin}
                className="flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-black px-5 py-3 rounded-xl text-sm transition-all shadow-md hover:shadow-lg"
              >
                🎥 Open Kemedar Twin™ Studio
                <ExternalLink size={13} />
              </button>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                Opens in a new window
              </div>
            </div>

            {/* If they already have a VR link, show it */}
            {vrLink && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2">
                <span className="text-green-600 text-xs font-bold">✓ VR Tour linked:</span>
                <span className="text-xs text-gray-600 truncate flex-1">{vrLink}</span>
              </div>
            )}

            {/* Also allow pasting a link from Twin output */}
            <div className="mt-3">
              <label className="text-[11px] font-bold text-gray-500 mb-1 block">
                Or paste your generated tour link here:
              </label>
              <div className="relative">
                <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  placeholder="Paste Kemedar Twin™ tour URL after generation..."
                  value={vrLink || ""}
                  onChange={(e) => onVrLinkChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-3 bg-purple-50 rounded-xl p-3 border border-purple-100">
            <p className="text-[11px] font-bold text-purple-700 mb-2">How Kemedar Twin™ works:</p>
            <div className="flex flex-col gap-1.5">
              {[
                "Upload 10+ property photos from different angles",
                "AI stitches them into an immersive 3D virtual walkthrough",
                "Get a shareable tour link — paste it back here",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-purple-600">
                  <span className="w-4 h-4 rounded-full bg-purple-200 text-purple-700 font-black flex items-center justify-center flex-shrink-0 text-[9px]">
                    {i + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}