import { useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, ExternalLink, Sparkles, BarChart2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

function fmt(n) { return new Intl.NumberFormat("en-EG").format(Math.round(n || 0)); }

const GRADE_COLORS = {
  "A+": "text-green-600 bg-green-100",
  "A": "text-green-600 bg-green-100",
  "B+": "text-blue-600 bg-blue-100",
  "B": "text-blue-600 bg-blue-100",
  "C": "text-yellow-600 bg-yellow-100",
};

export default function FinishTabValuation({ project }) {
  const [generating, setGenerating] = useState(false);
  const [valuation, setValuation] = useState(null);

  const completion = project.completionPercent || 0;
  const isComplete = completion >= 85;

  const handleGenerateValuation = async () => {
    setGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a real estate investment analyst specializing in the Egyptian market. Generate a post-finishing valuation analysis for this property:

Property: ${project.propertyType || "apartment"}, ${project.totalAreaSqm || 100}m², ${project.propertyAddress || "Cairo"}
Finishing: ${project.finishingLevel || "standard"} level, ${project.designStyle || "modern"} style
Budget spent: ${fmt(project.estimatedBudget || 500000)} EGP on finishing
Project completion: ${completion}%

Provide realistic Egyptian market estimates:`,
      response_json_schema: {
        type: "object",
        properties: {
          beforeValuePerSqm: { type: "number" },
          afterValuePerSqm: { type: "number" },
          beforeTotalValue: { type: "number" },
          afterTotalValue: { type: "number" },
          valueIncrease: { type: "number" },
          valueIncreasePercent: { type: "number" },
          investmentGradeBelow: { type: "string" },
          investmentGradeAfter: { type: "string" },
          roiPercent: { type: "number" },
          rentalYieldBefore: { type: "number" },
          rentalYieldAfter: { type: "number" },
          monthsToBreakEven: { type: "number" },
          marketPosition: { type: "string" },
          negotiatingAdvantage: { type: "string" },
          keyStrengths: { type: "array", items: { type: "string" } },
          suggestedListingPrice: { type: "number" },
          suggestedRentalPrice: { type: "number" },
          comparableProperties: { type: "array", items: { type: "object", properties: { description: { type: "string" }, pricePerSqm: { type: "number" } } } },
        }
      }
    });
    setValuation(result);
    setGenerating(false);
  };

  if (!isComplete) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h3 className="font-black text-gray-900 mb-2">Valuation Available After 85% Completion</h3>
        <p className="text-sm text-gray-500 mb-4">Project is currently {completion}% complete. Continue the finishing work to unlock AI-powered valuation analysis.</p>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden max-w-xs mx-auto">
          <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${completion}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">{completion}% / 85% needed</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl p-5 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp size={20} />
          </div>
          <div className="flex-1">
            <p className="font-black text-lg">Post-Finish Property Valuation</p>
            <p className="text-green-200 text-xs mt-0.5">Powered by Kemedar Predict™</p>
          </div>
        </div>
      </div>

      {!valuation ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
          <Sparkles size={32} className="text-green-600 mx-auto mb-3" />
          <h3 className="font-black text-gray-900 mb-2">Generate AI Valuation Report</h3>
          <p className="text-sm text-gray-500 mb-4">Get your property's new estimated value after finishing, investment grade, ROI, and optimal listing price.</p>
          <button
            onClick={handleGenerateValuation}
            disabled={generating}
            className="bg-green-600 hover:bg-green-700 text-white font-black px-6 py-3 rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center gap-2 mx-auto"
          >
            {generating ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
            ) : (
              <><Sparkles size={16} /> Generate Valuation</>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">

          {/* Value comparison */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="font-black text-gray-900 mb-4">📈 Value Before vs After</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Before Finishing</p>
                <p className="text-xl font-black text-gray-600">{fmt(valuation.beforeTotalValue)} EGP</p>
                <p className="text-xs text-gray-400">{fmt(valuation.beforeValuePerSqm)} EGP/m²</p>
                <span className={`inline-block mt-2 text-xs font-black px-2 py-0.5 rounded-full ${GRADE_COLORS[valuation.investmentGradeBelow] || "text-gray-600 bg-gray-100"}`}>
                  Grade {valuation.investmentGradeBelow}
                </span>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                <p className="text-xs text-green-600 mb-1 font-bold">After Finishing ✨</p>
                <p className="text-xl font-black text-green-700">{fmt(valuation.afterTotalValue)} EGP</p>
                <p className="text-xs text-green-500">{fmt(valuation.afterValuePerSqm)} EGP/m²</p>
                <span className={`inline-block mt-2 text-xs font-black px-2 py-0.5 rounded-full ${GRADE_COLORS[valuation.investmentGradeAfter] || "text-green-600 bg-green-100"}`}>
                  Grade {valuation.investmentGradeAfter}
                </span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
              <TrendingUp size={20} className="text-green-600 flex-shrink-0" />
              <div>
                <p className="font-black text-green-800">+{fmt(valuation.valueIncrease)} EGP value added ({valuation.valueIncreasePercent?.toFixed(1)}% increase)</p>
                <p className="text-xs text-green-600">ROI: {valuation.roiPercent?.toFixed(1)}% · Breakeven in {valuation.monthsToBreakEven} months</p>
              </div>
            </div>
          </div>

          {/* Investment metrics */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="font-black text-gray-900 mb-4">💰 Investment Metrics</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Rental Yield Before", val: `${valuation.rentalYieldBefore?.toFixed(1)}%`, sub: "per year", color: "text-gray-600" },
                { label: "Rental Yield After", val: `${valuation.rentalYieldAfter?.toFixed(1)}%`, sub: "per year", color: "text-green-600" },
                { label: "ROI on Finishing", val: `${valuation.roiPercent?.toFixed(0)}%`, sub: "return", color: "text-blue-600" },
                { label: "Break-Even", val: `${valuation.monthsToBreakEven}mo`, sub: "months", color: "text-purple-600" },
              ].map(m => (
                <div key={m.label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className={`text-2xl font-black ${m.color}`}>{m.val}</p>
                  <p className="text-xs text-gray-500">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key strengths */}
          {valuation.keyStrengths?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="font-black text-gray-900 mb-3">✅ Value-Adding Factors</p>
              <div className="space-y-2">
                {valuation.keyStrengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 font-bold flex-shrink-0">✓</span>
                    <span className="text-gray-700">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Negotiate advantage */}
          {valuation.negotiatingAdvantage && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-5">
              <p className="font-black text-blue-900 mb-2 flex items-center gap-2">
                <BarChart2 size={16} /> Kemedar Negotiate™ Position
              </p>
              <p className="text-sm text-blue-800">{valuation.negotiatingAdvantage}</p>
              <p className="text-xs text-blue-600 mt-2">{valuation.marketPosition}</p>
            </div>
          )}

          {/* Comparable properties */}
          {valuation.comparableProperties?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="font-black text-gray-900 mb-3">🏘️ Market Comparables</p>
              <div className="space-y-2">
                {valuation.comparableProperties.map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-xs text-gray-600">{c.description}</span>
                    <span className="text-xs font-bold text-gray-900">{fmt(c.pricePerSqm)} EGP/m²</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested listing */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-5">
            <p className="font-black text-lg">🏠 Ready to List?</p>
            <p className="text-orange-100 text-sm mt-1 mb-3">Suggested listing price: <span className="font-black text-white">{fmt(valuation.suggestedListingPrice)} EGP</span></p>
            {valuation.suggestedRentalPrice && (
              <p className="text-orange-100 text-sm mb-3">Suggested rental: <span className="font-black text-white">{fmt(valuation.suggestedRentalPrice)} EGP/month</span></p>
            )}
            <div className="flex gap-2 flex-wrap">
              <Link to="/kemedar/add/property" className="flex items-center gap-1 bg-white text-orange-600 font-black px-4 py-2 rounded-xl text-xs hover:bg-orange-50 transition-colors">
                + List Property <ExternalLink size={10} />
              </Link>
              <Link to="/kemedar/negotiate" className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors">
                📊 Negotiate™ Strategy
              </Link>
              <Link to="/kemedar/predict" className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors">
                📈 Full Predict™ Report
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}