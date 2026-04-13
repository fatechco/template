import { Save, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function EmailSettings() {
  const [saved, setSaved] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestEmail = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* SMTP Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">SMTP Configuration</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">SMTP Host</label>
            <input type="text" defaultValue="smtp.gmail.com" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">SMTP Port</label>
            <input type="number" defaultValue="587" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">Username</label>
            <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">Password</label>
            <input type="password" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-gray-900 block mb-2">Encryption</label>
          <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none">
            <option>TLS</option>
            <option>SSL</option>
            <option>None</option>
          </select>
        </div>
      </div>

      {/* Email From Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">Email From Settings</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">From Name</label>
            <input type="text" defaultValue="Kemedar Support" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">From Email</label>
            <input type="email" defaultValue="noreply@kemedar.com" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none" />
          </div>
        </div>

        <button onClick={handleTestEmail} className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50">
          {testSent ? "✓ Test email sent" : "📧 Send Test Email"}
        </button>
      </div>

      {/* Email Templates */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">Email Templates</h2>

        <div className="space-y-2">
          {[
            "Welcome Email",
            "Password Reset",
            "Property Approved",
            "Property Rejected",
            "Notification Email",
            "Invoice Email",
          ].map(template => (
            <div key={template} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-bold text-gray-900">{template}</p>
              <button className="text-blue-600 text-sm font-bold hover:underline">Edit Template</button>
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