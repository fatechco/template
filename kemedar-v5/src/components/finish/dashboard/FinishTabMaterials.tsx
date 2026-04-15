"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ExternalLink, ShoppingCart, Package, TrendingDown } from "lucide-react";

function fmt(n) { return new Intl.NumberFormat("en-EG").format(Math.round(n || 0)); }

const STATUS_STYLES = {
  not_ordered: "bg-gray-100 text-gray-600",
  ordered: "bg-blue-100 text-blue-700",
  confirmed: "bg-cyan-100 text-cyan-700",
  shipped: "bg-purple-100 text-purple-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  partial: "bg-yellow-100 text-yellow-700",
};

const MOCK_MATERIALS = [
  { id: "m1", name: "60×60 Porcelain Floor Tiles (Grey)", quantity: 85, unit: "m²", boqCost: 15300, actualCost: 14790, deliveryStatus: "delivered", phase: "Tiling & Flooring", kemetroProductId: "kprod_001", seller: "Cairo Tiles Direct", rating: 4.8, savings: 510 },
  { id: "m2", name: "Interior Wall Paint — White Matte (10L)", quantity: 24, unit: "cans", boqCost: 9600, actualCost: 9840, deliveryStatus: "ordered", phase: "Painting", kemetroProductId: "kprod_002", seller: "Paints Egypt", rating: 4.5, savings: -240 },
  { id: "m3", name: "Electrical Cable 3×1.5mm", quantity: 200, unit: "m", boqCost: 2400, actualCost: null, deliveryStatus: "not_ordered", phase: "Electrical", kemetroProductId: null, seller: null, savings: null },
  { id: "m4", name: "Modular Kitchen Set — Standard", quantity: 1, unit: "set", boqCost: 22000, actualCost: 21500, deliveryStatus: "ordered", phase: "Kitchen Installation", kemetroProductId: "kprod_004", seller: "EG Kitchens", rating: 4.7, savings: 500 },
  { id: "m5", name: "Bathroom Sanitary Ware (Full Set)", quantity: 2, unit: "sets", boqCost: 12000, actualCost: null, deliveryStatus: "not_ordered", phase: "Bathroom Fixtures", kemetroProductId: null, seller: null, savings: null },
  { id: "m6", name: "Gypsum Board + Profiles", quantity: 60, unit: "m²", boqCost: 14400, actualCost: 13800, deliveryStatus: "shipped", phase: "Plastering & Gypsum", kemetroProductId: "kprod_006", seller: "Gyps Master", rating: 4.6, savings: 600 },
];

