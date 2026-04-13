import { useState } from "react";
import { QuestionCard, PillOption } from "../AdvisorOptionCard";

const ALL_PRIORITIES = [
  { value: "quiet", icon: "🤫", label: "Quiet & peaceful" },
  { value: "green_spaces", icon: "🌳", label: "Green spaces / Parks" },
  { value: "security", icon: "🔒", label: "Security & gated" },
  { value: "transport", icon: "🚇", label: "Near metro / transport" },
  { value: "shops", icon: "🏪", label: "Walking to shops" },
  { value: "schools", icon: "🏫", label: "Near good schools" },
  { value: "hospitals", icon: "🏥", label: "Near hospitals" },
  { value: "parking", icon: "🅿️", label: "Parking" },
  { value: "water_view", icon: "🌊", label: "Water view" },
  { value: "city_view", icon: "🏙️", label: "City / High floor" },
  { value: "community", icon: "👥", label: "Active community" },
  { value: "amenities", icon: "🏋️", label: "Building amenities" },
  { value: "pet_friendly", icon: "🐕", label: "Pet-friendly" },
  { value: "natural_light", icon: "🌅", label: "Natural light" },
  { value: "internet", icon: "📶", label: "Strong internet" },
  { value: "value", icon: "💰", label: "Lowest price / value" },
  { value: "new_construction", icon: "🏗️", label: "New construction" },
  { value: "established", icon: "🏛️", label: "Established neighborhood" },
];

const VIEW_OPTIONS = [
  { value: "water", icon: "🌊", label: "Water view" },
  { value: "garden", icon: "🌳", label: "Garden / Green" },
  { value: "city", icon: "🏙️", label: "City / Skyline" },
  { value: "street", icon: "🛣️", label: "Street view is fine" },
  { value: "courtyard", icon: "🔇", label: "Inner courtyard" },
  { value: "none", icon: "💭", label: "No preference" },
];

const FLOOR_OPTIONS = [
  { value: "ground", icon: "🌿", label: "Ground / Garden floor" },
  { value: "low_1_3", icon: "🏠", label: "Low floors (1–3)" },
  { value: "mid_4_7", icon: "🏢", label: "Mid floors (4–7)" },
  { value: "high_8plus", icon: "🏙️", label: "High floors (8+)" },
  { value: "penthouse", icon: "⬆️", label: "Penthouse" },
  { value: "no_preference", icon: "💭", label: "No preference" },
  { value: "ai_decide", icon: "🤖", label: "Let AI decide", badge: "Recommended" },
];

const NOISE_OPTIONS = [
  { value: "silent", icon: "🔇", label: "Need absolute quiet", sub: "Silence is essential" },
  { value: "quiet", icon: "🔉", label: "Prefer quiet", sub: "Some city sounds ok" },
  { value: "normal", icon: "🔊", label: "Normal city noise", sub: "Typical traffic fine" },
  { value: "lively", icon: "📢", label: "Love a lively area", sub: "Busy streets fine" },
];

const COMMUNITY_OPTIONS = [
  { value: "gated_compound", icon: "🏘️", label: "Gated compound", sub: "Shared amenities" },
  { value: "standalone", icon: "🏢", label: "Standalone building", sub: "Regular neighborhood" },
  { value: "independent_villa", icon: "🏡", label: "Independent villa", sub: "Private, own garden" },
  { value: "mixed_use", icon: "🏙️", label: "Mixed-use area", sub: "Residential + commercial" },
  { value: "no_preference", icon: "💭", label: "No preference" },
];

