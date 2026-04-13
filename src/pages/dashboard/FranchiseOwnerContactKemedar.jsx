import { useState } from 'react';
import { MessageCircle, Phone, Video, Mail, Send, Star } from 'lucide-react';

const ONLINE_REPS = [
  { id: 1, name: "Ahmed Khalil", role: "Senior Support", avatar: "AK" },
  { id: 2, name: "Leila Nour", role: "Account Manager", avatar: "LN" },
  { id: 3, name: "Tariq Hassan", role: "Technical Lead", avatar: "TH" },
];

const COUNTRY_FO = {
  name: "Amr Hassan",
  role: "Egypt Country Owner",
  avatar: "AH",
  country: "🇪🇬 Egypt",
  areaOwners: 12,
};

const CONTACT_METHODS = [
  { id: "chat", icon: "💬", label: "Message Chat", color: "from-blue-500 to-blue-600" },
  { id: "voice", icon: "🎤", label: "Voice Chat", color: "from-green-500 to-green-600" },
  { id: "video", icon: "📹", label: "Video Chat", color: "from-purple-500 to-purple-600" },
  { id: "call", icon: "📞", label: "Call Kemedar", color: "from-orange-500 to-orange-600" },
  { id: "inquiry", icon: "✉️", label: "Send Inquiry", color: "from-navy-500 to-navy-600" },
  { id: "feedback", icon: "💡", label: "Feedback", color: "from-teal-500 to-teal-600" },
];

export default function FranchiseOwnerContactKemedar() {
  const [showInquiry, setShowInquiry] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto grid grid-cols-3 gap-6">
        {/* Left Column - Extension */}
        <div>
          {/* Extension Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white text-center mb-6 shadow-lg">
            <p className="text-4xl mb-4">📞</p>
            <p className="text-xs font-bold mb-2 opacity-90">Your Kemedar Extension</p>
            <p className="text-3xl font-black mb-4 cursor-pointer hover:opacity-90 transition-opacity select-all">EXT-0423</p>
            <button className="text-xs font-bold text-orange-100 hover:text-white">📱 Install Chat App</button>
          </div>

          {/* Online Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-black text-gray-900 mb-4">🟢 People Online Now</h3>
            <p className="text-sm text-gray-600 mb-4">3 Kemedar representatives online</p>
            <div className="space-y-3">
              {ONLINE_REPS.map(rep => (
                <div key={rep.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    {rep.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{rep.name}</p>
                    <p className="text-xs text-gray-600">{rep.role}</p>
                  </div>
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-xs font-bold text-orange-600 hover:text-orange-700">View All Online →</button>
          </div>
        </div>

        {/* Center Column - Contact Methods */}
        <div>
          <div className="border-l-4 border-orange-600 pl-4 mb-6">
            <h2 className="text-2xl font-black text-gray-900">Get in Touch</h2>
          </div>

          {/* Contact Method Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {CONTACT_METHODS.map(method => (
              <button key={method.id} className={`bg-gradient-to-br ${method.color} rounded-2xl p-6 text-white hover:shadow-lg transition-all text-center`}>
                <p className="text-3xl mb-2">{method.icon}</p>
                <p className="text-sm font-bold">{method.label}</p>
              </button>
            ))}
          </div>

          {/* Inquiry Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="font-black text-gray-900 mb-4">Send Inquiry</h3>
            <input type="text" placeholder="Subject" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-orange-400" />
            <textarea placeholder="Your message..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none h-20 mb-3 focus:outline-none focus:border-orange-400" />
            <button className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg hover:bg-orange-700 text-sm">📤 Send Inquiry</button>
          </div>

          {/* Feedback Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-black text-gray-900 mb-4">Share Feedback</h3>
            <div className="flex gap-2 justify-center mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} className="text-2xl hover:scale-110 transition-transform">⭐</button>
              ))}
            </div>
            <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-orange-400">
              <option>Category...</option>
              <option>Bug Report</option>
              <option>Suggestion</option>
              <option>Complaint</option>
            </select>
            <button className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg hover:bg-orange-700 text-sm">💡 Submit Feedback</button>
          </div>
        </div>

        {/* Right Column - Other Contacts */}
        <div className="space-y-6">
          {/* Country FO */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <h3 className="font-black text-gray-900 mb-4">Your Country Owner</h3>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white flex items-center justify-center text-2xl font-black mx-auto mb-3">
              {COUNTRY_FO.avatar}
            </div>
            <p className="font-black text-gray-900 text-lg mb-1">{COUNTRY_FO.name}</p>
            <p className="text-xs text-gray-600 mb-1">{COUNTRY_FO.country}</p>
            <p className="text-xs font-bold px-2 py-1 bg-orange-100 text-orange-700 rounded-full inline-block mb-4">Country Owner</p>
            <p className="text-sm text-gray-600 mb-4">{COUNTRY_FO.areaOwners} Area Owners under this region</p>
            <div className="flex gap-2 justify-center">
              <button className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg text-xs hover:bg-blue-700">📞 Call</button>
              <button className="flex-1 bg-green-600 text-white font-bold py-2 rounded-lg text-xs hover:bg-green-700">💬 Chat</button>
              <button className="flex-1 bg-purple-600 text-white font-bold py-2 rounded-lg text-xs hover:bg-purple-700">📧 Email</button>
            </div>
          </div>

          {/* Broadcast */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-black text-gray-900 mb-3 flex items-center gap-2">📣 Broadcast to All</h3>
            <p className="text-sm text-gray-600 mb-4">Send message to all Kemedar reps in your network</p>
            <input type="text" placeholder="Subject" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-orange-400" />
            <textarea placeholder="Message..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none h-20 mb-3 focus:outline-none focus:border-orange-400" />
            <button onClick={() => setShowBroadcast(true)} className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg hover:bg-orange-700 text-sm">📣 Send Broadcast</button>
          </div>

          {/* Calls Report */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900">📞 Calls Report</h3>
              <button className="text-xs font-bold text-orange-600 hover:text-orange-700">View All →</button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span>📞 Khalil Ahmed</span>
                <span className="text-gray-600">15m • Today</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span>📞 Leila Support</span>
                <span className="text-gray-600">8m • Yesterday</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>📞 Missed Call</span>
                <span className="text-red-600 font-bold">Missed</span>
              </div>
            </div>
            <button className="w-full mt-4 text-xs font-bold text-orange-600 hover:text-orange-700">📥 Download Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}