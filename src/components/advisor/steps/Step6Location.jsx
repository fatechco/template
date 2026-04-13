import { useState } from "react";
import { QuestionCard, PillOption } from "../AdvisorOptionCard";

const COMMUTE_TIMES = [
  { value: "15", label: "⏱️ Under 15 min" },
  { value: "30", label: "⏱️ 15–30 min" },
  { value: "45", label: "⏱️ 30–45 min" },
  { value: "60", label: "⏱️ 45–60 min" },
  { value: "60+", label: "⏱️ 60+ min is fine" },
];

const COMMUTE_METHODS = [
  { value: "car", icon: "🚗", label: "Car" },
  { value: "metro", icon: "🚇", label: "Metro" },
  { value: "bus", icon: "🚌", label: "Bus" },
  { value: "bike", icon: "🚲", label: "Bike / Walk" },
  { value: "rideshare", icon: "🚕", label: "Rideshare" },
];

const SCHOOL_TYPES = [
  "Government / Public", "Private National", "International — American",
  "International — British", "International — French", "International — German",
  "Islamic / Azhar", "University (nearby)"
];

const PROXIMITY_NEEDS = [
  { value: "hospital", icon: "🏥", label: "Hospital" },
  { value: "mosque", icon: "🕌", label: "Mosque / Church" },
  { value: "gym", icon: "🏋️", label: "Gym / Sports" },
  { value: "supermarket", icon: "🛒", label: "Supermarket / Mall" },
  { value: "family", icon: "👨‍👩‍👧", label: "Family / Relatives" },
  { value: "beach", icon: "🏖️", label: "Beach / Waterfront" },
];

const CITIES = ["New Cairo", "Maadi", "Sheikh Zayed", "6th October", "Heliopolis",
  "Zamalek", "Dokki", "Nasr City", "North Coast", "New Capital", "Ain Sokhna"];

