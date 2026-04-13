import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Paperclip, Phone, Video } from "lucide-react";

const CONVERSATIONS = [
  {
    id: 1,
    name: "Ahmed Hassan",
    avatar: "AH",
    lastMessage: "Are you available for viewing tomorrow?",
    messages: [
      { id: 1, from: "other", text: "Hi! I'm interested in your apartment in New Cairo", time: "2:30 PM" },
      { id: 2, from: "me", text: "Thanks! Yes, it's available. When would you like to view it?", time: "2:35 PM" },
      { id: 3, from: "other", text: "Are you available for viewing tomorrow?", time: "2:40 PM" },
    ]
  },
  {
    id: 2,
    name: "Fatima Mohamed",
    avatar: "FM",
    lastMessage: "Perfect, see you then!",
    messages: [
      { id: 1, from: "other", text: "Hello, I saw your property listing", time: "1:15 PM" },
      { id: 2, from: "me", text: "Hi Fatima! Feel free to ask any questions", time: "1:20 PM" },
    ]
  },
];

export default function MessageDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const conversation = CONVERSATIONS.find(c => c.id === parseInt(id)) || CONVERSATIONS[0];

  const handleSend = () => {
    if (message.trim()) {
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/cp/user/messages")}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div>
            <h2 className="font-bold text-gray-900">{conversation.name}</h2>
            <p className="text-xs text-gray-500">Active now</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition">
            <Phone size={18} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition">
            <Video size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
        {conversation.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-sm px-4 py-2.5 rounded-lg ${
                msg.from === "me"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white border border-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.from === "me" ? "text-blue-100" : "text-gray-400"
                }`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-6 py-4">
        <div className="flex items-end gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition flex-shrink-0">
            <Paperclip size={18} />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 border-0 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}