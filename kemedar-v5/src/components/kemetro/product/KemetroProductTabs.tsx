"use client";
// @ts-nocheck
import { useState } from "react";

export default function KemetroProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "reviews", label: `Reviews (${product.totalReviews || 0})` },
    { id: "shipping", label: "Shipping & Returns" },
  ];

  const specs = [
    { label: "Brand", value: product.brand || "N/A" },
    { label: "Model", value: product.model || "N/A" },
    { label: "Origin", value: product.origin || "N/A" },
    { label: "Weight", value: product.weight ? `${product.weight} ${product.weightUnit || "kg"}` : "N/A" },
    { label: "Dimensions", value: product.dimensions || "N/A" },
    { label: "Material", value: product.material || "N/A" },
    { label: "Color", value: product.color || "N/A" },
    { label: "Warranty", value: product.warrantyMonths ? `${product.warrantyMonths} months` : "N/A" },
  ];

  const mockReviews = [
    {
      name: "Ahmed Hassan",
      rating: 5,
      date: "2025-02-20",
      comment: "Excellent quality, fast delivery!",
      verified: true,
    },
    {
      name: "Fatima Mohamed",
      rating: 4,
      date: "2025-02-15",
      comment: "Good product, packaging could be better",
      verified: true,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-6 py-4 font-bold text-center transition-colors ${
              activeTab === tab.id
                ? "text-[#FF6B00] border-b-2 border-[#FF6B00]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "description" && (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {product.description || "No description available"}
            </p>
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {specs.map((spec, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="px-4 py-3 font-semibold text-gray-900 w-1/3">{spec.label}</td>
                    <td className="px-4 py-3 text-gray-700">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            {/* Rating Summary */}
            <div className="flex items-center gap-8 pb-6 border-b">
              <div className="text-center">
                <div className="text-4xl font-black text-gray-900">{product.rating || 0}</div>
                <div className="text-yellow-400 text-xl">★★★★★</div>
                <p className="text-xs text-gray-500">{product.totalReviews || 0} reviews</p>
              </div>

              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-600 w-6">{stars}★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400" style={{ width: `${Math.random() * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-600 w-6">{Math.floor(Math.random() * 50)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {mockReviews.map((review, idx) => (
                <div key={idx} className="border-b pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">{review.name}</div>
                      <div className="text-yellow-400">{"★".repeat(review.rating)}</div>
                    </div>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">✓ Verified</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
              ))}
            </div>

            <button className="w-full bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold py-3 rounded-lg transition-colors">
              Write a Review
            </button>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Shipping Zones</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Zone</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Cost</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Estimated Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Cairo & Giza", "Upper Egypt", "Delta Region"].map((zone, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                        <td className="px-4 py-3 text-gray-700">{zone}</td>
                        <td className="px-4 py-3 text-gray-700">$5-15</td>
                        <td className="px-4 py-3 text-gray-700">3-5 days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Return Policy</h3>
              <p className="text-gray-700 leading-relaxed">
                We accept returns within 14 days of purchase. Items must be in original condition with all packaging intact.
                Return shipping is free for defective items. Contact our support team to initiate a return.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}