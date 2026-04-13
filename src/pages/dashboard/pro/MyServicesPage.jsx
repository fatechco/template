import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Eye, Pause, Trash2 } from "lucide-react";
import QRGeneratorWidget from "@/components/qr/QRGeneratorWidget";

const TABS = ["All", "Active", "Pending Approval", "Draft", "Paused"];

const STATUS_STYLES = {
  Active: "bg-green-100 text-green-700",
  "Pending Approval": "bg-amber-100 text-amber-700",
  Draft: "bg-gray-100 text-gray-500",
  Paused: "bg-blue-100 text-blue-700",
};

const MOCK_SERVICES = [
  { id: 1, title: "Full Home Interior Design & Furnishing Package", category: "Interior Design", image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=400&q=70", rating: 4.9, reviews: 64, orders: 12, revenue: 6800, currency: "USD", status: "Active" },
  { id: 2, title: "Electrical Wiring & Panel Installation", category: "Electrical", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=70", rating: 4.7, reviews: 28, orders: 8, revenue: 2400, currency: "USD", status: "Active" },
  { id: 3, title: "Custom Built-in Wardrobes & Cabinets", category: "Carpentry", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=70", rating: 0, reviews: 0, orders: 0, revenue: 0, currency: "USD", status: "Pending Approval" },
  { id: 4, title: "Bathroom Renovation Complete Package", category: "Plumbing", image: null, rating: 0, reviews: 0, orders: 0, revenue: 0, currency: "USD", status: "Draft" },
  { id: 5, title: "Garden Landscaping & Outdoor Design", category: "Landscaping", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70", rating: 4.8, reviews: 15, orders: 5, revenue: 1200, currency: "USD", status: "Paused" },
];

export default function MyServicesPage() {
  const [activeTab, setActiveTab] = useState("All");
  const filtered = MOCK_SERVICES.filter(s => activeTab === "All" || s.status === activeTab);

  return (
    <div className="min-h-screen" style={{ background: "#F8F5F0" }}>
      <div className="bg-white border-b border-gray-100 px-4 py-5">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-900">My Services</h1>
            <p className="text-sm text-gray-500">{MOCK_SERVICES.length} services total</p>
          </div>
          <Link to="/kemework/add-service" className="px-4 py-2 rounded-xl text-white text-sm font-bold" style={{ background: "#C41230" }}>
            + Add Service
          </Link>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 py-5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5">
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
              style={{ background: activeTab === t ? "#0D9488" : "#fff", color: activeTab === t ? "#fff" : "#374151", border: activeTab === t ? "none" : "1px solid #e5e7eb" }}>
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(svc => (
            <div key={svc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="h-40 bg-gray-100">
                {svc.image ? <img src={svc.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🔧</div>}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-black text-gray-900 text-sm line-clamp-2 flex-1">{svc.title}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_STYLES[svc.status]}`}>{svc.status}</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{svc.category}</p>
                {svc.reviews > 0 && <p className="text-xs text-gray-500 mb-1">⭐ {svc.rating} ({svc.reviews} reviews) · {svc.orders} orders</p>}
                {svc.revenue > 0 && <p className="text-xs font-black text-teal-700 mb-3">Revenue: ${svc.revenue.toLocaleString()}</p>}
                <div className="flex gap-1.5 mt-auto pt-2">
                  <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50">
                    <Pencil size={11} /> Edit
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50">
                    <Eye size={11} /> View
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50">
                    <Pause size={11} /> {svc.status === "Paused" ? "Resume" : "Pause"}
                  </button>
                  <button className="py-1.5 px-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
                    <Trash2 size={11} />
                  </button>
                  <QRGeneratorWidget targetType="service" targetId={String(svc.id)} targetTitle={svc.title} mode="compact" />
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-12">
              <p className="text-4xl mb-2">📦</p>
              <p className="text-gray-500 font-semibold">No services in this category</p>
              <Link to="/kemework/add-service" className="inline-block mt-4 px-5 py-2 rounded-xl text-white text-sm font-bold" style={{ background: "#C41230" }}>Add Your First Service</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}