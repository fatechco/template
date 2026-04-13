const CARDS = [
  { icon: "🗺", title: "Exclusive Territory", text: "You own and operate the Kemedar brand exclusively in your designated area — no competition from other franchise owners within your boundaries." },
  { icon: "💻", title: "Full Tech Platform Access", text: "Get complete access to Kemedar's Super App ecosystem — property listings, Kemework tasks, Kemetro marketplace, and all connected systems." },
  { icon: "💰", title: "Multiple Revenue Streams", text: "Earn from subscriptions, verification services, listing fees, task commissions, campaign services, and marketplace transactions — all within your territory." },
];

export default function FOWhatIs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xs font-black tracking-widest text-[#FF6B00] uppercase mb-3">THE OPPORTUNITY</p>
          <h2 className="text-3xl xl:text-4xl font-black text-gray-900 mb-4">
            Your Own Real Estate Tech Business —<br className="hidden md:block" /> Backed by a Global Brand
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            As a Kemedar Area Franchise Owner, you become the exclusive representative of Kemedar's entire ecosystem in your designated city or district.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map(c => (
            <div key={c.title} className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-5xl mb-5">{c.icon}</div>
              <h3 className="text-lg font-black text-gray-900 mb-3">{c.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}