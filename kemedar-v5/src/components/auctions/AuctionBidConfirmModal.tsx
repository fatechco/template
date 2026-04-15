// @ts-nocheck
export default function AuctionBidConfirmModal({ auction, bidAmount, onConfirm, onCancel }) {
  const currentBid = auction.currentHighestBidEGP || auction.startingPriceEGP || 0;
  const outbidBy = bidAmount - currentBid;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-md p-8 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-5xl block mb-4">🔨</span>
          <h2 className="text-2xl font-black text-gray-900">Confirm Your Bid</h2>
        </div>

        {/* Bid Summary */}
        <div className="space-y-4 bg-gray-50 rounded-xl p-5 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-medium">Property:</span>
            <span className="text-gray-900 font-bold text-right max-w-44 truncate">
              {auction.auctionTitle || "Property Auction"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-medium">Auction:</span>
            <code className="text-gray-900 font-mono font-bold">{auction.auctionCode}</code>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-4">
            <span className="text-gray-900 font-bold text-lg">Your Bid:</span>
            <span className="text-2xl font-black text-red-600">
              {Number(bidAmount).toLocaleString()} EGP
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-medium">Current Bid:</span>
            <span className="text-gray-900 font-bold">{Number(currentBid).toLocaleString()} EGP</span>
          </div>
          {outbidBy > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-medium">You outbid by:</span>
              <span className="text-green-600 font-bold">+{Number(outbidBy).toLocaleString()} EGP</span>
            </div>
          )}
        </div>

        {/* Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-900 font-bold text-sm text-center leading-relaxed">
            ⚠️ Bids are BINDING and cannot be cancelled.
            If you win, you must complete payment within 48 hours or forfeit your deposit.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl text-base transition-colors"
          >
            🔨 Confirm — Place Bid
          </button>
          <button
            onClick={onCancel}
            className="text-center text-gray-600 hover:text-gray-900 font-semibold py-2 text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}