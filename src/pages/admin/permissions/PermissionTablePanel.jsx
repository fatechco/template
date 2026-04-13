import { useState } from 'react';
import { Search, Zap } from 'lucide-react';
import {
  PERMISSION_LEVEL_DISPLAY,
  GUEST_BEHAVIOR_LABELS,
  MODULE_COLORS,
  RESOURCE_TYPE_COLORS,
  cyclePermissionLevel,
} from '@/lib/rbac/permissionUtils';

const MODULE_TABS = ['all', 'kemedar', 'kemework', 'kemetro', 'shared', 'admin'];
const TYPE_FILTERS = ['all', 'entity', 'page', 'form', 'feature', 'dashboard_section'];

const KEY_ACTIONS = ['view', 'create', 'edit', 'delete', 'submit', 'publish'];
const SPECIAL_ACTIONS = ['approve', 'reject', 'verify', 'feature', 'assign', 'accredit', 'export', 'import', 'bulk_action', 'bid', 'purchase', 'withdraw', 'manage', 'access_dashboard', 'upload_media', 'message', 'refund'];

function PermCell({ level, guestBehavior, onClick, isGuest, actionKey, availableActions }) {
  if (!availableActions?.includes(actionKey)) {
    return <td className="px-1 py-2 text-center"><span className="text-gray-200 text-xs">—</span></td>;
  }

  const disp = PERMISSION_LEVEL_DISPLAY[level] || PERMISSION_LEVEL_DISPLAY['deny'];

  return (
    <td className="px-1 py-2 text-center">
      <button
        onClick={onClick}
        title={`${disp.label}${guestBehavior ? ` (${GUEST_BEHAVIOR_LABELS[guestBehavior]?.label})` : ''}`}
        className={`w-8 h-6 rounded flex items-center justify-center text-sm mx-auto transition-all hover:scale-110 ${disp.color}`}
      >
        {disp.icon}
      </button>
    </td>
  );
}

function GuestBehaviorCell({ guestBehavior, onChange }) {
  if (!guestBehavior) return <td className="px-1 py-2"><span className="text-gray-300 text-xs">—</span></td>;
  const gb = GUEST_BEHAVIOR_LABELS[guestBehavior];
  return (
    <td className="px-2 py-2">
      <select
        value={guestBehavior}
        onChange={e => onChange(e.target.value)}
        className={`text-[10px] font-bold px-2 py-1 rounded-lg border-0 cursor-pointer ${gb?.color || 'bg-gray-100'}`}
      >
        {Object.entries(GUEST_BEHAVIOR_LABELS).map(([k, v]) => (
          <option key={k} value={k}>{v.icon} {v.label}</option>
        ))}
      </select>
    </td>
  );
}

