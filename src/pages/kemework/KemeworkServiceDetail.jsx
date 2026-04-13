import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, X, Check, Copy, Star } from "lucide-react";

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

const SUGGESTED = [
  { id: 2, title: "Electrical Wiring & Panel Installation", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&q=70", pro: "Sara Mohamed", from: 80, rating: 4.8 },
  { id: 3, title: "Bathroom Renovation & Plumbing", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&q=70", pro: "Omar Khalid", from: 150, rating: 4.7 },
  { id: 4, title: "Garden Landscaping Design", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70", pro: "Layla Nour", from: 200, rating: 4.9 },
  { id: 5, title: "Custom Wardrobes & Cabinets", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=70", pro: "Kareem Saad", from: 300, rating: 4.6 },
];

function Gallery({ images }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden mb-3 cursor-pointer bg-gray-100" style={{ height: 300 }} onClick={() => setLightbox(true)}>
        <img src={images[active]} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
          <span className="bg-white/90 rounded-full px-4 py-2 text-xs font-bold text-gray-800">🔍 View Full Size</span>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {images.map((img, i) => (
          <img key={i} src={img} alt="" onClick={() => setActive(i)} className={`w-16 h-16 rounded-xl object-cover flex-shrink-0 cursor-pointer border-2 transition-all ${active === i ? "border-red-600" : "border-transparent hover:border-gray-300"}`} />
        ))}
      </div>
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
          <img src={images[active]} alt="" className="max-h-[90vh] max-w-full rounded-xl" />
          <button className="absolute top-4 right-4 text-white"><X size={28} /></button>
        </div>
      )}
    </div>
  );
}

function ShareRow() {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div>
      <p className="text-xs font-bold text-gray-500 mb-2">Share This Service:</p>
      <div className="flex gap-2 flex-wrap">
        {["📧", "f", "🐦", "in", "💬"].map((icon, i) => (
          <button key={i} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 transition-colors">{icon}</button>
        ))}
        <button onClick={copy} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
          {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} className="text-gray-600" />}
        </button>
      </div>
    </div>
  );
}

function RatingBar({ label, count, total }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-8">{label}★</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-yellow-400" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
    </div>
  );
}

