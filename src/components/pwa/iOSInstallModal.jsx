import { useState } from 'react';
import { Check, Share2, Plus } from 'lucide-react';
import { getPWAInstallManager } from '@/lib/pwa-install-manager';

const STEPS = [
  {
    icon: Share2,
    title: 'Tap the Share button',
    description: 'Look for the Share icon at the bottom of Safari (looks like a box with an arrow)',
  },
  {
    icon: Plus,
    title: 'Select "Add to Home Screen"',
    description: 'Scroll down in the share menu and tap "Add to Home Screen"',
  },
  {
    icon: Check,
    title: 'Tap "Add" to confirm',
    description: 'Kemedar will appear on your home screen like a native app! 🎉',
  },
];

export default function IOSInstallModal({ onClose }) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const manager = getPWAInstallManager();

  const handleGotIt = () => {
    if (dontShowAgain) {
      manager.openIOSInstructions();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl p-6 pb-8 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-[#1F2937] mb-2">
            Install Kemedar on iPhone
          </h2>
          <p className="text-sm text-[#6B7280]">
            Follow these simple steps to add our app to your home screen
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex gap-4">
                {/* Step number */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF6B00]/10 flex items-center justify-center">
                  <span className="text-sm font-black text-[#FF6B00]">{index + 1}</span>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <p className="text-sm font-bold text-[#1F2937] mb-1">
                    {step.title}
                  </p>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
                    <Icon size={16} className="text-[#FF6B00]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Result */}
        <div className="bg-[#FFF7ED] border border-[#FDBA74] rounded-2xl p-4 mb-6">
          <p className="text-sm text-[#92400E] leading-relaxed">
            <strong>That's it!</strong> Kemedar will appear on your home screen and open just like a native app with offline support, notifications, and more.
          </p>
        </div>

        {/* Buttons */}
        <button
          onClick={handleGotIt}
          className="w-full bg-[#FF6B00] text-white font-bold py-3.5 rounded-2xl mb-3 active:bg-[#E55A00] transition-colors text-sm"
        >
          Got It
        </button>

        {/* Checkbox */}
        <label className="flex items-center gap-2 px-4 cursor-pointer">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="w-4 h-4 rounded accent-[#FF6B00]"
          />
          <span className="text-xs text-[#6B7280]">Don't show again</span>
        </label>
      </div>
    </div>
  );
}