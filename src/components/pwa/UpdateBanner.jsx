import { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { getUpdateManager } from '@/lib/update-manager';

export default function UpdateBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const manager = getUpdateManager();

  useEffect(() => {
    const handleUpdateAvailable = () => {
      setShowBanner(true);
    };

    window.addEventListener('pwa-update-available', handleUpdateAvailable);
    return () => window.removeEventListener('pwa-update-available', handleUpdateAvailable);
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    await manager.activateUpdate();
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-500 text-white px-4 py-3 flex items-center gap-3 animate-in slide-in-from-top duration-300">
      <RefreshCw size={20} className={isUpdating ? 'animate-spin' : ''} />
      
      <span className="flex-1 font-bold text-sm">
        {isUpdating ? 'Installing update...' : 'Update available!'}
      </span>

      {!isUpdating && (
        <>
          <button
            onClick={handleUpdate}
            className="bg-white text-blue-500 font-bold text-xs px-3 py-1.5 rounded active:opacity-80 transition-opacity"
          >
            Update Now
          </button>
          <button
            onClick={() => setShowBanner(false)}
            className="p-1 active:opacity-70"
          >
            <X size={18} />
          </button>
        </>
      )}
    </div>
  );
}