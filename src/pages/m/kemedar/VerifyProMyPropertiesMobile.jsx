import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const LEVEL_COLORS = ["", "bg-gray-100 text-gray-600", "bg-blue-100 text-blue-700", "bg-indigo-100 text-indigo-700", "bg-orange-100 text-orange-700", "bg-green-100 text-green-700"];
const LEVEL_LABELS = ["", "L1: Declared", "L2: Docs", "L3: GPS", "L4: FO Visit", "L5: Certified"];

export default function VerifyProMyPropertiesMobile() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [tokens, setTokens] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const user = await base44.auth.me().catch(() => null);
      if (!user) { setLoading(false); return; }
      const props = await base44.entities.Property.filter({ user_id: user.id, is_active: true });
      setProperties(props);
      if (props.length > 0) {
        const toks = await base44.entities.PropertyToken.filter({ sellerUserId: user.id });
        const tokMap = {};
        toks.forEach(t => { tokMap[t.propertyId] = t; });
        setTokens(tokMap);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="bg-white border-b border-gray-100 px-4 flex items-center gap-3" style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: 12 }}>
        <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <div>
          <p className="font-black text-gray-900 text-sm">🛡️ Verify My Properties</p>
          <p className="text-xs text-gray-400">Select a property to start verification</p>
        </div>
      </div>

      <div className="px-4 py-5 space-y-3">
        {properties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🏠</p>
            <p className="font-black text-gray-900 text-lg mb-2">No Properties Found</p>
            <p className="text-gray-500 text-sm mb-5">Add a property first to start the verification process</p>
            <Link to="/m/add/property" className="inline-block bg-orange-500 text-white font-black px-6 py-3 rounded-xl text-sm">
              Add Property →
            </Link>
          </div>
        ) : (
          properties.map(prop => {
            const tok = tokens[prop.id];
            const level = tok?.verificationLevel || 0;
            return (
              <div key={prop.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {prop.featured_image && (
                  <img src={prop.featured_image} alt={prop.title} className="w-full h-32 object-cover" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-black text-gray-900 text-sm flex-1">{prop.title}</p>
                    {level > 0 ? (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${LEVEL_COLORS[level]}`}>
                        {LEVEL_LABELS[level]}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 flex-shrink-0">Not Verified</span>
                    )}
                  </div>

                  {/* Level bar */}
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(l => (
                      <div key={l} className={`flex-1 h-1.5 rounded-full ${l <= level ? "bg-green-500" : "bg-gray-200"}`} />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/m/verify/my-property/${prop.id}`}
                      className="flex-1 text-center text-xs bg-blue-500 text-white font-bold py-2.5 rounded-xl">
                      {level === 0 ? "🛡️ Start Verification" : level >= 5 ? "✅ View Certificate" : `⬆️ Continue Level ${level + 1}`}
                    </Link>
                    {tok?.tokenId && (
                      <Link to={`/m/verify/${tok.tokenId}`}
                        className="text-xs border border-gray-200 text-gray-600 font-bold px-3 py-2.5 rounded-xl">
                        🔗 Cert
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
}