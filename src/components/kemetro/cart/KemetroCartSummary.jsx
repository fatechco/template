import { useState } from "react";
import { Link } from "react-router-dom";

export default function KemetroCartSummary({ subtotal, shipping = 0, discount = 0 }) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const total = subtotal + shipping - discount;

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode);
      setCouponCode("");
    }
  };

  return (
    <div className="sticky top-8 bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
      {/* Summary */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping:</span>
          <span className="font-semibold text-gray-900">
            {shipping === 0 ? "Calculated at checkout" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount:</span>
            <span className="font-semibold text-green-600">-${discount.toFixed(2)}</span>
          </div>
        )}
        {appliedCoupon && (
          <div className="flex justify-between text-sm bg-green-50 px-3 py-2 rounded-lg">
            <span className="text-green-700 font-semibold">{appliedCoupon}</span>
            <button
              onClick={() => {
                setAppliedCoupon(null);
                setCouponCode("");
              }}
              className="text-green-600 hover:text-green-700 font-bold"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Coupon Input */}
      <div className="mb-6 pb-6 border-b">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF6B00]"
          />
          <button
            onClick={handleApplyCoupon}
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="mb-6 pb-6 border-b">
        <div className="flex justify-between">
          <span className="font-bold text-gray-900">Total:</span>
          <span className="text-3xl font-black text-[#FF6B00]">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <Link
          to="/kemetro/checkout"
          className="block bg-[#FF6B00] hover:bg-[#e55f00] text-white font-black py-3 rounded-lg text-center transition-colors"
        >
          Proceed to Checkout
        </Link>
        <Link
          to="/kemetro"
          className="block text-center text-[#FF6B00] hover:underline font-semibold text-sm"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t space-y-2 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span>🔒</span>
          <span>Secure Checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🚚</span>
          <span>Fast Delivery</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🔄</span>
          <span>Easy Returns</span>
        </div>
      </div>
    </div>
  );
}