import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Sparkles, Download, Share2, ChevronLeft, TrendingUp, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react";

const GRADE_CONFIG = {
  premium: { label: "PREMIUM LISTING", color: "bg-purple-600", text: "text-purple-700" },
  good: { label: "GOOD LISTING", color: "bg-green-600", text: "text-green-700" },
  average: { label: "AVERAGE LISTING", color: "bg-yellow-500", text: "text-yellow-700" },
  needs_work: { label: "NEEDS IMPROVEMENT", color: "bg-orange-500", text: "text-orange-700" },
  poor: { label: "POOR LISTING", color: "bg-red-500", text: "text-red-700" }
};

const FINISHING_GRADE_LABELS = {
  luxury: "Luxury Finishing", high_end: "High-End Finishing",
  standard: "Standard Finishing", basic: "Basic Finishing",
  unfinished: "Unfinished", needs_renovation: "Needs Renovation"
};

export default function VisionReport() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en');
  const [sortBy, setSortBy] = useState('score');

  useEffect(() => {
    if (!id) return;
    Promise.all([
      base44.entities.PropertyVisionReport.filter({ propertyId: id }),
      base44.entities.PropertyPhotoAnalysis.filter({ propertyId: id, analysisStatus: 'completed' }),
      base44.entities.Property.filter({ id })
    ]).then(([reports, ans, props]) => {
      setReport(reports[0] || null);
      setAnalyses(ans);
      setProperty(props[0] || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin" />
    </div>
  );

  if (!report) return (
    <div className="max-w-2xl mx-auto p-6 text-center py-20">
      <p className="text-5xl mb-4">✨</p>
      <h2 className="text-xl font-black text-gray-900 mb-2">No Vision Report Yet</h2>
      <p className="text-gray-500">Upload at least 3 photos to generate a Vision report.</p>
      <Link to={`/kemedar/edit/property/${id}`} className="mt-4 inline-block bg-purple-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-purple-700">
        Add Photos
      </Link>
    </div>
  );

  const gradeCfg = GRADE_CONFIG[report.listingQualityGrade] || GRADE_CONFIG.average;

  const sortedAnalyses = [...analyses].sort((a, b) => {
    if (sortBy === 'score') return (b.qualityScore || 0) - (a.qualityScore || 0);
    if (sortBy === 'issues') return (b.issues?.length || 0) - (a.issues?.length || 0);
    if (sortBy === 'room') return (a.suggestedLabel || '').localeCompare(b.suggestedLabel || '');
    return 0;
  });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <Link to={`/property/${id}`} className="flex items-center gap-1 text-xs text-gray-400 hover:text-purple-600 mb-2">
            <ChevronLeft size={14} /> Back to Property
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-purple-500" />
            <h1 className="text-2xl font-black text-gray-900">Kemedar Vision™ Report</h1>
          </div>
          {property?.title && <p className="text-gray-500 text-sm mt-1">{property.title}</p>}
          {report.completedAt && (
            <p className="text-gray-400 text-xs mt-0.5">Generated: {new Date(report.completedAt).toLocaleString()}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <Share2 size={12} /> Share
          </button>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <Download size={12} /> Download PDF
          </button>
        </div>
      </div>

      {/* Overall score card */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-6 text-white">
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="8" />
                <circle cx="48" cy="48" r="42" fill="none" stroke="white" strokeWidth="8"
                  strokeDasharray={`${((report.listingQualityScore || 0) / 100) * 263.9} 263.9`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black">{report.listingQualityScore || 0}</span>
                <span className="text-xs text-white/80">/ 100</span>
              </div>
            </div>
            <span className={`text-xs font-black px-3 py-1 rounded-full ${gradeCfg.color} text-white`}>
              {gradeCfg.label}
            </span>
          </div>
          <div className="space-y-1.5 text-sm">
            <p>📸 <strong>{report.photoCount}</strong> Photos Analyzed</p>
            <p>🏅 Excellent: <strong>{report.photoGradeBreakdown?.excellent || 0}</strong> | Good: <strong>{report.photoGradeBreakdown?.good || 0}</strong></p>
            <p>⚠️ Issues: <strong>{report.criticalIssuesCount || 0}</strong> critical</p>
            <p>🏆 Finishing: <strong>{FINISHING_GRADE_LABELS[report.overallFinishingGrade] || report.overallFinishingGrade || '—'}</strong></p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm font-bold opacity-80">📈 Expected Performance</p>
            <p className="text-2xl font-black">↑ +{report.expectedViewsBoost || 0}%</p>
            <p className="text-xs opacity-80">more views vs average</p>
            {report.potentialViewsIfImproved > 0 && (
              <p className="text-xs bg-white/20 rounded-lg px-2 py-1">If improved: ↑ +{report.potentialViewsIfImproved}% potential</p>
            )}
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-gray-900 flex items-center gap-2"><span>🤖</span> Vision Summary</h2>
          <div className="flex gap-1">
            {['en', 'ar'].map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${lang === l ? 'bg-gray-800 text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {lang === 'ar' ? report.visionSummaryAr : report.visionSummary}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {report.topStrengths?.length > 0 && (
            <div>
              <p className="text-xs font-black text-green-700 mb-2">✅ Strengths</p>
              <ul className="space-y-1">
                {report.topStrengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle size={13} className="text-green-500 mt-0.5 flex-shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {report.topImprovements?.length > 0 && (
            <div>
              <p className="text-xs font-black text-orange-700 mb-2">💡 Improvements</p>
              <ul className="space-y-1">
                {report.topImprovements.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-orange-400 flex-shrink-0">•</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Photo gallery with analysis */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="font-black text-gray-900">📸 Photo Analysis</h2>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none">
            <option value="score">Sort: AI Score</option>
            <option value="room">Sort: Room Type</option>
            <option value="issues">Sort: Issues First</option>
          </select>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {sortedAnalyses.map((a, i) => (
            <div key={a.id || i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="relative aspect-square">
                <img src={a.photoUrl} alt="" className="w-full h-full object-cover" />
                <div className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow ${
                  a.qualityScore >= 80 ? 'bg-green-500' : a.qualityScore >= 60 ? 'bg-yellow-400' : 'bg-red-500'
                }`}>{a.qualityScore || 0}</div>
                {a.hasIssues && (
                  <div className="absolute bottom-0 left-0 right-0 bg-orange-500 py-0.5 px-2">
                    <span className="text-white text-[9px] font-bold">⚠️ {a.issues?.length} issue(s)</span>
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-bold text-gray-800 truncate">{a.suggestedLabel || 'Unknown'}</p>
                <div className="w-full h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <div className={`h-full rounded-full ${a.qualityScore >= 80 ? 'bg-green-500' : a.qualityScore >= 60 ? 'bg-yellow-400' : 'bg-red-500'}`}
                    style={{ width: `${a.qualityScore || 0}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Finishing analysis */}
      {report.overallFinishingGrade && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-black text-gray-900 mb-4">🏆 Finishing Quality Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <span className="text-sm font-black px-3 py-1.5 rounded-xl bg-blue-100 text-blue-700">
                {FINISHING_GRADE_LABELS[report.overallFinishingGrade] || report.overallFinishingGrade}
              </span>
              <p className="text-4xl font-black text-gray-900 mt-3">{report.overallFinishingScore || 0}<span className="text-base text-gray-400">/100</span></p>
              {report.detectedPremiumFeatures?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {report.detectedPremiumFeatures.map((f, i) => (
                    <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                      ✨ {f.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {report.finishingHighlights?.length > 0 && (
              <div>
                <p className="text-xs font-black text-gray-500 mb-2">USE THESE IN YOUR LISTING TEXT:</p>
                <ul className="space-y-1.5">
                  {report.finishingHighlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-orange-400">•</span>{h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Price alignment */}
      {report.priceAnalysisNarrative && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-black text-gray-900 mb-4">💰 Price vs Finishing Analysis</h2>
          <div className={`rounded-xl p-4 ${
            report.priceAlignmentStatus === 'underpriced' ? 'bg-blue-50 border border-blue-200' :
            report.priceAlignmentStatus === 'overpriced' ? 'bg-orange-50 border border-orange-200' :
            'bg-green-50 border border-green-200'
          }`}>
            <p className="text-sm text-gray-700 leading-relaxed">{report.priceAnalysisNarrative}</p>
            {report.priceAlignmentStatus === 'fair' && (
              <p className="text-sm font-bold text-green-700 mt-2">✅ Your price is well-aligned with the finishing quality shown.</p>
            )}
          </div>
        </div>
      )}

      {/* Issues */}
      {report.criticalIssuesCount > 0 || report.issuesSummary?.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-black text-gray-900 mb-4">⚠️ Issues & Required Disclosures</h2>
          <div className="space-y-3">
            {report.issuesSummary?.map((issue, i) => (
              <div key={i} className={`rounded-xl p-3 flex items-start gap-3 border ${
                issue.severity === 'critical' ? 'bg-red-50 border-red-200' :
                issue.severity === 'high' ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-200'
              }`}>
                <AlertTriangle size={16} className={issue.severity === 'critical' ? 'text-red-500' : 'text-orange-500'} />
                <div>
                  <p className="text-sm font-bold text-gray-800">{issue.issueType?.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-gray-600">{issue.description}</p>
                  {issue.disclosureRequired && (
                    <p className="text-xs text-orange-600 font-bold mt-1">⚠️ Disclosure recommended</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-500" />
          <div>
            <p className="font-bold text-green-700">✅ No issues detected in your photos</p>
            <p className="text-sm text-green-600">Your property photos look clean and well-maintained</p>
          </div>
        </div>
      )}
    </div>
  );
}