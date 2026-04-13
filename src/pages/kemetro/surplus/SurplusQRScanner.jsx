import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Camera, Keyboard, CheckCircle2, Wallet, ListPlus } from "lucide-react";

function SettlementSuccess({ item, result, onListMore }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center" style={{ background: "#16a34a" }}>
      {/* Animated checkmark */}
      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6"
        style={{ animation: "scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <CheckCircle2 size={56} className="text-white" />
      </div>

      <h1 className="text-white font-black text-3xl mb-2">💰 Payment Released!</h1>
      <p className="text-green-100 text-lg font-bold mb-1">
        {Number(result?.sellerNetEGP || item?.sellerNetEGP || 0).toLocaleString()} EGP added to your XeedWallet
      </p>
      <p className="text-green-200 text-sm mb-8">
        Platform fee: {Number(result?.platformFeeEGP || item?.platformFeeEGP || 0).toLocaleString()} EGP
      </p>

      {/* Item summary */}
      <div className="w-full max-w-sm bg-white/15 rounded-2xl p-4 mb-8 text-left">
        <p className="text-white font-bold text-sm line-clamp-1 mb-1">{item?.title}</p>
        <div className="flex items-center gap-4 text-green-100 text-xs">
          <span>{item?.quantityAvailable} {item?.unit} sold</span>
          {item?.estimatedWeightKg && (
            <span>🌍 {item.estimatedWeightKg} kg kept out of landfill</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Link
          to="/dashboard"
          className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-white text-white font-bold text-sm hover:bg-white/10 transition-colors"
        >
          <Wallet size={16} /> View My Wallet
        </Link>
        <button
          onClick={onListMore}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-green-700 font-bold text-sm hover:bg-green-50 transition-colors"
        >
          <ListPlus size={16} /> List More Surplus
        </button>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function ManualEntry({ onSubmit, loading }) {
  const [code, setCode] = useState("");
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="bg-white rounded-2xl w-full max-w-sm p-6">
        <h3 className="font-black text-gray-900 mb-4">Enter QR Code Manually</h3>
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. ABCD1234EFGH5678"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:border-green-500 mb-4"
          autoFocus
        />
        <div className="flex gap-3">
          <button onClick={() => onSubmit(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(code.trim())}
            disabled={!code.trim() || loading}
            className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-green-700 transition-colors"
          >
            {loading ? "Verifying…" : "Confirm Sale"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SurplusQRScanner() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [settled, setSettled] = useState(false);
  const [settleResult, setSettleResult] = useState(null);
  const [showManual, setShowManual] = useState(false);
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState(false);
  const [user, setUser] = useState(null);
  const [scanLinePos, setScanLinePos] = useState(0);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    base44.entities.SurplusItem.filter({ id: itemId }, "-created_date", 1)
      .then(r => r?.[0] && setItem(r[0])).catch(() => {});
  }, [itemId]);

  // Animate scan line
  useEffect(() => {
    let dir = 1, pos = 0;
    const tick = () => {
      pos += dir * 1.2;
      if (pos >= 100) { pos = 100; dir = -1; }
      if (pos <= 0) { pos = 0; dir = 1; }
      setScanLinePos(pos);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // Start camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setScanning(true);
        }
      } catch {
        setCameraError(true);
      }
    };
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const handleSettle = async (hash) => {
    if (!hash) { setShowManual(false); return; }
    setLoading(true);
    setError("");
    try {
      const res = await base44.functions.invoke("settleByQrScan", {
        qrCodeHash: hash,
        surplusItemId: itemId,
        sellerUserId: user?.id,
      });
      setSettleResult(res?.data);
      setSettled(true);
      streamRef.current?.getTracks().forEach(t => t.stop());
    } catch (e) {
      setError(e?.response?.data?.error || "QR code invalid or already used.");
    }
    setLoading(false);
    setShowManual(false);
  };

  if (settled) {
    return <SettlementSuccess item={item} result={settleResult} onListMore={() => navigate("/kemetro/surplus/add")} />;
  }

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#14532D" }}>
      {/* Header */}
      <div className="px-4 pt-safe flex items-center gap-3" style={{ paddingTop: "max(env(safe-area-inset-top,16px), 16px)", paddingBottom: 12 }}>
        <button onClick={() => navigate(-1)} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div>
          <p className="text-white font-black text-lg">📷 Scan Buyer's QR Code</p>
          <p className="text-white/70 text-sm">Point your camera at the buyer's QR screen</p>
        </div>
      </div>

      {/* Viewfinder */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="relative" style={{ width: "min(80vw, 320px)", aspectRatio: "1" }}>
          {/* Camera feed */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden bg-black/40">
            {cameraError ? (
              <div className="w-full h-full flex items-center justify-center text-white/50">
                <div className="text-center">
                  <Camera size={48} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Camera unavailable</p>
                </div>
              </div>
            ) : (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            )}
          </div>

          {/* Corner guides */}
          {["tl", "tr", "bl", "br"].map(pos => (
            <div key={pos} className="absolute w-8 h-8" style={{
              top: pos.includes("t") ? -3 : "auto",
              bottom: pos.includes("b") ? -3 : "auto",
              left: pos.includes("l") ? -3 : "auto",
              right: pos.includes("r") ? -3 : "auto",
              borderTop: pos.includes("t") ? "3px solid #4ade80" : "none",
              borderBottom: pos.includes("b") ? "3px solid #4ade80" : "none",
              borderLeft: pos.includes("l") ? "3px solid #4ade80" : "none",
              borderRight: pos.includes("r") ? "3px solid #4ade80" : "none",
              borderRadius: pos === "tl" ? "4px 0 0 0" : pos === "tr" ? "0 4px 0 0" : pos === "bl" ? "0 0 0 4px" : "0 0 4px 0",
            }} />
          ))}

          {/* Scanning line */}
          <div
            className="absolute left-2 right-2 h-0.5 bg-white/80 rounded-full"
            style={{
              top: `${scanLinePos}%`,
              boxShadow: "0 0 8px 2px rgba(74,222,128,0.6)",
              transition: "top 0.05s linear",
            }}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-6 mb-3 bg-red-500/90 rounded-xl px-4 py-3 text-white text-sm font-bold text-center">
          ⚠️ {error}
        </div>
      )}

      {/* Item pill */}
      {item && (
        <div className="mx-6 mb-4 bg-white rounded-2xl px-4 py-3 flex items-center gap-3">
          <img
            src={item.primaryImageUrl || item.images?.[0] || ""}
            alt=""
            className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
          />
          <p className="text-sm font-bold text-gray-900 flex-1 truncate">
            {item.title} — {Number(item.surplusPriceEGP).toLocaleString()} EGP ready to release
          </p>
        </div>
      )}

      {/* Manual entry link */}
      <div className="text-center pb-safe pb-8">
        <button
          onClick={() => setShowManual(true)}
          className="text-white/70 text-sm flex items-center gap-1.5 mx-auto hover:text-white transition-colors"
        >
          <Keyboard size={14} /> ✏️ Enter code manually instead
        </button>
      </div>

      {showManual && <ManualEntry onSubmit={handleSettle} loading={loading} />}
    </div>
  );
}