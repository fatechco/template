import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import PortfolioKPIs from "@/components/kemefrac/portfolio/PortfolioKPIs";
import TabHoldings from "@/components/kemefrac/portfolio/TabHoldings";
import TabYieldHistory from "@/components/kemefrac/portfolio/TabYieldHistory";
import TabWatchlist from "@/components/kemefrac/portfolio/TabWatchlist";
import TabKYCStatus from "@/components/kemefrac/portfolio/TabKYCStatus";
import NEARWalletSection from "@/components/kemefrac/portfolio/NEARWalletSection";

const TABS = ["My Holdings", "Yield History", "Watchlist", "KYC Status"];

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK_HOLDINGS = [
  {
    id: "tok-1",
    fracPropertyId: "frac-1",
    propertyId: "prop-1",
    offeringTitle: "New Cairo Apartment — Frac Series A",
    tokenSymbol: "KMF-NC-001",
    city: "New Cairo", district: "5th Settlement",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&q=80",
    offeringType: "fractional_investment",
    tokensHeld: 50,
    tokensHeldPercent: 5.0,
    averagePurchasePriceEGP: 1000,
    totalInvestedEGP: 50000,
    nearTokenBalance: 50,
    nearLastSyncedAt: new Date(Date.now() - 3600000).toISOString(),
    nearExplorerUrl: "https://explorer.testnet.near.org/accounts/kmf-nc001.kemefrac.near",
    expectedAnnualYieldPercent: 9.5,
    totalTokenSupply: 1000,
    fracSlug: "new-cairo-apt-frac-2026",
  },
  {
    id: "tok-2",
    fracPropertyId: "frac-2",
    propertyId: "prop-2",
    offeringTitle: "Sheikh Zayed Villa — Ownership Tokens",
    tokenSymbol: "KMF-SZ-002",
    city: "Sheikh Zayed", district: "Beverly Hills",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&q=80",
    offeringType: "fractional_sale",
    tokensHeld: 10,
    tokensHeldPercent: 2.0,
    averagePurchasePriceEGP: 5000,
    totalInvestedEGP: 50000,
    nearTokenBalance: 10,
    nearLastSyncedAt: new Date(Date.now() - 86400000).toISOString(),
    nearExplorerUrl: "https://explorer.testnet.near.org/accounts/kmf-sz002.kemefrac.near",
    expectedAnnualYieldPercent: null,
    totalTokenSupply: 500,
    fracSlug: "sheikh-zayed-villa-frac-2026",
  },
];

const MOCK_YIELD = [
  { id: "y1", fracPropertyId: "frac-1", offeringTitle: "New Cairo Apt", distributionPeriod: "March 2026", totalTokensEligible: 50, yieldPerTokenEGP: 79.2, totalYieldAmountEGP: 3960, distributionDate: "2026-03-01", distributionStatus: "completed" },
  { id: "y2", fracPropertyId: "frac-1", offeringTitle: "New Cairo Apt", distributionPeriod: "February 2026", totalTokensEligible: 50, yieldPerTokenEGP: 79.2, totalYieldAmountEGP: 3960, distributionDate: "2026-02-01", distributionStatus: "completed" },
  { id: "y3", fracPropertyId: "frac-1", offeringTitle: "New Cairo Apt", distributionPeriod: "April 2026 (Scheduled)", totalTokensEligible: 50, yieldPerTokenEGP: 79.2, totalYieldAmountEGP: 3960, distributionDate: "2026-04-01", distributionStatus: "scheduled" },
];

const MOCK_WATCHLIST = [
  {
    id: "w1",
    fracPropertyId: "frac-3",
    notifyOnPriceDrop: true,
    notifyOnAvailability: true,
    offering: {
      id: "frac-3", offeringTitle: "North Coast Chalet — Summer Yield Fund",
      city: "North Coast", district: "Sidi Abd El Rahman",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
      offeringType: "fractional_investment",
      tokenPriceEGP: 800, expectedAnnualYieldPercent: 11.2,
      tokensForSale: 2000, tokensSold: 2000, minTokensPerBuyer: 10,
      status: "sold_out", verificationLevel: 5, isFeatured: true,
    },
  },
];

