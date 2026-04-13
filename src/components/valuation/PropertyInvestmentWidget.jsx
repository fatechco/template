import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GRADE_CONFIG, DEMAND_COLORS, formatCurrency } from './ValuationUtils';

function ScoreBar({ label, icon, score }) {
  const color = score >= 70 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
  return (
    <div className="flex items-center gap-3">
      <span className="text-base w-5">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-gray-600 truncate">{label}</span>
          <span className="text-xs font-bold text-gray-900 ml-2">{score}/100</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
        </div>
      </div>
    </div>
  );
}

export default function PropertyInvestmentWidget({ metric, property }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  if (!metric) {
    return (
      <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">📊</span>
          <h3 className="font-bold text-gray-900 text-lg">Investment Analysis</h3>
          <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold">✨ AI-Powered</span>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-sm">Know the Real Value of This Property</p>
              <div className="mt-2 space-y-1">
                {['Real-time market data analysis', 'Instant estimated value', 'Track demand in this location'].map(t => (
                  <p key={t} className="text-xs text-gray-600 flex items-center gap-2"><span className="text-green-500">✅</span>{t}</p>
                ))}
              </div>
              <button onClick={() => navigate('/kemedar/valuation')}
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                📊 Get Full Valuation Report
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const grade = metric.investmentGrade || 'B';
  const gradeConfig = GRADE_CONFIG[grade];

  const priceVs = metric.priceVsAreaAvg || 0;
  const priceLabel = Math.abs(priceVs) < 5 ? 'At market average' : priceVs < 0 ? `${Math.abs(priceVs).toFixed(1)}% below market` : `${priceVs.toFixed(1)}% above market`;
  const pricePositive = priceVs <= -5;
  const priceNegative = priceVs >= 5;

  const sizeVs = metric.sizeVsAreaAvg || 0;
  const sizeLabel = Math.abs(sizeVs) < 5 ? 'At average size' : sizeVs > 0 ? `${sizeVs.toFixed(1)}% bigger than avg` : `${Math.abs(sizeVs).toFixed(1)}% smaller than avg`;

  const demandColor = DEMAND_COLORS[metric.demandLevel] || '#F59E0B';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b border-gray-100">
        <span className="text-xl">📊</span>
        <h3 className="font-bold text-gray-900 text-lg flex-1">Investment Analysis</h3>
        <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold">✨ AI-Powered</span>
        <span className="text-xs text-gray-400">Updated recently</span>
      </div>

      {/* Grade + Score row */}
      <div className="flex gap-4 p-5">
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md" style={{ backgroundColor: gradeConfig?.color }}>
            {grade}
          </div>
          <p className="text-xs text-gray-500 text-center">Overall Investment Score</p>
          <p className="text-sm font-bold text-gray-900">{metric.overallScore}/100</p>
        </div>
        <div className="flex-1 space-y-2.5">
          <ScoreBar label="Location Score" icon="📍" score={metric.locationScore || 65} />
          <ScoreBar label="Price Score" icon="💰" score={metric.priceScore || 70} />
          <ScoreBar label="Market Demand" icon="📈" score={metric.demandScore || 60} />
          <ScoreBar label="Rental Yield" icon="🔄" score={metric.yieldScore || 65} />
          <ScoreBar label="Growth Potential" icon="📊" score={metric.growthScore || 60} />
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 pb-5">
        <div className={`rounded-xl p-3 border-2 ${pricePositive ? 'border-green-200 bg-green-50' : priceNegative ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
          <span className="text-xl">{pricePositive ? '👍' : priceNegative ? '👎' : '👌'}</span>
          <p className={`text-xs font-bold mt-1 ${pricePositive ? 'text-green-700' : priceNegative ? 'text-red-700' : 'text-blue-700'}`}>{priceLabel}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">{pricePositive ? 'Below market — Good deal!' : priceNegative ? 'Above market average' : 'Fair market price'}</p>
        </div>
        <div className={`rounded-xl p-3 border-2 ${sizeVs > 0 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
          <span className="text-xl">{sizeVs >= 0 ? '👍' : '👎'}</span>
          <p className={`text-xs font-bold mt-1 ${sizeVs >= 0 ? 'text-green-700' : 'text-red-700'}`}>{sizeLabel}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">vs area average</p>
        </div>
        <div className="rounded-xl p-3 border-2 border-gray-200 bg-gray-50">
          <span className="text-xl">📈</span>
          <p className="text-xs font-bold mt-1" style={{ color: demandColor }}>{metric.demandLevel || 'Medium'}</p>
          <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${metric.demandScore || 50}%`, backgroundColor: demandColor }} />
          </div>
          <p className="text-[10px] text-gray-500 mt-1">{metric.similarSoldCount || 0} sold nearby/6mo</p>
        </div>
        <div className="rounded-xl p-3 border-2 border-purple-200 bg-purple-50">
          <span className="text-xl">🔄</span>
          <p className="text-sm font-black text-purple-700 mt-1">{metric.estimatedRentalYield?.toFixed(1) || '—'}%</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Based on area rental data</p>
        </div>
      </div>

      {/* Price Comparison Table */}
      <div className="px-5 pb-5">
        <h4 className="text-sm font-bold text-gray-800 mb-3">Price Comparison</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left text-gray-500 font-semibold"></th>
                <th className="px-3 py-2 text-right text-blue-600 font-bold">This Property</th>
                <th className="px-3 py-2 text-right text-gray-500 font-semibold">Area Avg</th>
                <th className="px-3 py-2 text-right text-gray-500 font-semibold">City Avg</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-3 py-2 text-gray-600 font-medium">Price/m²</td>
                <td className="px-3 py-2 text-right font-bold text-gray-900">{formatCurrency(metric.pricePerSqm)}</td>
                <td className="px-3 py-2 text-right text-gray-600">{formatCurrency(metric.districtAvgPricePerSqm)}</td>
                <td className="px-3 py-2 text-right text-gray-600">{formatCurrency(metric.cityAvgPricePerSqm)}</td>
              </tr>
              {property?.price && (
                <tr>
                  <td className="px-3 py-2 text-gray-600 font-medium">Total Price</td>
                  <td className="px-3 py-2 text-right font-bold text-gray-900">{formatCurrency(property.price)}</td>
                  <td className="px-3 py-2 text-right text-gray-600">—</td>
                  <td className="px-3 py-2 text-right text-gray-600">—</td>
                </tr>
              )}
              <tr>
                <td className="px-3 py-2 text-gray-600 font-medium">Avg Days on Market</td>
                <td className="px-3 py-2 text-right font-bold text-gray-900">{metric.avgDaysOnMarket || '—'} days</td>
                <td className="px-3 py-2 text-right text-gray-600">—</td>
                <td className="px-3 py-2 text-right text-gray-600">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Trend */}
      <div className="px-5 pb-5">
        <p className="text-sm font-bold text-gray-700 mb-1">Price Trend (12 Months)</p>
        <p className={`text-sm font-semibold ${metric.trendDirection === 'Rising' ? 'text-green-600' : metric.trendDirection === 'Declining' ? 'text-red-500' : 'text-gray-600'}`}>
          {metric.trendDirection === 'Rising' ? '↑' : metric.trendDirection === 'Declining' ? '↓' : '→'} Prices have {metric.trendDirection === 'Rising' ? 'risen' : metric.trendDirection === 'Declining' ? 'fallen' : 'remained stable'} {Math.abs(metric.trendPercent12Months || 0).toFixed(1)}% in the last 12 months
        </p>
      </div>

      {/* CTA */}
      <div className="mx-5 mb-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">✨</span>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-sm">Know the Real Value of This Property</p>
            <div className="mt-2 space-y-1">
              {['Real-time market data analysis', 'Instant estimated value', 'Track demand in this location'].map(t => (
                <p key={t} className="text-xs text-gray-600 flex items-center gap-2"><span className="text-green-500">✅</span>{t}</p>
              ))}
            </div>
            <button onClick={() => navigate('/kemedar/valuation')}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
              📊 Get Full Valuation Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}