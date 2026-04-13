import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const FX_RATES = { AED: 14.3, SAR: 13.9, QAR: 14.4, KWD: 171.0, USD: 52.5, GBP: 66.0, EUR: 57.0 };
const COUNTRIES = [
  { code: "AE", name: "UAE", currency: "AED", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", currency: "SAR", flag: "🇸🇦" },
  { code: "GB", name: "UK", currency: "GBP", flag: "🇬🇧" },
  { code: "US", name: "USA", currency: "USD", flag: "🇺🇸" },
  { code: "QA", name: "Qatar", currency: "QAR", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", currency: "KWD", flag: "🇰🇼" },
  { code: "DE", name: "Germany", currency: "EUR", flag: "🇩🇪" },
  { code: "OTHER", name: "Other", currency: "USD", flag: "🌍" },
];
const GOALS = [
  { id: "rental_income", icon: "💰", label: "Monthly rental income", desc: "Tenant managed by FO, rent sent abroad" },
  { id: "capital_gain", icon: "📈", label: "Capital appreciation", desc: "Buy, hold, sell at higher price" },
  { id: "family_home", icon: "🏠", label: "Family home for return", desc: "Property ready when I move back" },
  { id: "portfolio", icon: "🏦", label: "Investment portfolio", desc: "Multiple properties for diversification" },
];
const AREAS = [
  { id: "new_cairo", label: "New Cairo / 5th Settlement", yield: "6.8%" },
  { id: "sheikh_zayed", label: "Sheikh Zayed / 6th October", yield: "7.2%" },
  { id: "maadi", label: "Maadi / Degla", yield: "5.9%" },
  { id: "new_admin_capital", label: "New Administrative Capital", yield: "8.1%" },
  { id: "north_coast", label: "North Coast / Sahel", yield: "9.1%" },
  { id: "flexible", label: "Flexible — Let AI decide", yield: "" },
];
const STEPS = ["Where are you?", "Your goals", "Your budget", "Area preference", "Review"];

const fmt = n => new Intl.NumberFormat("en").format(Math.round(n));

export default function ExpatSetupMobile() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [matched, setMatched] = useState(null);
  const [form, setForm] = useState({
    currentCountry: "", currentCity: "", primaryCurrency: "AED",
    goals: [], budgetInPrimaryCurrency: 500000,
    requiresPropertyManagement: true, requiresLegalSupport: true,
    preferredAreas: [], communicationPreference: "whatsapp", urgency: "within_year",
  });

  const update = d => setForm(p => ({ ...p, ...d }));
  const rate = FX_RATES[form.primaryCurrency] || 14.3;
  const budgetEGP = form.budgetInPrimaryCurrency * rate;

  const toggleGoal = id => update({ goals: form.goals.includes(id) ? form.goals.filter(g => g !== id) : [...form.goals, id] });
  const toggleArea = id => update({ preferredAreas: form.preferredAreas.includes(id) ? form.preferredAreas.filter(a => a !== id) : [...form.preferredAreas, id] });

  const canContinue = [
    form.currentCountry && form.currentCity,
    form.goals.length > 0,
    form.budgetInPrimaryCurrency >= 10000,
    form.preferredAreas.length > 0,
    true,
  ][step];

  const handleSubmit = async () => {
    setSaving(true);
    const user = await base44.auth.me().catch(() => null);
    const profileData = {
      userId: user?.id || "guest", currentCountry: form.currentCountry,
      currentCity: form.currentCity, primaryCurrency: form.primaryCurrency,
      budgetInPrimaryCurrency: form.budgetInPrimaryCurrency, budgetInEGP: budgetEGP,
      investmentGoals: form.goals, preferredAreas: form.preferredAreas,
      requiresPropertyManagement: form.requiresPropertyManagement,
      requiresLegalSupport: form.requiresLegalSupport,
      communicationPreference: form.communicationPreference, urgency: form.urgency,
    };
    await base44.entities.ExpatProfile.create(profileData);
    const res = await base44.functions.invoke("matchExpatToFO", { profile: profileData }).catch(() => ({ data: null }));
    setMatched(res?.data?.fo || { name: "Ahmed Hassan", area: "New Cairo & 5th Settlement" });
    setSaving(false);
    setStep(5);
  };

  if (step === 5) return (
    <div className="min-h-screen bg-white pb-28">
      <div className="bg-gradient-to-br from-[#0d1b3e] to-[#1a2f5e] px-5 pt-14 pb-10 text-white text-center">
        <div className="text-6xl mb-3">🎉</div>
        <h2 className="text-2xl font-black mb-2">You're Matched!</h2>
        <p className="text-blue-200 text-sm">Your Franchise Owner is ready to help</p>
      </div>
      <div className="px-4 py-6 space-y-4">
        <div className="bg-gradient-to-br from-[#0d1b3e] to-[#1a2f5e] rounded-2xl p-5 text-white">
          <p className="text-blue-300 text-xs uppercase tracking-widest mb-3">🤝 Your Assigned Franchise Owner</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-orange-400 rounded-2xl flex items-center justify-center font-black text-white text-xl flex-shrink-0">
              {matched?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="font-black text-lg">{matched?.name || "Ahmed Hassan"}</p>
              <p className="text-blue-200 text-sm">📍 {matched?.area || "New Cairo & 5th Settlement"}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-green-300 text-xs">Available & ready</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[["4.9★", "Rating"], ["62", "Deals"], ["6yr", "Experience"]].map(([val, label]) => (
              <div key={label} className="bg-white/10 rounded-xl py-2">
                <p className="font-black text-white text-sm">{val}</p>
                <p className="text-blue-300 text-[10px]">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => navigate("/m/kemedar/expat/dashboard")} className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl text-base">
          Go to My Expat Dashboard →
        </button>
        <button onClick={() => navigate("/m/find/property")} className="w-full border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-2xl">
          Browse Properties
        </button>
      </div>
      <MobileBottomNav />
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-safe pt-4 pb-4 flex items-center gap-3" style={{ paddingTop: "max(16px, env(safe-area-inset-top))" }}>
        <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)}
          className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <div className="flex-1">
          <p className="font-black text-gray-900 text-sm">🌍 Expat Profile Setup</p>
          <p className="text-xs text-gray-400">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
        </div>
        <span className="text-xs text-gray-400">{step + 1}/{STEPS.length}</span>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 px-4 py-2">
        {STEPS.map((_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i <= step ? "bg-orange-500" : "bg-gray-200"}`} />
        ))}
      </div>

      <div className="px-4 py-6">
        {/* Step 0 — Location */}
        {step === 0 && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-1">Where are you living? 📍</h2>
            <p className="text-gray-500 text-sm mb-5">We'll detect your currency and find your FO</p>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {COUNTRIES.map(c => (
                <button key={c.code} onClick={() => update({ currentCountry: c.code, primaryCurrency: c.currency })}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${form.currentCountry === c.code ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}>
                  <span className="text-2xl">{c.flag}</span>
                  <span className="text-[10px] font-bold text-gray-700 text-center leading-tight">{c.name}</span>
                </button>
              ))}
            </div>
            {form.currentCountry && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your city</label>
                <input value={form.currentCity} onChange={e => update({ currentCity: e.target.value })}
                  placeholder="e.g. Dubai, London..."
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400" />
              </div>
            )}
          </div>
        )}

        {/* Step 1 — Goals */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-1">What's your goal? 🎯</h2>
            <p className="text-gray-500 text-sm mb-5">Select all that apply</p>
            <div className="space-y-3">
              {GOALS.map(g => (
                <button key={g.id} onClick={() => toggleGoal(g.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${form.goals.includes(g.id) ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}>
                  <span className="text-2xl">{g.icon}</span>
                  <div className="flex-1">
                    <p className="font-black text-gray-900 text-sm">{g.label}</p>
                    <p className="text-xs text-gray-500">{g.desc}</p>
                  </div>
                  {form.goals.includes(g.id) && <Check size={16} className="text-orange-500 flex-shrink-0" />}
                </button>
              ))}
            </div>
            <div className="mt-5">
              <label className="block text-sm font-bold text-gray-700 mb-2">Urgency</label>
              <div className="flex flex-wrap gap-2">
                {[["immediate", "🔥 Now"], ["within_year", "📅 1 Year"], ["planning", "🗓️ Planning"], ["exploring", "🔍 Exploring"]].map(([val, label]) => (
                  <button key={val} onClick={() => update({ urgency: val })}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${form.urgency === val ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Budget */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-1">Your budget? 💰</h2>
            <p className="text-gray-500 text-sm mb-5">In {form.primaryCurrency}</p>
            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 mb-5">
              <p className="text-2xl font-black text-orange-600 text-center mb-3">{fmt(form.budgetInPrimaryCurrency)} {form.primaryCurrency}</p>
              <input type="range" min={50000} max={3000000} step={25000}
                value={form.budgetInPrimaryCurrency} onChange={e => update({ budgetInPrimaryCurrency: Number(e.target.value) })}
                className="w-full accent-orange-500 mb-3" />
              <div className="bg-white rounded-xl px-3 py-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">In Egypt</span>
                <span className="font-black text-gray-900">{fmt(budgetEGP)} EGP</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[100000, 300000, 500000, 1000000, 2000000, 3000000].map(v => (
                <button key={v} onClick={() => update({ budgetInPrimaryCurrency: v })}
                  className={`py-2 text-xs font-bold rounded-xl border-2 transition-all ${form.budgetInPrimaryCurrency === v ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600"}`}>
                  {fmt(v)}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-white border-2 border-gray-200 rounded-xl">
                <input type="checkbox" checked={form.requiresPropertyManagement} onChange={e => update({ requiresPropertyManagement: e.target.checked })} className="w-5 h-5 accent-orange-500" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">🏠 I need property management</p>
                  <p className="text-xs text-gray-400">FO finds tenants & collects rent</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-white border-2 border-gray-200 rounded-xl">
                <input type="checkbox" checked={form.requiresLegalSupport} onChange={e => update({ requiresLegalSupport: e.target.checked })} className="w-5 h-5 accent-orange-500" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">⚖️ I need legal support</p>
                  <p className="text-xs text-gray-400">POA, contracts, remote purchase</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 3 — Areas */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-1">Where in Egypt? 📍</h2>
            <p className="text-gray-500 text-sm mb-5">Select preferred areas</p>
            <div className="space-y-3">
              {AREAS.map(a => (
                <button key={a.id} onClick={() => toggleArea(a.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${form.preferredAreas.includes(a.id) ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}>
                  <div className="flex-1">
                    <p className="font-black text-gray-900 text-sm">{a.label}</p>
                    {a.yield && <span className="text-xs text-green-600 font-bold">{a.yield} yield</span>}
                  </div>
                  {form.preferredAreas.includes(a.id) && <Check size={16} className="text-orange-500 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 — Review */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-1">Ready to match! 🤝</h2>
            <p className="text-gray-500 text-sm mb-5">Review your profile</p>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 space-y-3 mb-5">
              {[
                { label: "📍 Location", val: `${form.currentCity}, ${COUNTRIES.find(c => c.code === form.currentCountry)?.name || ""}` },
                { label: "💱 Currency", val: form.primaryCurrency },
                { label: "🎯 Goals", val: form.goals.map(g => GOALS.find(x => x.id === g)?.label).join(", ") },
                { label: "💰 Budget", val: `${fmt(form.budgetInPrimaryCurrency)} ${form.primaryCurrency} ≈ ${fmt(budgetEGP)} EGP` },
                { label: "📍 Areas", val: form.preferredAreas.map(a => AREAS.find(x => x.id === a)?.label?.split(" /")[0]).join(", ") },
              ].map(row => (
                <div key={row.label} className="flex items-start gap-2 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <span className="text-xs text-gray-400 w-28 flex-shrink-0">{row.label}</span>
                  <span className="text-xs font-bold text-gray-900 flex-1">{row.val || "—"}</span>
                </div>
              ))}
            </div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Preferred contact</label>
            <div className="grid grid-cols-2 gap-2">
              {[["whatsapp", "💬 WhatsApp"], ["email", "📧 Email"], ["phone", "📞 Phone"], ["video_call", "📹 Video"]].map(([val, label]) => (
                <button key={val} onClick={() => update({ communicationPreference: val })}
                  className={`py-2.5 text-xs font-bold rounded-xl border-2 transition-all ${form.communicationPreference === val ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
        <button
          onClick={() => step === 4 ? handleSubmit() : setStep(s => s + 1)}
          disabled={!canContinue || saving}
          className="w-full bg-orange-500 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50">
          {saving ? <><Loader2 size={16} className="animate-spin" />Matching you...</> : step === 4 ? "🤝 Find My FO" : "Continue →"}
        </button>
      </div>

      <MobileBottomNav />
    </div>
  );
}