export default function Step7Lifestyle({ answers, onChange }) {
  const { prioritiesRanked = [], viewPreference, floorPreference, noiseTolerance, communityStyle, propertyTypes = [] } = answers;
  const showView = propertyTypes.some(t => ["apartment", "penthouse", "hotel_unit"].includes(t));

  const togglePriority = (val) => {
    if (prioritiesRanked.includes(val)) {
      onChange({ prioritiesRanked: prioritiesRanked.filter(p => p !== val) });
    } else if (prioritiesRanked.length < 5) {
      onChange({ prioritiesRanked: [...prioritiesRanked, val] });
    }
  };

  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 mb-1">What matters most in your daily life?</h2>
        <p className="text-gray-500 text-sm">Rank what's important — there are no wrong answers</p>
      </div>

      <QuestionCard number="1" question="Top 5 Priorities" subtitle="Tap to add (max 5) — order matters">
        {prioritiesRanked.length > 0 && (
          <div className="mb-4 space-y-1">
            <p className="text-xs font-bold text-orange-500 mb-2">Your Top {prioritiesRanked.length}:</p>
            {prioritiesRanked.map((val, i) => {
              const opt = ALL_PRIORITIES.find(p => p.value === val);
              return (
                <div key={val} className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
                  <span className="w-6 h-6 bg-orange-500 rounded-full text-white text-xs font-black flex items-center justify-center flex-shrink-0">#{i + 1}</span>
                  <span className="text-xl">{opt?.icon}</span>
                  <span className="text-sm font-bold text-gray-800 flex-1">{opt?.label}</span>
                  <button onClick={() => togglePriority(val)} className="text-gray-400 hover:text-red-500 text-xs">✕ remove</button>
                </div>
              );
            })}
          </div>
        )}
        {prioritiesRanked.length < 5 && (
          <div>
            <p className="text-xs text-gray-400 mb-3">{5 - prioritiesRanked.length} more to pick:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {ALL_PRIORITIES.filter(p => !prioritiesRanked.includes(p.value)).map(o => (
                <button key={o.value} onClick={() => togglePriority(o.value)}
                  className="border-2 border-gray-200 rounded-xl p-3 text-left hover:border-orange-400 hover:bg-orange-50 transition-all flex items-center gap-2">
                  <span className="text-xl">{o.icon}</span>
                  <span className="text-xs font-bold text-gray-700">{o.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {prioritiesRanked.length === 5 && (
          <p className="text-xs text-gray-400 mt-2 text-center">✅ Great! Remove one to swap.</p>
        )}
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
          #1 = 5× weight · #2 = 4× · #3 = 3× · #4 = 2× · #5 = 1× in AI scoring
        </div>
      </QuestionCard>

      {showView && (
        <QuestionCard number="2" question="View Preference">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {VIEW_OPTIONS.map(o => (
              <button key={o.value} onClick={() => onChange({ viewPreference: o.value })}
                className={`border-2 rounded-xl p-3 text-center transition-all hover:border-orange-400 ${viewPreference === o.value ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}>
                <p className="text-2xl mb-1">{o.icon}</p>
                <p className="text-xs font-bold text-gray-700">{o.label}</p>
              </button>
            ))}
          </div>
        </QuestionCard>
      )}

      <QuestionCard number={showView ? "3" : "2"} question="Floor Preference">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FLOOR_OPTIONS.map(o => (
            <button key={o.value} onClick={() => onChange({ floorPreference: o.value })}
              className={`relative border-2 rounded-xl p-3 text-center transition-all hover:border-orange-400 ${floorPreference === o.value ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}>
              {o.badge && <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap">{o.badge}</span>}
              <p className="text-2xl mb-1">{o.icon}</p>
              <p className="text-xs font-bold text-gray-700">{o.label}</p>
            </button>
          ))}
        </div>
      </QuestionCard>

      <QuestionCard number={showView ? "4" : "3"} question="Noise Tolerance">
        <div className="grid grid-cols-2 gap-3">
          {NOISE_OPTIONS.map(o => (
            <button key={o.value} onClick={() => onChange({ noiseTolerance: o.value })}
              className={`border-2 rounded-xl p-4 text-left transition-all hover:border-orange-400 ${noiseTolerance === o.value ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}>
              <p className="text-2xl mb-1">{o.icon}</p>
              <p className="font-bold text-sm text-gray-900">{o.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{o.sub}</p>
            </button>
          ))}
        </div>
      </QuestionCard>

      <QuestionCard number={showView ? "5" : "4"} question="Community Style">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {COMMUNITY_OPTIONS.map(o => (
            <button key={o.value} onClick={() => onChange({ communityStyle: o.value })}
              className={`border-2 rounded-xl p-4 text-left flex items-start gap-3 transition-all hover:border-orange-400 ${communityStyle === o.value ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}>
              <span className="text-2xl flex-shrink-0">{o.icon}</span>
              <div>
                <p className="font-bold text-sm text-gray-900">{o.label}</p>
                {o.sub && <p className="text-xs text-gray-500 mt-0.5">{o.sub}</p>}
              </div>
            </button>
          ))}
        </div>
      </QuestionCard>
    </div>
  );
}