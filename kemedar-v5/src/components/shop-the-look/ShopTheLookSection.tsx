"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

/**
 * Shop the Look section for PropertyDetails page.
 * Shows shoppable image thumbnails + featured hotspot pills.
 * Props:
 *   propertyId: string
 *   images: string[] — the property image URLs
 *   onOpenLightbox: (imageIndex: number, shopMode: boolean) => void
 */
export default function ShopTheLookSection({ propertyId, images = [], onOpenLightbox }) {
  const [shoppableImages, setShoppableImages] = useState([]);
  const [featuredHotspots, setFeaturedHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId || !images.length) { setLoading(false); return; }
    const load = async () => {
      try {
        const analyzedRecords = await apiClient.list("/api/v1/analyzedpropertyimage", 
          { propertyId, isAnalyzed: true, isShoppable: true }, "sortOrder", 10
        );
        if (!analyzedRecords?.length) { setLoading(false); return; }
        setShoppableImages(analyzedRecords);

        // Gather first 4 hotspots across all shoppable images
        const allHotspots = [];
        for (const rec of analyzedRecords.slice(0, 3)) {
          const hs = await apiClient.list("/api/v1/imagehotspot", 
            { imageId: rec.id, isActive: true }, "sortOrder", 3
          ).catch(() => []);
          hs.forEach(h => allHotspots.push({ ...h, _imageUrl: rec.imageUrl }));
          if (allHotspots.length >= 4) break;
        }
        setFeaturedHotspots(allHotspots.slice(0, 4));
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    load();
  }, [propertyId, JSON.stringify(images)]);

  if (loading || shoppableImages.length === 0) return null;

  // Find image index in original images array
  const getImageIndex = (imageUrl) => {
    const idx = images.indexOf(imageUrl);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-black text-gray-900 text-lg flex items-center gap-2">
            ✨ Shop This Home's Interior
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">
            Tap any item in the gallery to find it on Kemetro.
          </p>
        </div>
        <span className="text-xs bg-teal-100 text-teal-700 font-bold px-2.5 py-1 rounded-full">
          {shoppableImages.length} shoppable room{shoppableImages.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Shoppable image thumbnail row */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 pb-1">
        {shoppableImages.map((rec) => (
          <button
            key={rec.id}
            onClick={() => onOpenLightbox(getImageIndex(rec.imageUrl), true)}
            className="relative flex-shrink-0 rounded-xl overflow-hidden border-2 border-transparent hover:border-teal-400 transition-all group"
            style={{ width: 80, height: 80 }}
          >
            <img
              src={rec.imageUrl}
              alt={rec.roomStyle || "Room"}
              className="w-full h-full object-cover group-hover:brightness-90 transition-all"
            />
            {/* ✨ badge */}
            <div className="absolute top-1 left-1 bg-teal-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-full">
              ✨ {rec.hotspotCount || 0}
            </div>
            {/* Room style label */}
            {rec.roomStyle && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] font-bold px-1 py-0.5 text-center truncate">
                {rec.roomStyle.split(" ")[0]}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Featured hotspot pills */}
      {featuredHotspots.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            Featured items found in this home:
          </p>
          <div className="flex flex-wrap gap-2">
            {featuredHotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                onClick={() => onOpenLightbox(getImageIndex(hotspot._imageUrl), true)}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border-2 border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 hover:border-teal-400 transition-all"
              >
                <span className="text-[10px]">✨</span>
                {hotspot.itemLabel}
              </button>
            ))}
            {shoppableImages.reduce((t, r) => t + (r.hotspotCount || 0), 0) > 4 && (
              <button
                onClick={() => onOpenLightbox(getImageIndex(shoppableImages[0]?.imageUrl), true)}
                className="text-xs font-bold px-3 py-1.5 rounded-full border-2 border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
              >
                + more items →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}