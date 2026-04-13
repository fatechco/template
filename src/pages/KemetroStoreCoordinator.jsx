import { useState } from "react";
import { Link } from "react-router-dom";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";

const STEPS = [
  { icon: "📝", title: "Apply & Get Trained", desc: "Contact Kemetro to receive free training on the platform — no prior experience required." },
  { icon: "🏪", title: "Sign Up Local Stores", desc: "Visit local building material, furniture, and finishing stores and help them join Kemetro." },
  { icon: "💰", title: "Earn from Every Sale", desc: "Earn a percentage of every sale made by the stores you onboard and manage." },
];

const EMPTY_FORM = { name: "", email: "", phone: "", city: "", occupation: "", computer: "yes", about: "" };

export default function KemetroStoreCoordinator() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500";

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)" }} className="py-20 px-4">
        <div className="max-w-[800px] mx-auto text-center space-y-6">
          <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight">Earn Money as a Kemetro Store Coordinator</h1>
          <p className="text-teal-100 text-lg">Help local businesses go online and earn a percentage of every sale you generate.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#apply" className="bg-[#FF6B00] hover:bg-orange-600 text-white font-black px-6 py-3 rounded-xl transition-colors">Apply to Become a Coordinator</a>
            <a href="#store-owners" className="border-2 border-white text-white hover:bg-white/10 font-bold px-6 py-3 rounded-xl transition-colors">Find a Coordinator for My Store</a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-3xl mx-auto">{s.icon}</div>
                <div className="w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center font-black text-sm mx-auto">{i + 1}</div>
                <h3 className="font-black text-gray-900">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="store-owners" className="py-16 px-4 bg-[#F8FAFC]">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
              <h3 className="font-black text-teal-700 mb-5 text-lg">For Coordinators</h3>
              <div className="space-y-3">
                {["Free training from Kemetro", "No fees on first $10,000 in sales", "Flexible — work part-time or full-time", "Perfect for students & professionals", "Recurring income from managed stores"].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-gray-700"><span className="text-teal-500 font-black">✓</span> {b}</div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
              <h3 className="font-black text-blue-700 mb-5 text-lg">For Store Owners</h3>
              <div className="space-y-3">
                {["Professional store setup", "Products added quickly", "Orders managed on your behalf", "No tech knowledge needed", "Pay only from your sales revenue"].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-gray-700"><span className="text-blue-500 font-black">✓</span> {b}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APPLY FORM */}
      <section id="apply" className="py-16 px-4 bg-white">
        <div className="max-w-[600px] mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-2">Apply Now</h2>
          <p className="text-gray-500 text-center mb-8">Fill in your details and we'll be in touch within 48 hours.</p>
          {submitted ? (
            <div className="text-center bg-green-50 border border-green-200 rounded-2xl p-10 space-y-3">
              <div className="text-5xl">✅</div>
              <h3 className="font-black text-gray-900 text-xl">Application Submitted!</h3>
              <p className="text-gray-600">We'll review your application and contact you within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                  <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                  <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} placeholder="you@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone / WhatsApp *</label>
                  <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} placeholder="+20 xxx xxx xxxx" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">City & Country</label>
                  <input value={form.city} onChange={(e) => set("city", e.target.value)} className={inputClass} placeholder="e.g. Cairo, Egypt" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Current Occupation</label>
                  <input value={form.occupation} onChange={(e) => set("occupation", e.target.value)} className={inputClass} placeholder="e.g. Student, Sales" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Computer Skills?</label>
                  <select value={form.computer} onChange={(e) => set("computer", e.target.value)} className={inputClass}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tell Us About Yourself</label>
                  <textarea rows={4} value={form.about} onChange={(e) => set("about", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 resize-none" placeholder="Why do you want to become a Store Coordinator?" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-black py-3 rounded-xl transition-colors">Apply Now →</button>
            </form>
          )}
        </div>
      </section>

      <KemetroFooter />
    </div>
  );
}