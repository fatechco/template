import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid,
} from 'recharts';

const RANGE_OPTIONS = [
  { label: '7 Days', days: 7 },
  { label: '30 Days', days: 30 },
  { label: 'All Time', days: null },
];

const DEVICE_COLORS = { mobile: '#FF6B00', desktop: '#1a1a2e', tablet: '#94a3b8' };

function timeAgo(dateStr) {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function QRAnalyticsPanel({ qrCode, onClose }) {
  const [range, setRange] = useState(1); // index into RANGE_OPTIONS
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!qrCode?.id) return;
    setLoading(true);
    const opt = RANGE_OPTIONS[range];
    const dateFrom = opt.days
      ? new Date(Date.now() - opt.days * 86400000).toISOString()
      : undefined;

    base44.functions.invoke('getQRAnalytics', { qrCodeId: qrCode.id, dateFrom })
      .then(res => setAnalytics(res.data?.analytics))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [qrCode?.id, range]);

  const deviceData = analytics?.scansByDevice?.map(d => ({
    name: d.device,
    value: d.count,
    fill: DEVICE_COLORS[d.device] || '#e2e8f0',
  })) || [];

  const topCities = analytics?.scansByCity?.slice(0, 5) || [];
  const maxCity = topCities[0]?.count || 1;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-[480px] h-full bg-white shadow-2xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between z-10">
          <div>
            <p className="font-black text-gray-900 text-xl">📊 QR Analytics</p>
            <p className="text-gray-400 text-sm mt-0.5 line-clamp-1">{qrCode?.targetTitle || 'QR Code'}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none mt-1">×</button>
        </div>

        <div className="flex-1 px-6 py-5 space-y-6">
          {/* QR Preview */}
          {qrCode?.qrImagePngUrl && (
            <div className="flex justify-center">
              <img src={qrCode.qrImagePngUrl} alt="QR" className="w-20 h-20 rounded-xl border border-gray-100" />
            </div>
          )}

          {/* Range tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {RANGE_OPTIONS.map((opt, i) => (
              <button key={opt.label} onClick={() => setRange(i)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${range === i ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
                {opt.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : analytics ? (
            <>
              {/* 4 stat boxes */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Scans', value: analytics.totalScans ?? 0, icon: '📊' },
                  { label: 'Unique Scanners', value: analytics.uniqueScans ?? 0, icon: '👁️' },
                  { label: 'Peak Day', value: analytics.peakDay?.date || '—', icon: '🏆' },
                  { label: 'Last Scanned', value: timeAgo(qrCode?.lastScannedAt), icon: '🕐' },
                ].map(s => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xl mb-1">{s.icon}</p>
                    <p className="text-xl font-black text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Scan Trend Chart */}
              {analytics.scansByDay?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Scan Trend</p>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.scansByDay}>
                        <defs>
                          <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                        <YAxis tick={{ fontSize: 10 }} width={28} />
                        <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }} />
                        <Area type="monotone" dataKey="count" stroke="#FF6B00" strokeWidth={2} fill="url(#scanGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Device Breakdown */}
              {deviceData.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Device Breakdown</p>
                  <div className="flex items-center gap-4">
                    <div className="h-32 w-32 flex-shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={deviceData} dataKey="value" innerRadius={35} outerRadius={55}>
                            {deviceData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                      {deviceData.map(d => (
                        <div key={d.name} className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.fill }} />
                          <span className="text-xs text-gray-600 capitalize">{d.name === 'mobile' ? '📱' : d.name === 'desktop' ? '💻' : '📟'} {d.name}</span>
                          <span className="text-xs font-bold text-gray-900">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Top Locations */}
              {topCities.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Top Locations</p>
                  <div className="space-y-2">
                    {topCities.map(c => (
                      <div key={c.city} className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-24 flex-shrink-0 truncate">{c.city}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div className="bg-[#FF6B00] h-2 rounded-full" style={{ width: `${Math.round((c.count / maxCity) * 100)}%` }} />
                        </div>
                        <span className="text-xs font-bold text-gray-700 w-8 text-right">{c.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* OS Breakdown */}
              {analytics.scansByOS?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Operating Systems</p>
                  <div className="flex flex-wrap gap-2">
                    {analytics.scansByOS.map(o => (
                      <span key={o.os} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-700">
                        {o.os}: {o.count}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">📊</p>
              <p className="text-sm">No scan data yet for this range.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}