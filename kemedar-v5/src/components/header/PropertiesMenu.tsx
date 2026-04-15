// @ts-nocheck
import Link from "next/link";

const PURPOSES = [
  { label: "For Sale", icon: "🏷️" },
  { label: "For Rent", icon: "🔑" },
  { label: "For Investment", icon: "📈" },
  { label: "For Daily Booking", icon: "📅" },
  { label: "In Auction", icon: "🔨" },
];

const SUITABLE_FOR = [
  "Residential", "Commercial", "Administrative", "Agriculture",
  "Touristic", "Industrial", "Medical", "Educational", "Sportive", "Co-working Space"
];

const PROPERTY_COLUMNS = [
  [
    { name: "Apartment", icon: "🏢" }, { name: "Condo", icon: "🏙️" }, { name: "Twinhouse", icon: "🏘️" },
    { name: "Shop", icon: "🏪" }, { name: "Clinic", icon: "🏥" }, { name: "Factory", icon: "🏭" },
    { name: "Building", icon: "🏗️" }, { name: "Oil Station", icon: "⛽" }, { name: "Workspace", icon: "💻" },
    { name: "Festival Halls", icon: "🎪" }, { name: "Mansion", icon: "🏰" }
  ],
  [
    { name: "House", icon: "🏠" }, { name: "Chalet", icon: "🏡" }, { name: "Townhouse", icon: "🏘️" },
    { name: "Warehouse", icon: "🏭" }, { name: "Hospital", icon: "🏨" }, { name: "Multiple Units", icon: "🏢" },
    { name: "Restaurant or Cafe", icon: "🍽️" }, { name: "Hotel or Motel", icon: "🛎️" },
    { name: "Training Room", icon: "📋" }, { name: "Conference Room", icon: "🎤" }
  ],
  [
    { name: "Land", icon: "🌍" }, { name: "Villa", icon: "🏛️" }, { name: "Palace", icon: "👑" },
    { name: "Office", icon: "💼" }, { name: "Farm", icon: "🌾" }, { name: "Room", icon: "🚪" },
    { name: "Mall", icon: "🛍️" }, { name: "Sports or Play", icon: "⚽" },
    { name: "Meeting Room", icon: "👥" }, { name: "Playground", icon: "🎠" }
  ]
];

export default function PropertiesMenu() {
  return (
    <div className="absolute top-full left-0 mt-0 bg-white rounded-b-xl shadow-2xl border border-gray-100 z-[150] w-[760px]">
      <div className="flex">
        {/* Sidebar quick links */}
        <div className="w-44 flex-shrink-0 bg-gray-50 border-r border-gray-100 py-4 px-3 flex flex-col gap-1">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Quick Links</p>
          <Link
            href="/m/find/filters"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors"
          >
            🔍 Find Property
          </Link>
          <Link
            href="/search-properties"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            🏘️ Browse Properties
          </Link>
        </div>

        {/* Property Types grid */}
        <div className="flex-1 py-3 px-4">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Property Types</p>
          <div className="grid grid-cols-3 gap-x-2">
            {PROPERTY_COLUMNS.map((col, ci) => (
              <div key={ci} className="flex flex-col">
                {col.map((item) => (
                  <Link
                    key={item.name}
                    href={`/search-properties?category=${encodeURIComponent(item.name)}`}
                    className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-gray-600 hover:text-[#FF6B00] hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <span className="text-xs leading-none">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}