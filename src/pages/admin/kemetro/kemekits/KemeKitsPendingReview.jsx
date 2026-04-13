import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const CHECKLIST_ITEMS = [
  "Hero image is high quality",
  "Design description is informative",
  "All essential items have correct rules",
  "Quantities look realistic for room size",
  "Prices are reasonable",
  "No inappropriate or copyrighted content",
];

function ReviewCard({ kit, onDecision }) {
  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState({});
  const [feedback, setFeedback] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [view, setView] = useState("details"); // details | reject | feedback
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    base44.entities.KemeKitItem.filter({ templateId: kit.id }, "displayOrder", 50).then(setItems);
  }, [kit.id]);

  const handle = async (type) => {
    setLoading(true);
    const updates = {
      approve: { status: "active", approvedAt: new Date().toISOString(), publishedAt: new Date().toISOString() },
      reject: { status: "rejected", rejectionReason: rejectReason },
      feedback: { rejectionReason: feedback },
    };
    await base44.entities.KemeKitTemplate.update(kit.id, updates[type]);
    onDecision(kit.id);
  };

  const hasRuleMissing = items.some(i => !i.calculationRule);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Top Row */}
      <div className="flex gap-5 p-5 border-b border-gray-100">
        <div className="w-40 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {kit.heroImageUrl && <img src={kit.heroImageUrl} alt="" className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-black text-gray-900 mb-1">{kit.title}</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold capitalize">{kit.roomType?.replace("_", " ")}</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold capitalize">{kit.styleCategory}</span>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold capitalize">{kit.budgetTier}</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Designer: <strong>{kit.creatorName}</strong></p>
          {kit.created_date && (
            <p className="text-xs text-gray-400">Submitted: {new Date(kit.created_date).toLocaleString()}</p>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="p-5 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-sm mb-3">Products ({items.length})</h3>
        {hasRuleMissing && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-3 py-2 rounded-lg mb-3">
            ⚠️ Some items are missing a calculation rule
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="text-left py-2 pr-4">Product</th>
                <th className="text-left py-2 pr-4">Role</th>
                <th className="text-left py-2 pr-4">Rule</th>
                <th className="text-left py-2 pr-4">Coverage</th>
                <th className="text-left py-2 pr-4">Waste %</th>
                <th className="text-left py-2 pr-4">Fixed Qty</th>
                <th className="text-left py-2">Optional?</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className={`border-b border-gray-50 ${!item.calculationRule ? "bg-red-50" : ""}`}>
                  <td className="py-2 pr-4 font-semibold text-gray-800 max-w-[160px]">
                    <p className="truncate">{item.productName}</p>
                    <p className="text-gray-400">{(item.productPriceEGP || 0).toLocaleString()} EGP</p>
                  </td>
                  <td className="py-2 pr-4 text-gray-600 capitalize">{item.role?.replace(/_/g, " ")}</td>
                  <td className="py-2 pr-4">
                    {item.calculationRule
                      ? <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">{item.calculationRule}</span>
                      : <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">⚠️ Missing</span>}
                  </td>
                  <td className="py-2 pr-4 text-gray-600">{item.coveragePerUnit ? `${item.coveragePerUnit} ${item.coverageUnit || ""}` : "—"}</td>
                  <td className="py-2 pr-4 text-gray-600">{item.wasteMarginPercent ?? "—"}%</td>
                  <td className="py-2 pr-4 text-gray-600">{item.fixedQuantity ?? "—"}</td>
                  <td className="py-2 text-gray-600">{item.isOptional ? "✅ Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Calculator Preview */}
      <div className="p-5 border-b border-gray-100 bg-gray-50">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          📐 Live Preview — Standard 3×2×2.8m room
        </p>
        <div className="space-y-1">
          {items.slice(0, 6).map(item => (
            <div key={item.id} className="flex justify-between text-xs text-gray-600">
              <span className="truncate mr-4">{item.productName}</span>
              <span className="font-semibold text-gray-800 flex-shrink-0">
                — {(item.productPriceEGP || 0).toLocaleString()} EGP
              </span>
            </div>
          ))}
          {items.length > 6 && <p className="text-xs text-gray-400">+{items.length - 6} more items...</p>}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-sm font-black text-gray-900">
          <span>Estimated Total</span>
          <span className="text-blue-600">
            {items.reduce((s, i) => s + (i.productPriceEGP || 0), 0).toLocaleString()} EGP
          </span>
        </div>
      </div>

      {/* Checklist */}
      <div className="p-5 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-sm mb-3">Admin Review Checklist</h3>
        <div className="grid grid-cols-2 gap-2">
          {CHECKLIST_ITEMS.map((item, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={e => setChecked(p => ({ ...p, [i]: e.target.checked }))}
                className="w-4 h-4 accent-green-600"
              />
              <span className="text-sm text-gray-700">{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Decision */}
      <div className="p-5">
        {view === "details" && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handle("approve")}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-xl text-sm"
            >
              ✅ Approve & Publish
            </button>
            <button onClick={() => setView("feedback")} className="flex-1 border-2 border-gray-300 text-gray-700 font-black py-3 rounded-xl text-sm hover:border-gray-400">
              ✏️ Request Changes
            </button>
            <button onClick={() => setView("reject")} className="flex-1 border-2 border-red-300 text-red-600 font-black py-3 rounded-xl text-sm hover:border-red-400">
              ❌ Reject
            </button>
          </div>
        )}
        {view === "feedback" && (
          <div className="space-y-3">
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              rows={3}
              placeholder="Feedback for the designer..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400"
            />
            <div className="flex gap-3">
              <button onClick={() => setView("details")} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={() => handle("feedback")} disabled={!feedback || loading} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2.5 rounded-xl text-sm">
                Send Feedback
              </button>
            </div>
          </div>
        )}
        {view === "reject" && (
          <div className="space-y-3">
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Rejection reason (required)..."
              className="w-full border border-red-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400"
            />
            <div className="flex gap-3">
              <button onClick={() => setView("details")} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={() => handle("reject")} disabled={!rejectReason || loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm">
                Reject Kit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function KemeKitsPendingReview() {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.KemeKitTemplate.filter({ status: "pending_approval" }, "created_date", 50).then(data => {
      setKits(data);
      setLoading(false);
    });
  }, []);

  const handleDecision = (id) => setKits(prev => prev.filter(k => k.id !== id));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-black text-gray-900">Pending Review</h1>
        {kits.length > 0 && (
          <span className="bg-red-500 text-white text-sm font-black w-7 h-7 rounded-full flex items-center justify-center">
            {kits.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />)}
        </div>
      ) : kits.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">✅</p>
          <p className="font-bold text-gray-600">All caught up! No kits pending review.</p>
        </div>
      ) : (
        kits.map(kit => (
          <ReviewCard key={kit.id} kit={kit} onDecision={handleDecision} />
        ))
      )}
    </div>
  );
}