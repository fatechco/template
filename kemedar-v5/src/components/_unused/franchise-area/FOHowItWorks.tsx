// @ts-nocheck
const STEPS = [
  { icon: "📝", title: "Apply Online", desc: "Fill out the franchise application form with your details and target area.", time: "Day 1" },
  { icon: "📞", title: "Initial Consultation", desc: "Our regional team reviews your application and schedules a video call to discuss the opportunity.", time: "Within 48 Hours" },
  { icon: "📄", title: "Agreement & Onboarding", desc: "Sign the franchise agreement and complete the onboarding program including platform training.", time: "Week 1–2" },
  { icon: "🚀", title: "Launch Your Territory", desc: "Activate your exclusive area, set up your office on Kemodoo, and start acquiring users.", time: "Week 3" },
  { icon: "💰", title: "Grow & Earn", desc: "Scale your operations, build your team, and grow revenue across all 7 income streams.", time: "Ongoing" },
];

export default function FOHowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl xl:text-4xl font-black text-gray-900">Your Journey to Becoming a Franchise Owner</h2>
        </div>
        {/* Timeline */}
        <div className="relative flex flex-col md:flex-row items-start md:items-stretch gap-8 md:gap-0">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gray-200" style={{ zIndex: 0 }} />
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex-1 flex flex-col items-center text-center relative z-10 px-4">
              {/* Number circle */}
              <div className="w-16 h-16 rounded-full bg-[#FF6B00] text-white flex items-center justify-center text-2xl shadow-lg shadow-orange-200 mb-4 flex-shrink-0 ring-4 ring-white">
                {step.icon}
              </div>
              {/* Time badge */}
              <span className="text-[10px] font-black text-[#FF6B00] tracking-widest uppercase bg-orange-50 border border-orange-200 px-3 py-1 rounded-full mb-3">
                {step.time}
              </span>
              <h3 className="font-black text-gray-900 text-base mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}