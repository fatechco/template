import { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const DAILY_LIMIT = 5;
const STORAGE_KEY = 'kemedar_ai_gen_count';

function getDailyCount() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const today = new Date().toDateString();
    return stored.date === today ? (stored.count || 0) : 0;
  } catch {
    return 0;
  }
}

function incrementDailyCount() {
  const today = new Date().toDateString();
  const count = getDailyCount() + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count }));
  return count;
}

// Typewriter animation helper
function typewrite(text, setter, speed = 8) {
  let i = 0;
  setter('');
  const interval = setInterval(() => {
    setter(text.slice(0, i + 1));
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
  return interval;
}

/**
 * AIGenerateButton
 * 
 * Props:
 *   formType: 'property' | 'project' | 'service' | 'task' | 'product' | 'buyRequest'
 *   fieldType: 'title' | 'shortDescription' | 'description'
 *   formData: current form data object
 *   onGenerated: (value: string) => void
 *   requiredFields: string[]  — field keys that must exist in formData
 *   requiredLabels: string[]  — human-readable names for tooltip
 *   variant: 'inline' | 'header' | 'fullwidth'  (default: 'inline')
 */
export default function AIGenerateButton({
  formType,
  fieldType,
  formData,
  onGenerated,
  requiredFields = [],
  requiredLabels = [],
  variant = 'inline',
}) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingValue, setPendingValue] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [dailyCount, setDailyCount] = useState(getDailyCount());
  const [errorMsg, setErrorMsg] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const missingFields = requiredFields.filter(f => !formData?.[f]);
  const hasMissing = missingFields.length > 0;
  const limitReached = dailyCount >= DAILY_LIMIT;

  const currentValue = formData?.[fieldType === 'title' ? 'title' :
    fieldType === 'shortDescription' ? 'short_description' || 'shortDescription' : 'description'];

  const doGenerate = async (language = 'en') => {
    if (hasMissing || limitReached) return;
    setLoading(true);
    setStatus(null);
    setErrorMsg(null);

    try {
      const res = await base44.functions.invoke('aiGenerateContent', {
        formType,
        fieldType,
        formData,
        language,
      });

      const result = res.data?.result;
      if (!result) throw new Error('Empty response');

      const value = result.title || result.shortDescription || result.description || Object.values(result)[0] || '';
      if (!value) throw new Error('No content in response');

      const newCount = incrementDailyCount();
      setDailyCount(newCount);

      return value;
    } catch (err) {
      setErrorMsg(err.message || 'Generation failed. Try again.');
      setStatus('error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    if (loading || hasMissing || limitReached) return;

    const hasExistingContent = formData?.[
      fieldType === 'title' ? 'title' :
      fieldType === 'shortDescription' ? 'short_description' : 'description'
    ];

    if (hasExistingContent && hasExistingContent.length > 10) {
      // Ask confirmation before overwriting
      const value = await doGenerate();
      if (value) {
        setPendingValue(value);
        setShowConfirm(true);
      }
    } else {
      const value = await doGenerate();
      if (value) {
        applyValue(value);
      }
    }
  };

  const applyValue = (value) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = typewrite(value, (partial) => {
      onGenerated(partial);
    }, 6);
    setStatus('success');
    setTimeout(() => setStatus(null), 2500);
  };

  const handleArabic = async () => {
    const value = await doGenerate('ar');
    if (value) {
      onGenerated(value, 'ar');
      setStatus('success');
      setTimeout(() => setStatus(null), 2500);
    }
  };

  const buttonLabel = loading ? 'Generating...' : '✨ AI Generate';

  // Styles per variant
  const baseBtn = `
    flex items-center gap-1.5 font-bold transition-all select-none
    bg-gradient-to-r from-purple-600 to-purple-800 text-white
    hover:scale-105 hover:shadow-[0_0_12px_rgba(124,58,237,0.5)]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
  `.trim();

  const inlineBtn = `${baseBtn} h-9 px-3 rounded-lg text-[11px] flex-shrink-0`;
  const headerBtn = `${baseBtn} h-8 px-3 rounded-lg text-[11px]`;
  const fullwidthBtn = `${baseBtn} w-full justify-center py-2.5 rounded-xl text-sm mt-2`;

  const btnClass = variant === 'fullwidth' ? fullwidthBtn : variant === 'header' ? headerBtn : inlineBtn;

  const tooltipMsg = hasMissing
    ? `Fill in ${missingFields.map((f, i) => requiredLabels[i] || f).join(', ')} first`
    : limitReached
    ? 'Daily limit reached. Upgrade for unlimited AI.'
    : null;

  return (
    <div className="relative">
      {/* Confirm overwrite dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl z-10">
            <p className="font-bold text-gray-900 mb-1">Replace current content?</p>
            <p className="text-sm text-gray-500 mb-4">This will overwrite the existing text with the AI-generated version.</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowConfirm(false); applyValue(pendingValue); setPendingValue(null); }}
                className="flex-1 bg-purple-600 text-white font-bold py-2.5 rounded-xl text-sm"
              >
                Yes, Replace
              </button>
              <button
                onClick={() => { setShowConfirm(false); setPendingValue(null); }}
                className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm"
              >
                Keep Current
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && tooltipMsg && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg pointer-events-none">
          {tooltipMsg}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}

      <button
        onClick={handleClick}
        disabled={loading}
        className={btnClass}
        onMouseEnter={() => tooltipMsg && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className={loading ? 'inline-block animate-spin' : ''}>✨</span>
        <span>{loading ? 'Generating...' : 'AI Generate'}</span>
      </button>

      {/* Status messages below button */}
      {status === 'success' && (
        <p className="text-[10px] text-gray-400 mt-1">✅ AI Generated — Click to edit</p>
      )}
      {status === 'error' && errorMsg && (
        <div className="mt-1">
          <p className="text-[10px] text-red-500">⚠️ {errorMsg}</p>
          <button onClick={handleClick} className="text-[10px] text-purple-600 font-bold">🔄 Retry</button>
        </div>
      )}
      {status === 'success' && (
        <button onClick={handleClick} className="text-[10px] text-purple-600 font-semibold mt-0.5 block">
          🔄 Regenerate
        </button>
      )}

      {/* Daily counter */}
      {!limitReached && (
        <p className="text-[10px] text-gray-400 mt-0.5 text-right">{dailyCount}/{DAILY_LIMIT} AI credits today</p>
      )}
      {limitReached && (
        <p className="text-[10px] text-orange-500 mt-0.5">
          Daily limit reached.{' '}
          <a href="/m/buy" className="underline font-bold">Upgrade Plan</a>
        </p>
      )}

      {/* Arabic generation — show after first success */}
      {status === 'success' && (
        <button
          onClick={handleArabic}
          className="text-[10px] text-blue-600 font-semibold mt-0.5 block"
        >
          🌐 Also generate in Arabic
        </button>
      )}
    </div>
  );
}