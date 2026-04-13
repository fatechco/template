import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const FX_RATES = { AED: 14.3, SAR: 13.9, QAR: 14.4, KWD: 171.0, USD: 52.5, GBP: 66.0, EUR: 57.0 };

export default function ExpatManagementMobile() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [reports, setReports] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState(null);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const load = async () => {
      const user = await base44.auth.me().catch(() => null);
      if (!user) { setLoading(false); return; }
      const [profiles, contractsData] = await Promise.all([
        base44.entities.ExpatProfile.filter({ userId: user.id }),
        base44.entities.PropertyManagementContract.filter({ ownerId: user.id }),
      ]);
      setProfile(profiles[0]);
      setContracts(contractsData);
      if (contractsData.length > 0) {
        const reps = await base44.entities.PropertyManagementReport.filter({ ownerId: user.id });
        setReports(reps.sort((a, b) => b.reportPeriod?.localeCompare(a.reportPeriod)));
        setSelectedContract(contractsData[0]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const currency = profile?.primaryCurrency || "AED";
  const rate = FX_RATES[currency] || 14.3;
  const fmt = n => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));
  const totalRent = contracts.reduce((s, c) => s + (c.totalRentCollected || 0), 0);
  const netIncome = contracts.reduce((s, c) => s + (c.netIncomeToOwner || 0), 0);
  const contractReports = selectedContract ? reports.filter(r => r.contractId === selectedContract.id) : [];
  const latestReport = contractReports[0];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 flex items-center gap-3" style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: 12 }}>
        <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <div>
          <p className="font-black text-gray-900 text-sm">🏠 Property Management</p>
          <p className="text-xs text-gray-400">Your properties, managed remotely</p>
        </div>
      </div>

      {contracts.length === 0 ? (
        <div className="flex items-center justify-center px-4 py-20 flex-col text-center">
          <p className="text-5xl mb-4">🏠</p>
          <h2 className="font-black text-gray-900 text-lg mb-2">No Managed Properties Yet</h2>
          <p className="text-gray-500 text-sm mb-5">Once you purchase and activate management, reports appear here.</p>
          <Link to="/m/find/property" className="inline-block bg-orange-500 text-white font-black px-6 py-3 rounded-xl text-sm">
            Browse Properties →
          </Link>
        </div>
      ) : (
        <div className="px-4 py-5 space-y-4">
          {/* Portfolio summary */}
          <div className="bg-gradient-to-br from-[#0d1b3e] to-[#1a2f5e] rounded-2xl p-5 text-white">
            <p className="text-xs text-blue-300 font-bold mb-3">Your Egyptian Property Portfolio</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: contracts.length, label: "Properties", color: "text-white" },
                { val: `${fmt(totalRent)} EGP`, label: "Total collected", color: "text-green-400" },
                { val: `${fmt(netIncome)} EGP`, label: "Net to you", color: "text-orange-400" },
                { val: `${fmt(netIncome / rate)} ${currency}`, label: "In your currency", color: "text-white" },
              ].map(s => (
                <div key={s.label} className="bg-white/10 rounded-xl px-3 py-2">
                  <p className={`font-black text-sm ${s.color}`}>{s.val}</p>
                  <p className="text-blue-200 text-[10px]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contract selector */}
          {contracts.length > 1 && (
            <div>
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Select Property</p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {contracts.map(c => (
                  <button key={c.id} onClick={() => setSelectedContract(c)}
                    className={`flex-shrink-0 px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all ${selectedContract?.id === c.id ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 bg-white text-gray-600"}`}>
                    #{c.contractNumber || c.id.slice(0, 6)} · {c.isRented ? "🟢" : "🔵"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Report */}
          {selectedContract && (
            latestReport ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-black text-gray-900 text-sm">📊 {latestReport.reportPeriod}</p>
                    <p className="text-xs text-gray-400">Generated {latestReport.generatedAt ? new Date(latestReport.generatedAt).toLocaleDateString() : "—"}</p>
                  </div>
                  <div className="flex gap-1">
                    {["en", "ar"].map(l => (
                      <button key={l} onClick={() => setLang(l)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-lg ${lang === l ? "bg-orange-500 text-white" : "text-gray-500 border border-gray-200"}`}>
                        {l === "en" ? "EN" : "عربي"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Financial breakdown */}
                <div className="border border-gray-100 rounded-xl overflow-hidden mb-4">
                  <div className="bg-gray-50 px-3 py-1.5 text-[10px] font-black text-gray-500 uppercase">Income</div>
                  <div className="px-3 py-2.5 flex justify-between border-b border-gray-50">
                    <span className="text-xs text-gray-700">Rent collected</span>
                    <span className="text-xs font-bold text-green-600">{fmt(latestReport.rentCollected)} EGP</span>
                  </div>
                  <div className="bg-gray-50 px-3 py-1.5 text-[10px] font-black text-gray-500 uppercase">Deductions</div>
                  <div className="px-3 py-2.5 flex justify-between border-b border-gray-50">
                    <span className="text-xs text-gray-700">Management fee</span>
                    <span className="text-xs font-bold text-red-500">-{fmt(latestReport.managementFeeCharged)} EGP</span>
                  </div>
                  <div className="px-3 py-2.5 flex justify-between border-b border-gray-50">
                    <span className="text-xs text-gray-700">Maintenance</span>
                    <span className="text-xs font-bold text-red-500">-{fmt(latestReport.maintenanceCosts)} EGP</span>
                  </div>
                  <div className="px-3 py-3 flex justify-between bg-green-50">
                    <span className="font-black text-gray-900 text-sm">Net to you</span>
                    <div className="text-right">
                      <p className="font-black text-green-600">{fmt(latestReport.netIncomeToOwner)} EGP</p>
                      <p className="text-[10px] text-gray-400">≈ {fmt(latestReport.netIncomeToOwner / rate)} {currency}</p>
                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                {latestReport.aiExecutiveSummary && (
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                      <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">📝 Executive Summary</p>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {lang === "ar" ? latestReport.aiExecutiveSummaryAr : latestReport.aiExecutiveSummary}
                      </p>
                    </div>
                    {latestReport.foPersonalNote && (
                      <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                        <p className="text-[10px] font-bold text-orange-600 mb-1">📝 Note from FO</p>
                        <p className="text-xs text-gray-700 italic">{latestReport.foPersonalNote}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 text-xs bg-gray-100 text-gray-700 font-bold py-2 rounded-xl">⬇️ PDF</button>
                  <button className="flex-1 text-xs bg-gray-100 text-gray-700 font-bold py-2 rounded-xl">📧 Email</button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                <p className="text-3xl mb-2">📊</p>
                <p className="font-bold text-gray-700 text-sm">No reports yet</p>
                <p className="text-xs text-gray-400 mt-1">Reports are generated monthly by your FO</p>
              </div>
            )
          )}
        </div>
      )}

      <MobileBottomNav />
    </div>
  );
}