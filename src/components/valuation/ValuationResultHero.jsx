import { formatCurrency } from './ValuationUtils';

function AccuracyCircle({ score }) {
  const color = score >= 70 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
          <circle cx="48" cy="48" r={radius} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white font-bold text-lg leading-none">{score}%</span>
        </div>
      </div>
      <span className="text-blue-200 text-xs font-medium">Accuracy</span>
    </div>
  );
}

export default function ValuationResultHero({ valuation }) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📊</span>
            <span className="text-blue-200 text-xs font-bold uppercase tracking-widest">Estimated Market Value</span>
          </div>
          <p className="text-xl font-bold mb-1 opacity-90">
            {formatCurrency(valuation.estimatedPriceMin)} — {formatCurrency(valuation.estimatedPriceMax)}
          </p>
          <p className="text-4xl font-black tracking-tight mb-3">
            {formatCurrency(valuation.estimatedPriceMid)}
          </p>
          <p className="text-blue-200 text-sm font-medium">
            {formatCurrency(valuation.pricePerSqm)} per m²
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs bg-white/20 rounded-full px-3 py-1 font-semibold">
              {valuation.trendDirection === 'Rising' ? '↑' : valuation.trendDirection === 'Declining' ? '↓' : '→'} {Math.abs(valuation.trendPercentage || 0)}% in 12 months
            </span>
            <span className="text-xs bg-white/20 rounded-full px-3 py-1 font-semibold capitalize">
              {valuation.demandLevel} Demand
            </span>
          </div>
        </div>
        <AccuracyCircle score={valuation.accuracyScore || 0} />
      </div>
    </div>
  );
}