"use client";
// @ts-nocheck
import { useState, useRef } from "react";
import { ChevronDown, ChevronUp, Bed, Bath, Maximize2, Building2, Star } from "lucide-react";

export default function SwipeCard({ property, onSwipe, style, isTop, matchScore = 87 }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const startX = useRef(0);
  const startY = useRef(0);
  const cardRef = useRef(null);

  const images = property.image_gallery?.length > 0
    ? property.image_gallery
    : [property.featured_image || "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80"];

  const handleMouseDown = (e) => {
    if (!isTop) return;
    startX.current = e.clientX;
    startY.current = e.clientY;
    setDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setDragX(e.clientX - startX.current);
    setDragY(e.clientY - startY.current);
  };

  const handleMouseUp = () => {
    if (!dragging) return;
    setDragging(false);
    const threshold = 120;
    if (dragX > threshold) { onSwipe?.("like", property); return; }
    if (dragX < -threshold) { onSwipe?.("pass", property); return; }
    if (dragY < -threshold) { onSwipe?.("super_like", property); return; }
    setDragX(0);
    setDragY(0);
  };

  const handleTouchStart = (e) => {
    if (!isTop) return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    setDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    setDragX(e.touches[0].clientX - startX.current);
    setDragY(e.touches[0].clientY - startY.current);
  };

  const handleTouchEnd = () => handleMouseUp();

  const rotation = dragging ? dragX * 0.05 : 0;
  const transform = dragging
    ? `translate(${dragX}px, ${dragY}px) rotate(${rotation}deg)`
    : "translate(0, 0) rotate(0)";

  const showLike = dragging && dragX > 80;
  const showPass = dragging && dragX < -80;
  const showSuperLike = dragging && dragY < -80;

  const scoreColor = matchScore >= 90 ? "text-green-400" : matchScore >= 75 ? "text-orange-400" : "text-gray-400";

  return (
    <div
      ref={cardRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        ...style,
        transform,
        transition: dragging ? "none" : "all 0.3s ease",
        cursor: isTop ? "grab" : "default",
        userSelect: "none"
      }}
      className="absolute bg-white rounded-3xl shadow-2xl overflow-hidden select-none"
    >
      {/* Photo area */}
      <div className="relative" style={{ height: 280 }}>
        <img
          src={images[photoIdx]}
          alt={property.title}
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Photo progress */}
        <div className="absolute top-2 left-2 right-2 flex gap-1">
          {images.map((_, idx) => (
            <div key={idx} className={`h-1 flex-1 rounded-full ${idx === photoIdx ? "bg-white" : "bg-white/40"}`} />
          ))}
        </div>

        {/* Nav zones */}
        <div className="absolute inset-0 flex">
          <div className="flex-1" onClick={() => setPhotoIdx(Math.max(0, photoIdx - 1))} />
          <div className="flex-1" onClick={() => setPhotoIdx(Math.min(images.length - 1, photoIdx + 1))} />
        </div>

        {/* Badges */}
        <div className="absolute top-8 left-3 flex flex-col gap-1.5">
          {property.is_verified && <span className="bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">🏆 VERIFIED</span>}
          {property.created_date && (Date.now() - new Date(property.created_date)) < 3 * 86400000 && (
            <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">NEW</span>
          )}
        </div>

        {/* Photo counter */}
        <div className="absolute top-8 right-3 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full">
          {photoIdx + 1}/{images.length}
        </div>

        {/* Location overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-white font-bold text-sm">📍 {[property.district_name, property.city_name].filter(Boolean).join(", ")}</p>
        </div>

        {/* Swipe indicators */}
        {showLike && <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center"><span className="text-green-400 font-black text-5xl rotate-[-15deg] border-4 border-green-400 rounded-xl px-4">❤️ LIKE</span></div>}
        {showPass && <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center"><span className="text-red-400 font-black text-5xl rotate-[15deg] border-4 border-red-400 rounded-xl px-4">✗ PASS</span></div>}
        {showSuperLike && <div className="absolute inset-0 bg-purple-500/30 flex items-center justify-center"><span className="text-purple-300 font-black text-4xl border-4 border-purple-400 rounded-xl px-4">⭐ SUPER LIKE</span></div>}
      </div>

      {/* Info area */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-2xl font-black text-gray-900">
              {property.is_contact_for_price ? "Contact for Price" : `${Number(property.price_amount || 0).toLocaleString()} ${property.currency || "EGP"}`}
            </p>
            <p className="text-xs text-gray-400">
              {property.area_size ? `${Math.round((property.price_amount || 0) / property.area_size).toLocaleString()} EGP/m²` : ""}
            </p>
          </div>
          <div className="text-right">
            <span className={`text-sm font-black ${scoreColor}`}>{matchScore}%</span>
            <p className="text-[10px] text-gray-400">match</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          {property.beds && <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{property.beds}</span>}
          {property.baths && <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{property.baths}</span>}
          {property.area_size && <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" />{property.area_size}m²</span>}
          {property.floor_number && <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />F{property.floor_number}</span>}
        </div>

        <button onClick={() => setExpanded(!expanded)} className="w-full text-center text-gray-400 text-xs font-semibold flex items-center justify-center gap-1">
          {expanded ? <><ChevronUp className="w-3 h-3" /> Show Less</> : <><ChevronDown className="w-3 h-3" /> Show More</>}
        </button>

        {expanded && (
          <div className="mt-3 border-t border-gray-100 pt-3">
            <p className="text-sm text-gray-600 line-clamp-3 mb-2">{property.description || "Premium property with modern finishes."}</p>
            <p className="text-xs text-purple-600 font-bold">🤖 AI says: This property closely matches your preference for spacious layouts in your preferred area.</p>
          </div>
        )}
      </div>
    </div>
  );
}