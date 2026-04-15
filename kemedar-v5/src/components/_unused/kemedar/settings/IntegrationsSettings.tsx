"use client";
// @ts-nocheck
import { Save, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function IntegrationsSettings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* XeedWallet Integration */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          💳 XeedWallet Integration
        </h2>

        <div>
          <label className="text-sm font-bold text-gray-900 block mb-2">API Key</label>
          <input type="password" placeholder="xw_live_..." className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
        </div>

        <div>
          <label className="text-sm font-bold text-gray-900 block mb-2">Secret Key</label>
          <input type="password" placeholder="xw_secret_..." className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
        </div>

        <div>
          <label className="text-sm font-bold text-gray-900 block mb-2">Webhook URL</label>
          <input type="text" defaultValue="https://your-site.com/api/webhooks/xeedwallet" disabled className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50" />
        </div>
      </div>

      {/* Google Maps API */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          🗺️ Google Maps API
        </h2>

        <div>
          <label className="text-sm font-bold text-gray-900 block mb-2">API Key</label>
          <input type="password" placeholder="AIzaSy..." className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
        </div>

        <button className="text-blue-600 text-sm font-bold hover:underline">Get API Key →</button>
      </div>

      {/* WhatsApp Business API */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          💬 WhatsApp Business API
        </h2>

        <div>
          <label className="text-sm font-bold text-gray-900 block mb-2">Phone Number ID</label>
          <input type="text" placeholder="123456789" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
        </div>

        <div>
          <label className="text-sm font-bold text-gray-900 block mb-2">Access Token</label>
          <input type="password" placeholder="EAAB..." className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
        </div>
      </div>

      {/* MailWizz Integration */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          📬 MailWizz Integration
        </h2>

        <div>
          <label className="text-sm font-bold text-gray-900 block mb-2">MailWizz Instance URL</label>
          <input type="text" placeholder="https://mailwizz.yourdomain.com" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
        </div>

        <div>
          <label className="text-sm font-bold text-gray-900 block mb-2">API Key</label>
          <input type="password" placeholder="mw_api_key_..." className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
        </div>

        <button className="text-blue-600 text-sm font-bold hover:underline">Visit MailWizz System →</button>
      </div>

      {/* Social Login */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">Social Login</h2>

        <div>
          <label className="text-sm font-bold text-gray-900 block mb-2">Google Client ID</label>
          <input type="text" placeholder="123456789-abc.apps.googleusercontent.com" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
        </div>

        <div>
          <label className="text-sm font-bold text-gray-900 block mb-2">Facebook App ID</label>
          <input type="text" placeholder="123456789" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white rounded-lg font-bold text-sm hover:bg-orange-700">
          <Save size={16} /> {saved ? "✓ Saved" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}