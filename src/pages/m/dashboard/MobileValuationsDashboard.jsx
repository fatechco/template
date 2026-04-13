import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import MobileTopBar from '@/components/mobile-v2/MobileTopBar';
import { GRADE_CONFIG, formatCurrency } from '@/components/valuation/ValuationUtils';

function GradeBadge({ grade }) {
  const cfg = GRADE_CONFIG[grade] || GRADE_CONFIG['B'];
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl font-black text-xs text-white shadow-sm" style={{ backgroundColor: cfg.color }}>
      {grade}
    </span>
  );
}

export default function MobileValuationsDashboard() {
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

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <MobileTopBar title="My Valuations" showBack />

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-4 pt-3 pb-0 flex gap-1">
        {[['portfolio', '🏠 Portfolio'], ['valuations', '📋 Valuations']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-colors ${tab === key ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 space-y-3">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : tab === 'portfolio' ? (
          portfolioItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🏠</p>
              <p className="font-bold text-gray-700">No properties yet</p>
              <button onClick={() => navigate('/m/kemedar/valuation')} className="mt-4 bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm">+ Add to Portfolio</button>
            </div>
          ) : portfolioItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{item.propertyType || 'Property'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.locationLabel || '—'}</p>
                </div>
                <GradeBadge grade={item.investmentGrade || 'B'} />
              </div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="text-xs text-gray-400">Current Estimate</p>
                  <p className="font-black text-orange-600">{formatCurrency(item.currentEstimate)}</p>
                </div>
                {item.gainLoss != null && (
                  <div className="text-right">
                    <p className="text-xs text-gray-400">vs Purchase</p>
                    <p className={`font-bold text-sm ${item.gainLoss >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {item.gainLoss >= 0 ? '+' : ''}{item.gainLossPercent?.toFixed(1) || 0}%
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => navigate('/m/kemedar/valuation')} className="flex-1 text-xs border border-blue-200 text-blue-600 font-bold py-2 rounded-xl hover:bg-blue-50 transition-colors">🔄 Revalue</button>
                {item.valuationId && (
                  <button onClick={() => navigate(`/kemedar/valuation/report/${item.valuationId}`)} className="flex-1 text-xs border border-gray-200 text-gray-600 font-bold py-2 rounded-xl hover:bg-gray-50 transition-colors">📊 Report</button>
                )}
              </div>
            </div>
          ))
        ) : (
          watchlistItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-bold text-gray-700">No valuations yet</p>
              <button onClick={() => navigate('/m/kemedar/valuation')} className="mt-4 bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm">+ New Valuation</button>
            </div>
          ) : watchlistItems.map(v => (
            <div key={v.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer" onClick={() => navigate(`/kemedar/valuation/report/${v.id}`)}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{v.propertyType}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{v.locationLabel || v.cityName || '—'}</p>
                </div>
                <GradeBadge grade={v.investmentGrade || 'B'} />
              </div>
              <p className="font-black text-blue-600 mt-2">{formatCurrency(v.estimatedPriceMid)}</p>
              <p className="text-xs text-gray-400 mt-1">{v.calculatedAt ? new Date(v.calculatedAt).toLocaleDateString() : '—'}</p>
            </div>
          ))
        )}
      </div>

      {/* FAB */}
      <button onClick={() => navigate('/m/kemedar/valuation')}
        className="fixed bottom-24 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-blue-700 transition-colors z-40">
        ➕
      </button>
    </div>
  );
}