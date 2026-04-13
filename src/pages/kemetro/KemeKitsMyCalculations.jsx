import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";
import { format } from "date-fns";

const STATUS_CONFIG = {
  draft: { label: "Draft", bg: "bg-gray-100", text: "text-gray-600" },
  saved: { label: "Saved", bg: "bg-blue-100", text: "text-blue-700" },
  cart_added: { label: "In Cart", bg: "bg-yellow-100", text: "text-yellow-700" },
  purchased: { label: "Purchased", bg: "bg-green-100", text: "text-green-700" },
};

const TABS = [
  { id: "active", label: "Active", statuses: ["draft", "saved"] },
  { id: "cart", label: "Added to Cart", statuses: ["cart_added"] },
  { id: "purchased", label: "Purchased", statuses: ["purchased"] },
];

function CalcCard({ calc, onRecalculate, onAddToCart }) {
  const cfg = STATUS_CONFIG[calc.status] || STATUS_CONFIG.draft;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 items-center">
      {/* Kit Image */}
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
        {calc._kitImage ? (
          <img src={calc._kitImage} alt={calc._kitTitle} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">📐</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-black text-gray-900 text-sm truncate">
          {calc.projectNickname || calc._kitTitle || "Untitled Calculation"}
        </p>
        <p className="text-gray-400 text-xs mt-0.5">
          {calc.lengthMeters}m × {calc.widthMeters}m × {calc.heightMeters}m
          · {calc.doorsCount || 0} door(s)
        </p>
        <p className="text-gray-500 text-xs mt-0.5">
          <span className="font-semibold text-blue-600">
            {(calc.totalMaterialCostEGP || 0).toLocaleString()} EGP
          </span>
          {calc.calculatedBoQ?.length > 0 && (
            <span className="text-gray-400 ml-1">· {calc.calculatedBoQ.length} items</span>
          )}
        </p>
        <p className="text-gray-300 text-xs mt-0.5">
          {calc.updated_date ? format(new Date(calc.updated_date), "d MMM yyyy") : "—"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 items-end flex-shrink-0">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
          {cfg.label}
        </span>
        <button
          onClick={() => onRecalculate(calc)}
          className="text-blue-600 text-xs font-bold hover:underline whitespace-nowrap"
        >
          📐 Recalculate
        </button>
        {calc.status !== "cart_added" && calc.status !== "purchased" && (
          <button
            onClick={() => onAddToCart(calc)}
            className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            🛒 Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default function KemeKitsMyCalculations() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [calculations, setCalculations] = useState([]);
  const [kits, setKits] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async (user) => {
      const calcs = await base44.entities.KemeKitCalculation.filter({ userId: user.id }, "-updated_date", 50);
      // Fetch kit info for each unique templateId
      const uniqueKitIds = [...new Set(calcs.map(c => c.templateId).filter(Boolean))];
      const kitMap = {};
      await Promise.all(uniqueKitIds.map(async (id) => {
        const k = await base44.entities.KemeKitTemplate.filter({ id }).then(r => r[0]);
        if (k) kitMap[id] = k;
      }));
      setKits(kitMap);
      const enriched = calcs.map(c => ({
        ...c,
        _kitTitle: kitMap[c.templateId]?.title,
        _kitImage: kitMap[c.templateId]?.heroImageUrl,
        _kitSlug: kitMap[c.templateId]?.slug,
      }));
      setCalculations(enriched);
      setLoading(false);
    }).catch(() => {
      navigate("/m/login");
    });
  }, []);

  const handleRecalculate = (calc) => {
    const slug = calc._kitSlug || calc.templateId;
    navigate(`/kemetro/kemekits/${slug}`);
  };

  const handleAddToCart = async (calc) => {
    await base44.functions.invoke("addKemeKitToCart", {
      kitId: calc.templateId,
      calculationId: calc.id,
      dimensions: {
        length: calc.lengthMeters,
        width: calc.widthMeters,
        height: calc.heightMeters,
        doors: calc.doorsCount,
        windows: calc.windowsCount,
      },
      boq: calc.calculatedBoQ,
      totalCost: calc.totalMaterialCostEGP,
    });
    setCalculations(prev =>
      prev.map(c => c.id === calc.id ? { ...c, status: "cart_added" } : c)
    );
  };

  const tabDef = TABS.find(t => t.id === activeTab);
  const filtered = calculations.filter(c => tabDef.statuses.includes(c.status));

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <KemetroHeader />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">My Calculations</h1>
            <p className="text-gray-400 text-sm mt-1">Your saved KemeKit room calculations</p>
          </div>
          <Link to="/kemetro/kemekits" className="bg-blue-600 text-white font-bold text-sm px-4 py-2 rounded-xl hover:bg-blue-700">
            Browse KemeKits
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📐</p>
            <p className="font-black text-gray-900 text-lg mb-2">No saved calculations yet</p>
            <p className="text-gray-400 text-sm mb-6">Browse KemeKits and calculate for your room</p>
            <Link to="/kemetro/kemekits" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 inline-block">
              Browse KemeKits →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(calc => (
              <CalcCard
                key={calc.id}
                calc={calc}
                onRecalculate={handleRecalculate}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      <KemetroFooter />
    </div>
  );
}