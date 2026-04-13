import { useState, useEffect } from "react";
import { Search, Download, RefreshCw, Tag, Eye, X } from "lucide-react";
import { base44 } from "@/api/base44Client";

const ROOM_TYPES = ["Living Room", "Bedroom", "Kitchen", "Dining Room", "Bathroom", "Outdoor"];
const ROOM_STYLES = ["Modern Minimalist", "Classic Luxury", "Industrial", "Bohemian", "Scandinavian", "Contemporary", "Art Deco"];

function ImageDetailModal({ image, onClose }) {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingHotspot, setEditingHotspot] = useState(null);

  useEffect(() => {
    base44.entities.ImageHotspot.filter({ imageId: image.id, isActive: true }, "sortOrder", 20)
      .then(setHotspots).catch(() => {}).finally(() => setLoading(false));
  }, [image.id]);

  const handleDeleteHotspot = async (id) => {
    await base44.entities.ImageHotspot.update(id, { isActive: false });
    setHotspots(hs => hs.filter(h => h.id !== id));
  };

  const handleReanalyze = async () => {
    try {
      await base44.functions.invoke("processImageForHotspots", {
        propertyId: image.propertyId, imageUrl: image.imageUrl, force: true,
      });
      onClose();
    } catch (e) { alert("Re-analysis triggered. Check back shortly."); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[500] flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl flex" onClick={e => e.stopPropagation()}>
        {/* Image left */}
        <div className="flex-[1.5] relative bg-black min-h-[400px]">
          <img src={image.imageUrl} alt="" className="w-full h-full object-cover rounded-l-2xl" style={{ maxHeight: 600 }} />
          {hotspots.map(h => (
            <div key={h.id} style={{
              position: "absolute", left: `${h.xPercent}%`, top: `${h.yPercent}%`,
              transform: "translate(-50%, -50%)",
              width: 16, height: 16, borderRadius: "50%",
              background: h.isSponsored ? "#F59E0B" : "#0A6EBD",
              border: "2.5px solid white", boxShadow: "0 0 0 3px rgba(10,110,189,0.3)",
              cursor: "pointer",
            }} title={h.itemLabel} />
          ))}
        </div>

        {/* Right panel */}
        <div className="flex-1 p-5 flex flex-col overflow-y-auto" style={{ minWidth: 280 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-gray-900">Image Details</h2>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100"><X size={16} /></button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {image.roomType && <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">Room: {image.roomType}</span>}
            {image.roomStyle && <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">Style: {image.roomStyle}</span>}
            <span className="text-xs bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full">{hotspots.length} hotspots</span>
          </div>

          {image.dominantColors?.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-gray-500">Palette:</span>
              {image.dominantColors.slice(0, 6).map((c, i) => (
                <div key={i} title={c.name} style={{ width: 18, height: 18, borderRadius: "50%", background: c.hex, border: "2px solid white", boxShadow: "0 0 0 1px rgba(0,0,0,0.1)" }} />
              ))}
            </div>
          )}

          {image.analyzedAt && (
            <p className="text-xs text-gray-400 mb-4">Analyzed: {new Date(image.analyzedAt).toLocaleString()}</p>
          )}

          <div className="flex-1">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Hotspots</p>
            {loading ? <p className="text-xs text-gray-400">Loading…</p> : (
              <div className="space-y-2">
                {hotspots.map(h => (
                  <div key={h.id} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: h.isSponsored ? "#F59E0B" : "#0A6EBD", flexShrink: 0 }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{h.itemLabel}</p>
                      <p className="text-[10px] text-gray-400">{h.kemetroCategorySlug} · {h.xPercent?.toFixed(0)}%, {h.yPercent?.toFixed(0)}%</p>
                      <p className="text-[10px] text-gray-500">Clicks: {h.clickCount || 0} · Carts: {h.addToCartCount || 0} {h.isSponsored ? "· ⭐ Sponsored" : ""}</p>
                    </div>
                    <button onClick={() => handleDeleteHotspot(h.id)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <a href={`/admin/kemetro/shop-the-look/tag?imageId=${image.id}&imageUrl=${encodeURIComponent(image.imageUrl)}&propertyId=${image.propertyId}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm rounded-xl transition-colors">
              <Tag size={14} /> + Add Manual Hotspot
            </a>
            <button onClick={handleReanalyze}
              className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors">
              <RefreshCw size={14} /> Re-analyze with AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function STLImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRoomType, setFilterRoomType] = useState("");
  const [filterRoomStyle, setFilterRoomStyle] = useState("");
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const loadImages = async () => {
    setLoading(true);
    try {
      const query = {};
      if (filterStatus === "shoppable") { query.isShoppable = true; query.isAnalyzed = true; }
      else if (filterStatus === "not_shoppable") { query.isShoppable = false; query.isAnalyzed = true; }
      else if (filterStatus === "not_analyzed") { query.isAnalyzed = false; }
      if (filterRoomType) query.roomType = filterRoomType;
      if (filterRoomStyle) query.roomStyle = filterRoomStyle;

      const data = await base44.entities.AnalyzedPropertyImage.filter(query, "-created_date", 60);
      setImages(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadImages(); }, []);

  const handleReanalyze = async (img, e) => {
    e.stopPropagation();
    try {
      await base44.functions.invoke("processImageForHotspots", { propertyId: img.propertyId, imageUrl: img.imageUrl, force: true });
      alert("Re-analysis triggered!");
    } catch { alert("Re-analysis triggered. Check back shortly."); }
  };

  const filtered = images.filter(img => !search || img.imageUrl?.toLowerCase().includes(search.toLowerCase()) || img.propertyId?.includes(search));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">✨ Shop the Look — Image Library</h1>
        <p className="text-gray-500 text-sm mt-0.5">Browse and manage all analyzed property images</p>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by property ID or URL…" className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-400" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white">
          <option value="all">All Status</option>
          <option value="shoppable">✨ Shoppable</option>
          <option value="not_shoppable">❌ Not Shoppable</option>
          <option value="not_analyzed">⏳ Not Analyzed</option>
        </select>
        <select value={filterRoomType} onChange={e => setFilterRoomType(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white">
          <option value="">All Room Types</option>
          {ROOM_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={filterRoomStyle} onChange={e => setFilterRoomStyle(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white">
          <option value="">All Styles</option>
          {ROOM_STYLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <button onClick={loadImages} className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm rounded-xl transition-colors">
          <Search size={14} /> Filter
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Image grid */}
      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(img => (
            <div key={img.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group cursor-pointer"
              onClick={() => setSelectedImage(img)}>
              {/* Thumbnail */}
              <div className="relative" style={{ height: 160 }}>
                <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                {/* Status badge */}
                {img.isShoppable && img.isAnalyzed && (
                  <div className="absolute top-2 left-2 bg-teal-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    ✨ {img.hotspotCount || 0} hotspots
                  </div>
                )}
                {!img.isAnalyzed && (
                  <div className="absolute top-2 left-2 bg-gray-400 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">⏳ Queued</div>
                )}
                {img.isAnalyzed && !img.isShoppable && (
                  <div className="absolute top-2 left-2 bg-red-400 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">No items found</div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                  <button onClick={e => { e.stopPropagation(); setSelectedImage(img); }} className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-white/20 hover:bg-white/30 py-2 rounded-lg">
                    <Eye size={12} /> View Hotspots
                  </button>
                  <a href={`/admin/kemetro/shop-the-look/tag?imageId=${img.id}&imageUrl=${encodeURIComponent(img.imageUrl)}&propertyId=${img.propertyId}`}
                    onClick={e => e.stopPropagation()}
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-teal-500/80 hover:bg-teal-500 py-2 rounded-lg">
                    <Tag size={12} /> Manual Tag
                  </a>
                  <button onClick={e => handleReanalyze(img, e)} className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-white/20 hover:bg-white/30 py-2 rounded-lg">
                    <RefreshCw size={12} /> Re-analyze
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-[11px] text-gray-400 truncate">Property: {img.propertyId?.slice(0, 12)}…</p>
                {img.roomStyle && <p className="text-[11px] text-purple-600 font-semibold">{img.roomStyle}</p>}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-4 text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🖼️</p>
              <p className="font-bold">No images found</p>
              <p className="text-sm mt-1">Try changing your filters</p>
            </div>
          )}
        </div>
      )}

      {selectedImage && <ImageDetailModal image={selectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
  );
}