import { useState } from "react";
import SiteHeader from "@/components/header/SiteHeader";
import SuperFooter from "@/components/layout/SuperFooter";
import { MapPin, Briefcase, Clock, Upload, CheckCircle, X } from "lucide-react";

const POSITIONS = [
  { title: "Senior React Developer", dept: "Engineering", location: "Cairo, Egypt", type: "Full-time" },
  { title: "Backend Engineer (Node.js)", dept: "Engineering", location: "Remote", type: "Remote" },
  { title: "Product Manager", dept: "Product", location: "Cairo, Egypt", type: "Full-time" },
  { title: "UI/UX Designer", dept: "Design", location: "Cairo / Remote", type: "Hybrid" },
  { title: "Real Estate Data Analyst", dept: "Analytics", location: "Cairo, Egypt", type: "Full-time" },
  { title: "Digital Marketing Specialist", dept: "Marketing", location: "Remote", type: "Remote" },
  { title: "Customer Success Manager", dept: "Operations", location: "Cairo, Egypt", type: "Full-time" },
  { title: "Sales Executive — MENA", dept: "Sales", location: "Dubai, UAE", type: "Full-time" },
];

const DEPT_COLORS = {
  Engineering: "bg-blue-100 text-blue-700",
  Product: "bg-purple-100 text-purple-700",
  Design: "bg-pink-100 text-pink-700",
  Analytics: "bg-yellow-100 text-yellow-700",
  Marketing: "bg-green-100 text-green-700",
  Operations: "bg-orange-100 text-orange-700",
  Sales: "bg-red-100 text-red-700",
};

const TYPE_COLORS = {
  "Full-time": "bg-green-50 text-green-700 border-green-200",
  "Remote": "bg-blue-50 text-blue-700 border-blue-200",
  "Hybrid": "bg-purple-50 text-purple-700 border-purple-200",
};

export default function Careers() {
  const [applyTo, setApplyTo] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", cover_letter: "", cv_url: "" });
  const [cvFile, setCvFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleCv = (e) => {
    const file = e.target.files[0];
    if (file) setCvFile(file.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d4e] py-20">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <span className="inline-block bg-[#FF6B00]/20 text-[#FF6B00] text-xs font-black px-4 py-1.5 rounded-full mb-4 tracking-wider">WE'RE HIRING</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">Join the Kemedar Team</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Help us build the future of real estate technology across the Middle East and Africa. We're a fast-growing proptech company with a big vision.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
            {[["🌍", "15+ Countries"], ["👥", "200+ Team Members"], ["🚀", "Fast Growing"], ["🏆", "Award Winning"]].map(([icon, label]) => (
              <div key={label} className="text-center">
                <span className="text-2xl block mb-1">{icon}</span>
                <p className="text-white font-bold text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-16 w-full flex-1">

        {/* Positions */}
        <div className="mb-4">
          <h2 className="text-2xl font-black text-gray-900 mb-1">Open Positions</h2>
          <p className="text-gray-500 text-sm">{POSITIONS.length} roles available across all departments</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {POSITIONS.map((pos) => (
            <div key={pos.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black text-gray-900 text-base">{pos.title}</h3>
                  <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 ${DEPT_COLORS[pos.dept] || "bg-gray-100 text-gray-600"}`}>{pos.dept}</span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border flex-shrink-0 ${TYPE_COLORS[pos.type] || "bg-gray-50 text-gray-600 border-gray-200"}`}>{pos.type}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={11} className="text-[#FF6B00]" />{pos.location}</span>
                <span className="flex items-center gap-1"><Briefcase size={11} className="text-[#FF6B00]" />{pos.dept}</span>
              </div>
              <button onClick={() => { setApplyTo(pos.title); setSubmitted(false); setForm({ name: "", email: "", phone: "", cover_letter: "", cv_url: "" }); setCvFile(null); }}
                className="mt-1 w-full py-2 rounded-xl bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold text-sm transition-colors">
                Apply Now
              </button>
            </div>
          ))}
        </div>

        {/* Application modal */}
        {applyTo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div>
                  <h3 className="font-black text-gray-900">Apply for Position</h3>
                  <p className="text-xs text-[#FF6B00] font-bold mt-0.5">{applyTo}</p>
                </div>
                <button onClick={() => setApplyTo(null)} className="text-gray-400 hover:text-gray-700 transition-colors"><X size={20} /></button>
              </div>
              <div className="p-5">
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                    <h3 className="font-black text-gray-900 text-lg mb-1">Application Submitted!</h3>
                    <p className="text-gray-500 text-sm mb-4">We'll review your application and get back to you within 5 business days.</p>
                    <button onClick={() => setApplyTo(null)} className="bg-[#FF6B00] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#e55f00] transition-colors">Close</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {[["name", "Full Name", "text"], ["email", "Email Address", "email"], ["phone", "Phone Number", "tel"]].map(([key, label, type]) => (
                      <div key={key}>
                        <label className="text-sm font-bold text-gray-700 mb-1 block">{label} <span className="text-red-500">*</span></label>
                        <input required type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                      </div>
                    ))}
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-1 block">CV / Resume <span className="text-red-500">*</span></label>
                      <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-orange-400 hover:bg-orange-50/20 transition-all">
                        <Upload size={18} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-500">{cvFile || "Upload PDF or Word document"}</span>
                        <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleCv} required />
                      </label>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-1 block">Cover Letter</label>
                      <textarea rows={4} value={form.cover_letter} onChange={e => setForm({ ...form, cover_letter: e.target.value })}
                        placeholder="Tell us why you'd be a great fit..."
                        className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none" />
                    </div>
                    <button type="submit" className="flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-md">
                      Submit Application
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <SuperFooter />
    </div>
  );
}