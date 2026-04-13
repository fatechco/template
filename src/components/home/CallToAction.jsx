import { Link } from "react-router-dom";
import { Plus, UserPlus } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="w-full py-16 bg-gradient-to-r from-[#FF6B00] via-[#ff8c00] to-[#e55f00] relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl" />

      <div className="relative max-w-[1400px] mx-auto px-4 flex flex-col items-center text-center gap-6">
        <h2 className="text-3xl xl:text-4xl font-black text-white">Ready to List Your Property?</h2>
        <p className="text-white/80 text-base max-w-xl">
          Join millions of property owners, agents, and developers on Kemedar — the region's #1 proptech platform.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/create/property" className="flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-[#FF6B00] font-bold px-7 py-3 rounded-xl transition-all text-sm">
            <Plus size={16} /> List Property Now
          </Link>
          <Link to="/find-profile/real-estate-agents" className="flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-[#FF6B00] font-bold px-7 py-3 rounded-xl transition-all text-sm">
            <UserPlus size={16} /> Register as Agent
          </Link>
        </div>
      </div>
    </section>
  );
}