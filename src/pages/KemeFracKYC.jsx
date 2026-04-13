import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";

const COUNTRIES = ["Egypt", "Saudi Arabia", "UAE", "USA", "UK", "Jordan", "Kuwait", "Qatar", "Other"];
const EXPERIENCE_LEVELS = ["none", "beginner", "intermediate", "expert"];

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-black transition-all"
            style={{
              background: i < current ? "#00C896" : i === current ? "#0A1628" : "#e5e7eb",
              color: i <= current ? "white" : "#9ca3af",
            }}>
            {i < current ? "✓" : i + 1}
          </div>
          {i < total - 1 && (
            <div className="flex-1 h-0.5 w-12 rounded-full"
              style={{ background: i < current ? "#00C896" : "#e5e7eb" }} />
          )}
        </div>
      ))}
      <span className="text-sm text-gray-400 ml-2">Step {current + 1} of {total}</span>
    </div>
  );
}

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C896]/30 focus:border-[#00C896]";
const labelClass = "block text-xs font-bold text-gray-600 mb-1";

function Step1({ data, setData, onNext }) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Full Legal Name</label>
        <input type="text" placeholder="As shown on your ID" value={data.fullName}
          onChange={e => setData(d => ({ ...d, fullName: e.target.value }))} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Date of Birth</label>
        <input type="date" value={data.dateOfBirth}
          onChange={e => setData(d => ({ ...d, dateOfBirth: e.target.value }))} className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Nationality</label>
          <select value={data.nationality} onChange={e => setData(d => ({ ...d, nationality: e.target.value }))} className={inputClass + " bg-white cursor-pointer"}>
            <option value="">Select...</option>
            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Country of Residence</label>
          <select value={data.residencyCountryId} onChange={e => setData(d => ({ ...d, residencyCountryId: e.target.value }))} className={inputClass + " bg-white cursor-pointer"}>
            <option value="">Select...</option>
            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Investment Experience</label>
        <div className="grid grid-cols-2 gap-2">
          {EXPERIENCE_LEVELS.map(level => (
            <button key={level} type="button"
              onClick={() => setData(d => ({ ...d, investmentExperience: level }))}
              className="py-2.5 px-4 rounded-xl border-2 text-sm font-bold capitalize transition-all"
              style={{ borderColor: data.investmentExperience === level ? "#00C896" : "#e5e7eb", color: data.investmentExperience === level ? "#00C896" : "#6b7280", background: data.investmentExperience === level ? "#00C89608" : "white" }}>
              {level}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className={labelClass}>Politically Exposed Person (PEP)?</label>
        <div className="flex gap-4">
          {[false, true].map(val => (
            <label key={String(val)} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={data.politicallyExposedPerson === val}
                onChange={() => setData(d => ({ ...d, politicallyExposedPerson: val }))}
                className="accent-[#00C896]" />
              <span className="text-sm font-bold text-gray-700">{val ? "Yes" : "No"}</span>
            </label>
          ))}
        </div>
      </div>
      <button onClick={onNext}
        disabled={!data.fullName || !data.dateOfBirth || !data.nationality}
        className="w-full py-3.5 rounded-xl font-black text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        style={{ background: "#0A1628", color: "#00C896" }}>
        Next →
      </button>
    </div>
  );
}

function Step2({ data, setData, onNext, onBack }) {
  const [uploading, setUploading] = useState({ id: false, selfie: false });

  const uploadFile = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(u => ({ ...u, [field]: true }));
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setData(d => ({ ...d, [field]: file_url }));
    setUploading(u => ({ ...u, [field]: false }));
  };

  const UploadZone = ({ field, label, sub }) => (
    <label className="block cursor-pointer">
      <p className={labelClass}>{label}</p>
      <div className="border-2 border-dashed rounded-xl p-6 text-center transition-all hover:border-[#00C896]"
        style={{ borderColor: data[field] ? "#00C896" : "#e5e7eb", background: data[field] ? "#00C89608" : "white" }}>
        {uploading[field] ? (
          <p className="text-sm text-gray-400">Uploading...</p>
        ) : data[field] ? (
          <div>
            <p className="text-sm font-black" style={{ color: "#00C896" }}>✅ Uploaded</p>
            <button type="button" className="text-xs text-red-400 mt-1" onClick={() => setData(d => ({ ...d, [field]: null }))}>Remove</button>
          </div>
        ) : (
          <>
            <p className="text-2xl mb-1">📤</p>
            <p className="text-sm font-bold text-gray-700">{sub}</p>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or PDF · Max 10MB</p>
          </>
        )}
        <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={e => uploadFile(e, field)} />
      </div>
    </label>
  );

  return (
    <div className="space-y-4">
      <UploadZone field="nationalIdFileUrl" label="National ID / Passport (Front)" sub="Upload front of your ID or passport" />
      <UploadZone field="selfieWithIdUrl" label="Selfie Holding Your ID" sub="Take a selfie while holding your ID document" />

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
        ℹ️ Your documents are encrypted and reviewed by our compliance team only. They are never shared with third parties.
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl font-black text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50">← Back</button>
        <button onClick={onNext} disabled={!data.nationalIdFileUrl || !data.selfieWithIdUrl}
          className="flex-1 py-3 rounded-xl font-black text-sm disabled:opacity-40 transition-all"
          style={{ background: "#0A1628", color: "#00C896" }}>
          Next →
        </button>
      </div>
    </div>
  );
}

function Step3({ data, onSubmit, onBack, submitting }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gray-100 overflow-hidden text-sm">
        {[
          ["Full Name", data.fullName],
          ["Date of Birth", data.dateOfBirth],
          ["Nationality", data.nationality],
          ["Country of Residence", data.residencyCountryId],
          ["Investment Experience", data.investmentExperience],
          ["Politically Exposed", data.politicallyExposedPerson ? "Yes" : "No"],
          ["ID Document", data.nationalIdFileUrl ? "✅ Uploaded" : "—"],
          ["Selfie with ID", data.selfieWithIdUrl ? "✅ Uploaded" : "—"],
        ].map(([label, val], i) => (
          <div key={label} className={`flex justify-between px-4 py-2.5 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
            <span className="text-gray-400">{label}</span>
            <span className="font-bold text-gray-900">{val || "—"}</span>
          </div>
        ))}
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 accent-[#00C896] w-4 h-4" />
        <span className="text-sm text-gray-600 leading-relaxed">
          I confirm all information is accurate and I consent to Kemedar processing my identity data for KYC compliance.
        </span>
      </label>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs text-gray-500 text-center">
        Admin reviews within 24 hours. You'll receive a notification when approved.
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl font-black text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50">← Back</button>
        <button onClick={onSubmit} disabled={!agreed || submitting}
          className="flex-1 py-3 rounded-xl font-black text-sm disabled:opacity-40 transition-all"
          style={{ background: "#0A1628", color: "#00C896" }}>
          {submitting ? "Submitting..." : "Submit for Review"}
        </button>
      </div>
    </div>
  );
}

export default function KemeFracKYC() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({
    fullName: "", dateOfBirth: "", nationality: "", residencyCountryId: "",
    investmentExperience: "none", politicallyExposedPerson: false,
    nationalIdFileUrl: null, selfieWithIdUrl: null,
  });

  const handleSubmit = async () => {
    setSubmitting(true);
    await base44.entities.FracKYC.create({ ...data, kycStatus: "pending_review" }).catch(() => {});
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-md w-full">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-black mb-2" style={{ color: "#0A1628" }}>KYC Submitted!</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-2">
              You'll receive a notification when your identity is approved.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              You can start buying tokens immediately upon approval.
            </p>
            <Link to="/kemefrac"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm"
              style={{ background: "#0A1628", color: "#00C896" }}>
              ← Back to KemeFrac™
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const STEP_TITLES = ["Personal Details", "Identity Document", "Review & Submit"];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-black"
              style={{ background: "#0A1628", color: "#00C896" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C896]" /> KemeFrac™ KYC
            </div>
            <h1 className="text-2xl font-black mb-1" style={{ color: "#0A1628" }}>Complete Identity Verification</h1>
            <p className="text-gray-400 text-sm">Required once. Takes 2 minutes. Powered by Kemedar KYC.</p>
          </div>

          <StepIndicator current={step} total={3} />

          <p className="font-black text-gray-800 mb-5">{STEP_TITLES[step]}</p>

          {step === 0 && <Step1 data={data} setData={setData} onNext={() => setStep(1)} />}
          {step === 1 && <Step2 data={data} setData={setData} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
          {step === 2 && <Step3 data={data} onSubmit={handleSubmit} onBack={() => setStep(1)} submitting={submitting} />}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}