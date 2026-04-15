// @ts-nocheck
import Link from "next/link";

const PREVIEW_IMAGES = [
  "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
];

export default function KemeKitsBanner() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div
        className="w-full flex flex-col lg:flex-row items-center gap-8 px-8 lg:px-12 py-10 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)",
          borderRadius: 20,
        }}
      >
        {/* LEFT */}
        <div className="flex-[6] min-w-0">
          <span className="inline-block bg-blue-500 text-white text-xs font-black px-3 py-1 rounded-full mb-4">
            ✨ NEW
          </span>
          <h2 className="text-white font-black leading-tight mb-3" style={{ fontSize: 30, lineHeight: 1.2 }}>
            Shop by Room — KemeKits™
          </h2>
          <p className="mb-6" style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, lineHeight: 1.6 }}>
            Don't guess how many boxes you need.<br />
            Pick a design, enter your room size,<br />
            and we calculate everything instantly.
          </p>
          <Link
            href="/kemetro/kemekits"
            className="inline-flex items-center gap-2 bg-white text-gray-900 font-black px-6 rounded-xl hover:bg-gray-100 transition-colors"
            style={{ height: 48 }}
          >
            🎨 Browse All Designs →
          </Link>
        </div>

        {/* RIGHT — stacked cards */}
        <div className="flex-[4] flex items-center justify-center relative" style={{ height: 180 }}>
          {PREVIEW_IMAGES.map((img, i) => (
            <div
              key={i}
              className="absolute rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20"
              style={{
                width: 120,
                height: 155,
                left: `${i * 48}px`,
                top: `${i % 2 === 0 ? 0 : 12}px`,
                transform: `rotate(${(i - 1) * 5}deg)`,
                zIndex: i,
              }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}