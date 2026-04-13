import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Phone, Info } from "lucide-react";

const MOCK_CONVERSATION = [
  { id: 1, sender: "other", name: "Ahmed Hassan", avatar: "AH", time: "10:30 AM", text: "Hi! Are you still interested in the apartment in New Cairo?" },
  { id: 2, sender: "me", time: "10:35 AM", text: "Yes, I am. When can I schedule a viewing?" },
  { id: 3, sender: "other", name: "Ahmed Hassan", avatar: "AH", time: "10:40 AM", text: "How about tomorrow at 3 PM? The location is perfect for families." },
  { id: 4, sender: "me", time: "10:42 AM", text: "That works for me. What's the address?" },
  { id: 5, sender: "other", name: "Ahmed Hassan", avatar: "AH", time: "10:45 AM", text: "123 Nile Street, New Cairo. I'll meet you at the entrance." },
  { id: 6, sender: "me", time: "10:50 AM", text: "Perfect! See you tomorrow." },
];

export default function MessagesDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(MOCK_CONVERSATION);

  const contactName = "Ahmed Hassan";
  const contactStatus = "Online";

  const handleSend = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "me",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: message,
        },
      ]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-[480px] mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button onClick={() => navigate("/m/messages")} className="p-1">
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm">{contactName}</p>
            <p className="text-xs text-green-600 font-medium">{contactStatus}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Phone size={18} className="text-gray-700" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Info size={18} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${
                msg.sender === "me"
                  ? "bg-orange-600 text-white rounded-br-none"
                  : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
              }`}
            >
              <p className="text-sm break-words">{msg.text}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.sender === "me" ? "text-orange-100" : "text-gray-500"
                }`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleSend}
            className="p-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-full transition active:scale-95 flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}