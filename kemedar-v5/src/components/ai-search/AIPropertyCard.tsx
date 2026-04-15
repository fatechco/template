"use client";
// @ts-nocheck
import { useState } from 'react';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import Link from 'next/link';
import AIMatchScoreBadge from './AIMatchScoreBadge';

function formatPrice(price, currency) {
  if (!price) return 'Price on request';
  return `${currency || 'EGP'} ${Number(price).toLocaleString()}`;
}

export default function AIPropertyCard({ property: p, insight, onViewAnalysis }) {
  const [expanded, setExpanded] = useState(false);
  const score = p._matchScore || 0;
  const matchPoints = insight?.matchPoints || [];
  const concern = insight?.concern;
  const insightText = insight?.insight;

  const img = p.main_image || p.images?.[0] || p.photos?.[0] ||
    `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80`;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex gap-0">
        {/* Image */}
        <div className="relative w-[40%] min-w-[140px] flex-shrink-0">
          <img src={img} alt={p.title} className="w-full h-full object-cover" style={{ minHeight: 160 }} />
          <div className="absolute top-2 right-2">
            <AIMatchScoreBadge score={score} />
          </div>
          {p.purpose && (
            <span className="absolute bottom-2 left-2 bg-[#FF6B00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {p.purpose}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div>
            <p className="font-black text-gray-900 text-sm leading-snug line-clamp-2">
              {p.title || p.name || 'Property Listing'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              📍 {[p.district_name, p.city_name].filter(Boolean).join(', ') || 'Location TBD'}
            </p>
            <p className="text-base font-black text-[#FF6B00] mt-1">
              {formatPrice(p.price_amount || p.price, p.currency)}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              {(p.beds || p.bedrooms) > 0 && <span>🛏 {p.beds || p.bedrooms} Beds</span>}
              {(p.baths || p.bathrooms) > 0 && <span>🚿 {p.baths || p.bathrooms} Baths</span>}
              {(p.area_size || p.property_area) > 0 && <span>📐 {p.area_size || p.property_area} m²</span>}
            </div>
          </div>

          {/* Match points */}
          {matchPoints.length > 0 && (
            <div className="mt-2 space-y-0.5">
              {matchPoints.slice(0, 2).map((pt, i) => (
                <p key={i} className="text-[11px] text-gray-500 flex items-start gap-1">
                  <span className="text-green-500 flex-shrink-0">✅</span>
                  <span className="line-clamp-1">{pt}</span>
                </p>
              ))}
              {concern && (
                <p className="text-[11px] text-amber-600 flex items-start gap-1">
                  <span className="flex-shrink-0">⚠️</span>
                  <span className="line-clamp-1">{concern}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Insight expandable */}
      {insightText && (
        <div className="border-t border-gray-100 px-4 py-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-purple-600 font-semibold hover:text-purple-800"
          >
            💡 AI Insight
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {expanded && (
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">{insightText}</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex border-t border-gray-100">
        <Link
          href={`/property/${p.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[#FF6B00] hover:bg-orange-50 transition-colors border-r border-gray-100"
        >
          <Eye size={13} /> View Property
        </Link>
        <button
          onClick={() => onViewAnalysis && onViewAnalysis(p, insight)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-purple-600 hover:bg-purple-50 transition-colors"
        >
          🔍 Why this matches?
        </button>
      </div>
    </div>
  );
}