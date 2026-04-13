import { useState } from 'react';
import { Plus, Edit2, Eye, Zap, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PROPERTIES = [
  {
    id: 1,
    title: 'Modern Villa in 5th Settlement',
    price: '$450,000',
    location: 'New Cairo, Giza',
    category: 'Villa',
    purpose: 'Sale',
    status: 'active',
    views: 234,
    image: '🏡',
  },
  {
    id: 2,
    title: 'Luxury Apartment Zamalek',
    price: '$280,000',
    location: 'Zamalek, Cairo',
    category: 'Apartment',
    purpose: 'Sale',
    status: 'active',
    views: 156,
    image: '🏢',
  },
  {
    id: 3,
    title: 'Studio Flat for Rent',
    price: '$800/month',
    location: 'Downtown, Cairo',
    category: 'Studio',
    purpose: 'Rent',
    status: 'pending',
    views: 45,
    image: '🏠',
  },
];

const FILTERS = ['All', 'Active', 'Pending', 'Draft', 'Expired'];

export default function MobileDashboardMyProperties() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered =
    activeFilter === 'All'
      ? PROPERTIES
      : PROPERTIES.filter((p) => p.status === activeFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Filter Tabs */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Properties List */}
      <div className="px-4 py-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-medium">No properties found</p>
          </div>
        ) : (
          filtered.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Header */}
              <div className="flex gap-3 p-3">
                <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-3xl flex-shrink-0">
                  {property.image}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm line-clamp-2">
                    {property.title}
                  </p>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                      {property.category}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                      {property.purpose}
                    </span>
                  </div>
                  <p className="text-sm font-black text-orange-600 mt-1.5">
                    {property.price}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-bold rounded-full flex-shrink-0 ${
                    property.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {property.status === 'active' ? 'Active' : 'Pending'}
                </span>
              </div>

              {/* Location & Views */}
              <div className="px-3 py-2 border-t border-gray-100 text-xs text-gray-600">
                <p>📍 {property.location}</p>
                <p className="mt-1">👁 {property.views} views</p>
              </div>

              {/* Actions */}
              <div className="px-3 py-3 border-t border-gray-100 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded transition-colors">
                  <Edit2 size={14} /> Edit
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-bold text-purple-600 hover:bg-purple-50 rounded transition-colors">
                  <Eye size={14} /> View
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 rounded transition-colors">
                  <Zap size={14} /> Boost
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded transition-colors">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Property Button */}
      <button
        onClick={() => navigate('/m/add/property')}
        className="fixed bottom-8 right-4 w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-700 transition-colors active:scale-95"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}