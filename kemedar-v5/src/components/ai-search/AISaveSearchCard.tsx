"use client";
// @ts-nocheck
import { useState } from 'react';
import { Bell, Check } from 'lucide-react';

export default function AISaveSearchCard({ query, criteria }) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [frequency, setFrequency] = useState('daily');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('kemedar_ai_searches') || '[]');
    saved.push({ query, criteria, emailAlerts, frequency, savedAt: Date.now() });
    localStorage.setItem('kemedar_ai_searches', JSON.stringify(saved));
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Check size={20} className="text-green-600" />
        </div>
        <div>
          <p className="font-bold text-green-800 text-sm">Search saved!</p>
          <p className="text-xs text-green-600">You'll be notified when new matching properties are listed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Bell size={18} className="text-[#FF6B00]" />
        </div>
        <div className="flex-1">
          <p className="font-black text-gray-900 text-sm">🔔 Save This Search</p>
          <p className="text-xs text-gray-500 mt-0.5">Get notified when new properties matching your criteria are listed.</p>

          <div className="flex flex-wrap gap-4 mt-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-orange-500 rounded"
              />
              Email alerts
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-700">Frequency:</span>
              {['Instantly', 'Daily', 'Weekly'].map(f => (
                <button
                  key={f}
                  onClick={() => setFrequency(f.toLowerCase())}
                  className={`text-xs px-2 py-0.5 rounded-full border font-semibold transition-colors ${
                    frequency === f.toLowerCase()
                      ? 'bg-[#FF6B00] text-white border-[#FF6B00]'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="mt-3 w-full bg-[#FF6B00] text-white font-black py-2.5 rounded-xl text-sm hover:bg-[#e55f00] transition-colors"
          >
            Save Search & Get Alerts
          </button>
        </div>
      </div>
    </div>
  );
}