export default function PermissionTablePanel({
  role, resources, actions, rolePermissions,
  activeModule, setActiveModule, activeType, setActiveType,
  search, setSearch, bulkMode, setBulkMode,
  onPermissionChange, isGuest,
}) {
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const getLevel = (resourceKey, actionKey) => {
    return rolePermissions[`${resourceKey}::${actionKey}`]?.permissionLevel || 'deny';
  };

  const getGuestBehavior = (resourceKey, actionKey) => {
    return rolePermissions[`${resourceKey}::${actionKey}`]?.guestBehavior || null;
  };

  const handleCellClick = (resourceKey, actionKey) => {
    const current = getLevel(resourceKey, actionKey);
    const next = cyclePermissionLevel(current, isGuest);
    onPermissionChange(resourceKey, actionKey, next, getGuestBehavior(resourceKey, actionKey));
  };

  const getRowColor = (resource) => {
    const perms = (resource.availableActions || []).map(ak => getLevel(resource.resourceKey, ak));
    if (perms.every(l => l === 'allow')) return 'bg-white';
    if (perms.every(l => l === 'deny')) return 'bg-red-50/40';
    if (perms.some(l => l !== 'deny')) return 'bg-yellow-50/40';
    return 'bg-white';
  };

  const toggleRow = (key) => setExpandedRow(expandedRow === key ? null : key);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
      {/* Role header */}
      <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{role?.icon || '👤'}</span>
            <div>
              <p className="font-black text-gray-900 text-sm">{role?.displayName || 'Select a role'}</p>
              <p className="text-xs text-gray-400">{role?.description || ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBulkMode(!bulkMode)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                bulkMode ? 'bg-orange-50 text-orange-600 border-orange-300' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Zap size={12} className="inline mr-1" />
              Bulk Edit
            </button>
          </div>
        </div>
      </div>

      {/* Module Tabs */}
      <div className="flex gap-1 px-4 pt-3 pb-2 flex-shrink-0 overflow-x-auto">
        {MODULE_TABS.map(m => (
          <button
            key={m}
            onClick={() => setActiveModule(m)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeModule === m
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-4 pb-3 flex-shrink-0 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-orange-400"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {TYPE_FILTERS.map(t => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
                activeType === t ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t === 'all' ? 'All Types' : t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      {bulkMode && selectedRows.length > 0 && (
        <div className="mx-4 mb-3 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 flex items-center gap-3 flex-shrink-0 flex-wrap">
          <span className="text-xs font-bold text-orange-700">{selectedRows.length} selected</span>
          {['allow', 'deny', 'allow_own_only'].map(level => {
            const d = PERMISSION_LEVEL_DISPLAY[level];
            return (
              <button
                key={level}
                className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                onClick={async () => {
                  for (const rk of selectedRows) {
                    const res = resources.find(r => r.resourceKey === rk);
                    for (const ak of (res?.availableActions || [])) {
                      await onPermissionChange(rk, ak, level, null);
                    }
                  }
                  setSelectedRows([]);
                }}
              >
                {d.icon} {d.label}
              </button>
            );
          })}
          <button
            className="text-[10px] text-gray-500 font-bold ml-auto"
            onClick={() => setSelectedRows([])}
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
            <tr>
              {bulkMode && <th className="px-3 py-2 w-8" />}
              <th className="px-3 py-2 text-left font-bold text-gray-700 min-w-[200px]">Resource</th>
              <th className="px-2 py-2 text-left font-bold text-gray-700 w-20">Module</th>
              <th className="px-2 py-2 text-left font-bold text-gray-700 w-20">Type</th>
              {KEY_ACTIONS.map(a => (
                <th key={a} className="px-1 py-2 text-center font-bold text-gray-600 w-10 capitalize">{a}</th>
              ))}
              <th className="px-2 py-2 text-center font-bold text-gray-600 w-16">Special</th>
              {isGuest && <th className="px-2 py-2 text-left font-bold text-gray-600 w-36">Guest Behavior</th>}
              <th className="px-2 py-2 text-center font-bold text-gray-600 w-10">⚙</th>
            </tr>
          </thead>
          <tbody>
            {resources.length === 0 ? (
              <tr>
                <td colSpan={20} className="px-4 py-12 text-center text-gray-400">
                  <p className="text-2xl mb-2">📋</p>
                  <p className="font-bold">No resources found</p>
                  <p className="text-xs mt-1">Seed data first or adjust filters</p>
                </td>
              </tr>
            ) : (
              resources.map(res => {
                const isExpanded = expandedRow === res.resourceKey;
                const rowBg = getRowColor(res);
                const mc = MODULE_COLORS[res.module] || MODULE_COLORS.shared;

                // Collect special actions with permissions
                const specialPerms = SPECIAL_ACTIONS.filter(ak => (res.availableActions || []).includes(ak));

                return (
                  <>
                    <tr
                      key={res.resourceKey}
                      className={`border-b border-gray-50 hover:bg-orange-50/20 ${rowBg} ${isExpanded ? 'border-b-0' : ''}`}
                    >
                      {bulkMode && (
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(res.resourceKey)}
                            onChange={e => {
                              setSelectedRows(prev =>
                                e.target.checked ? [...prev, res.resourceKey] : prev.filter(k => k !== res.resourceKey)
                              );
                            }}
                            className="accent-orange-500"
                          />
                        </td>
                      )}
                      <td className="px-3 py-2">
                        <p className="font-bold text-gray-800 text-xs">{res.displayName}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{res.resourceKey}</p>
                      </td>
                      <td className="px-2 py-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${mc.bg} ${mc.text}`}>
                          {res.module}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${RESOURCE_TYPE_COLORS[res.resourceType] || 'bg-gray-100 text-gray-600'}`}>
                          {res.resourceType?.replace('_', ' ')}
                        </span>
                      </td>
                      {KEY_ACTIONS.map(ak => (
                        <PermCell
                          key={ak}
                          level={getLevel(res.resourceKey, ak)}
                          guestBehavior={getGuestBehavior(res.resourceKey, ak)}
                          onClick={() => handleCellClick(res.resourceKey, ak)}
                          isGuest={isGuest}
                          actionKey={ak}
                          availableActions={res.availableActions}
                        />
                      ))}
                      <td className="px-2 py-2 text-center">
                        {specialPerms.length > 0 ? (
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold cursor-pointer hover:bg-gray-200" onClick={() => toggleRow(res.resourceKey)}>
                            +{specialPerms.length}
                          </span>
                        ) : (
                          <span className="text-gray-200">—</span>
                        )}
                      </td>
                      {isGuest && (
                        <GuestBehaviorCell
                          guestBehavior={
                            Object.keys(rolePermissions)
                              .filter(k => k.startsWith(res.resourceKey + '::'))
                              .map(k => rolePermissions[k]?.guestBehavior)
                              .find(Boolean) || null
                          }
                          onChange={(v) => {
                            const keys = Object.keys(rolePermissions).filter(k => k.startsWith(res.resourceKey + '::'));
                            keys.forEach(k => {
                              const [, ak] = k.split('::');
                              const level = rolePermissions[k]?.permissionLevel;
                              if (level === 'deny') onPermissionChange(res.resourceKey, ak, level, v);
                            });
                          }}
                        />
                      )}
                      <td className="px-2 py-2 text-center">
                        <button
                          onClick={() => toggleRow(res.resourceKey)}
                          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 mx-auto"
                        >
                          {isExpanded ? '▲' : '▼'}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded row: special actions + conditions */}
                    {isExpanded && (
                      <tr key={`${res.resourceKey}-expanded`} className="bg-gray-50">
                        <td colSpan={20} className="px-4 py-4 border-b border-gray-100">
                          <div className="grid grid-cols-2 gap-4">
                            {/* Special actions */}
                            <div>
                              <p className="font-bold text-gray-700 text-xs mb-2">Special Actions</p>
                              <div className="flex flex-wrap gap-2">
                                {specialPerms.map(ak => {
                                  const level = getLevel(res.resourceKey, ak);
                                  const d = PERMISSION_LEVEL_DISPLAY[level];
                                  return (
                                    <button
                                      key={ak}
                                      onClick={() => handleCellClick(res.resourceKey, ak)}
                                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all hover:scale-105 ${d.color}`}
                                    >
                                      {d.icon} {ak}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Conditions editor */}
                            <div>
                              <p className="font-bold text-gray-700 text-xs mb-2">Conditions</p>
                              <div className="space-y-1.5">
                                {[
                                  { key: 'ownResourceOnly', label: 'Own resources only' },
                                  { key: 'areaOnly', label: 'Area coverage only' },
                                  { key: 'requiresVerification', label: 'Requires verification' },
                                ].map(cond => {
                                  const firstPerm = Object.values(rolePermissions).find(p => p.resourceKey === res.resourceKey);
                                  const isChecked = firstPerm?.conditions?.[cond.key] || false;
                                  return (
                                    <label key={cond.key} className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => {}}
                                        className="accent-orange-500 w-3 h-3"
                                      />
                                      <span className="text-[10px] text-gray-600">{cond.label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-4 flex-shrink-0 flex-wrap">
        <p className="text-[10px] font-bold text-gray-500">Legend:</p>
        {Object.entries(PERMISSION_LEVEL_DISPLAY).map(([k, v]) => (
          <span key={k} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${v.color}`}>
            {v.icon} {v.label}
          </span>
        ))}
        <span className="text-[10px] text-gray-400 ml-auto">Click any cell to cycle permission</span>
      </div>
    </div>
  );
}