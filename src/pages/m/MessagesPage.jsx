import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MobileTopBar from '@/components/mobile-v2/MobileTopBar';
import { Search, MessageCircle, Phone, Video, Send, Paperclip, Mic, ChevronLeft } from 'lucide-react';

const CONVERSATIONS = [
  { id: 1, name: 'Ahmed Hassan', lastMsg: 'Thanks for the info!', time: '2m ago', online: true, unread: 2 },
  { id: 2, name: 'Fatima Al-Zahra', lastMsg: 'When can we meet?', time: '15m ago', online: false, unread: 0 },
  { id: 3, name: 'Muhammad Ali', lastMsg: 'Perfect, see you then', time: '1h ago', online: true, unread: 0 },
  { id: 4, name: 'Sara Mohamed', lastMsg: 'Thanks for your help', time: '3h ago', online: false, unread: 1 },
];

const MESSAGES_MOCK = [
  { id: 1, from: 'other', text: 'Hi there! How are you?', time: '10:30 AM', read: true },
  { id: 2, from: 'user', text: 'Hi! Doing great, thanks!', time: '10:32 AM', read: true },
  { id: 3, from: 'other', text: 'Do you have time for a call later?', time: '10:35 AM', read: true },
  { id: 4, from: 'user', text: 'Sure, how about 3 PM?', time: '10:36 AM', read: true },
  { id: 5, from: 'other', text: 'Perfect!', time: '10:37 AM', read: true },
];

export default function MessagesPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [search, setSearch] = useState('');
  const [messageText, setMessageText] = useState('');

  // List view or chat view
  if (!userId) {
    const filtered = CONVERSATIONS.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3" style={{ height: 56 }}>
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-lg">
            <ChevronLeft size={22} className="text-gray-900" />
          </button>
          <h1 className="text-lg font-black text-gray-900">Messages</h1>
        </div>

        {/* Search */}
        <div className="sticky top-14 z-20 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="divide-y divide-gray-100">
          {filtered.map(conv => (
            <button
              key={conv.id}
              onClick={() => navigate(`/m/messages/${conv.id}`)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors active:bg-gray-100"
            >
              {/* Avatar with online dot */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                  {conv.name.charAt(0)}
                </div>
                {conv.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0 text-left">
                <p className={`text-sm font-bold text-gray-900 ${conv.unread > 0 ? 'font-black' : ''}`}>
                  {conv.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{conv.lastMsg}</p>
              </div>

              {/* Time and Badge */}
              <div className="flex-shrink-0 text-right">
                <p className="text-xs text-gray-400">{conv.time}</p>
                {conv.unread > 0 && (
                  <div className="mt-1 w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {conv.unread}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Chat view
  const conversation = CONVERSATIONS.find(c => c.id === parseInt(userId));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-[480px] mx-auto">
      <MobileTopBar
        title={conversation?.name || 'Chat'}
        showBack
        rightAction={
          <div className="flex gap-2">
            <button className="p-1">
              <Phone size={18} className="text-gray-600" />
            </button>
            <button className="p-1">
              <Video size={18} className="text-gray-600" />
            </button>
          </div>
        }
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
        {MESSAGES_MOCK.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs ${
              msg.from === 'user'
                ? 'bg-orange-600 text-white rounded-2xl rounded-tr-none'
                : 'bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-tl-none'
            } px-4 py-2.5`}>
              <p className="text-sm">{msg.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${msg.from === 'user' ? 'justify-end' : ''}`}>
                <p className={`text-xs ${msg.from === 'user' ? 'text-orange-100' : 'text-gray-400'}`}>
                  {msg.time}
                </p>
                {msg.from === 'user' && (
                  <span className="text-xs">
                    {msg.read ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Paperclip size={18} className="text-gray-600" />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Mic size={18} className="text-gray-600" />
          </button>
          <button className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}