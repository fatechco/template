import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const SCAN_MESSAGES = [
  "♻️ Identifying materials...",
  "🏷️ Finding retail price...",
  "💡 Calculating fair surplus price...",
  "🌍 Estimating eco impact...",
  "📝 Writing your listing...",
];

const isMobile = () => window.innerWidth < 768;

export default function SurplusStep1Snap({ capturedImages, setCapturedImages, onAiResult, onManual }) {
  const [loading, setLoading] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [barcode, setBarcode] = useState("");
  const [showBarcodeInput, setShowBarcodeInput] = useState(false);
  const photoInputRef = useRef(null);
  const barcodeInputRef = useRef(null);
  const mobile = isMobile();

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => setMsgIndex(i => (i + 1) % SCAN_MESSAGES.length), 1500);
    return () => clearInterval(interval);
  }, [loading]);

  const handleImageCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64Full = ev.target.result;
      const base64 = base64Full.split(",")[1];
      const mediaType = file.type || "image/jpeg";

      setCapturedImages([base64Full]);
      setLoading(true);
      setMsgIndex(0);

      const res = await base44.functions.invoke("generateSurplusListing", {
        imageBase64: base64,
        mediaType,
      });
      setLoading(false);
      onAiResult(res.data);
    };
    reader.readAsDataURL(file);
  };

  const handleBarcodeSubmit = async () => {
    if (!barcode.trim()) return;
    setLoading(true);
    setMsgIndex(0);
    const res = await base44.functions.invoke("generateSurplusListing", { barcodeString: barcode.trim() });
    setLoading(false);
    onAiResult(res.data);
  };

  const handleAddMorePhotos = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setCapturedImages(prev => [...prev, ev.target.result].slice(0, 8));
      reader.readAsDataURL(file);
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ background: "rgba(20,83,45,0.93)", backdropFilter: "blur(4px)" }}>
        {capturedImages[0] && (
          <div className="absolute inset-0 overflow-hidden">
            <img src={capturedImages[0]} className="w-full h-full object-cover opacity-20" style={{ filter: "blur(6px)" }} />
          </div>
        )}
        <div className="relative z-10 flex flex-col items-center gap-6 px-8">
          <div className="w-20 h-20 rounded-full bg-green-800 flex items-center justify-center text-5xl animate-bounce">♻️</div>
          {/* Scanner line */}
          <div className="relative w-72 h-40 rounded-2xl overflow-hidden border-2 border-green-400/40">
            {capturedImages[0] && <img src={capturedImages[0]} className="w-full h-full object-cover opacity-50" />}
            <div className="absolute inset-0 flex flex-col justify-center">
              <ScannerLine />
            </div>
          </div>
          <p className="text-white text-lg font-bold text-center transition-all">{SCAN_MESSAGES[msgIndex]}</p>
          <div className="flex gap-1.5">
            {SCAN_MESSAGES.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === msgIndex ? "bg-green-400 scale-125" : "bg-white/30"}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // After capture — show preview + add more + CTA
  if (capturedImages.length > 0) {
    return (
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Primary image preview */}
        <div className="relative">
          <img src={capturedImages[0]} className="w-full rounded-xl object-cover" style={{ maxHeight: 220 }} />
          <button onClick={() => setCapturedImages([])} className="absolute top-2 right-2 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            🔄 Retake
          </button>
        </div>

        {/* Additional photos */}
        <div>
          <p className="text-xs text-gray-400 font-semibold mb-2">Add more photos (optional, up to 8)</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {capturedImages.slice(1).map((img, i) => (
              <div key={i} className="relative flex-shrink-0">
                <img src={img} className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                <button onClick={() => setCapturedImages(prev => prev.filter((_, idx) => idx !== i + 1))}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button>
              </div>
            ))}
            {capturedImages.length < 8 && (
              <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 cursor-pointer flex-shrink-0 hover:border-green-400 transition-colors">
                <span className="text-2xl">+</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleAddMorePhotos} />
              </label>
            )}
          </div>
        </div>

        <button
          onClick={async () => {
            const base64Full = capturedImages[0];
            const base64 = base64Full.split(",")[1];
            const mediaType = "image/jpeg";
            setLoading(true);
            setMsgIndex(0);
            const res = await base44.functions.invoke("generateSurplusListing", { imageBase64: base64, mediaType });
            setLoading(false);
            onAiResult(res.data);
          }}
          className="w-full py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2"
          style={{ background: "#16A34A" }}
        >
          ✨ Identify & Price with AI →
        </button>
      </div>
    );
  }

  // MOBILE: full-screen camera UI
  if (mobile) {
    return (
      <div className="flex flex-col items-center justify-between min-h-[calc(100vh-130px)] px-6 py-8" style={{ background: "#14532D" }}>
        {/* Viewfinder */}
        <div className="flex-1 flex flex-col items-center justify-center w-full gap-6">
          <div className="w-full rounded-2xl border-2 border-dashed border-white/50 flex flex-col items-center justify-center py-12 px-4"
            style={{ animation: "pulse 2s ease-in-out infinite" }}>
            <span className="text-5xl mb-3">📷</span>
            <p className="text-white text-base font-semibold text-center">Align your items here</p>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3 mt-6">
          <label className="block w-full py-4 rounded-2xl font-black text-green-700 text-base text-center cursor-pointer"
            style={{ background: "white" }}>
            📸 Snap Photo
            <input ref={photoInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageCapture} />
          </label>

          {showBarcodeInput ? (
            <div className="flex gap-2">
              <input value={barcode} onChange={e => setBarcode(e.target.value)} placeholder="Enter barcode number..."
                className="flex-1 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white" />
              <button onClick={handleBarcodeSubmit} className="px-4 py-3 bg-green-600 text-white font-bold rounded-xl">Go</button>
            </div>
          ) : (
            <button onClick={() => setShowBarcodeInput(true)}
              className="w-full py-3.5 rounded-2xl font-bold text-white text-base border-2 border-white/50">
              📊 Scan Barcode
            </button>
          )}
          <button onClick={onManual} className="w-full text-white/70 text-sm py-2">✏️ Enter manually</button>
        </div>

        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.7} }`}</style>
      </div>
    );
  }

  // DESKTOP: card UI
  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-3xl border-2 border-dashed border-green-400 p-12 max-w-md w-full text-center shadow-sm">
        <div className="text-6xl mb-4">♻️</div>
        <h2 className="text-xl font-black text-green-800 mb-2">Snap or scan your surplus items</h2>
        <p className="text-gray-500 text-sm mb-8">Take a photo or scan the barcode. AI identifies and prices it instantly.</p>

        <div className="space-y-3">
          <label className="block w-full py-3.5 rounded-2xl font-black text-white cursor-pointer text-base" style={{ background: "#16A34A" }}>
            📸 Snap a Photo of the Items
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageCapture} />
          </label>

          {showBarcodeInput ? (
            <div className="flex gap-2">
              <input value={barcode} onChange={e => setBarcode(e.target.value)} placeholder="Enter barcode..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400" />
              <button onClick={handleBarcodeSubmit} className="px-4 py-3 rounded-xl font-bold text-white" style={{ background: "#16A34A" }}>Go</button>
            </div>
          ) : (
            <button onClick={() => setShowBarcodeInput(true)}
              className="w-full py-3 rounded-2xl font-bold border-2 border-green-500 text-green-700 text-base hover:bg-green-50 transition-colors">
              📊 Scan Product Barcode
            </button>
          )}

          <button onClick={onManual} className="w-full text-gray-400 text-sm py-2 hover:text-gray-600 transition-colors">✏️ List manually without scanning</button>
        </div>
      </div>
    </div>
  );
}

function ScannerLine() {
  return (
    <div className="w-full flex justify-center" style={{ animation: "scanMove 2s ease-in-out infinite" }}>
      <div className="h-0.5 rounded-full" style={{ width: "85%", background: "#16A34A", boxShadow: "0 0 10px #16A34A, 0 0 20px #16A34A" }} />
      <style>{`
        @keyframes scanMove {
          0% { transform: translateY(-60px); }
          50% { transform: translateY(60px); }
          100% { transform: translateY(-60px); }
        }
      `}</style>
    </div>
  );
}