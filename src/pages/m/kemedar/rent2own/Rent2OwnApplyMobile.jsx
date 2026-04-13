import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const fmt = n => n != null ? new Intl.NumberFormat("en-EG").format(Math.round(n)) : "—";

const INCOME_SOURCES = [
  { id: "employment", label: "Employment", icon: "💼" },
  { id: "business", label: "Business", icon: "🏢" },
  { id: "freelance", label: "Freelance", icon: "💻" },
  { id: "investment", label: "Investment", icon: "📈" },
  { id: "mixed", label: "Mixed", icon: "🔄" },
];

const TIMELINES = [
  { id: "1_year", label: "1 Year" },
  { id: "2_years", label: "2 Years" },
  { id: "3_years", label: "3 Years" },
  { id: "4_years", label: "4 Years" },
  { id: "5_years", label: "5 Years" },
  { id: "flexible", label: "Flexible" },
];

export default function Rent2OwnApplyMobile() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    monthlyIncome: "", incomeSource: "employment", employerName: "", employmentYears: "",
    currentRent: "", savedCapital: "", requestedPurchaseTimeline: "3_years",
    nationalId: "", maritalStatus: "single", dependents: 0, intendedUse: "personal_residence",
  });
  const update = p => setForm(prev => ({ ...prev, ...p }));

  useEffect(() => {
    Promise.all([
      base44.auth.me(),
      base44.entities.Rent2OwnListing.filter({ id: listingId }),
    ]).then(([u, data]) => {
      setUser(u);
      setListing(data?.[0] || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [listingId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    const appNum = `R2O-${Date.now().toString(36).toUpperCase()}`;
    await base44.entities.Rent2OwnApplication.create({
      applicationNumber: appNum,
      listingId,
      propertyId: listing?.propertyId,
      applicantId: user?.id,
      sellerId: listing?.sellerId,
      monthlyIncome: Number(form.monthlyIncome),
      incomeSource: form.incomeSource,
      employerName: form.employerName || null,
      employmentYears: Number(form.employmentYears) || null,
      currentRent: Number(form.currentRent) || null,
      savedCapital: Number(form.savedCapital) || null,
      requestedStructure: listing?.structureType || "standard",
      requestedPurchaseTimeline: form.requestedPurchaseTimeline,
      nationalId: form.nationalId || null,
      maritalStatus: form.maritalStatus,
      dependents: Number(form.dependents),
      intendedUse: form.intendedUse,
      submittedAt: new Date().toISOString(),
      status: "submitted",
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (loading) return <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"><Loader2 size={32} className="animate-spin text-emerald-500" /></div>;

  if (submitted) return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <div className="text-center px-6">
        <p className="text-5xl mb-3">🎉</p>
        <h2 className="font-black text-gray-900 text-xl mb-2">Application Submitted!</h2>
        <p className="text-gray-500 text-sm mb-6">Our team will review your application and get back within 48 hours.</p>
        <button onClick={() => navigate("/m/kemedar/rent2own/browse")}
          className="bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-sm">
          ← Back to Listings
        </button>
      </div>
    </div>
  );

  const STEPS = ["Income", "Personal", "Review"];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f9fafb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ background: "#0F172A", flexShrink: 0, paddingTop: "max(12px, env(safe-area-inset-top))" }}
        className="px-4 pb-3 flex items-center justify-between">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
          <ArrowLeft size={18} color="white" />
        </button>
        <p className="font-black text-white text-sm">Apply for Rent-to-Own</p>
        <span className="text-white text-[10px] font-bold">{step + 1}/{STEPS.length}</span>
      </div>

      {/* Progress */}
      <div className="flex gap-1 px-4 py-2 bg-white border-b border-gray-100 flex-shrink-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className="h-1 rounded-full" style={{ background: i <= step ? "#10B981" : "#e5e7eb" }} />
            <p className="text-[8px] mt-0.5 font-semibold" style={{ color: i === step ? "#10B981" : "#9ca3af" }}>{s}</p>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }} className="px-4 py-4">
        {/* Listing summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-3 mb-4 flex items-center gap-3">
          <div className="w-14 h-14 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
            {listing?.propertyImages?.[0] ? <img src={listing.propertyImages[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-xs truncate">{listing?.propertyTitle || "Property"}</p>
            <p className="text-[10px] text-emerald-600 font-black">{fmt(listing?.totalMonthlyPayment)} EGP/mo</p>
          </div>
        </div>

        {/* Step 0: Income */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-black text-gray-900 text-base">Income Details</h2>
            <div>
              <label className="text-[10px] font-bold text-gray-600 mb-1 block">Monthly Income (EGP) *</label>
              <input type="number" value={form.monthlyIncome} onChange={e => update({ monthlyIncome: e.target.value })}
                placeholder="e.g. 15000" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-600 mb-2 block">Income Source *</label>
              <div className="grid grid-cols-3 gap-2">
                {INCOME_SOURCES.map(s => (
                  <button key={s.id} onClick={() => update({ incomeSource: s.id })}
                    className="p-2 rounded-xl border-2 text-center text-[10px] font-bold transition-all"
                    style={{ borderColor: form.incomeSource === s.id ? "#10B981" : "#e5e7eb", background: form.incomeSource === s.id ? "#10B98110" : "white" }}>
                    <p className="text-lg">{s.icon}</p>{s.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-600 mb-1 block">Employer Name</label>
              <input value={form.employerName} onChange={e => update({ employerName: e.target.value })}
                placeholder="Company name" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-600 mb-1 block">Years Employed</label>
                <input type="number" value={form.employmentYears} onChange={e => update({ employmentYears: e.target.value })}
                  placeholder="e.g. 5" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-600 mb-1 block">Current Rent (EGP)</label>
                <input type="number" value={form.currentRent} onChange={e => update({ currentRent: e.target.value })}
                  placeholder="e.g. 5000" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-600 mb-1 block">Saved Capital (EGP)</label>
              <input type="number" value={form.savedCapital} onChange={e => update({ savedCapital: e.target.value })}
                placeholder="e.g. 50000" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
            </div>
          </div>
        )}

        {/* Step 1: Personal */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-black text-gray-900 text-base">Personal Details</h2>
            <div>
              <label className="text-[10px] font-bold text-gray-600 mb-1 block">National ID</label>
              <input value={form.nationalId} onChange={e => update({ nationalId: e.target.value })}
                placeholder="14 digits" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-600 mb-2 block">Marital Status</label>
              <div className="flex gap-2">
                {["single", "married", "divorced", "widowed"].map(s => (
                  <button key={s} onClick={() => update({ maritalStatus: s })}
                    className="flex-1 py-2 rounded-xl border-2 text-[10px] font-bold capitalize"
                    style={{ borderColor: form.maritalStatus === s ? "#10B981" : "#e5e7eb", background: form.maritalStatus === s ? "#10B98110" : "white" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-600 mb-1 block">Dependents</label>
              <input type="number" value={form.dependents} onChange={e => update({ dependents: e.target.value })}
                placeholder="0" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-600 mb-2 block">Preferred Timeline</label>
              <div className="grid grid-cols-3 gap-2">
                {TIMELINES.map(t => (
                  <button key={t.id} onClick={() => update({ requestedPurchaseTimeline: t.id })}
                    className="py-2 rounded-xl border-2 text-[10px] font-bold"
                    style={{ borderColor: form.requestedPurchaseTimeline === t.id ? "#10B981" : "#e5e7eb", background: form.requestedPurchaseTimeline === t.id ? "#10B98110" : "white" }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-black text-gray-900 text-base">Review Application</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
              {[
                ["Monthly Income", `${fmt(Number(form.monthlyIncome))} EGP`],
                ["Source", form.incomeSource],
                ["Employer", form.employerName || "—"],
                ["Current Rent", form.currentRent ? `${fmt(Number(form.currentRent))} EGP` : "—"],
                ["Saved Capital", form.savedCapital ? `${fmt(Number(form.savedCapital))} EGP` : "—"],
                ["Timeline", form.requestedPurchaseTimeline?.replace("_", " ")],
                ["Marital Status", form.maritalStatus],
                ["Dependents", form.dependents],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-1 border-b border-gray-50 last:border-0">
                  <span className="text-[10px] text-gray-400">{label}</span>
                  <span className="text-[10px] font-bold text-gray-700 capitalize">{val}</span>
                </div>
              ))}
            </div>
            <button onClick={handleSubmit} disabled={submitting}
              className="w-full py-3.5 rounded-xl font-black text-sm text-white disabled:opacity-60" style={{ background: "#10B981" }}>
              {submitting ? "Submitting..." : "📩 Submit Application"}
            </button>
          </div>
        )}

        <div className="h-20" />
      </div>

      {/* Nav */}
      {step < 2 && (
        <div className="bg-white border-t border-gray-100 px-4 py-3 flex-shrink-0"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
          <button onClick={() => setStep(s => s + 1)}
            disabled={step === 0 && !form.monthlyIncome}
            className="w-full py-3 rounded-xl font-black text-sm text-white disabled:opacity-50" style={{ background: "#10B981" }}>
            Continue →
          </button>
        </div>
      )}

      <MobileBottomNav />
    </div>
  );
}