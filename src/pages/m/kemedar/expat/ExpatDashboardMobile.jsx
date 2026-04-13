import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const FX_RATES = { AED: 14.3, SAR: 13.9, QAR: 14.4, KWD: 171.0, USD: 52.5, GBP: 66.0, EUR: 57.0 };
const FX_FLAGS = { AED: "🇦🇪", SAR: "🇸🇦", QAR: "🇶🇦", KWD: "🇰🇼", USD: "🇺🇸", GBP: "🇬🇧", EUR: "🇪🇺" };

function egyptTime() {
  return new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo", hour: "2-digit", minute: "2-digit", hour12: true });
}
function getGreeting() {
  const h = parseInt(new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo", hour: "numeric", hour12: false }));
  return h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening";
}

const QUICK_LINKS = [
  { to: "/m/find/property", icon: "🔍", label: "Search Properties" },
  { to: "/m/kemedar/expat/management", icon: "📊", label: "Reports" },
  { to: "/m/kemedar/expat/legal", icon: "⚖️", label: "Legal" },
  { to: "/m/kemedar/expat/community", icon: "🌍", label: "Community" },
];

export default function ExpatDashboardMobile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me().catch(() => null);
      setUser(u);
      if (u) {
        const [profiles, contractsData] = await Promise.all([
          base44.entities.ExpatProfile.filter({ userId: u.id }),
          base44.entities.PropertyManagementContract.filter({ ownerId: u.id }),
        ]);
        setProfile(profiles[0] || null);
        setContracts(contractsData);
        if (profiles[0]) {
          const ints = await base44.entities.ExpatPropertyInterest.filter({ userId: u.id });
          setInterests(ints);
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const currency = profile?.primaryCurrency || "AED";
  const rate = FX_RATES[currency] || 14.3;
  const flag = FX_FLAGS[currency] || "🇦🇪";
  const totalRent = contracts.reduce((s, c) => s + (c.currentRentAmount || 0), 0);
  const managedCount = contracts.filter(c => c.status === "active").length;
  const fmt = n => new Intl.NumberFormat("en").format(Math.round(n));

  if (!profile) return (
    <div className="min-h-screen bg-white pb-28">
      <div className="bg-gradient-to-br from-[#0d1b3e] to-[#1a2f5e] text-white px-5 pt-14 pb-10 relative">
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="text-center">
          <div className="text-5xl mb-3">🌍</div>
          <h2 className="text-xl font-black mb-2">Welcome to Kemedar Expat™</h2>
          <p className="text-blue-200 text-sm mb-6">Create your profile to get started</p>
          <Link to="/m/kemedar/expat/setup" className="inline-block bg-orange-500 text-white font-black px-8 py-3.5 rounded-2xl">
            Create My Profile →
          </Link>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Hero greeting */}
      <div className="bg-gradient-to-br from-[#0d1b3e] to-[#1a2f5e] text-white px-5 pt-14 pb-6 relative">
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <p className="text-lg font-black">{getGreeting()}, {user?.full_name?.split(" ")[0]}! 🌍</p>
        <p className="text-blue-200 text-xs mt-0.5">{flag} Calling from {profile.currentCity} · {egyptTime()} in Egypt</p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { val: managedCount, label: "Properties" },
            { val: fmt(totalRent / rate), label: `Income ${currency}` },
            { val: interests.length, label: "Watching" },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl py-3 text-center">
              <p className="font-black text-white text-lg">{s.val}</p>
              <p className="text-blue-200 text-[10px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-4 pt-4">
        {/* Quick links */}
        <div className="grid grid-cols-4 gap-3">
          {QUICK_LINKS.map(l => (
            <Link key={l.to} to={l.to} className="flex flex-col items-center gap-1.5 bg-white rounded-2xl border border-gray-100 shadow-sm py-3">
              <span className="text-2xl">{l.icon}</span>
              <span className="text-[10px] font-bold text-gray-700">{l.label}</span>
            </Link>
          ))}
        </div>

        {/* FO Card */}
        <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">🤝 Your Franchise Owner</p>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 bg-orange-100 rounded-full flex items-center justify-center font-black text-orange-600 text-lg flex-shrink-0">A</div>
            <div className="flex-1">
              <p className="font-black text-gray-900 text-sm">Ahmed Hassan</p>
              <p className="text-xs text-gray-500">New Cairo & 5th Settlement</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span className="text-[10px] text-green-600">Online now</span>
              </div>
            </div>
            <div className="flex gap-2">
              <a href="https://wa.me/201000000000" target="_blank" rel="noreferrer"
                className="text-xs bg-green-500 text-white font-bold px-3 py-1.5 rounded-lg">💬</a>
              <button className="text-xs border border-gray-200 text-gray-600 font-bold px-3 py-1.5 rounded-lg">📹</button>
            </div>
          </div>
        </div>

        {/* Properties */}
        {contracts.length > 0 ? (
          <div>
            <p className="font-black text-gray-900 text-base mb-3">🏠 Your Properties in Egypt</p>
            <div className="space-y-3">
              {contracts.map(c => (
                <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 border-l-4 border-l-orange-500">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-black text-gray-900 text-sm">Contract #{c.contractNumber || c.id.slice(0, 8)}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.isRented ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-600"}`}>
                      {c.isRented ? "🟢 Rented" : "🔵 Vacant"}
                    </span>
                  </div>
                  {c.isRented && (
                    <p className="text-green-600 font-black text-sm">{fmt(c.currentRentAmount || 0)} EGP/mo <span className="text-gray-400 font-normal text-xs">≈ {fmt((c.currentRentAmount || 0) / rate)} {currency}</span></p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <Link to="/m/kemedar/expat/management" className="text-xs bg-orange-500 text-white font-bold px-3 py-1.5 rounded-lg">📊 Report</Link>
                    <button className="text-xs border border-gray-200 text-gray-600 font-bold px-3 py-1.5 rounded-lg">💬 FO</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <p className="text-3xl mb-2">🔍</p>
            <p className="font-black text-gray-900 mb-1">Start Your Search</p>
            <p className="text-gray-500 text-xs mb-4">Browse properties with AI investment briefs for expats</p>
            <Link to="/m/find/property" className="inline-block bg-orange-500 text-white font-black px-6 py-2.5 rounded-xl text-sm">
              Browse Properties →
            </Link>
          </div>
        )}

        {/* Egypt Time Card */}
        <div className="bg-[#0d1b3e] rounded-2xl p-4 text-white flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-300">🕐 Egypt Time</p>
            <p className="text-xl font-black mt-0.5">{egyptTime()}</p>
            <p className="text-[10px] text-blue-300 mt-1">Best to call FO: 10 AM – 6 PM</p>
          </div>
          <div className="text-4xl">🇪🇬</div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}