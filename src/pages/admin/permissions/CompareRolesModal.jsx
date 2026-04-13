import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { PERMISSION_LEVEL_DISPLAY } from '@/lib/rbac/permissionUtils';
import { SYSTEM_ROLES } from '@/lib/rbac/seedData';

export default function CompareRolesModal({ roles, resources, actions, permissions, onClose }) {
  const allRoles = roles.length > 0 ? roles : SYSTEM_ROLES;
  const [roleKeys, setRoleKeys] = useState(['guest', 'common_user', 'agent']);

  const permMap = useMemo(() => {
    const map = {};
    for (const p of permissions) {
      const key = `${p.roleKey}::${p.resourceKey}::${p.actionKey}`;
      map[key] = p;
    }
    return map;
  }, [permissions]);

  const getLevel = (roleKey, resourceKey, actionKey) => {
    return permMap[`${roleKey}::${resourceKey}::${actionKey}`]?.permissionLevel || 'deny';
  };

  // Find resources with differences
  const resourcesWithDiffs = useMemo(() => {
    return resources.filter(res => {
      const levels = roleKeys.map(rk =>
        (res.availableActions || []).map(ak => getLevel(rk, res.resourceKey, ak)).join(',')
      );
      return new Set(levels).size > 1; // has differences
    });
  }, [resources, roleKeys, permMap]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="font-black text-gray-900 text-base">⚖️ Compare Roles</p>
            <p className="text-xs text-gray-400">Side-by-side permission comparison — differences highlighted</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        {/* Role selectors */}
        <div className="flex gap-4 px-6 py-4 border-b border-gray-100">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex-1">
              <label className="text-xs font-bold text-gray-500 mb-1 block">Role {i + 1}</label>
              <select
                value={roleKeys[i]}
                onChange={e => {
                  const next = [...roleKeys];
                  next[i] = e.target.value;
                  setRoleKeys(next);
                }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
              >
                {allRoles.map(r => (
                  <option key={r.roleKey} value={r.roleKey}>{r.icon} {r.displayName}</option>
                ))}
              </select>
            </div>
          ))}
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input type="checkbox" className="accent-orange-500" defaultChecked />
              Diffs only
            </label>
          </div>
        </div>

        {/* Comparison table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700 min-w-[200px]">Resource / Action</th>
                {roleKeys.map(rk => {
                  const role = allRoles.find(r => r.roleKey === rk);
                  return (
                    <th key={rk} className="px-4 py-3 text-center font-bold text-gray-700 min-w-[140px]">
                      <span className="text-base mr-1">{role?.icon}</span>
                      {role?.displayName || rk}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {resourcesWithDiffs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                    <p className="text-2xl mb-2">✅</p>
                    <p className="font-bold">No differences found</p>
                    <p className="text-xs mt-1">All selected roles have identical permissions for loaded resources</p>
                  </td>
                </tr>
              ) : (
                resourcesWithDiffs.map(res => (
                  <>
                    <tr key={res.resourceKey} className="bg-gray-50 border-b border-gray-100">
                      <td className="px-4 py-2 font-black text-gray-800" colSpan={4}>{res.displayName}</td>
                    </tr>
                    {(res.availableActions || []).map(ak => {
                      const levels = roleKeys.map(rk => getLevel(rk, res.resourceKey, ak));
                      const hasDiff = new Set(levels).size > 1;
                      return (
                        <tr key={`${res.resourceKey}-${ak}`} className={`border-b border-gray-50 ${hasDiff ? 'bg-yellow-50' : ''}`}>
                          <td className="px-6 py-2 text-gray-600 capitalize">{ak}</td>
                          {levels.map((level, i) => {
                            const d = PERMISSION_LEVEL_DISPLAY[level];
                            return (
                              <td key={i} className="px-4 py-2 text-center">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${d.color}`}>
                                  {d.icon} {d.label}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            <span className="inline-block w-3 h-3 bg-yellow-200 rounded mr-1 align-middle" />
            Yellow rows indicate differences between roles
          </p>
          <button onClick={onClose} className="text-xs font-bold text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}