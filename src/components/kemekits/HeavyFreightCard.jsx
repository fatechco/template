const SHIPPING_RATE = 15; // EGP per kg

export default function HeavyFreightCard({ totalWeightKg }) {
  if (!totalWeightKg || totalWeightKg <= 100) return null;

  const freightCost = Math.round(totalWeightKg * SHIPPING_RATE);
  const palletW = Math.min(120, Math.round(totalWeightKg / 3));
  const palletH = Math.min(100, Math.round(totalWeightKg / 4));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-blue-600">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-blue-600 text-2xl">🚛</span>
        <h3 className="font-black text-gray-900 text-base">Heavy Load — Freight Delivery</h3>
      </div>

      <p className="text-gray-500 text-sm mb-4 leading-relaxed">
        This kit weighs approximately <strong>{totalWeightKg.toLocaleString()} kg</strong>. Standard couriers cannot handle this order.
        Select <strong>Kemetro Heavy Freight</strong> at checkout for palletized delivery to your site.
      </p>

      {/* Weight breakdown */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-4 space-y-1">
        <p className="text-blue-700 text-sm font-semibold">📦 Estimated kit weight: <strong>{totalWeightKg.toLocaleString()} kg</strong></p>
        <p className="text-blue-700 text-sm font-semibold">📐 Approximate pallet size: <strong>{palletW} cm × {palletH} cm</strong></p>
      </div>

      {/* Freight cost */}
      <div className="text-center mb-3">
        <p className="text-blue-600 font-black text-lg">🚛 Estimated freight cost: ~{freightCost.toLocaleString()} EGP</p>
        <p className="text-gray-400 text-xs">Final price quoted at checkout</p>
      </div>

      <p className="text-gray-400 text-xs leading-relaxed">
        Freight delivery is handled by verified Kemetro shippers with appropriate vehicles.
        You'll be contacted to arrange a delivery window.
      </p>
    </div>
  );
}