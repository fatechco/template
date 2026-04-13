import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";

export default function AdvisorLanding() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = location.pathname.startsWith("/m");
  const [lang, setLang] = useState("en");
  const [hasDraft, setHasDraft] = useState(false);
  const [draftStep, setDraftStep] = useState(1);

  useEffect(() => {
    const draft = localStorage.getItem("kemedar_advisor_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setHasDraft(true);
        setDraftStep(parsed.currentStep || 1);
      } catch (_) {}
    }
  }, []);

  const startSurvey = (fresh = false) => {
    if (fresh) localStorage.removeItem("kemedar_advisor_draft");
    navigate("/kemedar/advisor/survey");
  };

  const BENEFITS = [
    { icon: "🎯", title: "Personalized Profile", desc: "AI understands your exact needs, lifestyle, and budget constraints" },
    { icon: "🏠", title: "Smart Property Matching", desc: "Scored matches from our live database — only properties that truly fit you" },
    { icon: "🔔", title: "Smart Notifications", desc: "Get alerted the moment a property matching your profile goes live" },
  ];

  const LANGS = [
    { code: "en", flag: "🇺🇸", label: "English" },
    { code: "ar", flag: "🇸🇦", label: "العربية" },
    { code: "fr", flag: "🇫🇷", label: "Français" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!isMobile && <SiteHeader />}

      {/* Hero */}
      <div className="bg-gradient-to-b from-orange-50 to-white pt-16 pb-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-purple-100 text-purple-700 text-xs font-black px-3 py-1 rounded-full mb-4">✨ AI-Powered</span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
            Find Your Perfect Property<br />with Kemedar Advisor
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8">
            Answer 8 simple questions about your lifestyle and needs. Our AI creates your personal property profile and matches you with the best listings.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap mb-10">
            {["🕐 ~5 minutes", "🔒 No sensitive data collected", "🌍 Arabic, English, French"].map(p => (
              <span key={p} className="bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600 shadow-sm">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Benefit Cards */}
      <div className="max-w-5xl mx-auto px-4 -mt-4 pb-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {BENEFITS.map(b => (
          <div key={b.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-orange-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl mb-4">{b.icon}</div>
            <h3 className="font-bold text-gray-900 text-base mb-2">{b.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Language Selector */}
      <div className="max-w-xl mx-auto px-4 pb-8 text-center">
        <p className="text-sm text-gray-500 mb-3 font-semibold">Preferred language:</p>
        <div className="flex justify-center gap-3">
          {LANGS.map(l => (
            <button key={l.code} onClick={() => setLang(l.code)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border-2 text-sm font-bold transition-all ${lang === l.code ? "border-orange-500 text-orange-600 bg-orange-50" : "border-gray-200 text-gray-600 hover:border-orange-300"}`}>
              {l.flag} {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resume banner */}
      {hasDraft && (
        <div className="max-w-xl mx-auto px-4 pb-6">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
            <p className="font-bold text-orange-700 mb-1">🔄 You have an existing advisor profile</p>
            <p className="text-sm text-orange-600 mb-4">Step {draftStep} of 8 in progress</p>
            <div className="flex gap-3">
              <button onClick={() => startSurvey(false)} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-black py-2.5 rounded-xl text-sm">
                Continue My Profile →
              </button>
              <button className="border border-orange-300 text-orange-600 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-orange-50"
                onClick={() => navigate("/dashboard/advisor-report")}>
                View My Report
              </button>
            </div>
            <button onClick={() => startSurvey(true)} className="mt-3 text-xs text-gray-400 hover:text-gray-600 w-full text-center">Start Fresh</button>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="max-w-xl mx-auto px-4 pb-16 text-center">
        <button onClick={() => startSurvey(false)}
          className="w-full md:w-auto md:min-w-[360px] bg-orange-500 hover:bg-orange-600 text-white font-black text-lg py-4 px-10 rounded-2xl shadow-lg hover:shadow-xl transition-all">
          🤖 Start My Property Match
        </button>
        <p className="text-gray-400 text-xs mt-3">✅ Free • No registration required to start • Save results after</p>
      </div>

      <SiteFooter />
    </div>
  );
}