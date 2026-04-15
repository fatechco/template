"use client";
// @ts-nocheck
import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Play } from "lucide-react";

export default function KemetroProductGallery({ product }) {
  const [mainImage, setMainImage] = useState(product.thumbnailImage);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const images = product.imageGallery || [];
  const allImages = [product.thumbnailImage, ...images].slice(0, 5);

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 cursor-zoom-in group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={mainImage}
          alt="Product"
          className={`w-full h-full object-cover transition-transform duration-200 ${
            isZoomed ? "scale-150" : "scale-100"
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
              : {}
          }
        />

        {/* Zoom Icon */}
        <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 size={18} className="text-gray-700" />
        </div>

        {/* Video Badge */}
        {product.videoLink && (
          <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded-lg">
            <Play size={20} className="text-[#FF6B00] fill-[#FF6B00]" />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2">
        {allImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setMainImage(img)}
            className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
              mainImage === img
                ? "border-[#FF6B00]"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* 360 View Note */}
      {product.imageGallery?.length > 3 && (
        <div className="text-center py-2 bg-blue-50 rounded-lg text-xs text-[#0077B6]">
          📷 360° View Available
        </div>
      )}
    </div>
  );
}