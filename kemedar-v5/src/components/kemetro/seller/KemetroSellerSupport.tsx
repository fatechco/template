"use client";
// @ts-nocheck
import { useState } from "react";
import { MessageCircle, Phone, Mail, FileText, ChevronDown, ChevronUp, Send, Check, ExternalLink } from "lucide-react";

const FAQS = [
  { q: "How do I activate my store?", a: "After registering, your store goes through a quick review (usually within 24 hours). You'll receive an email confirmation once it's approved and live." },
  { q: "How do I get paid for my orders?", a: "Payments are processed within 3–5 business days after order delivery confirmation. Funds are transferred directly to your registered bank account." },
  { q: "How can I upgrade my subscription plan?", a: "Go to Subscriptions & Services in your sidebar, choose your desired plan, and click Upgrade. Changes take effect immediately." },
  { q: "What happens if a customer requests a return?", a: "You'll receive a return request notification. You have 48 hours to accept or dispute it. Accepted returns are deducted from your next payout." },
  { q: "How do I add or edit my products?", a: "Navigate to My Products to manage existing listings, or click Add Product to create a new one. Changes are reflected live on your store." },
  { q: "Can I offer free shipping to customers?", a: "Yes — go to Shipping Settings, enable free shipping globally or per zone, and set the minimum order threshold that qualifies." },
  { q: "How do coupon codes work?", a: "Create coupons in the Coupons section. Customers can apply them at checkout. You can set usage limits, minimum order amounts, and expiry dates." },
  { q: "How do I contact a buyer about their order?", a: "Go to Orders, find the specific order, and use the Contact Buyer button to send them a message directly through the platform." },
];

const TICKET_CATEGORIES = ["Order Issue", "Payment Problem", "Product Listing", "Account & Settings", "Technical Bug", "Subscription", "Other"];

const CONTACT_CHANNELS = [
  { icon: MessageCircle, label: "Live Chat", desc: "Chat with our support team", action: "Start Chat", available: true, color: "bg-teal-50 border-teal-200 text-teal-700", btnClass: "bg-teal-600 hover:bg-teal-700 text-white" },
  { icon: Phone, label: "Phone Support", desc: "+20 1234 567 890 · Sun–Thu, 9am–6pm", action: "Call Now", available: true, color: "bg-blue-50 border-blue-200 text-blue-700", btnClass: "bg-blue-600 hover:bg-blue-700 text-white" },
  { icon: Mail, label: "Email Support", desc: "seller-support@kemetro.com", action: "Send Email", available: true, color: "bg-orange-50 border-orange-200 text-orange-700", btnClass: "bg-[#FF6B00] hover:bg-orange-600 text-white" },
];

const EMPTY_TICKET = { subject: "", category: "Order Issue", priority: "Medium", message: "" };

export default function KemetroSellerSupport() {
  const [openFaq, setOpenFaq] = useState(null);
  const [ticket, setTicket] = useState(EMPTY_TICKET);
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setTicket((t) => ({ ...t, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTicket(EMPTY_TICKET);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500";

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Support</h1>
        <p className="text-gray-500 text-sm mt-1">We're here to help — reach out or browse common questions below</p>
      </div>

      {/* Contact Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CONTACT_CHANNELS.map((ch) => (
          <div key={ch.label} className={`rounded-xl border-2 ${ch.color} p-5 flex flex-col gap-3`}>
            <div className="flex items-center gap-3">
              <ch.icon size={20} />
              <h3 className="font-black text-gray-900">{ch.label}</h3>
            </div>
            <p className="text-sm text-gray-600 flex-1">{ch.desc}</p>
            <button className={`w-full py-2 rounded-lg font-bold text-sm transition-colors ${ch.btnClass}`}>
              {ch.action}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submit a Ticket */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-black text-gray-900 flex items-center gap-2">
            <FileText size={18} className="text-teal-600" /> Submit a Support Ticket
          </h2>

          {submitted && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-semibold">
              <Check size={16} /> Ticket submitted! We'll respond within 24 hours.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
              <input required value={ticket.subject} onChange={(e) => set("subject", e.target.value)} className={inputClass} placeholder="Brief description of your issue" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                <select value={ticket.category} onChange={(e) => set("category", e.target.value)} className={inputClass}>
                  {TICKET_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
                <select value={ticket.priority} onChange={(e) => set("priority", e.target.value)} className={inputClass}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
              <textarea
                required
                rows={5}
                value={ticket.message}
                onChange={(e) => set("message", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 resize-none"
                placeholder="Describe your issue in detail..."
              />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl transition-colors">
              <Send size={16} /> Submit Ticket
            </button>
          </form>
        </div>

        {/* FAQ */}
        <div className="space-y-3">
          <h2 className="font-black text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="font-semibold text-gray-900 text-sm pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <a href="#" className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold text-sm pt-2">
            <ExternalLink size={14} /> View full documentation
          </a>
        </div>
      </div>
    </div>
  );
}