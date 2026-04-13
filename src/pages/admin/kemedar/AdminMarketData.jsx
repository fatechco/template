import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { formatCurrency } from '@/components/valuation/ValuationUtils';

export default function AdminMarketData() {
  const [tab, setTab] = useState('price-index');
  const [marketData, setMarketData] = useState([]);
  const [valuations, setValuations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (tab === 'price-index') {
        const data = await base44.entities.MarketPriceIndex.list('-lastUpdated', 100);
        setMarketData(data || []);
      } else {
        const data = await base44.entities.PropertyValuation.list('-created_date', 100);
        setValuations(data || []);
      }
      setLoading(false);
    };
    load();
  }, [tab]);

  const handleSave = async (item) => {
    if (item.id) {
      await base44.entities.MarketPriceIndex.update(item.id, item);
    } else {
      await base44.entities.MarketPriceIndex.create(item);
    }
    setEditing(null);
    const data = await base44.entities.MarketPriceIndex.list('-lastUpdated', 100);
    setMarketData(data || []);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">📊 Market Data</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage market price indices and valuation reports</p>
        </div>
        {tab === 'price-index' && (
          <button onClick={() => setEditing({})} className="bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors">
            + Add Market Data
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {[['price-index', '📈 Price Index'], ['valuations', '📋 Valuation Reports']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${tab === key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : tab === 'price-index' ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <tr>
                  {['Location', 'Type', 'Purpose', 'Avg $/m²', 'Listings', 'Demand', '12M Trend', 'Last Updated', 'Source', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {marketData.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{row.districtName || row.cityName || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{row.propertyType}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${row.purpose === 'Sale' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {row.purpose}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">{formatCurrency(row.avgPricePerSqm)}</td>
                    <td className="px-4 py-3 text-gray-600">{row.activeListings || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${row.demandScore || 0}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{row.demandScore || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold text-sm ${(row.priceChange12Months || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {(row.priceChange12Months || 0) >= 0 ? '↑' : '↓'} {Math.abs(row.priceChange12Months || 0).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{row.lastUpdated ? new Date(row.lastUpdated).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${row.dataSource === 'kemedar_listings' ? 'bg-purple-100 text-purple-700' : row.dataSource === 'manual' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                        {row.dataSource || 'manual'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setEditing(row)} className="text-xs text-blue-600 hover:underline font-semibold">Edit</button>
                    </td>
                  </tr>
                ))}
                {marketData.length === 0 && (
                  <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-400">No market data found. Add your first data point.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <p className="text-2xl font-black text-gray-900">{valuations.length}</p>
              <p className="text-xs text-gray-500 font-semibold mt-1">Total Valuations</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <p className="text-2xl font-black text-gray-900">{valuations.filter(v => new Date(v.created_date) > new Date(Date.now() - 30 * 24 * 3600 * 1000)).length}</p>
              <p className="text-xs text-gray-500 font-semibold mt-1">This Month</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <p className="text-2xl font-black text-gray-900">{valuations.length > 0 ? Math.round(valuations.reduce((s, v) => s + (v.accuracyScore || 0), 0) / valuations.length) : 0}%</p>
              <p className="text-xs text-gray-500 font-semibold mt-1">Avg Accuracy</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                  <tr>
                    {['User', 'Type', 'Location', 'Est. Value', 'Grade', 'Accuracy', 'Date'].map(h => (
                      <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {valuations.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600 text-xs">{v.created_by || '—'}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{v.propertyType}</td>
                      <td className="px-4 py-3 text-gray-600">{v.cityName || '—'}</td>
                      <td className="px-4 py-3 font-bold text-blue-600">{formatCurrency(v.estimatedPriceMid)}</td>
                      <td className="px-4 py-3"><span className="font-black text-sm" style={{ color: ({ 'A+': '#10B981', 'A': '#34D399', 'B+': '#F59E0B', 'B': '#FBBF24', 'C': '#F97316', 'D': '#EF4444' })[v.investmentGrade] }}>{v.investmentGrade}</span></td>
                      <td className="px-4 py-3 text-gray-600">{v.accuracyScore || 0}%</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{v.created_date ? new Date(v.created_date).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                  {valuations.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No valuations yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-gray-900 text-lg mb-4">{editing.id ? 'Edit Market Data' : 'Add Market Data'}</h3>
            <div className="space-y-3">
              {[
                { key: 'propertyType', label: 'Property Type', placeholder: 'e.g. Apartment' },
                { key: 'purpose', label: 'Purpose', placeholder: 'Sale or Rent' },
                { key: 'cityName', label: 'City Name', placeholder: 'e.g. Cairo' },
                { key: 'districtName', label: 'District Name', placeholder: 'e.g. Nasr City' },
                { key: 'avgPricePerSqm', label: 'Avg Price/m²', type: 'number' },
                { key: 'avgSize', label: 'Avg Size (sqm)', type: 'number' },
                { key: 'activeListings', label: 'Active Listings', type: 'number' },
                { key: 'demandScore', label: 'Demand Score (0-100)', type: 'number' },
                { key: 'avgRentalYield', label: 'Avg Rental Yield (%)', type: 'number' },
                { key: 'priceChange12Months', label: '12M Price Change (%)', type: 'number' },
                { key: 'avgDaysOnMarket', label: 'Avg Days on Market', type: 'number' },
              ].map(({ key, label, type = 'text', placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                  <input type={type} value={editing[key] || ''} placeholder={placeholder}
                    onChange={e => setEditing(prev => ({ ...prev, [key]: type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditing(null)} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleSave({ ...editing, dataSource: 'manual', lastUpdated: new Date().toISOString() })} className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}