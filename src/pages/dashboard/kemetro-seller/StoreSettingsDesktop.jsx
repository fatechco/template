import { useState } from 'react';
import { Save, CheckCircle, Store, ShoppingBag, Bell, Lock, AlertTriangle } from 'lucide-react';

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`w-12 h-7 rounded-full transition-colors flex items-center px-0.5 flex-shrink-0 ${value ? 'bg-blue-600' : 'bg-gray-300'}`}
    >
      <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

function SettingRow({ label, sub, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b border-gray-100 last:border-0">
      <div>
        <p className="font-bold text-gray-900 text-sm">{label}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

function NumberRow({ label, sub, value, onChange, unit }) {
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b border-gray-100 last:border-0">
      <div>
        <p className="font-bold text-gray-900 text-sm">{label}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
      <div className="flex items-center gap-2">
        {unit === '$' && <span className="text-sm font-bold text-gray-500">$</span>}
        <input
          type="number"
          min="0"
          value={value}
          onChange={e => onChange(parseInt(e.target.value) || 0)}
          className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-right focus:outline-none focus:border-blue-400"
        />
        {unit !== '$' && <span className="text-xs font-bold text-gray-500">{unit}</span>}
      </div>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
          <Icon size={18} className="text-blue-600" />
        </div>
        <h2 className="font-black text-gray-900 text-sm uppercase tracking-wide">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function StoreSettingsDesktop() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    storeActive: true,
    acceptOrders: true,
    vacationMode: false,
    vacationReturn: '',
    vacationMessage: 'Back soon. Thank you for your patience!',
    autoConfirm: false,
    processingDays: 1,
    minOrderAmount: 0,
    allowNotes: true,
    autoComplete: 3,
    newOrderAlert: true,
    orderCancelAlert: true,
    reviewAlert: true,
    lowStockAlert: true,
    lowStockLevel: 5,
    messageAlert: true,
    payoutAlert: true,
    announcementAlert: true,
    showPhone: false,
    allowMessages: true,
    visibleSearch: true,
  });

  const toggle = key => setSettings(s => ({ ...s, [key]: !s[key] }));
  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Store Settings</h1>
          <p className="text-gray-600">Manage your store preferences and behaviour</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          {saved ? <><CheckCircle size={18} /> Saved!</> : <><Save size={18} /> Save Settings</>}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Store Status */}
          <SectionCard icon={Store} title="Store Status">
            <SettingRow label="Store Active" sub="Your store is visible to buyers" value={settings.storeActive} onChange={() => toggle('storeActive')} />
            <SettingRow label="Accept New Orders" sub="Stop orders without hiding store" value={settings.acceptOrders} onChange={() => toggle('acceptOrders')} />
            <SettingRow label="Vacation Mode" sub="Pause store with an auto-reply message" value={settings.vacationMode} onChange={() => toggle('vacationMode')} />

            {settings.vacationMode && (
              <div className="px-6 pb-5 pt-1 space-y-3 bg-blue-50 border-t border-blue-100">
                <p className="text-xs font-bold text-blue-700 pt-3">Vacation Settings</p>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Return Date</label>
                  <input
                    type="date"
                    value={settings.vacationReturn}
                    onChange={e => set('vacationReturn', e.target.value)}
                    className="w-full border border-blue-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Auto-reply Message</label>
                  <textarea
                    value={settings.vacationMessage}
                    onChange={e => set('vacationMessage', e.target.value)}
                    maxLength={150}
                    rows={3}
                    className="w-full border border-blue-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none bg-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">{settings.vacationMessage.length}/150</p>
                </div>
              </div>
            )}
          </SectionCard>

          {/* Order Management */}
          <SectionCard icon={ShoppingBag} title="Order Management">
            <SettingRow label="Auto-Confirm Orders" sub="Skip manual confirmation step" value={settings.autoConfirm} onChange={() => toggle('autoConfirm')} />
            <NumberRow label="Processing Time" sub="How long to prepare orders" value={settings.processingDays} onChange={v => set('processingDays', v)} unit="days" />
            <NumberRow label="Minimum Order Amount" sub="Reject orders below this value" value={settings.minOrderAmount} onChange={v => set('minOrderAmount', v)} unit="$" />
            <SettingRow label="Allow Notes from Buyers" sub="Buyers can add a note at checkout" value={settings.allowNotes} onChange={() => toggle('allowNotes')} />
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Notifications */}
          <SectionCard icon={Bell} title="Notifications">
            <SettingRow label="New Order Alert" value={settings.newOrderAlert} onChange={() => toggle('newOrderAlert')} />
            <SettingRow label="Order Cancellation" value={settings.orderCancelAlert} onChange={() => toggle('orderCancelAlert')} />
            <SettingRow label="New Review Alert" value={settings.reviewAlert} onChange={() => toggle('reviewAlert')} />
            <SettingRow label="Message Alerts" value={settings.messageAlert} onChange={() => toggle('messageAlert')} />
            <SettingRow label="Payout Alerts" value={settings.payoutAlert} onChange={() => toggle('payoutAlert')} />
            <SettingRow label="Announcement Alerts" value={settings.announcementAlert} onChange={() => toggle('announcementAlert')} />
            <SettingRow label="Low Stock Alert" value={settings.lowStockAlert} onChange={() => toggle('lowStockAlert')} />
            {settings.lowStockAlert && (
              <div className="px-6 pb-4 pt-1 bg-gray-50 border-t border-gray-100">
                <label className="text-xs text-gray-600 block mb-2 pt-2">Alert when stock falls below:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={settings.lowStockLevel}
                    onChange={e => set('lowStockLevel', parseInt(e.target.value) || 1)}
                    className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400"
                  />
                  <span className="text-xs text-gray-500 font-bold">units</span>
                </div>
              </div>
            )}
          </SectionCard>

          {/* Privacy & Security */}
          <SectionCard icon={Lock} title="Privacy & Security">
            <SettingRow label="Show Phone Number" sub="Display your phone number to buyers" value={settings.showPhone} onChange={() => toggle('showPhone')} />
            <SettingRow label="Allow Direct Messages" sub="Buyers can message you directly" value={settings.allowMessages} onChange={() => toggle('allowMessages')} />
            <SettingRow label="Visible in Search" sub="Your store appears in search results" value={settings.visibleSearch} onChange={() => toggle('visibleSearch')} />
          </SectionCard>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl border border-red-200 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-red-100 bg-red-50">
              <AlertTriangle size={18} className="text-red-600" />
              <h2 className="font-black text-red-700 text-sm uppercase tracking-wide">Danger Zone</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">Once you close your store, all your listings and data will be permanently removed. This action cannot be undone.</p>
              <button className="w-full px-4 py-2.5 border-2 border-red-300 text-red-600 font-bold text-sm rounded-xl hover:bg-red-50 transition-colors">
                🗑 Close Store (Irreversible)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Save */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          {saved ? <><CheckCircle size={18} /> Saved!</> : <><Save size={18} /> Save Settings</>}
        </button>
      </div>
    </div>
  );
}