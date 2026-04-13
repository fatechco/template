import { useState } from 'react';
import { Save, Plus, Trash2, Edit, Truck, Globe, Clock, CheckCircle } from 'lucide-react';

const SHIPPING_METHODS = [
  { id: 'free', label: '🆓 Free Shipping', desc: 'You cover all shipping costs for every order' },
  { id: 'fixed', label: '📦 Fixed Rate per Order', desc: 'Charge a flat fee regardless of order size' },
  { id: 'kemetro', label: '🚚 Kemetro Shipper Network', desc: 'Connect with the Kemetro shipper marketplace for competitive rates' },
];

const PROCESSING_OPTIONS = ['Same Day', '1-2 Days', '3-5 Days', '1-2 Weeks'];

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`w-12 h-7 rounded-full transition-colors flex items-center px-0.5 ${value ? 'bg-blue-600' : 'bg-gray-300'}`}
    >
      <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

function Section({ icon: SectionIcon, title, desc, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <SectionIcon size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className="font-black text-gray-900">{title}</h2>
          {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function ShippingSettingsDesktop() {
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
      { id: 1, region: 'Egypt', method: 'fixed', rate: 15.0 },
      { id: 2, region: 'Saudi Arabia', method: 'fixed', rate: 25.0 },
      { id: 3, region: 'UAE', method: 'fixed', rate: 25.0 },
    ],
  });

  const set = (key, value) => setSettings(s => ({ ...s, [key]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addZone = () => {
    if (!newZone.region || !newZone.rate) return;
    set('zones', [...settings.zones, { id: Date.now(), region: newZone.region, method: 'fixed', rate: parseFloat(newZone.rate) }]);
    setNewZone({ region: '', rate: '' });
    setShowAddZone(false);
  };

  const deleteZone = (id) => set('zones', settings.zones.filter(z => z.id !== id));

  const updateZoneRate = (id, rate) => {
    set('zones', settings.zones.map(z => z.id === id ? { ...z, rate: parseFloat(rate) || 0 } : z));
  };

  const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100';

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Shipping Settings</h1>
          <p className="text-gray-600">Configure how you ship products to your customers</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {saved ? <><CheckCircle size={18} /> Saved!</> : <><Save size={18} /> Save Settings</>}
        </button>
      </div>

      {/* Shipping Method */}
      <Section icon={Truck} title="Default Shipping Method" desc="Choose how you handle shipping by default across all products">
        <div className="grid grid-cols-3 gap-4 mb-5">
          {SHIPPING_METHODS.map(m => (
            <label
              key={m.id}
              className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                settings.method === m.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-300'
              }`}
            >
              <input type="radio" name="method" value={m.id} checked={settings.method === m.id} onChange={() => set('method', m.id)} className="sr-only" />
              <p className="font-black text-gray-900 text-sm">{m.label}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{m.desc}</p>
              {settings.method === m.id && (
                <span className="text-xs font-bold text-blue-600 mt-1">✓ Selected</span>
              )}
            </label>
          ))}
        </div>

        {settings.method === 'fixed' && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <p className="font-bold text-gray-900 mb-4">Fixed Shipping Rate</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Default Shipping Fee ($)</label>
                <div className="flex items-center border border-blue-200 rounded-lg overflow-hidden bg-white">
                  <span className="px-3 py-2.5 text-sm text-gray-600 bg-blue-50 border-r border-blue-200 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.fixedRate}
                    onChange={e => set('fixedRate', parseFloat(e.target.value) || 0)}
                    className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Free Shipping Threshold ($)</label>
                <div className="flex items-center border border-blue-200 rounded-lg overflow-hidden bg-white">
                  <span className="px-3 py-2.5 text-sm text-gray-600 bg-blue-50 border-r border-blue-200 font-bold">$</span>
                  <input
                    type="number"
                    step="1"
                    value={settings.freeThreshold}
                    onChange={e => set('freeThreshold', parseFloat(e.target.value) || 0)}
                    className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Set 0 to disable free shipping threshold</p>
              </div>
            </div>
          </div>
        )}

        {settings.method === 'kemetro' && (
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-5 text-sm text-purple-800">
            <p className="font-bold mb-1">🚚 Kemetro Shipper Network Active</p>
            <p className="text-xs text-purple-600">Customers will see live quotes from verified shippers in the Kemetro network at checkout. Shippers will bid on your orders for the best rates.</p>
          </div>
        )}
      </Section>

      {/* Shipping Zones */}
      <Section icon={Globe} title="Shipping Zones" desc="Set different shipping rates for different regions">
        <div className="overflow-hidden rounded-xl border border-gray-100 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-left font-bold text-gray-700">Region</th>
                <th className="px-5 py-3 text-left font-bold text-gray-700">Rate ($)</th>
                <th className="px-5 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {settings.zones.map(zone => (
                <tr key={zone.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-bold text-gray-900">{zone.region}</td>
                  <td className="px-5 py-3">
                    {editingZone === zone.id ? (
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={zone.rate}
                        onBlur={e => { updateZoneRate(zone.id, e.target.value); setEditingZone(null); }}
                        onKeyDown={e => e.key === 'Enter' && e.target.blur()}
                        autoFocus
                        className="w-24 border border-blue-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                      />
                    ) : (
                      <span className="font-bold text-gray-900">${zone.rate.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingZone(editingZone === zone.id ? null : zone.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => deleteZone(zone.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAddZone ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-end gap-3">
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Region / Country</label>
              <input type="text" value={newZone.region} onChange={e => setNewZone(z => ({ ...z, region: e.target.value }))} placeholder="e.g. Jordan" className={inputClass} />
            </div>
            <div className="w-32">
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Rate ($)</label>
              <input type="number" value={newZone.rate} onChange={e => setNewZone(z => ({ ...z, rate: e.target.value }))} placeholder="0.00" className={inputClass} />
            </div>
            <button onClick={addZone} className="px-4 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-sm">Add</button>
            <button onClick={() => setShowAddZone(false)} className="px-4 py-2.5 border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-100 text-sm">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setShowAddZone(true)} className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 px-4 py-2.5 border border-blue-200 rounded-xl hover:bg-blue-50">
            <Plus size={16} /> Add Shipping Zone
          </button>
        )}
      </Section>

      {/* Processing Time */}
      <Section icon={Clock} title="Order Processing Time" desc="How long it takes to prepare orders before shipping">
        <div className="flex gap-3 flex-wrap">
          {PROCESSING_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => set('processingTime', opt)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${
                settings.processingTime === opt
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-100 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">This is shown to buyers at checkout so they know when to expect their orders.</p>
      </Section>

      {/* Additional Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="font-black text-gray-900">Additional Settings</h2>
          <p className="text-xs text-gray-500 mt-0.5">Delivery and notification preferences</p>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { key: 'autoTrack', label: 'Auto-Track Shipments', desc: 'Automatically send tracking updates to buyers when their order ships' },
            { key: 'requestSignature', label: 'Require Delivery Signature', desc: 'Buyer must sign upon receiving the package' },
            { key: 'smsNotify', label: 'SMS Notifications to Buyers', desc: 'Send SMS updates at key shipment milestones' },
            { key: 'emailNotify', label: 'Email Notifications to Buyers', desc: 'Send email updates at key shipment milestones' },
          ].map(item => (
            <div key={item.key} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900 text-sm">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <Toggle value={settings[item.key]} onChange={() => set(item.key, !settings[item.key])} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
            saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {saved ? <><CheckCircle size={18} /> Saved!</> : <><Save size={18} /> Save Settings</>}
        </button>
      </div>
    </div>
  );
}