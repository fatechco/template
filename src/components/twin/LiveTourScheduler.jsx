import { useState } from "react";
import { Calendar, Users, Lock, Bell, Send } from "lucide-react";

export default function LiveTourScheduler({ propertyId, propertyName, onSchedule }) {
  const [tourType, setTourType] = useState("buyer_tour");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("14:00");
  const [duration, setDuration] = useState("30");
  const [isPublic, setIsPublic] = useState(false);
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("50");

  const handleSchedule = async () => {
    const sessionData = {
      propertyId,
      sessionType: tourType,
      title: title || `${propertyName} - Live Tour`,
      scheduledFor: `${date}T${time}`,
      duration: parseInt(duration),
      isPublic,
      passwordProtected,
      sessionPassword: passwordProtected ? password : null,
      maxParticipants: parseInt(maxParticipants),
      isRecorded: true
    };
    
    onSchedule(sessionData);
  };

  const tourTypes = [
    { value: "buyer_tour", label: "🎯 Private Buyer Tour", desc: "One-on-one with a specific buyer" },
    { value: "open_house", label: "🏠 Virtual Open House", desc: "Multiple buyers join at once" },
    { value: "verification_tour", label: "🔍 Verification Tour", desc: "Franchise Owner verifies property" },
    { value: "agent_preview", label: "👥 Agent Preview", desc: "Show to agents/brokers first" }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-black text-gray-900 mb-6">📅 Schedule Live Tour</h2>

      {/* Tour Type Selection */}
      <div className="mb-8">
        <p className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Tour Type</p>
        <div className="grid grid-cols-1 gap-3">
          {tourTypes.map(type => (
            <button
              key={type.value}
              onClick={() => setTourType(type.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                tourType === type.value
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <p className="font-bold text-gray-900">{type.label}</p>
              <p className="text-sm text-gray-600">{type.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tour Details */}
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Tour Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`e.g., Virtual Open House — ${propertyName}`}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Duration (min)</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="20">20 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">60 min</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Max Participants</label>
          <input
            type="number"
            min="2"
            max="200"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      {/* Access Settings */}
      <div className="bg-gray-50 rounded-xl p-4 mb-8 space-y-4">
        <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">Access Settings</p>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700">Public tour (listed on property page)</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={passwordProtected}
            onChange={(e) => setPasswordProtected(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700">Password protect this tour</span>
        </label>

        {passwordProtected && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter tour password"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          />
        )}

        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
          <Bell className="w-4 h-4" />
          <span>Reminders will be sent 1 day, 1 hour, and 15 min before tour</span>
        </div>
      </div>

      <button
        onClick={handleSchedule}
        disabled={!title || !date || !time}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 text-white font-black py-4 rounded-xl text-lg transition-all"
      >
        📅 Schedule Live Tour
      </button>
    </div>
  );
}