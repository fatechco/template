import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';

const REASONS = ['work', 'family', 'lifestyle', 'lower_costs', 'better_quality', 'investment', 'education', 'retirement'];
const PRIORITIES = [
  { key: 'safety', icon: '🔒', label: 'Safety' },
  { key: 'education', icon: '🏫', label: 'Education' },
  { key: 'healthcare', icon: '🏥', label: 'Healthcare' },
  { key: 'climate', icon: '☀️', label: 'Climate' },
  { key: 'culture', icon: '🕌', label: 'Culture' },
  { key: 'career', icon: '💼', label: 'Career' },
  { key: 'costOfLiving', icon: '💰', label: 'Cost of Living' },
  { key: 'infrastructure', icon: '📶', label: 'Infrastructure' },
  { key: 'expatCommunity', icon: '🌍', label: 'Expat Community' },
  { key: 'affordability', icon: '🏠', label: 'Property Affordability' },
];

export default function TwinCitiesRelocate() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    currentCity: '',
    reasons: [],
    priorities: {},
    familySize: 1,
    hasChildren: false,
    timeline: '1_year',
    budget: 300000,
    rentOrBuy: 'buy',
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const update = (key, val) => setData(prev => ({ ...prev, [key]: val }));
  const toggleReason = (r) => update('reasons', data.reasons.includes(r) ? data.reasons.filter(x => x !== r) : [...data.reasons, r]);
  const setPriority = (key, val) => update('priorities', { ...data.priorities, [key]: val });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const user = await base44.auth.me().catch(() => null);
      const markets = await base44.entities.MarketProfile.filter({ isPublic: true }, '-sortOrder', 50);

      const prompt = `User wants to relocate. Profile:
Current city: ${data.currentCity}
Reasons: ${data.reasons.join(', ')}
Priorities (1-10): ${JSON.stringify(data.priorities)}
Family: ${data.familySize} people, children: ${data.hasChildren}
Timeline: ${data.timeline}
Budget: $${data.budget.toLocaleString()}
Preference: ${data.rentOrBuy}

Available markets:
${markets.map(m => `- ${m.cityName}, ${m.countryName} (${m.expansionStatus}) Score:${m.overallReadinessScore || 'N/A'}`).join('\n')}

Rank the top 3 best markets for this user. For each give:
1. Match score (0-100)
2. Why it fits (2 sentences, very specific to priorities)
3. Best neighborhood suggestion
4. Property budget expectation

Return JSON: {"matches": [{"cityName": string, "countryName": string, "flagEmoji": string, "score": number, "whyFits": string, "neighborhood": string, "budgetNote": string}]}`;

      const ai = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            matches: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  cityName: { type: 'string' },
                  countryName: { type: 'string' },
                  flagEmoji: { type: 'string' },
                  score: { type: 'number' },
                  whyFits: { type: 'string' },
                  neighborhood: { type: 'string' },
                  budgetNote: { type: 'string' }
                }
              }
            }
          }
        }
      });

      if (user) {
        const profile = await base44.entities.RelocationProfile.create({
          userId: user.id,
          currentCity: data.currentCity,
          relocationReason: data.reasons,
          timeline: data.timeline,
          familySize: data.familySize,
          hasChildren: data.hasChildren,
          priorities: data.priorities,
          budget: { forProperty: data.budget, rentOrBuy: data.rentOrBuy, currency: 'USD' },
          aiMatchScore: ai.matches.map(m => ({ marketName: m.cityName, score: m.score, reasons: [m.whyFits] }))
        });
      }

      setResults(ai.matches || []);
    } finally {
      setLoading(false);
    }
  };

  const MEDAL = ['🥇', '🥈', '🥉'];

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-5xl mb-6 animate-bounce">🌍</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Finding your perfect city...</h2>
      <p className="text-gray-500 text-sm">Analyzing markets based on your priorities</p>
    </div>
  );

  if (results) return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2">🎯 Your Top City Matches</h1>
          <p className="text-gray-500">Based on your priorities and profile</p>
        </div>

        <div className="space-y-5">
          {results.slice(0, 3).map((match, i) => (
            <div key={i} className={`bg-white rounded-2xl shadow-md p-6 border-l-4 ${i === 0 ? 'border-orange-500' : i === 1 ? 'border-gray-400' : 'border-amber-600'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{MEDAL[i]}</span>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">
                      {match.flagEmoji} {match.cityName}, {match.countryName}
                    </h3>
                    <p className="text-xs text-gray-500">Best for your profile</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-teal-600">{match.score}%</p>
                  <p className="text-xs text-gray-400">match</p>
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-4 leading-relaxed">{match.whyFits}</p>

              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs">Recommended Area</p>
                  <p className="font-bold">{match.neighborhood}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs">Budget Note</p>
                  <p className="font-bold">{match.budgetNote}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link to="/kemedar/twin-cities/compare" className="flex-1 text-center bg-orange-500 text-white font-bold py-2 rounded-lg text-sm hover:bg-orange-600">
                  📊 Full Analysis
                </Link>
                <Link to="/kemedar/search-properties" className="flex-1 text-center bg-gray-100 text-gray-700 font-bold py-2 rounded-lg text-sm hover:bg-gray-200">
                  🔍 Browse
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button onClick={() => { setResults(null); setStep(1); }} className="text-orange-600 font-semibold hover:underline">
            ← Start Over
          </button>
        </div>
      </div>
    </div>
  );

  const STEP_LABELS = ['Current Situation', 'Your Priorities', 'Family', 'Budget', 'Timeline'];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-xl mx-auto">
        {/* Progress */}
        <div className="flex gap-1 mb-8">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className={`flex-1 h-2 rounded-full ${i < step ? 'bg-orange-500' : 'bg-gray-200'}`} />
          ))}
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-2">🧳 Relocation Intelligence</h1>
        <p className="text-gray-500 mb-8 text-sm">Answer 5 quick questions to find your perfect city</p>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Where do you live now?</h2>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="e.g. Cairo, Egypt"
              value={data.currentCity}
              onChange={e => update('currentCity', e.target.value)}
            />

            <h2 className="text-xl font-bold text-gray-900">Why are you considering moving?</h2>
            <div className="flex flex-wrap gap-2">
              {REASONS.map(r => (
                <button
                  key={r}
                  onClick={() => toggleReason(r)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition capitalize ${
                    data.reasons.includes(r)
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
                  }`}
                >
                  {r.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">What matters most to you? (0–10)</h2>
            {PRIORITIES.map(p => (
              <div key={p.key} className="flex items-center gap-3">
                <span className="text-xl w-8">{p.icon}</span>
                <span className="text-sm font-semibold text-gray-700 w-36">{p.label}</span>
                <input
                  type="range" min="0" max="10" step="1"
                  value={data.priorities[p.key] || 5}
                  onChange={e => setPriority(p.key, Number(e.target.value))}
                  className="flex-1 accent-orange-500"
                />
                <span className="text-sm font-bold text-orange-600 w-6">{data.priorities[p.key] || 5}</span>
              </div>
            ))}
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Who is moving with you?</h2>
            <div className="space-y-3">
              {[
                { label: 'Just me', size: 1, children: false },
                { label: 'Me + partner', size: 2, children: false },
                { label: 'Family with young children', size: 4, children: true },
                { label: 'Family with teenagers', size: 4, children: true },
                { label: 'With elderly parents', size: 3, children: false },
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => { update('familySize', opt.size); update('hasChildren', opt.children); }}
                  className={`w-full text-left px-4 py-3 rounded-xl border font-semibold transition ${
                    data.familySize === opt.size && data.hasChildren === opt.children
                      ? 'bg-orange-50 border-orange-400 text-orange-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">What's your property budget?</h2>
            <div>
              <p className="text-2xl font-bold text-orange-600 mb-2">${data.budget.toLocaleString()}</p>
              <input
                type="range" min={50000} max={5000000} step={50000}
                value={data.budget}
                onChange={e => update('budget', Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$50K</span><span>$5M</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900">Buy or rent first?</h2>
            <div className="grid grid-cols-3 gap-2">
              {['buy', 'rent', 'undecided'].map(opt => (
                <button key={opt} onClick={() => update('rentOrBuy', opt)}
                  className={`py-3 rounded-xl font-semibold capitalize border transition ${data.rentOrBuy === opt ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-gray-200 text-gray-700'}`}>
                  {opt === 'buy' ? '🏠 Buy' : opt === 'rent' ? '🔑 Rent' : '🤔 Undecided'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">When do you want to move?</h2>
            <div className="space-y-3">
              {[
                { label: '🏃 In the next 3 months', val: 'immediately' },
                { label: '📅 Within 6 months', val: '6_months' },
                { label: '📆 Within 1 year', val: '1_year' },
                { label: '🗓️ In 1–2 years', val: '2_years' },
                { label: '🔍 Just exploring', val: 'exploring' },
              ].map(opt => (
                <button key={opt.val} onClick={() => update('timeline', opt.val)}
                  className={`w-full text-left px-4 py-3 rounded-xl border font-semibold transition ${
                    data.timeline === opt.val ? 'bg-orange-50 border-orange-400 text-orange-700' : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            className={`px-6 py-3 rounded-xl font-bold border text-gray-700 ${step === 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-gray-50'}`}
          >
            ← Back
          </button>

          {step < 5 ? (
            <button onClick={() => setStep(s => s + 1)} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl">
              Continue →
            </button>
          ) : (
            <button onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl">
              🌍 Find My City →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}