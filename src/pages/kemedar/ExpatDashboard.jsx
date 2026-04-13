import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import ExpatCurrencyWidget from "@/components/expat/ExpatCurrencyWidget";

const FX_RATES = { AED: 14.3, SAR: 13.9, QAR: 14.4, KWD: 171.0, USD: 52.5, GBP: 66.0, EUR: 57.0 };
const FX_FLAGS = { AED: "🇦🇪", SAR: "🇸🇦", QAR: "🇶🇦", KWD: "🇰🇼", USD: "🇺🇸", GBP: "🇬🇧", EUR: "🇪🇺" };

function getHour() { return new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo", hour: "numeric", hour12: false }); }
function getGreeting() { const h = parseInt(getHour()); return h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening"; }
function egyptTime() { return new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo", hour: "2-digit", minute: "2-digit", hour12: true }); }

export default function ExpatDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [reports, setReports] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [convertAmount, setConvertAmount] = useState(10000);

  useEffect(() => {
    load();
  }, []);

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
      if (contractsData.length > 0) {
        const reps = await base44.entities.PropertyManagementReport.filter({ ownerId: u.id });
        setReports(reps.sort((a, b) => b.reportPeriod?.localeCompare(a.reportPeriod)));
      }
      if (profiles[0]) {
        const ints = await base44.entities.ExpatPropertyInterest.filter({ userId: u.id });
        setInterests(ints);
      }
    }
    setLoading(false);
  };

  const currency = profile?.primaryCurrency || "AED";
  const rate = FX_RATES[currency] || 14.3;
  const flag = FX_FLAGS[currency] || "🇦🇪";

  const totalRent = contracts.reduce((s, c) => s + (c.currentRentAmount || 0), 0);
  const managedCount = contracts.filter(c => c.status === "active").length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <p className="text-6xl mb-4">🌍</p>
            <h2 className="text-2xl font-black text-gray-900 mb-3">Welcome to Kemedar Expat™</h2>
            <p className="text-gray-500 mb-6">Create your expat profile to access personalized property search, FO matching, and property management.</p>
            <Link to="/kemedar/expat/setup" className="inline-block bg-orange-500 text-white font-black px-8 py-4 rounded-2xl hover:bg-orange-400 transition-colors">
              Create My Expat Profile →
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
        <div className="flex gap-6 items-start">

          {/* LEFT SIDEBAR */}
          <div className="w-72 flex-shrink-0 space-y-4 sticky top-24">
            {/* User Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center font-black text-orange-600 text-xl">
                  {user?.full_name?.charAt(0) || "E"}
                </div>
                <div>
                  <p className="font-black text-gray-900">{user?.full_name}</p>
                  <p className="text-xs text-gray-400">🌍 Expat Member</p>
                  <p className="text-xs text-gray-500">📍 {profile.currentCity}, {profile.currentCountry}</p>
                </div>
              </div>
              <div className="bg-orange-50 rounded-xl p-2 text-center">
                <p className="text-xs font-bold text-orange-600">💱 Primary: {flag} {currency}</p>
              </div>
            </div>

            {/* FO Card */}
            <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">🤝 Your Franchise Owner</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center font-black text-orange-600">A</div>
                <div>
                  <p className="font-black text-gray-900 text-sm">Ahmed Hassan</p>
                  <p className="text-xs text-gray-500">New Cairo & 5th Settlement</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span className="text-[10px] text-green-600">Online now</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a href="https://wa.me/201000000000" target="_blank" rel="noreferrer"
                  className="text-center text-xs bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600">💬 WhatsApp</a>
                <button className="text-xs border border-gray-200 text-gray-600 font-bold py-2 rounded-lg hover:bg-gray-50">📹 Video</button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</p>
              <div className="space-y-2">
                {[
                  { to: "/search-properties", icon: "🔍", label: "Search Properties" },
                  { to: "/kemedar/expat/management", icon: "📊", label: "View Reports" },
                  { to: "/kemedar/expat/legal", icon: "⚖️", label: "Legal Services" },
                  { to: "/kemedar/expat/community", icon: "🌍", label: "Expat Community" },
                ].map(a => (
                  <Link key={a.to} to={a.to} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    <span>{a.icon}</span> {a.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Greeting */}
            <div className="bg-gradient-to-br from-[#0d1b3e] to-[#1a2f5e] rounded-2xl p-6 text-white">
              <p className="text-xl font-black">{getGreeting()}, {user?.full_name?.split(" ")[0]}! 🌍</p>
              <p className="text-blue-200 text-sm mt-1">
                {flag} Calling from {profile.currentCity} — It's {egyptTime()} in Egypt right now
              </p>
              <div className="flex gap-4 mt-4">
                <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
                  <p className="text-2xl font-black text-white">{managedCount}</p>
                  <p className="text-blue-200 text-xs">Properties managed</p>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
                  <p className="text-2xl font-black text-orange-400">{new Intl.NumberFormat("en").format(Math.round(totalRent / rate))}</p>
                  <p className="text-blue-200 text-xs">Monthly income {currency}</p>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
                  <p className="text-2xl font-black text-white">{interests.length}</p>
                  <p className="text-blue-200 text-xs">Saved properties</p>
                </div>
              </div>
            </div>

            {/* Managed Properties */}
            {contracts.length > 0 ? (
              <div>
                <p className="font-black text-gray-900 text-lg mb-3">🏠 Your Properties in Egypt</p>
                <div className="space-y-4">
                  {contracts.map(c => {
                    const latestReport = reports.find(r => r.contractId === c.id);
                    return (
                      <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden border-l-4 border-l-orange-500">
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-black text-gray-900">Property #{c.contractNumber || c.id.slice(0, 8)}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.isRented ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                                  {c.isRented ? "🟢 Rented" : "🔵 Vacant"}
                                </span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.status === "active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                                  {c.status}
                                </span>
                              </div>
                            </div>
                            {c.isRented && (
                              <div className="text-right flex-shrink-0">
                                <p className="font-black text-green-600 text-lg">{new Intl.NumberFormat("en").format(c.currentRentAmount || 0)} EGP</p>
                                <p className="text-xs text-gray-400">≈ {new Intl.NumberFormat("en").format(Math.round((c.currentRentAmount || 0) / rate))} {currency}/mo</p>
                              </div>
                            )}
                          </div>

                          {latestReport && (
                            <div className="mt-4 bg-gray-50 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {[
                                { label: "Rent", val: latestReport.rentCollected, color: "text-green-600" },
                                { label: "Mgmt fee", val: -latestReport.managementFeeCharged, color: "text-red-500" },
                                { label: "Maintenance", val: -latestReport.maintenanceCosts, color: "text-orange-500" },
                                { label: "Net", val: latestReport.netIncomeToOwner, color: "text-blue-700" },
                              ].map(item => (
                                <div key={item.label}>
                                  <p className={`font-black text-sm ${item.color}`}>{new Intl.NumberFormat("en").format(item.val)} EGP</p>
                                  <p className="text-[10px] text-gray-400">{item.label}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2 mt-4">
                            <Link to={`/kemedar/expat/management`} className="text-xs bg-orange-500 text-white font-bold px-4 py-2 rounded-xl hover:bg-orange-400">
                              📊 Full Report
                            </Link>
                            <button className="text-xs border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl hover:bg-gray-50">
                              💬 Message FO
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                <p className="text-4xl mb-3">🔍</p>
                <h3 className="font-black text-gray-900 text-lg mb-2">Start Your Search</h3>
                <p className="text-gray-500 text-sm mb-5">Browse properties with AI investment briefs tailored for expats</p>
                <Link to="/search-properties" className="inline-block bg-orange-500 text-white font-black px-6 py-3 rounded-xl hover:bg-orange-400">
                  Browse Properties →
                </Link>
              </div>
            )}

            {/* Watched Properties */}
            {interests.length > 0 && (
              <div>
                <p className="font-black text-gray-900 text-lg mb-3">❤️ Properties You're Watching</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {interests.map(interest => (
                    <div key={interest.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          interest.interestLevel === "serious" ? "bg-orange-100 text-orange-700" :
                          interest.interestLevel === "offer_made" ? "bg-purple-100 text-purple-700" :
                          "bg-gray-100 text-gray-600"
                        }`}>{interest.interestLevel?.replace("_", " ")}</span>
                        {interest.foVisitRequested && (
                          <span className={`text-[10px] font-bold ${interest.foVisitCompletedAt ? "text-green-600" : "text-orange-500"}`}>
                            {interest.foVisitCompletedAt ? "FO visit: ✅" : "FO visit: ⏳"}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-gray-900 mb-2">Property ID: {interest.propertyId?.slice(0, 8)}...</p>
                      {!interest.foVisitRequested && (
                        <button className="w-full text-xs bg-orange-500 text-white font-bold py-2 rounded-xl hover:bg-orange-400">
                          🏠 Request FO Visit
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="w-72 flex-shrink-0 space-y-4 sticky top-24">
            {/* Live Rates */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="font-black text-gray-900 text-sm mb-3">💱 Live Rates → EGP</p>
              {Object.entries(FX_RATES).map(([cur, r]) => (
                <div key={cur} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm font-bold text-gray-700">{FX_FLAGS[cur]} 1 {cur}</span>
                  <span className="text-sm font-black text-gray-900">{r} EGP</span>
                </div>
              ))}
              <p className="text-[10px] text-gray-400 mt-2 text-center">Updated 2 minutes ago</p>

              {/* Converter */}
              <div className="mt-3 bg-orange-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <input type="number" value={convertAmount} onChange={e => setConvertAmount(Number(e.target.value) || 0)}
                    className="flex-1 text-lg font-black bg-transparent outline-none w-0" />
                  <span className="text-sm font-bold text-gray-500">{currency}</span>
                </div>
                <p className="text-sm font-black text-orange-600">= {new Intl.NumberFormat("en-EG").format(convertAmount * rate)} EGP</p>
              </div>
            </div>

            {/* Egypt Time */}
            <div className="bg-[#0d1b3e] rounded-2xl p-4 text-white text-center">
              <p className="text-xs text-blue-300 mb-1">🕐 Egypt Time</p>
              <p className="text-2xl font-black">{egyptTime()}</p>
              <p className="text-blue-200 text-xs mt-1">{new Date().toLocaleDateString("en-EG", { timeZone: "Africa/Cairo", weekday: "long" })}</p>
              <p className="text-[10px] text-blue-300 mt-2">Best time to call FO: 10 AM – 6 PM EG</p>
            </div>

            {/* Community */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="font-black text-gray-900 text-sm mb-2">🌍 Egyptians in {profile.currentCountry || "UAE"}</p>
              <p className="text-xs text-gray-500 mb-3">Connect with expats investing back home</p>
              <Link to="/kemedar/expat/community" className="block text-center text-xs bg-blue-500 text-white font-bold py-2 rounded-xl hover:bg-blue-600">
                Join Community →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}