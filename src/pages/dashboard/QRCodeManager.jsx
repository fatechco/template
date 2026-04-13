import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import QRAnalyticsPanel from '@/components/qr/QRAnalyticsPanel';
import QRTargetSelector from '@/components/qr/QRTargetSelector';
import QRGeneratorWidget from '@/components/qr/QRGeneratorWidget';

const TYPE_FILTERS = ['All', 'property', 'project', 'product', 'store', 'service', 'agent_profile'];
const TYPE_LABELS = {
  property: '🏠 Property', project: '🏗 Project', product: '📦 Product',
  store: '🏪 Store', service: '🔧 Service', agent_profile: '👤 Profile',
  professional_profile: '🔧 Profile', developer_profile: '👷 Developer',
  franchise_profile: '🗺 Franchise', agency_profile: '🏢 Agency',
};
const STATUS_STYLES = {
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  archived: 'bg-gray-100 text-gray-500',
  expired: 'bg-red-100 text-red-600',
};

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function QRCodeManager() {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('');
  const [sort, setSort] = useState('totalScans');
  const [analyticsQR, setAnalyticsQR] = useState(null);
  const [editQR, setEditQR] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [summary, setSummary] = useState({ totalQRCodes: 0, totalActiveQRs: 0, totalScansAllTime: 0 });

  const load = () => {
    setLoading(true);
    base44.functions.invoke('getUserQRCodes', { page: 1, limit: 100 })
      .then(res => {
        setQrCodes(res.data?.qrCodes || []);
        setSummary(res.data?.summary || {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCopy = (qr) => {
    navigator.clipboard.writeText(qr.trackingUrl || '');
    setCopiedId(qr.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStatus = async (qr) => {
    const newStatus = qr.status === 'active' ? 'paused' : 'active';
    await base44.entities.QRCode.update(qr.id, { status: newStatus });
    setQrCodes(prev => prev.map(q => q.id === qr.id ? { ...q, status: newStatus } : q));
  };

  const handleDelete = async (qr) => {
    await base44.entities.QRCode.update(qr.id, { status: 'archived', deletedAt: new Date().toISOString() });
    setQrCodes(prev => prev.filter(q => q.id !== qr.id));
    setDeleteConfirm(null);
  };

  const handleDownload = async (qr, format) => {
    const res = await base44.functions.invoke('downloadQRCode', { qrCodeId: qr.id, format });
    if (res.data?.downloadUrl) {
      const a = document.createElement('a');
      a.href = res.data.downloadUrl;
      a.download = res.data.filename || `qr.${format}`;
      a.target = '_blank';
      a.click();
    }
  };

  // Filter + sort
  let filtered = qrCodes.filter(q => {
    if (typeFilter !== 'All' && q.targetType !== typeFilter) return false;
    if (statusFilter && q.status !== statusFilter) return false;
    return true;
  });
  if (sort === 'totalScans') filtered = [...filtered].sort((a, b) => (b.totalScans || 0) - (a.totalScans || 0));
  else if (sort === 'newest') filtered = [...filtered].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  else if (sort === 'lastScanned') filtered = [...filtered].sort((a, b) => new Date(b.lastScannedAt || 0) - new Date(a.lastScannedAt || 0));

  // KPI data
  const bestPerformer = [...qrCodes].sort((a, b) => (b.totalScans || 0) - (a.totalScans || 0))[0];
  const totalUnique = qrCodes.reduce((s, q) => s + (q.uniqueScans || 0), 0);

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">📱 My QR Codes</h1>
          <p className="text-gray-500 text-sm mt-1">Generate and track QR codes for all your listings and profiles.</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
          + Create New QR Code
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-2xl mb-2">📱</p>
          <p className="text-3xl font-black text-gray-900">{summary.totalQRCodes || 0}</p>
          <p className="text-sm font-bold text-gray-700 mt-1">Total QR Codes</p>
          <p className="text-xs text-gray-400 mt-0.5">{summary.totalActiveQRs || 0} active</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-2xl mb-2">📊</p>
          <p className="text-3xl font-black text-gray-900">{summary.totalScansAllTime || 0}</p>
          <p className="text-sm font-bold text-gray-700 mt-1">Total Scans</p>
          <p className="text-xs text-gray-400 mt-0.5">all time</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-2xl mb-2">👁️</p>
          <p className="text-3xl font-black text-gray-900">{totalUnique}</p>
          <p className="text-sm font-bold text-gray-700 mt-1">Unique Scanners</p>
          <p className="text-xs text-gray-400 mt-0.5">distinct devices</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-2xl mb-2">🏆</p>
          <p className="text-lg font-black text-gray-900 line-clamp-1">{bestPerformer?.targetTitle || '—'}</p>
          <p className="text-sm font-bold text-gray-700 mt-1">Best Performer</p>
          <p className="text-xs text-gray-400 mt-0.5">{bestPerformer?.totalScans || 0} scans</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Type filter */}
        <div className="flex gap-1 flex-wrap">
          {TYPE_FILTERS.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${typeFilter === t ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
              {t === 'All' ? 'All' : TYPE_LABELS[t] || t}
            </button>
          ))}
        </div>

        <div className="flex gap-2 ml-auto items-center flex-wrap">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="archived">Archived</option>
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none">
            <option value="totalScans">Most Scans</option>
            <option value="newest">Newest</option>
            <option value="lastScanned">Last Scanned</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <p className="text-5xl mb-4">📱</p>
          <p className="text-xl font-black text-gray-900 mb-2">No QR Codes Yet</p>
          <p className="text-gray-500 text-sm mb-6">Generate QR codes for your listings to track scans and analytics.</p>
          <button onClick={() => setShowCreate(true)}
            className="bg-[#FF6B00] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
            + Create Your First QR Code
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-600 text-xs">QR</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600 text-xs">Target</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600 text-xs">Created</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600 text-xs">Scans</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600 text-xs">Unique</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600 text-xs">Last Scan</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600 text-xs">Status</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600 text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(qr => (
                  <tr key={qr.id} className="hover:bg-gray-50 transition-colors">
                    {/* QR Thumb */}
                    <td className="px-4 py-3">
                      {qr.qrImagePngUrl
                        ? <img src={qr.qrImagePngUrl} alt="QR" className="w-10 h-10 rounded-lg border border-gray-100" />
                        : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">QR</div>}
                    </td>
                    {/* Target */}
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6B00] mb-1 inline-block">
                        {TYPE_LABELS[qr.targetType] || qr.targetType}
                      </span>
                      <p className="font-bold text-gray-900 text-xs line-clamp-1 max-w-[160px]">{qr.targetTitle || '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{qr.created_date ? new Date(qr.created_date).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3 font-black text-gray-900">{qr.totalScans || 0}</td>
                    <td className="px-4 py-3 text-gray-600">{qr.uniqueScans || 0}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{timeAgo(qr.lastScannedAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[qr.status] || 'bg-gray-100 text-gray-500'}`}>
                        {qr.status}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        <button title="Analytics" onClick={() => setAnalyticsQR(qr)}
                          className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition-colors">
                          👁️
                        </button>
                        <button title="Edit" onClick={() => setEditQR(qr)}
                          className="px-2 py-1 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 text-xs font-bold transition-colors">
                          ✏️
                        </button>
                        <div className="relative group">
                          <button className="px-2 py-1 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 text-xs font-bold transition-colors">📥</button>
                          <div className="absolute left-0 top-7 bg-white border border-gray-100 rounded-xl shadow-lg z-10 hidden group-hover:block min-w-[120px]">
                            {['png','svg','pdf'].map(f => (
                              <button key={f} onClick={() => handleDownload(qr, f)}
                                className="block w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-[#FF6B00] capitalize">
                                {f.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button title="Copy URL" onClick={() => handleCopy(qr)}
                          className="px-2 py-1 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 text-xs font-bold transition-colors">
                          {copiedId === qr.id ? '✓' : '📋'}
                        </button>
                        <button title={qr.status === 'active' ? 'Pause' : 'Resume'} onClick={() => handleToggleStatus(qr)}
                          className="px-2 py-1 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 text-xs font-bold transition-colors">
                          {qr.status === 'active' ? '⏸' : '▶'}
                        </button>
                        <button title="Delete" onClick={() => setDeleteConfirm(qr)}
                          className="px-2 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-xs font-bold transition-colors">
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Panel */}
      {analyticsQR && <QRAnalyticsPanel qrCode={analyticsQR} onClose={() => setAnalyticsQR(null)} />}

      {/* Edit Modal */}
      {editQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-[20px] max-w-[780px] w-full overflow-hidden shadow-2xl">
            <QRGeneratorWidget
              targetType={editQR.targetType}
              targetId={editQR.targetId}
              targetTitle={editQR.targetTitle}
              mode="full"
            />
            <div className="px-6 pb-5">
              <button onClick={() => { setEditQR(null); load(); }}
                className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New */}
      {showCreate && <QRTargetSelector onClose={() => { setShowCreate(false); load(); }} />}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <p className="text-4xl mb-3">🗑️</p>
            <p className="font-black text-gray-900 text-lg mb-2">Archive this QR Code?</p>
            <p className="text-gray-500 text-sm mb-6">This will archive the QR code for <strong>{deleteConfirm.targetTitle}</strong>. Scanning it will no longer work.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors">
                Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}