import { useState } from "react";
import { Link } from "react-router-dom";

const TRACK1 = [
  { num: "1", icon: "📋", title: "Post Your Task", desc: "Describe your task in detail with photos, budget and deadline. It takes less than 5 minutes." },
  { num: "2", icon: "📬", title: "Receive Offers", desc: "Qualified professionals submit competitive bids with their price, timeline and approach." },
  { num: "3", icon: "✅", title: "Select the Best Offer", desc: "Compare bids, check profiles, portfolios and reviews to choose the right professional." },
  { num: "4", icon: "🤝", title: "Assign the Task", desc: "Confirm your chosen professional and agree on terms. Direct payment between you and the pro." },
  { num: "5", icon: "⭐", title: "Task Delivery & Review", desc: "Professional completes and delivers the task. Leave a review to help the community." },
];

const TRACK2 = [
  { num: "1", icon: "🤝", title: "Initiation & Agreement", desc: "Assign your task to Kemedar. Our team reviews requirements and presents a customized service agreement." },
  { num: "2", icon: "👷", title: "Execution by Experts", desc: "Kemedar assigns certified professionals from our Preferred Professional network to execute your task." },
  { num: "3", icon: "🔍", title: "Quality Supervision", desc: "Kemedar's certified consulting engineers oversee the work at every stage to ensure quality standards." },
  { num: "4", icon: "💰", title: "Transparent Financial Transactions", desc: "All financial transactions occur directly between you and Kemedar with full transparency and receipts." },
  { num: "5", icon: "✅", title: "Delivery & Completion", desc: "Task is delivered according to the supply contract with a formal handover process." },
];

export default function KWHowItWorks() {
  const [activeTab, setActiveTab] = useState(0);
  const steps = activeTab === 0 ? TRACK1 : TRACK2;

  return (
    <div className="py-16 px-4" style={{ background: "#F8F5F0" }}>
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-2">How Kemework Works</h2>
        <p className="text-gray-500 text-center mb-8">Two ways to get your task done</p>

        {/* Tab selector */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden">
            {["Track 1: You Choose", "Track 2: Kemedar Handles It"].map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className="px-6 py-3 text-sm font-bold transition-colors relative"
                style={{
                  color: activeTab === i ? "#C41230" : "#6b7280",
                  borderBottom: activeTab === i ? "3px solid #C41230" : "3px solid transparent",
                  background: activeTab === i ? "#fff8f8" : "transparent",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-gray-200" style={{ top: 26, zIndex: 0 }} />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-xl mb-3 shadow-lg flex-shrink-0"
                  style={{ background: "#C41230", border: "4px solid #F8F5F0" }}
                >
                  {step.num}
                </div>
                <div className="text-2xl mb-2">{step.icon}</div>
                <h4 className="font-black text-gray-900 text-sm mb-2">{step.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <Link
            to="/kemework/post-task"
            className="px-8 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
            style={{ background: "#C41230" }}
          >
            Post Your Task Now →
          </Link>
          <Link
            to="/kemework/how-it-works"
            className="px-8 py-3.5 rounded-xl font-bold text-sm border-2 transition-all hover:bg-gray-50"
            style={{ borderColor: "#C41230", color: "#C41230" }}
          >
            Learn More →
          </Link>
        </div>
      </div>
    </div>
  );
}