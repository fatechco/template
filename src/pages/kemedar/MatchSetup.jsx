import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Check, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const CITIES = ["New Cairo", "Maadi", "Sheikh Zayed", "6th October", "Heliopolis", "Zamalek", "Nasr City", "North Coast", "Dokki", "Garden City"];
const PROPERTY_TYPES = [
  { value: "Apartment", icon: "🏢", label: "Apartment" },
  { value: "Villa", icon: "🏡", label: "Villa" },
  { value: "Townhouse", icon: "🏘", label: "Townhouse" },
  { value: "Studio", icon: "🛏", label: "Studio" },
  { value: "Off-Plan", icon: "🏗", label: "Off-Plan" },
  { value: "Land", icon: "🌍", label: "Land" },
];
const BUDGET_PRESETS = [
  { label: "Under 1M", min: 0, max: 1000000 },
  { label: "1M–2M", min: 1000000, max: 2000000 },
  { label: "2M–3M", min: 2000000, max: 3000000 },
  { label: "3M–5M", min: 3000000, max: 5000000 },
  { label: "5M+", min: 5000000, max: 20000000 },
];

function fmt(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

// Step indicator
function StepDots({ current, total }) {
  return (
    <div className="flex gap-2 justify-center mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`rounded-full transition-all ${i === current ? "w-6 h-2 bg-orange-500" : i < current ? "w-2 h-2 bg-orange-300" : "w-2 h-2 bg-gray-200"}`} />
      ))}
    </div>
  );
}

