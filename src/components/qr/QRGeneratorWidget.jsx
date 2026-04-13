import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import QRCustomizer from './QRCustomizer';
import QRPreview from './QRPreview';
import QRSubscriptionGate from './QRSubscriptionGate';

const DEFAULT_SETTINGS = {
  foregroundColor: '#FF6B00',
  backgroundColor: '#FFFFFF',
  includeLogo: true,
  logoType: 'kemedar',
  customLogoUrl: null,
  includeFrame: true,
  frameStyle: 'branded',
  frameText: 'Scan to view on Kemedar',
  frameTextAr: 'امسح للعرض على كيمدار',
  qrStyle: 'square',
  errorCorrectionLevel: 'H',
};

export default function QRGeneratorWidget({ targetType, targetId, targetTitle, mode = 'compact' }) {
  const [open, setOpen] = useState(mode === 'full');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [qrCode, setQrCode] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [hasPaidPlan, setHasPaidPlan] = useState(null); // null = loading
  const [showGate, setShowGate] = useState(false);

  // Check subscription on mount
  useEffect(() => {
    base44.auth.me().then(user => {
      if (!user) { setHasPaidPlan(false); return; }
      // Check active subscription
      base44.entities.UserSubscription.filter({ status: 'active' })
        .then(subs => setHasPaidPlan(subs && subs.length > 0))
        .catch(() => setHasPaidPlan(false));
    }).catch(() => setHasPaidPlan(false));
  }, []);

  // Load existing QR for this target on open
  useEffect(() => {
    if (!open || !targetId) return;
    base44.functions.invoke('getUserQRCodes', { targetType })
      .then(res => {
        const existing = res.data?.qrCodes?.find(q => q.targetId === targetId && q.status === 'active');
        if (existing) {
          setQrCode(existing);
          setSettings({
            foregroundColor: existing.foregroundColor || DEFAULT_SETTINGS.foregroundColor,
            backgroundColor: existing.backgroundColor || DEFAULT_SETTINGS.backgroundColor,
            includeLogo: existing.includeLogo ?? true,
            logoType: existing.logoType || 'kemedar',
            customLogoUrl: existing.customLogoUrl || null,
            includeFrame: existing.includeFrame ?? true,
            frameStyle: existing.frameStyle || 'branded',
            frameText: existing.frameText || DEFAULT_SETTINGS.frameText,
            frameTextAr: existing.frameTextAr || DEFAULT_SETTINGS.frameTextAr,
            qrStyle: existing.qrStyle || 'square',
            errorCorrectionLevel: existing.errorCorrectionLevel || 'H',
          });
        }
      })
      .catch(() => {});
  }, [open, targetId]);

  const handleOpenClick = () => {
    if (hasPaidPlan === false) {
      setShowGate(true);
    } else {
      setOpen(true);
    }
  };

  const handleRegenerate = async () => {
    if (!targetType || !targetId) return;
    setGenerating(true);
    setError(null);
    try {
      if (qrCode?.id) {
        // Regenerate existing
        const res = await base44.functions.invoke('regenerateQRCode', {
          qrCodeId: qrCode.id,
          ...settings,
        });
        setQrCode(res.data?.qrCode);
      } else {
        // Generate new
        const res = await base44.functions.invoke('generateQRCode', {
          targetType,
          targetId,
          ...settings,
        });
        if (res.data?.error === 'subscription_required') {
          setShowGate(true);
          setOpen(false);
          return;
        }
        setQrCode(res.data?.qrCode);
      }
    } catch (e) {
      setError(e.message || 'Failed to generate QR code. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // COMPACT mode — just a button
  if (mode === 'compact' && !open) {
    return (
      <>
        {hasPaidPlan === false ? (
          <button
            onClick={() => setShowGate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-gray-300 text-gray-500 text-sm font-bold hover:border-gray-400 transition-all"
          >
            🔒 QR Code — Upgrade to Access
          </button>
        ) : (
          <button
            onClick={handleOpenClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-[#FF6B00] text-[#FF6B00] text-sm font-bold hover:bg-orange-50 transition-all"
          >
            📱 Generate QR Code
          </button>
        )}

        {showGate && <QRSubscriptionGate onClose={() => setShowGate(false)} />}
      </>
    );
  }

  // FULL PANEL (inline, not modal)
  if (mode === 'full') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <ModalBody
          targetTitle={targetTitle}
          settings={settings}
          setSettings={setSettings}
          qrCode={qrCode}
          generating={generating}
          error={error}
          onRegenerate={handleRegenerate}
          onClose={null}
          inline
        />
        {showGate && <QRSubscriptionGate onClose={() => setShowGate(false)} />}
      </div>
    );
  }

  // COMPACT mode with modal open
  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-[#FF6B00] text-[#FF6B00] text-sm font-bold hover:bg-orange-50 transition-all"
      >
        📱 Generate QR Code
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-[20px] max-w-[780px] w-full overflow-hidden shadow-2xl">
            <ModalBody
              targetTitle={targetTitle}
              settings={settings}
              setSettings={setSettings}
              qrCode={qrCode}
              generating={generating}
              error={error}
              onRegenerate={handleRegenerate}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}

      {showGate && <QRSubscriptionGate onClose={() => setShowGate(false)} />}
    </>
  );
}

function ModalBody({ targetTitle, settings, setSettings, qrCode, generating, error, onRegenerate, onClose, inline }) {
  return (
    <>
      {/* Header */}
      <div className="bg-[#FF6B00] px-6 py-5 flex items-start justify-between">
        <div>
          <p className="text-white font-bold text-lg">📱 QR Code Generator</p>
          <p className="text-white/90 text-[13px] mt-0.5">
            Create a scannable QR for {targetTitle || 'this listing'}
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl font-bold leading-none">
            ✕
          </button>
        )}
      </div>

      {/* Body: two columns */}
      <div className={`flex ${inline ? 'flex-col md:flex-row' : 'flex-col sm:flex-row'}`}>
        {/* Left: Customizer */}
        <div className={`${inline ? 'md:w-[55%]' : 'sm:w-[55%]'} border-r border-gray-100`}>
          <QRCustomizer
            settings={settings}
            onChange={setSettings}
            onRegenerate={onRegenerate}
            generating={generating}
          />
        </div>

        {/* Right: Preview */}
        <div className={`${inline ? 'md:w-[45%]' : 'sm:w-[45%]'}`}>
          <QRPreview
            qrCode={qrCode}
            generating={generating}
            error={error}
          />
        </div>
      </div>
    </>
  );
}