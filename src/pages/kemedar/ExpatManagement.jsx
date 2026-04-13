import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";

const FX_RATES = { AED: 14.3, SAR: 13.9, QAR: 14.4, KWD: 171.0, USD: 52.5, GBP: 66.0, EUR: 57.0 };

export default function ExpatManagement() {
  const [contracts, setContracts] = useState([]);
  const [reports, setReports] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    load();
  }, []);

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

  const currency = profile?.primaryCurrency || "AED";
  const rate = FX_RATES[currency] || 14.3;

  const generateNarrative = async (report) => {
    setGenerating(true);
    await base44.functions.invoke("generateMonthlyReport", { contractId: report.contractId, period: report.reportPeriod });
    await load();
    setGenerating(false);
  };

  const totalRent = contracts.reduce((s, c) => s + (c.totalRentCollected || 0), 0);
  const netIncome = contracts.reduce((s, c) => s + (c.netIncomeToOwner || 0), 0);

  const contractReports = selectedContract ? reports.filter(r => r.contractId === selectedContract.id) : [];
  const latestReport = contractReports[0];

  const fmt = (n) => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;

  if (contracts.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-6xl mb-4">🏠</p>
          <h2 className="text-2xl font-black text-gray-900 mb-3">No Managed Properties Yet</h2>
          <p className="text-gray-500 mb-6">Once you purchase a property and activate management, your monthly reports and financials will appear here.</p>
          <Link to="/search-properties" className="inline-block bg-orange-500 text-white font-black px-6 py-3 rounded-xl hover:bg-orange-400">Browse Properties →</Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        <h1 className="text-2xl font-black text-gray-900 mb-2">🏠 Property Management</h1>
        <p className="text-gray-500 mb-6">Your properties, fully managed while you're abroad</p>

        {/* Portfolio summary */}
        <div className="bg-gradient-to-br from-[#0d1b3e] to-[#1a2f5e] rounded-2xl p-6 text-white mb-6">
          <p className="text-sm font-bold text-blue-300 mb-1">Your Egyptian Property Portfolio</p>
          <div className="flex flex-wrap gap-8">
            <div><p className="text-3xl font-black">{contracts.length}</p><p className="text-blue-200 text-sm">Properties</p></div>
            <div><p className="text-3xl font-black text-green-400">{fmt(totalRent)} EGP</p><p className="text-blue-200 text-sm">Total collected</p></div>
            <div><p className="text-3xl font-black text-orange-400">{fmt(netIncome)} EGP</p><p className="text-blue-200 text-sm">Net to you</p></div>
            <div><p className="text-3xl font-black">{fmt(netIncome / rate)} {currency}</p><p className="text-blue-200 text-sm">In your currency</p></div>
          </div>
        </div>

        <div className="flex gap-6 items-start">
          {/* Contract list */}
          <div className="w-72 flex-shrink-0 space-y-3">
            {contracts.map(c => (
              <button key={c.id} onClick={() => setSelectedContract(c)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${selectedContract?.id === c.id ? "border-orange-500 bg-orange-50" : "border-gray-100 bg-white hover:border-gray-200"}`}>
                <p className="font-black text-gray-900 text-sm">Contract #{c.contractNumber || c.id.slice(0, 8)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.isRented ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-600"}`}>
                    {c.isRented ? "Rented" : "Vacant"}
                  </span>
                </div>
                {c.currentRentAmount > 0 && <p className="text-sm font-bold text-green-600 mt-1">{fmt(c.currentRentAmount)} EGP/mo</p>}
              </button>
            ))}
          </div>

          {/* Report view */}
          {selectedContract && (
            <div className="flex-1 space-y-5">
              {latestReport ? (
                <>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="font-black text-gray-900">📊 Report — {latestReport.reportPeriod}</h2>
                        <p className="text-xs text-gray-400">Generated {latestReport.generatedAt ? new Date(latestReport.generatedAt).toLocaleDateString() : "—"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setLang("en")} className={`text-xs font-bold px-2 py-1 rounded ${lang === "en" ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-100"}`}>EN</button>
                        <button onClick={() => setLang("ar")} className={`text-xs font-bold px-2 py-1 rounded ${lang === "ar" ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-100"}`}>عربي</button>
                      </div>
                    </div>

                    {/* Financial table */}
                    <div className="border border-gray-100 rounded-xl overflow-hidden mb-5">
                      <div className="bg-gray-50 px-4 py-2 text-xs font-black text-gray-500 uppercase">Income</div>
                      <div className="px-4 py-3 flex justify-between border-b border-gray-50"><span className="text-sm text-gray-700">Rent collected</span><span className="font-bold text-green-600">{fmt(latestReport.rentCollected)} EGP</span></div>
                      <div className="bg-gray-50 px-4 py-2 text-xs font-black text-gray-500 uppercase">Deductions</div>
                      <div className="px-4 py-3 flex justify-between border-b border-gray-50"><span className="text-sm text-gray-700">Management fee</span><span className="font-bold text-red-500">-{fmt(latestReport.managementFeeCharged)} EGP</span></div>
                      <div className="px-4 py-3 flex justify-between border-b border-gray-50"><span className="text-sm text-gray-700">Maintenance</span><span className="font-bold text-red-500">-{fmt(latestReport.maintenanceCosts)} EGP</span></div>
                      <div className="px-4 py-3 flex justify-between border-b border-gray-50"><span className="text-sm text-gray-700">Utilities</span><span className="font-bold text-red-500">-{fmt(latestReport.utilitiesPaid)} EGP</span></div>
                      <div className="px-4 py-4 flex justify-between bg-green-50"><span className="font-black text-gray-900">Net to you</span><div className="text-right"><p className="font-black text-green-600 text-lg">{fmt(latestReport.netIncomeToOwner)} EGP</p><p className="text-xs text-gray-400">≈ {fmt(latestReport.netIncomeToOwner / rate)} {currency}</p></div></div>
                    </div>

                    {/* AI Summary */}
                    {latestReport.aiExecutiveSummary ? (
                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                          <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">📝 Executive Summary</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{lang === "ar" ? latestReport.aiExecutiveSummaryAr : latestReport.aiExecutiveSummary}</p>
                        </div>
                        {latestReport.aiPositiveHighlight && (
                          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                            <p className="text-xs font-bold text-green-600 mb-1">✅ This Month's Highlight</p>
                            <p className="text-sm text-gray-700">{latestReport.aiPositiveHighlight}</p>
                          </div>
                        )}
                        {latestReport.aiRecommendations?.length > 0 && (
                          <div>
                            <p className="font-bold text-gray-900 text-sm mb-2">📅 Recommendations for Next Month</p>
                            <ul className="space-y-1">{latestReport.aiRecommendations.map((r, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-orange-500 mt-0.5">•</span>{r}</li>)}</ul>
                          </div>
                        )}
                        {latestReport.foPersonalNote && (
                          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                            <p className="text-xs font-bold text-orange-600 mb-1">📝 Note from Your FO</p>
                            <p className="text-sm text-gray-700 italic">{latestReport.foPersonalNote}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-500 mb-3">No AI narrative yet for this report</p>
                        <button onClick={() => generateNarrative(latestReport)} disabled={generating}
                          className="text-sm bg-orange-500 text-white font-bold px-4 py-2 rounded-xl disabled:opacity-60 flex items-center gap-2 mx-auto">
                          {generating ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating...</> : "✨ Generate AI Report"}
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <button className="text-xs bg-gray-100 text-gray-700 font-bold px-4 py-2 rounded-xl hover:bg-gray-200">⬇️ Download PDF</button>
                      <button className="text-xs bg-gray-100 text-gray-700 font-bold px-4 py-2 rounded-xl hover:bg-gray-200">📧 Email to Self</button>
                      {!latestReport.ownerAcknowledgedAt && (
                        <button className="text-xs bg-green-500 text-white font-bold px-4 py-2 rounded-xl hover:bg-green-600">✅ Acknowledge</button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                  <p className="text-4xl mb-3">📊</p>
                  <p className="font-bold text-gray-700">No reports yet for this contract</p>
                  <p className="text-sm text-gray-400 mt-1">Reports are generated monthly by your FO</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}