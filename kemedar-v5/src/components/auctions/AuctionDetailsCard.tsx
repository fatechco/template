// @ts-nocheck
export default function AuctionDetailsCard({ auction }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border-l-6 border-l-red-600 border border-gray-200 p-6">
      <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-red-600 rounded-full"></span>
        Auction Details
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 font-semibold">Auction Code:</span>
          <code className="text-gray-900 font-mono font-bold text-sm">{auction.auctionCode}</code>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 font-semibold">Auction Type:</span>
          <span className="text-gray-900 font-bold bg-gray-100 px-3 py-1 rounded-full text-sm">
            {auction.auctionType === "open" && "Open Bidding"}
            {auction.auctionType === "sealed" && "Sealed Bids"}
            {auction.auctionType === "reserve" && "Reserve Price"}
            {auction.auctionType === "absolute" && "Absolute"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 font-semibold">Starting Price:</span>
          <span className="text-gray-900 font-bold">
            {Number(auction.startingPriceEGP).toLocaleString()} EGP
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 font-semibold">Min Bid Increment:</span>
          <span className="text-gray-900 font-bold">
            {Number(auction.minimumBidIncrementEGP).toLocaleString()} EGP
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 font-semibold">Registration Deposit:</span>
          <span className="text-gray-900 font-bold">
            {Number(auction.buyerDepositEGP).toLocaleString()} EGP
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 font-semibold">Platform Commission:</span>
          <span className="text-gray-900 font-bold">
            {auction.platformCommissionPercent || "2"}% on final bid
          </span>
        </div>

        {/* Reserve Status Section */}
        <div className="pt-3 border-t border-gray-100">
          <h4 className="font-bold text-gray-900 mb-2">Reserve Status:</h4>
          {auction.reservePriceEGP ? (
            <>
              <p className="text-gray-600 text-sm mb-2">
                🔒 Reserve: <span className="font-bold">Hidden</span> (never shown to bidders)
              </p>
              {auction.reserveMet ? (
                <p className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-bold">
                  ✅ Reserve Price Met!
                </p>
              ) : (
                <p className="bg-orange-50 border border-orange-200 text-orange-700 px-3 py-2 rounded-lg text-sm font-bold">
                  ⚠️ Reserve Not Yet Met
                </p>
              )}
            </>
          ) : (
            <p className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-bold">
              ⚡ No Reserve — Sells to Highest Bid
            </p>
          )}
        </div>

        {auction.buyNowPriceEGP && (
          <div className="pt-3 border-t border-gray-100">
            <span className="text-gray-600 font-semibold block mb-1">Buy Now Price:</span>
            <span className="text-gold-600 font-black text-lg">
              ⚡ {Number(auction.buyNowPriceEGP).toLocaleString()} EGP
            </span>
          </div>
        )}
      </div>
    </div>
  );
}