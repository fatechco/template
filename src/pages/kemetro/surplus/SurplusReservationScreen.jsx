import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Download, RefreshCw, MessageCircle, X, CheckCircle, Leaf } from "lucide-react";
import QRCode from "./QRCodeCanvas";

function Countdown({ expiresAt }) {
  const [diff, setDiff] = useState(0);
  useEffect(() => {
    const calc = () => setDiff(Math.max(0, new Date(expiresAt) - Date.now()));
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const urgent = hours < 2;
  const expired = diff === 0;

  if (expired) return <span className="text-red-600 font-bold text-sm">⚠️ QR Code Expired</span>;
  return (
    <span className={`font-bold text-sm ${urgent ? "text-orange-500" : "text-gray-600"}`}>
      Expires in {hours}h {mins}m {secs}s
    </span>
  );
}

function CancelDialog({ item, onConfirm, onClose, cancelling }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <h3 className="font-black text-gray-900 text-lg mb-2">Cancel Reservation?</h3>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure? Your{" "}
          <span className="font-bold text-gray-900">{Number(item?.surplusPriceEGP || 0).toLocaleString()} EGP</span>{" "}
          will be refunded immediately to your XeedWallet.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-green-500 text-green-700 hover:bg-green-50 transition-colors"
          >
            Keep Reservation
          </button>
          <button
            onClick={onConfirm}
            disabled={cancelling}
            className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {cancelling ? "Cancelling…" : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  { icon: "📅", text: "Agree pickup time with seller in chat" },
  { icon: "🚗", text: "Drive to their location and inspect the items" },
  { icon: "📱", text: "Show seller this QR code on your screen" },
  { icon: "✅", text: "Seller scans it — payment released instantly" },
];

export default function SurplusReservationScreen() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelDone, setCancelDone] = useState(false);
  const qrRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const items = await base44.entities.SurplusItem.filter({ id: itemId }, "-created_date", 1);
        if (items?.[0]) {
          setItem(items[0]);
          const txns = await base44.entities.SurplusTransaction.filter(
            { surplusItemId: itemId, transactionType: "reservation" }, "-created_date", 1
          );
          if (txns?.[0]) setTransaction(txns[0]);
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [itemId]);

  const handleCancel = async () => {
    setCancelling(true);
    await base44.functions.invoke("cancelSurplusReservation", { surplusItemId: itemId });
    setCancelling(false);
    setCancelDone(true);
    setShowCancel(false);
  };

  const handleSaveQR = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `kemetro-qr-${item?.pickupQrCode?.slice(0, 8)}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F0FDF4" }}>
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (cancelDone) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ background: "#F0FDF4" }}>
        <div className="text-6xl mb-4">💸</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Reservation Cancelled</h2>
        <p className="text-gray-600 mb-6">Your {Number(item?.surplusPriceEGP || 0).toLocaleString()} EGP has been refunded to your XeedWallet.</p>
        <Link to="/kemetro/surplus" className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl">Back to Marketplace</Link>
      </div>
    );
  }

  const qrHash = item?.pickupQrCode || "DEMO-HASH-123456";
  const shortId = qrHash.slice(0, 8).toUpperCase();
  const expiresAt = item?.pickupQrCodeExpiresAt || item?.reservationExpiryAt;

  return (
    <div className="min-h-screen" style={{ background: "#F0FDF4" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="font-black text-gray-900 text-base">Reservation Confirmed</h1>
          <p className="text-xs text-gray-500">Surplus & Salvage</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-5">

        {/* Success Banner */}
        <div className="bg-green-600 rounded-2xl p-5 text-white text-center">
          <CheckCircle size={36} className="mx-auto mb-2 text-green-200" />
          <h2 className="text-xl font-black mb-1">✅ Reservation Confirmed!</h2>
          <p className="font-bold text-lg">{Number(item?.surplusPriceEGP || 0).toLocaleString()} EGP held securely in XeedWallet Escrow</p>
          <p className="text-green-100 text-xs mt-2 leading-relaxed">
            Your funds are safe. They release <strong>ONLY</strong> when you scan and confirm the items.
          </p>
        </div>

        {/* Item Summary */}
        {item && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <img
              src={item.primaryImageUrl || item.images?.[0] || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&q=70"}
              alt=""
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-black text-gray-900 text-sm leading-tight line-clamp-2 mb-1">{item.title}</p>
              <p className="text-green-700 font-bold text-base">{Number(item.surplusPriceEGP).toLocaleString()} EGP</p>
              {item.addressText && (
                <p className="text-xs text-gray-500 mt-1">📍 {item.addressText}</p>
              )}
            </div>
          </div>
        )}

        {/* QR Code Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center" style={{ border: "2px dashed #16a34a" }}>
          <p className="font-black text-gray-900 text-base mb-1">Show this QR to the seller</p>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Seller scans it to release payment<br />after you inspect the items
          </p>

          <div ref={qrRef} className="flex justify-center mb-4">
            <QRCode value={qrHash} size={200} />
          </div>

          <p className="text-xs text-gray-400 mb-1">Reservation ID</p>
          <p className="font-mono font-bold text-gray-800 text-base mb-3">{shortId}</p>

          {expiresAt && <Countdown expiresAt={expiresAt} />}

          <div className="flex items-center justify-center gap-4 mt-5">
            <button
              onClick={handleSaveQR}
              className="flex items-center gap-2 px-4 py-2 border-2 border-green-600 text-green-700 font-bold rounded-xl text-sm hover:bg-green-50 transition-colors"
            >
              <Download size={14} /> Save QR to Phone
            </button>
          </div>
          {expiresAt && new Date(expiresAt) - Date.now() < 2 * 3600000 && (
            <button className="mt-3 text-xs text-gray-400 underline flex items-center gap-1 mx-auto">
              <RefreshCw size={11} /> Regenerate QR
            </button>
          )}
        </div>

        {/* Chat Teaser */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={18} className="text-green-600" />
            <p className="font-bold text-gray-900 text-sm">Chat with Seller to arrange pickup</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 mb-3 space-y-2">
            <div className="flex gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex-shrink-0" />
              <div className="bg-white rounded-xl px-3 py-2 text-xs text-gray-700 shadow-sm max-w-[80%]">
                Hi! Looking forward to the pickup 🙂
              </div>
            </div>
          </div>
          <button className="w-full py-2.5 border-2 border-green-600 text-green-700 font-bold rounded-xl text-sm hover:bg-green-50 transition-colors">
            Open Full Chat →
          </button>
        </div>

        {/* What Happens Next */}
        <div className="bg-gray-50 rounded-2xl p-5">
          <p className="font-black text-gray-900 text-sm mb-4">What Happens Next</p>
          <div className="space-y-3">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-base">{s.icon}</span>
                  <p className="text-sm text-gray-700 leading-snug">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cancel */}
        <div className="text-center pb-8">
          <button
            onClick={() => setShowCancel(true)}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 mx-auto"
          >
            <X size={13} /> Cancel reservation
          </button>
        </div>
      </div>

      {showCancel && (
        <CancelDialog
          item={item}
          onConfirm={handleCancel}
          onClose={() => setShowCancel(false)}
          cancelling={cancelling}
        />
      )}
    </div>
  );
}