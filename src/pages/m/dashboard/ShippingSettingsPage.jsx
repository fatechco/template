import { useState } from 'react';
import { Save, Plus, Trash2, Edit, Truck, Globe, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import MobileTopBar from '@/components/mobile-v2/MobileTopBar';

const SHIPPING_METHODS = [
  { id: 'free', label: '🆓 Free Shipping', desc: 'You cover all shipping costs' },
  { id: 'fixed', label: '📦 Fixed Rate', desc: 'Flat fee per order' },
  { id: 'kemetro', label: '🚚 Kemetro Shipper', desc: 'Live quotes from shippers' },
];

const PROCESSING_OPTIONS = ['Same Day', '1-2 Days', '3-5 Days', '1-2 Weeks'];

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${value ? 'bg-blue-600' : 'bg-gray-300'}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

export default function ShippingSettingsMobile() {
  const [saved, setSaved] = useState(false);
  const [showAddZone, setShowAddZone] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [newZone, setNewZone] = useState({ region: '', rate: '' });

  const [settings, setSettings] = useState({
    method: 'fixed',
    freeThreshold: 100,
    fixedRate: 15.0,
    processingTime: '1-2 Days',
    autoTrack: true,
    requestSignature: false,
    smsNotify: true,
    emailNotify: true,
    zones: [
      { id: 1, region: 'Egypt', rate: 15.0 },
      { id: 2, region: 'Saudi Arabia', rate: 25.0 },
      { id: 3, region: 'UAE', rate: 25.0 },
    ],
  });

  const set = (key, value) => setSettings(s => ({ ...s, [key]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addZone = () => {
    if (!newZone.region || !newZone.rate) return;
    set('zones', [...settings.zones, { id: Date.now(), region: newZone.region, rate: parseFloat(newZone.rate) }]);
    setNewZone({ region: '', rate: '' });
    setShowAddZone(false);
  };

  const deleteZone = (id) => set('zones', settings.zones.filter(z => z.id !== id));

  const updateZoneRate = (id, rate) => {
    set('zones', settings.zones.map(z => z.id === id ? { ...z, rate: parseFloat(rate) || 0 } : z));
  };

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400';

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <MobileTopBar
        title="Shipping Settings"
        showBack={true}
        rightAction={
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs transition-all ${
              saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
            }`}
          >
            {saved ? <><CheckCircle size={14} /> Saved</> : <><Save size={14} /> Save</>}
          </button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Shipping Method */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-black text-gray-900 text-sm">Shipping Method</h2>
            <p className="text-xs text-gray-500 mt-0.5">How you handle shipping</p>
          </div>
          <div className="p-4 space-y-3">
            {SHIPPING_METHODS.map(m => (
              <label
                key={m.id}
                className={`flex gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  settings.method === m.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100'
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value={m.id}
                  checked={settings.method === m.id}
                  onChange={() => set('method', m.id)}
                  className="sr-only"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{m.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
                </div>
                {settings.method === m.id && (
                  <span className="text-xs font-bold text-blue-600">✓</span>
                )}
              </label>
            ))}
          </div>

          {settings.method === 'fixed' && (
            <div className="px-4 pb-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Default Shipping Fee ($)</label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <span className="px-3 py-2 text-sm text-gray-600 bg-gray-50 border-r border-gray-200 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.fixedRate}
                    onChange={e => set('fixedRate', parseFloat(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Free Shipping Threshold ($)</label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <span className="px-3 py-2 text-sm text-gray-600 bg-gray-50 border-r border-gray-200 font-bold">$</span>
                  <input
                    type="number"
                    step="1"
                    value={settings.freeThreshold}
                    onChange={e => set('freeThreshold', parseFloat(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Set 0 to disable</p>
              </div>
            </div>
          )}

          {settings.method === 'kemetro' && (
            <div className="mx-4 mb-4 bg-purple-50 border border-purple-100 rounded-xl p-3 text-xs text-purple-800">
              <p className="font-bold mb-1">🚚 Kemetro Shipper Network</p>
              <p className="text-purple-600">Customers see live quotes from verified shippers at checkout.</p>
            </div>
          )}
        </div>

        {/* Shipping Zones */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-black text-gray-900 text-sm">Shipping Zones</h2>
            <p className="text-xs text-gray-500 mt-0.5">Different rates for regions</p>
          </div>
          <div className="divide-y divide-gray-100">
            {settings.zones.map(zone => (
              <div key={zone.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{zone.region}</p>
                  {editingZone === zone.id ? (
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={zone.rate}
                      onBlur={e => { updateZoneRate(zone.id, e.target.value); setEditingZone(null); }}
                      onKeyDown={e => e.key === 'Enter' && e.target.blur()}
                      autoFocus
                      className="w-20 border border-blue-300 rounded-lg px-2 py-1 text-sm focus:outline-none mt-1"
                    />
                  ) : (
                    <p className="text-xs text-gray-500 mt-0.5">${zone.rate.toFixed(2)}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingZone(editingZone === zone.id ? null : zone.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteZone(zone.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showAddZone ? (
            <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Region / Country</label>
                <input
                  type="text"
                  value={newZone.region}
                  onChange={e => setNewZone(z => ({ ...z, region: e.target.value }))}
                  placeholder="e.g. Jordan"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Rate ($)</label>
                <input
                  type="number"
                  value={newZone.rate}
                  onChange={e => setNewZone(z => ({ ...z, rate: e.target.value }))}
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addZone}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddZone(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 font-bold rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddZone(true)}
              className="w-full flex items-center justify-center gap-2 text-sm font-bold text-blue-600 py-3 border-t border-blue-200"
            >
              <Plus size={16} /> Add Shipping Zone
            </button>
          )}
        </div>

        {/* Processing Time */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-black text-gray-900 text-sm">Processing Time</h2>
            <p className="text-xs text-gray-500 mt-0.5">How long to prepare orders</p>
          </div>
          <div className="p-4 grid grid-cols-2 gap-2">
            {PROCESSING_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => set('processingTime', opt)}
                className={`px-3 py-2.5 rounded-xl font-bold text-xs border-2 transition-all ${
                  settings.processingTime === opt
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-100 bg-white text-gray-600'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-black text-gray-900 text-sm">Additional Settings</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { key: 'autoTrack', label: 'Auto-Track Shipments', desc: 'Send tracking updates' },
              { key: 'requestSignature', label: 'Require Signature', desc: 'Buyer must sign' },
              { key: 'smsNotify', label: 'SMS Notifications', desc: 'Send SMS updates' },
              { key: 'emailNotify', label: 'Email Notifications', desc: 'Send email updates' },
            ].map(item => (
              <div key={item.key} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <Toggle value={settings[item.key]} onChange={() => set(item.key, !settings[item.key])} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}