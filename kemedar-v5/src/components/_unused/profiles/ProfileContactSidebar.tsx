"use client";
// @ts-nocheck
import { useState } from "react";
import { Phone, MessageCircle, Mail, Calendar, Video, ShieldCheck } from "lucide-react";

export default function ProfileContactSidebar({ name, phone, roleBadge, avatar }) {
  const [showPhone, setShowPhone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Quick contact */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
            {avatar ? <img src={avatar} alt="" className="w-full h-full rounded-full object-cover" /> : name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-black text-gray-900 text-sm">{name}</p>
            {roleBadge && <span className="text-[10px] text-[#FF6B00] font-bold">{roleBadge}</span>}
          </div>
        </div>
        <button onClick={() => setShowPhone(true)} className="w-full flex items-center justify-center gap-2 border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white font-bold py-2.5 rounded-xl transition-all text-sm mb-2">
          <Phone size={14} />{showPhone ? phone || "+20 100 000 0000" : "Show Phone Number"}
        </button>
        <a href={`https://wa.me/${(phone || "").replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl transition-colors text-sm mb-2">
          <MessageCircle size={14} /> WhatsApp
        </a>
        <button className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold py-2.5 rounded-xl text-sm">
          <Mail size={14} /> Chat Now
        </button>
      </div>

      {/* Schedule */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h4 className="font-black text-gray-900 text-sm mb-3">Book a Meeting</h4>
        <div className="flex flex-col gap-2">
          <button className="w-full flex items-center justify-center gap-2 bg-[#1a1a2e] hover:bg-[#0d0d1a] text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
            <Calendar size={14} /> Schedule Visit
          </button>
          <button className="w-full flex items-center justify-center gap-2 border-2 border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white font-bold py-2.5 rounded-xl text-sm transition-all">
            <Video size={14} /> Video Meeting
          </button>
        </div>
      </div>

      {/* Send message */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h4 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2"><Mail size={13} className="text-[#FF6B00]" /> Send Message</h4>
        {sent ? (
          <div className="text-center py-4"><p className="text-2xl mb-1">✅</p><p className="text-green-600 font-bold text-sm">Message sent!</p></div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="flex flex-col gap-2">
            <input required placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
            <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
            <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
            <textarea required rows={3} placeholder="Your message..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
            <button type="submit" className="w-full bg-[#1a1a2e] hover:bg-[#0d0d1a] text-white font-bold py-2.5 rounded-xl text-sm transition-colors">Send</button>
          </form>
        )}
      </div>

      {/* VERI */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-3">
          <ShieldCheck size={24} className="flex-shrink-0" />
          <div>
            <p className="font-black text-sm">KEMEDAR VERI</p>
            <p className="text-xs text-green-100">Get this profile verified</p>
          </div>
        </div>
        <button className="w-full mt-3 bg-white text-green-700 font-bold text-xs py-2 rounded-lg hover:bg-green-50 transition-colors">Apply for Verification →</button>
      </div>
    </div>
  );
}