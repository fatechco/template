"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import KemeKitBOQList from "./KemeKitBOQList";

function calculateQty(rule, surfaces, coverage, fixedQty) {
  if (rule === "fixed_quantity") return fixedQty || 1;
  const cov = coverage || 1;
  switch (rule) {
    case "floor_sqm": return surfaces.floor / cov;
    case "wall_sqm": return surfaces.netWall / cov;
    case "ceiling_sqm": return surfaces.floor / cov;
    case "floor_wall_sqm": return (surfaces.floor + surfaces.netWall) / cov;
    case "linear_meter": return surfaces.perimeter / cov;
    default: return 1;
  }
}

function buildBreakdown(rule, baseQty, coverage, waste) {
  if (rule === "fixed_quantity") return "Fixed quantity";
  const withWaste = Math.ceil(baseQty * (1 + (waste || 10) / 100));
  if (coverage && coverage !== 1)
    return `${baseQty.toFixed(2)} m² ÷ ${coverage} + ${waste || 10}% waste = ${withWaste} units`;
  return `${baseQty.toFixed(2)} + ${waste || 10}% waste = ${withWaste} units`;
}

function computeBOQ(items, dim) {
  const floor = parseFloat((dim.length * dim.width).toFixed(2));
  const gross = 2 * dim.length * dim.height + 2 * dim.width * dim.height;
  const netWall = Math.max(0, gross - dim.doors * 1.6 - dim.windows * 1.4);
  const perimeter = Math.max(0, 2 * (dim.length + dim.width) - dim.doors * 0.9);
  const surfaces = { floor, netWall, perimeter };
  return items.map(item => {
    const baseQty = calculateQty(item.calculationRule, surfaces, item.coveragePerUnit, item.fixedQuantity);
    const withWaste = baseQty * (1 + (item.wasteMarginPercent || 10) / 100);
    const finalQty = Math.ceil(withWaste);
    const subtotal = finalQty * (item.productPriceEGP || 0);
    const breakdown = buildBreakdown(item.calculationRule, baseQty, item.coveragePerUnit, item.wasteMarginPercent);
    return { ...item, baseQty, finalQty, subtotal, breakdown };
  });
}

function LoginPrompt({ action, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-black text-gray-900 mb-2">Sign in to {action}</h3>
        <p className="text-gray-600 text-sm mb-6">Create a free account to save and share your calculations.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-300 font-bold text-gray-700 text-sm">Cancel</button>
          <button onClick={() => router.push("/login")} className="flex-1 py-2.5 rounded-lg bg-blue-600 font-bold text-white text-sm hover:bg-blue-700">Sign In</button>
        </div>
      </div>
    </div>
  );
}

function Stepper({ label, value, unit, onDec, onInc, isDecimal }) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-700 mb-1">{label}</p>
      <div className="flex items-center gap-0">
        <button onClick={onDec}
          className="w-10 h-11 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-l-lg font-black text-gray-700 text-lg border border-gray-200 transition-colors">
          −
        </button>
        <div className="flex-1 h-11 bg-white border-y border-gray-200 flex items-center justify-center font-bold text-gray-900 text-base">
          {isDecimal ? value.toFixed(1) : value}
        </div>
        <button onClick={onInc}
          className="w-10 h-11 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-r-lg font-black text-gray-700 text-lg border border-gray-200 transition-colors">
          +
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-0.5">{unit}</p>
    </div>
  );
}

