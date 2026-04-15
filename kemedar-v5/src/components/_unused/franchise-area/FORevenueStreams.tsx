// @ts-nocheck
const STREAMS = [
  { icon: "💳", color: "#6366F1", title: "Subscription Commissions", desc: "Earn a percentage of every subscription plan sold by agents, agencies, and developers in your area.", tag: "Recurring Monthly Income" },
  { icon: "✅", color: "#22C55E", title: "Verification Services", desc: "Manage KEMEDAR VERI requests — property, agent, and developer verifications. You handle the field visits and earn per job.", tag: "$50–$200 per verification" },
  { icon: "📋", color: "#FF6B00", title: "Listing Services", desc: "Coordinate KEMEDAR LIST service — visit properties, take professional photos, and add full listing details.", tag: "$30–$50 per listing" },
  { icon: "🚀", color: "#F59E0B", title: "Boost & UP Service", desc: "Manage KEMEDAR UP placements for properties in your territory and earn a share of the monthly fee.", tag: "Recurring Monthly Income" },
  { icon: "🔑", color: "#8B5CF6", title: "Key With Kemedar", desc: "Manage property keys and accompany buyers on visits in your area. Charge per visit or on a monthly basis.", tag: "Per Visit or Monthly" },
  { icon: "📢", color: "#EF4444", title: "Campaign Management", desc: "Run targeted marketing campaigns (Email, WhatsApp, SMS, Messenger) for sellers in your region.", tag: "Custom Pricing" },
  { icon: "🔧", color: "#0EA5E9", title: "Kemework Tasks", desc: "Oversee and manage handyman and technician tasks ordered through Kemework in your territory.", tag: "Commission per Task" },
];

export default function FORevenueStreams() {
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xs font-black tracking-widest text-[#FF6B00] uppercase mb-3">HOW YOU EARN</p>
          <h2 className="text-3xl xl:text-4xl font-black text-gray-900">7 Ways to Make Money as a Franchise Owner</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {STREAMS.map(s => (
            <div key={s.title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: s.color + "18" }}>
                {s.icon}
              </div>
              <h3 className="font-black text-gray-900 text-sm leading-tight">{s.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed flex-1">{s.desc}</p>
              <span className="inline-block text-xs font-bold px-3 py-1 rounded-full w-fit" style={{ background: s.color + "18", color: s.color }}>
                {s.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}