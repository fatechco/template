import { useMemo } from 'react';
import { Download, RotateCcw, Copy, Lock, Unlock } from 'lucide-react';
import { SYSTEM_ROLES } from '@/lib/rbac/seedData';

export default function PermissionSummaryPanel({
  role, roles, permissions, selectedRoleKey,
  recentChanges, onBulkAllow, onBulkDeny, onReset,
}) {
  const rolePerms = useMemo(() =>
    permissions.filter(p => p.roleKey === selectedRoleKey),
    [permissions, selectedRoleKey]
  );

  const stats = useMemo(() => {
    const total = rolePerms.length;
    const allowed = rolePerms.filter(p => p.permissionLevel === 'allow').length;
    const denied = rolePerms.filter(p => p.permissionLevel === 'deny').length;
    const restricted = rolePerms.filter(p => ['allow_own_only', 'allow_area_only', 'guest_preview'].includes(p.permissionLevel)).length;
    return { total, allowed, denied, restricted };
  }, [rolePerms]);

  const parentRole = useMemo(() => {
    const sysRole = SYSTEM_ROLES.find(r => r.roleKey === selectedRoleKey);
    const parentKey = sysRole?.parentRoleKey;
    if (!parentKey) return null;
    return roles.find(r => r.roleKey === parentKey) || SYSTEM_ROLES.find(r => r.roleKey === parentKey);
  }, [roles, selectedRoleKey]);

  const handleExport = () => {
    const data = rolePerms.map(p => ({
      resource: p.resourceKey,
      action: p.actionKey,
      level: p.permissionLevel,
      guestBehavior: p.guestBehavior,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `permissions_${selectedRoleKey}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pct = (n) => stats.total > 0 ? Math.round((n / stats.total) * 100) : 0;

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto">
      {/* Summary Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">{role?.icon || '👤'}</span>
          <div>
            <p className="font-black text-gray-900 text-sm">{role?.displayName || '—'}</p>
            <p className="text-[10px] text-gray-400">{stats.total} permissions defined</p>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2 mb-3">
          {[
            { label: 'Allowed', value: stats.allowed, color: 'bg-green-500', textColor: 'text-green-700' },
            { label: 'Denied', value: stats.denied, color: 'bg-red-400', textColor: 'text-red-700' },
            { label: 'Restricted', value: stats.restricted, color: 'bg-orange-400', textColor: 'text-orange-700' },
          ].map(s => (
            <div key={s.label}>
              <div className="flex justify-between items-center mb-0.5">
                <span className={`text-[10px] font-bold ${s.textColor}`}>{s.label}</span>
                <span className={`text-[10px] font-bold ${s.textColor}`}>{s.value} ({pct(s.value)}%)</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${s.color} transition-all`} style={{ width: `${pct(s.value)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <p className="font-black text-gray-700 text-xs mb-3">Quick Actions</p>
        <div className="space-y-2">
          <button
            onClick={onBulkAllow}
            className="w-full flex items-center gap-2 text-xs font-bold px-3 py-2 border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
          >
            <Unlock size={12} /> Allow All (Filtered)
          </button>
          <button
            onClick={onBulkDeny}
            className="w-full flex items-center gap-2 text-xs font-bold px-3 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Lock size={12} /> Deny All (Filtered)
          </button>
          <button
            className="w-full flex items-center gap-2 text-xs font-bold px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Copy size={12} /> Clone From Role
          </button>
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-2 text-xs font-bold px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={12} /> Export as JSON
          </button>
          <button
            onClick={onReset}
            className="w-full flex items-center gap-2 text-xs font-bold px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={12} /> Refresh
          </button>
        </div>
      </div>

      {/* Inheritance Card */}
      {parentRole && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <p className="font-black text-gray-700 text-xs mb-2">Inherits From</p>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border"
            style={{ borderColor: parentRole.color + '40', backgroundColor: parentRole.color + '10' }}
          >
            <span>{parentRole.icon}</span>
            <span style={{ color: parentRole.color }}>{parentRole.displayName}</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">
            All permissions not explicitly set here are inherited from the parent role.
          </p>
        </div>
      )}

      {/* Recent Changes */}
      {recentChanges.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <p className="font-black text-gray-700 text-xs mb-3">Recent Changes</p>
          <div className="space-y-2">
            {recentChanges.map((change, i) => (
              <div key={i} className="text-[10px] border-b border-gray-50 pb-1.5 last:border-0">
                <p className="font-bold text-gray-700 truncate">{change.resourceKey}</p>
                <p className="text-gray-400">
                  <span className="font-bold">{change.actionKey}</span>: {change.oldValue} → <span className="font-bold text-orange-600">{change.newValue}</span>
                </p>
                <p className="text-gray-300">{change.timestamp.toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}