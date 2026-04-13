import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Paperclip } from "lucide-react";

const TICKETS_DATA = [
  { id: 1, num: '#TKT001', subject: 'Payment not processed', priority: 'high', status: 'open', updated: '2h ago' },
  { id: 2, num: '#TKT002', subject: 'How to list a product?', priority: 'low', status: 'open', updated: '5h ago' },
  { id: 3, num: '#TKT003', subject: 'Account verification failed', priority: 'high', status: 'resolved', updated: '1d ago' },
  { id: 4, num: '#TKT004', subject: 'Shipping label issue', priority: 'medium', status: 'resolved', updated: '2d ago' },
];

const MESSAGES_THREAD = [
  { id: 1, from: 'support', text: 'Hi! We received your ticket. Our team is looking into it.', time: '2h ago' },
  { id: 2, from: 'user', text: 'Thank you, please let me know asap', time: '1h ago' },
  { id: 3, from: 'support', text: 'We found the issue with your payment. It was a system timeout. Retrying now...', time: '30m ago' },
];

const PRIORITY_CONFIG = {
  high: { emoji: '🔴', label: 'High', color: 'bg-red-100 text-red-700' },
  medium: { emoji: '🟡', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  low: { emoji: '🟢', label: 'Low', color: 'bg-green-100 text-green-700' },
};

export default function TicketsDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [replyText, setReplyText] = useState('');
  
  const currentTicket = TICKETS_DATA.find(t => t.id === parseInt(id)) || TICKETS_DATA[0];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24 max-w-[480px] mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/m/cp/user/tickets")} className="p-1">
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <span className="text-sm font-bold text-gray-500">Ticket Details</span>
        <div className="w-6"></div>
      </div>

      {/* Ticket Info */}
      {currentTicket && (
        <div className="bg-white border-b border-gray-200 p-4">
          <p className="font-black text-gray-900 text-lg mb-2">{currentTicket.subject}</p>
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              PRIORITY_CONFIG[currentTicket.priority].color
            }`}>
              {PRIORITY_CONFIG[currentTicket.priority].emoji} {PRIORITY_CONFIG[currentTicket.priority].label}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              currentTicket.status === 'open'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {currentTicket.status === 'open' ? '🔵 Open' : '🟢 Resolved'}
            </span>
          </div>
        </div>
      )}

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {MESSAGES_THREAD.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs ${
              msg.from === 'user'
                ? 'bg-orange-600 text-white rounded-2xl rounded-tr-none'
                : 'bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-tl-none'
            } px-4 py-2.5`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${
                msg.from === 'user' ? 'text-orange-100' : 'text-gray-400'
              }`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-end gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
            <Paperclip size={18} />
          </button>
          <textarea
            placeholder="Type your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
            rows="2"
          />
          <button className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}