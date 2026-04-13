import { formatCurrency, DEMAND_COLORS } from './ValuationUtils';

function MetricCard({ icon, value, label, sub, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: color + '20' }}>
          {icon}
        </div>
      </div>
      <p className="text-xl font-black text-gray-900" style={{ color }}>{value}</p>
      <p className="text-xs font-semibold text-gray-600 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function ValuationMarketOverview({ valuation }) {
  const locationLabel = valuation.districtName || valuation.cityName || 'this area';
  const md = valuation.marketData || {};
  const trend12 = md.priceChange12Months ?? valuation.trendPercentage ?? 0;
  const trendUp = trend12 >= 0;
  const demandColor = DEMAND_COLORS[valuation.demandLevel] || '#F59E0B';

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900">Market Overview — {locationLabel}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MetricCard
          icon="💰" color="#3B82F6"
          value={formatCurrency(valuation.marketAveragePricePerSqm)}
          label="Avg Price per m²"
          sub={`in ${locationLabel}`}
        />
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: demandColor + '20' }}>📈</div>
          </div>
          <p className="text-xl font-black" style={{ color: demandColor }}>{valuation.demandLevel || 'Medium'}</p>
          <p className="text-xs font-semibold text-gray-600 mt-0.5">Market Demand</p>
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${valuation.demandScore || 50}%`, backgroundColor: demandColor }} />
          </div>
        </div>
        <MetricCard
          icon="📊" color={trendUp ? '#10B981' : '#EF4444'}
          value={`${trendUp ? '↑ +' : '↓ '}${Math.abs(trend12).toFixed(1)}%`}
          label="Price Trend (12 months)"
        />
        <MetricCard
          icon="🏠" color="#1E3A5F"
          value={md.activeListings ?? '—'}
          label="Active Listings Nearby"
        />
        <MetricCard
          icon="⏱️" color="#F97316"
          value={md.avgDaysOnMarket ? `${md.avgDaysOnMarket} days` : '—'}
          label="Avg Time to Sell"
        />
        <MetricCard
          icon="🔄" color="#7C3AED"
          value={`${valuation.rentalYield?.toFixed(1) || '—'}%`}
          label="Est. Rental Yield"
          sub="annually"
        />
      </div>
    </div>
  );
}