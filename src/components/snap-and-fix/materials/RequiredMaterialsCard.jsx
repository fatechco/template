import { useState } from "react";
import { base44 } from "@/api/base44Client";
import MaterialRow from "./MaterialRow";
import MaterialSearchSheet from "./MaterialSearchSheet";
import MaterialsDecisionToggle from "./MaterialsDecisionToggle";
import MaterialsCartStrip from "./MaterialsCartStrip";

export default function RequiredMaterialsCard({ session, onSessionUpdate }) {
  const materials = session?.requiredMaterials || [];
  const [activeSheet, setActiveSheet] = useState(null); // { material, index }
  const [materialsSuppliedBy, setMaterialsSuppliedBy] = useState(
    session?.materialsSuppliedBy || "professional"
  );
  const [cartCount, setCartCount] = useState(session?.kemetroItemsAddedToCart || 0);
  const [cartTotal, setCartTotal] = useState(
    materials.reduce((s, m) => s + (m.estimatedCostEGP || 0), 0)
  );

  if (!materials.length) return null;

  const totalEstimated = materials.reduce((s, m) => s + (m.estimatedCostEGP || 0), 0);

  const handleItemAdded = (materialIndex, product) => {
    setCartCount((c) => c + 1);
    const mat = materials[materialIndex];
    if (mat?.estimatedCostEGP) {
      setCartTotal((t) => t + (product.price || product.price_amount || mat.estimatedCostEGP || 0));
    }
    onSessionUpdate?.({ kemetroItemsAddedToCart: cartCount + 1 });
  };

  const handleDecisionChange = async (val) => {
    setMaterialsSuppliedBy(val);
    try {
      await base44.entities.SnapSession.update(session.id, { materialsSuppliedBy: val });
    } catch { /* silent */ }
    onSessionUpdate?.({ materialsSuppliedBy: val });
  };

  const handleAddAllToCart = async () => {
    let added = 0;
    for (let i = 0; i < materials.length; i++) {
      const mat = materials[i];
      try {
        const res = await base44.functions.invoke("searchKemetroForMaterial", {
          query: mat.kemetroSearchKeywords || mat.itemName,
          limit: 1,
        });
        const top = res?.data?.results?.[0];
        if (!top) continue;

        await base44.entities.SnapMaterialCartItem.create({
          snapSessionId: session.id,
          userId: session.userId || null,
          sessionToken: session.sessionToken,
          materialIndex: i,
          itemName: mat.itemName,
          kemetroSearchKeywords: mat.kemetroSearchKeywords || mat.itemName,
          kemetroProductId: top.id,
          productName: top.name || top.title || "",
          productImageUrl: top.featured_image || top.image || "",
          productPriceEGP: top.price || top.price_amount || 0,
          quantity: mat.quantity || 1,
          addedAt: new Date().toISOString(),
          isOrdered: false,
        });
        added++;
      } catch { /* continue */ }
    }

    const newCount = cartCount + added;
    setCartCount(newCount);
    await base44.entities.SnapSession.update(session.id, {
      kemetroItemsAddedToCart: newCount,
      materialsSuppliedBy: "customer",
    });
    onSessionUpdate?.({ kemetroItemsAddedToCart: newCount });
  };

  return (
    <div className="space-y-3">
      {/* CARD 4 */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          border: "1px solid #E5E7EB",
          borderLeft: "4px solid #0A6EBD",
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <span className="text-base font-black text-gray-900">Required Parts & Materials</span>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <p className="text-[12px] text-gray-400 font-medium">
              {materials.length} {materials.length === 1 ? "item" : "items"}
            </p>
            {totalEstimated > 0 && (
              <p className="text-[12px] font-bold text-gray-600">
                Est. {Number(totalEstimated).toLocaleString()} EGP
              </p>
            )}
          </div>
        </div>

        {/* Info tip */}
        <div className="mx-4 mb-3 px-3 py-2 rounded-lg" style={{ background: "#EFF6FF" }}>
          <p className="text-[13px] text-blue-700">
            💡 Buying materials yourself can reduce contractor bids by 20–40%
          </p>
        </div>

        {/* Materials list */}
        <div className="px-4 pb-2">
          {materials.map((mat, i) => (
            <MaterialRow
              key={i}
              material={mat}
              index={i}
              session={session}
              onOpenSheet={(m, idx) => setActiveSheet({ material: m, index: idx })}
              onAdded={handleItemAdded}
            />
          ))}
        </div>
      </div>

      {/* Decision toggle */}
      <MaterialsDecisionToggle
        value={materialsSuppliedBy}
        onChange={handleDecisionChange}
        session={session}
        onAddAllToCart={handleAddAllToCart}
      />

      {/* Cart strip */}
      <MaterialsCartStrip cartCount={cartCount} totalEGP={cartTotal} />

      {/* Bottom sheet */}
      {activeSheet && (
        <MaterialSearchSheet
          material={activeSheet.material}
          materialIndex={activeSheet.index}
          session={session}
          onClose={() => setActiveSheet(null)}
          onAdded={handleItemAdded}
        />
      )}
    </div>
  );
}