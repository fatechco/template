const PROFILES = [
  { icon: "🏠", title: "Real Estate Professional", desc: "Agents, brokers, and consultants who already know the market and want to scale with technology." },
  { icon: "💼", title: "Entrepreneur", desc: "Business owners looking for a proven model with multiple income streams in the booming PropTech sector." },
  { icon: "📊", title: "Investor", desc: "Individuals or companies seeking a sustainable, tech-driven investment with strong ROI potential." },
  { icon: "🏢", title: "Corporate Executive", desc: "Professionals from real estate, banking, or tech backgrounds ready to lead a regional operation." },
];

const REQUIREMENTS = ["📍 Local Market Knowledge", "💰 Investment Capacity", "🤝 Management Skills"];

export default function FOWhoIsItFor() {
  return (
    <section className="py-20 bg-[#1a1a2e]">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl xl:text-4xl font-black text-white mb-4">The Ideal Kemedar Franchise Owner</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {PROFILES.map(p => (
            <div key={p.title} className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
              <div className="text-5xl mb-5">{p.icon}</div>
              <h3 className="font-black text-white text-base mb-3">{p.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
              <div className="mt-4 w-10 h-1 bg-[#FF6B00] rounded-full" />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {REQUIREMENTS.map(r => (
            <div key={r} className="border border-white/30 text-white text-sm font-semibold px-6 py-2.5 rounded-full">
              {r}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}