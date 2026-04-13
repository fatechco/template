import { useState, useRef } from 'react';
import { Mic, MicOff, Globe } from 'lucide-react';

const EXAMPLE_CHIPS = [
  "3-bed apartment near Metro, under 2M EGP",
  "Villa with pool in 6th October",
  "Studio for investment in Maadi",
  "New apartment for young couple",
  "Luxury penthouse in Sheikh Zayed",
  "Investment flat near university",
  "4-bedroom villa for family of 5",
  "Chalet on North Coast under 1.5M",
];

export default function AISearchInput({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('en');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser. Try Chrome.');
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = language === 'ar' ? 'ar-EG' : 'en-US';
    recognitionRef.current = r;

    r.onresult = (e) => {
      const transcript = Array.from(e.results).map(res => res[0].transcript).join('');
      setQuery(transcript);
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        r.stop();
        setListening(false);
      }, 2000);
    };
    r.onend = () => setListening(false);
    r.start();
    setListening(true);
  };

  const handleSubmit = () => {
    if (!query.trim() || loading) return;
    onSearch(query, language);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
  };

  return (
    <div className="w-full">
      {/* Textarea */}
      <div className="relative bg-white rounded-[20px] border-2 border-purple-500 shadow-xl overflow-hidden focus-within:border-purple-700 transition-colors">
        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Tell me what you're looking for...\n\nExample: "I'm looking for a 3-bedroom apartment in New Cairo under 3 million EGP, close to schools and with a garden. I need parking and prefer a modern finish for investment purposes."\n\nOr: "Show me villas in Sheikh Zayed between 5-8 million with a pool, at least 4 bedrooms, for a family of 5 looking to buy within 3 months."`}
          className="w-full px-5 pt-5 pb-16 text-gray-800 placeholder-gray-400 italic text-[15px] leading-relaxed resize-none focus:outline-none bg-transparent min-h-[140px]"
          style={{ minHeight: 140 }}
          maxLength={500}
        />
        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-white border-t border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={handleVoice}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                listening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              {listening ? <MicOff size={14} /> : <Mic size={14} />}
              {listening ? '🎤 Listening...' : '🎤 Voice'}
            </button>
            <span className="text-xs text-gray-400">{query.length}/500</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-bold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 transition-colors ${language === 'en' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >EN</button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-3 py-1.5 transition-colors ${language === 'ar' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >AR</button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!query.trim() || loading}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white text-sm font-black rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : '🤖'}
              Find My Property
            </button>
          </div>
        </div>
      </div>

      {/* Example chips */}
      <div className="mt-4">
        <p className="text-xs text-gray-400 mb-2 font-medium">Try asking:</p>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {EXAMPLE_CHIPS.map((chip, i) => (
            <button
              key={i}
              onClick={() => setQuery(chip)}
              className="flex-shrink-0 bg-white border border-gray-200 text-gray-700 text-xs font-medium px-3 py-2 rounded-full hover:border-purple-400 hover:text-purple-700 transition-colors whitespace-nowrap"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}