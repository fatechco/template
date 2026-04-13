import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, Edit, Trash2, Copy, Rocket, ChevronLeft, ChevronRight } from "lucide-react";
import QRGeneratorWidget from "@/components/qr/QRGeneratorWidget";
import VerifyProSellerWidget from "@/components/verify/VerifyProSellerWidget";

const MOCK = [
  { id: 1, title: "Modern Apartment in New Cairo", purpose: "Sale", category: "Apartment", price: "$120,000", views: 234, status: "Active", date: "2025-01-15", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=80&q=70" },
  { id: 2, title: "Villa in Sheikh Zayed", purpose: "Sale", category: "Villa", price: "$450,000", views: 89, status: "Pending", date: "2025-02-10", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=80&q=70" },
  { id: 3, title: "Office Space Downtown Cairo", purpose: "Rent", category: "Office", price: "$2,500/mo", views: 56, status: "Active", date: "2025-03-01", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=80&q=70" },
  { id: 4, title: "Studio in Maadi", purpose: "Rent", category: "Studio", price: "$800/mo", views: 12, status: "Draft", date: "2025-03-10", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=80&q=70" },
  { id: 5, title: "Land in 6th of October", purpose: "Sale", category: "Land", price: "$90,000", views: 0, status: "Expired", date: "2024-12-01", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=80&q=70" },
];

const STATUS_COLORS = {
  Active: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Expired: "bg-red-100 text-red-700",
  Draft: "bg-gray-100 text-gray-600",
};

export default function MyProperties() {
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = statusFilter === "All" ? MOCK : MOCK.filter(p => p.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Properties</h1>
          <p className="text-gray-500 text-sm mt-0.5">{MOCK.length} total listings</p>
        </div>
        <Link to="/create/property" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition-colors">
          <Plus size={16} /> Add New Property
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {["All", "Active", "Pending", "Draft", "Expired"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${statusFilter === s ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Property</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Purpose</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Price</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Views</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className={`border-b border-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.title} className="w-12 h-10 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-gray-800 line-clamp-1">{p.title}</span>
                        <VerifyProSellerWidget propertyId={p.id} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.purpose}</td>
                  <td className="px-4 py-3 text-gray-600">{p.category}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{p.price}</td>
                  <td className="px-4 py-3 text-gray-600">{p.views}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{p.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button title="Edit" className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center transition-colors"><Edit size={14} /></button>
                      <button title="View" className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center justify-center transition-colors"><Eye size={14} /></button>
                      <button title="Boost" className="w-7 h-7 rounded-lg hover:bg-orange-50 text-orange-500 flex items-center justify-center transition-colors"><Rocket size={14} /></button>
                      <button title="Duplicate" className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center justify-center transition-colors"><Copy size={14} /></button>
                      <button title="Delete" className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center transition-colors"><Trash2 size={14} /></button>
                      <QRGeneratorWidget targetType="property" targetId={String(p.id)} targetTitle={p.title} mode="compact" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">Showing {filtered.length} of {MOCK.length}</p>
          <div className="flex gap-1">
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronLeft size={14} /></button>
            <button className="w-8 h-8 rounded-lg bg-orange-500 text-white text-sm font-bold flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}