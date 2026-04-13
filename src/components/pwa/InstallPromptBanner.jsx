import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { getPWAInstallManager } from '@/lib/pwa-install-manager';

export default function InstallPromptBanner() {
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);
  const manager = getPWAInstallManager();

  useEffect(() => {
    const checkShowBanner = () => {
      if (manager.shouldShowBanner()) {
        setVisible(true);
      }
    };

    // Check after a short delay to ensure state is ready
    const timer = setTimeout(checkShowBanner, 500);
    return () => clearTimeout(timer);
  }, [manager]);

  const handleInstall = async () => {
    setInstalling(true);
    const success = await manager.triggerInstall();
    if (success) {
      setVisible(false);
      // Toast notification could be shown here
    }
    setInstalling(false);
  };

  const handleDismiss = () => {
    manager.dismissBanner();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-md mx-auto px-4 pb-4">
        <div className="bg-white rounded-t-3xl rounded-b-lg shadow-2xl p-4 flex items-center gap-4" style={{ minHeight: 90 }}>
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 bg-[#FF6B00] rounded-2xl flex items-center justify-center text-white text-xl font-black">
            K
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#1F2937] leading-tight">
              Install Kemedar App
            </p>
            <p className="text-xs text-[#6B7280] mt-0.5 leading-tight">
              Add to home screen for the best experience
            </p>
          </div>

          {/* Buttons */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <button
              onClick={handleDismiss}
              className="text-xs text-[#6B7280] font-medium px-2 py-1.5 active:opacity-70"
            >
              Not Now
            </button>
            <button
              onClick={handleInstall}
              disabled={installing}
              className="text-xs font-bold text-white bg-[#FF6B00] rounded-lg px-3 py-1.5 flex items-center gap-1 active:bg-[#E55A00] transition-colors disabled:opacity-50"
            >
              <Download size={14} />
              Install
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 text-[#9CA3AF] hover:text-[#6B7280]"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}