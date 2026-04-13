import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import ModuleCard from './ModuleCard';
import FeatureRegistryTable from './FeatureRegistryTable';
import { Layers, RefreshCw } from 'lucide-react';

export default function AdminModuleControl() {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('modules');

  const load = async () => {
    setLoading(true);
    const [mods, feats] = await Promise.all([
      base44.entities.ModuleConfig.list('order', 10),
      base44.entities.FeatureRegistry.list('sortOrder', 200),
    ]);
    setModules(mods || []);
    setFeatures(feats || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleModuleToggle = async (moduleId, newActive, extra = {}) => {
    const updateData = {
      isGloballyActive: newActive,
      ...extra,
    };
    if (newActive) {
      updateData.launchDate = new Date().toISOString().split('T')[0];
      updateData.launchedBy = user?.email;
    }
    await base44.entities.ModuleConfig.update(moduleId, updateData);
    await load();
  };

  const handleFeatureUpdate = async (featureId, data) => {
    await base44.entities.FeatureRegistry.update(featureId, data);
    await load();
  };

  const handleFeatureCreate = async (data) => {
    await base44.entities.FeatureRegistry.create(data);
    await load();
  };

  const TABS = [
    { id: 'modules', label: '⚙️ Module Toggles' },
    { id: 'features', label: '📋 Feature Registry' },
    { id: 'preview', label: '👁 Module Preview' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers size={20} className="text-orange-500" />
            <h1 className="text-2xl font-black text-gray-900">Module Control Center</h1>
          </div>
          <p className="text-gray-500 text-sm">
            Control which modules are live for users. Disabling a module hides it from all users instantly.
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {activeTab === 'modules' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {modules.sort((a, b) => a.order - b.order).map(mod => (
                <ModuleCard
                  key={mod.id}
                  module={mod}
                  features={features}
                  onToggle={handleModuleToggle}
                />
              ))}
            </div>
          )}

          {activeTab === 'features' && (
            <FeatureRegistryTable
              features={features}
              modules={modules}
              onUpdate={handleFeatureUpdate}
              onCreate={handleFeatureCreate}
              onRefresh={load}
            />
          )}

          {activeTab === 'preview' && (
            <ModulePreview modules={modules} features={features} />
          )}
        </>
      )}
    </div>
  );
}

function ModulePreview({ modules, features }) {
  const [selected, setSelected] = useState(
    modules.filter(m => m.isGloballyActive).map(m => m.moduleName)
  );

  const visibleCount = features.filter(f =>
    f.modules.some(m => selected.includes(m)) && f.isActive !== false
  ).length;
  const hiddenCount = features.length - visibleCount;

  const MODULE_COLORS = {
    kemedar: { bg: '#FFF3E8', border: '#FF6B00', text: '#FF6B00' },
    kemework: { bg: '#EDFAF1', border: '#2D6A4F', text: '#2D6A4F' },
    kemetro: { bg: '#EFF7FF', border: '#0077B6', text: '#0077B6' },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Preview User Experience</h2>
        <p className="text-sm text-gray-500 mb-6">See how the site looks with different module combinations</p>

        <div className="flex flex-wrap gap-3 mb-6">
          {modules.map(mod => {
            const colors = MODULE_COLORS[mod.moduleName] || {};
            const isOn = selected.includes(mod.moduleName);
            return (
              <button
                key={mod.moduleName}
                onClick={() => setSelected(prev =>
                  prev.includes(mod.moduleName)
                    ? prev.filter(m => m !== mod.moduleName)
                    : [...prev, mod.moduleName]
                )}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all"
                style={isOn ? {
                  background: colors.bg, borderColor: colors.border, color: colors.text
                } : {
                  background: '#f9fafb', borderColor: '#e5e7eb', color: '#9ca3af'
                }}
              >
                {mod.icon} {mod.displayName}
                <span className={`w-2 h-2 rounded-full ${isOn ? 'bg-green-500' : 'bg-gray-300'}`} />
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-green-600">{visibleCount}</p>
            <p className="text-sm text-green-700 font-semibold mt-1">✅ Visible Features</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-red-600">{hiddenCount}</p>
            <p className="text-sm text-red-700 font-semibold mt-1">⛔ Hidden Features</p>
          </div>
        </div>

        <a
          href={`/?preview_modules=${selected.join(',')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors"
        >
          👁 Preview Site with These Modules
        </a>
      </div>
    </div>
  );
}