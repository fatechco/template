import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const fmt = n => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));
const COLORS = ["#0d9488", "#0891b2", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6", "#22c55e", "#f97316"];
const SCENARIOS = [
  { id: "economy", label: "💰 Economy" },
  { id: "standard", label: "⭐ Standard" },
  { id: "premium", label: "💎 Premium" },
];

// ── Inline modals ────────────────────────────────────────────────────────────
function BuildShareModal({ project, onClose }) {
  const shareUrl = `${window.location.origin}/kemetro/build/${project.id}/boq`;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-900 text-lg">Share Your BOQ</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-500">✕</button>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 break-all mb-4">{shareUrl}</div>
        <button onClick={() => navigator.clipboard?.writeText(shareUrl)} className="w-full bg-teal-500 text-white font-black py-3 rounded-xl hover:bg-teal-400 transition-colors">
          📋 Copy Link
        </button>
        <p className="text-xs text-gray-400 text-center mt-3">Project: {project.projectName}</p>
      </div>
    </div>
  );
}

function BuildGroupBuyBanner({ project }) {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 flex items-center gap-4">
      <div className="text-3xl flex-shrink-0">👥</div>
      <div className="flex-1">
        <p className="font-black text-white">Group Buy Available!</p>
        <p className="text-amber-100 text-sm">Join other builders in your area for bulk discounts on flooring & tiles</p>
      </div>
      <a href="/kemetro/build/group-buy" className="bg-white text-amber-600 font-black px-4 py-2 rounded-xl text-sm hover:bg-amber-50 flex-shrink-0">Join →</a>
    </div>
  );
}

function BuildCartModal({ project, items, scenario, totals, onClose }) {
  const activeTotal = totals?.[scenario] || {};
  const grandTotal = activeTotal.grandTotal || 0;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h3 className="font-black text-gray-900 text-lg">🛒 Add to Kemetro Cart</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-500">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {items.slice(0, 10).map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-sm">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{item.itemName}</p>
                <p className="text-xs text-gray-400">{item.orderQuantity || item.netQuantity} {item.unit}</p>
              </div>
              <p className="font-black text-teal-600 flex-shrink-0">{fmt(item.totalCost?.[scenario] || item.totalCostRecommended || 0)} EGP</p>
            </div>
          ))}
          {items.length > 10 && <p className="text-xs text-gray-400 text-center py-2">+{items.length - 10} more items</p>}
        </div>
        <div className="border-t border-gray-100 pt-4 flex-shrink-0">
          <div className="flex justify-between mb-3">
            <span className="font-bold text-gray-700">Total ({items.length} items)</span>
            <span className="font-black text-teal-600 text-lg">{fmt(grandTotal)} EGP</span>
          </div>
          <button onClick={onClose} className="w-full bg-teal-500 text-white font-black py-3 rounded-xl hover:bg-teal-400 transition-colors">
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}

