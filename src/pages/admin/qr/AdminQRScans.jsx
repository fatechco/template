import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export default function AdminQRScans() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    base44.entities.QRScan.list('-scannedAt', 100)
      .then(setScans).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">Live Scan Log</h1>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-500">Auto-refresh every 30s</span>
          <button onClick={load} className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg hover:bg-gray-50">Refresh</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Time','QR UID','Target Type','City','Device','OS','Redirected'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading scan log...</td></tr>
              ) : scans.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No scans yet.</td></tr>
              ) : scans.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-500">{s.scannedAt ? new Date(s.scannedAt).toLocaleString() : '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{s.qrCodeUID}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6B00] font-bold capitalize">{s.targetType?.replace('_',' ')}</span></td>
                  <td className="px-4 py-3 text-xs text-gray-600">{s.city || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 capitalize">{s.deviceType || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{s.operatingSystem || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-[200px] truncate">
                    <a href={s.redirectedTo} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{s.redirectedTo?.slice(0, 40)}...</a>
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