export default function FinishTabMaterials({ project }) {
  const [orders, setOrders] = useState([]);
  const [materials] = useState(MOCK_MATERIALS);
  const [orderingAll, setOrderingAll] = useState(false);
  const [ordered, setOrdered] = useState([]);

  useEffect(() => {
    apiClient.list("/api/v1/finishmaterialorder", { projectId: project.id }).then(setOrders);
  }, [project.id]);

  const pending = materials.filter(m => m.deliveryStatus === "not_ordered" && !ordered.includes(m.id));
  const delivered = materials.filter(m => m.deliveryStatus === "delivered");
  const inTransit = materials.filter(m => ["ordered", "confirmed", "shipped", "out_for_delivery"].includes(m.deliveryStatus));

  const totalBOQ = materials.reduce((s, m) => s + m.boqCost, 0);
  const totalActual = materials.filter(m => m.actualCost).reduce((s, m) => s + m.actualCost, 0);
  const totalSavings = materials.filter(m => m.savings).reduce((s, m) => s + m.savings, 0);

  const handleBulkOrder = async () => {
    setOrderingAll(true);
    await apiClient.post("/api/v1/finishmaterialorder", {
      projectId: project.id,
      orderNumber: `KMO-${Date.now()}`,
      items: pending.map(m => ({ productName: m.name, quantity: m.quantity, unit: m.unit, totalPrice: m.boqCost })),
      totalAmount: pending.reduce((s, m) => s + m.boqCost, 0),
      deliveryAddress: project.propertyAddress,
      deliveryStatus: "ordered",
      paymentStatus: "pending",
    });
    setOrdered(prev => [...prev, ...pending.map(m => m.id)]);
    setOrderingAll(false);
  };

  const handleSingleOrder = (mat) => {
    setOrdered(prev => [...prev, mat.id]);
  };

  return (
    <div>
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {[
          { label: "BOQ Budget", val: fmt(totalBOQ) + " EGP", color: "text-gray-700", bg: "bg-gray-50", icon: "📐" },
          { label: "Actual Spent", val: fmt(totalActual) + " EGP", color: "text-blue-600", bg: "bg-blue-50", icon: "💳" },
          { label: "Savings vs BOQ", val: (totalSavings >= 0 ? "+" : "") + fmt(totalSavings) + " EGP", color: totalSavings >= 0 ? "text-green-600" : "text-red-600", bg: totalSavings >= 0 ? "bg-green-50" : "bg-red-50", icon: totalSavings >= 0 ? "📉" : "📈" },
          { label: "Pending Orders", val: pending.length, color: "text-orange-600", bg: "bg-orange-50", icon: "🛒" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-3 text-center border border-white`}>
            <p className="text-xl mb-1">{s.icon}</p>
            <p className={`text-lg font-black ${s.color}`}>{s.val}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Kemetro bulk order CTA */}
      {pending.length > 0 && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-4 mb-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <ShoppingCart size={20} />
            </div>
            <div className="flex-1">
              <p className="font-black text-sm">Order All Pending from Kemetro</p>
              <p className="text-orange-100 text-xs">{pending.length} items · Est. {fmt(pending.reduce((s, m) => s + m.boqCost, 0))} EGP · BOQ prices pre-negotiated</p>
            </div>
            <button
              onClick={handleBulkOrder}
              disabled={orderingAll}
              className="bg-white text-orange-600 font-black px-4 py-2 rounded-xl text-xs hover:bg-orange-50 transition-colors disabled:opacity-60"
            >
              {orderingAll ? "Ordering..." : "Bulk Order →"}
            </button>
          </div>
        </div>
      )}

      {/* Price comparison banner */}
      {totalSavings > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <TrendingDown size={20} className="text-green-600 flex-shrink-0" />
          <div>
            <p className="font-black text-green-800 text-sm">You saved {fmt(totalSavings)} EGP vs BOQ estimate</p>
            <p className="text-xs text-green-600">Kemetro competitive pricing beats BOQ benchmark prices</p>
          </div>
        </div>
      )}

      {/* Materials list */}
      <div className="space-y-3">
        {materials.map(mat => {
          const isOrdered = ordered.includes(mat.id);
          const effectiveStatus = isOrdered ? "ordered" : mat.deliveryStatus;
          return (
            <div key={mat.id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{mat.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{mat.phase} · {mat.quantity} {mat.unit}</p>
                  {mat.seller && <p className="text-xs text-blue-600 mt-0.5">🏪 {mat.seller} {mat.rating && `· ⭐ ${mat.rating}`}</p>}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${STATUS_STYLES[effectiveStatus] || "bg-gray-100 text-gray-600"}`}>
                  {effectiveStatus.replace(/_/g, " ").toUpperCase()}
                </span>
              </div>

              {/* Price comparison */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-gray-500">BOQ: <span className="font-bold text-gray-700">{fmt(mat.boqCost)} EGP</span></span>
                  {mat.actualCost && (
                    <>
                      <span className="text-gray-300">→</span>
                      <span className="text-gray-500">Actual: <span className={`font-bold ${mat.actualCost <= mat.boqCost ? "text-green-600" : "text-red-600"}`}>{fmt(mat.actualCost)} EGP</span></span>
                      {mat.savings !== null && (
                        <span className={`font-bold ${mat.savings >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {mat.savings >= 0 ? "▼" : "▲"} {fmt(Math.abs(mat.savings))}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {effectiveStatus === "not_ordered" ? (
                  <>
                    <button
                      onClick={() => handleSingleOrder(mat)}
                      className="flex-1 text-xs bg-orange-500 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <ShoppingCart size={12} /> Order from Kemetro
                    </button>
                    <a href="/kemetro/search" target="_blank" rel="noopener noreferrer"
                      className="text-xs border border-gray-200 text-gray-600 font-bold px-3 py-1.5 rounded-xl hover:bg-gray-50 flex items-center gap-1">
                      <ExternalLink size={12} /> Compare
                    </a>
                  </>
                ) : effectiveStatus === "delivered" ? (
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xs text-green-600 font-bold">✅ Delivered</span>
                    <button className="ml-auto text-xs border border-yellow-300 text-yellow-700 font-bold px-3 py-1.5 rounded-xl hover:bg-yellow-50">
                      ⭐ Rate Seller
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <Package size={12} className="text-blue-500" />
                    <span className="text-xs text-blue-600 font-bold">In transit</span>
                    <button className="ml-auto text-xs border border-blue-200 text-blue-600 font-bold px-3 py-1.5 rounded-xl hover:bg-blue-50">
                      📦 Track
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}