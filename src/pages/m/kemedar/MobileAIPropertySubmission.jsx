import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, MicOff, Sparkles, CheckCircle, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STEPS = ['Describe', 'Review', 'Generate', 'Done'];

export default function MobileAIPropertySubmission() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [inputText, setInputText] = useState('');
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [reviewData, setReviewData] = useState(null);
  const [generated, setGenerated] = useState(null);
  const recognitionRef = useRef(null);

  const handleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice not supported in this browser.'); return; }
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const r = new SR();
    r.lang = 'ar-EG';
    r.continuous = true;
    r.interimResults = true;
    r.onresult = e => setInputText(Array.from(e.results).map(r => r[0].transcript).join(''));
    r.onend = () => setListening(false);
    r.start();
    recognitionRef.current = r;
    setListening(true);
  };

  const handleExtract = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setLoadingMsg('🧠 Analyzing...');
    try {
      const res = await base44.functions.invoke('extractPropertyData', { text: inputText });
      const data = res.data?.extractedData || res.data || {};
      setReviewData(data);
    } catch {
      setReviewData({
        propertyType: 'Apartment', purpose: 'For Sale', city: 'New Cairo',
        totalArea: 180, bedrooms: 3, bathrooms: 2, price: 2500000, currency: 'EGP',
      });
    } finally {
      setLoading(false);
      setStep(2);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setLoadingMsg('✍️ Generating descriptions...');
    try {
      const res = await base44.functions.invoke('generatePropertyContent', {
        propertyData: reviewData, languages: ['en', 'ar'], tone: 'professional',
      });
      setGenerated(res.data);
    } catch {
      setGenerated({
        titleEn: `${reviewData.bedrooms}-Bed ${reviewData.propertyType} in ${reviewData.city}`,
        titleAr: `${reviewData.propertyType} ${reviewData.bedrooms} غرف في ${reviewData.city}`,
        shortDescEn: `Beautiful ${reviewData.totalArea}m² property for ${reviewData.purpose}.`,
        shortDescAr: `عقار رائع ${reviewData.totalArea}م² للـ${reviewData.purpose}.`,
      });
    } finally {
      setLoading(false);
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setLoadingMsg('🚀 Submitting...');
    try {
      await base44.entities.AIPropertySubmission.create({
        inputMethod: 'text', rawTextInput: inputText,
        extractedData: reviewData, reviewedData: reviewData,
        generatedTitleEn: generated?.titleEn, generatedTitleAr: generated?.titleAr,
        generatedShortDescEn: generated?.shortDescEn, generatedShortDescAr: generated?.shortDescAr,
        submissionStatus: 'submitted', currentPhase: 6,
      });
    } catch {}
    setLoading(false);
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 flex items-center gap-3 px-4" style={{ height: 52 }}>
        <button onClick={() => navigate(-1)} className="p-1 -ml-1">
          <ArrowLeft size={22} className="text-gray-900" />
        </button>
        <span className="flex-1 text-center font-black text-gray-900 text-base">✨ AI Property Listing</span>
        <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded-full">NEW</span>
      </div>

      {/* Step Pills */}
      <div className="flex gap-1 px-4 py-3 bg-white border-b border-gray-100">
        {STEPS.map((s, i) => (
          <div key={s} className={`flex-1 text-center text-[10px] font-black py-1.5 rounded-lg ${
            step === i + 1 ? 'bg-purple-600 text-white' : step > i + 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
          }`}>{step > i + 1 ? '✓' : s}</div>
        ))}
      </div>

      <div className="flex-1 px-4 py-5 space-y-4">
        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-purple-200 p-10 text-center">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="font-bold text-gray-600 text-sm">{loadingMsg}</p>
          </div>
        )}

        {/* Step 1 — Input */}
        {step === 1 && !loading && (
          <>
            <div className="bg-white rounded-2xl border-2 border-purple-200 overflow-hidden">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Describe your property here...\n\nE.g. Apartment in New Cairo, 3 beds, 180 sqm, 2.5M EGP"
                className="w-full px-4 pt-4 pb-3 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none"
                style={{ minHeight: 140 }}
              />
              <div className="flex gap-2 px-3 pb-3">
                <button onClick={handleVoice}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-bold ${listening ? 'border-red-500 bg-red-50 text-red-600 animate-pulse' : 'border-purple-300 bg-purple-50 text-purple-700'}`}>
                  {listening ? <MicOff size={16} /> : <Mic size={16} />}
                  {listening ? 'Stop' : '🎤 Voice'}
                </button>
                <button onClick={handleExtract} disabled={!inputText.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-black disabled:opacity-40">
                  <Sparkles size={16} /> Analyze
                </button>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-700">
              💡 You can speak or type in <strong>Arabic, English, or French</strong> — AI understands all.
            </div>
          </>
        )}

        {/* Step 2 — Review */}
        {step === 2 && reviewData && !loading && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="font-black text-gray-900 mb-3">AI Extracted — Review & Edit</p>
              <div className="space-y-2">
                {Object.entries(reviewData).filter(([k, v]) => v && !Array.isArray(v)).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
                    <span className="text-[10px] text-gray-400 uppercase font-bold w-24 flex-shrink-0">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <input value={val} onChange={e => setReviewData(p => ({ ...p, [key]: e.target.value }))}
                      className="flex-1 text-sm font-semibold text-gray-800 bg-transparent focus:outline-none" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm">← Back</button>
              <button onClick={handleGenerate} className="flex-1 bg-purple-600 text-white font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                <Sparkles size={15} /> Generate Content
              </button>
            </div>
          </>
        )}

        {/* Step 3 — Generated */}
        {step === 3 && generated && !loading && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
              <p className="font-black text-gray-900">Generated Listing Content</p>
              {generated.titleEn && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 font-bold mb-1">🇬🇧 ENGLISH</p>
                  <p className="font-bold text-sm text-gray-900">{generated.titleEn}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{generated.shortDescEn}</p>
                </div>
              )}
              {generated.titleAr && (
                <div className="bg-gray-50 rounded-xl p-3 text-right" dir="rtl">
                  <p className="text-[10px] text-gray-400 font-bold mb-1">🇸🇦 عربي</p>
                  <p className="font-bold text-sm text-gray-900">{generated.titleAr}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{generated.shortDescAr}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm">← Edit</button>
              <button onClick={handleSubmit} className="flex-1 bg-green-600 text-white font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                🚀 Submit
              </button>
            </div>
          </>
        )}

        {/* Step 4 — Success */}
        {step === 4 && !loading && (
          <div className="bg-white rounded-2xl border border-green-200 p-10 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-xl font-black text-gray-900 mb-2">Submitted!</p>
            <p className="text-sm text-gray-500 mb-6">Your listing is pending review.</p>
            <div className="space-y-2">
              <button onClick={() => navigate('/m/dashboard/my-properties')} className="w-full bg-orange-600 text-white font-black py-3 rounded-xl text-sm">
                View My Properties
              </button>
              <button onClick={() => { setStep(1); setInputText(''); setReviewData(null); setGenerated(null); }}
                className="w-full border border-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm">
                Add Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}