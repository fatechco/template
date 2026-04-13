import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "What is a Kemedar Area Franchise Owner?", a: "A Kemedar Area Franchise Owner is the exclusive representative of the Kemedar Proptech Super App in a designated city or district. You manage all Kemedar operations, services, and users in your territory and earn commissions from every transaction and service within it." },
  { q: "Do I need real estate experience?", a: "While real estate experience is a strong advantage, it is not mandatory. Entrepreneurial mindset, local market knowledge, and management skills are equally valuable. We provide comprehensive training for all new franchise owners." },
  { q: "What is the initial investment?", a: "Investment varies based on territory size and location. All details are disclosed during the private consultation. Please apply to receive a customized investment overview for your area." },
  { q: "Is my territory exclusive?", a: "Yes. Once you sign the franchise agreement for a specific area, no other franchise owner can operate in that same territory." },
  { q: "How long does it take to launch?", a: "From application approval to full launch typically takes 2–4 weeks, including agreement signing, training, and platform setup." },
  { q: "What support does Kemedar provide?", a: "You receive a dedicated onboarding program, platform training, marketing materials, access to Kemodoo management system, and ongoing support from both your Country Franchise Owner and Kemedar HQ." },
  { q: "Can I hire a team?", a: "Yes. Depending on your package, you can add team members to your Kemodoo office system. Most franchise owners build small teams as they grow." },
  { q: "How do I get paid?", a: "All commissions and revenues are tracked automatically through Kemodoo and paid monthly via XeedWallet — Kemedar's integrated payment system." },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors gap-4"
      >
        <span className="font-bold text-gray-900 text-sm">{q}</span>
        <ChevronDown size={18} className={`text-[#FF6B00] flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FOFAQ() {
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-[800px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl xl:text-4xl font-black text-gray-900">Frequently Asked Questions</h2>
        </div>
        <div className="flex flex-col gap-3">
          {FAQS.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}
        </div>
      </div>
    </section>
  );
}