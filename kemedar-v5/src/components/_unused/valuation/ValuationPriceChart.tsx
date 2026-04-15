// @ts-nocheck
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { generatePriceHistory, formatCurrency } from './ValuationUtils';

export default function ValuationPriceChart({ valuation }) {
  const md = valuation.marketData || {};
  const data = generatePriceHistory(valuation.marketAveragePricePerSqm || 2000, md);
  const currentValue = valuation.pricePerSqm || valuation.marketAveragePricePerSqm;

  const changes = [
    { label: '1 month', value: md.priceChange1Month ?? 0.3 },
    { label: '3 months', value: md.priceChange3Months ?? 1.1 },
    { label: '6 months', value: md.priceChange6Months ?? 2.4 },
    { label: '12 months', value: md.priceChange12Months ?? valuation.trendPercentage ?? 3.2 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <h3 className="text-base font-bold text-gray-900">Price History — Last 12 Months</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
          <Tooltip formatter={v => formatCurrency(v)} labelFormatter={l => `Month: ${l}`} />
          <ReferenceLine y={currentValue} stroke="#F97316" strokeDasharray="5 5" label={{ value: 'Current estimate', position: 'right', fontSize: 10, fill: '#F97316' }} />
          <Area type="monotone" dataKey="price" stroke="#3B82F6" strokeWidth={2} fill="url(#priceGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {changes.map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`text-sm font-bold ${value >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {value >= 0 ? '↑ +' : '↓ '}{Math.abs(value).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}