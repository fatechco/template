import { useState } from 'react';

const LOGO_OPTIONS = [
  { value: 'kemedar', label: '🏠 Kemedar' },
  { value: 'kemework', label: '🔧 Kemework' },
  { value: 'kemetro', label: '🛒 Kemetro' },
  { value: 'thinkdar', label: '🧠 ThinkDar' },
  { value: 'custom', label: '📤 Custom' },
  { value: 'none', label: '✕ None' },
];

const FRAME_STYLES = ['simple', 'branded', 'rounded', 'dots', 'none'];
const QR_STYLES = [
  { value: 'square', label: '◼ Square' },
  { value: 'rounded', label: '◻ Rounded' },
  { value: 'dots', label: '● Dots' },
];

export default function QRCustomizer({ settings, onChange, onRegenerate, generating }) {
  const handleChange = (key, value) => onChange({ ...settings, [key]: value });

  return (
    <div className="p-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>

      {/* QR Style — Colors */}
      <div className="mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">QR Style</p>
        <p className="text-xs text-gray-500 mb-2">Colors</p>
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-1">
            <label className="text-xs text-gray-500">QR Color</label>
            <input
              type="color"
              value={settings.foregroundColor}
              onChange={e => handleChange('foregroundColor', e.target.value)}
              className="w-10 h-10 rounded-full border-2 border-gray-200 cursor-pointer"
              style={{ padding: 2 }}
            />
            <span className="text-[10px] text-gray-400">Foreground</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <label className="text-xs text-gray-500">Background</label>
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={e => handleChange('backgroundColor', e.target.value)}
              className="w-10 h-10 rounded-full border-2 border-gray-200 cursor-pointer"
              style={{ padding: 2 }}
            />
            <span className="text-[10px] text-gray-400">Background</span>
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Logo in Center</p>
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => handleChange('includeLogo', !settings.includeLogo)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.includeLogo ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.includeLogo ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className="text-sm text-gray-700">Include logo</span>
        </div>

        {settings.includeLogo && (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              {LOGO_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleChange('logoType', opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    settings.logoType === opt.value
                      ? 'bg-[#FF6B00] text-white border-[#FF6B00]'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {settings.logoType === 'custom' && (
              <div className="mt-2">
                <label className="text-xs text-gray-500 block mb-1">Upload your logo (PNG recommended)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file && file.size <= 500 * 1024) {
                      const url = URL.createObjectURL(file);
                      handleChange('customLogoUrl', url);
                      handleChange('_customLogoFile', file);
                    } else if (file) {
                      alert('Logo must be under 500KB');
                    }
                  }}
                  className="text-xs border border-gray-200 rounded-lg p-2 w-full"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Frame */}
      <div className="mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">QR Frame</p>
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => handleChange('includeFrame', !settings.includeFrame)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.includeFrame ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.includeFrame ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className="text-sm text-gray-700">Include frame</span>
        </div>

        {settings.includeFrame && (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              {FRAME_STYLES.map(s => (
                <button
                  key={s}
                  onClick={() => handleChange('frameStyle', s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all capitalize ${
                    settings.frameStyle === s
                      ? 'bg-[#FF6B00] text-white border-[#FF6B00]'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Scan to view"
                value={settings.frameText}
                onChange={e => handleChange('frameText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
              <input
                type="text"
                placeholder="امسح للعرض"
                value={settings.frameTextAr}
                onChange={e => handleChange('frameTextAr', e.target.value)}
                dir="rtl"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>
          </>
        )}
      </div>

      {/* Dot Style */}
      <div className="mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Dot Style</p>
        <div className="flex gap-3">
          {QR_STYLES.map(s => (
            <button
              key={s.value}
              onClick={() => handleChange('qrStyle', s.value)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                settings.qrStyle === s.value
                  ? 'bg-[#FF6B00] text-white border-[#FF6B00]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Regenerate */}
      <button
        onClick={onRegenerate}
        disabled={generating}
        className="w-full py-2.5 rounded-lg border-2 border-blue-500 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {generating ? '⏳ Generating...' : '🔄 Regenerate Preview'}
      </button>
    </div>
  );
}