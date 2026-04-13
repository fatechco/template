import { useNavigate } from 'react-router-dom';

export default function QRSubscriptionGate({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-[20px] max-w-[420px] w-full p-8 text-center shadow-2xl">
        <div className="text-5xl mb-4">📱</div>
        <h2 className="text-[22px] font-black text-gray-900 mb-3">QR Code Generator</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Generate professional QR codes for all your listings and profiles.
          Track every scan with detailed analytics.
        </p>

        <div className="text-left space-y-2 mb-8">
          {[
            'QR codes for all listings & profiles',
            'Custom colors and logo',
            'PNG, SVG, and PDF download',
            'Print-ready business card & flyer',
            'Scan analytics and tracking',
            'WhatsApp and email sharing',
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-500 flex-shrink-0">✅</span>
              {f}
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/buy')}
          className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-base transition-colors mb-3"
        >
          🚀 Upgrade to Access QR Codes
        </button>
        <button
          onClick={onClose}
          className="text-gray-400 text-sm hover:text-gray-600 transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}