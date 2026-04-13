import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import AuctionCountdownPanel from "./AuctionCountdownPanel";
import AuctionBidConfirmModal from "./AuctionBidConfirmModal";

export default function AuctionBidPanel({ auction, bids, user }) {
  const [bidAmount, setBidAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [autoBidMax, setAutoBidMax] = useState("");
  const [autoBidIncrement, setAutoBidIncrement] = useState("");
  const [showAutoBid, setShowAutoBid] = useState(false);
  const [autoBidSet, setAutoBidSet] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [watchToggled, setWatchToggled] = useState(false);
  const [notifyNewBid, setNotifyNewBid] = useState(false);
  const [notifyEnding, setNotifyEnding] = useState(true);
  const [priceThreshold, setPriceThreshold] = useState("");
  const [registered, setRegistered] = useState(false);

  const currentBid = auction.currentHighestBidEGP || auction.startingPriceEGP || 0;
  const minimumBid = currentBid + (auction.minimumBidIncrementEGP || 5000);

  useEffect(() => {
    // Check if user is registered
    if (user) {
      base44.entities.AuctionRegistration
        .filter({ auctionId: auction.id, bidderUserId: user.id })
        .then(regs => setRegistered(regs?.some(r => r.registrationStatus === "active")))
        .catch(() => {});
    }
  }, [user, auction.id]);

  const handleQuickAdd = (increment) => {
    setBidAmount(String(minimumBid + increment));
  };

  const handlePlaceBid = async () => {
    setPlacing(true);
    setShowConfirm(false);
    try {
      await base44.functions.invoke("placeBid", {
        auctionId: auction.id,
        bidAmountEGP: parseFloat(bidAmount),
        bidType: "manual",
      });
      setBidAmount("");
    } catch (err) {
      alert("Error placing bid: " + err.message);
    } finally {
      setPlacing(false);
    }
  };

  const handleSetAutoBid = async () => {
    try {
      await base44.functions.invoke("setAutoBid", {
        auctionId: auction.id,
        autoBidMaxEGP: parseFloat(autoBidMax),
        autoBidIncrement: parseFloat(autoBidIncrement) || auction.minimumBidIncrementEGP,
      });
      setAutoBidSet(true);
      setShowAutoBid(false);
    } catch (err) {
      alert("Error setting auto-bid: " + err.message);
    }
  };

  const handleRegister = () => {
    base44.auth.redirectToLogin(window.location.pathname);
  };

  // REGISTRATION phase
  if (auction.status === "registration") {
    return (
      <div className="sticky top-20 space-y-4">
        <div className="bg-white rounded-[20px] shadow-lg border-t-6 border-red-600 overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-black text-gray-900 mb-2">📋 Register to Bid</h3>
            <p className="text-gray-600 text-sm mb-4">
              Registration closes: {auction.registrationCloseAt
                ? new Date(auction.registrationCloseAt).toLocaleDateString()
                : "TBD"}
            </p>

            {/* Deposit Box */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center mb-4">
              <p className="text-sm font-bold text-gray-600 mb-1">Required deposit:</p>
              <p className="text-3xl font-black text-red-600">
                {Number(auction.buyerDepositEGP).toLocaleString()} EGP
              </p>
              <p className="text-xs text-gray-500 mt-1">100% refunded if you don't win</p>
            </div>

            {/* Requirements */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-600">✅</span>
                <span className="font-medium">KYC Identity Verified</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-600">✅</span>
                <span className="font-medium">XeedWallet balance</span>
              </div>
              {auction.requireBuyerProofOfFunds && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">☐</span>
                  <span className="font-medium text-gray-500">Upload Proof of Funds</span>
                </div>
              )}
            </div>

            <button
              onClick={user ? handleRegister : () => base44.auth.redirectToLogin()}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl text-base transition-colors"
            >
              📋 Register to Bid — Pay {Number(auction.buyerDepositEGP).toLocaleString()} EGP
            </button>

            <p className="text-center text-xs text-gray-500 mt-3">
              {auction.totalRegisteredBidders || 0} bidders registered so far
            </p>
          </div>
        </div>

        <AuctionCountdownPanel auction={auction} />
        <WatchlistCard auction={auction} watchToggled={watchToggled} setWatchToggled={setWatchToggled} />
      </div>
    );
  }

  // LIVE/EXTENDED phase + registered user
  if ((auction.status === "live" || auction.status === "extended") && registered) {
    return (
      <div className="sticky top-20 space-y-4">
        <div className="bg-white rounded-[20px] shadow-lg overflow-hidden border-t-6 border-red-600">
          {/* Current Bid Header */}
          <div className="text-center p-6 border-b border-gray-100">
            <p className="text-gray-500 text-sm font-bold mb-1">Current Highest Bid</p>
            <p className="text-4xl font-black text-red-600">
              {auction.currentHighestBidEGP
                ? `${Number(auction.currentHighestBidEGP).toLocaleString()} EGP`
                : `Starting at ${Number(auction.startingPriceEGP).toLocaleString()} EGP`}
            </p>
            <p className="text-sm text-gray-600 mt-2">👥 {auction.totalUniqueBidders || 0} bidders</p>
            {auction.extensionsUsed > 0 && (
              <p className="text-sm text-purple-600 font-bold mt-1">⚡ Extended {auction.extensionsUsed} times</p>
            )}
          </div>

          <div className="p-6 space-y-5">
            {/* AutoBid Section */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl">
              <button
                onClick={() => setShowAutoBid(!showAutoBid)}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="text-left">
                  <p className="font-bold text-blue-900">🤖 Set Auto-Bid <span className="font-normal text-xs text-blue-600">(recommended)</span></p>
                  <p className="text-xs text-blue-700 mt-0.5">System bids on your behalf up to your max</p>
                </div>
                <span className="text-blue-700">{showAutoBid ? "▲" : "▼"}</span>
              </button>

              {showAutoBid && !autoBidSet && (
                <div className="px-4 pb-4 space-y-3">
                  <input
                    type="number"
                    placeholder="Max amount (EGP)"
                    value={autoBidMax}
                    onChange={(e) => setAutoBidMax(e.target.value)}
                    className="w-full px-4 py-2.5 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder={`Increment (min ${Number(auction.minimumBidIncrementEGP).toLocaleString()} EGP)`}
                    value={autoBidIncrement}
                    onChange={(e) => setAutoBidIncrement(e.target.value)}
                    className="w-full px-4 py-2.5 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSetAutoBid}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
                  >
                    Set Auto-Bid
                  </button>
                </div>
              )}

              {autoBidSet && (
                <div className="px-4 pb-4 flex items-center justify-between">
                  <p className="text-sm font-bold text-blue-900">
                    ✅ Auto-bid active up to {Number(autoBidMax).toLocaleString()} EGP
                  </p>
                  <button
                    onClick={() => setAutoBidSet(false)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Manual Bid Input */}
            <div>
              <label className="block font-bold text-sm text-gray-900 mb-2">Your bid:</label>
              <div className="flex">
                <span className="bg-gray-100 border border-gray-200 border-r-0 px-4 flex items-center text-sm font-bold rounded-l-xl text-gray-700">
                  EGP
                </span>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="flex-1 border border-gray-200 px-4 py-4 text-2xl font-black text-center rounded-r-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Quick Bid Pills */}
            <div className="flex gap-2 flex-wrap">
              {[5000, 10000, 25000, 50000].map(increment => (
                <button
                  key={increment}
                  onClick={() => handleQuickAdd(increment)}
                  className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 font-bold text-xs text-gray-900 rounded-lg transition-colors"
                >
                  +{(increment / 1000).toFixed(0)}K
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500 text-center">
              Min bid: <strong>{Number(minimumBid).toLocaleString()} EGP</strong>
            </p>

            {/* Place Bid Button */}
            <button
              onClick={() => setShowConfirm(true)}
              disabled={!bidAmount || parseFloat(bidAmount) < minimumBid || placing}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl text-lg transition-colors"
            >
              {placing ? "Placing..." : "🔨 Place Bid"}
            </button>

            {/* Buy Now */}
            {auction.buyNowPriceEGP && (
              <div>
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm font-bold text-gray-500">OR</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <button className="w-full border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 font-black py-3.5 rounded-xl text-sm transition-colors">
                  ⚡ Buy Now — {Number(auction.buyNowPriceEGP).toLocaleString()} EGP
                  <p className="font-normal text-xs mt-0.5">End auction instantly</p>
                </button>
              </div>
            )}
          </div>
        </div>

        <AuctionCountdownPanel auction={auction} />

        {/* Bid Confirm Modal */}
        {showConfirm && (
          <AuctionBidConfirmModal
            auction={auction}
            bidAmount={parseFloat(bidAmount)}
            onConfirm={handlePlaceBid}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </div>
    );
  }

  // LIVE/EXTENDED phase + NOT registered
  if ((auction.status === "live" || auction.status === "extended") && !registered) {
    return (
      <div className="sticky top-20 space-y-4">
        <div className="bg-white rounded-[20px] shadow-lg overflow-hidden border-t-6 border-red-600 p-6">
          <div className="text-center">
            <div className="text-center p-4 mb-4">
              <p className="text-gray-500 text-sm font-bold mb-1">Current Highest Bid</p>
              <p className="text-3xl font-black text-red-600">
                {Number(auction.currentHighestBidEGP || auction.startingPriceEGP).toLocaleString()} EGP
              </p>
            </div>
            <p className="text-gray-700 font-bold mb-1">Register to start bidding</p>
            <p className="text-sm text-gray-500 mb-4">
              {auction.totalUniqueBidders || 0} bidders competing now
            </p>
            <button
              onClick={user ? handleRegister : () => base44.auth.redirectToLogin()}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl text-base transition-colors"
            >
              📋 Register — {Number(auction.buyerDepositEGP).toLocaleString()} EGP deposit
            </button>
          </div>
        </div>

        <AuctionCountdownPanel auction={auction} />
        <WatchlistCard auction={auction} watchToggled={watchToggled} setWatchToggled={setWatchToggled} />
      </div>
    );
  }

  // ENDED / OTHER
  return (
    <div className="sticky top-20 space-y-4">
      <div className="bg-white rounded-[20px] shadow-lg overflow-hidden border border-gray-200 p-6">
        <div className="text-center py-8">
          <p className="text-5xl mb-4">✅</p>
          <p className="text-xl font-black text-gray-900">Auction Ended</p>
          {auction.winnerBidEGP && (
            <p className="text-gray-600 mt-2">
              Final bid: <strong className="text-red-600">{Number(auction.winnerBidEGP).toLocaleString()} EGP</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function WatchlistCard({ auction, watchToggled, setWatchToggled }) {
  if (watchToggled) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h4 className="font-bold text-gray-900 mb-3">👁️ Watching this auction</h4>
        <p className="text-xs text-gray-500 mb-3">{Math.floor(Math.random() * 200) + 50} others watching</p>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="rounded text-red-600" />
            <span className="text-sm text-gray-700">New bid alerts</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-red-600" />
            <span className="text-sm text-gray-700">Ending soon alerts</span>
          </label>
          <input
            type="number"
            placeholder="Price threshold (EGP)"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs mt-2 focus:outline-none"
          />
        </div>
        <button className="w-full mt-3 py-2.5 border-2 border-red-600 text-red-600 font-bold text-sm rounded-xl hover:bg-red-50 transition-colors">
          📋 Register to Bid →
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setWatchToggled(true)}
      className="w-full py-3 border-2 border-gray-300 text-gray-600 hover:border-gray-400 font-bold text-sm rounded-xl transition-colors"
    >
      👁️ Watch this Auction
    </button>
  );
}