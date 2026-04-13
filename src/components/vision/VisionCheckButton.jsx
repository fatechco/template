import { useState } from "react";
import { Sparkles, X, CheckCircle, AlertTriangle, Clock, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";

/**
 * Reusable "Check with Kemedar Vision™" button + result panel.
 * Pass `imageUrls` (array of strings) and optionally `propertyId`.
 */
export default function VisionCheckButton({ imageUrls = [], propertyId = null }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const hasImages = imageUrls.filter(Boolean).length > 0;

  const runCheck = async () => {
    if (!hasImages) return;
    setOpen(true);
    setLoading(true);

    try {
      const urls = imageUrls.filter(Boolean).slice(0, 8);

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Kemedar Vision™, an AI real estate photo quality analyzer.
Analyze these ${urls.length} property image(s) and provide a quality report.

For each image, evaluate: lighting quality, composition, staging, clarity, professionalism.
Return a JSON object with:
- overallScore (0-100)
- grade ("excellent"|"good"|"fair"|"needs_work"|"poor")
- summary (1-2 sentences overall assessment)
- strengths (array of 2-4 strings)
- issues (array of 0-4 strings describing problems)
- recommendations (array of 2-4 actionable tips)
- pricingImpact ("positive"|"neutral"|"negative") - how photo quality affects buyer perception`,
        file_urls: urls,
        response_json_schema: {
          type: "object",
          properties: {
            overallScore: { type: "number" },
            grade: { type: "string" },
            summary: { type: "string" },
            strengths: { type: "array", items: { type: "string" } },
            issues: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            pricingImpact: { type: "string" }
          }
        }
      });

      setResults(response);
    } catch (e) {
      setResults({
        overallScore: 0,
        grade: "poor",
        summary: "Unable to analyze images. Please try again.",
        strengths: [],
        issues: ["Analysis failed"],
        recommendations: ["Try uploading clearer images"],
        pricingImpact: "neutral"
      });
    } finally {
      setLoading(false);
    }
  };

  const gradeConfig = {
    excellent: { color: "text-green-600", bg: "bg-green-50 border-green-200", emoji: "🌟" },
    good: { color: "text-blue-600", bg: "bg-blue-50 border-blue-200", emoji: "✅" },
    fair: { color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", emoji: "⚠️" },
    needs_work: { color: "text-orange-600", bg: "bg-orange-50 border-orange-200", emoji: "🔧" },
    poor: { color: "text-red-600", bg: "bg-red-50 border-red-200", emoji: "❌" },
  };

  const cfg = gradeConfig[results?.grade] || gradeConfig.fair;

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={runCheck}
        disabled={!hasImages}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-purple-400 text-purple-700 bg-purple-50 hover:bg-purple-100 font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        title={!hasImages ? "Upload images first to check quality" : "Analyze photos with Kemedar Vision™ AI"}
      >
        <Sparkles className="w-4 h-4" />
        Check with Kemedar Vision™
        <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-black">AI</span>
      </button>

      {/* Result Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm">Kemedar Vision™</p>
                  <p className="text-[10px] text-gray-400">AI Photo Quality Report</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="p-5">
              {loading ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Sparkles className="w-8 h-8 text-purple-500" />
                  </div>
                  <p className="font-bold text-gray-700">Analyzing your photos...</p>
                  <p className="text-sm text-gray-400 mt-1">Kemedar Vision™ AI is reviewing {imageUrls.filter(Boolean).length} image(s)</p>
                </div>
              ) : results ? (
                <div className="space-y-4">
                  {/* Score */}
                  <div className={`rounded-xl border p-4 text-center ${cfg.bg}`}>
                    <p className="text-4xl mb-1">{cfg.emoji}</p>
                    <p className={`text-4xl font-black ${cfg.color}`}>{results.overallScore}/100</p>
                    <p className={`text-sm font-bold capitalize mt-1 ${cfg.color}`}>{results.grade?.replace("_", " ")}</p>
                    <p className="text-xs text-gray-600 mt-2">{results.summary}</p>
                  </div>

                  {/* Pricing Impact */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                    <span className="text-sm font-bold text-gray-600">Buyer Perception Impact:</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                      results.pricingImpact === "positive" ? "bg-green-100 text-green-700" :
                      results.pricingImpact === "negative" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {results.pricingImpact === "positive" ? "✅ Positive" : results.pricingImpact === "negative" ? "❌ Negative" : "➖ Neutral"}
                    </span>
                  </div>

                  {/* Strengths */}
                  {results.strengths?.length > 0 && (
                    <div>
                      <p className="text-xs font-black text-gray-500 uppercase mb-2">✅ Strengths</p>
                      {results.strengths.map((s, i) => (
                        <p key={i} className="text-sm text-gray-700 flex items-start gap-2 mb-1">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" /> {s}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Issues */}
                  {results.issues?.length > 0 && (
                    <div>
                      <p className="text-xs font-black text-gray-500 uppercase mb-2">⚠️ Issues Found</p>
                      {results.issues.map((s, i) => (
                        <p key={i} className="text-sm text-gray-700 flex items-start gap-2 mb-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" /> {s}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Recommendations */}
                  {results.recommendations?.length > 0 && (
                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
                      <p className="text-xs font-black text-purple-700 uppercase mb-2">💡 AI Recommendations</p>
                      {results.recommendations.map((s, i) => (
                        <p key={i} className="text-sm text-purple-800 flex items-start gap-2 mb-1">
                          <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span> {s}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  {propertyId && (
                    <Link
                      to={`/kemedar/property/${propertyId}/vision`}
                      className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <ExternalLink className="w-4 h-4" /> View Full Vision Report
                    </Link>
                  )}

                  <button
                    onClick={runCheck}
                    className="w-full border border-purple-200 text-purple-700 font-bold py-2.5 rounded-xl text-sm hover:bg-purple-50 transition-colors"
                  >
                    🔄 Re-analyze
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}