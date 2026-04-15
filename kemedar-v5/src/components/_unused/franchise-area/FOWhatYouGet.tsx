// @ts-nocheck
import { Check } from "lucide-react";

const CHECKLIST = [
  "Exclusive area license and territory rights",
  "Full access to Kemedar Super App platform",
  "Kemodoo admin system to manage your office",
  "Comprehensive onboarding and training program",
  "Marketing materials and branded collateral",
  "Dedicated support from Kemedar HQ",
  "Access to Kemedar's global database and tools",
  "Country Franchise Owner supervision and mentoring",
  "Revenue sharing system and monthly reporting",
  "Access to Kemecademy training courses",
  "Kemedar verified badge for your profile",
  "Priority listing on the Franchise Owners map",
];

export default function FOWhatYouGet() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl xl:text-4xl font-black text-gray-900 mb-4">Everything You Need to Succeed</h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Kemedar provides you with the full toolkit to run a professional real estate tech business
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left illustration */}
          <div className="flex-1 grid grid-cols-3 gap-4">
            {["🏢", "📱", "🌍", "📊", "🎓", "🤝", "💼", "🔒", "⭐"].map((icon, i) => (
              <div key={i} className="aspect-square bg-gradient-to-br from-[#FF6B00]/10 to-orange-50 rounded-2xl flex items-center justify-center text-4xl hover:from-[#FF6B00]/20 transition-all">
                {icon}
              </div>
            ))}
          </div>
          {/* Right checklist */}
          <div className="flex-1">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHECKLIST.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-[#FF6B00]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} className="text-[#FF6B00]" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}