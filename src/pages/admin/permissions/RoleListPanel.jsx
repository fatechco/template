import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { SYSTEM_ROLES } from '@/lib/rbac/seedData';

const MODULE_GROUPS = [
  { key: 'shared', label: 'SHARED', color: 'text-gray-500' },
  { key: 'kemedar', label: 'KEMEDAR', color: 'text-orange-500' },
  { key: 'kemework', label: 'KEMEWORK', color: 'text-teal-600' },
  { key: 'kemetro', label: 'KEMETRO', color: 'text-blue-600' },
  { key: 'admin', label: 'ADMIN', color: 'text-red-500' },
];

export default function RoleListPanel({ roles, selectedRoleKey, onSelect, permissions }) {
  // Count permissions per role
  const permCountMap = {};
  for (const p of permissions) {
    permCountMap[p.roleKey] = (permCountMap[p.roleKey] || 0) + 1;
  }

  const getRolesForModule = (module) => {
    const dbRoles = roles.filter(r => r.module === module);
    if (dbRoles.length > 0) return dbRoles;
    return SYSTEM_ROLES.filter(r => r.module === module);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <p className="font-black text-gray-900 text-sm">User Roles</p>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {MODULE_GROUPS.map(group => {
          const groupRoles = getRolesForModule(group.key);
          if (groupRoles.length === 0) return null;
          return (
            <div key={group.key} className="mb-1">
              <div className="px-3 py-1.5">
                <p className={`text-[9px] font-black uppercase tracking-wider ${group.color}`}>{group.label}</p>
              </div>
              {groupRoles.map(role => {
                const isSelected = role.roleKey === selectedRoleKey;
                const count = permCountMap[role.roleKey] || 0;
                return (
                  <button
                    key={role.roleKey}
                    onClick={() => onSelect(role.roleKey)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-all ${
                      isSelected
                        ? 'bg-orange-50 border-l-2 border-orange-500'
                        : 'hover:bg-gray-50 border-l-2 border-transparent'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: role.color || '#9CA3AF' }}
                    />
                    <span className="text-sm mr-0.5">{role.icon || '👤'}</span>
                    <span className={`text-xs flex-1 truncate ${isSelected ? 'font-bold text-orange-700' : 'text-gray-700'}`}>
                      {role.displayName}
                    </span>
                    {count > 0 && (
                      <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="px-3 py-3 border-t border-gray-100 flex-shrink-0">
        <button className="w-full flex items-center justify-center gap-2 text-xs text-orange-500 font-bold py-2 border border-dashed border-orange-300 rounded-lg hover:bg-orange-50 transition-colors">
          <PlusCircle size={13} /> Add Custom Role
        </button>
      </div>
    </div>
  );
}