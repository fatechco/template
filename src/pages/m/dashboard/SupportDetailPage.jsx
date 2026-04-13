import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Menu, MoreVertical, Send, Paperclip } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const MOCK_TICKET = {
  id: "TK-001",
  subject: "Order delivery delayed",
  status: "open",
  priority: "high",
  module: "kemetro",
  created: "2025-03-19",
  agent: { name: "Sarah Kim", role: "Support Specialist", avatar: "SK" },
  messages: [
    {
      id: 1,
      sender: "You",
      text: "Hi, my order #ORD-2025-001 was supposed to arrive yesterday but it hasn't arrived yet. Can you help?",
      time: "2025-03-19 10:30 AM",
      avatar: "U",
    },
    {
      id: 2,
      sender: "Support Team",
      text: "Thank you for reaching out! I understand your concern. Let me check the status of your shipment.",
      time: "2025-03-19 11:00 AM",
      avatar: "SK",
    },
    {
      id: 3,
      sender: "Support Team",
      text: "I found your order. It was delayed due to weather conditions. Your package is expected to arrive today by 6 PM.",
      time: "2025-03-19 11:15 AM",
      avatar: "SK",
    },
    {
      id: 4,
      sender: "You",
      text: "Thank you for the update! I appreciate your help.",
      time: "2025-03-19 11:30 AM",
      avatar: "U",
    },
  ],
};

export default function SupportDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [reply, setReply] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      open: "bg-orange-100 text-orange-700",
      in_progress: "bg-blue-100 text-blue-700",
      pending: "bg-yellow-100 text-yellow-700",
      resolved: "bg-green-100 text-green-700",
      closed: "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32 flex items-start justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col relative">
        <MobileTopBar
          title={`Ticket ${MOCK_TICKET.id}`}
          showBack
          rightAction={
            <button onClick={() => setShowMenu(!showMenu)} className="p-1 relative">
              <MoreVertical size={20} className="text-gray-700" />
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 border-b">
                    📋 Copy link
                  </button>
                  {MOCK_TICKET.status !== "closed" && (
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 border-b">
                      🔄 Re-open
                    </button>
                  )}
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                    ❌ Close ticket
                  </button>
                </div>
              )}
            </button>
          }
        />

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Ticket Info */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="font-bold text-gray-900 text-lg">{MOCK_TICKET.subject}</p>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className={`inline-block text-xs font-bold px-2 py-1 rounded-full mt-1 ${getStatusColor(MOCK_TICKET.status)}`}>
                  {MOCK_TICKET.status === "open"
                    ? "🟠 Open"
                    : MOCK_TICKET.status === "in_progress"
                    ? "🔵 In Progress"
                    : "✅ Resolved"}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Priority</p>
                <span className="inline-block text-xs font-bold px-2 py-1 rounded-full mt-1 bg-red-100 text-red-700">
                  🔴 High
                </span>
              </div>
            </div>

            {/* Agent */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Handled by</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                  {MOCK_TICKET.agent.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{MOCK_TICKET.agent.name}</p>
                  <p className="text-xs text-gray-500">{MOCK_TICKET.agent.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-3">
            {MOCK_TICKET.messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs ${msg.sender === "You" ? "order-2" : ""}`}>
                  {msg.sender !== "You" && (
                    <p className="text-xs text-gray-600 font-bold mb-1">
                      {msg.sender} • {msg.time}
                    </p>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2.5 ${
                      msg.sender === "You"
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-gray-100 text-gray-900 rounded-tl-sm"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  {msg.sender === "You" && <p className="text-xs text-gray-600 mt-1 text-right">✓✓</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reply Input */}
        {MOCK_TICKET.status !== "closed" && (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-200 p-3">
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
                <Paperclip size={20} className="text-gray-600" />
              </button>
              <input
                type="text"
                placeholder="Type your reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex-shrink-0">
                <Send size={20} />
              </button>
            </div>
          </div>
        )}

        {MOCK_TICKET.status === "closed" && (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-gray-100 border-t border-gray-200 p-3 text-center">
            <p className="text-sm text-gray-600 font-bold">This ticket is closed</p>
            <button className="text-blue-600 text-sm font-bold mt-1">🔄 Re-open Ticket</button>
          </div>
        )}
      </div>
    </div>
  );
}