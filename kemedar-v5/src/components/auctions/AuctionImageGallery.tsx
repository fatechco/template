"use client";
// @ts-nocheck
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function AuctionImageGallery({ property, auction }) {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const images = [
    property.featured_image,
    ...(property.image_gallery || []),
  ].filter(Boolean);

  if (images.length === 0) {
    images.push("https://images.unsplash.com/photo-1512917774080-9b274b3d0f87?w=800&h=600&fit=crop");
  }

  const currentImage = images[mainImageIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative w-full h-96 bg-gray-200 rounded-2xl overflow-hidden cursor-zoom-in group"
        onClick={() => setShowLightbox(true)}
      >
        <img
          src={currentImage}
          alt="Property"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMainImageIndex((i) => (i === 0 ? images.length - 1 : i - 1));
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMainImageIndex((i) => (i === images.length - 1 ? 0 : i + 1));
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm font-bold">
          {mainImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setMainImageIndex(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                mainImageIndex === idx ? "border-red-600" : "border-gray-200"
              }`}
            >
              <img src={image} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>

          <img
            src={currentImage}
            alt="Full size"
            className="max-w-4xl max-h-[90vh] object-contain"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={() => setMainImageIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={() => setMainImageIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}