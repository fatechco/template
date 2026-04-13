import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, Search, ChevronDown } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";
import ShipmentList from "@/components/seller-mobile/shipments/ShipmentList";
import ShipmentDetail from "@/components/seller-mobile/shipments/ShipmentDetail";
import SellerMobileDrawer from "@/components/seller/SellerMobileDrawer";

const MOCK_SHIPMENTS = [
  {
    id: "SHP-KT-001",
    orderId: "ORD-KT-001",
    status: "In Transit",
    from: "Cairo",
    to: "Alexandria",
    address_from: "15 Zamalek St, Zamalek, Cairo",
    address_to: "42 Saray St, Sidi Bishr, Alexandria",
    weight: "2.5kg",
    type: "Electronics",
    distance: "225km",
    agreed_price: 85.00,
    shipper: { name: "Ahmed Hassan", rating: 4.8, vehicle: "Van" },
    created: "2025-03-18",
    estimated_delivery: "2025-03-20",
  },
  {
    id: "SHP-KT-002",
    orderId: "ORD-KT-002",
    status: "Pending Pickup",
    from: "Giza",
    to: "Cairo",
    address_from: "100 Ring Rd, Giza",
    address_to: "Downtown Mall, Cairo",
    weight: "1.2kg",
    type: "Clothing",
    distance: "35km",
    agreed_price: 45.00,
    shipper: null,
    created: "2025-03-19",
  },
  {
    id: "SHP-KT-003",
    orderId: "ORD-KT-003",
    status: "Delivered",
    from: "Cairo",
    to: "Giza",
    address_from: "Nasr City, Cairo",
    address_to: "Sheikh Zayed, Giza",
    weight: "0.8kg",
    type: "Books",
    distance: "25km",
    agreed_price: 35.00,
    shipper: { name: "Fatima Ali", rating: 4.9, vehicle: "Motorcycle" },
    created: "2025-03-15",
    delivered: "2025-03-17",
  },
];

export default function SellerShipmentsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Pending Pickup", "In Transit", "Delivered", "Failed", "Cancelled"];

  const filtered = MOCK_SHIPMENTS.filter((s) => {
    const matchFilter = activeFilter === "All" || s.status === activeFilter;
    const matchSearch = s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.orderId.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const selectedShipment = id ? MOCK_SHIPMENTS.find((s) => s.id === id) : null;

  if (selectedShipment) {
    return (
      <div className="min-h-screen bg-gray-50 pb-8 flex items-start justify-center">
        <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col">
          <SellerMobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={null} />
          <MobileTopBar
            title={selectedShipment.id}
            showBack
            rightAction={<button className="p-1"><Search size={20} className="text-gray-700" /></button>}
          />
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <ShipmentDetail shipment={selectedShipment} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex items-start justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col">
        <SellerMobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={null} />
        <MobileTopBar
          title="My Shipments"
          rightAction={
            <button onClick={() => setDrawerOpen(true)} className="p-1">
              <Menu size={22} className="text-gray-700" />
            </button>
          }
        />

        {/* Search */}
        <div className="sticky top-14 z-30 bg-white border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search SHP# or order#..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="sticky top-24 z-20 bg-white border-b border-gray-100 px-4 py-3 overflow-x-auto">
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex-shrink-0 ${
                  activeFilter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f} ({MOCK_SHIPMENTS.filter((s) => f === "All" || s.status === f).length})
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">{filtered.length} shipments</p>
            <button className="text-sm font-bold text-blue-600 flex items-center gap-1">
              Sort <ChevronDown size={14} />
            </button>
          </div>

          <ShipmentList
            shipments={filtered}
            onSelect={(shipment) => navigate(`/m/dashboard/seller-shipments/${shipment.id}`)}
          />

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">No shipments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}