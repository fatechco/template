import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { X } from "lucide-react";
import FlashCountdown from "./FlashCountdown";

const fmt = n => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

export default function FlashOrderSheet({ deal, qty, unitPrice, total, delivery, onClose }) {
  const [localQty, setLocalQty] = useState(qty);
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("on_delivery");
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(false);

  const unitP = unitPrice;
  const sub = unitP * localQty;
  const tot = sub + delivery;

  const handleOrder = async () => {
    setPlacing(true);
    const user = await base44.auth.me().catch(() => null);
    const orderNumber = `KFO-${Date.now().toString(36).toUpperCase()}`;
    await base44.entities.FlashOrder.create({
      orderNumber, dealId: deal.id, dealType: "flash",
      buyerId: user?.id || "guest", sellerId: deal.sellerId,
      quantity: localQty, unitPrice: unitP, originalUnitPrice: deal.originalPrice,
      discount: (deal.originalPrice - unitP) * localQty, discountPercent: deal.discountPercent,
      subtotal: sub, deliveryCost: delivery, totalAmount: tot,
      deliveryAddress: address, paymentMethod: payment,
      productName: deal.productName, productImage: deal.productImages?.[0],
      status: "pending_payment", currency: "EGP"
    }).catch(() => {});
    // Update stock
    await base44.entities.FlashDeal.update(deal.id, {
      stockRemaining: Math.max(0, (deal.stockRemaining || 0) - localQty),
      totalOrders: (deal.totalOrders || 0) + 1,
      totalUnitsSold: (deal.totalUnitsSold || 0) + localQty,
      totalRevenue: (deal.totalRevenue || 0) + tot,
    }).catch(() => {});
    setPlacing(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-lg shadow-2xl" style={{ maxHeight: "92vh", overflowY: "auto" }}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between">
          <p className="font-black text-gray-900">Complete Your Order</p>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <p className="text-6xl mb-4">⚡</p>
            <h2 className="text-2xl font-black text-green-600 mb-2">Order Placed!</h2>
            <p className="text-gray-500 mb-4">Your Flash order has been confirmed.</p>
            <p className="text-sm text-gray-400">You'll receive delivery in {deal.deliveryLeadDays}-{deal.deliveryLeadDays + 2} days</p>
            <button onClick={onClose} className="mt-6 bg-orange-500 text-white font-black px-8 py-3 rounded-xl hover:bg-orange-600">Done</button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Product summary */}
            <div className="flex gap-3 bg-gray-50 rounded-xl p-3">
              <img src={deal.productImages?.[0]} alt="" className="w-14 h-14 object-cover rounded-xl flex-shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm line-clamp-2">{deal.productName}</p>
                <p className="text-red-600 font-black text-lg">{fmt(unitP)} EGP</p>
              </div>
            </div>

            {/* Countdown */}
            <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-center">
              <FlashCountdown endsAt={deal.dealEndsAt} small />
            </div>

            {/* Qty */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">Quantity ({deal.unit}):</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setLocalQty(q => Math.max(deal.minimumOrderQty || 1, q - 5))} className="px-4 py-3 text-gray-600 hover:bg-gray-100 font-black text-xl">−</button>
                  <span className="px-6 py-3 font-black text-xl">{localQty}</span>
                  <button onClick={() => setLocalQty(q => q + 5)} className="px-4 py-3 text-gray-600 hover:bg-gray-100 font-black text-xl">+</button>
                </div>
                <div>
                  <p className="font-black text-orange-600 text-xl">{fmt(sub)} EGP</p>
                  <p className="text-xs text-gray-400">+ {delivery === 0 ? "Free delivery" : fmt(delivery) + " EGP delivery"}</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">Delivery Address:</p>
              <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter your delivery address..." className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>

            {/* Payment */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">Payment Method:</p>
              {[
                { id: "on_delivery", label: "💵 Cash on Delivery" },
                { id: "wallet", label: "🔵 Kemedar Wallet" },
              ].map(pm => (
                <label key={pm.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 mb-2 cursor-pointer transition-all ${payment === pm.id ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <input type="radio" name="payment" value={pm.id} checked={payment === pm.id} onChange={() => setPayment(pm.id)} className="accent-orange-500" />
                  <span className="font-bold text-gray-800">{pm.label}</span>
                </label>
              ))}
            </div>

            {/* Total */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Subtotal:</span><span className="font-bold">{fmt(sub)} EGP</span></div>
              <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Delivery:</span><span className="font-bold">{delivery === 0 ? "FREE" : fmt(delivery) + " EGP"}</span></div>
              <div className="flex justify-between border-t border-orange-200 pt-2"><span className="font-black text-gray-900">Total:</span><span className="font-black text-orange-600 text-2xl">{fmt(tot)} EGP</span></div>
            </div>

            <button onClick={handleOrder} disabled={placing || !address} className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-2">
              {placing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "⚡"}
              {placing ? "Placing Order..." : "Order Now"}
            </button>
            <p className="text-xs text-gray-400 text-center">Cancel within 2 hours | No fees</p>
          </div>
        )}
      </div>
    </div>
  );
}