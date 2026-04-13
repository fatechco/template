import { useState } from 'react';
import { Search, Plus, Edit2, X, Check } from 'lucide-react';

const TYPE_COLORS = {
  page: 'bg-purple-100 text-purple-700',
  menu_item: 'bg-blue-100 text-blue-700',
  entity: 'bg-green-100 text-green-700',
  api_endpoint: 'bg-yellow-100 text-yellow-700',
  widget: 'bg-pink-100 text-pink-700',
  nav_link: 'bg-indigo-100 text-indigo-700',
};

const MODULE_PILLS = {
  kemedar: 'bg-orange-100 text-orange-700 border border-orange-200',
  kemework: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  kemetro: 'bg-blue-100 text-blue-700 border border-blue-200',
};

const EMPTY_FEATURE = {
  featureKey: '', featureName: '', featureType: 'page', modules: [],
  location: 'page', route: '', description: '', isAdminOnly: false,
  requiresAuth: true, sortOrder: 0, isActive: true, notes: '',
};

export default function FeatureRegistryTable({ features, modules, onUpdate, onCreate, onRefresh }) {
  const [search, setSearch] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [editingFeature, setEditingFeature] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFeature, setNewFeature] = useState(EMPTY_FEATURE);
  const [saving, setSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const filtered = features.filter(f => {
    const matchSearch = !search || f.featureName.toLowerCase().includes(search.toLowerCase()) || f.featureKey.toLowerCase().includes(search.toLowerCase());
    const matchModule = filterModule === 'all'
      ? true
      : filterModule === 'multi'
        ? f.modules.length > 1
        : f.modules.includes(filterModule);
    const matchType = filterType === 'all' || f.featureType === filterType;
    const matchLoc = filterLocation === 'all' || f.location === filterLocation;
    return matchSearch && matchModule && matchType && matchLoc;
  });

  const handleSaveEdit = async () => {
    setSaving(true);
    await onUpdate(editingFeature.id, {
      featureName: editingFeature.featureName,
      featureType: editingFeature.featureType,
      modules: editingFeature.modules,
      location: editingFeature.location,
      route: editingFeature.route,
      description: editingFeature.description,
      isAdminOnly: editingFeature.isAdminOnly,
      requiresAuth: editingFeature.requiresAuth,
      sortOrder: editingFeature.sortOrder,
      isActive: editingFeature.isActive,
      notes: editingFeature.notes,
    });
    setSaving(false);
    setEditingFeature(null);
  };

  const handleCreate = async () => {
    if (!newFeature.featureKey || !newFeature.featureName) return;
    setSaving(true);
    await onCreate(newFeature);
    setSaving(false);
    setShowAddModal(false);
    setNewFeature(EMPTY_FEATURE);
  };

  const handleToggleActive = async (feature) => {
    await onUpdate(feature.id, { isActive: !feature.isActive });
  };

  const handleBulkActivate = async (active) => {
    for (const id of selectedIds) {
      await onUpdate(id, { isActive: active });
    }
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search features by name or key..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          {[
            { label: 'Module', value: filterModule, set: setFilterModule, options: [['all','All'], ['kemedar','🏠 Kemedar'], ['kemework','🔧 Kemework'], ['kemetro','🛒 Kemetro'], ['multi','Multi-Module']] },
            { label: 'Type', value: filterType, set: setFilterType, options: [['all','All Types'], ['page','Page'], ['menu_item','Menu'], ['widget','Widget'], ['nav_link','Nav Link'], ['entity','Entity'], ['api_endpoint','API']] },
            { label: 'Location', value: filterLocation, set: setFilterLocation, options: [['all','All Locations'], ['header_nav','Header Nav'], ['homepage','Homepage'], ['dashboard_menu','Dashboard'], ['mobile_bottom_nav','Mobile Nav'], ['page','Page']] },
          ].map(({ label, value, set, options }) => (
            <select
              key={label}
              value={value}
              onChange={e => set(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
            >
              {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          ))}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors ml-auto"
          >
            <Plus size={14} /> Add Feature
          </button>
        </div>

        {selectedIds.length > 0 && (
          <div className="mt-3 flex items-center gap-3 bg-orange-50 rounded-xl p-3">
            <span className="text-sm font-semibold text-orange-700">{selectedIds.length} selected</span>
            <button onClick={() => handleBulkActivate(true)} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold">Activate All</button>
            <button onClick={() => handleBulkActivate(false)} className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-xs font-bold">Deactivate All</button>
            <button onClick={() => setSelectedIds([])} className="ml-auto text-gray-400 hover:text-gray-700"><X size={14} /></button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-bold text-gray-700">{filtered.length} features</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="w-8 px-4 py-3"><input type="checkbox" onChange={e => setSelectedIds(e.target.checked ? filtered.map(f => f.id) : [])} className="rounded" /></th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Feature</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Modules</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Location</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Route</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase">Active</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(feature => (
                <tr key={feature.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(feature.id)}
                      onChange={e => setSelectedIds(prev => e.target.checked ? [...prev, feature.id] : prev.filter(id => id !== feature.id))}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-800 text-xs">{feature.featureName}</p>
                    <p className="text-gray-400 font-mono text-[10px] mt-0.5">{feature.featureKey}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${TYPE_COLORS[feature.featureType] || 'bg-gray-100 text-gray-600'}`}>
                      {feature.featureType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(feature.modules || []).map(m => (
                        <span key={m} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${MODULE_PILLS[m] || 'bg-gray-100 text-gray-500'}`}>
                          {m === 'kemedar' ? '🏠' : m === 'kemework' ? '🔧' : '🛒'} {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] text-gray-500">{feature.location || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] text-gray-400">{feature.route || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleActive(feature)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all ${feature.isActive !== false ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${feature.isActive !== false ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setEditingFeature({ ...feature })}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-700"
                    >
                      <Edit2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">No features match your filters</div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingFeature && (
        <FeatureModal
          feature={editingFeature}
          onChange={setEditingFeature}
          onSave={handleSaveEdit}
          onClose={() => setEditingFeature(null)}
          saving={saving}
          title="Edit Feature"
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <FeatureModal
          feature={newFeature}
          onChange={setNewFeature}
          onSave={handleCreate}
          onClose={() => { setShowAddModal(false); setNewFeature(EMPTY_FEATURE); }}
          saving={saving}
          title="Add New Feature"
          isNew
        />
      )}
    </div>
  );
}

function FeatureModal({ feature, onChange, onSave, onClose, saving, title, isNew }) {
  const toggleModule = (m) => {
    const mods = feature.modules || [];
    onChange(prev => ({
      ...prev,
      modules: mods.includes(m) ? mods.filter(x => x !== m) : [...mods, m]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-base font-black text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={16} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Feature Name" required>
              <input value={feature.featureName} onChange={e => onChange(p => ({ ...p, featureName: e.target.value }))} className="field-input" />
            </Field>
            <Field label="Feature Key (slug)" required>
              <input value={feature.featureKey} onChange={e => onChange(p => ({ ...p, featureKey: e.target.value }))} readOnly={!isNew} className={`field-input ${!isNew ? 'bg-gray-50 text-gray-400' : ''}`} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Feature Type">
              <select value={feature.featureType} onChange={e => onChange(p => ({ ...p, featureType: e.target.value }))} className="field-input">
                {['page', 'menu_item', 'entity', 'api_endpoint', 'widget', 'nav_link'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Location">
              <select value={feature.location} onChange={e => onChange(p => ({ ...p, location: e.target.value }))} className="field-input">
                {['page', 'header_nav', 'homepage', 'dashboard_menu', 'mobile_bottom_nav', 'mobile_drawer', 'admin', 'settings', 'footer'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Route / URL Path">
            <input value={feature.route || ''} onChange={e => onChange(p => ({ ...p, route: e.target.value }))} placeholder="/kemedar/example" className="field-input" />
          </Field>

          <Field label="Modules" required>
            <div className="flex flex-wrap gap-2 mt-1">
              {[['kemedar', '🏠 Kemedar', '#FF6B00'], ['kemework', '🔧 Kemework', '#2D6A4F'], ['kemetro', '🛒 Kemetro', '#0077B6']].map(([m, label, color]) => {
                const on = (feature.modules || []).includes(m);
                return (
                  <button key={m} type="button" onClick={() => toggleModule(m)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all"
                    style={on ? { borderColor: color, background: `${color}15`, color } : { borderColor: '#e5e7eb', background: '#f9fafb', color: '#9ca3af' }}>
                    {label} {on && <Check size={11} />}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Description">
            <textarea value={feature.description || ''} onChange={e => onChange(p => ({ ...p, description: e.target.value }))} rows={2} className="field-input resize-none" />
          </Field>

          <div className="flex gap-6">
            <Toggle label="Is Active" value={feature.isActive !== false} onChange={v => onChange(p => ({ ...p, isActive: v }))} />
            <Toggle label="Requires Auth" value={!!feature.requiresAuth} onChange={v => onChange(p => ({ ...p, requiresAuth: v }))} />
            <Toggle label="Admin Only" value={!!feature.isAdminOnly} onChange={v => onChange(p => ({ ...p, isAdminOnly: v }))} />
          </div>

          <Field label="Notes">
            <textarea value={feature.notes || ''} onChange={e => onChange(p => ({ ...p, notes: e.target.value }))} rows={2} className="field-input resize-none" placeholder="Admin notes..." />
          </Field>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3 rounded-b-2xl">
          <button onClick={onSave} disabled={saving} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-colors">
            {saving ? 'Saving...' : isNew ? '+ Add Feature' : '✓ Save Changes'}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => onChange(!value)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all ${value ? 'bg-green-500' : 'bg-gray-300'}`}>
        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
      <span className="text-xs text-gray-600 font-medium">{label}</span>
    </div>
  );
}