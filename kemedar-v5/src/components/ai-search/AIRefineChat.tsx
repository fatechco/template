"use client";
// @ts-nocheck
import { useState } from 'react';
import { Send } from 'lucide-react';

const REFINE_CHIPS = [
  "Under 2.5M only",
  "Show verified only",
  "Bigger area 200sqm+",
  "Must be near schools",
  "Show pet-friendly",
  "Ground floor only",
  "With garden",
  "Close to Metro",
];

export default function AIRefineChat({ originalQuery, onRefine, loading, resultCount }) {
  const [input, setInput] = useState('');

  const handleRefine = (text) => {
    const q = text || input;
    if (!q.trim() || loading) return;
    onRefine(q);
    setInput('');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="font-black text-gray-900 text-sm mb-1">💬 Refine with AI</p>
      <p className="text-xs text-gray-400 mb-3">
        Based on: <span className="text-gray-600 italic">"{originalQuery?.slice(0, 60)}{originalQuery?.length > 60 ? '...' : ''}"</span>
        {resultCount != null && <span className="ml-2 text-purple-600 font-bold">({resultCount} results)</span>}
      </p>

      {/* Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-3">
        {REFINE_CHIPS.map((chip, i) => (
          <button
            key={i}
            onClick={() => handleRefine(chip)}
            disabled={loading}
            className="flex-shrink-0 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors disabled:opacity-50"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleRefine()}
          placeholder="Tell me more specifically what you want..."
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400"
          disabled={loading}
        />
        <button
          onClick={() => handleRefine()}
          disabled={!input.trim() || loading}
          className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-purple-700 transition-colors flex-shrink-0"
        >
          {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}