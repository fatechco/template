// @ts-nocheck
import { Bell } from 'lucide-react';
import { getNotificationManager } from '@/lib/notification-manager';

export default function NotificationPermissionSheet({ trigger, onClose }) {
  const manager = getNotificationManager();

  const handleEnable = async () => {
    const success = await manager.requestPermission();
    if (success) {
      manager.dismissPermissionRequest(trigger);
    }
    onClose();
  };

  const handleLater = () => {
    manager.dismissPermissionRequest(trigger);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl p-8 animate-in slide-in-from-bottom-4 duration-300">
        {/* Icon */}
        <div className="w-16 h-16 bg-[#FF6B00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Bell size={32} className="text-[#FF6B00]" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-[#1F2937] text-center mb-3">
          Stay Updated
        </h2>

        {/* Description */}
        <p className="text-sm text-[#6B7280] text-center mb-6 leading-relaxed">
          Get instant alerts for:
        </p>

        {/* Feature List */}
        <div className="space-y-3 mb-8">
          {[
            'New properties matching your search',
            'Messages from agents & sellers',
            'Price drops on saved properties',
            'Order & service updates',
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#FF6B00]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-[#FF6B00]">✓</span>
              </div>
              <span className="text-sm text-[#4B5563]">{feature}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <button
          onClick={handleEnable}
          className="w-full bg-[#FF6B00] text-white font-bold py-3.5 rounded-2xl mb-3 active:bg-[#E55A00] transition-colors"
        >
          Enable Notifications
        </button>

        <button
          onClick={handleLater}
          className="w-full text-[#6B7280] font-medium py-2.5 active:opacity-70"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}