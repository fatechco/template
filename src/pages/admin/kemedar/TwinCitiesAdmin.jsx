import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Globe, Plus, Zap, TrendingUp, Users, MapPin } from 'lucide-react';

export default function TwinCitiesAdmin() {
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newMarketData, setNewMarketData] = useState({
    marketCode: '',
    countryCode: '',
    countryName: '',
    cityName: '',
    region: 'egypt',
    currency: 'EGP',
    currencySymbol: '£'
  });

  useEffect(() => {
    loadMarkets();
  }, []);

  const loadMarkets = async () => {
    setLoading(true);
    const data = await base44.entities.MarketProfile.list('-sortOrder', 100);
    setMarkets(data);
    setLoading(false);
  };

  const handleAddMarket = async () => {
    if (!newMarketData.countryName || !newMarketData.cityName) return;
    
    await base44.entities.MarketProfile.create(newMarketData);
    setNewMarketData({
      marketCode: '',
      countryCode: '',
      countryName: '',
      cityName: '',
      region: 'egypt',
      currency: 'EGP',
      currencySymbol: '£'
    });
    setShowForm(false);
    await loadMarkets();
  };

  const handleEvaluate = async (marketId) => {
    const market = markets.find(m => m.id === marketId);
    try {
      const result = await base44.functions.invoke('evaluateMarketReadiness', {
        marketId,
        marketData: market
      });
      await loadMarkets();
      setSelectedMarket(marketId);
    } catch (error) {
      console.error('Evaluation failed:', error);
    }
  };

  const stats = {
    totalMarkets: markets.length,
    activeMarkets: markets.filter(m => m.expansionStatus === 'active').length,
    underEvaluation: markets.filter(m => m.expansionStatus === 'under_evaluation').length,
    totalUsers: markets.reduce((sum, m) => sum + (m.totalRegisteredUsers || 0), 0),
    totalRevenue: markets.reduce((sum, m) => sum + (m.platformRevenueMonthly || 0), 0),
    totalFOs: markets.reduce((sum, m) => sum + (m.activeFOs || 0), 0)
  };

  if (loading) return <div className="p-8 text-center">Loading markets...</div>;

  const current = selectedMarket ? markets.find(m => m.id === selectedMarket) : null;

  return (
    <div className="space-y-8 p-8 max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2">
          🌍 Kemedar Twin Cities™
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg"
        >
          <Plus size={18} /> Add Market
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Markets', val: stats.totalMarkets, icon: '🗺️', color: 'blue' },
          { label: 'Active', val: stats.activeMarkets, icon: '✅', color: 'green' },
          { label: 'Under Eval', val: stats.underEvaluation, icon: '⏳', color: 'orange' },
          { label: 'Total Users', val: (stats.totalUsers / 1000).toFixed(0) + 'K', icon: '👥', color: 'purple' },
          { label: 'Monthly Revenue', val: '$' + (stats.totalRevenue / 1000000).toFixed(1) + 'M', icon: '💰', color: 'green' },
          { label: 'Total FOs', val: stats.totalFOs, icon: '🗂️', color: 'teal' }
        ].map(stat => (
          <div key={stat.label} className={`bg-${stat.color}-50 border border-${stat.color}-200 rounded-lg p-4`}>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Add Market Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="font-bold text-lg">Add New Market</h3>
          <input
            placeholder="Country Code (e.g., EG)"
            value={newMarketData.countryCode}
            onChange={(e) => setNewMarketData({ ...newMarketData, countryCode: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            placeholder="Country Name"
            value={newMarketData.countryName}
            onChange={(e) => setNewMarketData({ ...newMarketData, countryName: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            placeholder="City Name"
            value={newMarketData.cityName}
            onChange={(e) => setNewMarketData({ ...newMarketData, cityName: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <select
            value={newMarketData.region}
            onChange={(e) => setNewMarketData({ ...newMarketData, region: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="egypt">Egypt</option>
            <option value="north_africa">North Africa</option>
            <option value="levant">Levant</option>
            <option value="gulf">Gulf</option>
            <option value="sub_saharan_africa">Sub-Saharan Africa</option>
          </select>
          <div className="flex gap-2">
            <button onClick={handleAddMarket} className="bg-orange-500 text-white px-4 py-2 rounded">
              Create Market
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Markets Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3">Market</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Score</th>
              <th className="text-left px-4 py-3">Users</th>
              <th className="text-left px-4 py-3">FOs</th>
              <th className="text-left px-4 py-3">Revenue</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {markets.map(market => (
              <tr key={market.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-bold">
                  {market.flagEmoji} {market.cityName}, {market.countryName}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    market.expansionStatus === 'active' ? 'bg-green-100 text-green-700' :
                    market.expansionStatus === 'under_evaluation' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {market.expansionStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-bold text-lg">{market.overallReadinessScore || '—'}</span>
                  {market.readinessGrade && <span className="text-xs text-gray-500"> ({market.readinessGrade})</span>}
                </td>
                <td className="px-4 py-3">{(market.totalRegisteredUsers || 0).toLocaleString()}</td>
                <td className="px-4 py-3">{market.activeFOs || 0}</td>
                <td className="px-4 py-3 text-green-600 font-bold">${(market.platformRevenueMonthly || 0).toLocaleString()}</td>
                <td className="px-4 py-3 space-y-1">
                  <button
                    onClick={() => handleEvaluate(market.id)}
                    className="block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    🤖 Evaluate
                  </button>
                  <button
                    onClick={() => setSelectedMarket(market.id)}
                    className="block text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Market Detail */}
      {current && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold">{current.flagEmoji} {current.cityName}, {current.countryName}</h2>
          
          {current.overallReadinessScore && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Overall Readiness</p>
                <p className="text-3xl font-black">{current.overallReadinessScore}</p>
                <p className="text-sm font-bold text-orange-600">{current.readinessGrade}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Recommendation</p>
                <p className="text-lg font-bold text-green-600">{current.aiExpansionRecommendation}</p>
                <p className="text-xs text-gray-500">Last analyzed: {new Date(current.lastAnalyzed).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          
          {current.aiMarketSummary && (
            <div>
              <p className="font-bold mb-2">Market Summary</p>
              <p className="text-gray-700 text-sm leading-relaxed">{current.aiMarketSummary}</p>
            </div>
          )}

          {current.aiOpportunities && current.aiOpportunities.length > 0 && (
            <div>
              <p className="font-bold mb-2">Key Opportunities</p>
              <ul className="space-y-1 text-sm">
                {current.aiOpportunities.map((opp, i) => (
                  <li key={i} className="flex gap-2">
                    <span>✓</span> {opp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {current.aiRiskFactors && current.aiRiskFactors.length > 0 && (
            <div>
              <p className="font-bold mb-2">Key Risks</p>
              <ul className="space-y-1 text-sm">
                {current.aiRiskFactors.map((risk, i) => (
                  <li key={i} className="flex gap-2">
                    <span>⚠</span> {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => handleEvaluate(current.id)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            🤖 Run AI Analysis
          </button>
        </div>
      )}
    </div>
  );
}