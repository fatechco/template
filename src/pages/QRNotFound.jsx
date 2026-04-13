import { Link } from 'react-router-dom';

export default function QRNotFound() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-6" style={{ background: '#0A1628' }}>
      <span className="text-6xl mb-6">📱</span>
      <h1 className="text-white font-bold text-2xl mb-3 text-center">QR Code Not Found</h1>
      <p className="text-white/50 text-sm text-center mb-8 max-w-xs">
        This QR code may have expired or been deactivated.
      </p>
      <Link to="/"
        className="flex items-center gap-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl text-sm transition-colors"
        style={{ minHeight: 48 }}>
        🏠 Go to Kemedar →
      </Link>
    </div>
  );
}