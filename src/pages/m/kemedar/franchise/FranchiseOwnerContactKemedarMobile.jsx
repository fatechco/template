import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CONTACT_METHODS = [
  { id: "chat", icon: "💬", label: "Message Chat" },
  { id: "voice", icon: "🎤", label: "Voice Chat" },
  { id: "video", icon: "📹", label: "Video Chat" },
  { id: "call", icon: "📞", label: "Call Kemedar" },
  { id: "inquiry", icon: "✉️", label: "Send Inquiry" },
  { id: "feedback", icon: "💡", label: "Feedback" },
];

export default function FranchiseOwnerContactKemedarMobile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-[480px] mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-base font-black text-gray-900">Contact Kemedar</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Extension */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white text-center">
          <p className="text-xs font-bold mb-2 opacity-90">Your Extension</p>
          <p className="text-3xl font-black cursor-pointer select-all">EXT-0423</p>
          <p className="text-xs mt-2 opacity-90 mb-2">Tap to copy</p>
          <p className="text-xs font-bold text-orange-100">Use for app login</p>
        </div>

        {/* Who's Online */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-sm font-black text-gray-900 mb-3">🟢 3 People Online</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-shrink-0 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold mb-1">
                  AK
                </div>
                <p className="text-xs font-bold text-gray-900">Ahmed</p>
                <p className="text-xs text-gray-600">📍 online</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Methods */}
        <div>
          <p className="text-sm font-black text-gray-900 mb-3">Get in Touch</p>
          <div className="grid grid-cols-2 gap-3">
            {CONTACT_METHODS.map(method => (
              <button key={method.id} className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition-all active:bg-orange-50">
                <p className="text-2xl mb-2">{method.icon}</p>
                <p className="text-xs font-bold text-gray-900">{method.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Country FO */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white flex items-center justify-center text-2xl font-black mx-auto mb-2">
            AH
          </div>
          <p className="font-black text-gray-900">Amr Hassan</p>
          <p className="text-xs text-gray-600">🇪🇬 Egypt</p>
          <p className="text-xs font-bold px-2 py-1 bg-orange-100 text-orange-700 rounded-full inline-block mt-1">Country Owner</p>
          <div className="flex gap-2 justify-center mt-3">
            <button className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg text-xs">📞</button>
            <button className="flex-1 bg-green-600 text-white font-bold py-2 rounded-lg text-xs">💬</button>
            <button className="flex-1 bg-purple-600 text-white font-bold py-2 rounded-lg text-xs">📧</button>
          </div>
        </div>

        {/* Broadcast */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-sm font-black text-gray-900 mb-3">📣 Broadcast</p>
          <input type="text" placeholder="Subject" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-orange-400" />
          <textarea placeholder="Message..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none h-16 mb-2 focus:outline-none focus:border-orange-400" />
          <button className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg text-sm">Send</button>
        </div>
      </div>
    </div>
  );
}