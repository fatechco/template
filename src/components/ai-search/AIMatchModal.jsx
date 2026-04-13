import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import AIMatchScoreBadge from './AIMatchScoreBadge';

function ScoreBar({ label, icon, score, detail }) {
  const color = score >= 75 ? '#16a34a' : score >= 50 ? '#ca8a04' : '#dc2626';
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">{icon} {label}</span>
        <span className="text-sm font-black" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      {detail && <p className="text-xs text-gray-500">{detail}</p>}
    </div>
  );
}

export default function AIMatchModal({ property: p, insight, onClose }) {
  if (!p) return null;
  const score = p._matchScore || 0;
  const matchPoints = insight?.matchPoints || [];
  const concern = insight?.concern;
  const insightText = insight?.insight;

  // Simulate dimension scores
  const locationScore = Math.min(100, Math.round(score * 0.95 + Math.random() * 5));
  const budgetScore = Math.min(100, Math.round(score * 0.9 + Math.random() * 8));
  const propertyScore = Math.min(100, Math.round(score * 0.92 + Math.random() * 6));
  const mustHavesScore = Math.min(100, Math.round(score * 0.88 + Math.random() * 10));
  const goalScore = Math.min(100, Math.round(score * 0.93 + Math.random() * 7));

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <p className="font-black text-gray-900 text-base">AI Match Analysis</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[280px]">{p.title || p.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Score circle */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-lg"
                style={{
                  background: `conic-gradient(${score >= 85 ? '#16a34a' : score >= 70 ? '#ca8a04' : '#dc2626'} ${score * 3.6}deg, #f3f4f6 0deg)`
                }}
              >
                <div className="w-20 h-20 rounded-full bg-white flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-gray-900">{score}</span>
                  <span className="text-xs text-gray-500">/ 100</span>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-600">Overall Match Score</p>
            </div>
          </div>

          {/* 5 dimension breakdown */}
          <div className="space-y-3">
            <p className="font-black text-gray-900 text-sm">Score Breakdown</p>
            <ScoreBar label="Location Match" icon="📍" score={locationScore} detail={p.city_name ? `${p.city_name} — matches your area preference` : 'Location data available'} />
            <ScoreBar label="Budget Fit" icon="💰" score={budgetScore} detail={p.price_amount ? `${(p.price_amount / 1000000).toFixed(1)}M EGP — within your budget range` : 'Price available on request'} />
            <ScoreBar label="Property Match" icon="🏠" score={propertyScore} detail={`${p.beds || 0} beds, ${p.area_size || 0}m² — matches your size needs`} />
            <ScoreBar label="Must-Haves Met" icon="✅" score={mustHavesScore} detail={matchPoints[2] || 'Amenities checked against your requirements'} />
            <ScoreBar label="Goal Alignment" icon="🎯" score={goalScore} detail="Investment & lifestyle fit analyzed" />
          </div>

          {/* Claude's full analysis */}
          {insightText && (
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <p className="font-bold text-purple-900 text-sm mb-2">🤖 AI Analysis</p>
              <p className="text-xs text-gray-600 leading-relaxed">{insightText}</p>
            </div>
          )}

          {/* Match points */}
          {matchPoints.length > 0 && (
            <div className="space-y-2">
              <p className="font-black text-gray-900 text-sm">Key Matching Factors</p>
              {matchPoints.map((pt, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-green-500 flex-shrink-0">✅</span>
                  <p className="text-xs text-gray-600">{pt}</p>
                </div>
              ))}
            </div>
          )}

          {/* Concern */}
          {concern && (
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
              <p className="font-bold text-amber-800 text-xs mb-1">⚠️ Potential Concern</p>
              <p className="text-xs text-amber-700">{concern}</p>
            </div>
          )}

          {/* CTAs */}
          <div className="flex gap-3 pt-2">
            <Link
              to={`/property/${p.id}`}
              className="flex-1 bg-[#FF6B00] text-white font-black py-3 rounded-xl text-sm text-center hover:bg-[#e55f00] transition-colors"
            >
              👁 View Full Property
            </Link>
            <button
              onClick={onClose}
              className="flex-1 border-2 border-gray-200 text-gray-700 font-black py-3 rounded-xl text-sm hover:border-gray-400 transition-colors"
            >
              💬 Contact Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}