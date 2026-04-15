"use client";
// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import HotspotDot from "@/components/shop-the-look/HotspotDot";
import KemetroSlidePanel from "@/components/shop-the-look/KemetroSlidePanel";

const FALLBACK = [
  "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
];

function getSessionId() {
  let sid = sessionStorage.getItem("stl_session");
  if (!sid) { sid = Math.random().toString(36).slice(2); sessionStorage.setItem("stl_session", sid); }
  return sid;
}

export default function PropertyGallery({ images = [], propertyId }) {
  const [lightbox, setLightbox] = useState(null);
  const [current, setCurrent] = useState(0);
  const [shopMode, setShopMode] = useState(false);
  const [shoppableMap, setShoppableMap] = useState({}); // imageUrl → { imageRecord, hotspots }
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const imageRef = useRef(null);

  const imgs = images.length > 0 ? images : FALLBACK;
  const main = imgs[0];
  const thumbs = imgs.slice(1, 5);
  const extra = imgs.length - 5;
  const sessionId = getSessionId();

  // Load user
  useEffect(() => {
    apiClient.get("/api/auth/session").then(setUser).catch(() => {});
  }, []);

  // Load shoppable data for all images
  useEffect(() => {
    if (!imgs.length) return;
    const load = async () => {
      const map = {};
      await Promise.all(imgs.map(async (imgUrl) => {
        try {
          const records = await apiClient.list("/api/v1/analyzedpropertyimage", {
            imageUrl: imgUrl,
            isAnalyzed: true,
            isShoppable: true,
          });
          if (records?.length) {
            const imgRecord = records[0];
            const hotspots = await apiClient.list("/api/v1/imagehotspot", {
              imageId: imgRecord.id,
              isActive: true,
            }, "sortOrder", 20);
            map[imgUrl] = { imageRecord: imgRecord, hotspots: hotspots || [] };
          }
        } catch { /* ignore */ }
      }));
      setShoppableMap(map);
    };
    load();
  }, [JSON.stringify(imgs)]);

  const anyShoppable = Object.keys(shoppableMap).length > 0;
  const currentImgUrl = imgs[current];
  const currentShoppable = shoppableMap[currentImgUrl];
  const currentHotspots = currentShoppable?.hotspots || [];
  const currentImageRecord = currentShoppable?.imageRecord;
  const isCurrentShoppable = !!currentShoppable;

  const openLightbox = (i) => { setLightbox(i); setCurrent(i); setShopMode(false); setActiveHotspot(null); setPanelOpen(false); };
  const closeLightbox = () => { setLightbox(null); setShopMode(false); setActiveHotspot(null); setPanelOpen(false); };
  const prev = useCallback(() => { setCurrent((c) => (c - 1 + imgs.length) % imgs.length); setShopMode(false); setActiveHotspot(null); setPanelOpen(false); }, [imgs.length]);
  const next = useCallback(() => { setCurrent((c) => (c + 1) % imgs.length); setShopMode(false); setActiveHotspot(null); setPanelOpen(false); }, [imgs.length]);

  const toggleShopMode = (e) => {
    e.stopPropagation();
    if (shopMode) {
      setShopMode(false);
      setActiveHotspot(null);
      setPanelOpen(false);
    } else {
      setShopMode(true);
    }
  };

  const handleHotspotClick = async (hotspot) => {
    setActiveHotspot(hotspot);
    setPanelOpen(true);
    // Record the click
    try {
      await apiClient.post("/api/v1/ai/recordHotspotClick", {
        hotspotId: hotspot.id,
        userId: user?.id || null,
        sessionId,
      });
    } catch { /* ignore */ }
  };

  return (
    <>
      {/* ── GALLERY GRID ─────────────────────────────── */}
      <div className="flex gap-2 h-[460px] rounded-2xl overflow-hidden">
        {/* Main image */}
        <div className="flex-[2.3] relative cursor-pointer group" onClick={() => openLightbox(0)}>
          <img src={main} alt="Main" className="w-full h-full object-cover group-hover:brightness-95 transition-all" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
          {/* Shop the Look badge on featured image */}
          {anyShoppable && shoppableMap[main] && (
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[12px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none">
              ✨ Shop the Look
            </div>
          )}
        </div>

        {/* Thumbs 2×2 grid */}
        {thumbs.length > 0 && (
          <div className="flex-1 grid grid-cols-2 gap-2">
            {thumbs.map((img, i) => {
              const isLast = i === thumbs.length - 1 && extra > 0;
              return (
                <div
                  key={i}
                  className="relative cursor-pointer group overflow-hidden rounded-lg"
                  onClick={() => openLightbox(i + 1)}
                >
                  <img src={img} alt="" className="w-full h-full object-cover group-hover:brightness-90 transition-all" />
                  {shoppableMap[img] && (
                    <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full pointer-events-none">
                      ✨ STL
                    </div>
                  )}
                  {isLast && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                      <Images size={22} />
                      <span className="font-bold text-lg mt-1">+{extra + 1}</span>
                      <span className="text-xs opacity-80">more photos</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── LIGHTBOX ──────────────────────────────────── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[300] bg-black/95 flex flex-col items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <X size={20} />
          </button>

          {/* Prev / Next */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronRight size={22} />
          </button>

          {/* IMAGE + HOTSPOTS */}
          <div
            className="relative flex items-center justify-center"
            style={{ maxHeight: "75vh", maxWidth: panelOpen ? "calc(85vw - 420px)" : "85vw" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              ref={imageRef}
              src={imgs[current]}
              alt=""
              className="max-h-[75vh] object-contain rounded-xl"
              style={{
                maxWidth: "100%",
                filter: shopMode ? "brightness(0.82)" : "brightness(1)",
                transition: "filter 0.3s ease",
              }}
            />

            {/* Hotspot dots */}
            {shopMode && currentHotspots.map((hotspot) => (
              <HotspotDot
                key={hotspot.id}
                hotspot={hotspot}
                isActive={activeHotspot?.id === hotspot.id}
                onClick={handleHotspotClick}
              />
            ))}

            {/* Shop Toggle Button */}
            <button
              onClick={toggleShopMode}
              className="absolute top-3 right-3 flex items-center gap-1.5 text-[13px] font-bold rounded-full transition-all"
              style={{
                background: isCurrentShoppable ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.5)",
                padding: "8px 14px",
                color: isCurrentShoppable ? "#0A1628" : "#999",
                cursor: isCurrentShoppable ? "pointer" : "default",
                height: 36,
              }}
            >
              {isCurrentShoppable ? (
                <>
                  <span style={{ fontSize: 16 }}>🛍️</span>
                  {shopMode ? "✕ Close shop" : "Shop this room"}
                </>
              ) : (
                <span style={{ fontSize: 12, color: "#aaa" }}>No items tagged</span>
              )}
            </button>
          </div>

          {/* ── ROOM INFO STRIP ─────────────────── */}
          {shopMode && currentImageRecord && (
            <div
              className="flex items-center gap-6 px-4 py-2.5 rounded-xl shadow-sm mt-3"
              style={{ background: "white", fontSize: 13 }}
              onClick={(e) => e.stopPropagation()}
            >
              {currentImageRecord.roomStyle && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-medium">Room Style:</span>
                  <span className="bg-teal-100 text-teal-700 font-bold text-[12px] px-3 py-0.5 rounded-full">
                    {currentImageRecord.roomStyle}
                  </span>
                </div>
              )}
              {currentImageRecord.dominantColors?.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-medium">Palette:</span>
                  <div className="flex gap-1">
                    {currentImageRecord.dominantColors.slice(0, 5).map((c, i) => (
                      <div
                        key={i}
                        title={c.name}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: c.hex,
                          border: "2px solid white",
                          boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-1 text-gray-500">
                <span className="font-bold text-gray-800">{currentHotspots.length}</span>
                <span>items tagged in this photo</span>
              </div>
            </div>
          )}

          {/* Counter */}
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {current + 1} / {imgs.length}
          </div>

          {/* Thumbnail strip */}
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto pb-1">
            {imgs.map((img, i) => (
              <div key={i} className="relative flex-shrink-0">
                <img
                  src={img}
                  alt=""
                  onClick={(e) => { e.stopPropagation(); setCurrent(i); setShopMode(false); setActiveHotspot(null); setPanelOpen(false); }}
                  className={`h-14 w-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${i === current ? "border-[#FF6B00]" : "border-transparent opacity-60 hover:opacity-90"}`}
                />
                {shoppableMap[img] && (
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── KEMETRO SLIDE PANEL ───────────────────────── */}
      <KemetroSlidePanel
        hotspot={activeHotspot}
        isOpen={panelOpen}
        onClose={() => { setPanelOpen(false); setActiveHotspot(null); }}
        userId={user?.id}
        sessionId={sessionId}
        onCartUpdate={setCartCount}
      />
    </>
  );
}