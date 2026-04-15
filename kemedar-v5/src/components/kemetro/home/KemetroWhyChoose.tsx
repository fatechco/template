// @ts-nocheck
const FEATURES = [
  {
    icon: "🏭",
    title: "Manufacturer Direct",
    description: "Buy directly from manufacturers and authorized distributors at the best wholesale and retail prices.",
  },
  {
    icon: "✅",
    title: "Verified Sellers Only",
    description: "Every seller goes through Kemetro's verification process before listing products.",
  },
  {
    icon: "🚚",
    title: "Delivery to Site",
    description: "Schedule delivery directly to your construction site, warehouse, or home address.",
  },
  {
    icon: "💬",
    title: "Expert Consultation",
    description: "Our team of building and finishing specialists can help you choose the right products.",
  },
];

function FeatureCard({ feature }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
      <div className="text-5xl mb-4">{feature.icon}</div>
      <h3 className="font-black text-gray-900 text-lg mb-2">{feature.title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
    </div>
  );
}

export default function KemetroWhyChoose() {
  return (
    <section className="w-full bg-[#0077B6] py-16">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white">Why Choose Kemetro?</h2>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}