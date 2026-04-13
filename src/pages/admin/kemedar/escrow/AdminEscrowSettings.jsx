import { Settings as SettingsIcon } from "lucide-react";

export default function AdminEscrowSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><SettingsIcon className="w-6 h-6 text-orange-500" /> Escrow Settings</h1>
        <p className="text-gray-500 text-sm">Manage Escrow configuration and policies</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div>
          <h3 className="font-black text-gray-900 mb-4">Platform Fees</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-semibold">Earnest Deposit Fee</span>
              <span className="font-black text-orange-600">1.5%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-semibold">Balance Release Fee</span>
              <span className="font-black text-orange-600">1.5%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-semibold">Dispute Resolution Fee</span>
              <span className="font-black text-orange-600">2.0%</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="font-black text-gray-900 mb-4">Milestone Settings</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-1">Auto-Release After Days</p>
              <p className="text-xs text-gray-500">Funds auto-released if no dispute within N days</p>
              <input type="number" defaultValue={3} className="w-20 mt-2 px-2 py-1 border border-gray-200 rounded text-sm" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="font-black text-gray-900 mb-4">Dispute Policy</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-1">Dispute Window (Days)</p>
              <p className="text-xs text-gray-500">Maximum days after milestone to raise dispute</p>
              <input type="number" defaultValue={10} className="w-20 mt-2 px-2 py-1 border border-gray-200 rounded text-sm" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}