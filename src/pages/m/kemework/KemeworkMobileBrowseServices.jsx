import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Star, MapPin, ChevronLeft } from "lucide-react";
import { KEMEWORK_CATEGORIES } from "@/lib/kemeworkCategories";
import LocationAutocomplete from "@/components/kemework/LocationAutocomplete";

const MOCK_SERVICES = [
  { id: 1, title: "Modern Kitchen Renovation", provider: "Ahmed Hassan", rating: 4.9, reviews: 127, price: "From $2,500", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=70", category: "Interior Designers & Decorators", location: "Cairo, Egypt", bookings: 84 },
  { id: 2, title: "Electrical Wiring Installation", provider: "Sara Mohamed", rating: 4.8, reviews: 89, price: "From $500", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&q=70", category: "Electrical Services", location: "Dubai, UAE", bookings: 62 },
  { id: 3, title: "Professional Plumbing Services", provider: "Omar Khalid", rating: 4.7, reviews: 203, price: "From $300", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=70", category: "Plumbing Services", location: "Riyadh, Saudi Arabia", bookings: 145 },
  { id: 4, title: "Landscape & Garden Design", provider: "Layla Nour", rating: 4.9, reviews: 64, price: "From $1,200", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70", category: "Landscaping & Gardening", location: "Amman, Jordan", bookings: 41 },
  { id: 5, title: "Custom Woodwork & Carpentry", provider: "Kareem Saad", rating: 4.6, reviews: 156, price: "From $400", image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=300&q=70", category: "Carpentry & Woodwork", location: "Alexandria, Egypt", bookings: 112 },
  { id: 6, title: "Interior Design Consulting", provider: "Nadia Ali", rating: 5.0, reviews: 42, price: "From $800", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&q=70", category: "Interior Designers & Decorators", location: "Kuwait City, Kuwait", bookings: 30 },
];

function ServiceCard({ service }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/m/kemework/service/${service.id}`)} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer active:opacity-80 transition-opacity">
      <div className="relative h-32 bg-gray-200 overflow-hidden">
        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <p className="font-bold text-sm text-gray-900 line-clamp-2 mb-1">{service.title}</p>
        <div className="flex items-center gap-1 mb-2">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-gray-900">{service.rating}</span>
          <span className="text-xs text-gray-500">({service.reviews})</span>
        </div>
        <p className="text-xs text-gray-600 mb-1">{service.provider}</p>
        <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
          <MapPin size={11} /> {service.location}
        </p>
        <p className="font-bold text-sm" style={{ color: "#C41230" }}>{service.price}</p>
        <button className="w-full mt-2 py-2 rounded-lg text-white text-xs font-bold" style={{ background: "#C41230" }}>
          View Service
        </button>
      </div>
    </div>
  );
}

export default function KemeworkMobileBrowseServices() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Services");

  const filtered = MOCK_SERVICES.filter(service => {
    const searchMatch = !search || service.title.toLowerCase().includes(search.toLowerCase()) || service.provider.toLowerCase().includes(search.toLowerCase());
    const categoryMatch = selectedCategory === "All Services" || service.category === selectedCategory;
    const locationMatch = !location || service.location.toLowerCase().includes(location.toLowerCase());
    return searchMatch && categoryMatch && locationMatch;
  });

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-lg font-black text-gray-900">Browse Services</h1>
      </div>

      <div className="px-4 space-y-4 pt-4 pb-20">
        {/* Search by service name */}
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
          <Search size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search services..."
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400"
          />
        </div>

        {/* Location autocomplete */}
        <LocationAutocomplete value={location} onChange={setLocation} placeholder="Search by location..." />

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategory("All Services")}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${selectedCategory === "All Services" ? "text-white" : "border border-gray-300 text-gray-700 bg-white"}`}
            style={selectedCategory === "All Services" ? { background: "#C41230" } : {}}>
            All Services
          </button>
          {KEMEWORK_CATEGORIES.map(cat => (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${selectedCategory === cat.label ? "text-white" : "border border-gray-300 text-gray-700 bg-white"}`}
              style={selectedCategory === cat.label ? { background: "#C41230" } : {}}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-xs font-bold text-gray-500">{filtered.length} services found</p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">🔍</p>
            <p className="font-bold text-gray-700">No services found</p>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
}