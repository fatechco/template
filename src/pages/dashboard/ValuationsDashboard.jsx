import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { GRADE_CONFIG, formatCurrency } from '@/components/valuation/ValuationUtils';

function GradeBadge({ grade }) {
  const cfg = GRADE_CONFIG[grade] || GRADE_CONFIG['B'];
  return (
    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl font-black text-sm text-white shadow-sm" style={{ backgroundColor: cfg.color }}>
      {grade}
    </span>
  );
}

export default function ValuationsDashboard() {
  const [tab, setTab] = useState('portfolio');
  const [portfolio, setPortfolio] = useState([]);
  const [valuations, setValuations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const user = await base44.auth.me();
      const [pf, vals] = await Promise.all([
        base44.entities.ValuationPortfolio.filter({ userId: user.id }, '-created_date', 50),
        base44.entities.PropertyValuation.filter({ userId: user.id }, '-created_date', 50),
      ]);
      setPortfolio(pf || []);
      setValuations(vals || []);
      setLoading(false);
    };
    load();
  }, []);

  const portfolioItems = portfolio.filter(p => p.portfolioType === 'portfolio');
  const watchlistItems = valuations.filter(v => v.valuationGoal === 'check_value');
  const totalValue = portfolioItems.reduce((sum, p) => sum + (p.currentEstimate || 0), 0);
  const totalGain = portfolioItems.reduce((sum, p) => sum + (p.gainLoss || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">My Valuations</h1>
            <p className="text-gray-500 text-sm mt-0.5">Track your property portfolio and valuations</p>
          </div>
          <button onClick={() => navigate('/kemedar/valuation')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm">
            ➕ New Valuation
          </button>
        </div>

        {/* Stats row */}
        {tab === 'portfolio' && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <p className="text-2xl font-black text-gray-900">{portfolioItems.length}</p>
              <p className="text-xs text-gray-500 font-semibold mt-1">Properties</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <p className="text-2xl font-black text-gray-900">{formatCurrency(totalValue)}</p>
              <p className="text-xs text-gray-500 font-semibold mt-1">Total Value</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <p className={`text-2xl font-black ${totalGain >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {totalGain >= 0 ? '+' : ''}{formatCurrency(totalGain)}
              </p>
              <p className="text-xs text-gray-500 font-semibold mt-1">Total Gain/Loss</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm mb-6 w-fit">
          <button onClick={() => setTab('portfolio')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${tab === 'portfolio' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            🏠 My Portfolio
          </button>
          <button onClick={() => setTab('valuations')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${tab === 'valuations' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            📋 My Valuations
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : tab === 'portfolio' ? (
          portfolioItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🏠</p>
              <p className="font-bold text-gray-700 text-lg">No properties in portfolio</p>
              <p className="text-gray-400 text-sm mt-1">Add your first property to track its value</p>
              <button onClick={() => navigate('/kemedar/valuation')} className="mt-4 bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm">
                + Add Property to Portfolio
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                    <tr>
                      {['Type', 'Location', 'Purchase Price', 'Current Value', 'Change', 'Last Valued', 'Grade', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {portfolioItems.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{item.propertyType || 'Property'}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm">{item.locationLabel || '—'}</td>
                        <td className="px-4 py-3 text-gray-700 text-sm">{item.purchasePrice ? formatCurrency(item.purchasePrice) : '—'}</td>
                        <td className="px-4 py-3 font-bold text-gray-900 text-sm">{formatCurrency(item.currentEstimate)}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`font-bold ${(item.gainLoss || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {(item.gainLoss || 0) >= 0 ? '+' : ''}{formatCurrency(item.gainLoss || 0)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{item.created_date ? new Date(item.created_date).toLocaleDateString() : '—'}</td>
                        <td className="px-4 py-3"><GradeBadge grade={item.investmentGrade || 'B'} /></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => navigate('/kemedar/valuation')} className="text-xs text-blue-600 hover:underline font-semibold">🔄 Revalue</button>
                            {item.valuationId && (
                              <button onClick={() => navigate(`/kemedar/valuation/report/${item.valuationId}`)} className="text-xs text-gray-600 hover:underline">📊 Report</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          watchlistItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-bold text-gray-700 text-lg">No saved valuations</p>
              <p className="text-gray-400 text-sm mt-1">Check property values to see them here</p>
              <button onClick={() => navigate('/kemedar/valuation')} className="mt-4 bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm">
                + New Valuation
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                    <tr>
                      {['Property Type', 'Location', 'Estimated Value', 'Grade', 'Date', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {watchlistItems.map(v => (
                      <tr key={v.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/kemedar/valuation/report/${v.id}`)}>
                        <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{v.propertyType}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm">{v.locationLabel || v.cityName || '—'}</td>
                        <td className="px-4 py-3 font-bold text-blue-600 text-sm">{formatCurrency(v.estimatedPriceMid)}</td>
                        <td className="px-4 py-3"><GradeBadge grade={v.investmentGrade || 'B'} /></td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{v.calculatedAt ? new Date(v.calculatedAt).toLocaleDateString() : '—'}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer">📊 View Report</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}