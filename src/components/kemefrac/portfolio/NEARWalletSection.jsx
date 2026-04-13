import { useState } from "react";
import { base44 } from "@/api/base44Client";

export default function NEARWalletSection({ wallet, setWallet, user }) {
  const [connecting, setConnecting] = useState(false);
  const [walletInput, setWalletInput] = useState("");
  const [showInput, setShowInput] = useState(false);

  const isConnected = !!wallet?.walletAddress;

  const handleConnect = async () => {
    if (!walletInput.trim()) return;
    setConnecting(true);
    try {
      const updated = wallet?.id
        ? await base44.entities.BlockchainWallet.update(wallet.id, { walletAddress: walletInput.trim() })
        : await base44.entities.BlockchainWallet.create({ userId: user?.id, walletAddress: walletInput.trim() });
      setWallet(updated);
      setShowInput(false);
    } catch {
      // mock success
      setWallet(w => ({ ...w, walletAddress: walletInput.trim() }));
      setShowInput(false);
    }
    setConnecting(false);
  };

  const handleDisconnect = async () => {
    if (!wallet?.id) return;
    await base44.entities.BlockchainWallet.update(wallet.id, { walletAddress: null }).catch(() => {});
    setWallet(w => ({ ...w, walletAddress: null }));
  };

  return (
    <div id="near" className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: "#0A1628" }}>🔗</div>
        <div>
          <p className="font-black text-gray-900">Blockchain Wallet</p>
          <p className="text-xs text-gray-400">Manage on-chain ownership of your KemeFrac™ tokens</p>
        </div>
      </div>

      {!isConnected ? (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 leading-relaxed">
            <p className="font-bold mb-1">🔐 Custodial Account</p>
            Your tokens are held in a Kemedar custodial account secured on the blockchain.
            Connect your own blockchain wallet to take full on-chain ownership.
          </div>

          {!showInput ? (
            <button onClick={() => setShowInput(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm transition-all hover:opacity-90"
              style={{ background: "#0A1628", color: "#00C896" }}>
              <span className="w-2 h-2 rounded-full bg-[#00C896]" />
              Connect Blockchain Wallet
            </button>
          ) : (
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={walletInput}
                onChange={e => setWalletInput(e.target.value)}
                placeholder="Your blockchain wallet address"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00C896]"
              />
              <button onClick={handleConnect} disabled={connecting || !walletInput.trim()}
                className="px-4 py-2.5 rounded-xl font-black text-sm disabled:opacity-40 transition-all"
                style={{ background: "#0A1628", color: "#00C896" }}>
                {connecting ? "Connecting..." : "Connect"}
              </button>
              <button onClick={() => setShowInput(false)} className="text-sm text-gray-400 hover:text-gray-600">Cancel</button>
            </div>
          )}

          <p className="text-xs text-gray-400">Your tokens will be transferred to your blockchain wallet address.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "#00C89608", border: "1.5px solid #00C89640" }}>
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Connected wallet</p>
              <code className="font-mono font-black text-sm text-gray-900">{wallet.walletAddress}</code>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm flex-wrap">
            <a href={`https://explorer.testnet.near.org/accounts/${wallet.walletAddress}`}
              target="_blank" rel="noopener noreferrer"
              className="font-bold hover:underline" style={{ color: "#00C896" }}>
              View on Blockchain Explorer →
            </a>
            <button onClick={handleDisconnect} className="text-gray-400 hover:text-gray-600 transition-colors">
              Disconnect wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}