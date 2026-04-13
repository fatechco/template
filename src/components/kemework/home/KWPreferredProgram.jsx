import { Link } from "react-router-dom";

const BENEFITS = [
  { icon: "🎯", title: "Priority Assignments", desc: "Get direct task assignments from Kemedar team" },
  { icon: "🪪", title: "Official ID Card", desc: "Carry your Kemedar Professional ID badge" },
  { icon: "📚", title: "Exclusive Training", desc: "Access to workshops, mentors & certifications" },
  { icon: "💰", title: "Earn from Training", desc: "Share skills and earn from the community" },
];

export default function KWPreferredProgram() {
  return (
    <div className="w-full py-16 px-4" style={{ background: "#1a1a2e" }}>
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-12 items-center">
        {/* Left */}
        <div className="flex-1">
          <div className="text-5xl mb-4">🏅</div>
          <h2 className="text-3xl font-black text-white mb-4 leading-tight">
            Kemedar's Preferred<br />Professional Program
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-6">
            Join our exclusive accreditation program and receive direct task assignments from Kemedar, an official ID card, training access and professional recognition.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              "Zero Entry Fees",
              "Official Accreditation",
              "Priority Assignments",
              "Kemedar Professional ID Card",
              "Exclusive Training & Mentorship",
              "Collaborative Community",
            ].map(b => (
              <li key={b} className="flex items-center gap-2 text-white text-sm font-medium">
                <span className="text-green-400">✅</span> {b}
              </li>
            ))}
          </ul>
          <Link
            to="/kemework/accreditation"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{ background: "#D4A017", color: "#1a1a2e" }}
          >
            Join the Program →
          </Link>
        </div>

        {/* Right: 2×2 benefit cards */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {BENEFITS.map(b => (
            <div
              key={b.title}
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <span className="text-3xl">{b.icon}</span>
              <div>
                <p className="font-black text-white text-sm mb-1">{b.title}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}