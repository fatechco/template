import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';

const SECTIONS = [
  { key: 'prices', icon: '💰', label: 'Property Prices' },
  { key: 'rental', icon: '🔑', label: 'Rental Market' },
  { key: 'life', icon: '🌟', label: 'Life Quality' },
  { key: 'investment', icon: '📈', label: 'Investment' },
  { key: 'legal', icon: '⚖️', label: 'Buying Process' },
  { key: 'community', icon: '🏘️', label: 'Community' },
];

function getScoreColor(score) {
  if (score >= 80) return 'text-green-600 bg-green-50';
  if (score >= 60) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
}

function getRecommendationColor(rec) {
  if (rec === 'proceed' || rec === 'accelerate') return 'bg-green-100 text-green-700';
  if (rec === 'delay') return 'bg-orange-100 text-orange-700';
  if (rec === 'modify_approach') return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}

export default function TwinCitiesCompare() {
  const [markets, setMarkets] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('prices');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiBrief, setAiBrief] = useState(null);

  useEffect(() => {
    base44.entities.MarketProfile.filter({ isPublic: true }, '-sortOrder', 100)
      .then(data => {
        setMarkets(data);
        // auto-select up to 2 if query params
        const params = new URLSearchParams(window.location.search);
        const codes = params.get('m')?.split(',') || [];
        const preSelected = data.filter(m => codes.includes(m.marketCode)).slice(0, 3);
        if (preSelected.length > 0) setSelected(preSelected.map(m => m.id));
        else if (data.length >= 2) setSelected([data[0].id, data[1]?.id].filter(Boolean));
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedMarkets = selected.map(id => markets.find(m => m.id === id)).filter(Boolean);

  const toggleMarket = (id) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const generateAIBrief = async () => {
    setAiLoading(true);
    try {
      const prompt = `Compare these real estate markets for a potential buyer/investor:
      
${selectedMarkets.map(m => `
${m.cityName}, ${m.countryName}:
- Readiness: ${m.overallReadinessScore || 'N/A'} (${m.readinessGrade || 'N/A'})
- Avg property price: $${m.medianPropertyPriceUSD || 'N/A'}/m²
- Rental yield: ${m.avgRentalYieldPercent || 'N/A'}%
- Foreign ownership: ${m.foreignOwnershipAllowed ? 'Allowed' : 'Restricted'}
- Status: ${m.expansionStatus}
- Monthly revenue (Kemedar): $${m.platformRevenueMonthly || 0}
`).join('\n')}

Provide a comprehensive investment comparison. For each market give:
1. Investment potential (2-3 sentences)
2. Best for: what type of buyer/investor
3. Key advantage over other markets
4. One key risk

End with a clear recommendation: which market to choose for buying, which for investing, which for living.`;

      const result = await base44.integrations.Core.InvokeLLM({ prompt });
      setAiBrief(result);
    } finally {
      setAiLoading(false);
    }
  };

  const COMPARISON_DATA = (market) => ({
    prices: [
      { label: 'Avg Price/m²', value: market.medianPropertyPriceUSD ? `$${market.medianPropertyPriceUSD.toLocaleString()}` : '—' },
      { label: 'Rental Yield', value: market.avgRentalYieldPercent ? `${market.avgRentalYieldPercent}%` : '—' },
      { label: 'Foreign Buyers', value: market.foreignOwnershipAllowed ? '✅ Allowed' : '⚠️ Limited' },
      { label: 'Currency', value: `${market.currencySymbol || ''} ${market.currency}` },
    ],
    rental: [
      { label: 'Avg Yield', value: market.avgRentalYieldPercent ? `${market.avgRentalYieldPercent}%` : '—' },
      { label: 'Market Size', value: market.population ? `${(market.population / 1e6).toFixed(1)}M pop` : '—' },
      { label: 'Status', value: market.expansionStatus || '—' },
    ],
    life: [
      { label: 'Internet', value: market.internetPenetrationPercent ? `${market.internetPenetrationPercent}%` : '—' },
      { label: 'GDP/Capita', value: market.gdpPerCapitaUSD ? `$${market.gdpPerCapitaUSD.toLocaleString()}` : '—' },
      { label: 'Region', value: market.region?.replace(/_/g, ' ') || '—' },
    ],
    investment: [
      { label: 'Readiness Score', value: market.overallReadinessScore ? `${market.overallReadinessScore}/100` : '—' },
      { label: 'Grade', value: market.readinessGrade || '—' },
      { label: 'AI Recommendation', value: market.aiExpansionRecommendation || '—' },
      { label: 'Opportunities', value: market.aiOpportunities?.length > 0 ? `${market.aiOpportunities.length} identified` : '—' },
    ],
    legal: [
      { label: 'Foreign Ownership', value: market.foreignOwnershipAllowed ? '✅ Allowed' : '⚠️ Limited' },
      { label: 'Currency', value: market.currency },
      { label: 'Kemedar', value: market.expansionStatus === 'active' ? '✅ Full Platform' : '🔜 Coming Soon' },
    ],
    community: [
      { label: 'Population', value: market.population ? `${(market.population / 1e6).toFixed(1)}M` : '—' },
      { label: 'Languages', value: market.languages?.join(', ') || '—' },
      { label: 'Active FOs', value: market.activeFOs || 0 },
    ]
  });

  if (loading) return <div className="p-20 text-center text-gray-500">Loading markets...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-3">
            <Link to="/kemedar/twin-cities" className="text-gray-500 hover:text-gray-700 text-sm">← Back</Link>
            <h1 className="text-xl font-black text-gray-900">📊 Market Comparison</h1>
          </div>

          {/* Market Selector */}
          <div className="flex gap-2 flex-wrap">
            {markets.map(m => (
              <button
                key={m.id}
                onClick={() => toggleMarket(m.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border transition ${
                  selected.includes(m.id)
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
                }`}
              >
                {m.flagEmoji} {m.cityName}
                {selected.includes(m.id) && <span className="ml-1 opacity-70">×</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {selectedMarkets.length < 2 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-4xl mb-4">📊</p>
            <p className="font-bold text-lg">Select at least 2 markets to compare</p>
          </div>
        ) : (
          <>
            {/* Section Nav */}
            <div className="flex gap-1 overflow-x-auto no-scrollbar bg-white rounded-xl p-1 shadow-sm">
              {SECTIONS.map(sec => (
                <button
                  key={sec.key}
                  onClick={() => setActiveSection(sec.key)}
                  className={`flex-shrink-0 flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    activeSection === sec.key
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {sec.icon} {sec.label}
                </button>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left px-6 py-4 text-sm text-gray-500 font-semibold w-40">Metric</th>
                      {selectedMarkets.map(m => (
                        <th key={m.id} className="text-left px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{m.flagEmoji}</span>
                            <div>
                              <p className="font-bold text-gray-900">{m.cityName}</p>
                              <p className="text-xs text-gray-500">{m.countryName}</p>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_DATA(selectedMarkets[0])[activeSection]?.map((row, i) => (
                      <tr key={row.label} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-6 py-3 text-sm font-semibold text-gray-700">{row.label}</td>
                        {selectedMarkets.map(m => {
                          const val = COMPARISON_DATA(m)[activeSection]?.[i]?.value;
                          return (
                            <td key={m.id} className="px-6 py-3 text-sm font-bold text-gray-900">{val}</td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Brief */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-black text-gray-900 text-lg">🤖 AI Market Brief</h3>
                  <p className="text-sm text-gray-600">Personalized analysis based on the selected markets</p>
                </div>
                <button
                  onClick={generateAIBrief}
                  disabled={aiLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-60"
                >
                  {aiLoading ? '⏳ Analyzing...' : '🤖 Generate Brief'}
                </button>
              </div>

              {aiBrief && (
                <div className="prose prose-sm max-w-none text-gray-800 bg-white rounded-xl p-5 whitespace-pre-wrap">
                  {aiBrief}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}