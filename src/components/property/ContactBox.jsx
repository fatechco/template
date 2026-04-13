import { useState } from "react";
import { Phone, MessageCircle, Mail, Calendar, Video, MapPin } from "lucide-react";

export default function ContactBox({ property }) {
  const [showPhone, setShowPhone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const publisherName = property?.publisher_name || "Property Owner";
  const publisherType = property?.publisher_type || "Agent";
  const phone = property?.direct_phone || "+20 100 000 0000";

  const handleSend = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Publisher card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-xl flex-shrink-0">
            {publisherName[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-black text-gray-900 text-base">{publisherName}</p>
            <span className="inline-block bg-[#FF6B00]/10 text-[#FF6B00] text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5">
              {publisherType.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Phone */}
        <button
          onClick={() => setShowPhone(true)}
          className="w-full flex items-center justify-center gap-2 border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white font-bold py-2.5 rounded-xl transition-all text-sm mb-2"
        >
          <Phone size={15} />
          {showPhone ? phone : "Show Phone Number"}
        </button>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${phone.replace(/\D/g, "")}`}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl transition-colors text-sm mb-2"
        >
          <MessageCircle size={15} /> WhatsApp
        </a>

        {/* Chat */}
        <button className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
          <Mail size={15} /> Chat Now
        </button>
      </div>

      {/* Email Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-black text-gray-900 text-sm mb-4 flex items-center gap-2">
          <Mail size={14} className="text-[#FF6B00]" /> Send a Message
        </h3>
        {sent ? (
          <div className="text-center py-4">
            <p className="text-2xl mb-2">✅</p>
            <p className="font-bold text-green-600 text-sm">Message sent successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex flex-col gap-2.5">
            <input required placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
            <input required type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
            <input placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
            <textarea required rows={3} placeholder="I'm interested in this property..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
            <button type="submit" className="w-full bg-[#1a1a2e] hover:bg-[#0d0d1a] text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
              Send Message
            </button>
          </form>
        )}
      </div>

      {/* Schedule */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-black text-gray-900 text-sm mb-3">Request a Viewing</h3>
        <div className="flex flex-col gap-2">
          <button className="w-full flex items-center justify-center gap-2 bg-[#1a1a2e] hover:bg-[#0d0d1a] text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
            <Calendar size={15} /> Schedule a Visit
          </button>
          <button className="w-full flex items-center justify-center gap-2 border-2 border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white font-bold py-2.5 rounded-xl transition-all text-sm">
            <Video size={15} /> Video Meeting
          </button>
        </div>
      </div>

      {/* Franchise Owner Verification Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-wide bg-orange-50 px-2 py-0.5 rounded-full">KEMEDAR VERI</span>
        </div>
        <p className="font-black text-gray-900 text-sm mb-1">Get This Property Verified</p>
        <p className="text-xs text-gray-500 mb-4">Contact the Franchise Owner in your area to verify this listing and get the <span className="font-bold text-green-600">✓ VERIFIED</span> badge.</p>

        {/* Franchise Owner Profile */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#FF6B00]">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&q=80"
              alt="Franchise Owner"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-black text-gray-900 text-sm leading-tight">Mohamed Karim</p>
            <span className="inline-block text-[10px] font-bold text-white bg-[#FF6B00] px-2 py-0.5 rounded-full">Franchise Owner</span>
            <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin size={10} className="text-[#FF6B00]" /> New Cairo Area
            </p>
          </div>
        </div>

        <a
          href="tel:+201001234567"
          className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl transition-colors text-sm mb-2"
        >
          <Phone size={14} /> Call Franchise Owner
        </a>
        <a
          href="https://wa.me/201001234567"
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
        >
          <MessageCircle size={14} /> WhatsApp
        </a>
      </div>
    </div>
  );
}