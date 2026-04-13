import { useState, useEffect, useRef } from "react";
import { Search, X, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";

const CATEGORIES = ["furniture", "lighting", "decor", "rugs", "curtains", "wall-art", "kitchen-accessories", "outdoor-furniture"];

function TagForm({ position, hotspots, onSave, onCancel, imageId, propertyId }) {
  const [form, setForm] = useState({
    itemLabel: "", itemLabelAr: "", kemetroCategorySlug: "furniture",
    searchKeywords: "", manualProductUrl: "",
  });
  const [productSearch, setProductSearch] = useState("");
  const [productResults, setProductResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleProductSearch = async (q) => {
    setProductSearch(q);
    if (q.length < 2) { setProductResults([]); return; }
    setSearching(true);
    try {
      const results = await base44.entities.KemetroProduct.filter({ is_active: true }, "-created_date", 10);
      const filtered = results.filter(p => (p.title || p.name || "").toLowerCase().includes(q.toLowerCase()));
      setProductResults(filtered.slice(0, 6));
    } catch { setProductResults([]); }
    finally { setSearching(false); }
  };

  const handleSave = async () => {
    if (!form.itemLabel) return;
    setSaving(true);
    try {
      const hotspot = await base44.entities.ImageHotspot.create({
        imageId,
        propertyId,
        xPercent: parseFloat(position.x.toFixed(2)),
        yPercent: parseFloat(position.y.toFixed(2)),
        itemLabel: form.itemLabel,
        itemLabelAr: form.itemLabelAr,
        kemetroCategorySlug: form.kemetroCategorySlug,
        searchKeywords: form.searchKeywords,
        deepLinkUrl: `/kemetro/search?q=${encodeURIComponent(form.searchKeywords)}`,
        manualProductUrl: form.manualProductUrl,
        isManual: true,
        isActive: true,
        sortOrder: hotspots.length,
      });
      onSave(hotspot);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="absolute top-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-200 w-72 z-20 overflow-y-auto" style={{ maxHeight: "calc(100% - 32px)" }}>
      <div className="px-4 py-3 bg-teal-500 rounded-t-2xl flex items-center justify-between">
        <p className="text-white font-bold text-sm">Tag Item</p>
        <button onClick={onCancel} className="text-white/70 hover:text-white"><X size={16} /></button>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-xl p-2 text-xs text-gray-500 text-center">
          <div>X: <strong>{position.x.toFixed(1)}%</strong></div>
          <div>Y: <strong>{position.y.toFixed(1)}%</strong></div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Item Label (EN) *</label>
          <input value={form.itemLabel} onChange={e => setForm(f => ({ ...f, itemLabel: e.target.value }))} placeholder="e.g. Tufted Velvet Sofa" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Item Label (AR)</label>
          <input dir="rtl" value={form.itemLabelAr} onChange={e => setForm(f => ({ ...f, itemLabelAr: e.target.value }))} placeholder="الاسم بالعربية" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400 text-right" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Category</label>
          <select value={form.kemetroCategorySlug} onChange={e => setForm(f => ({ ...f, kemetroCategorySlug: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Search Keywords</label>
          <input value={form.searchKeywords} onChange={e => setForm(f => ({ ...f, searchKeywords: e.target.value }))} placeholder="e.g. navy velvet sofa 3-seater" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400" />
          <p className="text-[10px] text-gray-400 mt-0.5">Used to search Kemetro for matching products</p>
        </div>

        {/* Pin exact product */}
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">OR Pin Exact Kemetro Product</label>
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={productSearch} onChange={e => handleProductSearch(e.target.value)} placeholder="Search Kemetro catalog…" className="pl-8 pr-3 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400" />
          </div>
          {productResults.length > 0 && (
            <div className="border border-gray-200 rounded-lg mt-1 max-h-32 overflow-y-auto">
              {productResults.map(p => (
                <button key={p.id} onClick={() => { setForm(f => ({ ...f, manualProductUrl: `/kemetro/product/${p.slug || p.id}` })); setProductSearch(p.title || p.name || ""); setProductResults([]); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-50 last:border-0">
                  <img src={p.featured_image || ""} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />
                  <span className="text-xs truncate">{p.title || p.name}</span>
                </button>
              ))}
            </div>
          )}
          {form.manualProductUrl && (
            <p className="text-[10px] text-teal-600 font-bold mt-1">✓ Product URL linked</p>
          )}
        </div>

        <button onClick={handleSave} disabled={!form.itemLabel || saving}
          className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
          <Check size={14} /> {saving ? "Saving…" : "✅ Save Hotspot"}
        </button>
        <button onClick={onCancel} className="w-full py-2 text-gray-500 text-sm font-medium hover:text-gray-700">✕ Cancel</button>
      </div>
    </div>
  );
}

export default function STLManualTag() {
  const [step, setStep] = useState(1); // 1 = select image, 2 = tagger
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [pendingPos, setPendingPos] = useState(null);
  const [showTagForm, setShowTagForm] = useState(false);
  const imgRef = useRef(null);

  // Check URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const imageId = params.get("imageId");
    const imageUrl = params.get("imageUrl");
    const propertyId = params.get("propertyId");
    if (imageId && imageUrl) {
      setSelectedImage({ id: imageId, imageUrl: decodeURIComponent(imageUrl), propertyId });
      setStep(2);
    }
  }, []);

  const loadImages = async () => {
    setLoadingImages(true);
    try {
      const data = await base44.entities.AnalyzedPropertyImage.filter({ isAnalyzed: true }, "-created_date", 40);
      setImages(data || []);
    } catch { } finally { setLoadingImages(false); }
  };

  useEffect(() => { if (step === 1) loadImages(); }, [step]);

  const loadHotspots = async (imgId) => {
    const hs = await base44.entities.ImageHotspot.filter({ imageId: imgId, isActive: true }, "sortOrder", 30).catch(() => []);
    setHotspots(hs || []);
  };

  const handleSelectImage = async (img) => {
    setSelectedImage(img);
    await loadHotspots(img.id);
    setStep(2);
  };

  const handleImageClick = (e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPendingPos({ x, y });
    setShowTagForm(true);
  };

  const handleSaveHotspot = (hotspot) => {
    setHotspots(hs => [...hs, hotspot]);
    setShowTagForm(false);
    setPendingPos(null);
  };

  const filtered = images.filter(img =>
    !search || img.imageUrl?.toLowerCase().includes(search.toLowerCase()) || img.propertyId?.includes(search)
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">✨ Manual Tagging Tool</h1>
        <p className="text-gray-500 text-sm mt-0.5">Click anywhere on a property image to drop a hotspot pin</p>
      </div>

      {step === 1 && (
        <>
          <div className="relative mb-6 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && loadImages()} placeholder="Search by property ID or image URL…" className="pl-9 pr-4 py-2.5 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-400" />
          </div>

          {loadingImages ? (
            <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-36 bg-gray-200 animate-pulse rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(img => (
                <div key={img.id} onClick={() => handleSelectImage(img)}
                  className="cursor-pointer rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-teal-300 transition-all group">
                  <div className="relative" style={{ height: 140 }}>
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover group-hover:brightness-90" />
                    {img.isShoppable && <div className="absolute top-2 left-2 bg-teal-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">✨ {img.hotspotCount || 0} tagged</div>}
                  </div>
                  <div className="bg-white px-3 py-2">
                    <p className="text-xs text-gray-500 truncate">{img.propertyId?.slice(0, 12)}…</p>
                    {img.roomStyle && <p className="text-[10px] text-purple-600">{img.roomStyle}</p>}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-4 text-center py-16 text-gray-400">
                  <p className="text-4xl mb-3">🖼️</p>
                  <p className="font-bold">No images found</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {step === 2 && selectedImage && (
        <div>
          <button onClick={() => { setStep(1); setSelectedImage(null); setShowTagForm(false); setPendingPos(null); }}
            className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1">
            ← Back to image library
          </button>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 text-xs text-gray-500 font-medium">
              Click anywhere on the image to place a hotspot pin. Property: <strong>{selectedImage.propertyId?.slice(0, 12)}…</strong>
            </div>
            <div className="relative select-none" style={{ cursor: "crosshair" }}>
              <img ref={imgRef} src={selectedImage.imageUrl} alt="" className="w-full object-contain max-h-[70vh]" onClick={handleImageClick} draggable={false} />

              {/* Existing hotspots */}
              {hotspots.map(h => (
                <div key={h.id} style={{
                  position: "absolute", left: `${h.xPercent}%`, top: `${h.yPercent}%`,
                  transform: "translate(-50%, -50%)",
                  width: 14, height: 14, borderRadius: "50%",
                  background: h.isManual ? "#8B5CF6" : "#0A6EBD",
                  border: "2.5px solid white",
                  boxShadow: "0 0 0 3px rgba(10,110,189,0.25)",
                  zIndex: 10, pointerEvents: "none",
                }} title={h.itemLabel} />
              ))}

              {/* Pending pos temp marker */}
              {pendingPos && (
                <div style={{
                  position: "absolute", left: `${pendingPos.x}%`, top: `${pendingPos.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: 16, height: 16, borderRadius: "50%",
                  background: "#F59E0B", border: "2.5px solid white",
                  boxShadow: "0 0 0 6px rgba(245,158,11,0.3)",
                  zIndex: 11, animation: "stl-pulse 1.5s infinite",
                }} />
              )}

              {/* Tag form */}
              {showTagForm && pendingPos && (
                <TagForm
                  position={pendingPos}
                  hotspots={hotspots}
                  imageId={selectedImage.id}
                  propertyId={selectedImage.propertyId}
                  onSave={handleSaveHotspot}
                  onCancel={() => { setShowTagForm(false); setPendingPos(null); }}
                />
              )}
            </div>

            <div className="p-4 text-xs text-gray-400 text-center">
              {hotspots.length} hotspot{hotspots.length !== 1 ? "s" : ""} tagged on this image
            </div>
          </div>

          <style>{`
            @keyframes stl-pulse {
              0% { box-shadow: 0 0 0 0px rgba(245,158,11,0.4); }
              70% { box-shadow: 0 0 0 10px rgba(245,158,11,0); }
              100% { box-shadow: 0 0 0 0px rgba(245,158,11,0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}