export default function Step6Location({ answers, onChange }) {
  const {
    preferredLocationIds = [], preferredLocationsOpen = false,
    worksFromHome, maxCommuteMinutes, commuteMethod,
    householdComposition = {}, schoolTypes = [], maxSchoolCommuteMinutes,
    proximityNeeds = []
  } = answers;

  const [locSearch, setLocSearch] = useState("");
  const [workTab, setWorkTab] = useState("area");
  const isRemote = worksFromHome === "yes" || answers.workLocation?.isRemote;

  const comp = { youngChildren: 0, teenagers: 0, ...householdComposition };
  const hasKids = (comp.youngChildren || 0) + (comp.teenagers || 0) > 0;

  const filteredCities = CITIES.filter(c => c.toLowerCase().includes(locSearch.toLowerCase()));

  const toggleLocation = (loc) => {
    onChange({ preferredLocationIds: preferredLocationIds.includes(loc)
      ? preferredLocationIds.filter(l => l !== loc)
      : [...preferredLocationIds, loc] });
  };

  const toggleSchool = (s) => {
    onChange({ schoolTypes: schoolTypes.includes(s) ? schoolTypes.filter(t => t !== s) : [...schoolTypes, s] });
  };

  const toggleProximity = (v) => {
    onChange({ proximityNeeds: proximityNeeds.includes(v) ? proximityNeeds.filter(p => p !== v) : [...proximityNeeds, v] });
  };

  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 mb-1">Where should your property be?</h2>
        <p className="text-gray-500 text-sm">Help us understand your daily life so we can find the best location</p>
      </div>

      <QuestionCard number="1" question="Preferred City / Area">
        <div className="relative mb-3">
          <input value={locSearch} onChange={e => setLocSearch(e.target.value)}
            placeholder="🔍 Search city, neighborhood, district..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>
        {preferredLocationIds.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {preferredLocationIds.map(loc => (
              <span key={loc} className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                {loc}
                <button onClick={() => toggleLocation(loc)} className="ml-1 opacity-70 hover:opacity-100">×</button>
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
          {filteredCities.filter(c => !preferredLocationIds.includes(c)).map(c => (
            <button key={c} onClick={() => toggleLocation(c)} disabled={preferredLocationsOpen}
              className="px-3 py-1.5 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:border-orange-400 hover:bg-orange-50 disabled:opacity-40">
              + {c}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 mt-3 cursor-pointer">
          <input type="checkbox" checked={preferredLocationsOpen} onChange={e => onChange({ preferredLocationsOpen: e.target.checked, preferredLocationIds: [] })} className="accent-blue-500" />
          <span className="text-xs text-blue-700 font-semibold">💡 I'm open to suggestions based on my needs</span>
        </label>
      </QuestionCard>

      <QuestionCard number="2" question="Where do you work?">
        <div className="flex gap-1 mb-4">
          {[["area", "📋 Select Area"], ["remote", "🏠 I Work Remotely"]].map(([t, l]) => (
            <button key={t} onClick={() => { setWorkTab(t); if (t === "remote") onChange({ workLocation: { isRemote: true } }); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${workTab === t ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {l}
            </button>
          ))}
        </div>
        {workTab === "area" && (
          <div className="flex flex-wrap gap-2">
            {CITIES.map(c => (
              <button key={c} onClick={() => onChange({ workLocation: { areaId: c, isRemote: false } })}
                className={`px-3 py-1.5 border rounded-full text-xs font-semibold transition-all ${answers.workLocation?.areaId === c ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-600 hover:border-orange-300"}`}>
                {c}
              </button>
            ))}
          </div>
        )}
        {workTab === "remote" && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-700">
            ✅ Great! We'll skip commute calculations and focus on lifestyle priorities.
          </div>
        )}
      </QuestionCard>

      {!isRemote && workTab !== "remote" && (
        <>
          <QuestionCard number="3" question="Maximum Commute to Work?">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {COMMUTE_TIMES.map(o => (
                <button key={o.value} onClick={() => onChange({ maxCommuteMinutes: +o.value || 90 })}
                  className={`border-2 rounded-xl p-3 text-center text-xs font-bold transition-all ${maxCommuteMinutes === (+o.value || 90) ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 hover:border-orange-300"}`}>
                  {o.label}
                </button>
              ))}
            </div>
          </QuestionCard>

          <QuestionCard number="4" question="How do you commute?">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {COMMUTE_METHODS.map(o => (
                <button key={o.value} onClick={() => onChange({ commuteMethod: o.value })}
                  className={`border-2 rounded-xl p-3 text-center transition-all hover:border-orange-400 ${commuteMethod === o.value ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}>
                  <p className="text-2xl mb-1">{o.icon}</p>
                  <p className="text-xs font-bold text-gray-700">{o.label}</p>
                </button>
              ))}
            </div>
            {commuteMethod === "metro" && (
              <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
                🚇 We'll prioritize properties near metro stations
              </div>
            )}
          </QuestionCard>
        </>
      )}

      {hasKids && (
        <>
          <QuestionCard number="5" question="Children's School Type">
            <div className="grid grid-cols-1 gap-2">
              {SCHOOL_TYPES.map(s => (
                <label key={s} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${schoolTypes.includes(s) ? "border-orange-400 bg-orange-50" : "border-gray-200"}`}>
                  <input type="checkbox" checked={schoolTypes.includes(s)} onChange={() => toggleSchool(s)} className="accent-orange-500" />
                  <span className="text-sm font-semibold text-gray-700">🏫 {s}</span>
                </label>
              ))}
            </div>
          </QuestionCard>
          <QuestionCard number="6" question="Max school commute?">
            <div className="flex flex-wrap gap-2">
              {["Under 10 min", "10–20 min", "20–30 min", "Up to 45 min"].map(t => (
                <PillOption key={t} label={t} selected={maxSchoolCommuteMinutes === t} onClick={() => onChange({ maxSchoolCommuteMinutes: t })} />
              ))}
            </div>
          </QuestionCard>
        </>
      )}

      <QuestionCard number={hasKids ? "7" : "5"} question="Specific Nearby Places?" subtitle="Are there specific places you need to be close to?">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PROXIMITY_NEEDS.map(o => (
            <button key={o.value} onClick={() => toggleProximity(o.value)}
              className={`border-2 rounded-xl p-3 text-center transition-all hover:border-orange-400 ${proximityNeeds.includes(o.value) ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}>
              <p className="text-2xl mb-1">{o.icon}</p>
              <p className="text-xs font-bold text-gray-700">{o.label}</p>
            </button>
          ))}
        </div>
      </QuestionCard>
    </div>
  );
}