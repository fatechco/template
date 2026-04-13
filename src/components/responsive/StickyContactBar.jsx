import { Phone, MessageCircle, Mail } from 'lucide-react';

export default function StickyContactBar({ phone, whatsapp, onMessage }) {
  return (
    <div
      className="fixed bottom-20 left-0 right-0 bg-[#FF6B00] flex items-center justify-around gap-2 px-4 py-3 z-40 md:hidden"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <button
        onClick={() => window.location.href = `tel:${phone}`}
        className="flex-1 flex items-center justify-center gap-2 bg-white/20 text-white rounded-lg py-2.5 active:bg-white/30 transition-colors"
      >
        <Phone size={18} strokeWidth={2.5} />
        <span className="text-xs font-bold">Call</span>
      </button>

      <button
        onClick={() => window.location.href = `https://wa.me/${whatsapp}`}
        className="flex-1 flex items-center justify-center gap-2 bg-white/20 text-white rounded-lg py-2.5 active:bg-white/30 transition-colors"
      >
        <MessageCircle size={18} strokeWidth={2.5} />
        <span className="text-xs font-bold">WhatsApp</span>
      </button>

      <button
        onClick={onMessage}
        className="flex-1 flex items-center justify-center gap-2 bg-white/20 text-white rounded-lg py-2.5 active:bg-white/30 transition-colors"
      >
        <Mail size={18} strokeWidth={2.5} />
        <span className="text-xs font-bold">Message</span>
      </button>
    </div>
  );
}