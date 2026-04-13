import { DollarSign, TrendingUp, Download, CreditCard, Clock, CheckCircle } from 'lucide-react';

const TRANSACTIONS = [
  { id: '#TXN-001', order: '#KM-2401', customer: 'Ahmed Hassan', amount: '$234.50', commission: '$23.45', net: '$211.05', date: '2026-03-23', status: 'paid' },
  { id: '#TXN-002', order: '#KM-2400', customer: 'Fatima Ali', amount: '$89.99', commission: '$9.00', net: '$80.99', date: '2026-03-22', status: 'paid' },
  { id: '#TXN-003', order: '#KM-2399', customer: 'Mohamed Samir', amount: '$456.75', commission: '$45.68', net: '$411.07', date: '2026-03-21', status: 'pending' },
  { id: '#TXN-004', order: '#KM-2398', customer: 'Sara Mohamed', amount: '$156.00', commission: '$15.60', net: '$140.40', date: '2026-03-20', status: 'paid' },
  { id: '#TXN-005', order: '#KM-2397', customer: 'Omar Khalid', amount: '$342.50', commission: '$34.25', net: '$308.25', date: '2026-03-19', status: 'pending' },
];

export default function EarningsDesktop() {
  const totalRevenue = 12845.50;
  const totalCommission = 1284.55;
  const netEarnings = totalRevenue - totalCommission;
  const pendingPayout = 951.71;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Earnings</h1>
          <p className="text-gray-600">Track your revenue, commissions, and payouts</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-lg font-bold text-gray-700 hover:bg-gray-50">
          <Download size={18} /> Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50', change: '+18%' },
          { label: 'Net Earnings', value: `$${netEarnings.toLocaleString()}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', change: '+18%' },
          { label: 'Commission Paid', value: `$${totalCommission.toLocaleString()}`, icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-50', change: '10%' },
          { label: 'Pending Payout', value: `$${pendingPayout.toLocaleString()}`, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', change: '' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon size={22} className={stat.color} />
                </div>
                {stat.change && <span className="text-xs font-bold text-green-600">{stat.change}</span>}
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Payout Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 flex items-center justify-between">
        <div className="text-white">
          <p className="text-sm font-bold opacity-80 mb-1">Available for Payout</p>
          <p className="text-4xl font-black">${pendingPayout.toLocaleString()}</p>
          <p className="text-sm opacity-70 mt-1">Next payout scheduled: Apr 1, 2026</p>
        </div>
        <button className="bg-white text-blue-700 font-black px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
          Request Payout
        </button>
      </div>

      {/* Monthly Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-6">Monthly Earnings</h2>
          <div className="space-y-3">
            {[
              { month: 'March 2026', revenue: 4230, net: 3807 },
              { month: 'February 2026', revenue: 3890, net: 3501 },
              { month: 'January 2026', revenue: 4725, net: 4252 },
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-bold text-gray-900">{m.month}</p>
                  <p className="text-xs text-gray-600">Revenue: <span className="font-bold">${m.revenue.toLocaleString()}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-green-600">${m.net.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Net Earned</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-6">Commission Breakdown</h2>
          <div className="space-y-4">
            {[
              { label: 'Platform Fee', rate: '8%', amount: '$678' },
              { label: 'Payment Processing', rate: '2%', amount: '$257' },
              { label: 'Shipping Handling', rate: '0%', amount: '$349' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div>
                  <p className="text-sm font-bold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.rate} rate</p>
                </div>
                <p className="font-black text-orange-600">{item.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900">Recent Transactions</h2>
          <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Transaction</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Order</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Customer</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Order Amount</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Commission</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Net Earned</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {TRANSACTIONS.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-bold text-blue-600">{txn.id}</td>
                  <td className="px-6 py-3 text-gray-700">{txn.order}</td>
                  <td className="px-6 py-3 font-bold text-gray-900">{txn.customer}</td>
                  <td className="px-6 py-3 text-gray-700">{txn.amount}</td>
                  <td className="px-6 py-3 text-orange-600 font-bold">-{txn.commission}</td>
                  <td className="px-6 py-3 font-black text-green-600">{txn.net}</td>
                  <td className="px-6 py-3 text-gray-600 text-xs">{txn.date}</td>
                  <td className="px-6 py-3">
                    <span className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full w-fit ${
                      txn.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {txn.status === 'paid' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {txn.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
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