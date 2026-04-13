import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, MicOff, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AIMatchScoreBadge from '@/components/ai-search/AIMatchScoreBadge';
import AIMatchModal from '@/components/ai-search/AIMatchModal';

const EXAMPLE_CHIPS = [
  "3-bed near Metro",
  "Villa with pool",
  "Studio investment",
  "New Cairo apt",
  "Sheikh Zayed villa",
  "Under 2M EGP",
  "Near schools",
  "Modern finish",
];

const STEPS = [
  '🧠 Understanding your needs...',
  '🔍 Extracting criteria...',
  '📊 Searching database...',
  '🤖 Ranking matches...',
];

function MobileProcessing() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timers = STEPS.map((_, i) => setTimeout(() => setStep(i + 1), (i + 1) * 1000));
    return () => timers.forEach(clearTimeout);
  }, []);
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-purple-700 to-purple-900 flex flex-col items-center justify-center px-6">
      <p className="text-white text-xl font-black mb-8">Finding your perfect property...</p>
      <div className="w-full max-w-xs space-y-4">
        {STEPS.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 transition-all ${i < step ? 'opacity-100' : i === step ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black ${i < step ? 'bg-green-400 text-green-900' : i === step ? 'bg-white text-purple-800 animate-pulse' : 'bg-white/20 text-white'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <p className={`text-sm font-semibold ${i === step ? 'text-white' : 'text-white/60'}`}>{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobilePropertyCard({ p, insight, onAnalysis }) {
  const [showPoints, setShowPoints] = useState(false);
  const img = p.main_image || p.images?.[0] || `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80`;
  const matchPoints = insight?.matchPoints || [];
  const concern = insight?.concern;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="relative">
        <img src={img} alt={p.title} className="w-full h-44 object-cover" />
        <div className="absolute top-2 right-2">
          <AIMatchScoreBadge score={p._matchScore || 0} />
        </div>
        {p.purpose && (
          <span className="absolute bottom-2 left-2 bg-[#FF6B00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {p.purpose}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="font-black text-gray-900 text-sm line-clamp-1">{p.title || 'Property Listing'}</p>
        <p className="text-xs text-gray-500 mt-0.5">📍 {[p.district_name, p.city_name].filter(Boolean).join(', ') || 'TBD'}</p>
        <p className="text-base font-black text-[#FF6B00] mt-1">
          {p.price_amount ? `${p.currency || 'EGP'} ${Number(p.price_amount).toLocaleString()}` : 'Price on request'}
        </p>
        <div className="flex gap-3 text-xs text-gray-500 mt-1">
          {(p.beds || p.bedrooms) > 0 && <span>🛏 {p.beds || p.bedrooms}</span>}
          {(p.baths || p.bathrooms) > 0 && <span>🚿 {p.baths || p.bathrooms}</span>}
          {(p.area_size || p.property_area) > 0 && <span>📐 {p.area_size || p.property_area}m²</span>}
        </div>

        {/* Match points toggle */}
        <button
          onClick={() => setShowPoints(!showPoints)}
          className="mt-2 text-xs text-purple-600 font-semibold flex items-center gap-1"
        >
          {showPoints ? '▲' : '▼'} Why this matches?
        </button>
        {showPoints && (
          <div className="mt-1.5 space-y-1">
            {matchPoints.slice(0, 3).map((pt, i) => (
              <p key={i} className="text-[11px] text-gray-500 flex items-start gap-1">
                <span className="text-green-500 flex-shrink-0">✅</span>{pt}
              </p>
            ))}
            {concern && (
              <p className="text-[11px] text-amber-600 flex items-start gap-1">
                <span className="flex-shrink-0">⚠️</span>{concern}
              </p>
            )}
            <button onClick={() => onAnalysis(p, insight)} className="text-[11px] text-purple-600 font-bold mt-1">
              Full AI Analysis →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MobileAIPropertySearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [insights, setInsights] = useState({});
  const [criteria, setCriteria] = useState(null);
  const [originalQuery, setOriginalQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [refineInput, setRefineInput] = useState('');
  const [refineLoading, setRefineLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const doSearch = async (q, refinement = null) => {
    if (!q.trim()) return;
    setLoading(true);
    if (!refinement) {
      setResults(null);
      setCriteria(null);
      setInsights({});
      setOriginalQuery(q);
    }

    const res = await base44.functions.invoke('processAIPropertySearch', {
      userQuery: q,
      language: 'en',
      refinement
    });

    setLoading(false);
    setRefineLoading(false);

    if (res.data?.success) {
      setCriteria(res.data.criteria);
      setResults(res.data.results || []);
      setInsights(res.data.insights || {});
    }
  };

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser.');
      return;
    }
    if (listening) { setListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = 'en-US';
    r.onresult = e => { setQuery(e.results[0][0].transcript); setListening(false); };
    r.onend = () => setListening(false);
    r.start();
    setListening(true);
  };

  const handleRefine = () => {
    if (!refineInput.trim()) return;
    setRefineLoading(true);
    doSearch(originalQuery, refineInput);
    setRefineInput('');
  };

  if (loading) return <MobileProcessing />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 flex items-center gap-3 px-4" style={{ height: 52 }}>
        <button onClick={() => navigate(-1)} className="p-1 -ml-1">
          <ArrowLeft size={22} className="text-gray-900" />
        </button>
        <span className="flex-1 text-center font-black text-gray-900 text-base">🤖 AI Property Search</span>
        <button onClick={handleVoice} className={`p-1 ${listening ? 'text-red-500 animate-pulse' : 'text-purple-600'}`}>
          {listening ? <MicOff size={22} /> : <Mic size={22} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Input Card */}
        <div className="m-4 bg-white rounded-2xl border-2 border-purple-400 shadow-sm overflow-hidden">
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Describe your ideal property...\n\nE.g. '3-bedroom apartment in New Cairo under 3M EGP with parking and garden'"
            className="w-full px-4 pt-4 pb-3 text-gray-800 placeholder-gray-400 italic text-sm leading-relaxed resize-none focus:outline-none bg-transparent"
            style={{ minHeight: 110 }}
          />
          <div className="flex gap-2 px-3 pb-3">
            <button
              onClick={handleVoice}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                listening ? 'border-red-500 bg-red-50 text-red-600 animate-pulse' : 'border-purple-300 bg-purple-50 text-purple-700'
              }`}
            >
              {listening ? <MicOff size={16} /> : <Mic size={16} />}
              {listening ? 'Listening...' : '🎤 Voice'}
            </button>
            <button
              onClick={() => doSearch(query)}
              disabled={!query.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 text-white text-sm font-black disabled:opacity-50"
            >
              🤖 Find
            </button>
          </div>
        </div>

        {/* Example chips */}
        <div className="px-4 mb-4">
          <p className="text-xs text-gray-400 mb-2">Try asking:</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {EXAMPLE_CHIPS.map((chip, i) => (
              <button
                key={i}
                onClick={() => setQuery(chip)}
                className="flex-shrink-0 bg-white border border-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Requirements */}
        {criteria && (
          <div className="px-4 mb-4">
            <div className="bg-white rounded-2xl border border-purple-200 p-3">
              <p className="font-black text-gray-900 text-xs mb-2">AI Understood:</p>
              <div className="flex flex-wrap gap-1.5">
                {criteria.locations?.length > 0 && (
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-200">
                    📍 {criteria.locations.map(l => l.name).join(', ')}
                  </span>
                )}
                {criteria.budgetMax && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-200">
                    💰 Max {Number(criteria.budgetMax).toLocaleString()} {criteria.currency || 'EGP'}
                  </span>
                )}
                {criteria.bedroomsMin != null && (
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full border border-orange-200">
                    🛏 {criteria.bedroomsMin}+ beds
                  </span>
                )}
                {criteria.propertyType && (
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full border border-gray-200">
                    🏠 {criteria.propertyType}
                  </span>
                )}
                {(criteria.mustHaveAmenities || []).map((a, i) => (
                  <span key={i} className="bg-teal-50 text-teal-700 text-xs px-2 py-0.5 rounded-full border border-teal-200">
                    ✅ {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {results !== null && (
          <div className="px-4 space-y-3">
            {results.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <p className="text-4xl mb-2">🏠</p>
                <p className="font-bold text-gray-600">No matching properties found</p>
                <p className="text-xs text-gray-400 mt-1">Try refining your search below</p>
              </div>
            ) : (
              <>
                <p className="font-black text-gray-900 text-sm">{results.length} Properties Found 🎯</p>
                {results.map(p => (
                  <MobilePropertyCard
                    key={p.id}
                    p={p}
                    insight={insights[p.id]}
                    onAnalysis={(prop, ins) => setSelectedProperty({ property: prop, insight: ins })}
                  />
                ))}
              </>
            )}
          </div>
        )}

        {results === null && !loading && (
          <div className="text-center py-12 text-gray-400 px-4">
            <p className="text-5xl mb-3">🤖</p>
            <p className="font-bold text-gray-500">Describe your ideal property above</p>
            <p className="text-xs mt-1">Use voice or type — I understand natural language!</p>
          </div>
        )}
      </div>

      {/* Sticky Refine Bar */}
      {results !== null && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40 flex gap-2">
          <input
            value={refineInput}
            onChange={e => setRefineInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRefine()}
            placeholder="💬 Refine your search..."
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
            disabled={refineLoading}
          />
          <button
            onClick={handleRefine}
            disabled={!refineInput.trim() || refineLoading}
            className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50"
          >
            {refineLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      )}

      {/* Match Analysis Modal */}
      {selectedProperty && (
        <AIMatchModal
          property={selectedProperty.property}
          insight={selectedProperty.insight}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}