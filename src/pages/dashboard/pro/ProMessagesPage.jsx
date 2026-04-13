import { useState } from "react";
import { Search, Send, X } from "lucide-react";

const MESSAGES = [
  { id: 1, name: "Ahmed Hassan", avatar: "AH", lastMsg: "When can you start the project?", time: "2m ago", unread: true },
  { id: 2, name: "Fatima Ali", avatar: "FA", lastMsg: "Thanks for the quote", time: "1h ago", unread: false },
  { id: 3, name: "Mohamed Samir", avatar: "MS", lastMsg: "Payment confirmed", time: "3h ago", unread: false },
];

export default function ProMessagesPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-900">💬 Messages</h1>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex h-96">
        {/* Chat List */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search messages..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {MESSAGES.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).map(msg => (
              <button key={msg.id} onClick={() => setSelectedChat(msg)}
                className={`w-full px-4 py-3 border-b border-gray-100 text-left transition-colors ${
                  selectedChat?.id === msg.id ? "bg-amber-50" : "hover:bg-gray-50"
                }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-600 flex-shrink-0">
                    {msg.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${msg.unread ? "text-gray-900" : "text-gray-600"}`}>{msg.name}</p>
                    <p className="text-xs text-gray-500 truncate">{msg.lastMsg}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{msg.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">{selectedChat.name}</h3>
                <button onClick={() => setSelectedChat(null)} className="p-1 hover:bg-gray-100 rounded">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
              <div className="flex-1 px-6 py-4 overflow-y-auto space-y-3">
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-sm max-w-xs">{selectedChat.lastMsg}</div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm max-w-xs">Thanks for reaching out!</div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex gap-2">
                <input type="text" placeholder="Type a message..." className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
                <button className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-lg transition-colors"><Send size={18} /></button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}