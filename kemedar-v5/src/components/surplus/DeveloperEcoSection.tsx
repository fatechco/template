"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Leaf, ChevronRight } from "lucide-react";
import SurplusItemCard from "@/components/surplus/SurplusItemCard";

const ECO_TIERS = {
  eco_starter: { label: "🌱 Eco Starter", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  eco_builder: { label: "🌿 Eco Builder", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-300" },
  eco_champion: { label: "🏆 Eco Champion", bg: "bg-green-900", text: "text-yellow-300", border: "border-yellow-400" },
  eco_leader:   { label: "🌍 Eco Leader",   bg: "bg-green-900", text: "text-green-200",  border: "border-green-400", glow: true },
};

export default function DeveloperEcoSection({ developerUserId }) {
  const [ecoScore, setEcoScore] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!developerUserId) return;
    const load = async () => {
      try {
        const [scoreData, itemData] = await Promise.all([
          apiClient.list("/api/v1/developerecoscore", { developerUserId }, "-created_date", 1),
          apiClient.list("/api/v1/surplusitem", { sellerId: developerUserId, status: "active" }, "-created_date", 10),
        ]);
        const score = scoreData?.[0];
        if (score && score.totalWeightKgDiverted > 0 && score.totalItemsSold >= 1) {
          setEcoScore(score);
        }
        setListings(itemData || []);
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
  }, [developerUserId]);

  if (loading || !ecoScore) return null;

  const tier = ECO_TIERS[ecoScore.ecoTier] || ECO_TIERS.eco_starter;
  const tonsCo2 = (ecoScore.totalCo2SavedKg / 1000).toFixed(1);

  return (
    <div
      className={`rounded-2xl border-2 ${tier.border} p-5 mb-6 ${tier.glow ? "ring-2 ring-green-400/30 ring-offset-2" : ""}`}
      style={{ background: "linear-gradient(135deg,#F0FDF4,#DCFCE7)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Leaf size={22} className="text-green-700" />
          <p className="font-black text-gray-900 text-lg">Sustainable Developer</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${tier.bg} ${tier.text} ${tier.border}`}>
          {tier.label}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { val: `${Number(ecoScore.totalWeightKgDiverted).toLocaleString()} kg`, label: "Waste Diverted" },
          { val: ecoScore.totalItemsListed, label: "Materials Listed" },
          { val: `${tonsCo2} tons`, label: "CO₂ Saved" },
        ].map((s, i) => (
          <div key={i} className="bg-white/70 rounded-xl p-3 text-center border border-green-100">
            <p className="text-xl font-black text-gray-900">{s.val}</p>
            <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 leading-relaxed mb-4">
        This developer has diverted{" "}
        <span className="font-bold text-gray-700">{Number(ecoScore.totalWeightKgDiverted).toLocaleString()} kg</span>{" "}
        of construction materials from landfills via the Kemetro Surplus Market, contributing to Egypt's circular economy.
      </p>

      {/* Active listings preview */}
      {listings.length > 0 && (
        <>
          <p className="text-xs font-bold text-gray-700 mb-3">
            Currently selling {listings.length} surplus item{listings.length !== 1 ? "s" : ""}:
          </p>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2">
            {listings.slice(0, 4).map(item => (
              <div key={item.id} className="flex-shrink-0 w-44">
                <SurplusItemCard item={item} compact />
              </div>
            ))}
          </div>
          <a
            href={`/kemetro/surplus?sellerId=${developerUserId}`}
            className="flex items-center justify-center gap-1 mt-3 text-green-700 text-xs font-bold hover:underline"
          >
            View All Listings <ChevronRight size={14} />
          </a>
        </>
      )}
    </div>
  );
}