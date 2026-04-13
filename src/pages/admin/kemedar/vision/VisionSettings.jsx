import { useState } from "react";
import { Save, CheckCircle } from "lucide-react";

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-green-500' : 'bg-gray-300'}`}>
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <h3 className="font-black text-gray-800 text-sm border-b border-gray-100 pb-3">{title}</h3>
      {children}
    </div>
  );
}

function SettingRow({ label, desc, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export default function VisionSettings() {
  const [settings, setSettings] = useState({
    autoAnalyze: true, minPhotos: 3, premiumBadgeThreshold: 85, standardBadgeThreshold: 70,
    hideUntilAnalyzed: false, notifyOnIssues: true, enablePriceAnalysis: true,
    priceAlertThreshold: 15, enableStaging: true, freeCredits: 3, subscriberCredits: 20,
    stylesModern: true, stylesClassic: true, stylesScandinavian: true, stylesLuxury: true,
    stylesContemporary: true, stylesMinimalist: false,
    showBadgeToBuyers: true, showHighlightsToBuyers: true
  });
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setSettings(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <h1 className="text-2xl font-black text-gray-900">⚙️ Vision™ Settings</h1>

      <Section title="Analysis Settings">
        <SettingRow label="Auto-analyze on photo upload" desc="Trigger AI analysis immediately after each upload">
          <Toggle value={settings.autoAnalyze} onChange={v => set('autoAnalyze', v)} />
        </SettingRow>
        <SettingRow label="Min photos to trigger full report">
          <input type="number" value={settings.minPhotos} onChange={e => set('minPhotos', +e.target.value)} min={1} max={20}
            className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none" />
        </SettingRow>
      </Section>

      <Section title="Score Thresholds">
        <SettingRow label="Vision Verified Premium badge threshold" desc="Purple badge for high-quality listings">
          <div className="flex items-center gap-1.5">
            <input type="number" value={settings.premiumBadgeThreshold} onChange={e => set('premiumBadgeThreshold', +e.target.value)} min={50} max={100}
              className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none" />
            <span className="text-xs text-gray-400">%</span>
          </div>
        </SettingRow>
        <SettingRow label="Standard badge threshold" desc="Blue badge">
          <div className="flex items-center gap-1.5">
            <input type="number" value={settings.standardBadgeThreshold} onChange={e => set('standardBadgeThreshold', +e.target.value)} min={40} max={100}
              className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none" />
            <span className="text-xs text-gray-400">%</span>
          </div>
        </SettingRow>
        <SettingRow label="Hide listing until photos analyzed" desc="Not recommended — may delay listings">
          <Toggle value={settings.hideUntilAnalyzed} onChange={v => set('hideUntilAnalyzed', v)} />
        </SettingRow>
        <SettingRow label="Notify seller when issues found">
          <Toggle value={settings.notifyOnIssues} onChange={v => set('notifyOnIssues', v)} />
        </SettingRow>
      </Section>

      <Section title="Price Analysis">
        <SettingRow label="Enable price vs finishing analysis">
          <Toggle value={settings.enablePriceAnalysis} onChange={v => set('enablePriceAnalysis', v)} />
        </SettingRow>
        <SettingRow label="Price misalignment alert threshold" desc="Alert if price differs from finishing-justified range by more than X%">
          <div className="flex items-center gap-1.5">
            <input type="range" min={5} max={50} value={settings.priceAlertThreshold} onChange={e => set('priceAlertThreshold', +e.target.value)}
              className="w-24" />
            <span className="text-sm font-bold text-gray-700 w-8">{settings.priceAlertThreshold}%</span>
          </div>
        </SettingRow>
      </Section>

      <Section title="Virtual Staging">
        <SettingRow label="Enable virtual staging feature">
          <Toggle value={settings.enableStaging} onChange={v => set('enableStaging', v)} />
        </SettingRow>
        <SettingRow label="Free staging credits per user">
          <input type="number" value={settings.freeCredits} onChange={e => set('freeCredits', +e.target.value)} min={0} max={20}
            className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none" />
        </SettingRow>
        <SettingRow label="Credits per subscriber / month">
          <input type="number" value={settings.subscriberCredits} onChange={e => set('subscriberCredits', +e.target.value)} min={0}
            className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none" />
        </SettingRow>
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-2">Available staging styles</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'stylesModern', label: '🏙 Modern' }, { key: 'stylesClassic', label: '🏛 Classic' },
              { key: 'stylesScandinavian', label: '🌿 Scandinavian' }, { key: 'stylesLuxury', label: '💎 Luxury' },
              { key: 'stylesContemporary', label: '🪑 Contemporary' }, { key: 'stylesMinimalist', label: '◻ Minimalist' }
            ].map(s => (
              <label key={s.key} className="flex items-center gap-2 text-xs cursor-pointer">
                <input type="checkbox" checked={settings[s.key]} onChange={e => set(s.key, e.target.checked)} className="accent-purple-600" />
                {s.label}
              </label>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Buyer Display">
        <SettingRow label="Show Vision badge to buyers">
          <Toggle value={settings.showBadgeToBuyers} onChange={v => set('showBadgeToBuyers', v)} />
        </SettingRow>
        <SettingRow label="Show finishing highlights to buyers">
          <Toggle value={settings.showHighlightsToBuyers} onChange={v => set('showHighlightsToBuyers', v)} />
        </SettingRow>
        <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500">
          🔒 Issues detected by Vision are <strong>always private</strong> to the seller — never shown to buyers.
        </div>
      </Section>

      <button onClick={handleSave}
        className={`w-full font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${
          saved ? 'bg-green-500 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'
        }`}>
        {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save Settings</>}
      </button>
    </div>
  );
}