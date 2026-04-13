import { useState, useRef, useEffect } from "react";
import { X, Send, Bot } from "lucide-react";
import { base44 } from "@/api/base44Client";

const QUICK_QUESTIONS = [
  "What is Kemedar?",
  "How to list a property?",
  "Find agents near me",
  "What is Kemework?",
  "Kemetro marketplace",
  "Franchise opportunities",
];

const SYSTEM_CONTEXT = `You are Kemedar Bot, the official AI assistant for Kemedar — a comprehensive real estate and services platform in the Middle East and North Africa.

Here's what you know about Kemedar:

**Kemedar Platform:**
- A multi-service platform combining real estate, professional services, and B2B commerce
- Serves buyers, sellers, agents, agencies, developers, franchise owners, and professionals

**Kemedar (Real Estate):**
- Browse and list properties: apartments, villas, offices, lands, commercial spaces
- Property purposes: Buy, Rent, Lease
- Users can post Buy Requests to find matching properties
- Verified listings by certified agents and agencies
- VERI service: property verification and certification
- LIST service: boosted marketing campaigns for properties
- Franchise owners manage specific geographic areas

**Agents & Agencies:**
- Individual real estate agents with verified profiles
- Agencies with teams of agents
- Users can find agents by area, specialization, and rating
- Agents help with buying, selling, renting properties

**Franchise Owners:**
- Kemedar has franchise owners who manage specific cities/areas
- They oversee listings, agents, and operations in their area
- Users can contact their local franchise representative

**Kemework (Professional Services):**
- Platform for finding skilled professionals: plumbers, electricians, painters, interior designers, contractors, etc.
- Post a task and get bids from professionals
- Browse services by category
- Hire directly or get quotes

**Kemetro (B2B Marketplace):**
- Bulk buying platform for construction materials, furniture, electronics, office supplies
- Post RFQs (Request for Quotation) to get offers from multiple sellers
- Verified sellers and products
- Shipping and logistics support

**Subscription Plans:**
- Free basic plan for listing properties
- Silver, Gold, Platinum plans with more features
- Premium services: VERI verification, LIST marketing boost

**Support:**
- Users can open support tickets for issues
- Knowledge base with guides and FAQs
- Franchise representatives available by area

Always be helpful, concise, and guide users to the right section of the app. If asked about specific properties or pricing, encourage users to use the search feature. Reply in the same language the user uses.`;

export default function ChatbotModule({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hi! 👋 I'm Kemedar Bot — your instant AI assistant. I can help you with properties, agents, franchise info, Kemework services, Kemetro products, and anything about Kemedar. What can I help you with?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const history = messages
      .map((m) => `${m.type === "user" ? "User" : "Bot"}: ${m.text}`)
      .join("\n");

    const prompt = `${SYSTEM_CONTEXT}

Conversation history:
${history}

User: ${text}

Reply as Kemedar Bot. Be helpful, concise, and friendly. Use bullet points or short lists when helpful. Don't be overly long.`;

    const response = await base44.integrations.Core.InvokeLLM({ prompt });

    const botMessage = {
      id: Date.now() + 1,
      type: "bot",
      text: typeof response === "string" ? response : response?.text || "Sorry, I couldn't process that. Please try again.",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  };

  const handleSend = () => sendMessage(input);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white max-w-[480px] mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Kemedar AI Bot</p>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              <p className="text-xs text-orange-100 font-medium">Always available</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition">
          <X size={18} className="text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} items-end gap-2`}>
            {msg.type === "bot" && (
              <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mb-1">
                <Bot size={14} className="text-orange-600" />
              </div>
            )}
            <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl shadow-sm ${
              msg.type === "user"
                ? "bg-orange-600 text-white rounded-br-none"
                : "bg-white text-gray-900 rounded-bl-none border border-gray-100"
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.type === "user" ? "text-orange-200" : "text-gray-400"}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start items-end gap-2">
            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-orange-600" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="px-4 py-3 bg-white border-t border-gray-100">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">Quick Questions</p>
          <div className="flex gap-2 flex-wrap">
            {QUICK_QUESTIONS.map((q) => (
              <button key={q} onClick={() => sendMessage(q)}
                className="text-xs bg-orange-50 border border-orange-200 text-orange-700 font-bold rounded-full px-3 py-1.5 hover:bg-orange-100 transition active:scale-95">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything about Kemedar..."
            disabled={loading}
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
          />
          <button onClick={handleSend} disabled={loading || !input.trim()}
            className="p-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-full transition active:scale-95 disabled:opacity-40 flex-shrink-0">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}