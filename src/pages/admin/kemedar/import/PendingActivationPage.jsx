import { Upload, AlertCircle } from "lucide-react";
import { useState } from "react";

const mockActivationData = [
  { phone: "+201001234567", user: "Ahmed Hassan", propertiesCount: 5, status: "pending", lastLogin: "2024-03-20", activated: "2024-03-21" },
  { phone: "+201101234567", user: "Layla Mohamed", propertiesCount: 3, status: "active", lastLogin: "2024-03-21", activated: "2024-03-20" },
];

export default function PendingActivationPage() {
  const [uploading, setUploading] = useState(false);
  const [phones, setPhones] = useState("");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Pending User Activation Manager</h1>
        <p className="text-sm text-gray-600 mt-1">Manage user activation and property import flow</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Pending Users", value: 234, color: "bg-yellow-100 text-yellow-700" },
          { label: "Pending Properties", value: 1250, color: "bg-blue-100 text-blue-700" },
          { label: "Activated This Month", value: 89, color: "bg-green-100 text-green-700" },
          { label: "Properties Activated", value: 567, color: "bg-purple-100 text-purple-700" },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-black">{stat.value}</p>
            <p className="text-xs font-bold mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">
        <p className="text-sm font-bold text-blue-900">📋 How It Works:</p>
        <ol className="text-xs text-blue-800 space-y-1 ml-4 list-decimal">
          <li>Every unique phone = pending user</li>
          <li>Username = phone | Password = last 6 digits</li>
          <li>Contact users to login</li>
          <li>Login → auto-activate → password popup</li>
          <li>After password change → property import popup</li>
          <li>Properties move from pending to active</li>
        </ol>
      </div>

      {/* Phone List Upload */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900">Upload Phone Numbers for Activation Campaign</h2>
        <p className="text-sm text-gray-700">Upload phone numbers to move their properties to PENDING (for re-activation campaign)</p>

        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
          <input
            type="file"
            accept=".csv"
            className="hidden"
            id="phones-upload"
          />
          <label htmlFor="phones-upload" className="cursor-pointer space-y-2">
            <p className="text-sm font-bold text-gray-900">📤 Drop CSV file or <span className="text-orange-600">Browse Files</span></p>
            <p className="text-xs text-gray-600">One phone per row</p>
          </label>
        </div>

        <div>
          <label className="text-sm font-bold text-gray-900 block mb-2">Or paste phone numbers:</label>
          <textarea
            value={phones}
            onChange={(e) => setPhones(e.target.value)}
            placeholder="+201001234567&#10;+201101234567&#10;+201201234567"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none resize-none h-32"
          />
        </div>

        <button
          onClick={() => setUploading(true)}
          disabled={uploading || phones.length === 0}
          className="w-full px-4 py-2.5 bg-orange-600 text-white rounded-lg font-bold text-sm hover:bg-orange-700 disabled:opacity-50"
        >
          {uploading ? "Processing..." : "Execute"}
        </button>

        {uploading && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <p className="text-sm font-bold text-green-700">✅ 15 properties will move to pending for 5 users</p>
          </div>
        )}
      </div>

      {/* Activation Report */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Activation Report</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">User</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Properties</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Last Login</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Activated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockActivationData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-900">{item.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{item.user}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{item.propertiesCount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                      item.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{item.lastLogin}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{item.activated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}