import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-green-500' : 'bg-gray-300'}`}>
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const LOGO_OPTIONS = ['kemedar', 'kemework', 'kemetro', 'thinkdar', 'none'];
const FRAME_OPTIONS = ['simple', 'branded', 'rounded', 'dots', 'none'];
const EC_OPTIONS = ['L', 'M', 'Q', 'H'];

export default function AdminQRSettings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.entities.QRSettings.list('-created_date', 1)
      .then(data => { if (data[0]) setSettings(data[0]); else setSettings({}); })
      .catch(() => setSettings({}));
  }, []);

  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...settings, updatedAt: new Date().toISOString() };
      if (settings?.id) {
        await base44.entities.QRSettings.update(settings.id, payload);
      } else {
        const created = await base44.entities.QRSettings.create(payload);
        setSettings(created);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { alert('Save failed: ' + e.message); }
    finally { setSaving(false); }
  };

  if (!settings) return <div className="p-6"><div className="h-32 bg-gray-100 rounded-xl animate-pulse" /></div>;

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200';
  const labelCls = 'text-sm font-bold text-gray-700 block mb-1.5';
  const Card = ({ title, children }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100"><p className="font-black text-gray-900">{title}</p></div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
  const Row = ({ label, children }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      {children}
    </div>
  );

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <h1 className="text-2xl font-black text-gray-900">QR Code Settings</h1>

      <Card title="Feature Toggle">
        <Row label="QR Code Generator is:">
          <div className="flex items-center gap-2">
            <Toggle value={!!settings.isActive} onChange={v => set('isActive', v)} />
            <span className={`text-sm font-bold ${settings.isActive ? 'text-green-600' : 'text-gray-400'}`}>
              {settings.isActive ? '🟢 Active' : '⚫ Inactive'}
            </span>
          </div>
        </Row>
        <Row label="Require paid plan:">
          <Toggle value={!!settings.requirePaidPlan} onChange={v => set('requirePaidPlan', v)} />
        </Row>
        <Row label="Enable scan analytics:">
          <Toggle value={!!settings.enableAnalytics} onChange={v => set('enableAnalytics', v)} />
        </Row>
      </Card>

      <Card title="Limits">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Max QR codes per user</label>
            <input type="number" value={settings.maxQRCodesPerUser || 50} onChange={e => set('maxQRCodesPerUser', +e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Max QR codes per listing</label>
            <input type="number" value={settings.maxQRCodesPerListing || 3} onChange={e => set('maxQRCodesPerListing', +e.target.value)} className={inputCls} />
          </div>
        </div>
      </Card>

      <Card title="Defaults">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Foreground Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={settings.defaultForegroundColor || '#FF6B00'} onChange={e => set('defaultForegroundColor', e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-1" />
              <span className="text-sm text-gray-600">{settings.defaultForegroundColor || '#FF6B00'}</span>
            </div>
          </div>
          <div>
            <label className={labelCls}>Background Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={settings.defaultBackgroundColor || '#FFFFFF'} onChange={e => set('defaultBackgroundColor', e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-1" />
              <span className="text-sm text-gray-600">{settings.defaultBackgroundColor || '#FFFFFF'}</span>
            </div>
          </div>
          <div>
            <label className={labelCls}>Default Logo</label>
            <select value={settings.defaultLogoType || 'kemedar'} onChange={e => set('defaultLogoType', e.target.value)} className={inputCls}>
              {LOGO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Default Frame Style</label>
            <select value={settings.defaultFrameStyle || 'branded'} onChange={e => set('defaultFrameStyle', e.target.value)} className={inputCls}>
              {FRAME_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>Default Frame Text (EN)</label>
          <input type="text" value={settings.defaultFrameText || ''} onChange={e => set('defaultFrameText', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Default Frame Text (AR)</label>
          <input type="text" dir="rtl" value={settings.defaultFrameTextAr || ''} onChange={e => set('defaultFrameTextAr', e.target.value)} className={inputCls} />
        </div>
      </Card>

      <Card title="QR Quality">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>PNG Resolution (px)</label>
            <input type="number" value={settings.pngResolution || 1000} onChange={e => set('pngResolution', +e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Error Correction Level</label>
            <select value={settings.errorCorrectionLevel || 'H'} onChange={e => set('errorCorrectionLevel', e.target.value)} className={inputCls}>
              {EC_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>SVG Size (px)</label>
            <input type="number" value={settings.svgSize || 500} onChange={e => set('svgSize', +e.target.value)} className={inputCls} />
          </div>
        </div>
      </Card>

      <Card title="Tracking">
        <div>
          <label className={labelCls}>Tracking Base URL</label>
          <input type="url" value={settings.trackingBaseUrl || 'https://kemedar.com/qr/'} onChange={e => set('trackingBaseUrl', e.target.value)} className={inputCls} />
        </div>
      </Card>

      <button onClick={handleSave} disabled={saving}
        className={`w-full py-4 rounded-xl font-black text-base transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-[#FF6B00] hover:bg-orange-600 text-white'} disabled:opacity-60`}>
        {saved ? '✅ Settings Saved!' : saving ? 'Saving...' : '💾 Save All Settings'}
      </button>
    </div>
  );
}