// @ts-nocheck
const PROPS = [
  {
    icon: "📦",
    title: "Fast Delivery",
    desc: "Nationwide delivery to your site",
    color: "text-[#0077B6]",
    bg: "bg-blue-50",
  },
  {
    icon: "✅",
    title: "Verified Sellers",
    desc: "All sellers are verified by Kemetro",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: "🔄",
    title: "Easy Returns",
    desc: "Hassle-free return policy",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: "💬",
    title: "Expert Support",
    desc: "Talk to a building materials expert",
    color: "text-[#FF6B00]",
    bg: "bg-orange-50",
  },
];

export default function KemetroValueProps() {
  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 py-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {PROPS.map((p) => (
            <div
              key={p.title}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
            >
              <div className={`w-10 h-10 ${p.bg} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
                {p.icon}
              </div>
              <div>
                <p className={`font-bold text-sm ${p.color}`}>{p.title}</p>
                <p className="text-gray-500 text-xs">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}