import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";
import VerifyLevel1 from "@/components/verify/VerifyLevel1";
import VerifyLevel2 from "@/components/verify/VerifyLevel2";
import VerifyLevel3 from "@/components/verify/VerifyLevel3";
import VerifyLevel4 from "@/components/verify/VerifyLevel4";
import VerifyLevel5 from "@/components/verify/VerifyLevel5";

const LEVELS_META = [
  { level: 1, label: "Self Declaration", icon: "📋" },
  { level: 2, label: "Documents", icon: "📄" },
  { level: 3, label: "GPS Pin", icon: "📍" },
  { level: 4, label: "FO Visit", icon: "🏠" },
  { level: 5, label: "Certificate", icon: "🔗" },
];

export default function SellerVerificationMobile() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [property, setProperty] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const me = await base44.auth.me();
      setUser(me);
      const props = await base44.entities.Property.filter({ id: propertyId });
      const prop = props?.[0];
      setProperty(prop);
      if (prop) {
        const res = await base44.functions.invoke("mintPropertyToken", { propertyId, sellerUserId: me.id });
        setToken(res.data?.token);
      }
      setLoading(false);
    };
    init();
  }, [propertyId]);

  const refreshToken = async () => {
    const tokens = await base44.entities.PropertyToken.filter({ propertyId });
    if (tokens?.[0]) setToken(tokens[0]);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const currentLevel = token?.verificationLevel || 1;

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 flex items-center gap-3" style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: 12 }}>
        <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 text-sm">🛡️ Verify My Property</p>
          <p className="text-xs text-gray-400 truncate">{property?.title || "Property"}</p>
        </div>
        <span className={`text-xs font-black px-2 py-1 rounded-full ${currentLevel >= 5 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
          Level {currentLevel}/5
        </span>
      </div>

      {/* Progress steps */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {LEVELS_META.map((l, i) => (
            <div key={l.level} className="flex items-center gap-1">
              <div className={`flex flex-col items-center gap-0.5 ${l.level <= currentLevel ? "opacity-100" : "opacity-30"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${l.level < currentLevel ? "bg-green-500 text-white" : l.level === currentLevel ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                  {l.level < currentLevel ? "✓" : l.icon}
                </div>
                <span className="text-[8px] text-gray-500 text-center leading-tight" style={{ maxWidth: 44 }}>{l.label}</span>
              </div>
              {i < LEVELS_META.length - 1 && (
                <div className={`h-0.5 w-4 mx-0.5 rounded-full mb-3 ${l.level < currentLevel ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Level components */}
      <div className="px-4 py-5 space-y-4">
        <VerifyLevel1 token={token} />
        <VerifyLevel2 token={token} user={user} currentLevel={currentLevel} onComplete={refreshToken} />
        <VerifyLevel3 token={token} property={property} currentLevel={currentLevel} onComplete={refreshToken} />
        <VerifyLevel4 token={token} property={property} currentLevel={currentLevel} onComplete={refreshToken} />
        <VerifyLevel5 token={token} property={property} user={user} currentLevel={currentLevel} onComplete={refreshToken} />
      </div>

      <MobileBottomNav />
    </div>
  );
}