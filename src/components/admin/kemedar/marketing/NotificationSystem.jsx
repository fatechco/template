import React, { useState } from "react";
import { X, Trash2 } from "lucide-react";

export default function NotificationSystem() {
  const [language, setLanguage] = useState("en");
  const [notificationType, setNotificationType] = useState("informational");
  const [message, setMessage] = useState({ en: "", ar: "" });
  const [selectedRoles, setSelectedRoles] = useState({ common: true, agents: true, agencies: true, developers: true, franchiseOwners: true });
  const [scheduleType, setScheduleType] = useState("immediate");
  const [history, setHistory] = useState([
    { id: 1, message: "New property verified", type: "informational", roles: ["Agents", "Agencies"], recipients: 234, date: "2024-03-21", status: "sent" },
    { id: 2, message: "Weekly newsletter", type: "promotional", roles: ["All Users"], recipients: 5678, date: "2024-03-20", status: "sent" },
  ]);

  const estimatedReach = Object.values(selectedRoles).filter(Boolean).length * 1000 + Math.floor(Math.random() * 500);

  const toggleRole = (role) => {
    setSelectedRoles(prev => ({ ...prev, [role]: !prev[role] }));
  };

  const handleSend = () => {
    const newNotification = {
      id: history.length + 1,
      message: message[language],
      type: notificationType,
      roles: Object.entries(selectedRoles).filter(([_, v]) => v).map(([k]) => k),
      recipients: estimatedReach,
      date: new Date().toISOString().split('T')[0],
      status: scheduleType === "immediate" ? "sent" : "scheduled"
    };
    setHistory([newNotification, ...history]);
    setMessage({ en: "", ar: "" });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Send Notification Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <h2 className="text-2xl font-black text-gray-900">Create New Notification</h2>

        {/* Message Input */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-gray-900">Message</label>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 rounded text-xs font-bold ${language === "en" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                🇺🇸 English
              </button>
              <button
                onClick={() => setLanguage("ar")}
                className={`px-3 py-1.5 rounded text-xs font-bold ${language === "ar" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                🇸🇦 Arabic
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <textarea
              placeholder="English message..."
              value={message.en}
              onChange={(e) => setMessage({ ...message, en: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none resize-none h-24"
            />
            <textarea
              placeholder="رسالة عربية..."
              value={message.ar}
              onChange={(e) => setMessage({ ...message, ar: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none resize-none h-24"
            />
          </div>
        </div>

        {/* Notification Type */}
        <div>
          <label className="text-sm font-bold text-gray-900 block mb-3">Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { id: "informational", label: "Informational", icon: "🔔" },
              { id: "alert", label: "Alert", icon: "⚠️" },
              { id: "promotional", label: "Promotional", icon: "⭐" },
              { id: "update", label: "Update", icon: "ℹ️" },
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setNotificationType(type.id)}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  notificationType === type.id
                    ? "border-orange-600 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <p className="text-xs font-bold text-gray-900">{type.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Target Users */}
        <div>
          <label className="text-sm font-bold text-gray-900 block mb-3">Send To</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "common", label: "Common Users" },
              { id: "agents", label: "Agents" },
              { id: "agencies", label: "Agencies" },
              { id: "developers", label: "Developers" },
              { id: "franchiseOwners", label: "Franchise Owners" },
            ].map(role => (
              <button
                key={role.id}
                onClick={() => toggleRole(role.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedRoles[role.id]
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {selectedRoles[role.id] ? "✅" : "☐"} {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* Estimated Reach */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-bold text-blue-900">📊 This notification will reach approximately <span className="text-lg font-black">{estimatedReach.toLocaleString()}</span> users</p>
        </div>

        {/* Schedule */}
        <div>
          <label className="text-sm font-bold text-gray-900 block mb-3">Schedule</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" checked={scheduleType === "immediate"} onChange={() => setScheduleType("immediate")} />
              <span className="text-sm">Send immediately</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={scheduleType === "scheduled"} onChange={() => setScheduleType("scheduled")} />
              <span className="text-sm">Schedule for later</span>
            </label>
            {scheduleType === "scheduled" && (
              <div className="flex gap-2 ml-6 mt-2">
                <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg text-sm" />
                <input type="time" className="px-4 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={handleSend} className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700">
            📤 Send Notification
          </button>
          <button className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50">
            💾 Save as Draft
          </button>
        </div>
      </div>

      {/* Notification History */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-4">History</h2>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Message</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Type</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Recipients</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Sent Date</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map(notif => (
                  <tr key={notif.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-gray-900 max-w-xs truncate">{notif.message}</td>
                    <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded text-xs font-bold ${notif.type === "promotional" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>{notif.type}</span></td>
                    <td className="px-4 py-3 font-bold text-gray-900">{notif.recipients.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{notif.date}</td>
                    <td className="px-4 py-3"><span className="px-2.5 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">{notif.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-blue-600 font-bold text-xs hover:underline">Resend</button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Trash2 size={14} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}