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

function FactorRow({ factor }) {
  const isPos = factor.impact === 'positive';
  const isNeg = factor.impact === 'negative';
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-black text-sm ${
        isPos ? 'bg-green-100 text-green-600' : isNeg ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500'
      }`}>
        {isPos ? '↑' : isNeg ? '↓' : '→'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900">{factor.factor}</p>
        <p className="text-xs text-gray-400">{factor.description}</p>
      </div>
      <span className={`text-xs font-black flex-shrink-0 ${isPos ? 'text-green-600' : isNeg ? 'text-red-500' : 'text-gray-400'}`}>
        {factor.adjustment}
      </span>
    </div>
  );
}

// Full-screen loading overlay
function LoadingOverlay() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((_, i) => setTimeout(() => setStep(i), i * 1600));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-8">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center mb-6 shadow-xl">
        <span className="text-3xl animate-pulse">🧠</span>
      </div>
      <p className="font-black text-gray-900 text-xl mb-2">Analyzing Prices</p>
      <p className="text-gray-400 text-sm mb-8 text-center">Our AI is searching real listings for you</p>

      <div className="w-full max-w-xs">
        <div className="w-full h-2 bg-purple-100 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full transition-all duration-700"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <div className="space-y-3">
          {STEPS.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 transition-all ${
              i < step ? 'opacity-40' : i === step ? 'opacity-100' : 'opacity-20'
            }`}>
              <span className={`text-base ${i < step ? 'opacity-60' : ''}`}>{i < step ? '✅' : i === step ? '⏳' : '○'}</span>
              <p className={`text-sm ${i === step ? 'font-bold text-purple-800' : 'text-gray-500'}`}>{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Bottom sheet results
function ResultSheet({ result, comparables, currency, onUsePrice, onClose }) {
  const conf = result.confidenceScore || 0;
  const confColor = conf >= 75 ? 'text-green-600' : conf >= 50 ? 'text-orange-500' : 'text-red-500';
  const fmt = (v) => v ? Number(v).toLocaleString() : '—';

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="bg-white rounded-t-3xl overflow-hidden" style={{ height: '90vh' }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto h-full pb-32 px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <span className="text-sm">🧠</span>
              </div>
              <p className="font-black text-gray-900">AI Price Analysis</p>
            </div>
            <span className={`text-sm font-black ${confColor}`}>{conf}% Confidence</span>
          </div>

          {/* Main price */}
          <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 mb-4">
            <p className="text-sm text-gray-500 mb-1">
              {result.currency} {fmt(result.priceRangeMin)} — {fmt(result.priceRangeMax)}
            </p>
            <p className="text-4xl font-black text-purple-700">{result.currency} {fmt(result.suggestedPrice)}</p>
            <p className="text-xs text-gray-500 mt-1">Suggested listing price</p>
            {result.pricePerSqm && (
              <p className="text-sm font-bold text-purple-500 mt-1">{result.currency} {fmt(result.pricePerSqm)} / m²</p>
            )}
          </div>

          {/* Factors */}
          {result.pricingFactors?.length > 0 && (
            <div className="mb-4">
              <p className="font-black text-gray-900 mb-2">Why This Price?</p>
              <div className="bg-white rounded-2xl border border-gray-100 px-4">
                {result.pricingFactors.map((f, i) => <FactorRow key={i} factor={f} />)}
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 space-y-3">
            <p className="font-black text-gray-900 text-sm">📊 Market Insights</p>
            {result.marketInsights && <p className="text-xs text-gray-500 leading-relaxed">{result.marketInsights}</p>}
            {result.bestTimeToList && (
              <div>
                <p className="text-xs font-bold text-gray-700">📅 Best Time to List:</p>
                <p className="text-xs text-gray-500">{result.bestTimeToList}</p>
              </div>
            )}
            {result.comparablesSummary && (
              <p className="text-xs text-gray-500">{result.comparablesSummary}</p>
            )}
            {result.recommendation && (
              <div className="bg-purple-50 rounded-xl p-3">
                <p className="text-xs text-purple-800 font-semibold">💡 {result.recommendation}</p>
              </div>
            )}
          </div>

          {/* Comparables */}
          {comparables.length > 0 && (
            <div className="mb-4">
              <p className="font-black text-gray-900 text-sm mb-1">Similar Active Listings</p>
              <p className="text-xs text-gray-400 mb-2">{comparables.length} properties used</p>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {comparables.map((c, i) => (
                  <div key={i} className="flex-shrink-0 w-24 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                    <div className="h-12 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                      <span className="text-lg">🏠</span>
                    </div>
                    <div className="p-2">
                      {c.totalArea && <p className="text-[10px] text-gray-400">{c.totalArea}m²</p>}
                      {c.price && <p className="text-[10px] font-black text-gray-900 truncate">{(c.price / 1000000).toFixed(1)}M</p>}
                      {c.pricePerSqm && <p className="text-[10px] text-blue-600">{(c.pricePerSqm / 1000).toFixed(0)}k/m²</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky CTA */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4"
          style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
          <button
            onClick={() => { onUsePrice(result.suggestedPrice); onClose(); }}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white font-black py-4 rounded-2xl text-base"
          >
            ✅ Use This Price — {result.currency} {Number(result.suggestedPrice).toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MobileAIPriceWidget({ formType, formData, onPriceSelected, requiredFields = [] }) {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [comparables, setComparables] = useState([]);
  const [priceApplied, setPriceApplied] = useState(false);

  const missingFields = requiredFields.filter(f => !formData?.[f]);
  const isDisabled = missingFields.length > 0;

  const handleGetPrice = async () => {
    setStatus('loading');
    setResult(null);
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
      setStatus('error');
    }
  };

  const handleUsePrice = (price) => {
    onPriceSelected(price);
    setPriceApplied(true);
  };

  return (
    <>
      {/* Trigger card */}
      <button
        onClick={handleGetPrice}
        disabled={isDisabled}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl p-4 flex items-center gap-3 mb-4 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:opacity-90 transition-opacity"
      >
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-xl">🤖</span>
        </div>
        <div className="flex-1 text-left">
          <p className="font-black text-sm">🧠 Get AI Price Suggestion</p>
          <p className="text-purple-200 text-xs mt-0.5">
            {isDisabled ? 'Fill details above first' : `Powered by real listing data`}
          </p>
        </div>
        <span className="text-white/60 text-lg">›</span>
      </button>

      {priceApplied && (
        <p className="text-xs text-purple-600 font-semibold text-center -mt-2 mb-3">
          💡 AI suggested • You can still adjust
        </p>
      )}

      {/* Full screen loading */}
      {status === 'loading' && <LoadingOverlay />}

      {/* Error */}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
          <p className="text-sm text-red-600 font-bold mb-1">⚠️ Could not generate price suggestion</p>
          <button onClick={handleGetPrice} className="text-xs text-red-500 font-semibold underline">🔄 Try Again</button>
        </div>
      )}

      {/* Bottom sheet result */}
      {status === 'done' && result && (
        <ResultSheet
          result={result}
          comparables={comparables}
          currency={formData?.currency || 'EGP'}
          onUsePrice={handleUsePrice}
          onClose={() => setStatus('idle')}
        />
      )}
    </>
  );
}