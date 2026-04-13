import { useState } from "react";
import SiteHeader from "@/components/header/SiteHeader";
import SuperFooter from "@/components/layout/SuperFooter";
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle, Headphones } from "lucide-react";

const CONTACT_CARDS = [
  {
    icon: Mail,
    title: "Email Us",
    value: "hello@kemedar.com",
    sub: "We reply within 24 hours",
    color: "text-blue-600 bg-blue-50",
    href: "mailto:hello@kemedar.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+20 2 1234 5678",
    sub: "Sun–Thu, 9am–6pm EET",
    color: "text-green-600 bg-green-50",
    href: "tel:+20212345678",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "New Cairo, Cairo",
    sub: "Egypt Headquarters",
    color: "text-[#FF6B00] bg-orange-50",
    href: "https://maps.google.com",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "+20 100 123 4567",
    sub: "Chat with us directly",
    color: "text-green-600 bg-green-50",
    href: "https://wa.me/201001234567",
  },
];

const SUBJECTS = ["General Inquiry", "Property Listing Help", "Technical Support", "Billing & Payments", "Advertising", "Partnership", "Media Inquiry", "Other"];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <div className="bg-[#1a1a2e] py-14 text-center">
        <h1 className="text-4xl font-black text-white mb-3">Get In Touch</h1>
        <p className="text-gray-400 text-base max-w-xl mx-auto">
          Have a question, need support, or want to explore a partnership? Our team is here to help.
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-14 w-full flex-1">

        {/* Contact cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {CONTACT_CARDS.map(c => (
            <a key={c.title} href={c.href} target="_blank" rel="noreferrer"
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all flex flex-col gap-3 group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}>
                <c.icon size={18} />
              </div>
              <div>
                <p className="font-black text-gray-900 text-sm">{c.title}</p>
                <p className="font-bold text-gray-700 text-sm group-hover:text-[#FF6B00] transition-colors">{c.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Live Chat CTA */}
        <div className="bg-gradient-to-r from-[#FF6B00] to-orange-500 rounded-2xl p-5 mb-12 flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Headphones size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-black text-white text-base">Live Chat Available Now</p>
            <p className="text-orange-100 text-sm">Connect with a support agent instantly — average wait time: under 2 minutes.</p>
          </div>
          <button className="bg-white text-[#FF6B00] font-black px-5 py-2.5 rounded-xl text-sm hover:bg-orange-50 transition-colors flex-shrink-0">
            Start Chat →
          </button>
        </div>

        {/* Main layout: form + map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-black text-gray-900 mb-1">Send Us a Message</h2>
            <p className="text-gray-500 text-sm mb-6">Fill out the form and we'll get back to you within 24 hours.</p>
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                <h3 className="font-black text-gray-900 text-lg mb-1">Message Sent!</h3>
                <p className="text-gray-500 text-sm">Our team will get back to you shortly.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                  className="mt-4 text-[#FF6B00] text-sm font-bold hover:underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[["name", "Full Name", "text"], ["email", "Email Address", "email"], ["phone", "Phone Number", "tel"]].map(([key, label, type]) => (
                    <div key={key} className={key === "name" ? "sm:col-span-2" : ""}>
                      <label className="text-sm font-bold text-gray-700 mb-1 block">{label}</label>
                      <input required type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 block">Subject</label>
                  <select required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white">
                    <option value="">Select a subject...</option>
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 block">Message</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Write your message here..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none" />
                </div>
                <button type="submit" className="flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-md">
                  <Send size={15} /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Map */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-black text-gray-900 text-sm flex items-center gap-2"><MapPin size={14} className="text-[#FF6B00]" /> Kemedar Headquarters</h3>
                <p className="text-xs text-gray-500 mt-0.5">5th Settlement, New Cairo, Cairo, Egypt</p>
              </div>
              <div className="h-72 sm:h-96">
                <iframe
                  title="Kemedar Office Location"
                  width="100%" height="100%"
                  loading="lazy"
                  src="https://maps.google.com/maps?q=30.0444,31.4700&z=14&output=embed"
                  className="block border-0"
                />
              </div>
            </div>

            {/* Office hours */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h4 className="font-black text-gray-900 text-sm mb-3">Office Hours</h4>
              <div className="space-y-2">
                {[["Sunday – Thursday", "9:00 AM – 6:00 PM EET"], ["Friday", "10:00 AM – 2:00 PM EET"], ["Saturday", "Closed"]].map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-xs">
                    <span className="text-gray-500 font-medium">{day}</span>
                    <span className="text-gray-900 font-bold">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuperFooter />
    </div>
  );
}