import { useState } from "react";
import { AlertCircle } from "lucide-react";

const MOCK_CART_ITEMS = [
  {
    id: "1",
    name: "Premium Cement 50kg Bag",
    price: 7.50,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&q=80",
  },
  {
    id: "2",
    name: "Steel Reinforcement Rod 10mm",
    price: 420,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=300&q=80",
  },
];

export default function KemetroCheckoutStep3({
  address,
  paymentMethod,
  onPlaceOrder,
}) {
  const [agreeTerms, setAgreeTerms] = useState(false);

  const subtotal = MOCK_CART_ITEMS.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 15;
  const total = subtotal + shipping;

  const PAYMENT_LABELS = {
    card: "Credit/Debit Card",
    bank: "Bank Transfer",
    cod: "Cash on Delivery",
    wallet: "Kemedar Wallet",
  };

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-3">
          {MOCK_CART_ITEMS.map((item) => (
            <div key={item.id} className="flex gap-4 pb-3 border-b last:border-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-3">Shipping Address</h3>
        <p className="font-semibold text-gray-900">{address?.fullName}</p>
        <p className="text-sm text-gray-600">{address?.phone}</p>
        <p className="text-sm text-gray-600 mt-1">
          {address?.address}, {address?.city}, {address?.province}, {address?.country}
        </p>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-3">Payment Method</h3>
        <p className="text-gray-900">
          {PAYMENT_LABELS[paymentMethod?.method] || "Not selected"}
        </p>
      </div>

      {/* Pricing Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-3 mb-4 border-b pb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping:</span>
            <span className="font-semibold text-gray-900">${shipping.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="font-bold text-gray-900">Total Amount:</span>
          <span className="text-4xl font-black text-[#FF6B00]">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Terms */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-gray-700">
            I agree to the{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Return Policy
            </a>
          </span>
        </label>
      </div>

      {/* Place Order */}
      <button
        onClick={() => agreeTerms && onPlaceOrder()}
        disabled={!agreeTerms}
        className={`w-full font-black py-4 rounded-lg text-lg transition-colors ${
          agreeTerms
            ? "bg-[#FF6B00] hover:bg-[#e55f00] text-white"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        Place Order
      </button>
    </div>
  );
}