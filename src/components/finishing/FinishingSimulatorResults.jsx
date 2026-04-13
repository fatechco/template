import { useState } from "react";
import { Download, Share2, Heart, Sparkles, Zap, ShoppingCart, Crown, Loader2, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import LoginPromptModal from "@/components/rbac/LoginPromptModal";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

function fmt(n) {
  return n ? Math.round(n).toLocaleString() : "—";
}

export default function FinishingSimulatorResults({ simulation, property, onClose }) {
  const { user, isAuthenticated } = useAuth();
  const [showLoginFor, setShowLoginFor] = useState(null); // 'kemework' | 'kemetro' | 'turnkey' | 'save'
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const costData = [
    { name: "Materials", value: simulation.estimatedMaterialsCost, color: "#0077B6" },
    { name: "Labor", value: simulation.estimatedLaborCost, color: "#2D6A4F" },
  ];

  // Track event
  const trackEvent = (action) => {
    base44.analytics.track({
      eventName: "finishing_simulator_action",
      properties: {
        action,
        simulationId: simulation.id,
        estimatedCost: simulation.estimatedTotalMin,
        userId: user?.id
      }
    }).catch(() => {});
  };

  const handleSaveEstimate = async () => {
    if (!isAuthenticated) {
      setShowLoginFor("save");
      return;
    }
    setLoading(true);
    trackEvent("saved_estimate");
    setSaved(true);
    setSuccessMsg("Estimate saved to your dashboard!");
    setTimeout(() => setSuccessMsg(""), 3000);
    setLoading(false);
  };

  const handleDownloadPDF = async () => {
    trackEvent("downloaded_pdf");
    try {
      setLoading(true);
      const res = await base44.functions.invoke("generateFinishingEstimatePDF", {
        simulationId: simulation.id
      });
      // Trigger download
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "finishing-estimate.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF download failed", e);
    } finally {
      setLoading(false);
    }
  };

  const handleKemeworkRedirect = async () => {
    if (!isAuthenticated) {
      setShowLoginFor("kemework");
      return;
    }
    trackEvent("redirected_kemework");
    setLoading(true);
    try {
      const res = await base44.functions.invoke("redirectToKemeworkTask", {
        simulationId: simulation.id
      });
      // Store prefill data in localStorage for post-task page to pick up
      localStorage.setItem("kemework_task_prefill", JSON.stringify(res.data.prefillData));
      window.location.href = "/kemework/post-task";
    } catch (e) {
      console.error("Redirect failed", e);
    } finally {
      setLoading(false);
    }
  };

  const handleKemetroRedirect = async () => {
    if (!isAuthenticated) {
      setShowLoginFor("kemetro");
      return;
    }
    trackEvent("redirected_kemetro");
    setLoading(true);
    try {
      const res = await base44.functions.invoke("redirectToKemetroRFQ", {
        simulationId: simulation.id
      });
      localStorage.setItem("kemetro_rfq_prefill", JSON.stringify(res.data.prefillData));
      window.location.href = "/m/kemetro/buyer/rfqs/create";
    } catch (e) {
      console.error("Redirect failed", e);
    } finally {
      setLoading(false);
    }
  };

  const handleTurnkeyRequest = async () => {
    if (!isAuthenticated) {
      setShowLoginFor("turnkey");
      return;
    }
    trackEvent("requested_turnkey");
    setLoading(true);
    try {
      await base44.functions.invoke("notifyTurnkeyLead", {
        simulationId: simulation.id
      });
      setSuccessMsg("✅ Turnkey request sent! A Kemedar engineer will contact you soon.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (e) {
      console.error("Turnkey request failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Success Messages */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2">
          <CheckCircle size={16} /> {successMsg}
        </div>
      )}

      {/* HERO CARD — Total Cost */}
      <div className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] text-white rounded-xl p-6 shadow-lg">
        <p className="text-sm opacity-80 mb-1">Total Estimated Finishing Cost</p>
        <p className="text-4xl font-black mb-3">
          {simulation.currencyId || "EGP"} {fmt(simulation.estimatedTotalMin)} — {fmt(simulation.estimatedTotalMax)}
        </p>
        <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2 w-fit">
          <span className="text-xs font-semibold">⏱️ Timeline:</span>
          <span className="font-bold">{simulation.estimatedWeeksMin}–{simulation.estimatedWeeksMax} weeks</span>
        </div>
      </div>

      {/* AI Design Advice */}
      {simulation.aiDesignAdvice && (
        <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Sparkles className="text-yellow-500 flex-shrink-0 mt-1" size={18} />
            <p className="text-sm text-gray-700 italic leading-relaxed">{simulation.aiDesignAdvice}</p>
          </div>
        </div>
      )}

      {/* Cost Breakdown Chart */}
      <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm">
        <h3 className="font-black text-gray-900 mb-4">Cost Breakdown</h3>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 min-w-[250px] h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {costData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {costData.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{(simulation.currencyId || "EGP")} {fmt(item.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bill of Quantities Accordion */}
      {simulation.aiGeneratedBoQ && Array.isArray(simulation.aiGeneratedBoQ) && (
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 font-black text-gray-900">
            Bill of Quantities
          </div>
          <div className="divide-y divide-gray-100">
            {simulation.aiGeneratedBoQ.map((item, idx) => (
              <details key={idx} className="p-5 cursor-pointer hover:bg-gray-50">
                <summary className="flex justify-between items-center font-semibold text-gray-900">
                  <span>{item.category}</span>
                  <span className="text-sm font-bold text-gray-500">
                    {simulation.currencyId || "EGP"} {fmt(item.materialCost + item.laborCost)}
                  </span>
                </summary>
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p>{item.description}</p>
                  <div className="flex gap-6 text-xs font-semibold pt-2 border-t border-gray-100">
                    <span>🛒 Materials: {simulation.currencyId || "EGP"} {fmt(item.materialCost)}</span>
                    <span>🔧 Labor: {simulation.currencyId || "EGP"} {fmt(item.laborCost)}</span>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Synergy CTAs */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <p className="text-sm font-black text-gray-600 uppercase tracking-wide">Bring this to life:</p>

        {/* Kemework CTA */}
        <div className="bg-[#EDFAF1] border-l-4 border-[#2D6A4F] rounded-lg p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-[#2D6A4F] rounded-lg flex items-center justify-center text-white font-black flex-shrink-0">
              🔧
            </div>
            <div className="flex-1">
              <p className="font-black text-gray-900">Hire a Finishing Company</p>
              <p className="text-xs text-gray-600 mt-0.5">
                Post this Bill of Quantities as a task and receive competitive bids.
              </p>
            </div>
          </div>
          <button
            onClick={handleKemeworkRedirect}
            disabled={loading}
            className="w-full bg-[#2D6A4F] hover:bg-[#1f4a37] disabled:opacity-50 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
            Post Task on Kemework
          </button>
        </div>

        {/* Kemetro CTA */}
        <div className="bg-[#EFF7FF] border-l-4 border-[#0077B6] rounded-lg p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-[#0077B6] rounded-lg flex items-center justify-center text-white font-black flex-shrink-0">
              🛒
            </div>
            <div className="flex-1">
              <p className="font-black text-gray-900">Source Materials at Wholesale</p>
              <p className="text-xs text-gray-600 mt-0.5">
                Send this shopping list to Kemetro suppliers as an RFQ for bulk discounts.
              </p>
            </div>
          </div>
          <button
            onClick={handleKemetroRedirect}
            disabled={loading}
            className="w-full border-2 border-[#0077B6] text-[#0077B6] hover:bg-blue-50 disabled:opacity-50 font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
            Post RFQ on Kemetro
          </button>
        </div>

        {/* Turnkey CTA */}
        <div className="bg-[#FFFAF0] border-l-4 border-[#D97706] rounded-lg p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-[#D97706] rounded-lg flex items-center justify-center text-white font-black flex-shrink-0">
              👑
            </div>
            <div className="flex-1">
              <p className="font-black text-gray-900">Kemedar Turnkey Service</p>
              <p className="text-xs text-gray-600 mt-0.5">
                Our engineers execute the entire project end-to-end with guaranteed quality.
              </p>
            </div>
          </div>
          <button
            onClick={handleTurnkeyRequest}
            disabled={loading}
            className="w-full bg-[#D97706] hover:bg-[#B45309] disabled:opacity-50 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Crown size={14} />}
            Request Turnkey Service
          </button>
        </div>
      </div>

      {/* Floating Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={handleSaveEstimate}
          disabled={loading || saved}
          className={`flex-1 flex items-center justify-center gap-2 font-bold py-2.5 rounded-lg text-sm transition-all ${
            saved
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          {saved ? <CheckCircle size={14} /> : <Heart size={14} />}
          {saved ? "Saved" : "Save Estimate"}
        </button>
        <button
          onClick={handleDownloadPDF}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-2.5 rounded-lg text-sm transition-colors"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          Download PDF
        </button>
      </div>

      {/* Login Modal */}
      {showLoginFor && !isAuthenticated && (
        <LoginPromptModal
          title="Save Your Estimate"
          message="Create a free account to save this estimate and post tasks to contractors."
          onClose={() => setShowLoginFor(null)}
          onSuccess={() => {
            setShowLoginFor(null);
            if (showLoginFor === "kemework") handleKemeworkRedirect();
            else if (showLoginFor === "kemetro") handleKemetroRedirect();
            else if (showLoginFor === "turnkey") handleTurnkeyRequest();
            else if (showLoginFor === "save") handleSaveEstimate();
          }}
        />
      )}
    </div>
  );
}