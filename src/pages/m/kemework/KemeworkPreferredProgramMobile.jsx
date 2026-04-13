import { useState } from "react";
import { ArrowRight, CheckCircle2, X } from "lucide-react";

const BENEFITS = [
  { icon: "🎁", feature: "Zero Entry Fees" },
  { icon: "🏅", feature: "Official Accreditation" },
  { icon: "🎯", feature: "Priority Assignments" },
  { icon: "🪪", feature: "Exclusive ID Card" },
  { icon: "📚", feature: "Continuous Learning" },
  { icon: "🤝", feature: "Collaborative Community" },
  { icon: "💰", feature: "Monetize Your Expertise" },
];

const HOW_STEPS = [
  { num: 1, icon: "👤", label: "Register as Professional" },
  { num: 2, icon: "📝", label: "Complete Your Profile" },
  { num: 3, icon: "📤", label: "Submit Application" },
  { num: 4, icon: "🏢", label: "Attend Interview" },
  { num: 5, icon: "🏅", label: "Receive Certification" },
];

export default function KemeworkPreferredProgramMobile() {
  const [form, setForm] = useState({ name: "", specialization: "", experience: "", city: "", phone: "", email: "", intro: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* HERO */}
      <div
        className="w-full text-center py-12 px-4"
        style={{ background: "linear-gradient(135deg, #B8860B 0%, #D4A017 50%, #8B6914 100%)" }}
      >
        <div className="text-5xl mb-3">🏅</div>
        <h1 className="text-2xl font-black text-white mb-3 leading-tight">
          Kemedar's Preferred Professional Program
        </h1>
        <p className="text-sm text-white/85 mb-5 leading-relaxed">
          Join our elite network of certified professionals
        </p>
        <a
          href="#apply"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-amber-900 text-xs bg-white hover:bg-amber-50 transition-all"
        >
          Apply for Accreditation →
        </a>
      </div>

      {/* ABOUT THE PROGRAM */}
      <div className="px-4 py-6 space-y-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-2">About the Program</h2>
          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            Kemedar's Preferred Professional Program is designed to recognize and reward exceptional professionals in the home services industry.
          </p>
          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 flex gap-2 items-start">
            <span className="text-lg mt-0.5 flex-shrink-0">ℹ️</span>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              <span className="font-bold">Requirement:</span> You must attend a personal interview at Kemedar HQ.
            </p>
          </div>
        </div>

        {/* BENEFITS */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-3">Program Features</h2>
          <div className="space-y-2">
            {BENEFITS.map((b) => (
              <div key={b.feature} className="flex items-start gap-3 bg-white rounded-xl p-3 border border-gray-100">
                <span className="text-lg flex-shrink-0">{b.icon}</span>
                <p className="font-bold text-gray-900 text-sm">{b.feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* HOW TO APPLY */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-3">How to Apply</h2>
          <div className="space-y-2">
            {HOW_STEPS.map((step) => (
              <div key={step.num} className="flex gap-3 items-start">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 font-bold text-white"
                  style={{ background: "#D4A017" }}
                >
                  {step.num}
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-bold text-gray-900 text-sm">{step.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Step {step.num}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* APPLICATION FORM */}
        <div id="apply" className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
          <h2 className="text-lg font-black text-gray-900">Apply for Accreditation</h2>
          <p className="text-xs text-gray-500">Fill in your details and we'll contact you to schedule an interview</p>

          {submitted ? (
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 text-center">
              <div className="text-3xl mb-2">🏅</div>
              <h3 className="font-black text-gray-900 text-sm mb-1">Application Submitted!</h3>
              <p className="text-xs text-gray-500">Our team will review your application and contact you.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Specialization *</label>
                <input
                  required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400"
                  value={form.specialization}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  placeholder="e.g. Electrician"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Years of Experience *</label>
                <input
                  required
                  type="number"
                  min="0"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  placeholder="Years"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">City *</label>
                <input
                  required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Your city"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone *</label>
                <input
                  required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 234 567 890"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email *</label>
                <input
                  required
                  type="email"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Brief Introduction *</label>
                <textarea
                  required
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400 resize-none"
                  value={form.intro}
                  onChange={(e) => setForm({ ...form, intro: e.target.value })}
                  placeholder="Tell us about yourself..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: "#D4A017", color: "#1a1a2e" }}
              >
                Submit Application <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>

        {/* FINAL CTA */}
        <div className="bg-gray-900 rounded-2xl p-4 text-center mt-6">
          <div className="text-3xl mb-2">🏅</div>
          <h2 className="text-base font-black text-white mb-2 leading-snug">
            Join the Program today and redefine your career.
          </h2>
          <a
            href="#apply"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all hover:opacity-90"
            style={{ background: "#D4A017", color: "#1a1a2e" }}
          >
            Apply Now — It's Free →
          </a>
        </div>
      </div>
    </div>
  );
}