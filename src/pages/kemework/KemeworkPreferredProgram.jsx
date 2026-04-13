import { useState } from "react";
import { Link } from "react-router-dom";

const BENEFITS = [
  { icon: "🎁", feature: "Zero Entry Fees", desc: "Join the program at no cost. There are no registration or participation fees to become a Kemedar Preferred Professional." },
  { icon: "🏅", feature: "Official Accreditation", desc: "Receive official recognition with the Kemedar Preferred Professional certification — a mark of quality that builds client trust." },
  { icon: "🎯", feature: "Priority Assignments", desc: "Get first access to tasks posted through Track 2 (Kemedar-managed). Steady volume of work directly from Kemedar." },
  { icon: "🪪", feature: "Exclusive ID Card", desc: "Receive your official 'Kemedar Professional of Choice' ID card — a physical credential recognized across the Kemedar network." },
  { icon: "📚", feature: "Continuous Learning", desc: "Access exclusive training programs and mentorship from Kemedar's senior professionals and certified engineers." },
  { icon: "🤝", feature: "Collaborative Community", desc: "Join a supportive network of certified Kemedar professionals for collaboration, referrals and peer support." },
  { icon: "💰", feature: "Monetize Your Expertise", desc: "Earn additional income by offering specialized training sessions to other professionals within the Kemedar ecosystem." },
];

const HOW_STEPS = [
  { num: 1, icon: "👤", label: "Register as Professional on Kemework" },
  { num: 2, icon: "📝", label: "Complete Your Profile & Portfolio" },
  { num: 3, icon: "📤", label: "Submit Accreditation Application" },
  { num: 4, icon: "🏢", label: "Attend Personal Interview at Kemedar HQ" },
  { num: 5, icon: "🏅", label: "Receive Your Certification & ID Card" },
];

export default function KemeworkPreferredProgram() {
  const [form, setForm] = useState({ name: "", specialization: "", experience: "", city: "", phone: "", email: "", intro: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      {/* HERO */}
      <div
        className="w-full flex items-center justify-center text-center py-20 px-4"
        style={{ background: "linear-gradient(135deg, #B8860B 0%, #D4A017 50%, #8B6914 100%)" }}
      >
        <div>
          <div className="text-6xl mb-4">🏅</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Kemedar's Preferred<br />Professional Program
          </h1>
          <p className="text-lg text-white/85 max-w-xl mx-auto mb-8 leading-relaxed">
            Join our elite network of certified professionals and redefine your professional journey
          </p>
          <a
            href="#apply"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-amber-900 text-sm bg-white hover:bg-amber-50 transition-all"
          >
            Apply for Accreditation →
          </a>
        </div>
      </div>

      {/* ABOUT THE PROGRAM */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row gap-12 items-center">
          {/* Image */}
          <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=70"
              alt="Professional Program"
              className="w-full h-72 md:h-96 object-cover"
            />
          </div>
          {/* Text */}
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-black text-gray-900 mb-4">About the Program</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Kemedar's Preferred Professional Program is designed to recognize and reward exceptional professionals in the home services industry. By becoming an accredited Kemedar professional, you gain access to exclusive opportunities, direct task assignments and official certification that sets you apart in the marketplace.
            </p>
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 flex gap-3 items-start">
              <span className="text-xl mt-0.5">ℹ️</span>
              <p className="text-amber-800 text-sm leading-relaxed">
                <span className="font-bold">Application Requirement:</span> Professionals must schedule and attend a personal interview at Kemedar's headquarters as part of the accreditation process.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BENEFITS TABLE */}
      <div className="py-16 px-4" style={{ background: "#F8F5F0" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Program Features & Benefits</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1fr_2fr] border-b border-gray-100 px-6 py-3" style={{ background: "#1a1a2e" }}>
              <p className="text-xs font-black uppercase tracking-widest text-white">Feature</p>
              <p className="text-xs font-black uppercase tracking-widest text-white">Description</p>
            </div>
            {BENEFITS.map((b, i) => (
              <div key={b.feature} className={`grid grid-cols-[1fr_2fr] gap-4 px-6 py-5 border-b border-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">{b.icon}</span>
                  <p className="font-black text-gray-900 text-sm">{b.feature}</p>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW TO APPLY */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">How to Apply</h2>
          <div className="relative">
            <div className="absolute left-7 top-0 bottom-0 w-0.5" style={{ background: "#D4A017" }} />
            <div className="flex flex-col gap-6">
              {HOW_STEPS.map((step) => (
                <div key={step.num} className="flex items-center gap-5">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0 z-10 border-4 border-white shadow-md"
                    style={{ background: "#D4A017" }}
                  >
                    {step.icon}
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-3 flex-1">
                    <span className="text-xs font-black uppercase" style={{ color: "#D4A017" }}>Step {step.num}</span>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{step.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* APPLICATION FORM */}
      <div id="apply" className="py-16 px-4" style={{ background: "#F8F5F0" }}>
        <div className="max-w-[680px] mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-2">Apply for Accreditation</h2>
          <p className="text-gray-500 text-center text-sm mb-10">Fill in your details and we'll be in touch to schedule your interview</p>

          {submitted ? (
            <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-10 text-center">
              <div className="text-5xl mb-4">🏅</div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Application Submitted!</h3>
              <p className="text-gray-500 text-sm">Our team will review your application and contact you to schedule an interview at Kemedar HQ.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                  <input required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Specialization *</label>
                  <input required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} placeholder="e.g. Electrician, Plumber" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Years of Experience *</label>
                  <input required type="number" min="0" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} placeholder="Years" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City *</label>
                  <input required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Your city" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone *</label>
                  <input required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 234 567 890" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email *</label>
                  <input required type="email" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Upload Portfolio Samples</label>
                <input type="file" multiple accept="image/*,.pdf" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Upload Professional Certificates</label>
                <input type="file" multiple accept="image/*,.pdf" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Brief Introduction *</label>
                <textarea required rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400 resize-none" value={form.intro} onChange={e => setForm({ ...form, intro: e.target.value })} placeholder="Tell us about yourself, your experience and why you'd like to join the program..." />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                style={{ background: "#D4A017", color: "#1a1a2e" }}
              >
                Submit Application →
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="py-14 px-4" style={{ background: "#1a1a2e" }}>
        <div className="max-w-[700px] mx-auto text-center">
          <div className="text-4xl mb-4">🏅</div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4 leading-snug">
            Join the Kemedar Preferred Professional Program today and redefine your professional journey.
          </h2>
          <a
            href="#apply"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 mt-4"
            style={{ background: "#D4A017", color: "#1a1a2e" }}
          >
            Apply Now — It's Free →
          </a>
        </div>
      </div>
    </div>
  );
}