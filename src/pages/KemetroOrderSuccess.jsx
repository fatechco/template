import { useLocation } from "react-router-dom";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";

export default function KemetroOrderSuccess() {
  const location = useLocation();
  const { orderNumber } = location.state || { orderNumber: "ORD-2025-001" };
  const [copied, setCopied] = useState(false);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />
      <div className="max-w-[1400px] mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Order Placed Successfully!</h1>
          <div className="my-8 p-6 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Your Order Number</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-black text-[#FF6B00]">{orderNumber}</span>
              <button onClick={copyOrderNumber} className="text-gray-600 hover:text-gray-900 transition-colors">
                {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
              </button>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
            <p className="text-lg font-bold text-gray-900">3–7 Business Days</p>
          </div>
          <div className="mb-8 text-left border-t pt-6">
            <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">$435.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold">$15.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-[#FF6B00]">$450.00</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <a href="/kemetro/orders" className="block bg-[#FF6B00] hover:bg-[#e55f00] text-white font-black py-3 rounded-lg transition-colors">
              Track Order
            </a>
            <a href="/kemetro" className="block border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-orange-50 font-bold py-3 rounded-lg transition-colors">
              Continue Shopping
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-6">🔒 Your payment is secure and encrypted</p>
        </div>
      </div>
      <KemetroFooter />
    </div>
  );
}