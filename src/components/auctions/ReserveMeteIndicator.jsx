import { Lock, CheckCircle } from "lucide-react";

export default function ReserveMeteIndicator({ auction, isSeller }) {
  // Only show reserve indicator to the seller and only if reserve exists
  if (!isSeller || !auction.reservePriceEGP) return null;

  const current = auction.currentHighestBidEGP || 0;
  const reserve = auction.reservePriceEGP;
  const met = current >= reserve;
  const progress = Math.min(100, Math.round((current / reserve) * 100));
  const gap = reserve - current;

  return (
    <div className={`rounded-2xl border-2 p-6 ${met ? "border-green-400 bg-green-50" : "border-yellow-300 bg-yellow-50"}`}>
      <div className="flex items-center gap-3 mb-4">
        {met ? (
          <>
            <CheckCircle size={22} className="text-green-600" />
            <h3 className="font-black text-green-800 text-lg">✅ Reserve Price Met — Auction will complete!</h3>
          </>
        ) : (
          <>
            <Lock size={22} className="text-yellow-700" />
            <h3 className="font-black text-yellow-800 text-lg">🔒 Reserve Not Yet Met</h3>
          </>
        )}
        <span className="ml-auto text-xs bg-gray-200 text-gray-600 font-bold px-2 py-0.5 rounded">Seller only</span>
      </div>

      {!met && (
        <>
          <div className="mb-3">
            <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
              <span>{Number(current).toLocaleString()} EGP current</span>
              <span>{Number(reserve).toLocaleString()} EGP reserve</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <p className="text-sm font-bold text-yellow-800">
            Needs {Number(gap).toLocaleString()} EGP more to hit reserve ({progress}% reached)
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            This information is only visible to you — bidders never see the reserve price.
          </p>
        </>
      )}

      {met && (
        <p className="text-sm text-green-700">
          Current bid of {Number(current).toLocaleString()} EGP exceeds your reserve price of {Number(reserve).toLocaleString()} EGP.
        </p>
      )}
    </div>
  );
}