import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ChevronRight, Share2, X, Send, Bot } from 'lucide-react';

const ROLE_DASHBOARDS_MOBILE = [
  { emoji: '👤', label: 'Common User',     sub: 'Mobile CP',               path: '/m/cp/user',          bg: 'bg-gray-100',    text: 'text-gray-700' },
  { emoji: '🤝', label: 'Agent',           sub: 'Agent Mobile',            path: '/m/kemedar/agent/dashboard',   bg: 'bg-orange-100',  text: 'text-orange-700' },
  { emoji: '🏢', label: 'Agency',          sub: 'Agency Mobile',           path: '/m/kemedar/agency/dashboard',  bg: 'bg-blue-100',    text: 'text-blue-700' },
  { emoji: '🏗️', label: 'Developer',       sub: 'Developer Mobile',        path: '/m/kemedar/developer/dashboard', bg: 'bg-slate-100', text: 'text-slate-700' },
  { emoji: '🔧', label: 'Professional',    sub: 'Pro Mobile',              path: '/m/dashboard/pro-dashboard',  bg: 'bg-teal-100',    text: 'text-teal-700' },
  { emoji: '🏭', label: 'Company',         sub: 'Company Mobile',          path: '/m/dashboard/company-dashboard', bg: 'bg-pink-100', text: 'text-pink-700' },
  { emoji: '🗺️', label: 'Franchise Owner', sub: 'Franchise Mobile',        path: '/m/kemedar/franchise/dashboard', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  { emoji: '🏪', label: 'Seller',          sub: 'Seller Mobile',           path: '/m/dashboard/seller-dashboard', bg: 'bg-green-100',  text: 'text-green-700' },
  { emoji: '🚚', label: 'Shipper',         sub: 'Shipper Mobile',          path: '/m/dashboard/kemetro-buyer',   bg: 'bg-indigo-100',  text: 'text-indigo-700' },
];

const ROLE_DASHBOARDS = [
  { emoji: '👤', label: 'Common User',     sub: 'Buyer / Shopper',          path: '/cp/user',            bg: 'bg-gray-100',    text: 'text-gray-700' },
  { emoji: '🤝', label: 'Agent',           sub: 'Real Estate Agent',        path: '/cp/agent',           bg: 'bg-orange-100',  text: 'text-orange-700' },
  { emoji: '🏢', label: 'Agency',          sub: 'Real Estate Agency',       path: '/cp/agency',          bg: 'bg-blue-100',    text: 'text-blue-700' },
  { emoji: '🏗️', label: 'Developer',       sub: 'Property Developer',       path: '/cp/developer',       bg: 'bg-slate-100',   text: 'text-slate-700' },
  { emoji: '🔧', label: 'Professional',    sub: 'Handyman / Freelancer',    path: '/cp/pro',             bg: 'bg-teal-100',    text: 'text-teal-700' },
  { emoji: '🏭', label: 'Company',         sub: 'Finishing Company',        path: '/cp/company',         bg: 'bg-pink-100',    text: 'text-pink-700' },
  { emoji: '🗺️', label: 'Franchise Owner', sub: 'Area Franchise Partner',   path: '/kemedar/franchise/dashboard', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  { emoji: '🏪', label: 'Seller',          sub: 'Kemetro Product Seller',   path: '/kemetro/seller',     bg: 'bg-green-100',   text: 'text-green-700' },
  { emoji: '🚚', label: 'Shipper',         sub: 'Delivery / Logistics',     path: '/kemetro/shipper/dashboard', bg: 'bg-indigo-100', text: 'text-indigo-700' },
];

const FIND_ITEMS = [
  { emoji: '🏠', label: 'Property', path: '/m/find/property', bg: 'from-orange-500 to-orange-600' },
  { emoji: '🛋️', label: 'Product', path: '/m/find/product', bg: 'from-blue-600 to-blue-700' },
  { emoji: '🔧', label: 'Service', path: '/m/find/service', bg: 'from-teal-500 to-teal-600' },
  { emoji: '🏗️', label: 'Project', path: '/m/find/project', bg: 'from-slate-700 to-slate-900' },
  { emoji: '👤', label: 'Agent', path: '/m/find/agent', bg: 'from-purple-500 to-purple-700' },
  { emoji: '👷', label: 'Professional', path: '/m/find/professional', bg: 'from-green-500 to-green-700' },
];

const ADD_ITEMS = [
  { emoji: '🏠', label: 'Property', path: '/m/add/property', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
  { emoji: '📋', label: 'Task', path: '/m/add/task', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700' },
  { emoji: '🔍', label: 'Buy/Rent Request', path: '/m/add/buy-request', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  { emoji: '📦', label: 'Product', path: '/m/add/product', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  { emoji: '⚙️', label: 'Service', path: '/m/add/service', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
  { emoji: '🏗️', label: 'Project', path: '/m/add/project', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' },
];

const USER_BENEFITS = [
  { emoji: '🏠', label: 'Property Owner', sub: 'Sell or rent your property', path: '/m/benefits/property-seller', color: 'bg-orange-100' },
  { emoji: '🔍', label: 'Property Buyer', sub: 'Find your perfect home', path: '/m/benefits/property-buyer', color: 'bg-blue-100' },
  { emoji: '🤝', label: 'Real Estate Agent', sub: 'Grow your client base', path: '/m/benefits/real-estate-agent', color: 'bg-teal-100' },
  { emoji: '🏗️', label: 'Developer', sub: 'Showcase your projects', path: '/m/benefits/real-estate-developer', color: 'bg-slate-100' },
  { emoji: '💰', label: 'Investor', sub: 'Invest in global real estate', path: '/m/benefits/investor', color: 'bg-green-100' },
  { emoji: '🗺️', label: 'Franchise Owner', sub: 'Own your territory', path: '/m/benefits/franchise-owner-area', color: 'bg-yellow-100' },
  { emoji: '🏪', label: 'Product Seller', sub: 'Sell home & building products', path: '/m/benefits/product-seller', color: 'bg-pink-100' },
  { emoji: '🛒', label: 'Product Buyer', sub: 'Shop all home products', path: '/m/benefits/product-buyer', color: 'bg-indigo-100' },
  { emoji: '🔧', label: 'Professional/Handyman', sub: 'Offer services & earn', path: '/m/benefits/handyman-or-technician', color: 'bg-red-100' },
];

function SectionLabel({ title }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="h-4 w-1 bg-orange-500 rounded-full" />
      <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{title}</p>
    </div>
  );
}

function MenuRow({ emoji, title, subtitle, badge, onClick, iconBg = 'bg-gray-100' }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left border-b border-gray-50 last:border-0"
    >
      <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center text-xl flex-shrink-0`}>
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-gray-900">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {badge && (
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex-shrink-0">{badge}</span>
      )}
      <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
    </button>
  );
}

function KemedarChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! 👋 I\'m Kemedar AI. How can I help you today? Ask me about properties, services, or anything about our platform!' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      { from: 'user', text: input },
      { from: 'bot', text: 'Thanks for your message! Please sign in or create an account to get full AI assistance. 🚀' }
    ]);
    setInput('');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #FF6B00, #e55a00)' }}
      >
        <Bot size={26} className="text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col" style={{ maxHeight: '60vh' }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: 'linear-gradient(135deg, #FF6B00, #e55a00)' }}>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-black text-white text-sm">Kemedar AI</p>
              <p className="text-orange-200 text-[11px]">● Online now</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white p-1">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                  msg.from === 'user'
                    ? 'bg-orange-500 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t border-gray-100 bg-white">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask anything..."
              className="flex-1 text-sm bg-gray-100 rounded-full px-4 py-2 outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #FF6B00, #e55a00)' }}
            >
              <Send size={15} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function AccountGuest() {
  const navigate = useNavigate();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Kemedar®', text: 'Discover the Proptech Super App', url: 'https://kemedar.com' });
    } else {
      navigator.clipboard?.writeText('https://kemedar.com');
      alert('Link copied!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <KemedarChatBot />

      {/* ─── Hero ─── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #0e2454 100%)' }}>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Glowing orbs */}
        <div className="absolute top-6 right-8 w-32 h-32 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #FF6B00, transparent)' }} />
        <div className="absolute bottom-0 left-4 w-24 h-24 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }} />

        <div className="relative z-10 px-5 pt-10 pb-12 text-center">
          {/* Logo */}
          <img src="https://media.base44.com/images/public/69c6065775877f52af7313ef/a00191aa3_Colored_square_Kemedar_logo_png.png" alt="Kemedar" className="w-16 h-16 rounded-2xl mx-auto mb-4 object-cover" />

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-3">
            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
            <span className="text-orange-300 text-[10px] font-bold tracking-widest uppercase">Proptech Super App</span>
          </div>

          <h1 className="text-3xl font-black text-white mb-1">Kemedar®</h1>
          <p className="text-gray-400 text-sm mb-6">Find. Buy. Sell. Invest. Build. Work.</p>

          {/* Ecosystem badges */}
          <div className="flex justify-center gap-2 mb-8">
            {[
              { label: 'Kemedar', emoji: '🏠', color: 'bg-orange-500/20 border-orange-500/40 text-orange-300', path: '/m/home' },
              { label: 'Kemetro', emoji: '🛒', color: 'bg-blue-500/20 border-blue-500/40 text-blue-300', path: '/m/kemetro' },
              { label: 'Kemework', emoji: '🔧', color: 'bg-teal-500/20 border-teal-500/40 text-teal-300', path: '/m/kemework' },
            ].map(b => (
              <button key={b.label} onClick={() => navigate(b.path)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-bold ${b.color}`}>
                {b.emoji} {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl" />
      </div>

      <div className="px-4 pt-4 space-y-6">

        {/* ─── Stats Row ─── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: '2M+', label: 'Properties', emoji: '🏠' },
            { value: '500K+', label: 'Users', emoji: '👥' },
            { value: '30+', label: 'Countries', emoji: '🌍' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
              <div className="text-xl mb-1">{s.emoji}</div>
              <p className="text-lg font-black text-gray-900">{s.value}</p>
              <p className="text-[11px] text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ─── User Benefits ─── */}
        <div>
          <SectionLabel title="User Benefits" />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {USER_BENEFITS.map((item, i) => (
              <MenuRow key={i} emoji={item.emoji} title={item.label} subtitle={item.sub}
                iconBg={item.color} onClick={() => navigate(item.path)} />
            ))}
          </div>
        </div>

        {/* ─── Knowledge Base ─── */}
        <div>
          <SectionLabel title="Knowledge Base" />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {[
              { emoji: '📖', title: 'Help Center & FAQ', sub: 'Answers to common questions', path: '/m/dashboard/knowledge', bg: 'bg-blue-100' },
              { emoji: '🎓', title: 'Guides & Tutorials', sub: 'How to use Kemedar', path: '/m/dashboard/knowledge', bg: 'bg-purple-100' },
              { emoji: '📝', title: 'Real Estate Glossary', sub: 'Property terms explained', path: '/m/dashboard/knowledge', bg: 'bg-teal-100' },
              { emoji: '💡', title: 'Tips & Best Practices', sub: 'Get the most out of the app', path: '/m/dashboard/knowledge', bg: 'bg-yellow-100' },
            ].map((item, i) => (
              <MenuRow key={i} emoji={item.emoji} title={item.title} subtitle={item.sub}
                iconBg={item.bg} onClick={() => navigate(item.path)} />
            ))}
          </div>
        </div>

        {/* ─── Contact Us ─── */}
        <div>
          <SectionLabel title="Contact Us" />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {[
              { emoji: '📞', title: 'Call Us', sub: '+1 (800) KEMEDAR', path: 'tel:+18005363327', bg: 'bg-green-100' },
              { emoji: '💬', title: 'Live Chat', sub: 'Chat with our team now', path: '/contact', bg: 'bg-blue-100', badge: 'Online' },
              { emoji: '🟢', title: 'WhatsApp', sub: 'Quick response guaranteed', path: 'https://wa.me/1234567890', bg: 'bg-green-100' },
              { emoji: '📧', title: 'Email Us', sub: 'info@kemedar.com', path: 'mailto:info@kemedar.com', bg: 'bg-orange-100' },
              { emoji: '🎫', title: 'Support Ticket', sub: 'Submit a support request', path: '/contact', bg: 'bg-purple-100' },
            ].map((item, i) => (
              <MenuRow key={i} emoji={item.emoji} title={item.title} subtitle={item.sub}
                badge={item.badge} iconBg={item.bg}
                onClick={() => item.path?.startsWith('http') || item.path?.startsWith('tel') || item.path?.startsWith('mailto')
                  ? window.open(item.path) : navigate(item.path)} />
            ))}
          </div>
        </div>

        {/* ─── Share App ─── */}
        <div>
          <SectionLabel title="Share App" />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button onClick={handleShare}
              className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Share2 size={18} className="text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-gray-900">Share Kemedar App</p>
                <p className="text-xs text-gray-500">Invite friends & earn rewards</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
            <div className="px-4 py-3 border-t border-gray-50 flex gap-3">
              {[
                { emoji: '📱', label: 'App Store', color: 'bg-black text-white' },
                { emoji: '🤖', label: 'Google Play', color: 'bg-green-600 text-white' },
                { emoji: '📋', label: 'Copy Link', color: 'bg-gray-100 text-gray-800' },
              ].map((s, i) => (
                <button key={i} onClick={handleShare}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold ${s.color}`}>
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── About Kemedar ─── */}
        <div>
          <SectionLabel title="About Kemedar" />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {[
              { emoji: '🏛️', title: 'Our Story & Mission', sub: 'Building the future of real estate', path: '/about', bg: 'bg-orange-100' },
              { emoji: '🌍', title: 'Global Presence', sub: '30+ countries, 200+ cities', path: '/about', bg: 'bg-blue-100' },
              { emoji: '🏆', title: 'Why Choose Kemedar?', sub: 'What makes us different', path: '/about', bg: 'bg-yellow-100' },
              { emoji: '🤝', title: 'Partner with Us', sub: 'Franchise & partnership opportunities', path: '/user-benefits/franchise-owner-area', bg: 'bg-purple-100' },
              { emoji: '💼', title: 'Careers', sub: 'Join the Kemedar team', path: '/careers', bg: 'bg-teal-100' },
              { emoji: '📰', title: 'Press & Media', sub: 'News and press releases', path: '/about', bg: 'bg-slate-100' },
            ].map((item, i) => (
              <MenuRow key={i} emoji={item.emoji} title={item.title} subtitle={item.sub}
                iconBg={item.bg} onClick={() => navigate(item.path)} />
            ))}
          </div>
        </div>

        {/* ─── Legal & Settings ─── */}
        <div>
          <SectionLabel title="Legal" />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {[
              { title: 'Terms & Conditions', path: '/terms' },
              { title: 'Privacy Policy', path: '/privacy' },
              { title: 'Cookie Policy', path: '/cookies' },
            ].map((item, i) => (
              <button key={i} onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0">
                <p className="text-sm font-semibold text-gray-700">{item.title}</p>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            ))}
          </div>
        </div>

        {/* ─── Footer ─── */}
        <div className="text-center py-6">
          <img src="https://media.base44.com/images/public/69c6065775877f52af7313ef/a00191aa3_Colored_square_Kemedar_logo_png.png" alt="Kemedar" className="w-12 h-12 rounded-2xl mx-auto mb-3 object-cover" />
          <p className="text-sm font-black text-gray-700">Kemedar®</p>
          <p className="text-xs text-gray-400 mt-1">Version 1.0.0 · © 2025 Kemedar®</p>
          <p className="text-xs text-gray-400">All rights reserved</p>
        </div>

      </div>
    </div>
  );
}