import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const TYPE_COLORS = {
  property: '#FF6B00', project: '#0077B6', product: '#2D6A4F',
  store: '#7C3AED', service: '#C41230', agent_profile: '#1a1a2e',
};

export default function AdminQRDashboard() {
  const [qrCodes, setQrCodes] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.QRCode.list('-created_date', 200),
      base44.entities.QRScan.list('-scannedAt', 500),
    ]).then(([codes, scanData]) => {
      setQrCodes(codes);
      setScans(scanData);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const totalScans = qrCodes.reduce((s, q) => s + (q.totalScans || 0), 0);
  const activeQRs = qrCodes.filter(q => q.status === 'active').length;
  const scansToday = scans.filter(s => s.scannedAt?.slice(0, 10) === today).length;
  const usersWithQR = new Set(qrCodes.map(q => q.ownerUserId)).size;
  const bestQR = [...qrCodes].sort((a, b) => (b.totalScans || 0) - (a.totalScans || 0))[0];

  // Scans by day (last 30 days)
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(Date.now() - (29 - i) * 86400000);
    return d.toISOString().slice(0, 10);
  });
  const scansByDay = last30.map(date => ({
    date: date.slice(5),
    scans: scans.filter(s => s.scannedAt?.slice(0, 10) === date).length,
  }));

  // Scans by type
  const typeMap = {};
  qrCodes.forEach(q => { typeMap[q.targetType] = (typeMap[q.targetType] || 0) + (q.totalScans || 0); });
  const typeData = Object.entries(typeMap).map(([name, value]) => ({ name, value }));

  // Top QR codes
  const topQRs = [...qrCodes].sort((a, b) => (b.totalScans || 0) - (a.totalScans || 0)).slice(0, 5);

  const KPI = ({ icon, label, value, sub }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <p className="text-2xl mb-2">{icon}</p>
      <p className="text-3xl font-black text-gray-900">{value}</p>
      <p className="text-sm font-bold text-gray-700 mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );

  if (loading) return (
    <div className="p-6 space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-black text-gray-900">📱 QR Code Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KPI icon="📱" label="Total QR Codes" value={qrCodes.length} sub="all time" />
        <KPI icon="✅" label="Active QR Codes" value={activeQRs} />
        <KPI icon="📊" label="Total Scans" value={totalScans.toLocaleString()} sub="all time" />
        <KPI icon="📅" label="Scans Today" value={scansToday} />
        <KPI icon="👥" label="Users with QR" value={usersWithQR} />
        <KPI icon="🏆" label="Top QR this month" value={bestQR?.targetTitle?.slice(0, 20) || '—'} sub={`${bestQR?.totalScans || 0} scans`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="font-black text-gray-900 mb-4">QR Scans Over Time (30 Days)</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scansByDay}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} width={28} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} />
                <Line type="monotone" dataKey="scans" stroke="#FF6B00" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="font-black text-gray-900 mb-4">Scans by Target Type</p>
          {typeData.length > 0 ? (
            <div className="flex items-center gap-4">
              <div className="h-48 w-48 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={typeData} dataKey="value" innerRadius={50} outerRadius={80}>
                      {typeData.map((d, i) => <Cell key={i} fill={TYPE_COLORS[d.name] || '#94a3b8'} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {typeData.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: TYPE_COLORS[d.name] || '#94a3b8' }} />
                    <span className="text-xs text-gray-600 capitalize">{d.name.replace('_', ' ')}</span>
                    <span className="text-xs font-bold text-gray-900 ml-auto pl-3">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-gray-400 text-sm">No scan data yet.</p>}
        </div>
      </div>

      {/* Top QR Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="font-black text-gray-900">Top QR Codes</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500">#</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500">Target</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500">Type</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500">Scans</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500">Unique</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500">Last Scan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {topQRs.map((q, i) => (
              <tr key={q.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-black text-gray-400">#{i + 1}</td>
                <td className="px-4 py-3 font-bold text-gray-900 max-w-[200px] truncate">{q.targetTitle || '—'}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6B00] font-bold capitalize">{q.targetType?.replace('_', ' ')}</span></td>
                <td className="px-4 py-3 font-black text-gray-900">{q.totalScans || 0}</td>
                <td className="px-4 py-3 text-gray-600">{q.uniqueScans || 0}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{q.lastScannedAt ? new Date(q.lastScannedAt).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}