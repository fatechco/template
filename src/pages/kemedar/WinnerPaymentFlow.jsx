import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

const Countdown = ({ deadline }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(deadline) - new Date();
      if (diff <= 0) {
        setTime("00:00:00");
        return;
      }
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTime(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  return <span className="font-mono">{time}</span>;
};

export default function WinnerPaymentFlow() {
  const { auctionCode } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("xeedwallet");
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: auction } = useQuery({
    queryKey: ["auction", auctionCode],
    queryFn: () =>
      base44.entities.PropertyAuction.filter({ auctionCode }).then((r) => r[0]),
    enabled: !!auctionCode,
  });

  if (!auction || user?.id !== auction.winnerUserId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Auction not found or you are not the winner.</p>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl text-center">
          <div className="text-7xl mb-6 animate-bounce">🏆</div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Payment Confirmed! 🎉</h1>
          <p className="text-xl text-gray-600 mb-8">
            You now own <strong>{auction.auctionTitle}</strong> — officially.
          </p>

          {/* Timeline */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-8 text-left space-y-4">
            <h3 className="font-black text-gray-900 text-lg mb-6">Next Steps</h3>

            {[
              { step: 1, label: "Payment secured in XeedWallet Escrow", status: "done", time: null },
              { step: 2, label: "Kemework lawyer drafts transfer contract", status: "pending", time: "2–5 business days" },
              { step: 3, label: "Both parties sign documents", status: "pending", time: null },
              { step: 4, label: "Title deed transferred to your name", status: "pending", time: null },
              { step: 5, label: "Escrow released to seller", status: "pending", time: null },
              { step: 6, label: "Keys and property handover", status: "pending", time: null },
            ].map((item) => (
              <div key={item.step} className="flex gap-3 items-start">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                    item.status === "done"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {item.status === "done" ? "✅" : item.step}
                </div>
                <div className="flex-1">
                  <p className={`font-bold ${item.status === "done" ? "text-gray-900" : "text-gray-600"}`}>
                    {item.label}
                  </p>
                  {item.time && <p className="text-sm text-gray-500 mt-1">Expected: {item.time}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/dashboard/auctions")}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-black rounded-xl transition-colors"
            >
              💬 Message Seller
            </button>
            <button
              onClick={() => navigate("/dashboard/auctions")}
              className="px-6 py-3 border-2 border-gray-300 text-gray-900 hover:bg-gray-50 font-black rounded-xl transition-colors"
            >
              View My Auctions →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const amountDue = auction.winnerBidEGP - auction.buyerDepositEGP;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Urgent Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 sticky top-0 z-20">
        <div className="max-w-[1000px] mx-auto">
          <h1 className="text-3xl font-black mb-2">⚠️ Complete Your Winning Payment</h1>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">Deadline: {new Date(auction.winnerPaymentDeadlineAt).toLocaleDateString()}</p>
            <div className="text-2xl font-mono font-black tabular-nums">
              <Countdown deadline={auction.winnerPaymentDeadlineAt} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1000px] mx-auto px-6 py-8 space-y-6">
        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm border-4 border-yellow-400 overflow-hidden">
          <div className="bg-yellow-50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🏆</span>
              <div>
                <h2 className="font-black text-2xl text-gray-900">You Won Auction {auction.auctionCode}</h2>
                <p className="text-gray-600">{auction.auctionTitle}</p>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-3 text-right mb-6">
              <div className="flex justify-between text-gray-700">
                <span className="font-bold">Winning bid:</span>
                <span>{Number(auction.winnerBidEGP).toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Already deposited:</span>
                <span className="text-red-600">−{Number(auction.buyerDepositEGP).toLocaleString()} EGP</span>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="flex justify-between items-end">
                <span className="font-bold text-gray-900">BALANCE DUE:</span>
                <span className="text-3xl font-black text-red-600">{Number(amountDue).toLocaleString()} EGP</span>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Your {Number(auction.buyerDepositEGP).toLocaleString()} EGP security deposit is already held in XeedWallet Escrow
                and will be counted toward your total.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h3 className="font-black text-lg text-gray-900">Payment Method</h3>

          {[
            { id: "xeedwallet", label: "XeedWallet", desc: "Balance: 5,000,000 EGP" },
            { id: "bank", label: "Bank Transfer", desc: "Instructions provided" },
            { id: "card", label: "Credit/Debit Card", desc: "Visa, Mastercard" },
            { id: "installment", label: "Installment/Mortgage", desc: "Requires documentation" },
          ].map((method) => (
            <label
              key={method.id}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === method.id
                  ? "border-red-600 bg-red-50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5"
              />
              <div>
                <p className="font-bold text-gray-900">{method.label}</p>
                <p className="text-sm text-gray-600">{method.desc}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Escrow Notice */}
        <div className="bg-teal-50 border-l-4 border-l-teal-600 rounded-xl p-6">
          <h4 className="font-black text-teal-900 mb-2">🔒 Secure Escrow Protection</h4>
          <p className="text-teal-800 text-sm leading-relaxed">
            All funds held securely in XeedWallet Escrow. Released to seller ONLY after title deed is transferred to your name. 100% protected.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={async () => {
            setProcessing(true);
            try {
              await base44.functions.invoke("processWinnerPayment", {
                auctionId: auction.id,
                paymentMethod,
                amountEGP: amountDue,
              });
              setShowSuccess(true);
            } catch (err) {
              alert("Payment failed: " + err.message);
            } finally {
              setProcessing(false);
            }
          }}
          disabled={processing}
          className="w-full px-8 py-4 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-black text-lg rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          ✅ Complete Payment {!processing && <ChevronRight size={20} />}
          {processing && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
        </button>
      </div>
    </div>
  );
}