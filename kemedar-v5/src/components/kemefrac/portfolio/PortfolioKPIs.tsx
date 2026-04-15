// @ts-nocheck
const fmt = (n) => n != null ? new Intl.NumberFormat("en-EG").format(Math.round(n)) : "—";

export default function PortfolioKPIs({ totalInvested, holdingsCount, totalTokens, totalYieldEarned, wallet }) {
  const cards = [
    {
      icon: "💼",
      label: "Total Invested",
      value: `${fmt(totalInvested)} EGP`,
      sub: `across ${holdingsCount} propert${holdingsCount === 1 ? "y" : "ies"}`,
      valueColor: "#00C896",
    },
    {
      icon: "🔷",
      label: "Tokens Held",
      value: `${fmt(totalTokens)} tokens`,
      sub: `${holdingsCount} different propert${holdingsCount === 1 ? "y" : "ies"}`,
      valueColor: "white",
    },
    {
      icon: "💰",
      label: "Total Yield Earned",
      value: `${fmt(totalYieldEarned)} EGP`,
      sub: "all time",
      valueColor: "#F59E0B",
    },
    {
      icon: "🔗",
      label: "Blockchain Wallet",
      value: wallet?.walletAddress ? `${wallet.walletAddress.slice(0, 12)}...` : "Custodial 🔐",
      sub: wallet?.walletAddress ? null : "claim-link",
      valueColor: "white",
    },
  ];

  return (
    <div className="rounded-2xl p-6" style={{ background: "#0A1628" }}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{c.icon}</span>
              <p className="text-xs text-gray-400 font-bold">{c.label}</p>
            </div>
            <p className="text-xl font-black" style={{ color: c.valueColor }}>{c.value}</p>
            {c.sub === "claim-link" ? (
              <a href="/kemefrac/portfolio#near" className="text-xs mt-0.5 hover:underline" style={{ color: "#00C896" }}>
                Claim to your wallet →
              </a>
            ) : (
              <p className="text-xs text-gray-500 mt-0.5">{c.sub}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}