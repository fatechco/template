"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { Send, MessageCircle, HelpCircle, Info, Heart, Share2, ThumbsUp, Eye, Zap } from "lucide-react";

export default function LiveTourViewer({ sessionId, isHost = false }) {
  const [isLive, setIsLive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [reactions, setReactions] = useState({});
  const [viewers, setViewers] = useState(0);
  const [activeTab, setActiveTab] = useState("chat"); // chat | questions | info

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      type: "chat",
      content: newMessage,
      sender: "You",
      timestamp: new Date(),
      isMe: true
    };
    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const handleReaction = (reaction) => {
    setReactions(prev => ({
      ...prev,
      [reaction]: (prev[reaction] || 0) + 1
    }));
  };

  const reactionEmojis = ["❤️", "👍", "😮", "🏠"];

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Main Video Area - 70% */}
      <div className="flex-1 flex flex-col">
        {/* Video Stream */}
        <div className="flex-1 bg-gray-900 relative overflow-hidden flex items-center justify-center">
          {isHost ? (
            <div className="text-center">
              <Zap className="w-24 h-24 text-orange-500 mx-auto mb-4" />
              <p className="text-xl font-bold">📹 Live Camera Feed</p>
              <p className="text-sm text-gray-400 mt-2">Host would stream from device here</p>
            </div>
          ) : (
            <div className="text-center">
              <Eye className="w-24 h-24 text-orange-400 mx-auto mb-4" />
              <p className="text-xl font-bold">Waiting for tour to start...</p>
            </div>
          )}

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="font-bold text-sm">LIVE</span>
              <span className="text-sm text-gray-300">00:12:34</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">👥 {viewers} watching</span>
              <button className="hover:bg-white/20 p-2 rounded-lg transition">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Reactions */}
        <div className="bg-gray-900/80 px-4 py-3 flex gap-2 border-t border-gray-700">
          {reactionEmojis.map(emoji => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className="text-2xl hover:scale-110 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Right Sidebar - 30% */}
      <div className="w-96 bg-gray-950 border-l border-gray-800 flex flex-col">
        {/* Tabs */}
        <div className="grid grid-cols-3 border-b border-gray-800">
          {[
            { id: "chat", label: "💬", title: "Chat" },
            { id: "questions", label: "❓", title: "Questions" },
            { id: "info", label: "ℹ️", title: "Info" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-bold transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-orange-500 text-orange-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "chat" && (
            <div className="p-4 space-y-4">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">No messages yet. Be the first to chat!</p>
              ) : (
                messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`text-sm ${msg.isMe ? 'text-right' : ''}`}
                  >
                    <div className={`inline-block max-w-xs px-4 py-2 rounded-lg ${
                      msg.isMe 
                        ? 'bg-orange-500/30 text-orange-100' 
                        : 'bg-gray-800 text-gray-100'
                    }`}>
                      <p className="font-semibold text-xs text-gray-400 mb-1">{msg.sender}</p>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "questions" && (
            <div className="p-4 space-y-3">
              <div className="text-sm text-gray-400">
                <p className="font-bold mb-3">Ask a Question</p>
                <div className="bg-gray-800/50 rounded-lg p-2 mb-3">
                  <input
                    type="text"
                    placeholder="What would you like to know?"
                    className="w-full bg-transparent text-white text-xs focus:outline-none"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center py-4">No questions yet</p>
            </div>
          )}

          {activeTab === "info" && (
            <div className="p-4 space-y-4 text-sm">
              <div>
                <p className="font-bold mb-2">Property Details</p>
                <div className="space-y-2 text-gray-400 text-xs">
                  <p>Price: Contact for details</p>
                  <p>Size: 185 sqm</p>
                  <p>Bedrooms: 3</p>
                  <p>Bathrooms: 2</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-gray-800">
                <button className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-3 py-2 rounded-lg text-xs font-bold transition">
                  🤝 Make Offer
                </button>
                <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition">
                  💬 Contact
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        {activeTab === "chat" && (
          <div className="border-t border-gray-800 p-4 space-y-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="w-full bg-gray-800/50 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleSendMessage}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}