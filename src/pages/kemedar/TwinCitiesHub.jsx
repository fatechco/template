import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';

export default function TwinCitiesHub() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.MarketProfile.filter({ isPublic: true }, '-sortOrder', 100)
      .then(setMarkets)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1569144157591-c60f3f82f137?w=1600')] bg-cover bg-center" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <span className="inline-block bg-orange-500/20 text-orange-300 text-xs font-bold px-3 py-1.5 rounded-full mb-6 border border-orange-500/30">
            🌍 KEMEDAR TWIN CITIES™
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            Compare Property Markets<br />
            <span className="text-orange-400">Across the Arab World</span>
          </h1>
          <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto">
            Find the best market for your investment, your next home, or your relocation journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/kemedar/twin-cities/compare"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition"
            >
              📊 Compare Markets
            </Link>
            <Link
              to="/kemedar/twin-cities/relocate"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold px-8 py-4 rounded-xl text-lg transition"
            >
              🧳 Find Your City
            </Link>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {[
              { label: 'Cairo vs Dubai', params: '?m=EG-CAI,AE-DXB' },
              { label: 'Cairo vs Casablanca', params: '?m=EG-CAI,MA-CAS' },
              { label: 'Cairo vs Amman', params: '?m=EG-CAI,JO-AMM' },
              { label: 'Cairo vs Riyadh', params: '?m=EG-CAI,SA-RUH' }
            ].map(preset => (
              <Link
                key={preset.label}
                to={`/kemedar/twin-cities/compare${preset.params}`}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/20 transition"
              >
                {preset.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Markets Grid */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-gray-900">🌍 Available Markets</h2>
          <Link to="/kemedar/twin-cities/compare" className="text-orange-600 font-semibold text-sm hover:underline">
            Compare All →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-36 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : markets.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">🌍</p>
            <p className="font-semibold">Markets coming soon</p>
            <p className="text-sm">We're preparing cross-market data for buyers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {markets.map(market => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        )}
      </div>

      {/* Why Kemedar Twin Cities */}
      <div className="bg-orange-50 border-t border-orange-100 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-10">Why Kemedar Twin Cities™?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '📊', title: 'Side-by-Side Data', desc: 'Compare prices, yields, and quality of life across cities in one view.' },
              { icon: '🤖', title: 'AI-Personalized Briefs', desc: 'Get investment analysis tailored to your goals and financial profile.' },
              { icon: '🗺️', title: 'Local FO Network', desc: 'Connect with our verified Franchise Owners in your target city.' }
            ].map(item => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-3xl mb-3">{item.icon}</p>
                <p className="font-bold text-gray-900 mb-2">{item.title}</p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketCard({ market }) {
  const isActive = market.expansionStatus === 'active' || market.expansionStatus === 'full_launch';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 flex flex-col">
      <div className="h-36 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {market.coverImageUrl ? (
          <img src={market.coverImageUrl} alt={market.cityName} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        ) : null}
        <div className="relative text-center z-10">
          <span className="text-5xl">{market.flagEmoji || '🌍'}</span>
        </div>
        <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full z-10 ${isActive ? 'bg-green-500 text-white' : 'bg-orange-400 text-white'}`}>
          {isActive ? '✅ Active' : '🔜 Coming Soon'}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {market.cityName}, {market.countryName}
        </h3>
        <p className="text-xs text-gray-500 mb-4 capitalize">
          {market.region?.replace(/_/g, ' ')} · {market.currency}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          {market.medianPropertyPriceUSD && (
            <div className="bg-gray-50 rounded p-2">
              <p className="text-gray-500">Avg Price/m²</p>
              <p className="font-bold">${market.medianPropertyPriceUSD.toLocaleString()}</p>
            </div>
          )}
          {market.avgRentalYieldPercent && (
            <div className="bg-gray-50 rounded p-2">
              <p className="text-gray-500">Rental Yield</p>
              <p className="font-bold text-green-600">{market.avgRentalYieldPercent.toFixed(1)}%</p>
            </div>
          )}
          {market.totalListings > 0 && (
            <div className="bg-gray-50 rounded p-2">
              <p className="text-gray-500">Listings</p>
              <p className="font-bold">{market.totalListings.toLocaleString()}</p>
            </div>
          )}
          {market.foreignOwnershipAllowed !== undefined && (
            <div className="bg-gray-50 rounded p-2">
              <p className="text-gray-500">Foreign Buyers</p>
              <p className="font-bold">{market.foreignOwnershipAllowed ? '✅ Yes' : '⚠️ Limited'}</p>
            </div>
          )}
        </div>

        <div className="mt-auto space-y-2">
          <Link
            to={`/kemedar/twin-cities/compare?m=${market.marketCode}`}
            className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2 rounded-lg transition"
          >
            📊 Compare This Market
          </Link>
          {isActive && (
            <Link
              to="/kemedar/search-properties"
              className="block w-full text-center bg-orange-50 hover:bg-orange-100 text-orange-700 text-sm font-bold py-2 rounded-lg transition"
            >
              🔍 Browse Properties
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}