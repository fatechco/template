import { getUpdateManager } from '@/lib/update-manager';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PWAAnalyticsDashboard() {
  const manager = getUpdateManager();
  const analytics = manager.getAnalytics();
  const thisMonth = manager.getInstallsThisMonth();
  const dailyInstalls = manager.getDailyInstalls(30);
  const platformBreakdown = manager.getPlatformBreakdown();
  const acceptanceRate = manager.getAcceptanceRate();

  const chartData = Object.entries(dailyInstalls).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    installs: count,
  }));

  return (
    <div className="space-y-8">
      {/* Install Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* This Month Card */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <p className="text-sm text-[#6B7280] font-bold mb-2">PWA Installs This Month</p>
          <p className="text-4xl font-black text-[#FF6B00]">{thisMonth}</p>
          <p className="text-xs text-[#9CA3AF] mt-2">Total installs: {analytics.totalInstalls}</p>
        </div>

        {/* Acceptance Rate Card */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <p className="text-sm text-[#6B7280] font-bold mb-2">Install Prompt Rate</p>
          <p className="text-4xl font-black text-[#10B981]">{acceptanceRate.acceptanceRate}%</p>
          <p className="text-xs text-[#9CA3AF] mt-2">
            {acceptanceRate.accepted} accepted, {acceptanceRate.declined} declined
          </p>
        </div>

        {/* Prompts Shown Card */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <p className="text-sm text-[#6B7280] font-bold mb-2">Prompts Shown</p>
          <p className="text-4xl font-black text-[#3B82F6]">{analytics.promptShownCount}</p>
          <p className="text-xs text-[#9CA3AF] mt-2">Times install prompt displayed</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Installs Chart */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <h3 className="font-black text-[#1F2937] mb-4">Installs (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="installs"
                stroke="#FF6B00"
                strokeWidth={2}
                dot={{ fill: '#FF6B00' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Breakdown Chart */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <h3 className="font-black text-[#1F2937] mb-4">Platform Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="platform" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="installs" fill="#FF6B00" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Platform Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="p-6 border-b border-[#E5E7EB]">
          <h3 className="font-black text-[#1F2937]">Platform Breakdown</h3>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <th className="text-left p-4 font-bold text-[#6B7280] text-xs">Platform</th>
              <th className="text-left p-4 font-bold text-[#6B7280] text-xs">Installs</th>
              <th className="text-left p-4 font-bold text-[#6B7280] text-xs">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {platformBreakdown.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-4 text-[#9CA3AF] text-sm">
                  No install data yet
                </td>
              </tr>
            ) : (
              platformBreakdown.map((row) => (
                <tr key={row.platform} className="border-b border-[#E5E7EB]">
                  <td className="p-4 font-bold text-[#1F2937]">{row.platform}</td>
                  <td className="p-4 text-[#6B7280]">{row.installs}</td>
                  <td className="p-4 text-[#6B7280]">{row.percentage}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}