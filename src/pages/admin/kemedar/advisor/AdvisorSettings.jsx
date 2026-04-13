import { useState } from "react";

function Section({ title, sub, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="mb-4">
        <h2 className="text-base font-black text-gray-900">{title}</h2>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label, sub }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <button onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full flex-shrink-0 transition-all relative ${checked ? "bg-green-500" : "bg-gray-200"}`}>
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}

function RuleCard({ rule, onUpdate }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-black text-gray-800">{rule.name}</p>
        <button onClick={() => onUpdate({ ...rule, active: !rule.active })}
          className={`px-2.5 py-1 rounded-full text-[10px] font-black ${rule.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {rule.active ? "🟢 Active" : "⚫ Paused"}
        </button>
      </div>
      <p className="text-xs text-gray-500 mb-3">{rule.desc}</p>
      <div className="flex flex-wrap gap-2">
        {[["app", "🔔 App"], ["email", "📧 Email"], ["sms", "📱 SMS"], ["whatsapp", "💬 WA"]].map(([key, label]) => (
          <button key={key} onClick={() => onUpdate({ ...rule, channels: { ...rule.channels, [key]: !rule.channels[key] } })}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${rule.channels[key] ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-400"}`}>
            {label}
          </button>
        ))}
        <button className="text-[10px] text-blue-500 font-bold ml-auto hover:underline">Edit template →</button>
      </div>
    </div>
  );
}

export default function AdvisorSettings() {
  const [weights, setWeights] = useState({ feature: 40, location: 30, budget: 20, wishlist: 10 });
  const [threshold, setThreshold] = useState(70);
  const [maxMatches, setMaxMatches] = useState(20);
  const [maxPerDay, setMaxPerDay] = useState(3);
  const [maxPerWeek, setMaxPerWeek] = useState(10);
  const [strictDeals, setStrictDeals] = useState(true);
  const [accessibilityOverride, setAccessibilityOverride] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [guestAccess, setGuestAccess] = useState(true);
  const [shareableReports, setShareableReports] = useState(true);
  const [pdfDownload, setPdfDownload] = useState(true);
  const [profileExpiry, setProfileExpiry] = useState("Never");
  const [reportExpiry, setReportExpiry] = useState("30 days");
  const [reportTrigger, setReportTrigger] = useState("auto");
  const [aiTone, setAiTone] = useState("Professional & Formal");

  const [rules, setRules] = useState([
    { id: 1, name: "Instant Alert (90%+)", desc: "Trigger on match score ≥ 90%", active: true, channels: { app: true, email: true, sms: false, whatsapp: false } },
    { id: 2, name: "Daily Digest (80–89%)", desc: "Sent at 08:00 AM, max 5 properties", active: true, channels: { app: true, email: true, sms: false, whatsapp: false } },
    { id: 3, name: "Weekly Summary (70–79%)", desc: "Sent Sundays at 09:00 AM, max 10", active: true, channels: { app: true, email: true, sms: false, whatsapp: false } },
    { id: 4, name: "Price Drop Alert", desc: "Trigger on price drop ≥ 5% on matched properties", active: true, channels: { app: true, email: true, sms: true, whatsapp: false } },
    { id: 5, name: "Monthly Market Report", desc: "1st of each month", active: false, channels: { app: true, email: true, sms: false, whatsapp: false } },
    { id: 6, name: "Profile Refresh Reminder", desc: "No update in 90 days", active: true, channels: { app: true, email: true, sms: false, whatsapp: false } },
  ]);

  const updateRule = (updated) => setRules(prev => prev.map(r => r.id === updated.id ? updated : r));

  const total = weights.feature + weights.location + weights.budget + weights.wishlist;
  const totalOk = total === 100;

  const updateWeight = (key, val) => {
    const newW = { ...weights, [key]: Math.max(0, Math.min(100, Number(val))) };
    setWeights(newW);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Kemedar Advisor Settings</h1>
          <p className="text-gray-500 text-sm">Configure the AI matching system, notifications, and survey behavior</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-2.5 rounded-xl text-sm">
          💾 Save All Settings
        </button>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm text-orange-700">
        💾 Changes apply immediately to all active profiles
      </div>

      {/* AI Matching */}
      <Section title="🤖 AI Matching Configuration">
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-black text-gray-700">Composite Score Weights</p>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${totalOk ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                Total: {total}% {totalOk ? "✅" : "⚠️"}
              </span>
            </div>
            <div className="space-y-3">
              {[["feature", "Feature Score", "Priority-weighted matching"], ["location", "Location Score", "Commute + schools + proximity"], ["budget", "Budget Score", "Price vs profile budget"], ["wishlist", "Wishlist Bonus", "Nice-to-have matching"]].map(([key, label, sub]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-xs font-semibold text-gray-700">{label}</span>
                      <span className="text-[11px] text-gray-400 ml-2">{sub}</span>
                    </div>
                    <span className="text-sm font-black text-orange-600 w-10 text-right">{weights[key]}%</span>
                  </div>
                  <input type="range" min={0} max={100} value={weights[key]}
                    onChange={e => updateWeight(key, e.target.value)}
                    className="w-full accent-orange-500" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-gray-700">Minimum Match Threshold</p>
              <span className="text-sm font-black text-orange-600">{threshold}%</span>
            </div>
            <input type="range" min={50} max={90} value={threshold} onChange={e => setThreshold(+e.target.value)} className="w-full accent-orange-500" />
            <p className="text-xs text-gray-400 mt-1">Profiles below this score will not appear in user reports</p>
          </div>

          <div>
            <p className="text-sm font-black text-gray-700 mb-3">Match Score Labels</p>
            <div className="space-y-2">
              {[["90–100%", "⭐ Best Match", "text-green-600 bg-green-50"], ["80–89%", "⭐ Great Match", "text-teal-600 bg-teal-50"], ["70–79%", "👍 Good Match", "text-blue-600 bg-blue-50"], ["60–69%", "👌 Fair Match", "text-orange-600 bg-orange-50"]].map(([range, label, cls]) => (
                <div key={range} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-500 w-14">{range}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Toggle checked={strictDeals} onChange={setStrictDeals} label="Strictly exclude deal-breaker failures" sub="ON = excluded from all results | OFF = shown with warning badge" />
            <Toggle checked={accessibilityOverride} onChange={setAccessibilityOverride} label="Auto-override floor preference for accessibility needs" sub="ON (recommended): System forces accessible options for mobility users" />
          </div>
        </div>
      </Section>

      {/* Matching Frequency */}
      <Section title="🔄 When to Run Matching">
        <div className="space-y-3">
          <p className="text-xs font-black text-gray-700 mb-2">Re-Match Triggers:</p>
          {[
            ["When new property is published — run immediately for all active profiles"],
            ["When property price drops — re-score affected profiles"],
            ["When user updates their profile — re-run for that profile"],
            ["Scheduled: Daily re-run for all (02:00 AM)"],
          ].map((item, i) => (
            <label key={i} className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-orange-500 mt-0.5" />
              <span className="text-sm text-gray-700">{item[0]}</span>
            </label>
          ))}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
            ℹ️ Running matching on all 3,247 profiles may take 5–10 minutes. We recommend daily off-peak scheduling plus immediate trigger for new property publications.
          </div>
          <div className="flex items-center gap-3 mt-2">
            <label className="text-sm font-semibold text-gray-700">Show users top</label>
            <input type="number" value={maxMatches} onChange={e => setMaxMatches(+e.target.value)} min={5} max={100}
              className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-orange-400" />
            <label className="text-sm text-gray-700">matches maximum</label>
          </div>
          <p className="text-xs text-gray-400">Showing too many matches reduces user action rates</p>
        </div>
      </Section>

      {/* Notification Rules */}
      <Section title="🔔 Notification Configuration">
        <div className="space-y-3 mb-4">
          {rules.map(r => <RuleCard key={r.id} rule={r} onUpdate={updateRule} />)}
        </div>
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <p className="text-xs font-black text-gray-700">Global Limits:</p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">Max per user per day:</span>
            <input type="number" value={maxPerDay} onChange={e => setMaxPerDay(+e.target.value)} min={1} max={10}
              className="w-14 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-orange-400" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">Max per user per week:</span>
            <input type="number" value={maxPerWeek} onChange={e => setMaxPerWeek(+e.target.value)} min={1} max={50}
              className="w-14 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-orange-400" />
          </div>
          <p className="text-xs text-gray-400">High-score matches always take priority within these limits.</p>
        </div>
      </Section>

      {/* Survey Settings */}
      <Section title="📋 Survey Configuration">
        <Toggle checked={isActive} onChange={setIsActive} label="Kemedar Advisor is Active" sub={isActive ? "Available to all users" : "Coming Soon page shown"} />
        <Toggle checked={guestAccess} onChange={setGuestAccess} label="Allow guests to start survey" sub="Guests can start, save after login" />
        <div className="pt-3 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 flex-1">Profiles expire after:</span>
            <select value={profileExpiry} onChange={e => setProfileExpiry(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
              {["Never", "90 days", "180 days", "1 year"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Available languages:</p>
            <div className="space-y-2">
              {[["en", "English", true, false], ["ar", "العربية (Arabic)", true, false], ["fr", "Français (French)", true, false], ["ru", "Русский (Russian)", false, true], ["tr", "Türkçe (Turkish)", false, true]].map(([code, label, checked, soon]) => (
                <label key={code} className={`flex items-center gap-2 cursor-pointer ${soon ? "opacity-50" : ""}`}>
                  <input type="checkbox" defaultChecked={checked} disabled={soon} className="accent-orange-500" />
                  <span className="text-sm text-gray-700">{label}</span>
                  {soon && <span className="text-[10px] text-gray-400">— coming soon</span>}
                </label>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Report Settings */}
      <Section title="📊 Report Configuration">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 flex-1">Show top matches in report:</span>
            <input type="range" min={5} max={30} defaultValue={10} className="w-32 accent-orange-500" />
            <span className="text-sm font-black text-orange-600 w-6">10</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 flex-1">Reports expire after:</span>
            <select value={reportExpiry} onChange={e => setReportExpiry(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
              {["30 days", "60 days", "90 days", "Never"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <Toggle checked={shareableReports} onChange={setShareableReports} label="Allow users to share reports" />
          <Toggle checked={pdfDownload} onChange={setPdfDownload} label="Allow PDF download" />
        </div>
      </Section>

      {/* AI / Claude */}
      <Section title="🧠 AI Configuration" sub="Claude API settings for report generation">
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-green-700">Claude API Connected</p>
              <p className="text-xs text-green-600">Model: claude-sonnet-4-20250514 · Avg response: 3.2s</p>
            </div>
            <button className="text-xs border border-green-400 text-green-700 font-bold px-3 py-1.5 rounded-lg hover:bg-green-100">Test</button>
          </div>

          <div>
            <p className="text-sm font-black text-gray-700 mb-2">Report Generation Triggers:</p>
            <div className="space-y-2">
              {[["auto", "Generate automatically on survey completion"], ["manual", "Generate manually (admin triggers)"], ["demand", "Generate on demand (user requests)"]].map(([v, l]) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="trigger" value={v} checked={reportTrigger === v} onChange={() => setReportTrigger(v)} className="accent-orange-500" />
                  <span className="text-sm text-gray-700">{l}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 flex-1">Default report tone:</span>
            <select value={aiTone} onChange={e => setAiTone(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
              {["Professional & Formal", "Friendly & Casual", "Investment-focused", "Luxury"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-black text-gray-700">System Prompt Editor</p>
              <span className="text-[10px] bg-red-100 text-red-600 font-black px-2 py-0.5 rounded-full">⚠️ Super Admin Only</span>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700 mb-3">
              ⚠️ Changes affect all new reports generated. Test before saving.
            </div>
            <textarea rows={6}
              defaultValue={`You are a professional real estate advisor assistant for Kemedar, Egypt's premier property platform. Generate a detailed, personalized property matching report in {language} based on the user's survey answers. Focus on practical insights, local market knowledge, and clear recommendations.`}
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-xs font-mono focus:outline-none focus:border-orange-400 resize-none bg-gray-50" />
            <div className="flex gap-2 mt-2">
              <button className="border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-lg text-xs hover:bg-gray-50">Reset to Default</button>
              <button className="bg-gray-800 text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-gray-700">Save Prompt</button>
            </div>
          </div>
        </div>
      </Section>

      {/* Access Control */}
      <Section title="🔐 Who Can Use Advisor">
        <div className="space-y-3">
          <p className="text-sm font-black text-gray-700 mb-2">Available to:</p>
          {[["All users (guest + registered)", true], ["Registered users only", false], ["Specific roles only", false]].map(([l, c]) => (
            <label key={l} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="avail" defaultChecked={c} className="accent-orange-500" />
              <span className="text-sm text-gray-700">{l}</span>
            </label>
          ))}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-black text-gray-700 mb-2">Admin access:</p>
            {[["Super Admin: Full access", true], ["Admin: View + manual send", true], ["Sales Rep: View profiles only", false]].map(([l, c]) => (
              <label key={l} className="flex items-center gap-2 cursor-pointer py-1">
                <input type="checkbox" defaultChecked={c} className="accent-orange-500" />
                <span className="text-sm text-gray-700">{l}</span>
              </label>
            ))}
          </div>
        </div>
      </Section>

      {/* Sticky Save */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20 px-6 py-3 flex items-center justify-between">
        <p className="text-xs text-gray-400">Last saved: 2026-04-03 09:14 by admin@kemedar.com</p>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-2.5 rounded-xl text-sm">
          💾 Save All Advisor Settings
        </button>
      </div>
    </div>
  );
}