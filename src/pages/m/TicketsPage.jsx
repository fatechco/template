import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MobileTopBar from '@/components/mobile-v2/MobileTopBar';
import { Plus, MessageSquare, Paperclip, Send } from 'lucide-react';

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

export default function TicketsPage() {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [activeTab, setActiveTab] = useState('open');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    module: 'kemedar',
    priority: 'medium',
    description: '',
  });

  const filtered = TICKETS_DATA.filter(t => t.status === activeTab);
  const currentTicket = TICKETS_DATA.find(t => t.id === parseInt(ticketId));

  // List view
  if (!ticketId) {
    return (
      <div className="min-h-screen bg-gray-50 pb-28 max-w-[480px] mx-auto">
        <MobileTopBar title="Support Tickets" showBack />

        {/* Tabs */}
        <div className="sticky top-14 z-30 bg-white border-b border-gray-200 px-4 py-3 flex gap-3">
          {['open', 'resolved'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                activeTab === tab
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab === 'open' ? 'Open' : 'Resolved'}
            </button>
          ))}
        </div>

        {/* Ticket List */}
        <div className="px-4 py-4 space-y-3">
          {filtered.map(ticket => (
            <button
              key={ticket.id}
              onClick={() => navigate(`/m/cp/user/tickets/${ticket.id}`)}
              className="w-full bg-white rounded-2xl p-4 border border-gray-200 text-left hover:border-orange-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-bold text-gray-500">{ticket.num}</p>
                  <p className="font-bold text-gray-900 mt-1">{ticket.subject}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    PRIORITY_CONFIG[ticket.priority].color
                  }`}>
                    {PRIORITY_CONFIG[ticket.priority].emoji} {PRIORITY_CONFIG[ticket.priority].label}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">Updated {ticket.updated}</p>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  ticket.status === 'open'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {ticket.status === 'open' ? '🔵 Open' : '🟢 Resolved'}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* New Ticket FAB */}
        <button
          onClick={() => setShowNewTicket(true)}
          className="fixed bottom-8 right-4 w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-700 transition-colors"
        >
          <Plus size={24} />
        </button>

        {/* New Ticket Sheet */}
        {showNewTicket && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
            <div className="w-full bg-white rounded-t-3xl p-4 max-h-[90vh] overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-lg font-black text-gray-900">New Support Ticket</h2>
                <p className="text-xs text-gray-500 mt-1">Tell us how we can help</p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Subject"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                />

                <select
                  value={newTicket.module}
                  onChange={(e) => setNewTicket({ ...newTicket, module: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  <option value="kemedar">Kemedar</option>
                  <option value="kemetro">Kemetro</option>
                  <option value="kemework">Kemework</option>
                </select>

                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>

                <textarea
                  placeholder="Describe your issue..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 min-h-24"
                />

                <button className="w-full border-2 border-dashed border-gray-300 rounded-lg py-6 text-sm text-gray-600 font-bold hover:border-orange-600">
                  <Paperclip size={18} className="mx-auto mb-1" />
                  Attach files (optional)
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowNewTicket(false)}
                    className="flex-1 border border-gray-300 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700">
                    Submit Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Ticket Detail View
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24 max-w-[480px] mx-auto">
      <MobileTopBar title={currentTicket?.num || 'Ticket'} showBack />

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