const MOCK_KYC = { kycStatus: "approved", approvedAt: "2026-01-10T00:00:00Z", expiresAt: "2028-01-10T00:00:00Z" };
const MOCK_WALLET = { userId: "user-1", walletAddress: null, balanceKemecoins: 0, ownedTokenIds: ["tok-1", "tok-2"] };

export default function KemeFracPortfolio() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("My Holdings");
  const [holdings, setHoldings] = useState([]);
  const [yieldHistory, setYieldHistory] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [kyc, setKyc] = useState(null);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const init = async () => {
      const me = await base44.auth.me().catch(() => null);
      if (!me) { window.location.href = "/m/login"; return; }
      setUser(me);

      const [toks, kycs, wl, wallets] = await Promise.all([
        base44.entities.FracToken.filter({ holderUserId: me.id }, "-lastTransactionAt", 50).catch(() => []),
        base44.entities.FracKYC.filter({ userId: me.id }, "-created_date", 1).catch(() => []),
        base44.entities.FracWatchlist.filter({ userId: me.id }, "-created_date", 50).catch(() => []),
        base44.entities.BlockchainWallet.filter({ userId: me.id }, "-created_date", 1).catch(() => []),
      ]);

      setHoldings(toks.length > 0 ? toks : MOCK_HOLDINGS);
      setKyc(kycs[0] || MOCK_KYC);
      setWatchlist(wl.length > 0 ? wl : MOCK_WATCHLIST);
      setWallet(wallets[0] || MOCK_WALLET);

      // Fetch yield for each holding
      if (me) {
        base44.entities.FracTransaction.filter({ toUserId: me.id, transactionType: "yield_paid" }, "-created_date", 100)
          .then(txs => setYieldHistory(txs.length > 0 ? txs : MOCK_YIELD))
          .catch(() => setYieldHistory(MOCK_YIELD));
      }

      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#00C896] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalInvested = holdings.reduce((s, h) => s + (h.totalInvestedEGP || 0), 0);
  const totalTokens = holdings.reduce((s, h) => s + (h.tokensHeld || 0), 0);
  const totalYieldEarned = yieldHistory
    .filter(y => y.distributionStatus === "completed")
    .reduce((s, y) => s + (y.totalYieldAmountEGP || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      <div className="max-w-[1100px] mx-auto px-4 py-8 w-full flex-1 flex flex-col gap-6">

        {/* Page Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-black" style={{ color: "#0A1628" }}>My KemeFrac™ Portfolio</h1>
            <p className="text-gray-400 text-sm mt-1">Your fractional property investments secured on blockchain</p>
          </div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black"
            style={{ background: "#0A1628", color: "#00C896" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C896] animate-pulse" />
            Blockchain Secured
          </span>
        </div>

        {/* KPIs */}
        <PortfolioKPIs
          totalInvested={totalInvested}
          holdingsCount={holdings.length}
          totalTokens={totalTokens}
          totalYieldEarned={totalYieldEarned}
          wallet={wallet}
        />

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-200 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 -mb-px"
              style={{ borderColor: tab === t ? "#00C896" : "transparent", color: tab === t ? "#00C896" : "#6b7280" }}>
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {tab === "My Holdings" && <TabHoldings holdings={holdings} />}
          {tab === "Yield History" && <TabYieldHistory yieldHistory={yieldHistory} />}
          {tab === "Watchlist" && <TabWatchlist watchlist={watchlist} setWatchlist={setWatchlist} />}
          {tab === "KYC Status" && <TabKYCStatus kyc={kyc} />}
        </div>

        {/* Blockchain Wallet Section */}
        <NEARWalletSection wallet={wallet} setWallet={setWallet} user={user} />
      </div>

      <SiteFooter />
    </div>
  );
}