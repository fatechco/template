import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronDown, ChevronRight, ShoppingCart, Edit3, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#eab308", "#a855f7"];

function fmt(n) { return new Intl.NumberFormat("en-EG").format(Math.round(n || 0)); }

export default function FinishBOQPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [boq, setBOQ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState([0]);
  const [activeScenario, setActiveScenario] = useState(0);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    Promise.all([
      base44.entities.FinishProject.filter({ id: projectId }),
      base44.entities.FinishBOQ.filter({ projectId }),
    ]).then(([ps, bs]) => {
      setProject(ps[0]);
      setBOQ(bs[0]);
      setLoading(false);
    });
  }, [projectId]);

  const handleApprove = async () => {
    setApproving(true);
    await base44.entities.FinishBOQ.update(boq.id, { isApproved: true, approvedAt: new Date().toISOString() });
    await base44.entities.FinishProject.update(projectId, { boqStatus: "approved", status: "materials_ordered" });
    // Auto-create a Kemetro bulk material order from BOQ sections
    if (boq?.sections?.length > 0) {
      const allItems = boq.sections.flatMap(sec => (sec.items || []).map(item => ({
        productName: item.itemName,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitCostRecommended,
        totalPrice: item.totalCost,
      })));
      await base44.entities.FinishMaterialOrder.create({
        projectId,
        orderNumber: `KMO-${Date.now()}`,
        items: allItems,
        totalAmount: boq.totalMaterialsCost || 0,
        deliveryAddress: project?.propertyAddress,
        deliveryStatus: "not_ordered",
        paymentStatus: "pending",
      });
    }
    navigate(`/kemedar/finish/${projectId}`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!project) return <div className="p-8 text-center text-gray-500">Project not found</div>;

  const sections = boq?.sections || [];
  const laborItems = boq?.laborItems || [];
  const scenarios = boq?.scenarios || [];
  const totalMat = boq?.totalMaterialsCost || 0;
  const totalLab = boq?.totalLaborCost || 0;
  const contingency = boq?.contingencyAmount || 0;
  const platformFee = boq?.platformFeeAmount || 0;
  const grand = boq?.grandTotal || (totalMat + totalLab + contingency + platformFee);

  const pieData = [
    { name: "Materials", value: totalMat },
    { name: "Labor", value: totalLab },
    { name: "Contingency", value: contingency },
    { name: "Platform Fee", value: platformFee },
  ].filter(d => d.value > 0);

  const budgetOk = project.estimatedBudget >= grand * 0.9;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link to={`/kemedar/finish/${projectId}`} className="text-gray-400 hover:text-gray-600">‹</Link>
          <div className="flex-1">
            <p className="text-xs text-gray-400">📋 Bill of Quantities</p>
            <h1 className="font-black text-gray-900">{project.projectName}</h1>
            <p className="text-xs text-gray-400">#{project.projectNumber}</p>
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${boq?.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            {boq?.isApproved ? "✅ Approved" : "⏳ Pending Review"}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">

        {/* Scenario selector */}
        {scenarios.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Scenarios</p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {scenarios.map((sc, i) => (
                <button key={i} onClick={() => setActiveScenario(i)} className={`flex-shrink-0 rounded-2xl border-2 p-4 text-left w-48 transition-all ${activeScenario === i ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white"}`}>
                  <p className="font-black text-gray-900 text-sm">{sc.scenarioName || sc.finishingLevel}</p>
                  <p className="text-xl font-black text-orange-600 mt-1">{fmt(sc.grandTotal)} EGP</p>
                  <p className="text-xs text-gray-500 mt-1">{sc.description?.substring(0, 60)}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Budget overview */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Donut chart */}
            <div className="w-full sm:w-40 h-40 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={v => fmt(v) + " EGP"} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Breakdown */}
            <div className="flex-1">
              <p className="font-black text-gray-900 mb-3">Budget Breakdown</p>
              {[
                { label: "Materials", val: totalMat, color: "text-orange-600" },
                { label: "Labor", val: totalLab, color: "text-blue-600" },
                { label: "Contingency (10%)", val: contingency, color: "text-green-600" },
                { label: "Platform Fee (5%)", val: platformFee, color: "text-yellow-600" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <span className={`text-sm font-bold ${item.color}`}>{fmt(item.val)} EGP</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 mt-1">
                <span className="font-black text-gray-900">TOTAL</span>
                <span className="font-black text-orange-600 text-xl">{fmt(grand)} EGP</span>
              </div>
              <div className={`mt-2 text-xs font-bold ${budgetOk ? "text-green-600" : "text-red-600"}`}>
                {budgetOk ? `✅ Within budget (${fmt(project.estimatedBudget)} EGP)` : `⚠️ Over budget by ${fmt(grand - project.estimatedBudget)} EGP`}
              </div>
            </div>
          </div>
        </div>

        {/* BOQ Sections */}
        <div>
          <p className="font-black text-gray-900 mb-3">📦 Materials by Room</p>
          {sections.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
              <p className="text-4xl mb-2">🤖</p>
              <p className="font-bold">BOQ is being generated...</p>
              <p className="text-sm">This may take a moment. Refresh to check progress.</p>
            </div>
          ) : sections.map((sec, si) => (
            <div key={si} className="bg-white rounded-2xl border border-gray-100 mb-3 overflow-hidden">
              <button
                onClick={() => setOpenSections(p => p.includes(si) ? p.filter(x => x !== si) : [...p, si])}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
              >
                <span className="text-xl">🏠</span>
                <div className="flex-1 text-left">
                  <p className="font-black text-gray-900 text-sm">{sec.sectionName}</p>
                  <p className="text-xs text-gray-400">{sec.items?.length || 0} items</p>
                </div>
                <span className="font-black text-orange-600">{fmt(sec.items?.reduce((s, i) => s + (i.totalCost || 0), 0))} EGP</span>
                {openSections.includes(si) ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
              </button>

              {openSections.includes(si) && (
                <div className="border-t border-gray-100 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2 text-gray-500 font-bold">Item</th>
                        <th className="text-right px-2 py-2 text-gray-500 font-bold">Qty</th>
                        <th className="text-right px-2 py-2 text-gray-500 font-bold">Unit</th>
                        <th className="text-right px-2 py-2 text-gray-500 font-bold">Unit Cost</th>
                        <th className="text-right px-4 py-2 text-gray-500 font-bold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(sec.items || []).map((item, ii) => (
                        <tr key={ii} className="border-t border-gray-50 hover:bg-orange-50/30">
                          <td className="px-4 py-2.5">
                            <p className="font-bold text-gray-900">{item.itemName}</p>
                            {item.description && <p className="text-gray-400 text-[10px]">{item.description}</p>}
                          </td>
                          <td className="text-right px-2 py-2.5 font-bold text-gray-700">{item.quantity}</td>
                          <td className="text-right px-2 py-2.5 text-gray-500">{item.unit}</td>
                          <td className="text-right px-2 py-2.5 text-gray-700">{fmt(item.unitCostRecommended)}</td>
                          <td className="text-right px-4 py-2.5 font-black text-orange-600">{fmt(item.totalCost)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Labor */}
        {laborItems.length > 0 && (
          <div>
            <p className="font-black text-gray-900 mb-3">👷 Labor Estimate</p>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 text-gray-500 font-bold">Trade</th>
                    <th className="text-right px-2 py-2 text-gray-500 font-bold">Days</th>
                    <th className="text-right px-2 py-2 text-gray-500 font-bold">Daily Rate</th>
                    <th className="text-right px-4 py-2 text-gray-500 font-bold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {laborItems.map((item, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="px-4 py-2.5">
                        <p className="font-bold text-gray-900">{item.tradeType}</p>
                        <p className="text-gray-400 text-[10px]">{item.description}</p>
                      </td>
                      <td className="text-right px-2 py-2.5 font-bold text-gray-700">{item.estimatedDays}</td>
                      <td className="text-right px-2 py-2.5 text-gray-500">{fmt(item.dailyRateRecommended)} EGP</td>
                      <td className="text-right px-4 py-2.5 font-black text-blue-600">{fmt(item.totalCost)} EGP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Sticky approval bar */}
      {!boq?.isApproved && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-5xl mx-auto px-4 py-2 flex gap-3 text-[10px] text-gray-400 border-b border-gray-100">
            <span>✅ Approving will:</span>
            <span>🛒 Create Kemetro bulk order</span>
            <span>👷 Open Kemework hiring</span>
            <span>🔒 Initialize Escrow™</span>
          </div>
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-500">Total Project Cost</p>
              <p className="font-black text-orange-600 text-xl">{fmt(grand)} EGP</p>
            </div>
            <button className="px-4 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl text-sm">
              ✏️ Request Changes
            </button>
            <button
              onClick={handleApprove}
              disabled={approving}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {approving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
              Approve BOQ & Start Project
            </button>
          </div>
        </div>
      )}

      {boq?.isApproved && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex items-center justify-center gap-3 shadow-lg">
          <Link to={`/kemedar/finish/${projectId}`} className="px-5 py-3 bg-orange-500 text-white font-black rounded-xl text-sm flex items-center gap-2">
            <ShoppingCart size={16} /> Go to Project Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}