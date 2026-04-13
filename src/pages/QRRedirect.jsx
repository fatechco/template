import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function QRRedirect() {
  const { qrCodeUID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!qrCodeUID) { navigate('/qr/not-found'); return; }
    base44.functions.invoke('handleQRScan', { qrCodeUID })
      .then(res => {
        const url = res.data?.redirectUrl;
        if (url) {
          window.location.href = url;
        } else {
          navigate('/qr/not-found');
        }
      })
      .catch(() => navigate('/qr/not-found'));
  }, [qrCodeUID]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background: '#0A1628' }}>
      <img src="https://kemedar.com/logo-white.png" alt="Kemedar"
        onError={e => { e.target.style.display = 'none'; }}
        className="w-[120px] mb-6" />
      <div className="text-white font-bold text-xl mb-2" style={{ letterSpacing: '0.01em' }}>Kemedar®</div>
      <p className="text-white/70 text-sm mb-5">🔄 Opening listing...</p>
      <div className="w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}