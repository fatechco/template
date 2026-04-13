export default function KemetroSellerHero() {
  const stats = [
    { icon: "🛒", label: "10K+ Buyers", value: "10000" },
    { icon: "📦", label: "50K+ Products", value: "50000" },
    { icon: "🌍", label: "30+ Countries", value: "30" },
  ];

  return (
    <section className="w-full bg-gradient-to-r from-teal-700 to-teal-600 py-20">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-4">Start Selling on Kemetro Today</h1>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of verified suppliers<br />
            reaching thousands of buyers
          </p>

          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <p className="text-white font-black text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}