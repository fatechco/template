import { Link } from "react-router-dom";

export default function KWHero() {
  return (
    <div
      className="relative w-full flex items-center"
      style={{
        minHeight: "600px",
        background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1600&q=80') center/cover no-repeat",
      }}
    >
      <div className="max-w-[1400px] mx-auto w-full px-6 py-16 flex flex-col md:flex-row items-center gap-10">
        {/* Left content */}
        <div className="flex-1 md:w-[60%] text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-6">
            🏠 HOME SERVICES MARKETPLACE
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            Kemework: Your Gateway to<br />Expert Home Solutions
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-light mb-4 leading-relaxed">
            Welcome to Kemework, your ultimate destination for connecting with skilled professionals who can transform your home into a dream space.
          </p>
          <p className="text-sm md:text-base text-gray-300 mb-8 leading-relaxed max-w-xl">
            Whether you need interior design, architecture, landscaping, home remodeling, or any home improvement — Kemework simplifies finding reliable professionals with transparent pricing and verified reviews.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/kemework/post-task"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-base text-white transition-all hover:opacity-90"
              style={{ background: "#C41230", minHeight: 52 }}
            >
              📋 Post Your Task
            </Link>
            <Link
              to="/kemework/find-professionals"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-base text-white border-2 border-white transition-all hover:bg-white hover:text-gray-900"
              style={{ minHeight: 52 }}
            >
              🔍 Find Professionals
            </Link>
          </div>
        </div>

        {/* Right: stats card */}
        <div className="w-full md:w-[40%] flex justify-center md:justify-end">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="font-black text-gray-900 text-lg mb-5">Why Choose Kemework?</h3>
            <div className="space-y-4">
              {[
                { icon: "🔧", value: "10,000+", label: "Skilled Professionals" },
                { icon: "📋", value: "50,000+", label: "Tasks Completed" },
                { icon: "⭐", value: "4.8", label: "Average Rating" },
                { icon: "🌍", value: "30+", label: "Countries" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="text-2xl w-10 text-center">{s.icon}</span>
                  <div>
                    <p className="font-black text-gray-900 text-base leading-none">{s.value}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/kemework/post-task"
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
              style={{ background: "#C41230" }}
            >
              Post Your First Task Free →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}