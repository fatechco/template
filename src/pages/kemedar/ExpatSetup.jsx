import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";

const FX_RATES = { AED: 14.3, SAR: 13.9, QAR: 14.4, KWD: 171.0, USD: 52.5, GBP: 66.0, EUR: 57.0 };
const FX_FLAGS = { AED: "🇦🇪", SAR: "🇸🇦", QAR: "🇶🇦", KWD: "🇰🇼", USD: "🇺🇸", GBP: "🇬🇧", EUR: "🇪🇺" };

const COUNTRIES = [
  { code: "AE", name: "UAE", currency: "AED", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", currency: "SAR", flag: "🇸🇦" },
  { code: "GB", name: "United Kingdom", currency: "GBP", flag: "🇬🇧" },
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
  { id: "new_cairo", label: "New Cairo / 5th Settlement", yield: "6.8%", trend: "🔥 High demand" },
  { id: "sheikh_zayed", label: "Sheikh Zayed / 6th October", yield: "7.2%", trend: "📈 High growth" },
  { id: "maadi", label: "Maadi / Degla", yield: "5.9%", trend: "🏛️ Stable expat area" },
  { id: "new_admin_capital", label: "New Administrative Capital", yield: "8.1%", trend: "🚀 Emerging" },
  { id: "north_coast", label: "North Coast / Sahel", yield: "9.1%", trend: "☀️ Top seasonal returns" },
  { id: "flexible", label: "Flexible / AI recommend", yield: "", trend: "🤖 Let AI decide" },
];

const STEPS = ["Where are you?", "Your goals", "Your budget", "Area preference", "Match me"];

export default function ExpatSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [matched, setMatched] = useState(null);
  const [form, setForm] = useState({
    currentCountry: "",
    currentCity: "",
    primaryCurrency: "AED",
    goals: [],
    budgetInPrimaryCurrency: 500000,
    requiresPropertyManagement: true,
    requiresLegalSupport: true,
    preferredAreas: [],
    communicationPreference: "whatsapp",
    urgency: "within_year",
  });

  const update = d => setForm(p => ({ ...p, ...d }));
  const countryConfig = COUNTRIES.find(c => c.code === form.currentCountry) || COUNTRIES[0];
  const rate = FX_RATES[form.primaryCurrency] || 14.3;
  const budgetEGP = form.budgetInPrimaryCurrency * rate;
  const fmt = n => new Intl.NumberFormat("en").format(Math.round(n));

  const handleSubmit = async () => {
    setSaving(true);
    const user = await base44.auth.me().catch(() => null);
    const profileData = {
      userId: user?.id || "guest",
      currentCountry: form.currentCountry,
      currentCity: form.currentCity,
      primaryCurrency: form.primaryCurrency,
      budgetInPrimaryCurrency: form.budgetInPrimaryCurrency,
      budgetInEGP: budgetEGP,
      investmentGoals: form.goals,
      preferredAreas: form.preferredAreas,
      requiresPropertyManagement: form.requiresPropertyManagement,
      requiresLegalSupport: form.requiresLegalSupport,
      communicationPreference: form.communicationPreference,
      urgency: form.urgency,
      profileCompleteness: 70,
    };
    await base44.entities.ExpatProfile.create(profileData);
    // Attempt FO match
    const matchResult = await base44.functions.invoke("matchExpatToFO", { profile: profileData }).catch(() => ({ data: null }));
    setMatched(matchResult?.data?.fo || { name: "Ahmed Hassan", area: "New Cairo & 5th Settlement" });
    setSaving(false);
    setStep(5);
  };

  const canContinue = [
    form.currentCountry && form.currentCity,
    form.goals.length > 0,
    form.budgetInPrimaryCurrency >= 10000,
    form.preferredAreas.length > 0,
    true,
  ][step];

  const toggleGoal = id => update({ goals: form.goals.includes(id) ? form.goals.filter(g => g !== id) : [...form.goals, id] });
  const toggleArea = id => update({ preferredAreas: form.preferredAreas.includes(id) ? form.preferredAreas.filter(a => a !== id) : [...form.preferredAreas, id] });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="max-w-2xl mx-auto px-4 py-10 w-full flex-1">

        {/* Progress bar */}
        {step < 5 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-gray-700">🌍 Expat Profile Setup</p>
              <p className="text-xs text-gray-400">Step {step + 1} of {STEPS.length}</p>
            </div>
            <div className="flex gap-1">
              {STEPS.map((s, i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i <= step ? "bg-orange-500" : "bg-gray-200"}`} />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">{STEPS[step]}</p>
          </div>
        )}

        {/* STEP 0: Location */}
        {step === 0 && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">Where are you living? 📍</h2>
            <p className="text-gray-500 mb-6">We'll detect your currency and find the best FO for your time zone</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {COUNTRIES.map(c => (
                <button key={c.code} onClick={() => update({ currentCountry: c.code, primaryCurrency: c.currency })}
                  className={`flex flex-col items-center gap-1 p-4 rounded-2xl border-2 transition-all ${form.currentCountry === c.code ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                  <span className="text-3xl">{c.flag}</span>
                  <span className="text-xs font-bold text-gray-800">{c.name}</span>
                  <span className="text-[10px] text-gray-400">{c.currency}</span>
                </button>
              ))}
            </div>
            {form.currentCountry && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your city</label>
                <input value={form.currentCity} onChange={e => update({ currentCity: e.target.value })}
                  placeholder={`e.g. Dubai, Riyadh, London...`}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 font-semibold" />
              </div>
            )}
          </div>
        )}

        {/* STEP 1: Goals */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">What's your investment goal? 🎯</h2>
            <p className="text-gray-500 mb-6">Select all that apply</p>
            <div className="space-y-3">
              {GOALS.map(g => (
                <button key={g.id} onClick={() => toggleGoal(g.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${form.goals.includes(g.id) ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                  <span className="text-3xl">{g.icon}</span>
                  <div>
                    <p className="font-black text-gray-900">{g.label}</p>
                    <p className="text-xs text-gray-500">{g.desc}</p>
                  </div>
                  {form.goals.includes(g.id) && <span className="ml-auto text-orange-500 text-xl">✓</span>}
                </button>
              ))}
            </div>
            <div className="mt-5">
              <label className="block text-sm font-bold text-gray-700 mb-2">Urgency</label>
              <div className="flex gap-2 flex-wrap">
                {[["immediate", "🔥 Ready to buy now"], ["within_year", "📅 Within a year"], ["planning", "🗓️ Just planning"], ["exploring", "🔍 Just exploring"]].map(([val, label]) => (
                  <button key={val} onClick={() => update({ urgency: val })}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${form.urgency === val ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Budget */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">What's your budget? 💰</h2>
            <p className="text-gray-500 mb-6">We'll show properties priced in {FX_FLAGS[form.primaryCurrency]} {form.primaryCurrency}</p>

            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-700">Budget in {FX_FLAGS[form.primaryCurrency]} {form.primaryCurrency}</span>
                <span className="text-2xl font-black text-orange-600">{fmt(form.budgetInPrimaryCurrency)} {form.primaryCurrency}</span>
              </div>
              <input type="range" min={50000} max={3000000} step={25000}
                value={form.budgetInPrimaryCurrency} onChange={e => update({ budgetInPrimaryCurrency: Number(e.target.value) })}
                className="w-full accent-orange-500 mb-3" />
              <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">= in Egypt</span>
                <span className="text-xl font-black text-gray-900">{fmt(budgetEGP)} EGP</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[100000, 300000, 500000, 1000000, 2000000].map(v => (
                <button key={v} onClick={() => update({ budgetInPrimaryCurrency: v })}
                  className={`py-2 text-sm font-bold rounded-xl border-2 transition-all ${form.budgetInPrimaryCurrency === v ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                  {FX_FLAGS[form.primaryCurrency]} {fmt(v)} {form.primaryCurrency}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-300 transition-colors">
                <input type="checkbox" checked={form.requiresPropertyManagement} onChange={e => update({ requiresPropertyManagement: e.target.checked })} className="w-5 h-5 accent-orange-500" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">🏠 I need property management</p>
                  <p className="text-xs text-gray-400">FO finds tenants, collects rent, handles maintenance</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-orange-300 transition-colors">
                <input type="checkbox" checked={form.requiresLegalSupport} onChange={e => update({ requiresLegalSupport: e.target.checked })} className="w-5 h-5 accent-orange-500" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">⚖️ I need legal support (POA, contracts)</p>
                  <p className="text-xs text-gray-400">Remote purchase support — no Egypt visit needed</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: Area */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">Where in Egypt? 📍</h2>
            <p className="text-gray-500 mb-6">Select preferred areas — we'll match you with an FO who covers them</p>
            <div className="space-y-3">
              {AREAS.map(a => (
                <button key={a.id} onClick={() => toggleArea(a.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${form.preferredAreas.includes(a.id) ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                  <div className="flex-1">
                    <p className="font-black text-gray-900 text-sm">{a.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {a.yield && <span className="text-xs text-green-600 font-bold">{a.yield} yield</span>}
                      <span className="text-xs text-gray-400">{a.trend}</span>
                    </div>
                  </div>
                  {form.preferredAreas.includes(a.id) && <span className="text-orange-500 text-xl">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Review */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">Ready to match you! 🤝</h2>
            <p className="text-gray-500 mb-6">Review your profile and we'll find the best FO for you</p>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4 mb-6">
              {[
                { label: "📍 Location", val: `${form.currentCity}, ${COUNTRIES.find(c => c.code === form.currentCountry)?.name || ""}` },
                { label: "💱 Currency", val: `${FX_FLAGS[form.primaryCurrency]} ${form.primaryCurrency}` },
                { label: "🎯 Goals", val: form.goals.map(g => GOALS.find(x => x.id === g)?.label).join(", ") },
                { label: "💰 Budget", val: `${fmt(form.budgetInPrimaryCurrency)} ${form.primaryCurrency} ≈ ${fmt(budgetEGP)} EGP` },
                { label: "📍 Areas", val: form.preferredAreas.map(a => AREAS.find(x => x.id === a)?.label?.split(" /")[0]).join(", ") },
                { label: "🏠 Management needed", val: form.requiresPropertyManagement ? "Yes" : "No" },
                { label: "⚖️ Legal support needed", val: form.requiresLegalSupport ? "Yes" : "No" },
              ].map(row => (
                <div key={row.label} className="flex items-start gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <span className="text-sm text-gray-400 w-40 flex-shrink-0">{row.label}</span>
                  <span className="text-sm font-bold text-gray-900">{row.val || "—"}</span>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Preferred contact method</label>
              <div className="flex gap-2">
                {[["whatsapp", "💬 WhatsApp"], ["email", "📧 Email"], ["phone", "📞 Phone"], ["video_call", "📹 Video Call"]].map(([val, label]) => (
                  <button key={val} onClick={() => update({ communicationPreference: val })}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border-2 transition-all ${form.communicationPreference === val ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Matched! */}
        {step === 5 && (
          <div className="text-center">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">You're Matched!</h2>
            <p className="text-gray-500 mb-8">Your local Franchise Owner is ready to help you invest remotely</p>

            <div className="bg-gradient-to-br from-[#0d1b3e] to-[#1a2f5e] rounded-2xl p-6 text-white mb-6 text-left">
              <p className="text-blue-300 text-xs uppercase tracking-widest mb-3">🤝 Your Assigned Franchise Owner</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-orange-400 rounded-2xl flex items-center justify-center font-black text-white text-2xl">
                  {matched?.name?.charAt(0) || "A"}
                </div>
                <div>
                  <p className="font-black text-xl">{matched?.name || "Ahmed Hassan"}</p>
                  <p className="text-blue-200 text-sm">📍 {matched?.area || "New Cairo & 5th Settlement"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-green-300 text-xs">Available & ready</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[["4.9★", "Rating"], ["62", "Deals closed"], ["6yr", "Experience"]].map(([val, label]) => (
                  <div key={label} className="bg-white/10 rounded-xl py-3">
                    <p className="font-black text-white">{val}</p>
                    <p className="text-blue-300 text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => navigate("/kemedar/expat/dashboard")} className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-4 rounded-2xl text-lg transition-colors">
                Go to My Expat Dashboard →
              </button>
              <button onClick={() => navigate("/search-properties")} className="w-full border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-2xl hover:bg-gray-50">
                Browse Properties Now
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        {step < 5 && (
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50">
                ← Back
              </button>
            )}
            <button
              onClick={() => step === 4 ? handleSubmit() : setStep(s => s + 1)}
              disabled={!canContinue || saving}
              className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-black py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Matching you...</> : step === 4 ? "🤝 Find My FO" : "Continue →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}