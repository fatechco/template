"use client";
// @ts-nocheck
import { useModules } from '@/lib/module-context';

const MODULE_ICONS = {
  kemedar: { emoji: '🏠', color: '#FF6B00', bg: '#FFF3E8' },
  kemework: { emoji: '🔧', color: '#2D6A4F', bg: '#EDFAF1' },
  kemetro: { emoji: '🛒', color: '#0077B6', bg: '#EFF7FF' },
};

export default function UserModuleSettings() {
  const { moduleConfigs, activeGlobalModules, userActiveModules, toggleUserModule } = useModules();

  const sorted = [...moduleConfigs].sort((a, b) => a.order - b.order);

  return (
    <div>
      {/* Section Header */}
      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1 mb-3">
        Modules
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {sorted.map((mod, idx) => {
          const meta = MODULE_ICONS[mod.moduleName] || MODULE_ICONS.kemedar;
          const isGloballyActive = activeGlobalModules.includes(mod.moduleName);
          const isUserActive = userActiveModules.includes(mod.moduleName);
          const isLast = idx === sorted.length - 1;

          return (
            <div key={mod.moduleName}>
              <div className="flex items-center gap-3 px-4 py-4">
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: meta.bg }}
                >
                  {mod.icon || meta.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900">{mod.displayName}</p>
                    {!isGloballyActive && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {mod.description?.split('—')[0]?.trim() || mod.displayName}
                  </p>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => isGloballyActive && toggleUserModule(mod.moduleName)}
                  disabled={!isGloballyActive}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${
                    isGloballyActive && isUserActive
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  } ${!isGloballyActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  style={isGloballyActive && isUserActive ? { background: meta.color } : {}}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                      isGloballyActive && isUserActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {!isLast && <div className="mx-4 border-t border-gray-50" />}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 italic mt-3 px-1">
        Turn off modules you don't use to simplify your navigation
      </p>
    </div>
  );
}