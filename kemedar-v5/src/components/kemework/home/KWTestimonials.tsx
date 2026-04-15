// @ts-nocheck
const TESTIMONIALS = [
  {
    name: "Mohamed Al-Rashid",
    role: "Homeowner",
    roleColor: "#C41230",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=70",
    rating: 5,
    quote: "Kemework made finding a reliable interior designer so easy. I posted my task, received 8 bids within 24 hours, and hired an amazing designer who transformed my apartment completely. The whole process was smooth and transparent.",
    date: "Feb 2025",
  },
  {
    name: "Fatima Zahra",
    role: "Verified Professional",
    roleColor: "#16a34a",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=70",
    rating: 5,
    quote: "As an electrician, Kemework has completely changed my business. I get consistent job opportunities, my profile is verified which builds client trust, and the accreditation program gave me access to premium projects I wouldn't have found otherwise.",
    date: "Jan 2025",
  },
  {
    name: "Khalid Al-Mansoori",
    role: "Property Developer",
    roleColor: "#7c3aed",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=70",
    rating: 5,
    quote: "We use Kemework to staff all our villa renovation projects. The quality of professionals is excellent, and the Kemedar-managed service option is perfect when we need supervision and quality assurance for larger contracts.",
    date: "Mar 2025",
  },
];

export default function KWTestimonials() {
  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-10">What Our Users Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">⭐</span>
                ))}
              </div>
              {/* Quote */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6 italic">"{t.quote}"</p>
              {/* User */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-black text-gray-900 text-sm">{t.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: t.roleColor }}>{t.role}</span>
                    <span className="text-gray-400 text-xs">{t.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}