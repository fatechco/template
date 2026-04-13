import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, X, Check, Copy, Star, Settings, Search, Plus, Heart, User } from "lucide-react";

const SERVICE = {
  id: 1, slug: "full-home-interior-design-furnishing",
  title: "Full Home Interior Design & Furnishing Package",
  category: "Interior Design",
  description: `We offer a comprehensive interior design service that transforms your living spaces into beautiful, functional environments.

Our service includes:
- Initial consultation and needs assessment
- Concept development and mood boards
- 3D visualization and floor planning
- Material and furniture selection
- Full project management and supervision
- Final installation and styling

With over 8 years of experience, we've completed 100+ projects across the MENA region. Our team includes certified interior designers, 3D visualization specialists, and project managers who ensure every detail is perfect.

We work with a curated network of furniture suppliers and craftsmen to deliver high-quality results within your budget and timeline.`,
  images: [
    "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&q=80",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  ],
  packages: [
    { name: "Basic", price: 500, delivery: 14, revisions: 2, features: ["1 Room Design", "2D Floor Plan", "Mood Board", "Material List", "Email Support"] },
    { name: "Standard", price: 1200, delivery: 21, revisions: 3, features: ["Up to 3 Rooms", "3D Visualization", "Mood Board", "Material & Furniture List", "1 On-site Visit", "Whatsapp Support"] },
    { name: "Premium", price: 2500, delivery: 30, revisions: 5, features: ["Full Home (unlimited rooms)", "Full 3D Render", "Furniture Sourcing", "Project Management", "3 On-site Visits", "24/7 Support", "Post-delivery Follow-up"] },
  ],
  pro: {
    id: 1, name: "Ahmed Hassan", username: "ahmed-hassan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=70",
    rating: 4.9, reviews: 127, tasks: 84, responseRate: 98, verified: true, accredited: true,
  },
  rating: 4.9, totalReviews: 64, ratingBreakdown: { 5: 48, 4: 10, 3: 4, 2: 1, 1: 1 },
  reviews: [
    { id: 1, user: "Fatima Al-Zahra", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=70", rating: 5, date: "Feb 2025", comment: "Ahmed transformed my apartment beyond my expectations. The 3D renders were spot-on and the actual result was even better. Highly recommended!" },
    { id: 2, user: "Khalid Al-Mansoori", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=70", rating: 5, date: "Jan 2025", comment: "Professional, punctual, and creative. He understood our vision immediately and delivered a stunning design for our villa." },
    { id: 3, user: "Nora Hassan", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&q=70", rating: 4, date: "Dec 2024", comment: "Great service overall. Minor delays but the final result was excellent and worth it." },
  ],
};

function Gallery({ images }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden mb-2 bg-gray-100" style={{ height: 200 }}>
        <img src={images[active]} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {images.map((img, i) => (
          <img key={i} src={img} alt="" onClick={() => setActive(i)} className={`w-12 h-12 rounded-lg object-cover flex-shrink-0 cursor-pointer border-2 transition-all ${active === i ? "border-red-600" : "border-transparent"}`} />
        ))}
      </div>
    </div>
  );
}

function RatingBar({ label, count, total }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-6">{label}★</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-yellow-400" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-5 text-right">{count}</span>
    </div>
  );
}

export default function KemeworkMobileServiceDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const svc = SERVICE;
  const [activePkg, setActivePkg] = useState(1);
  const [expanded, setExpanded] = useState(false);

  const pkg = svc.packages[activePkg];
  const total = Object.values(svc.ratingBreakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-base font-bold text-gray-900 flex-1">{svc.title}</h1>
      </div>

      <div className="px-4 py-4 pb-32 space-y-4">
        {/* Gallery */}
        <div className="bg-white rounded-2xl border border-gray-100 p-3">
          <Gallery images={svc.images} />
        </div>

        {/* Pro Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <img src={svc.pro.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-gray-100" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-xs">{svc.pro.name}</p>
              <p className="text-xs text-gray-500">⭐ {svc.pro.rating} ({svc.pro.reviews})</p>
            </div>
            {svc.pro.verified && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 flex-shrink-0">✅</span>}
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {expanded ? svc.description : svc.description.slice(0, 150) + "..."}
          </p>
          <button onClick={() => setExpanded(e => !e)} className="mt-2 text-xs font-bold" style={{ color: "#C41230" }}>
            {expanded ? "Show Less" : "Read More"}
          </button>
        </div>

        {/* Packages */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="font-black text-gray-900 text-sm mb-3">Pricing Packages</h3>
          <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
            {svc.packages.map((p, i) => (
              <button key={p.name} onClick={() => setActivePkg(i)} className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors" style={{ background: activePkg === i ? "#C41230" : "#F3F4F6", color: activePkg === i ? "#fff" : "#374151" }}>
                {p.name}
              </button>
            ))}
          </div>
          <div className="border border-gray-100 rounded-xl p-3">
            <p className="text-2xl font-black mb-1" style={{ color: "#C41230" }}>${pkg.price}</p>
            <div className="flex gap-2 text-xs text-gray-500 mb-3">
              <span>📦 {pkg.delivery}d</span>
              <span>🔄 {pkg.revisions} revisions</span>
            </div>
            <ul className="flex flex-col gap-1 mb-3">
              {pkg.features.slice(0, 3).map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                  <Check size={12} className="text-green-600 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-2.5 rounded-lg font-bold text-white text-xs" style={{ background: "#C41230" }}>
              Order Now
            </button>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="font-black text-gray-900 text-sm mb-3">Reviews ({svc.totalReviews})</h3>
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <div className="text-center">
              <p className="text-3xl font-black text-yellow-500">{svc.rating}</p>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(n => <Star key={n} size={12} className={n <= Math.round(svc.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />)}
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              {[5, 4, 3, 2, 1].map(r => <RatingBar key={r} label={r} count={svc.ratingBreakdown[r]} total={total} />)}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {svc.reviews.slice(0, 2).map(r => (
              <div key={r.id} className="pb-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <img src={r.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-xs">{r.user}</p>
                    <div className="flex gap-1 items-center">
                      <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(n => <Star key={n} size={9} className={n <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />)}</div>
                      <span className="text-[10px] text-gray-400">{r.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 space-y-2 pb-28">
        <button className="w-full py-2.5 rounded-lg font-bold text-white text-sm" style={{ background: "#C41230" }}>
          Order This Service
        </button>
        <div className="flex gap-2">
          <button className="flex-1 py-2.5 rounded-lg font-bold border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
            💬 Chat
          </button>
          <button className="flex-1 py-2.5 rounded-lg font-bold border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
            📞 Call
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-around">
        <button onClick={() => navigate("/m/settings")} className="flex flex-col items-center gap-1 py-2">
          <Settings size={20} className="text-gray-500" />
          <span className="text-[9px] font-bold text-gray-500">Settings</span>
        </button>
        <button onClick={() => navigate("/m/find")} className="flex flex-col items-center gap-1 py-2">
          <Search size={20} className="text-gray-500" />
          <span className="text-[9px] font-bold text-gray-500">Find</span>
        </button>
        <button onClick={() => navigate("/m/add")} className="flex flex-col items-center gap-1 py-2">
          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "#FF6B00" }}>
            <Plus size={22} className="text-white" />
          </div>
          <span className="text-[9px] font-bold text-gray-500">Add</span>
        </button>
        <button onClick={() => navigate("/m/buy")} className="flex flex-col items-center gap-1 py-2">
          <Heart size={20} className="text-gray-500" />
          <span className="text-[9px] font-bold text-gray-500">Buy</span>
        </button>
        <button onClick={() => navigate("/m/account")} className="flex flex-col items-center gap-1 py-2">
          <User size={20} className="text-gray-500" />
          <span className="text-[9px] font-bold text-gray-500">Account</span>
        </button>
      </div>
    </div>
  );
}