"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { MessageSquare, Send, ArrowLeft } from "lucide-react";

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setConversations([]);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const selected = conversations.find((c) => c.id === selectedId);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedId) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), text: newMessage, senderId: user?.id || "", createdAt: new Date().toISOString() }]);
    setNewMessage("");
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <div className="bg-white border rounded-xl p-4 space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 p-3">
              <div className="w-10 h-10 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <div className="bg-white border rounded-xl p-12 text-center text-slate-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No messages yet</h3>
          <p className="text-sm mt-1">Conversations with agents and buyers will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <div className="bg-white border rounded-xl overflow-hidden flex" style={{ height: "65vh" }}>
        {/* Conversation list */}
        <div className={`w-full md:w-80 border-r overflow-y-auto ${selectedId ? "hidden md:block" : ""}`}>
          {conversations.map((c) => (
            <button key={c.id} onClick={() => setSelectedId(c.id)} className={`w-full text-left p-4 border-b hover:bg-slate-50 flex gap-3 ${selectedId === c.id ? "bg-blue-50" : ""}`}>
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-500 shrink-0">
                {c.participantName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm truncate">{c.participantName}</span>
                  {c.unreadCount > 0 && <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{c.unreadCount}</span>}
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{c.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Message thread */}
        <div className={`flex-1 flex flex-col ${!selectedId ? "hidden md:flex" : "flex"}`}>
          {selected ? (
            <>
              <div className="p-4 border-b flex items-center gap-3">
                <button onClick={() => setSelectedId(null)} className="md:hidden p-1"><ArrowLeft className="w-5 h-5" /></button>
                <span className="font-semibold">{selected.participantName}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`max-w-[70%] ${m.senderId === user?.id ? "ml-auto" : ""}`}>
                    <div className={`px-4 py-2 rounded-2xl text-sm ${m.senderId === user?.id ? "bg-blue-600 text-white" : "bg-slate-100"}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t flex gap-2">
                <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Type a message..." className="flex-1 px-4 py-2 border rounded-lg text-sm" />
                <button onClick={handleSend} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"><Send className="w-4 h-4" /></button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Select a conversation</div>
          )}
        </div>
      </div>
    </div>
  );
}
