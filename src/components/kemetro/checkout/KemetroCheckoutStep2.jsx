import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function KemetroCheckoutStep2({ onPaymentSelect, onNext }) {
  const [selectedMethod, setSelectedMethod] = useState("cod");
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [walletUse, setWalletUse] = useState(false);

  const WALLET_BALANCE = 250.5;

  const PAYMENT_METHODS = [
    {
      id: "card",
      label: "💳 Credit/Debit Card",
      icon: "💳",
    },
    {
      id: "bank",
      label: "🏦 Bank Transfer",
      icon: "🏦",
    },
    {
      id: "cod",
      label: "💵 Cash on Delivery",
      icon: "💵",
    },
    {
      id: "wallet",
      label: "👛 Kemedar Wallet",
      icon: "👛",
    },
  ];

  const handleNext = () => {
    const paymentData = {
      method: selectedMethod,
      card: selectedMethod === "card" ? cardData : null,
      wallet: selectedMethod === "wallet" ? { useWallet: walletUse } : null,
    };
    onPaymentSelect(paymentData);
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Select Payment Method</h2>

      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => (
          <label
            key={method.id}
            className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              selectedMethod === method.id
                ? "border-[#FF6B00] bg-orange-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="mb-3"
            />
            <div className="font-bold text-gray-900">{method.label}</div>

            {/* Card Fields */}
            {selectedMethod === "card" && method.id === "card" && (
              <div className="mt-4 space-y-3 border-t pt-4">
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF6B00]"
                />
                <input
                  type="text"
                  placeholder="Card Number (16 digits)"
                  value={cardData.number}
                  onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF6B00]"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF6B00]"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>
              </div>
            )}

            {/* Bank Transfer */}
            {selectedMethod === "bank" && method.id === "bank" && (
              <div className="mt-4 space-y-3 border-t pt-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-600 mb-2">
                    <strong>Bank Account Details:</strong>
                  </p>
                  <p>Bank: National Bank</p>
                  <p>Account: 123456789</p>
                  <p>IBAN: EG1234567890123456789</p>
                  <p className="mt-3 text-gray-600">
                    Please upload the payment receipt after transfer:
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>
            )}

            {/* Wallet */}
            {selectedMethod === "wallet" && method.id === "wallet" && (
              <div className="mt-4 space-y-3 border-t pt-4 text-sm">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-green-900">
                    <strong>Wallet Balance: ${WALLET_BALANCE.toFixed(2)}</strong>
                  </p>
                  <label className="flex items-center gap-2 mt-2">
                    <input type="checkbox" checked={walletUse} onChange={(e) => setWalletUse(e.target.checked)} />
                    <span>Use wallet balance for this order</span>
                  </label>
                </div>
              </div>
            )}
          </label>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="w-full bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold py-3 rounded-lg transition-colors"
      >
        Review Order →
      </button>
    </div>
  );
}