export default function KemeworkServiceDetail() {
  const { slug } = useParams();
  const svc = SERVICE;
  const [activePkg, setActivePkg] = useState(1); // index
  const [expanded, setExpanded] = useState(false);

  const pkg = svc.packages[activePkg];
  const total = Object.values(svc.ratingBreakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen" style={{ background: "#F8F5F0" }}>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center gap-1.5 text-xs text-gray-500">
          <Link to="/kemework" className="hover:text-red-700">Home</Link>
          <ChevronRight size={12} />
          <Link to="/kemework/services" className="hover:text-red-700">Services</Link>
          <ChevronRight size={12} />
          <span className="text-gray-800 font-medium">{svc.category}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            {/* Title + pro strip */}
            <div>
              <h1 className="text-2xl font-black text-gray-900 mb-3">{svc.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <img src={svc.pro.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-gray-100" />
                <Link to={`/kemework/freelancer/${svc.pro.username}`} className="font-bold text-gray-900 text-sm hover:text-red-700">{svc.pro.name}</Link>
                <span className="text-sm text-gray-500">⭐ {svc.pro.rating} ({svc.pro.reviews} reviews)</span>
                {svc.pro.verified && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">✅ Verified</span>}
                {svc.pro.accredited && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#FFF8E1", color: "#B8860B" }}>🏅 Accredited</span>}
              </div>
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <Gallery images={svc.images} />
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-black text-gray-900 text-base mb-3">About This Service</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {expanded ? svc.description : svc.description.slice(0, 300) + "..."}
              </p>
              <button onClick={() => setExpanded(e => !e)} className="mt-3 text-sm font-bold" style={{ color: "#C41230" }}>
                {expanded ? "Show Less ↑" : "Read More ↓"}
              </button>
            </div>

            {/* Packages */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-black text-gray-900 text-base mb-4">Pricing Packages</h2>
              {/* Tabs */}
              <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-5">
                {svc.packages.map((p, i) => (
                  <button key={p.name} onClick={() => setActivePkg(i)} className="flex-1 py-2.5 text-sm font-bold transition-colors" style={{ background: activePkg === i ? "#C41230" : "transparent", color: activePkg === i ? "#fff" : "#374151" }}>
                    {p.name}
                  </button>
                ))}
              </div>
              {/* Active package */}
              <div className="border border-gray-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-gray-900">{svc.packages[activePkg].name} Package</h3>
                  <p className="text-3xl font-black" style={{ color: "#C41230" }}>${svc.packages[activePkg].price.toLocaleString()}</p>
                </div>
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <span>📦 {svc.packages[activePkg].delivery} days delivery</span>
                  <span>🔄 {svc.packages[activePkg].revisions} revisions</span>
                </div>
                <p className="text-xs font-bold text-gray-700 mb-2">What's Included:</p>
                <ul className="flex flex-col gap-1.5 mb-5">
                  {svc.packages[activePkg].features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check size={14} className="text-green-600 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 rounded-xl font-bold text-white text-sm" style={{ background: "#C41230" }}>
                  Join to Order This Service →
                </button>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-black text-gray-900 text-base mb-4">Client Reviews ({svc.totalReviews})</h2>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="text-center">
                  <p className="text-5xl font-black text-yellow-500 mb-1">{svc.rating}</p>
                  <div className="flex gap-0.5 justify-center mb-1">
                    {[1, 2, 3, 4, 5].map(n => <Star key={n} size={14} className={n <= Math.round(svc.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />)}
                  </div>
                  <p className="text-xs text-gray-400">{svc.totalReviews} reviews</p>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  {[5, 4, 3, 2, 1].map(r => <RatingBar key={r} label={r} count={svc.ratingBreakdown[r]} total={total} />)}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {svc.reviews.map(r => (
                  <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={r.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{r.user}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(n => <Star key={n} size={11} className={n <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />)}</div>
                          <span className="text-xs text-gray-400">{r.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-4">
            {/* Package Selector Card (sticky) */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-4">
              <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-4">
                {svc.packages.map((p, i) => (
                  <button key={p.name} onClick={() => setActivePkg(i)} className="flex-1 py-2 text-xs font-bold transition-colors" style={{ background: activePkg === i ? "#C41230" : "transparent", color: activePkg === i ? "#fff" : "#374151" }}>
                    {p.name}
                  </button>
                ))}
              </div>
              <div className="mb-4">
                <p className="text-3xl font-black mb-1" style={{ color: "#C41230" }}>${pkg.price.toLocaleString()}</p>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span>📦 {pkg.delivery}d delivery</span>
                  <span>🔄 {pkg.revisions} revisions</span>
                </div>
              </div>
              <ul className="flex flex-col gap-1.5 mb-5">
                {pkg.features.slice(0, 3).map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                    <Check size={12} className="text-green-600 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl font-bold text-white text-sm mb-2" style={{ background: "#C41230" }}>Order Now →</button>
              <button className="w-full py-2.5 rounded-xl font-bold text-sm border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-colors">💬 Contact Professional</button>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <ShareRow />
              </div>
            </div>

            {/* Pro mini card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <img src={svc.pro.avatar} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-gray-100" />
                <div>
                  <p className="font-black text-gray-900 text-sm">{svc.pro.name}</p>
                  <p className="text-xs text-gray-500">⭐ {svc.pro.rating} ({svc.pro.reviews} reviews)</p>
                </div>
              </div>
              <div className="flex gap-4 text-xs text-gray-500 mb-3">
                <span>✅ {svc.pro.tasks} tasks done</span>
                <span>⚡ {svc.pro.responseRate}% response</span>
              </div>
              <Link to={`/kemework/freelancer/${svc.pro.username}`} className="block text-center text-sm font-bold py-2 rounded-xl border-2 transition-colors" style={{ borderColor: "#C41230", color: "#C41230" }}>
                View Full Profile →
              </Link>
            </div>
          </div>
        </div>

        {/* Suggested Services */}
        <div className="mt-8">
          <h2 className="text-xl font-black text-gray-900 mb-4">Suggested Services</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {SUGGESTED.map(s => (
              <Link key={s.id} to={`/kemework/service/${s.id}`} className="flex-shrink-0 w-56 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow block">
                <img src={s.image} alt="" className="w-full h-32 object-cover" />
                <div className="p-3">
                  <p className="font-bold text-gray-900 text-xs line-clamp-2 mb-1">{s.title}</p>
                  <p className="text-xs text-gray-400 mb-1">by {s.pro} · ⭐ {s.rating}</p>
                  <p className="font-black text-sm" style={{ color: "#C41230" }}>From ${s.from}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}