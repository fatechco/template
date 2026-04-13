import { Save } from "lucide-react";
import { useState } from "react";

export default function SecuritySettings() {
  const [saved, setSaved] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-900">Two-Factor Authentication</p>
            <p className="text-sm text-gray-600 mt-1">Require 2FA for all admin accounts</p>
          </div>
          <button
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className={`w-12 h-7 rounded-full transition-colors flex items-center ${
              twoFactorEnabled ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div className={`w-6 h-6 bg-white rounded-full transition-transform ${twoFactorEnabled ? "ml-auto mr-0.5" : "ml-0.5"}`}></div>
          </button>
        </div>
      </div>

      {/* IP Whitelist */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">Admin IP Whitelist</h2>
        <p className="text-sm text-gray-600">Only allow admin access from these IP addresses (one per line)</p>

        <textarea
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none resize-none h-32 font-mono text-xs"
          defaultValue="192.168.1.1&#10;10.0.0.0/8&#10;203.0.113.0/24"
        ></textarea>
      </div>

      {/* Session & Login Security */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">Session & Login Security</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">Session Timeout (minutes)</label>
            <input type="number" defaultValue="30" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">Failed Login Attempts Limit</label>
            <input type="number" defaultValue="5" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-800">
          <p className="font-bold">Lockout Duration: 15 minutes after exceeding failed attempts</p>
        </div>
      </div>

      {/* Password Policy */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">Password Policy</h2>

        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm text-gray-700">Require minimum 8 characters</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm text-gray-700">Require uppercase letters</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm text-gray-700">Require numbers</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm text-gray-700">Require special characters (!@#$%)</span>
          </label>
        </div>

        <div>
          <label className="text-sm font-bold text-gray-900 block mb-2">Password Expiry (days)</label>
          <input type="number" defaultValue="90" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">Recent Admin Activity</h2>

        <div className="space-y-2">
          {[
            { action: "Login", admin: "Admin User", time: "Today 14:30", ip: "192.168.1.1" },
            { action: "Settings Update", admin: "Admin User", time: "Today 12:45", ip: "192.168.1.1" },
            { action: "User Activation", admin: "Admin User", time: "Yesterday 10:15", ip: "192.168.1.2" },
          ].map((log, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm">
              <p className="font-bold text-gray-900">{log.action}</p>
              <p className="text-xs text-gray-600 mt-1">{log.admin} • {log.time} • {log.ip}</p>
            </div>
          ))}
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