const TESTIMONIALS = [
  {
    name: "Ahmed Al-Rashidi",
    location: "Dubai, UAE",
    quote: "Joining Kemedar as a franchise owner was the best business decision I ever made. The platform practically sells itself — all I do is manage relationships and collect commissions.",
    area: "Dubai Marina District",
    initials: "AA",
    color: "#FF6B00",
  },
  {
    name: "Maria Santos",
    location: "Lisbon, Portugal",
    quote: "The training was exceptional and the support from HQ is always there when I need it. I built a team of 4 within 6 months and we're growing every quarter.",
    area: "Lisbon Central",
    initials: "MS",
    color: "#6366F1",
  },
  {
    name: "Hassan Ibrahim",
    location: "Cairo, Egypt",
    quote: "I was a real estate agent for 10 years. Becoming a Kemedar franchise owner gave me a real business with real technology behind it. Game changer.",
    area: "New Cairo District",
    initials: "HI",
    color: "#22C55E",
  },
];

function Stars() {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => <span key={i} className="text-[#FF6B00] text-sm">★</span>)}
    </div>
  );
}

export default function FOTestimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl xl:text-4xl font-black text-gray-900">Franchise Owners Around the World</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-[#F8FAFC] rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
              <Stars />
              <p className="text-gray-700 text-sm leading-relaxed italic flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0" style={{ background: t.color }}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.location}</p>
                </div>
                <span className="ml-auto text-[10px] font-bold text-[#FF6B00] bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                  {t.area}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}