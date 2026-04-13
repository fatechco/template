import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Countdown = ({ deadline, onTime }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(deadline) - new Date();
      if (diff <= 0) {
        setTime("00:00:00");
        onTime && onTime(0);
        return;
      }
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      const formatted = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      setTime(formatted);
      onTime && onTime(diff);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  return <span className="font-mono">{time}</span>;
};

export default function WonAuctionCard({ auction }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const isUrgent = timeLeft && timeLeft < 2 * 60 * 60 * 1000; // < 2 hours

  if (auction.status === "completed") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border-l-4 border-l-green-600 overflow-hidden">
        <div className="bg-green-50 p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🏠</span>
            <div>
              <p className="font-black text-green-700 text-lg">Property Transferred!</p>
              <p className="text-sm text-gray-600">Congratulations on your new property</p>
            </div>
          </div>
          <img
            src={auction.property?.featured_image}
            alt=""
            className="w-20 h-20 rounded-lg object-cover mb-3"
          />
          <h4 className="font-bold text-gray-900 mb-1">{auction.auctionTitle}</h4>
          <p className="text-sm text-gray-600 mb-4">
            📍 {auction.property?.city_name}, {auction.property?.district_id}
          </p>
          <Link
            to={`/dashboard/my-properties`}
            className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-lg"
          >
            View My Property →
          </Link>
        </div>
      </div>
    );
  }

  if (auction.status === "payment_received") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border-l-4 border-l-blue-600 overflow-hidden">
        <div className="bg-blue-50 p-5">
          <p className="font-black text-blue-700 text-lg mb-1">✅ Payment Confirmed!</p>
          <p className="text-sm text-gray-600 mb-4">Legal transfer in progress</p>
          <img
            src={auction.property?.featured_image}
            alt=""
            className="w-20 h-20 rounded-lg object-cover mb-3"
          />
          <h4 className="font-bold text-gray-900 mb-1">{auction.auctionTitle}</h4>
          <p className="text-sm text-gray-600 mb-4">Expected completion: 5–10 business days</p>
          <button className="px-4 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-sm rounded-lg">
            View Transfer Status →
          </button>
        </div>
      </div>
    );
  }

  // awaiting_payment
  return (
    <div className={`bg-white rounded-2xl shadow-sm border-l-4 overflow-hidden ${isUrgent ? "border-l-red-600" : "border-l-yellow-600"}`}>
      <div className={isUrgent ? "bg-red-50" : "bg-yellow-50"}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className={`font-black text-lg ${isUrgent ? "text-red-700" : "text-yellow-700"}`}>
                {isUrgent ? "⚠️ URGENT" : "⚠️"} Payment Required
              </p>
              <p className="text-sm text-gray-600">
                Deadline: {new Date(auction.winnerPaymentDeadlineAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`text-2xl font-mono font-black tabular-nums ${isUrgent ? "text-red-600" : "text-yellow-600"}`}>
              <Countdown deadline={auction.winnerPaymentDeadlineAt} onTime={setTimeLeft} />
            </span>
          </div>

          {/* Property preview */}
          <img
            src={auction.property?.featured_image}
            alt=""
            className="w-20 h-20 rounded-lg object-cover mb-3"
          />
          <h4 className="font-bold text-gray-900 mb-1">{auction.auctionTitle}</h4>
          <p className="text-sm text-gray-600 mb-4">Winning bid: {Number(auction.winnerBidEGP).toLocaleString()} EGP</p>

          {/* Amount due */}
          <div className="bg-white/60 rounded-lg p-4 mb-4 border-2 border-dashed border-gray-300">
            <p className="text-xs text-gray-600 font-bold mb-1">AMOUNT DUE</p>
            <p className="text-3xl font-black text-gray-900">
              {Number(auction.winnerBidEGP - auction.buyerDepositEGP).toLocaleString()} EGP
            </p>
            <p className="text-xs text-gray-500 mt-1">({Number(auction.buyerDepositEGP).toLocaleString()} EGP deposit already held)</p>
          </div>

          {/* CTA */}
          <Link
            to={`/auctions/${auction.auctionCode}/payment`}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition-colors flex items-center justify-center gap-2 mb-3"
          >
            💳 Complete Payment <ChevronRight size={18} />
          </Link>

          {/* Info */}
          <p className="text-xs text-gray-600">
            Once you complete payment, a Kemework lawyer will be assigned to handle your title transfer (2–5 business days).
          </p>
        </div>
      </div>
    </div>
  );
}