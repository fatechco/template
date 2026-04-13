import { useState } from 'react';
import { Plus, Search, Send, Paperclip, X, BookOpen, MessageCircle, Phone, Mail } from 'lucide-react';

const MOCK_TICKETS = [
  {
    id: 'TK-001',
    subject: 'Order delivery delayed',
    module: 'kemetro',
    status: 'open',
    priority: 'high',
    lastMessage: 'Support Team replied: We\'re investigating the shipment delay...',
    lastMessageTime: '2h ago',
    unread: true,
    created: '2025-03-19',
    agent: { name: 'Sarah Kim', role: 'Support Specialist', avatar: 'SK' },
    messages: [
      { id: 1, sender: 'You', text: 'Hi, my order #ORD-2025-001 was supposed to arrive yesterday but it hasn\'t arrived yet. Can you help?', time: '10:30 AM' },
      { id: 2, sender: 'Support Team', text: 'Thank you for reaching out! I understand your concern. Let me check the status of your shipment.', time: '11:00 AM' },
      { id: 3, sender: 'Support Team', text: 'I found your order. It was delayed due to weather conditions. Your package is expected to arrive today by 6 PM.', time: '11:15 AM' },
      { id: 4, sender: 'You', text: 'Thank you for the update! I appreciate your help.', time: '11:30 AM' },
    ],
  },
  {
    id: 'TK-002',
    subject: 'Payment processing issue',
    module: 'kemetro',
    status: 'in_progress',
    priority: 'high',
    lastMessage: 'You: The payment gateway is showing an error code',
    lastMessageTime: '5h ago',
    unread: false,
    created: '2025-03-20',
    agent: { name: 'Ahmed Hassan', role: 'Billing Specialist', avatar: 'AH' },
    messages: [
      { id: 1, sender: 'You', text: 'The payment gateway is showing an error code when I try to process payments.', time: '9:00 AM' },
      { id: 2, sender: 'Support Team', text: 'I\'m looking into this now. Can you share the error code you\'re seeing?', time: '9:30 AM' },
    ],
  },
  {
    id: 'TK-003',
    subject: 'Product listing verification',
    module: 'general',
    status: 'pending',
    priority: 'medium',
    lastMessage: 'Support Team: We need more details about your products',
    lastMessageTime: '1d ago',
    unread: false,
    created: '2025-03-18',
    agent: { name: 'Maya Lee', role: 'Verification Team', avatar: 'ML' },
    messages: [
      { id: 1, sender: 'You', text: 'I submitted my products for verification 3 days ago but haven\'t heard back.', time: 'Mar 18' },
      { id: 2, sender: 'Support Team', text: 'We need more details about your products to complete the verification.', time: 'Mar 19' },
    ],
  },
];

const STATUS_COLORS = {
  open: 'bg-orange-100 text-orange-700',
  in_progress: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
};

const STATUS_LABELS = {
  open: '🟠 Open',
  in_progress: '🔵 In Progress',
  pending: '🟡 Pending',
  resolved: '✅ Resolved',
  closed: '⚫ Closed',
};

const PRIORITY_BADGE = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

const PRIORITY_LABEL = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };

const MODULE_COLORS = {
  kemetro: 'bg-blue-100 text-blue-700',
  kemedar: 'bg-orange-100 text-orange-700',
  kemework: 'bg-teal-100 text-teal-700',
  general: 'bg-gray-100 text-gray-700',
};

const FILTERS = [
  { id: 'all', label: 'All', count: 3 },
  { id: 'open', label: 'Open', count: 2 },
  { id: 'in_progress', label: 'In Progress', count: 1 },
  { id: 'pending', label: 'Pending', count: 1 },
  { id: 'resolved', label: 'Resolved', count: 0 },
  { id: 'closed', label: 'Closed', count: 0 },
];

function NewTicketModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-gray-900">New Support Ticket</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Subject</label>
            <input type="text" placeholder="Briefly describe your issue" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Module</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400">
              <option value="kemetro">🛒 Kemetro</option>
              <option value="kemedar">🏠 Kemedar</option>
              <option value="kemework">🔧 Kemework</option>
              <option value="general">⚙️ General</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Priority</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400">
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Description</label>
            <textarea rows={4} placeholder="Describe your issue in detail..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none" />
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={onClose} className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700">Submit Ticket</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TicketDetail({ ticket, onClose }) {
  const [reply, setReply] = useState('');
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-xs font-bold text-gray-400 mb-1">{ticket.id}</p>
          <h2 className="text-lg font-black text-gray-900 leading-tight">{ticket.subject}</h2>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg flex-shrink-0"><X size={18} /></button>
      </div>

      {/* Ticket Meta */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="grid grid-cols-3 gap-4 mb-3 text-xs">
          <div>
            <p className="text-gray-500 mb-1">Status</p>
            <span className={`inline-block font-bold px-2 py-1 rounded-full ${STATUS_COLORS[ticket.status]}`}>
              {STATUS_LABELS[ticket.status]}
            </span>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Priority</p>
            <span className={`inline-block font-bold px-2 py-1 rounded-full ${PRIORITY_BADGE[ticket.priority]}`}>
              {PRIORITY_LABEL[ticket.priority]}
            </span>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Module</p>
            <span className={`inline-block font-bold px-2 py-1 rounded-full capitalize ${MODULE_COLORS[ticket.module]}`}>
              {ticket.module}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
          <div className="w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">{ticket.agent.avatar}</div>
          <div>
            <p className="text-xs font-bold text-gray-900">{ticket.agent.name}</p>
            <p className="text-xs text-gray-500">{ticket.agent.role}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {ticket.messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[75%]">
              {msg.sender !== 'You' && (
                <p className="text-xs text-gray-500 font-bold mb-1">{msg.sender} · {msg.time}</p>
              )}
              <div className={`rounded-2xl px-4 py-2.5 text-sm ${msg.sender === 'You' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-900 rounded-tl-sm'}`}>
                {msg.text}
              </div>
              {msg.sender === 'You' && <p className="text-xs text-gray-400 mt-1 text-right">{msg.time} ✓✓</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Reply */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg"><Paperclip size={18} className="text-gray-500" /></button>
          <input
            type="text"
            placeholder="Type your reply..."
            value={reply}
            onChange={e => setReply(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1.5 font-bold text-sm">
            <Send size={16} /> Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SupportDesktop() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicket, setShowNewTicket] = useState(false);

  const filtered = MOCK_TICKETS.filter(t => {
    const statusMatch = activeFilter === 'all' || t.status === activeFilter;
    const searchMatch = !search || t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search);
    return statusMatch && searchMatch;
  });

  return (
    <div className="p-8 h-full">
      {showNewTicket && <NewTicketModal onClose={() => setShowNewTicket(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Support</h1>
          <p className="text-gray-600">Manage your support tickets and get help</p>
        </div>
        <button
          onClick={() => setShowNewTicket(true)}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> New Ticket
        </button>
      </div>

      {/* Stats + Quick Help */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-2xl font-black text-orange-600">2</p>
            <p className="text-xs text-gray-500 mt-1">Open</p>
          </div>
          <div>
            <p className="text-2xl font-black text-yellow-600">1</p>
            <p className="text-xs text-gray-500 mt-1">Pending</p>
          </div>
          <div>
            <p className="text-2xl font-black text-green-600">0</p>
            <p className="text-xs text-gray-500 mt-1">Resolved</p>
          </div>
        </div>

        {[
          { icon: '📚', title: 'Knowledge Base', sub: 'Find answers fast' },
          { icon: '💬', title: 'Live Chat', sub: '🟢 Online now', green: true },
          { icon: '📧', title: 'Email Support', sub: 'support@kemedar.com' },
        ].map(item => (
          <div key={item.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
            <span className="text-3xl">{item.icon}</span>
            <div>
              <p className="font-bold text-gray-900 text-sm">{item.title}</p>
              <p className={`text-xs mt-0.5 ${item.green ? 'text-green-600 font-bold' : 'text-gray-500'}`}>{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className={`flex gap-6 ${selectedTicket ? 'h-[calc(100vh-340px)]' : ''}`}>
        {/* Ticket List */}
        <div className={`${selectedTicket ? 'w-[380px] flex-shrink-0' : 'flex-1'} flex flex-col`}>
          {/* Filters + Search */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
            <div className="flex gap-2 flex-wrap mb-3">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${activeFilter === f.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2.5">
              <Search size={15} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Tickets */}
          <div className="space-y-3 overflow-y-auto flex-1">
            {filtered.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <p className="text-4xl mb-2">🎫</p>
                <p className="font-bold text-gray-900">No tickets found</p>
                <p className="text-sm text-gray-500 mt-1">Try a different filter or search term</p>
              </div>
            )}
            {filtered.map(ticket => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`w-full text-left bg-white rounded-2xl border p-5 hover:shadow-md transition-all ${selectedTicket?.id === ticket.id ? 'border-blue-400 shadow-md' : 'border-gray-100'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs font-bold text-gray-400">{ticket.id}</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${PRIORITY_BADGE[ticket.priority]}`}>
                    {PRIORITY_LABEL[ticket.priority]}
                  </span>
                </div>
                <p className={`font-bold text-gray-900 text-sm mb-2 ${selectedTicket ? 'line-clamp-1' : 'line-clamp-2'}`}>{ticket.subject}</p>
                <div className="flex gap-2 flex-wrap mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${MODULE_COLORS[ticket.module]}`}>
                    {ticket.module === 'kemetro' ? '🛒 Kemetro' : ticket.module === 'kemedar' ? '🏠 Kemedar' : '⚙️ General'}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLORS[ticket.status]}`}>
                    {STATUS_LABELS[ticket.status]}
                  </span>
                </div>
                {!selectedTicket && <p className="text-xs text-gray-500 line-clamp-1">{ticket.lastMessage}</p>}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400">⏰ {ticket.lastMessageTime}</p>
                  {ticket.unread && <span className="text-xs font-bold text-blue-600">🔵 New reply</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Ticket Detail */}
        {selectedTicket && (
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <TicketDetail ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
          </div>
        )}
      </div>
    </div>
  );
}