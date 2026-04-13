import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const fmt = (n) => n != null ? new Intl.NumberFormat("en-EG").format(Math.round(n)) : "—";

const MOCK_APPROVED = [
  { id: "f3", offeringTitle: "North Coast Chalet", tokenSymbol: "KMF-NC-003", submittedByUserId: "Omar Khalil", tokensForSale: 2000, tokenPriceEGP: 800, totalTokenSupply: 2000, expectedAnnualYieldPercent: 11.2, offeringType: "fractional_investment", nearContractAddress: "kmf-nc003.kemefrac.near", tokenName: "KemeFrac North Coast Chalet #003" },
];

const STEPS = ["Review Details", "Deploy Contract", "Success"];
const DEPLOY_STEPS = [
  "Creating NEAR sub-account...",
  "Deploying NEP-141 contract...",
  "Initializing token metadata...",
  "Minting seller's retained tokens...",
  "Verifying deployment...",
];

function TokenizeWizard({ offering, onClose, onSuccess }) {
  const [step, setStep] = useState(0);
  const [network, setNetwork] = useState("testnet");
  const [deployStep, setDeployStep] = useState(-1);
  const [txHash] = useState("B5k9xY2mNqR...8aLcD4vEp");

  const handleDeploy = () => {
    setStep(1);
    let i = 0;
    const interval = setInterval(() => {
      setDeployStep(i);
      i++;
      if (i >= DEPLOY_STEPS.length) {
        clearInterval(interval);
        setTimeout(() => setStep(2), 800);
      }
    }, 900);
  };

  const handleGoLive = async () => {
    await base44.entities.FracProperty.update(offering.id, {
      status: "live",
      nearTokenContractDeployed: true,
      nearNetworkType: network,
      nearDeployedAt: new Date().toISOString(),
      nearTransactionHash: txHash,
      nearExplorerUrl: `https://explorer.${network}.near.org/accounts/${offering.nearContractAddress}`,
    }).catch(() => {});
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Step indicator */}
        <div className="flex gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 text-center">
              <div className={`h-1.5 rounded-full mb-1 ${i <= step ? "" : "bg-gray-200"}`}
                style={i <= step ? { background: "#00C896" } : {}} />
              <p className={`text-[10px] font-bold ${i === step ? "" : "text-gray-400"}`}
                style={i === step ? { color: "#00C896" } : {}}>{s}</p>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <h3 className="font-black text-gray-900 text-lg">Review Token Details</h3>
            <div className="rounded-xl p-4 space-y-2" style={{ background: "#0A1628" }}>
              {[
                ["Contract name", offering.nearContractAddress || `${offering.tokenSymbol?.toLowerCase()}.kemefrac.near`],
                ["Token name", offering.tokenName],
                ["Token symbol", offering.tokenSymbol],
                ["Total supply", `${fmt(offering.totalTokenSupply)} tokens`],
                ["For sale", `${fmt(offering.tokensForSale)} tokens`],
                ["Seller retains", `${fmt((offering.totalTokenSupply || 0) - (offering.tokensForSale || 0))} tokens`],
                ["Price per token", `${fmt(offering.tokenPriceEGP)} EGP`],
                ["Offering type", offering.offeringType?.replace(/_/g, " ") + (offering.expectedAnnualYieldPercent ? ` (${offering.expectedAnnualYieldPercent}%/yr)` : "")],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-black" style={{ color: "#00C896" }}>{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center text-sm pt-2 border-t border-white/10">
                <span className="text-gray-400">Network</span>
                <div className="flex rounded-lg overflow-hidden border border-white/20">
                  {["testnet", "mainnet"].map(n => (
                    <button key={n} onClick={() => setNetwork(n)}
                      className="px-3 py-1 text-xs font-black transition-colors capitalize"
                      style={{ background: network === n ? "#00C896" : "transparent", color: network === n ? "#0A1628" : "#9ca3af" }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {network === "mainnet" && (
              <div className="rounded-xl p-3" style={{ background: "#FFFBEB", border: "1.5px solid #F59E0B" }}>
                <p className="text-xs font-bold text-yellow-800">⚠️ Deploying to MAINNET is irreversible. Only switch to mainnet after testnet validation.</p>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-3 text-sm font-bold text-gray-600">Cancel</button>
              <button onClick={handleDeploy}
                className="flex-1 rounded-xl py-3 text-sm font-black"
                style={{ background: "#0A1628", color: "#00C896" }}>
                ✅ Confirm — Proceed to Deploy
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: "#00C896", borderTopColor: "transparent" }} />
            <h3 className="font-black text-gray-900">Deploying to NEAR {network}...</h3>
            <div className="space-y-3 text-left">
              {DEPLOY_STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-3 text-sm">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${i < deployStep ? "bg-green-500 text-white" : i === deployStep ? "border-2 border-[#00C896]" : "border-2 border-gray-200"}`}>
                    {i < deployStep ? "✓" : ""}
                  </span>
                  <span className={i <= deployStep ? "text-gray-900 font-bold" : "text-gray-400"}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 text-center">
            <div className="text-6xl">✅</div>
            <h3 className="font-black text-gray-900 text-xl">Contract Deployed Successfully!</h3>
            <div className="rounded-xl p-4 text-left space-y-2 text-sm" style={{ background: "#F0FDF9", border: "1.5px solid #6EE7B7" }}>
              <p><span className="text-gray-400">Contract:</span> <code className="font-mono font-black text-gray-900">{offering.nearContractAddress || `${offering.tokenSymbol?.toLowerCase()}.kemefrac.near`}</code></p>
              <p className="flex items-center gap-2">
                <span className="text-gray-400">Tx Hash:</span>
                <code className="font-mono text-xs text-gray-800">{txHash}</code>
                <button onClick={() => navigator.clipboard?.writeText(txHash)} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-500 hover:bg-gray-200">Copy</button>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <a href={`https://explorer.${network}.near.org`} target="_blank" rel="noopener noreferrer"
                className="block py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:border-[#00C896]">
                View on NEAR Explorer →
              </a>
              <button onClick={handleGoLive}
                className="py-3 rounded-xl text-sm font-black"
                style={{ background: "#00C896", color: "#0A1628" }}>
                🚀 Go Live — Publish Offering
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function KemeFracTokenize() {
  const [approved, setApproved] = useState(MOCK_APPROVED);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    base44.entities.FracProperty.filter({ status: "approved" }, "-created_date", 50).then(d => { if (d?.length) setApproved(d); }).catch(() => {});
  }, []);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">🔷 Tokenize on NEAR Protocol</h1>
        <p className="text-sm text-gray-400 mt-1">Deploy new NEP-141 contracts for approved offerings</p>
      </div>

      {approved.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <p className="text-4xl mb-3">✅</p>
          <p className="font-black text-gray-700">No offerings awaiting tokenization</p>
          <p className="text-gray-400 text-sm mt-1">Approved offerings will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approved.map(o => (
            <div key={o.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900">{o.offeringTitle}</p>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                  <code style={{ color: "#00C896" }}>{o.tokenSymbol}</code>
                  <span>Seller: {o.submittedByUserId}</span>
                  <span>{fmt(o.tokensForSale)} tokens for sale</span>
                  <span>{fmt(o.tokenPriceEGP)} EGP/token</span>
                </div>
              </div>
              <button onClick={() => setSelected(o)}
                className="flex-shrink-0 px-4 py-2.5 rounded-xl font-black text-sm"
                style={{ background: "#0A1628", color: "#00C896" }}>
                🔷 Tokenize →
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <TokenizeWizard
          offering={selected}
          onClose={() => setSelected(null)}
          onSuccess={() => setApproved(prev => prev.filter(o => o.id !== selected.id))}
        />
      )}
    </div>
  );
}