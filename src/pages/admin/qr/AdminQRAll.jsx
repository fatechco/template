import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const STATUS_STYLES = { active: 'bg-green-100 text-green-700', paused: 'bg-yellow-100 text-yellow-700', archived: 'bg-gray-100 text-gray-500', expired: 'bg-red-100 text-red-600' };

export default function AdminQRAll() {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = () => {
    setLoading(true);
    base44.entities.QRCode.list('-created_date', 200)
      .then(setQrCodes).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDeactivate = async (qr) => {
    await base44.entities.QRCode.update(qr.id, { status: 'paused' });
    setQrCodes(prev => prev.map(q => q.id === qr.id ? { ...q, status: 'paused' } : q));
  };
  const handleDelete = async (qr) => {
    if (!confirm(`Archive QR for "${qr.targetTitle}"?`)) return;
    await base44.entities.QRCode.update(qr.id, { status: 'archived', deletedAt: new Date().toISOString() });
    setQrCodes(prev => prev.filter(q => q.id !== qr.id));
  };

  const filtered = qrCodes.filter(q =>
    (!typeFilter || q.targetType === typeFilter) &&
    (!statusFilter || q.status === statusFilter)
  );

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-black text-gray-900">All QR Codes</h1>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Types</option>
          {['property','project','product','store','service','agent_profile'].map(t => (
            <option key={t} value={t}>{t.replace('_', ' ')}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="archived">Archived</option>
        </select>
        <span className="text-sm text-gray-500 self-center ml-auto">{filtered.length} results</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['UID','Owner','Type','Target','Scans','Status','Created','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : filtered.map(qr => (
                <tr key={qr.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{qr.qrCodeUID}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-[100px] truncate">{qr.ownerUserId?.slice(0,8)}...</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6B00] font-bold capitalize">{qr.targetType?.replace('_',' ')}</span></td>
                  <td className="px-4 py-3 font-bold text-gray-900 max-w-[180px] truncate">{qr.targetTitle || '—'}</td>
                  <td className="px-4 py-3 font-black text-gray-900">{qr.totalScans || 0}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[qr.status] || 'bg-gray-100'}`}>{qr.status}</span></td>
                  <td className="px-4 py-3 text-xs text-gray-400">{qr.created_date ? new Date(qr.created_date).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <a href={qr.trackingUrl} target="_blank" rel="noreferrer" className="px-2 py-1 text-xs font-bold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">View</a>
                      {qr.status === 'active' && (
                        <button onClick={() => handleDeactivate(qr)} className="px-2 py-1 text-xs font-bold bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100">Pause</button>
                      )}
                      <button onClick={() => handleDelete(qr)} className="px-2 py-1 text-xs font-bold bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}