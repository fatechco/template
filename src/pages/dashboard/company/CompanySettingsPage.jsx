import { Save } from "lucide-react";

export default function CompanySettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-900">⚙️ Settings</h1>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-black text-gray-900">Notification Preferences</h3>
        <div className="space-y-3">
          {[
            { label: "New Orders", desc: "Get notified when you receive a new order" },
            { label: "Messages", desc: "Receive notifications for new messages" },
            { label: "Reviews", desc: "Be notified when you get a new review" },
            { label: "Payment Alerts", desc: "Get alerts for payment confirmations" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-bold text-gray-900 text-sm">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-black text-gray-900">Privacy & Security</h3>
        <div className="space-y-3">
          {[
            { label: "Public Profile", desc: "Allow others to find and contact you" },
            { label: "Show Phone Number", desc: "Display your phone in your profile" },
            { label: "Two-Factor Authentication", desc: "Add an extra layer of security" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-bold text-gray-900 text-sm">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 border border-gray-200 rounded-lg font-bold text-gray-900 hover:bg-gray-50 text-sm">Cancel</button>
        <button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
          <Save size={16} /> Save Changes
        </button>
      </div>
    </div>
  );
}