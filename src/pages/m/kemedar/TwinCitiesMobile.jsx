import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';

export default function TwinCitiesMobile() {
  const [tab, setTab] = useState('markets');
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.MarketProfile.filter({ isPublic: true }, '-sortOrder', 50)
      .then(setMarkets)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white px-4 py-6">
        <h1 className="text-xl font-black mb-1">🌍 Kemedar Twin Cities™</h1>
        <p className="text-xs opacity-80">Compare markets across the Arab world</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex overflow-x-auto no-scrollbar">
          {[
            { key: 'markets', label: '🗺️ Markets' },
            { key: 'compare', label: '📊 Compare' },
            { key: 'relocate', label: '🧳 Relocate' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-shrink-0 px-5 py-3 text-sm font-semibold border-b-2 transition ${tab === t.key ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'markets' && (
        <div className="p-4 space-y-4">
          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading...</div>
          ) : markets.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-3xl mb-2">🌍</p>
              <p>Markets coming soon</p>
            </div>
          ) : (
            markets.map(market => (
              <div key={market.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                <span className="text-4xl flex-shrink-0">{market.flagEmoji || '🌍'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{market.cityName}, {market.countryName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{market.currency} · {market.region?.replace(/_/g, ' ')}</p>
                  {market.medianPropertyPriceUSD && (
                    <p className="text-xs text-orange-600 font-semibold mt-1">
                      ${market.medianPropertyPriceUSD.toLocaleString()}/m²
                    </p>
                  )}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${market.expansionStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {market.expansionStatus === 'active' ? '✅' : '🔜'}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'compare' && (
        <div className="p-4 text-center">
          <p className="text-gray-500 text-sm mb-6 mt-8">Compare markets side-by-side</p>
          <Link to="/kemedar/twin-cities/compare"
            className="block w-full bg-orange-500 text-white font-bold py-4 rounded-xl">
            📊 Open Comparison Tool →
          </Link>
        </div>
      )}

      {tab === 'relocate' && (
        <div className="p-4 text-center">
          <p className="text-gray-500 text-sm mb-2 mt-8">Find your perfect city to live or invest</p>
          <p className="text-xs text-gray-400 mb-6">5 quick questions, AI-powered results</p>
          <Link to="/kemedar/twin-cities/relocate"
            className="block w-full bg-orange-500 text-white font-bold py-4 rounded-xl">
            🧳 Start Relocation Quiz →
          </Link>
        </div>
      )}
    </div>
  );
}