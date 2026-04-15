// @ts-nocheck
import { PROPERTY_TYPES } from './ValuationUtils';

const FINISHING_OPTIONS = ['Unfinished', 'Semi-finished', 'Finished', 'Fully Furnished'];
const VIEW_OPTIONS = ['Street', 'Garden', 'City', 'Sea', 'Pool', 'None'];
const AMENITIES = [
  { key: 'hasParking', label: 'Parking' },
  { key: 'hasPool', label: 'Swimming Pool' },
  { key: 'hasGarden', label: 'Garden' },
  { key: 'hasBalcony', label: 'Balcony' },
  { key: 'hasStorage', label: 'Storage' },
  { key: 'hasSecurity', label: 'Security' },
];

function Stepper({ value, onChange, min = 0, max = 20 }) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={() => onChange(Math.max(min, (value || 0) - 1))} className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-400 font-bold text-lg transition-colors">−</button>
      <span className="w-8 text-center font-bold text-gray-900">{value || 0}</span>
      <button onClick={() => onChange(Math.min(max, (value || 0) + 1))} className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-400 font-bold text-lg transition-colors">+</button>
    </div>
  );
}

export default function ValuationStep3Details({ data, onChange, onNext, onBack }) {
  const canProceed = data.propertyType && data.purpose && data.totalArea > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Enter property details</h2>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">Property type</label>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
          {PROPERTY_TYPES.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => onChange('propertyType', label)}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 w-20 py-3 rounded-xl border-2 transition-all ${
                data.propertyType === label ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Purpose */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Purpose</label>
        <div className="flex gap-3">
          {['Sale', 'Rent'].map(p => (
            <button key={p} onClick={() => onChange('purpose', p)}
              className={`px-6 py-2.5 rounded-xl border-2 font-semibold text-sm transition-colors ${data.purpose === p ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
              {p === 'Sale' ? 'For Sale' : 'For Rent'}
            </button>
          ))}
        </div>
      </div>

      {/* Total Area */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Total Area</label>
        <div className="relative">
          <input type="number" value={data.totalArea || ''} onChange={e => onChange('totalArea', parseFloat(e.target.value))}
            placeholder="e.g. 120"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">sqm</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Enter the total property area</p>
      </div>

      {/* Bedrooms & Bathrooms */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Bedrooms</label>
          <Stepper value={data.bedrooms} onChange={v => onChange('bedrooms', v)} min={0} max={10} />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Bathrooms</label>
          <Stepper value={data.bathrooms} onChange={v => onChange('bathrooms', v)} min={1} max={10} />
        </div>
      </div>

      {/* Floor */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Floor Number</label>
        <input type="number" value={data.floor || ''} onChange={e => onChange('floor', parseInt(e.target.value))}
          placeholder="e.g. 5"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
      </div>

      {/* Year Built */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Year Built (optional)</label>
        <input type="number" value={data.yearBuilt || ''} onChange={e => onChange('yearBuilt', parseInt(e.target.value))}
          placeholder="e.g. 2018" min="1970" max="2025"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
      </div>

      {/* Finishing */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Finishing</label>
        <div className="flex flex-wrap gap-2">
          {FINISHING_OPTIONS.map(f => (
            <button key={f} onClick={() => onChange('finishing', f)}
              className={`px-4 py-2 rounded-xl border-2 font-semibold text-sm transition-colors ${data.finishing === f ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Additional Features</label>
        <div className="grid grid-cols-3 gap-2">
          {AMENITIES.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!!data[key]} onChange={e => onChange(key, e.target.checked)}
                className="w-4 h-4 rounded accent-blue-600" />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* View Type */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">View Type</label>
        <div className="flex flex-wrap gap-2">
          {VIEW_OPTIONS.map(v => (
            <button key={v} onClick={() => onChange('viewType', v)}
              className={`px-4 py-2 rounded-xl border-2 font-semibold text-sm transition-colors ${data.viewType === v ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">Back</button>
        <button onClick={onNext} disabled={!canProceed} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl transition-colors">
          Get Valuation
        </button>
      </div>
    </div>
  );
}