"use client";
// @ts-nocheck
import { useRouter } from "next/navigation";
import { Plus, Eye } from "lucide-react";

const MOCK_LISTINGS = [
  {
    id: 1,
    title: "Villa Sheikh Zayed",
    status: "Active",
    views: 324,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    title: "Studio Maadi",
    status: "Active",
    views: 156,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    title: "Office Downtown",
    status: "Pending",
    views: 42,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop",
  },
];

export default function MyListingsSection() {
  const router = useRouter();

  return (
    <div className="px-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-base font-black text-[#1F2937]">My Active Listings</p>
        <button className="text-xs font-bold text-[#FF6B00]">View All →</button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden divide-y divide-[#F3F4F6]">
        {MOCK_LISTINGS.map((listing) => (
          <div key={listing.id} className="flex items-center gap-3 p-3 active:bg-gray-50 transition-colors cursor-pointer">
            <img
              src={listing.image}
              alt={listing.title}
              className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1F2937] truncate">{listing.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: listing.status === "Active" ? "#D1FAE5" : "#FEF3C7",
                    color: listing.status === "Active" ? "#065F46" : "#92400E",
                  }}
                >
                  {listing.status}
                </span>
                <span className="text-[10px] text-[#6B7280] flex items-center gap-1">
                  <Eye size={10} />
                  {listing.views} views
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/create/property")}
        className="w-full mt-3 bg-[#FF6B00] text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 active:opacity-90 transition-opacity"
      >
        <Plus size={16} /> Add New Property
      </button>
    </div>
  );
}