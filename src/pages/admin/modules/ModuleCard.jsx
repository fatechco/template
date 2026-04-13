import { useState } from 'react';
import { ChevronRight, Calendar, Users, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const MODULE_STYLES = {
  kemedar: { border: '#FF6B00', bg: '#FFF3E8', text: '#FF6B00', badge: 'bg-orange-100 text-orange-700', btn: 'bg-orange-500 hover:bg-orange-600' },
  kemework: { border: '#2D6A4F', bg: '#EDFAF1', text: '#2D6A4F', badge: 'bg-emerald-100 text-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-700' },
  kemetro: { border: '#0077B6', bg: '#EFF7FF', text: '#0077B6', badge: 'bg-blue-100 text-blue-700', btn: 'bg-blue-600 hover:bg-blue-700' },
};

export default function ModuleCard({ module, features, onToggle }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [comingSoonText, setComingSoonText] = useState(module.comingSoonText || '');
  const [toggling, setToggling] = useState(false);

  const style = MODULE_STYLES[module.moduleName] || MODULE_STYLES.kemedar;
  const moduleFeatures = features.filter(f => f.modules.includes(module.moduleName));
  const isActive = module.isGloballyActive;

  const handleToggle = async () => {
    if (isActive) {
      setShowConfirm(true);
    } else {
      setToggling(true);
      await onToggle(module.id, true, {});
      setToggling(false);
    }
  };

  const handleDisable = async () => {
    setToggling(true);
    await onToggle(module.id, false, { comingSoonText });
    setShowConfirm(false);
    setToggling(false);
  };

  const launchDateFormatted = module.launchDate
    ? new Date(module.launchDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  return (
    <>
      <div
        className="bg-white rounded-2xl border-t-[6px] shadow-sm overflow-hidden flex flex-col"
        style={{ borderTopColor: style.border }}
      >
        {/* Header */}
        <div className="p-6 flex-1">
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
              style={{ background: style.bg }}
            >
              {module.icon}
            </div>
            <span className={`text-xs font-black px-3 py-1.5 rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {isActive ? '✅ LIVE' : '⛔ HIDDEN'}
            </span>
          </div>

          <h2 className="text-xl font-black text-gray-900 mb-1">{module.displayName}</h2>
          <p className="text-xs text-gray-500 mb-1 font-medium">{module.description?.split('—')[0]?.trim()}</p>
          <p className="text-xs text-gray-400 leading-relaxed">{module.description?.split('—')[1]?.trim()}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mt-5">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-black text-gray-800">{moduleFeatures.length}</p>
              <p className="text-[10px] text-gray-500 font-medium">Total Features</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-black" style={{ color: style.text }}>
                {moduleFeatures.filter(f => f.isActive !== false).length}
              </p>
              <p className="text-[10px] text-gray-500 font-medium">Active Features</p>
            </div>
          </div>

          {/* Launch Date */}
          <div className="mt-4 flex items-center gap-1.5">
            <Calendar size={12} className={isActive ? 'text-green-500' : 'text-gray-400'} />
            <span className={`text-xs font-medium ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
              {isActive && launchDateFormatted ? `Live since ${launchDateFormatted}` : 'Not yet launched'}
            </span>
          </div>
        </div>

        {/* Toggle Section */}
        <div className="border-t border-gray-100 p-5">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Module Status</p>

          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-bold ${isActive ? 'text-green-700' : 'text-gray-500'}`}>
              {isActive ? 'Live for Users ✅' : 'Hidden from Users ⛔'}
            </span>
            <button
              onClick={handleToggle}
              disabled={toggling}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <a
            href={`/admin/modules/${module.moduleName}`}
            className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all"
            style={{ background: style.bg, color: style.text }}
          >
            📋 Manage Features
            <ChevronRight size={14} />
          </a>
        </div>
      </div>

      {/* Disable Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900">⚠️ Disable {module.displayName}?</h3>
                <p className="text-xs text-gray-500">This will hide all features immediately</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 bg-red-50 rounded-xl p-4 mb-4 border border-red-100">
              This will hide all {module.displayName} features from <strong>all users</strong> immediately. 
              They will see your "Coming Soon" message instead.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Message shown to users:
              </label>
              <textarea
                value={comingSoonText}
                onChange={e => setComingSoonText(e.target.value)}
                rows={3}
                placeholder="e.g. Kemedar launching soon! Stay tuned."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDisable}
                disabled={toggling}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-colors"
              >
                {toggling ? 'Disabling...' : '⛔ Disable Module'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}