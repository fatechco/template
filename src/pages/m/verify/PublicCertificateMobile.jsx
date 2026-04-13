import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const LEVEL_LABELS = ["", "Self Declaration", "Documents Verified", "GPS Confirmed", "FO On-Site Visit", "Blockchain Certificate"];

export default function PublicCertificateMobile() {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [property, setProperty] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const tokens = await base44.entities.PropertyToken.filter({ tokenId });
      const tok = tokens?.[0];
      setToken(tok);
      if (tok?.propertyId) {
        const [props, recs] = await Promise.all([
          base44.entities.Property.filter({ id: tok.propertyId }),
          base44.entities.VerificationRecord.filter({ tokenId: tok.id }, "recordNumber", 200),
        ]);
        setProperty(props?.[0]);
        setRecords(recs || []);
      }
      setLoading(false);
    };
    load();
  }, [tokenId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!token) return (
    <div className="min-h-screen bg-gray-50 pb-28 flex flex-col">
      <div className="bg-white border-b border-gray-100 px-4 flex items-center gap-3" style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: 12 }}>
        <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <p className="font-black text-gray-900 text-sm">🛡️ Verify Certificate</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <p className="font-black text-gray-800 text-lg">Certificate Not Found</p>
        <p className="text-gray-500 text-xs mt-2">Token ID: {tokenId}</p>
      </div>
      <MobileBottomNav />
    </div>
  );

  const level = token.verificationLevel || 1;
  const isFullyCertified = level >= 5 && token.certificateIssued;

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 flex items-center gap-3" style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: 12 }}>
        <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <p className="font-black text-gray-900 text-sm flex-1">🛡️ Verification Certificate</p>
        <button onClick={() => navigator.share?.({ url: window.location.href, title: "Kemedar Verify Pro™" })}
          className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
          <Share2 size={16} className="text-gray-600" />
        </button>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Certificate Hero */}
        <div className={`rounded-3xl p-6 text-white text-center ${isFullyCertified ? "bg-gradient-to-br from-green-700 to-emerald-900" : "bg-gradient-to-br from-blue-700 to-indigo-900"}`}>
          <div className="text-5xl mb-3">{isFullyCertified ? "✅" : "🛡️"}</div>
          <p className="font-black text-2xl mb-1">{isFullyCertified ? "Fully Verified" : `Level ${level} Verified`}</p>
          <p className="text-white/70 text-sm mb-4">{LEVEL_LABELS[level]}</p>
          <div className="flex items-center justify-center gap-1 mb-4">
            {[1,2,3,4,5].map(l => (
              <div key={l} className={`h-2 flex-1 rounded-full ${l <= level ? "bg-white" : "bg-white/30"}`} />
            ))}
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2">
            <p className="text-white/60 text-[10px]">Certificate ID</p>
            <p className="font-mono font-black text-sm">{token.tokenId}</p>
          </div>
        </div>

        {/* Property Details */}
        {property && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">🏠 Property</p>
            <p className="font-black text-gray-900 mb-1">{property.title}</p>
            {property.address && <p className="text-xs text-gray-500">📍 {property.address}</p>}
            <div className="flex flex-wrap gap-2 mt-3">
              {property.category_id && <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">🏢 Property</span>}
              {token.franchiseOwnerVerified && <span className="bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">✅ FO Verified</span>}
              {token.certificateIssued && <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full">🔗 On Chain</span>}
            </div>
          </div>
        )}

        {/* Verification levels achieved */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Verification Levels</p>
          <div className="space-y-2">
            {[1,2,3,4,5].map(l => (
              <div key={l} className={`flex items-center gap-3 p-2 rounded-xl ${l <= level ? "bg-green-50" : "bg-gray-50"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${l <= level ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                  {l <= level ? "✓" : l}
                </div>
                <p className={`text-sm font-bold ${l <= level ? "text-green-800" : "text-gray-400"}`}>{LEVEL_LABELS[l]}</p>
                {l <= level && <span className="ml-auto text-[10px] text-green-600 font-bold">COMPLETE</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Verification chain */}
        {records.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">🔗 Verification Chain ({records.length} records)</p>
            <div className="space-y-2">
              {records.slice(0, 5).map((r, i) => (
                <div key={r.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-[10px] font-black text-blue-700 flex-shrink-0">{i+1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">{r.actionType || `Record #${r.recordNumber}`}</p>
                    {r.recordedAt && <p className="text-[10px] text-gray-400">{new Date(r.recordedAt).toLocaleDateString()}</p>}
                  </div>
                </div>
              ))}
              {records.length > 5 && <p className="text-xs text-gray-400 text-center">+ {records.length - 5} more records</p>}
            </div>
          </div>
        )}

        {/* Legal disclaimer */}
        <div className="bg-gray-100 rounded-2xl p-4">
          <p className="text-[10px] text-gray-500 leading-relaxed text-center">
            This certificate is issued by Kemedar® and confirms completion of the Kemedar Verify Pro™ process.
            It does not constitute a legal title transfer or government registration document.
            {token.certificateExpiresAt && ` Valid until: ${new Date(token.certificateExpiresAt).toLocaleDateString()}`}
          </p>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}