export default function KemeKitCalculator({ kit, items, onCalcChange, user: userProp }) {
  const [dim, setDim] = useState({ length: 3.0, width: 2.0, height: 2.8, doors: 1, windows: 1 });
  const [boq, setBoq] = useState([]);
  const [excluded, setExcluded] = useState({});
  const [user, setUser] = useState(userProp || null);
  const [loginPrompt, setLoginPrompt] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  useEffect(() => {
    if (!userProp) apiClient.get("/api/auth/session").then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    const newBoq = computeBOQ(items, dim);
    setBoq(newBoq);
  }, [dim, items]);

  const step = (key, delta) => {
    const isDecimal = ["length", "width", "height"].includes(key);
    const min = isDecimal ? 0.5 : 0;
    const max = isDecimal ? 15 : 10;
    const next = parseFloat((dim[key] + delta).toFixed(1));
    if (next >= min && next <= max) setDim(d => ({ ...d, [key]: next }));
  };

  const toggleExclude = (id) => setExcluded(e => ({ ...e, [id]: !e[id] }));

  const included = boq.filter(item => !excluded[item.id]);
  const totalCost = included.reduce((s, i) => s + i.subtotal, 0);
  const totalItems = included.reduce((s, i) => s + i.finalQty, 0);
  const estimatedWeightKg = totalItems * 20;

  useEffect(() => {
    if (onCalcChange) {
      onCalcChange({ totalCost, totalWeightKg: estimatedWeightKg, dimensions: dim });
    }
  }, [totalCost, estimatedWeightKg, dim]);

  const floorArea = (dim.length * dim.width).toFixed(2);
  const netWall = Math.max(0, (2 * dim.length * dim.height + 2 * dim.width * dim.height) - dim.doors * 1.6 - dim.windows * 1.4).toFixed(2);
  const perimeter = Math.max(0, (2 * (dim.length + dim.width)) - (dim.doors * 0.9)).toFixed(2);

  const handleCart = async () => {
    if (!user) { setLoginPrompt("add to cart"); return; }
    setCartLoading(true);
    try {
      await apiClient.post("/api/v1/ai/addKemeKitToCart", {
        kitId: kit.id, dimensions: dim, boq: included, totalCost
      });
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    } catch {}
    setCartLoading(false);
  };

  const handleSave = async () => {
    if (!user) { setLoginPrompt("save calculation"); return; }
    const nickname = prompt("Give this calculation a name:", `${kit.title} — ${dim.length}×${dim.width}m`);
    if (!nickname) return;
    await apiClient.post("/api/v1/ai/calculateKemeKitBoQ", {
      templateId: kit.id, lengthMeters: dim.length, widthMeters: dim.width,
      heightMeters: dim.height, doorsCount: dim.doors, windowsCount: dim.windows,
      projectNickname: nickname,
    }).catch(() => {});
  };

  return (
    <>
      {loginPrompt && <LoginPrompt action={loginPrompt} onClose={() => setLoginPrompt(null)} />}

      <div className="bg-white rounded-[20px] shadow-md overflow-hidden" style={{ borderTop: "6px solid #0A6EBD" }}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-900 text-lg">📐 Customize for Your Space</h2>
          <p className="text-gray-400 text-xs mt-0.5">Enter your room dimensions. We calculate exact quantities needed.</p>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Dimension Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <Stepper label="Length (m)" value={dim.length} unit="meters" isDecimal
              onDec={() => step("length", -0.1)} onInc={() => step("length", 0.1)} />
            <Stepper label="Width (m)" value={dim.width} unit="meters" isDecimal
              onDec={() => step("width", -0.1)} onInc={() => step("width", 0.1)} />
            <Stepper label="Height (m)" value={dim.height} unit="meters (default 2.8)" isDecimal
              onDec={() => step("height", -0.1)} onInc={() => step("height", 0.1)} />
            <div className="grid grid-cols-2 gap-2">
              <Stepper label="Doors" value={dim.doors} unit="doors"
                onDec={() => step("doors", -1)} onInc={() => step("doors", 1)} />
              <Stepper label="Windows" value={dim.windows} unit="windows"
                onDec={() => step("windows", -1)} onInc={() => step("windows", 1)} />
            </div>
          </div>

          {/* Surfaces */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-blue-700 font-black text-base">{floorArea}</p>
              <p className="text-blue-400 text-[10px] font-bold">Floor m²</p>
            </div>
            <div>
              <p className="text-blue-700 font-black text-base">{netWall}</p>
              <p className="text-blue-400 text-[10px] font-bold">Walls m²</p>
            </div>
            <div>
              <p className="text-blue-700 font-black text-base">{perimeter}</p>
              <p className="text-blue-400 text-[10px] font-bold">Perimeter m</p>
            </div>
          </div>
        </div>

        {/* BOQ List */}
        <div className="px-5 pb-2">
          <p className="font-black text-gray-900 text-sm mb-0.5">Your Material List</p>
          <p className="text-gray-400 text-xs mb-3">Updates automatically as you adjust dimensions</p>
          <KemeKitBOQList boq={boq} excluded={excluded} onToggle={toggleExclude} />
        </div>

        {/* Grand Total */}
        <div className="mx-5 mb-5 bg-white border-t-4 border-blue-600 rounded-xl shadow-sm p-4">
          <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Total Materials</p>
          <p className="text-center font-black text-blue-600" style={{ fontSize: 32 }}>
            {totalCost.toLocaleString()} EGP
          </p>
          <p className="text-center text-xs text-gray-400 mt-1 mb-1">
            {included.length} items for your {dim.length}×{dim.width}m room
          </p>
          <p className="text-center text-xs text-gray-400 mb-3">
            ~{estimatedWeightKg.toLocaleString()} kg total
            {estimatedWeightKg > 100 && (
              <span className="text-orange-500 font-bold ml-1">
                🚛 Heavy — freight delivery recommended
              </span>
            )}
          </p>

          <button
            onClick={handleCart}
            disabled={cartLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black rounded-2xl transition-all mb-2"
            style={{
              height: 52,
              animation: !cartSuccess ? "bounce 2s ease 1" : "none",
            }}
          >
            {cartSuccess ? "✅ Added to Cart!" : cartLoading ? "Adding..." : `🛒 Add All ${included.length} Items to Cart`}
          </button>

          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors"
            style={{ height: 44 }}
          >
            💾 Save This Calculation
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          20% { transform: translateY(-6px); }
          40% { transform: translateY(0); }
          60% { transform: translateY(-3px); }
          80% { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}