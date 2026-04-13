import { useState } from "react";
import { base44 } from "@/api/base44Client";

export default function InstallationSynergyCard({ kit, dimensions, totalCost, user }) {
  const [hireStatus, setHireStatus] = useState(null); // null | "loading" | "done"
  const [bidStatus, setBidStatus] = useState(null);

  const floorArea = (dimensions.length * dimensions.width).toFixed(2);
  const laborCost = kit.baseLaborRatePerSqmEGP
    ? Math.round(kit.baseLaborRatePerSqmEGP * floorArea)
    : Math.round(floorArea * 350);
  const days = kit.estimatedInstallDays || Math.ceil(floorArea / 10);
  const firstName = (kit.creatorName || "Designer").split(" ")[0];

  const handleHireCreator = async () => {
    if (!user) { base44.auth.redirectToLogin(); return; }
    setHireStatus("loading");
    try {
      await base44.functions.invoke("requestInstallation", {
        templateId: kit.id,
        requestType: "hire_creator",
        assignedProId: kit.creatorId,
        dimensions,
        totalMaterialCostEGP: totalCost,
        estimatedLaborCostEGP: laborCost,
      });
      setHireStatus("done");
    } catch { setHireStatus(null); }
  };

  const handleOpenBidding = async () => {
    if (!user) { base44.auth.redirectToLogin(); return; }
    setBidStatus("loading");
    try {
      await base44.functions.invoke("requestInstallation", {
        templateId: kit.id,
        requestType: "open_bidding",
        dimensions,
        totalMaterialCostEGP: totalCost,
        estimatedLaborCostEGP: laborCost,
      });
      setBidStatus("done");
    } catch { setBidStatus(null); }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-teal-500">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-xl flex-shrink-0">
          👷
        </div>
        <h3 className="font-black text-gray-900 text-base">Need Someone to Install This?</h3>
      </div>
      <p className="text-gray-500 text-sm mb-4 leading-relaxed">
        You have all the materials. Now get it installed perfectly by a certified professional.
      </p>

      {/* Labor Estimate */}
      <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-4 text-center">
        <p className="text-teal-700 text-sm mb-1">
          📐 Estimated labor for your <strong>{floorArea} m²</strong> room:
        </p>
        <p className="text-teal-600 font-black text-2xl">{laborCost.toLocaleString()} EGP</p>
        <p className="text-gray-400 text-xs mt-1">Est. {days} days to complete</p>
      </div>

      {/* Option A — Hire Creator */}
      {kit.creatorId && (
        <div className="bg-white border-2 border-teal-200 rounded-xl p-4 mb-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-xl font-black text-teal-700 flex-shrink-0">
              {firstName[0]}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{kit.creatorName}</p>
              <p className="text-teal-500 text-xs">⭐ 4.8 · Creator of this KemeKit</p>
              <p className="text-gray-400 text-xs">Available in your area</p>
            </div>
          </div>
          {hireStatus === "done" ? (
            <div className="w-full text-center py-3 rounded-xl bg-teal-50 text-teal-700 font-bold text-sm">
              ✅ Request sent to {firstName}! They'll respond within 24 hours.
            </div>
          ) : (
            <button
              onClick={handleHireCreator}
              disabled={hireStatus === "loading"}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm py-3 rounded-xl transition-colors"
            >
              {hireStatus === "loading" ? "Sending..." : `🤝 Request Installation from ${firstName}`}
            </button>
          )}
        </div>
      )}

      {/* Option B — Open Bidding */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-gray-500 text-sm mb-3">Prefer to compare quotes?</p>
        {bidStatus === "done" ? (
          <div className="w-full text-center py-3 rounded-xl bg-green-50 text-green-700 font-bold text-sm">
            📢 Task posted! Local professionals will submit bids within 24 hours.
          </div>
        ) : (
          <button
            onClick={handleOpenBidding}
            disabled={bidStatus === "loading"}
            className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold text-sm py-3 rounded-xl transition-colors bg-white"
          >
            {bidStatus === "loading" ? "Posting..." : "📢 Post to Local Contractors"}
          </button>
        )}
      </div>
    </div>
  );
}