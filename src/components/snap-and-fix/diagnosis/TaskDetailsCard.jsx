import { useState } from "react";

const SCHEDULE_OPTIONS = [
  { key: "asap", label: "ASAP" },
  { key: "this_week", label: "This week" },
  { key: "this_month", label: "This month" },
  { key: "flexible", label: "Flexible" },
];

export default function TaskDetailsCard({ session, budget, setBudget, openToBids, setOpenToBids, location, setLocation, schedule, setSchedule }) {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-lg">📌</span>
          <span className="text-base font-black text-gray-900">Task Details</span>
        </div>
      </div>

      <div className="px-4 py-4 space-y-5">

        {/* Budget field */}
        <div>
          <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wide block mb-2">
            Your budget (optional)
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 flex-1 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <span className="px-3 py-2.5 text-[13px] font-bold text-gray-500 bg-gray-100 border-r border-gray-200 flex-shrink-0">
                EGP
              </span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                disabled={openToBids}
                placeholder="e.g. 2000"
                className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400 disabled:opacity-40"
              />
            </div>
            {/* Open to Bids toggle */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setOpenToBids(!openToBids)}
                className={`relative w-11 h-6 rounded-full transition-colors ${openToBids ? "bg-teal-500" : "bg-gray-200"}`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${openToBids ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
              <span className="text-[12px] font-semibold text-gray-600 whitespace-nowrap">Open to Bids</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5">
            Leave blank to receive bids from pros
          </p>
        </div>

        {/* Location field */}
        <div>
          <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wide block mb-2">
            Property location
          </label>
          <div className="flex items-center justify-between border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50">
            <span className="text-[14px] text-gray-700 flex-1 truncate">
              {location || "Set your location"}
            </span>
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="text-teal-600 text-[13px] font-bold hover:text-teal-700 flex-shrink-0 ml-2 transition-colors"
            >
              Change →
            </button>
          </div>
          {showLocationDropdown && (
            <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-md">
              {["Cairo", "Giza", "Alexandria", "New Cairo", "6th October", "Sharm El Sheikh"].map((city) => (
                <button
                  key={city}
                  onClick={() => { setLocation(city); setShowLocationDropdown(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 border-b border-gray-50 last:border-0 transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Schedule field */}
        <div>
          <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wide block mb-2">
            When do you need this done?
          </label>
          <div className="flex flex-wrap gap-2">
            {SCHEDULE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSchedule(opt.key)}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition-all ${
                  schedule === opt.key
                    ? "bg-teal-500 text-white border-teal-500 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-teal-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}