function BuildItemDetail({ item, scenario, onClose }) {
  const cost = item.totalCost?.[scenario] || item.totalCostRecommended || 0;
  const unitCost = item.unitCost?.[scenario] || item.unitCostRecommended || 0;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-900 text-base">{item.itemName}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-500">✕</button>
        </div>
        {item.itemDescription && <p className="text-sm text-gray-500 mb-4 leading-relaxed">{item.itemDescription}</p>}
        <div className="space-y-2 text-sm mb-4">
          {[
            ["Category", item.category],
            ["Net Quantity", `${item.netQuantity} ${item.unit}`],
            ["Order Quantity (+waste)", `${item.orderQuantity} ${item.unit}`],
            ["Waste %", `${item.wastePercent}%`],
            ["Unit Cost", `${fmt(unitCost)} EGP`],
            ["Total Cost", `${fmt(cost)} EGP`],
          ].map(([label, val]) => val ? (
            <div key={label} className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">{label}</span>
              <span className="font-bold text-gray-900">{val}</span>
            </div>
          ) : null)}
        </div>
        {item.searchKeyword && (
          <a href={`/kemetro/search?q=${encodeURIComponent(item.searchKeyword)}`} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-teal-500 text-white font-black py-3 rounded-xl hover:bg-teal-400 transition-colors">
            🔍 Find on Kemetro
          </a>
        )}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function KemetroBuildBOQ() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scenario, setScenario] = useState("standard");
  const [openSections, setOpenSections] = useState([0]);
  const [showShare, setShowShare] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [polling, setPolling] = useState(false);

  useEffect(() => { loadProject(); }, [projectId]);

  const loadProject = async () => {
    const data = await base44.entities.BuildProject.filter({ id: projectId });
    const proj = data[0];
    if (!proj) { setLoading(false); return; }
    setProject(proj);
    if (proj.boqStatus === "generating") {
      setPolling(true);
      setLoading(false);
      const timer = setInterval(async () => {
        const refreshed = await base44.entities.BuildProject.filter({ id: projectId });
        if (refreshed[0]?.boqStatus === "ready") {
          setProject(refreshed[0]);
          setPolling(false);
          clearInterval(timer);
        }
      }, 3000);
    } else {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!project) return <div className="p-8 text-center text-gray-500">Project not found</div>;

  if (polling) {
    return (
      <div className="min-h-screen bg-teal-50 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <h2 className="text-2xl font-black text-teal-800">🤖 Generating Your BOQ...</h2>
        <p className="text-teal-600">This takes about 20–30 seconds</p>
        <div className="bg-white rounded-2xl p-4 shadow-sm text-sm text-gray-500 max-w-sm text-center">Calculating material quantities, matching to Kemetro catalog, and comparing 3 budget scenarios...</div>
      </div>
    );
  }

  const boq = project.boqData || {};
  const sections = boq.boqSections || [];
  const laborItems = boq.laborItems || [];
  const totals = boq.totals || {};
  const activeTotal = totals[scenario] || {};
  const grandTotal = activeTotal.grandTotal || project.grandTotal || 0;
  const allItems = sections.flatMap(s => s.items || []);
  const matchedCount = allItems.filter(i => i.matchedProductId || i.searchKeyword).length;
  const pieData = sections.slice(0, 8).map((sec) => ({
    name: sec.sectionName,
    value: sec.items?.reduce((s, item) => s + (item.totalCost?.[scenario] || item.totalCostRecommended || 0), 0) || 0
  })).filter(d => d.value > 0);

  const toggleSection = (i) => setOpenSections(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  const toggleItem = (key, val) => setSelectedItems(p => ({ ...p, [key]: val === undefined ? !p[key] : val }));
  const selectedCount = Object.values(selectedItems).filter(Boolean).length;
  const handleAddAll = () => setShowCart(true);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Link to="/kemetro/build" className="text-teal-600 font-bold text-sm hover:underline">🏗️ Build™</Link>
            <span className="text-gray-300">/</span>
            <span className="text-xs text-gray-500 font-mono">{project.projectNumber}</span>
          </div>
          <div className="flex-1 min-w-0 text-center hidden sm:block">
            <p className="font-black text-gray-900 text-sm truncate">{project.projectName}</p>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => setShowShare(true)} className="flex items-center gap-1 border border-gray-200 text-gray-600 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50">📤 Share</button>
            <button className="flex items-center gap-1 border border-gray-200 text-gray-600 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50">⬇️ PDF</button>
            <button onClick={handleAddAll} className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-black px-4 py-2 rounded-xl text-sm transition-colors">🛒 Order All</button>
          </div>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="sticky top-[57px] z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex gap-1">
            {SCENARIOS.map(s => (
              <button key={s.id} onClick={() => setScenario(s.id)}
                className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${scenario === s.id ? "bg-teal-500 text-white" : "text-gray-500 hover:bg-gray-50"}`}>
                {s.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            {[
              { label: "Total Cost", val: fmt(grandTotal) + " EGP", sub: "Materials only", color: "text-teal-600" },
              { label: "Duration", val: "6–10 weeks", sub: "Estimated", color: "text-gray-900" },
              { label: "Items", val: `${allItems.length}`, sub: `${sections.length} categories`, color: "text-gray-900" },
              { label: "Kemetro Match", val: `${allItems.length > 0 ? Math.round(matchedCount / allItems.length * 100) : 0}%`, sub: "Items ready to order", color: "text-green-600" },
            ].map(k => (
              <div key={k.label} className="bg-gray-50 rounded-xl px-3 py-2">
                <p className={`text-lg font-black ${k.color}`}>{k.val}</p>
                <p className="text-xs text-gray-500">{k.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {allItems.some(i => (i.netQuantity || 0) >= 50 && i.category === "flooring") && (
          <BuildGroupBuyBanner project={project} />
        )}

        {pieData.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-black text-gray-900 text-lg mb-4">Budget Breakdown</h3>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-48 h-48 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={v => fmt(v) + " EGP"} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr>{["Category", "Amount", "%", "Status"].map(h => <th key={h} className="px-3 py-2 text-left text-xs font-bold text-gray-500">{h}</th>)}</tr></thead>
                  <tbody>
                    {sections.map((sec, i) => {
                      const secTotal = sec.items?.reduce((s, item) => s + (item.totalCost?.[scenario] || item.totalCostRecommended || 0), 0) || 0;
                      const pct = grandTotal > 0 ? Math.round(secTotal / grandTotal * 100) : 0;
                      return (
                        <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                          <td className="px-3 py-2 font-semibold text-gray-800 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                            {sec.sectionName}
                          </td>
                          <td className="px-3 py-2 font-bold text-gray-900">{fmt(secTotal)} EGP</td>
                          <td className="px-3 py-2 text-gray-500">{pct}%</td>
                          <td className="px-3 py-2 text-xs text-teal-600 font-bold">✅ {sec.items?.length || 0} items</td>
                        </tr>
                      );
                    })}
                    <tr className="border-t-2 border-teal-200 bg-teal-50">
                      <td className="px-3 py-2 font-black text-gray-900">TOTAL</td>
                      <td className="px-3 py-2 font-black text-teal-600 text-base">{fmt(grandTotal)} EGP</td>
                      <td className="px-3 py-2 font-black">100%</td>
                      <td className="px-3 py-2"><button onClick={handleAddAll} className="text-xs bg-teal-500 text-white font-bold px-3 py-1 rounded-lg hover:bg-teal-400">🛒 Order All</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">🛒</div>
          <div className="flex-1">
            <p className="font-black text-white text-lg">Order All {allItems.length} Materials from Kemetro</p>
            <p className="text-teal-100 text-sm">Total: {fmt(grandTotal)} EGP • {allItems.length} items</p>
            <p className="text-teal-200 text-xs">One cart • One checkout • Staged delivery</p>
          </div>
          <button onClick={handleAddAll} className="bg-white text-teal-600 font-black px-5 py-3 rounded-xl hover:bg-teal-50 transition-colors flex-shrink-0">Add All to Cart →</button>
        </div>

        <div>
          <h3 className="font-black text-gray-900 text-lg mb-3">Materials by Section</h3>
          <div className="space-y-3">
            {sections.map((sec, si) => {
              const secTotal = sec.items?.reduce((s, item) => s + (item.totalCost?.[scenario] || item.totalCostRecommended || 0), 0) || 0;
              const isOpen = openSections.includes(si);
              return (
                <div key={si} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <button onClick={() => toggleSection(si)} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
                    <span className="text-2xl">🏠</span>
                    <div className="flex-1 text-left">
                      <p className="font-black text-gray-900">{sec.sectionName}</p>
                      <p className="text-xs text-gray-400">{sec.sectionNameAr}</p>
                    </div>
                    <div className="text-right mr-2">
                      <p className="font-black text-teal-600">{fmt(secTotal)} EGP</p>
                      <p className="text-xs text-gray-400">{sec.items?.length || 0} items</p>
                    </div>
                    <span className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-gray-100 overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 w-8"><input type="checkbox" className="accent-teal-500" onChange={e => sec.items?.forEach((_, ii) => toggleItem(`${si}-${ii}`, e.target.checked))} /></th>
                            {["Item", "Qty", "Unit", "Unit Cost", "Total", "Kemetro", ""].map(h => <th key={h} className="px-3 py-2 text-left text-gray-500 font-bold">{h}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {(sec.items || []).map((item, ii) => {
                            const cost = item.totalCost?.[scenario] || item.totalCostRecommended || 0;
                            const unitCost = item.unitCost?.[scenario] || item.unitCostRecommended || 0;
                            const key = `${si}-${ii}`;
                            return (
                              <tr key={ii} className={`border-t border-gray-50 hover:bg-teal-50/30 ${selectedItems[key] ? "bg-teal-50" : ""}`}>
                                <td className="px-3 py-2"><input type="checkbox" checked={!!selectedItems[key]} onChange={() => toggleItem(key)} className="accent-teal-500" /></td>
                                <td className="px-3 py-2">
                                  <button onClick={() => setSelectedItem(item)} className="text-left hover:text-teal-600 transition-colors">
                                    <p className="font-bold text-gray-900">{item.itemName}</p>
                                    <p className="text-gray-400 text-[10px] truncate max-w-[180px]">{item.itemDescription}</p>
                                  </button>
                                </td>
                                <td className="px-3 py-2 font-bold text-gray-800">
                                  {item.orderQuantity || item.netQuantity}
                                  <p className="text-gray-400 text-[10px]">{item.netQuantity} net +{item.wastePercent}%</p>
                                </td>
                                <td className="px-3 py-2 text-gray-500">{item.unit}</td>
                                <td className="px-3 py-2 font-bold text-gray-800">{fmt(unitCost)}</td>
                                <td className="px-3 py-2 font-black text-teal-600">{fmt(cost)} EGP</td>
                                <td className="px-3 py-2">
                                  {item.searchKeyword ? (
                                    <a href={`/kemetro/search?q=${encodeURIComponent(item.searchKeyword)}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-teal-600 font-bold hover:underline whitespace-nowrap">🔍 View</a>
                                  ) : <span className="text-[10px] text-gray-400">—</span>}
                                </td>
                                <td className="px-3 py-2">
                                  <button onClick={() => toggleItem(key, true)} className="text-[10px] bg-teal-500 text-white font-bold px-2 py-1 rounded-lg hover:bg-teal-400">+ Cart</button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {boq.savingTips?.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
            <h3 className="font-black text-yellow-800 mb-3">💡 Money-Saving Tips</h3>
            <ul className="space-y-2">
              {boq.savingTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-yellow-700"><span className="text-yellow-500 flex-shrink-0 mt-0.5">•</span> {tip}</li>
              ))}
            </ul>
          </div>
        )}

        {project.includeLabor && laborItems.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-black text-gray-900 text-lg mb-2">👷 Labor Cost Estimates</h3>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 text-xs text-orange-700">⚠️ Labor rates are estimates only. Hire via Kemework for verified professionals.</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>{["Trade", "Scope", "Days", "Rate/Day", "Total", ""].map(h => <th key={h} className="px-3 py-2 text-left text-xs font-bold text-gray-500">{h}</th>)}</tr></thead>
                <tbody>
                  {laborItems.map((l, i) => {
                    const cap = scenario.charAt(0).toUpperCase() + scenario.slice(1);
                    const total = l[`total${cap}`] || l.totalStandard || 0;
                    const rate = l[`rate${cap}`] || l.rateStandard || 0;
                    return (
                      <tr key={i} className="border-t border-gray-50">
                        <td className="px-3 py-2 font-bold text-gray-900">{l.trade}</td>
                        <td className="px-3 py-2 text-gray-600 text-xs">{l.description}</td>
                        <td className="px-3 py-2 text-gray-600">{l.estimatedDays}</td>
                        <td className="px-3 py-2 text-gray-600">{fmt(rate)}</td>
                        <td className="px-3 py-2 font-black text-blue-600">{fmt(total)} EGP</td>
                        <td className="px-3 py-2"><a href="/kemework/find-professionals" target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 font-bold hover:underline">Hire →</a></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {boq.projectNotes && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-black text-teal-700 text-lg mb-3">🤖 AI Project Notes</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{boq.projectNotes}</p>
            {boq.criticalItems?.length > 0 && (
              <div className="mt-4">
                <p className="font-bold text-gray-800 text-sm mb-2">⚠️ Critical Reminders:</p>
                <ul className="space-y-1">{boq.criticalItems.map((c, i) => <li key={i} className="text-xs text-gray-600 flex items-start gap-2"><span className="text-red-500">•</span>{c}</li>)}</ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-gray-500">Selected: {selectedCount} items</p>
            <p className="font-black text-gray-900">{fmt(grandTotal)} EGP total</p>
          </div>
          <button onClick={() => setShowShare(true)} className="border border-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl text-sm hover:bg-gray-50">⬇️ PDF</button>
          <button onClick={() => setShowShare(true)} className="border border-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl text-sm hover:bg-gray-50">📤 Share</button>
          <button onClick={handleAddAll} className="bg-teal-500 hover:bg-teal-400 text-white font-black px-6 py-2 rounded-xl text-sm transition-colors">🛒 Add to Cart</button>
        </div>
      </div>

      {showShare && <BuildShareModal project={project} boq={boq} totals={totals} onClose={() => setShowShare(false)} />}
      {showCart && <BuildCartModal project={project} items={allItems} scenario={scenario} totals={totals} onClose={() => setShowCart(false)} />}
      {selectedItem && <BuildItemDetail item={selectedItem} scenario={scenario} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}