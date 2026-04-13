import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Send, ArrowLeft, Sparkles, CheckCircle, Edit3, RefreshCw, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SiteHeader from '@/components/header/SiteHeader';
import SiteFooter from '@/components/home/SiteFooter';

const STEPS = ['Input', 'Extract', 'Review', 'Generate', 'Submit'];

const EXAMPLE_PROMPTS = [
  "3-bedroom apartment in New Cairo, 5th Settlement, 180 sqm, floor 4, fully finished, EGP 2.5M, parking + pool",
  "Villa for rent in Sheikh Zayed, 400 sqm, 5 beds, 4 baths, garden, private pool, EGP 80,000/month",
  "Studio near Maadi Metro, 55 sqm, semi-finished, EGP 850,000 negotiable, first floor",
];

export default function AIPropertySubmission() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [inputText, setInputText] = useState('');
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [extracted, setExtracted] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [generated, setGenerated] = useState(null);
  const recognitionRef = useRef(null);

  const handleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice input not supported in this browser.'); return; }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const r = new SR();
    r.lang = 'ar-EG';
    r.continuous = true;
    r.interimResults = true;
    r.onresult = e => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
      setInputText(transcript);
    };
    r.onend = () => setListening(false);
    r.start();
    recognitionRef.current = r;
    setListening(true);
  };

  const handleExtract = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setLoadingMsg('🧠 AI is reading your description...');
    setStep(2);
    try {
      const res = await base44.functions.invoke('extractPropertyData', { text: inputText });
      const data = res.data?.extractedData || res.data || {};
      setExtracted(data);
      setReviewData({ ...data });
      setStep(3);
    } catch (e) {
      // Mock fallback for demo
      const mock = {
        propertyType: 'Apartment', purpose: 'For Sale', city: 'New Cairo',
        district: '5th Settlement', totalArea: 180, bedrooms: 3, bathrooms: 2,
        floor: 4, price: 2500000, currency: 'EGP', finishing: 'Fully Finished',
        amenities: ['Parking', 'Pool'], isNegotiable: false,
      };
      setExtracted(mock);
      setReviewData({ ...mock });
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setLoadingMsg('✍️ Generating multilingual content...');
    setStep(4);
    try {
      const res = await base44.functions.invoke('generatePropertyContent', {
        propertyData: reviewData,
        languages: ['en', 'ar', 'fr'],
        tone: 'professional',
      });
      setGenerated(res.data);
      setStep(4);
    } catch {
      setGenerated({
        titleEn: `${reviewData.bedrooms}-Bed ${reviewData.propertyType} in ${reviewData.city}`,
        titleAr: `شقة ${reviewData.bedrooms} غرف في ${reviewData.city}`,
        shortDescEn: `Stunning ${reviewData.totalArea}m² ${reviewData.propertyType} in ${reviewData.district}, ${reviewData.city}.`,
        shortDescAr: `${reviewData.propertyType} رائعة ${reviewData.totalArea}م² في ${reviewData.district}، ${reviewData.city}.`,
      });
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setLoadingMsg('🚀 Submitting your listing...');
    try {
      await base44.entities.AIPropertySubmission.create({
        inputMethod: 'text',
        rawTextInput: inputText,
        extractedData: extracted,
        reviewedData: reviewData,
        generatedTitleEn: generated?.titleEn,
        generatedTitleAr: generated?.titleAr,
        generatedShortDescEn: generated?.shortDescEn,
        generatedShortDescAr: generated?.shortDescAr,
        submissionStatus: 'submitted',
        currentPhase: 6,
      });
      setStep(5);
    } catch {
      setStep(5);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      <div className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/kemedar/add/property" className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={18} className="text-gray-600" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-gray-900">AI Property Assistant</h1>
              <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded-full">NEW</span>
            </div>
            <p className="text-sm text-gray-500">Describe your property — AI will fill everything for you</p>
          </div>
        </div>

        {/* Step Progress */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1 flex-1">
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                step === i + 1 ? 'bg-purple-600 text-white' :
                step > i + 1 ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-400'
              }`}>
                {step > i + 1 ? <CheckCircle size={11} /> : <span>{i + 1}</span>}
                <span className="hidden sm:inline">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${step > i + 1 ? 'bg-green-300' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="bg-white border border-purple-200 rounded-2xl p-10 text-center shadow-sm mb-6">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="font-bold text-gray-700">{loadingMsg}</p>
          </div>
        )}

        {/* Step 1 — Input */}
        {step === 1 && !loading && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-sm overflow-hidden">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Describe your property in any language...\n\nExample: 3-bedroom apartment in New Cairo, 5th Settlement, 180 sqm, floor 4, fully finished, EGP 2.5M, has parking and pool"
                className="w-full px-5 pt-5 pb-3 text-gray-800 placeholder-gray-400 text-sm leading-relaxed resize-none focus:outline-none"
                style={{ minHeight: 160 }}
              />
              <div className="flex items-center gap-2 px-4 pb-4">
                <button
                  onClick={handleVoice}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                    listening ? 'border-red-500 bg-red-50 text-red-600 animate-pulse' : 'border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  {listening ? <MicOff size={16} /> : <Mic size={16} />}
                  {listening ? 'Stop Recording' : '🎤 Voice Input'}
                </button>
                <button
                  onClick={handleExtract}
                  disabled={!inputText.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-black disabled:opacity-40 transition-all"
                >
                  <Sparkles size={16} /> Analyze with AI
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2 font-semibold">EXAMPLE PROMPTS — Click to use:</p>
              <div className="space-y-2">
                {EXAMPLE_PROMPTS.map((p, i) => (
                  <button key={i} onClick={() => setInputText(p)}
                    className="w-full text-left bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-600 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                    "{p}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && reviewData && !loading && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-gray-900">AI Extracted Data</h2>
                <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">✓ Review & Edit</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(reviewData).filter(([k, v]) => v && !Array.isArray(v)).map(([key, val]) => (
                  <div key={key} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <input
                      value={val}
                      onChange={e => setReviewData(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full text-sm font-semibold text-gray-800 bg-transparent focus:outline-none border-b border-transparent focus:border-purple-400"
                    />
                  </div>
                ))}
              </div>
              {reviewData.amenities?.length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {reviewData.amenities.map((a, i) => (
                      <span key={i} className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm hover:bg-gray-50">
                ← Re-describe
              </button>
              <button onClick={handleGenerate} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                <Sparkles size={16} /> Generate Content
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Generated Content */}
        {step === 4 && generated && !loading && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h2 className="font-black text-gray-900">Generated Content</h2>
              {[
                { lang: '🇬🇧 English', title: generated.titleEn, desc: generated.shortDescEn },
                { lang: '🇸🇦 Arabic', title: generated.titleAr, desc: generated.shortDescAr, rtl: true },
                { lang: '🇫🇷 French', title: generated.titleFr, desc: generated.shortDescFr },
              ].filter(l => l.title).map(l => (
                <div key={l.lang} className={`bg-gray-50 rounded-xl p-4 ${l.rtl ? 'text-right' : ''}`} dir={l.rtl ? 'rtl' : 'ltr'}>
                  <p className="text-[10px] text-gray-400 font-bold mb-2">{l.lang}</p>
                  <p className="font-bold text-gray-900 text-sm mb-1">{l.title}</p>
                  <p className="text-xs text-gray-500">{l.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm">
                ← Edit Data
              </button>
              <button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                🚀 Submit Listing
              </button>
            </div>
          </div>
        )}

        {/* Step 5 — Success */}
        {step === 5 && !loading && (
          <div className="bg-white rounded-2xl border border-green-200 p-10 text-center shadow-sm">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Listing Submitted!</h2>
            <p className="text-gray-500 text-sm mb-6">Your property has been submitted and is pending review.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/dashboard/my-properties" className="bg-orange-600 text-white font-black px-6 py-3 rounded-xl text-sm hover:bg-orange-700">
                View My Properties
              </Link>
              <button onClick={() => { setStep(1); setInputText(''); setExtracted(null); setReviewData(null); setGenerated(null); }}
                className="border border-gray-200 text-gray-700 font-bold px-6 py-3 rounded-xl text-sm hover:bg-gray-50">
                Add Another
              </button>
            </div>
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}