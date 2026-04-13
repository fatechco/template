import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { RotateCcw, Download } from 'lucide-react';
import { PERMISSION_LEVEL_DISPLAY } from '@/lib/rbac/permissionUtils';

export default function PermissionAuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('');
  const [filterResource, setFilterResource] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    setLoading(true);
    try {
      const data = await base44.entities.PermissionAuditLog.list('-created_date', 100);
      setLogs(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  const filtered = logs.filter(l => {
    if (filterRole && l.roleKey !== filterRole) return false;
    if (filterResource && !l.resourceKey?.includes(filterResource)) return false;
    return true;
  });

  const uniqueRoles = [...new Set(logs.map(l => l.roleKey))].filter(Boolean);

  const handleExport = () => {
    const csv = [
      'Timestamp,Admin,Role,Resource,Action,Old Value,New Value',
      ...filtered.map(l => `"${l.created_date}","${l.changedByEmail}","${l.roleKey}","${l.resourceKey}","${l.actionKey}","${l.oldValue}","${l.newValue}"`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'permission_audit_log.csv';
    a.click();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Permission Audit Log</h1>
          <p className="text-xs text-gray-500 mt-0.5">Every permission change recorded here</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadLogs} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <RotateCcw size={12} /> Refresh
          </button>
          <button onClick={handleExport} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <Download size={12} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 flex gap-3 flex-wrap shadow-sm">
        <select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-400"
        >
          <option value="">All Roles</option>
          {uniqueRoles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <input
          type="text"
          placeholder="Filter by resource..."
          value={filterResource}
          onChange={e => setFilterResource(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-orange-400 w-48"
        />
        <span className="text-xs text-gray-400 self-center">{filtered.length} entries</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Timestamp</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Admin</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Role</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Resource</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Action</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Old Value</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">New Value</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Reason</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    <p className="text-2xl mb-2">📋</p>
                    <p className="font-bold">No audit logs yet</p>
                    <p className="text-xs mt-1">Changes will be recorded here automatically</p>
                  </td>
                </tr>
              ) : (
                filtered.map((log, i) => {
                  const oldDisp = PERMISSION_LEVEL_DISPLAY[log.oldValue];
                  const newDisp = PERMISSION_LEVEL_DISPLAY[log.newValue];
                  return (
                    <tr key={log.id || i} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {log.created_date ? new Date(log.created_date).toLocaleString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{log.changedByEmail || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded-full">{log.roleKey}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-600 text-[10px]">{log.resourceKey}</td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full capitalize">{log.actionKey}</span>
                      </td>
                      <td className="px-4 py-3">
                        {oldDisp ? (
                          <span className={`font-bold px-2 py-0.5 rounded-full ${oldDisp.color}`}>{oldDisp.icon} {oldDisp.label}</span>
                        ) : <span className="text-gray-400">{log.oldValue || '—'}</span>}
                      </td>
                      <td className="px-4 py-3">
                        {newDisp ? (
                          <span className={`font-bold px-2 py-0.5 rounded-full ${newDisp.color}`}>{newDisp.icon} {newDisp.label}</span>
                        ) : <span className="text-gray-400">{log.newValue || '—'}</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{log.reason || '—'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}