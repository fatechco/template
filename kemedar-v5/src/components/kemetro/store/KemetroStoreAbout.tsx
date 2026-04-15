"use client";
// @ts-nocheck
import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function KemetroStoreAbout({ store }) {
  const [showPhone, setShowPhone] = useState(false);

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="col-span-2 space-y-6">
        {/* Description */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-3">About {store.storeName}</h3>
          <p className="text-gray-700 leading-relaxed">{store.description}</p>
        </div>

        {/* Store Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-3xl font-black text-[#FF6B00]">{store.totalProducts}</p>
            <p className="text-gray-600 text-sm mt-1">Products</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-3xl font-black text-[#FF6B00]">{store.totalSales}</p>
            <p className="text-gray-600 text-sm mt-1">Total Sales</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-3xl font-black text-[#FF6B00]">{store.totalReviews}</p>
            <p className="text-gray-600 text-sm mt-1">Reviews</p>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Store Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-64">
          <h3 className="font-bold text-gray-900 mb-4">Store Information</h3>

          {/* Location */}
          <div className="mb-4 pb-4 border-b">
            <div className="flex gap-2 mb-2">
              <MapPin size={18} className="text-[#FF6B00] flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">{store.city}, {store.country}</p>
                <p className="text-xs text-gray-600">{store.address}</p>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="mb-4 pb-4 border-b">
            <div className="flex gap-2">
              <Clock size={18} className="text-[#FF6B00] flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">Response Time</p>
                <p className="font-semibold text-gray-900">{store.responseTime}</p>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="mb-4 pb-4 border-b">
            <button
              onClick={() => setShowPhone(!showPhone)}
              className="flex gap-2 w-full"
            >
              <Phone size={18} className="text-[#FF6B00] flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold text-gray-900">
                  {showPhone ? store.phone : "Click to reveal"}
                </p>
              </div>
            </button>
          </div>

          {/* WhatsApp */}
          <button className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-lg transition-colors">
            <MessageCircle size={16} />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}