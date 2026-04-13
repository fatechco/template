import { useState, useMemo } from 'react';
import { calculateROI, formatCurrency } from './ValuationUtils';

export default function ValuationROICalculator({ valuation }) {
  const [purchasePrice, setPurchasePrice] = useState(valuation?.estimatedPriceMid || 200000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [monthlyRent, setMonthlyRent] = useState(Math.round((valuation?.estimatedPriceMid || 200000) * (valuation?.rentalYield || 5) / 100 / 12));
  const [appreciationPct, setAppreciationPct] = useState(Math.abs(valuation?.trendPercentage || 3));
  const [expanded, setExpanded] = useState(false);

  const roi = useMemo(() => calculateROI(purchasePrice, downPaymentPct, monthlyRent, appreciationPct), [purchasePrice, downPaymentPct, monthlyRent, appreciationPct]);

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-5">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <span className="font-bold text-gray-900">Investment Return Calculator</span>
        </div>
        <span className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-5 border-t border-gray-100 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Purchase Price ($)</label>
              <input type="number" value={purchasePrice} onChange={e => setPurchasePrice(+e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Down Payment (%)</label>
              <input type="number" value={downPaymentPct} onChange={e => setDownPaymentPct(+e.target.value)} min={0} max={100} className={inputClass} />
              <p className="text-xs text-gray-400 mt-0.5">= {formatCurrency(roi.downPayment)}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Expected Rent/Month ($)</label>
              <input type="number" value={monthlyRent} onChange={e => setMonthlyRent(+e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Annual Appreciation (%)</label>
              <input type="number" value={appreciationPct} onChange={e => setAppreciationPct(+e.target.value)} step="0.1" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Annual Rental Income', value: formatCurrency(roi.annualRent) },
              { label: 'Mortgage Cost/Month', value: formatCurrency(roi.mortgagePayment) },
              { label: 'Net Monthly Cash Flow', value: formatCurrency(roi.netCashFlow), highlight: roi.netCashFlow >= 0 },
              { label: 'Gross Rental Yield', value: `${roi.grossYield}%` },
              { label: 'Net Rental Yield', value: `${roi.netYield}%` },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className={`text-base font-black ${highlight !== undefined ? (highlight ? 'text-green-600' : 'text-red-500') : 'text-gray-900'}`}>{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-800 mb-3">5-Year Projection</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    {['Year', 'Property Value', 'Total Rent', 'Total Return', 'ROI'].map(h => (
                      <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {roi.projection.map(row => (
                    <tr key={row.year}>
                      <td className="px-3 py-2 font-bold text-gray-900">Year {row.year}</td>
                      <td className="px-3 py-2 text-gray-700">{formatCurrency(row.propValue)}</td>
                      <td className="px-3 py-2 text-gray-700">{formatCurrency(row.totalRent)}</td>
                      <td className="px-3 py-2 text-gray-700">{formatCurrency(row.totalReturn)}</td>
                      <td className="px-3 py-2 font-bold text-green-600">{row.roi}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-center">
              <span className="text-2xl font-black text-green-600">{roi.projection[4]?.roi}%</span>
              <span className="text-sm text-gray-500 ml-2">Total 5-Year ROI</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}