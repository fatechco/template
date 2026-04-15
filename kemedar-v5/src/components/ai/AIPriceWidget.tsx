"use client";
// @ts-nocheck
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

const STEPS = [
  '🔍 Searching comparable properties...',
  '📊 Analyzing market data...',
  '🧠 AI is calculating optimal price...',
  '✅ Price recommendation ready!',
];

// ── Loading Steps ────────────────────────────────────────────────────────────
function LoadingState() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((_, i) => setTimeout(() => setStep(i), i * 1500));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-5">
      <div className="w-full h-1.5 bg-purple-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full transition-all duration-700"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>
      <div className="space-y-2">
        {STEPS.map((s, i) => (
          <p key={i} className={`text-sm transition-all ${
            i < step ? 'text-purple-400' : i === step ? 'text-purple-800 font-bold' : 'text-purple-300'
          }`}>
            {i < step ? '✓ ' : ''}{s}
          </p>
        ))}
      </div>
    </div>
  );
}

// ── Factor Row ───────────────────────────────────────────────────────────────
function FactorRow({ factor }) {
  const isPos = factor.impact === 'positive';
  const isNeg = factor.impact === 'negative';
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-black text-sm ${
        isPos ? 'bg-green-100 text-green-600' :
        isNeg ? 'bg-red-100 text-red-500' :
        'bg-gray-100 text-gray-500'
      }`}>
        {isPos ? '↑' : isNeg ? '↓' : '→'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-900 truncate">{factor.factor}</p>
        <p className="text-xs text-gray-400 truncate">{factor.description}</p>
      </div>
      <span className={`text-xs font-black flex-shrink-0 ${
        isPos ? 'text-green-600' : isNeg ? 'text-red-500' : 'text-gray-400'
      }`}>
        {factor.adjustment}
      </span>
    </div>
  );
}

// ── Comparable Mini Card ─────────────────────────────────────────────────────
function ComparableCard({ item, currency }) {
  return (
    <div className="flex-shrink-0 w-28 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="h-14 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <span className="text-2xl">🏠</span>
      </div>
      <div className="p-2">
        {item.totalArea && <p className="text-[10px] text-gray-400">{item.totalArea} m²</p>}
        {item.price && (
          <p className="text-xs font-black text-gray-900 truncate">
            {currency} {Number(item.price).toLocaleString()}
          </p>
        )}
        {item.pricePerSqm && (
          <p className="text-[10px] text-blue-600 font-bold">{Number(item.pricePerSqm).toLocaleString()}/m²</p>
        )}
        {item.daysListed != null && (
          <p className="text-[10px] text-gray-300">{item.daysListed}d listed</p>
        )}
      </div>
    </div>
  );
}

// ── Main Result Card ─────────────────────────────────────────────────────────
function ResultCard({ result, comparables, onUsePrice, onRecalculate, currency }) {
  const conf = result.confidenceScore || 0;
  const confColor = conf >= 75 ? 'bg-green-100 text-green-700' :
                    conf >= 50 ? 'bg-orange-100 text-orange-600' :
                    'bg-red-100 text-red-500';
  const fmt = (v) => v ? Number(v).toLocaleString() : '—';

  return (
    <div className="space-y-4">
      {/* Main price card */}
      <div className="bg-white rounded-2xl shadow-lg border-l-[6px] border-purple-600 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
              <span className="text-sm">🧠</span>
            </div>
            <span className="font-black text-gray-900 text-sm">AI Price Recommendation</span>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${confColor}`}>
            {conf}% Confidence
          </span>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-400 mb-1">
            {result.currency} {fmt(result.priceRangeMin)} — {fmt(result.priceRangeMax)}
          </p>
          <p className="text-4xl font-black text-purple-700 leading-none">
            {result.currency} {fmt(result.suggestedPrice)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Suggested listing price</p>
          {result.pricePerSqm && (
            <p className="text-sm font-bold text-purple-500 mt-1">
              {result.currency} {fmt(result.pricePerSqm)} / m²
            </p>
          )}
        </div>

        <button
          onClick={() => onUsePrice(result.suggestedPrice)}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white font-black py-3 rounded-xl text-sm mb-2 hover:opacity-90 transition-opacity"
        >
          ✅ Use This Price
        </button>
        <button
          onClick={onRecalculate}
          className="w-full text-purple-500 text-xs font-semibold hover:underline py-1"
        >
          🔄 Recalculate
        </button>
      </div>

      {/* Pricing factors */}
      {result.pricingFactors?.length > 0 && (
        <div>
          <p className="font-black text-gray-900 text-sm mb-2">Why This Price?</p>
          <div className="space-y-2">
            {result.pricingFactors.map((f, i) => <FactorRow key={i} factor={f} />)}
          </div>
        </div>
      )}

      {/* Market insights */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
        <p className="font-black text-gray-900 text-sm">📊 Market Insights</p>
        {result.marketInsights && (
          <p className="text-xs text-gray-500 leading-relaxed">{result.marketInsights}</p>
        )}
        {result.bestTimeToList && (
          <div>
            <p className="text-xs font-bold text-gray-700">📅 Best Time to List:</p>
            <p className="text-xs text-gray-500">{result.bestTimeToList}</p>
          </div>
        )}
        {result.comparablesSummary && (
          <div>
            <p className="text-xs font-bold text-gray-700">🏠 Based on {comparables.length} comparable listings:</p>
            <p className="text-xs text-gray-500">{result.comparablesSummary}</p>
          </div>
        )}
        {result.recommendation && (
          <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
            <p className="text-xs text-purple-800 font-semibold">💡 {result.recommendation}</p>
          </div>
        )}
      </div>

      {/* Comparable carousel */}
      {comparables.length > 0 && (
        <div>
          <p className="font-black text-gray-900 text-sm mb-1">Similar Active Listings</p>
          <p className="text-xs text-gray-400 mb-2">{comparables.length} properties used in this analysis</p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
            {comparables.map((c, i) => (
              <ComparableCard key={i} item={c} currency={result.currency || currency} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Trigger Button ───────────────────────────────────────────────────────────
function TriggerButton({ onClick, comparablesHint, districtName, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-white border-2 border-purple-400 rounded-2xl p-4 flex items-center gap-3 hover:border-purple-600 hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center flex-shrink-0">
        <span className="text-xl">🤖</span>
      </div>
      <div className="flex-1 text-left">
        <p className="font-black text-gray-900 text-sm">🧠 Get AI Price Suggestion</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {disabled
            ? 'Fill in location & property details first'
            : comparablesHint
            ? `Based on listings in ${districtName || 'this area'}`
            : 'AI-powered pricing based on real listings'}
        </p>
      </div>
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold text-xs px-3 py-2 rounded-xl flex-shrink-0">
        Get Price →
      </div>
    </button>
  );
}

// ── Main Export ──────────────────────────────────────────────────────────────
/**
 * AIPriceWidget
 *
 * Props:
 *   formType: 'property' | 'product' | 'service'
 *   formData: current form data (needs cityId, category, purpose, area, bedrooms, etc.)
 *   onPriceSelected: (price: number) => void
 *   requiredFields: string[] — must be filled before enabling
 */
export default function AIPriceWidget({ formType, formData, onPriceSelected, requiredFields = [] }) {
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [result, setResult] = useState(null);
  const [comparables, setComparables] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [priceApplied, setPriceApplied] = useState(false);

  const missingFields = requiredFields.filter(f => !formData?.[f]);
  const isDisabled = missingFields.length > 0;

  const handleGetPrice = async () => {
    setStatus('loading');
    setResult(null);
    setErrorMsg(null);
    setPriceApplied(false);

    const res = await apiClient.post('/api/v1/ai/getAIPriceSuggestion', {
      formType,
      category: formData.category_name || formData.category_id || formData.category,
      purpose: formData.purpose,
      cityId: formData.city_id || formData.cityId,
      districtId: formData.district_id || formData.districtId,
      bedrooms: formData.beds || formData.bedrooms,
      area: formData.property_area || formData.area_size || formData.area,
      finishing: formData.finishing,
      amenities: formData.amenity_ids || [],
      floor: formData.floor_number || formData.floor,
      yearBuilt: formData.year_built,
      cityName: formData.city_name || formData.cityName,
      districtName: formData.district_name || formData.districtName,
      currency: formData.currency || 'EGP',
    });

    if (res.data?.success && res.data?.aiResult) {
      setResult(res.data.aiResult);
      setComparables(res.data.comparables || []);
      setStatus('done');
    } else {
      setErrorMsg('Could not generate price suggestion. Please try again.');
      setStatus('error');
    }
  };

  const handleUsePrice = (price) => {
    onPriceSelected(price);
    setPriceApplied(true);
  };

  const handleRecalculate = () => {
    setStatus('idle');
    setResult(null);
  };

  return (
    <div className="mb-5">
      {status === 'idle' && (
        <TriggerButton
          onClick={handleGetPrice}
          disabled={isDisabled}
          districtName={formData?.district_name || formData?.districtName}
          comparablesHint={!isDisabled}
        />
      )}

      {status === 'loading' && <LoadingState />}

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-sm text-red-600 font-bold mb-2">⚠️ {errorMsg}</p>
          <button onClick={handleGetPrice} className="text-xs text-red-500 font-semibold underline">🔄 Try Again</button>
        </div>
      )}

      {status === 'done' && result && (
        <ResultCard
          result={result}
          comparables={comparables}
          currency={formData?.currency || 'EGP'}
          onUsePrice={handleUsePrice}
          onRecalculate={handleRecalculate}
        />
      )}

      {priceApplied && status === 'done' && (
        <p className="text-xs text-purple-500 font-semibold mt-2 text-center">
          💡 AI suggested • You can still adjust the price
        </p>
      )}
    </div>
  );
}