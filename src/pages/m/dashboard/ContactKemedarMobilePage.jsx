import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageCircle, Video, Mic, Lightbulb, Bot, Zap, ChevronRight } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";
import ChatbotModule from "@/components/mobile-v2/ChatbotModule";

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "support@kemedar.com", sub: "Reply within 24 hours", color: "bg-blue-100 text-blue-600" },
  { icon: Phone, label: "Phone", value: "+20 (2) 1234 5678", sub: "Mon–Fri, 9am–6pm EET", color: "bg-green-100 text-green-600" },
  { icon: MapPin, label: "Address", value: "123 Nile Street, Cairo, Egypt 11511", sub: "Head Office", color: "bg-orange-100 text-orange-600" },
  { icon: Clock, label: "Hours", value: "Mon–Fri: 9:00–18:00", sub: "Sat: 10:00–16:00 · Sun: Closed", color: "bg-purple-100 text-purple-600" },
];

const CONTACT_CHANNELS = [
  { icon: MessageCircle, label: "Live Chat", sub: "Chat now", bg: "bg-blue-600" },
  { icon: Mic, label: "Voice Chat", sub: "Start call", bg: "bg-green-600" },
  { icon: Video, label: "Video Chat", sub: "Video call", bg: "bg-purple-600" },
  { icon: Lightbulb, label: "Feedback", sub: "Share thoughts", bg: "bg-gray-600" },
];

const CATEGORIES = ["General Inquiry", "Technical Support", "Billing & Payments", "Feedback", "Partnership"];

export default function ContactKemedarMobilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ subject: "", category: "General Inquiry", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ subject: "", category: "General Inquiry", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28 max-w-[480px] mx-auto">
      <MobileTopBar title="Contact Kemedar" showBack />

      <div className="px-4 py-4 space-y-4">

        {/* AI Bot Hero */}
        <div
          onClick={() => setShowChatbot(true)}
          className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl p-5 shadow-lg cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Bot size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white font-black text-base leading-tight">Kemedar AI Bot</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                  <p className="text-orange-100 text-xs font-medium">Always online · Instant replies</p>
                </div>
              </div>
            </div>
            <ChevronRight size={20} className="text-white/70 mt-1" />
          </div>
          <p className="text-white/90 text-sm mb-3 leading-relaxed">
            Ask anything about Kemedar — properties, agents, franchise owners, Kemework, Kemetro and more.
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {["🏠 Properties", "👷 Agents", "🔧 Kemework", "🛒 Kemetro", "🏢 Franchise"].map(tag => (
              <span key={tag} className="text-[11px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-full">{tag}</span>
            ))}
          </div>
          <div className="bg-white/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <Zap size={14} className="text-yellow-300 flex-shrink-0" />
            <p className="text-white text-xs font-bold">Tap to chat with Kemedar AI Bot →</p>
          </div>
        </div>

        {/* Quick Contact Channels */}
        <div>
          <p className="text-sm font-black text-gray-900 mb-3">Quick Contact</p>
          <div className="grid grid-cols-2 gap-3">
            {CONTACT_CHANNELS.map(ch => {
              const Icon = ch.icon;
              return (
                <button key={ch.label} className={`${ch.bg} rounded-2xl p-4 flex items-center gap-3 shadow-sm active:scale-95 transition-transform`}>
                  <Icon size={22} className="text-white flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-[13px] font-black text-white">{ch.label}</p>
                    <p className="text-[11px] text-white/70">{ch.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact Info Cards */}
        <div>
          <p className="text-sm font-black text-gray-900 mb-3">Contact Information</p>
          <div className="space-y-3">
            {CONTACT_INFO.map(info => {
              const Icon = info.icon;
              return (
                <div key={info.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${info.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-500">{info.label}</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{info.value}</p>
                    <p className="text-[11px] text-gray-400">{info.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Send Inquiry Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-sm font-black text-gray-900 mb-4">Send an Inquiry</p>

          {submitted ? (
            <div className="py-8 flex flex-col items-center text-center">
              <CheckCircle size={40} className="text-green-500 mb-3" />
              <p className="font-bold text-gray-900">Message Sent!</p>
              <p className="text-sm text-gray-500 mt-1">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  required
                  placeholder="What is this about?"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Message</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                  rows={4}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-orange-400"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl text-sm transition active:scale-95"
              >
                <Send size={16} /> Send Message
              </button>
            </form>
          )}
        </div>

        {/* Create Ticket CTA */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-700 mb-3">Have a specific issue? Open a support ticket for faster resolution.</p>
          <button
            onClick={() => navigate("/m/cp/user/tickets")}
            className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl text-sm"
          >
            Create a Support Ticket
          </button>
        </div>

      </div>

      {showChatbot && <ChatbotModule onClose={() => setShowChatbot(false)} />}
    </div>
  );
}