export default function MatchSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [purpose, setPurpose] = useState(null);
  const [budgetMin, setBudgetMin] = useState(500000);
  const [budgetMax, setBudgetMax] = useState(2500000);
  const [selectedCities, setSelectedCities] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const toggleCity = (city) => setSelectedCities(prev => prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]);
  const toggleType = (type) => setPropertyTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);

  const handleComplete = async () => {
    setSaving(true);
    setStatusMsg("Creating your profile...");
    try {
      const user = await base44.auth.me();
      
      // Deactivate any existing profiles
      const existing = await base44.entities.MatchProfile.filter({ userId: user.id, isActive: true });
      for (const p of existing) {
        await base44.entities.MatchProfile.update(p.id, { isActive: false });
      }

      // Create new profile
      const profile = await base44.entities.MatchProfile.create({
        userId: user.id,
        purpose,
        budgetMin,
        budgetMax,
        currency: "EGP",
        propertyTypes,
        preferredCityIds: selectedCities,
        isActive: true,
        aiLearnedPreferences: { detectedWeights: {}, preferredNeighborhoods: [] },
        aiConfidenceScore: 0,
        totalSwipes: 0, totalLikes: 0, totalPasses: 0, totalSuperLikes: 0, totalMatches: 0
      });

      // Generate initial queue
      setStatusMsg("AI is building your queue...");
      await base44.functions.invoke("generateMatchQueue", {
        matchProfileId: profile.id,
        count: 50
      }).catch(() => null); // Non-fatal — swipe page falls back to mock

      setStatusMsg("Ready!");
    } catch (err) {
      // Best-effort — still navigate
    }
    navigate("/kemedar/match");
  };

  // SCREEN 0 — Welcome
  if (step === 0) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-orange-600 via-orange-500 to-gray-900 text-white px-6">
      <div className="animate-pulse text-8xl mb-6">🏠</div>
      <h1 className="text-5xl font-black text-center mb-3">Kemedar Match™</h1>
      <p className="text-lg text-orange-100 text-center mb-8">Find your perfect property — the fun way</p>
      <div className="flex gap-3 mb-10 flex-wrap justify-center">
        {["❤️ Swipe to like", "⭐ Super Like standouts", "🎉 Match & Connect"].map(pill => (
          <span key={pill} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">{pill}</span>
        ))}
      </div>
      <button onClick={() => setStep(1)} className="bg-white text-orange-600 font-black text-lg px-10 py-4 rounded-2xl flex items-center gap-2 shadow-xl hover:scale-105 transition-transform">
        Let's Go <ChevronRight className="w-5 h-5" />
      </button>
      <p className="text-orange-200 text-sm mt-6 animate-bounce">↑ 4 quick questions then you're swiping</p>
    </div>
  );

  // SCREEN 1 — Purpose
  if (step === 1) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white px-6">
      <StepDots current={0} total={3} />
      <h2 className="text-3xl font-black text-gray-900 text-center mb-2">What are you looking for?</h2>
      <p className="text-gray-500 mb-10 text-center">Select your goal</p>
      <div className="w-full max-w-sm space-y-4 mb-10">
        {[
          { val: "buy", icon: "🏠", title: "Buy a Property", desc: "Find your dream home or investment" },
          { val: "rent", icon: "🔑", title: "Rent a Property", desc: "Find the perfect place to live" },
        ].map(opt => (
          <button key={opt.val} onClick={() => setPurpose(opt.val)}
            className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${purpose === opt.val ? "border-orange-500 bg-orange-50 scale-[1.02]" : "border-gray-200 hover:border-orange-300"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl mb-2">{opt.icon}</p>
                <p className="font-black text-xl text-gray-900">{opt.title}</p>
                <p className="text-gray-500 text-sm">{opt.desc}</p>
              </div>
              {purpose === opt.val && (
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      <button onClick={() => setStep(2)} disabled={!purpose}
        className={`w-full max-w-sm py-4 rounded-2xl font-black text-lg transition-all ${purpose ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
        Continue →
      </button>
    </div>
  );

  // SCREEN 2 — Budget & Location
  if (step === 2) return (
    <div className="fixed inset-0 overflow-y-auto bg-white px-6 py-10">
      <div className="max-w-sm mx-auto">
        <StepDots current={1} total={3} />
        <h2 className="text-2xl font-black text-gray-900 mb-1">Set your budget</h2>
        <p className="text-gray-500 text-sm mb-6">Drag to adjust your range</p>

        <div className="bg-orange-50 rounded-2xl p-6 mb-4">
          <p className="text-3xl font-black text-orange-600 text-center mb-4">
            {fmt(budgetMin)} — {fmt(budgetMax)} EGP
          </p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-gray-500 font-bold">MIN</label>
                <span className="text-xs font-bold text-orange-500">{fmt(budgetMin)}</span>
              </div>
              <input type="range" min={0} max={10000000} step={100000} value={budgetMin}
                onChange={e => setBudgetMin(Math.min(Number(e.target.value), budgetMax - 100000))}
                className="w-full accent-orange-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-gray-500 font-bold">MAX</label>
                <span className="text-xs font-bold text-orange-500">{fmt(budgetMax)}</span>
              </div>
              <input type="range" min={500000} max={20000000} step={100000} value={budgetMax}
                onChange={e => setBudgetMax(Math.max(Number(e.target.value), budgetMin + 100000))}
                className="w-full accent-orange-500" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {BUDGET_PRESETS.map(p => (
            <button key={p.label} onClick={() => { setBudgetMin(p.min); setBudgetMax(p.max); }}
              className={`px-3 py-1.5 rounded-full text-sm font-bold border transition-all ${budgetMin === p.min && budgetMax === p.max ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-700 hover:border-orange-300"}`}>
              {p.label}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-2">Where?</h2>
        <p className="text-gray-500 text-sm mb-4">Select your preferred areas</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {CITIES.map(city => (
            <button key={city} onClick={() => toggleCity(city)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${selectedCities.includes(city) ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-orange-100"}`}>
              {selectedCities.includes(city) ? `${city} ×` : city}
            </button>
          ))}
        </div>

        <button onClick={() => setStep(3)}
          className="w-full py-4 rounded-2xl font-black text-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors">
          Continue →
        </button>
      </div>
    </div>
  );

  // SCREEN 3 — Property Type + Submit
  return (
    <div className="fixed inset-0 bg-white px-6 py-10 overflow-y-auto">
      <div className="max-w-sm mx-auto">
        <StepDots current={2} total={3} />
        <h2 className="text-3xl font-black text-gray-900 mb-1">What type?</h2>
        <p className="text-gray-500 text-sm mb-6">Select all you'd consider:</p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {PROPERTY_TYPES.map(type => (
            <button key={type.value} onClick={() => toggleType(type.value)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all relative ${propertyTypes.includes(type.value) ? "bg-orange-500 border-orange-500 text-white" : "bg-white border-gray-200 text-gray-700 hover:border-orange-300"}`}>
              <span className="text-3xl mb-1">{type.icon}</span>
              <span className="text-xs font-bold">{type.label}</span>
              {propertyTypes.includes(type.value) && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-white/30 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          ))}
        </div>

        {saving ? (
          <div className="w-full py-4 rounded-2xl bg-orange-500 text-white font-black text-lg flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            {statusMsg || "Setting up..."}
          </div>
        ) : (
          <button onClick={handleComplete} disabled={propertyTypes.length === 0}
            className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${propertyTypes.length > 0 ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
            ✅ Start Matching!
          </button>
        )}
        <p className="text-center text-gray-400 text-xs mt-3">🔒 Your preferences stay private</p>
      </div>
    </div>
  );
}