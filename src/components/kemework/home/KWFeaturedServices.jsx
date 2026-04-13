import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SERVICES = [
  { id: 1, title: "Full Home Interior Design & Furnishing Package", image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=400&q=70", pro: { name: "Ahmed Hassan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=70" }, rating: 4.9, reviews: 64, location: "Cairo, Egypt", delivery: 30, from: 500 },
  { id: 2, title: "Electrical Wiring & Panel Installation Service", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=70", pro: { name: "Sara Mohamed", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&q=70" }, rating: 4.8, reviews: 89, location: "Dubai, UAE", delivery: 3, from: 80 },
  { id: 3, title: "Bathroom Renovation & Plumbing Upgrade", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=70", pro: { name: "Omar Khalid", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&q=70" }, rating: 4.7, reviews: 112, location: "Riyadh, KSA", delivery: 7, from: 150 },
  { id: 4, title: "Garden Landscaping & Outdoor Lighting Design", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70", pro: { name: "Layla Nour", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&q=70" }, rating: 4.9, reviews: 41, location: "Amman, Jordan", delivery: 14, from: 200 },
  { id: 5, title: "Custom Built-in Wardrobes & Kitchen Cabinets", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=70", pro: { name: "Kareem Saad", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&q=70" }, rating: 4.6, reviews: 78, location: "Alexandria, Egypt", delivery: 21, from: 300 },
  { id: 6, title: "Deep Home Cleaning & Sanitization Package", image: "https://images.unsplash.com/photo-1527515637462-cff94aca208b?w=400&q=70", pro: { name: "Nadia Ali", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&q=70" }, rating: 5.0, reviews: 203, location: "Kuwait City, Kuwait", delivery: 1, from: 40 },
];

export default function KWFeaturedServices() {
  const [page, setPage] = useState(0);
  const perPage = 4;
  const totalPages = Math.ceil(SERVICES.length / perPage);
  const visible = SERVICES.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-8">Popular Services</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visible.map(svc => (
            <Link key={svc.id} to={`/kemework/service/${svc.id}`} className="block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              {/* Image */}
              <div className="relative h-44 bg-gray-200">
                <img src={svc.image} alt={svc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {/* Pro mini info */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/50 rounded-full px-2 py-1">
                  <img src={svc.pro.avatar} alt={svc.pro.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-white text-[10px] font-semibold">{svc.pro.name}</span>
                </div>
              </div>
              {/* Info */}
              <div className="p-4">
                <p className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">{svc.title}</p>
                <p className="text-xs text-gray-400 mb-1">⭐ {svc.rating} ({svc.reviews} reviews)</p>
                <p className="text-xs text-gray-400 mb-1">📍 {svc.location}</p>
                <p className="text-xs text-gray-400 mb-3">Delivery: {svc.delivery} day{svc.delivery > 1 ? "s" : ""}</p>
                <p className="font-black text-base" style={{ color: "#C41230" }}>From ${svc.from}</p>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-gray-50">
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i)} className="w-2 h-2 rounded-full transition-colors" style={{ background: i === page ? "#C41230" : "#d1d5db" }} />
              ))}
            </div>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-gray-50">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}