import { useState } from 'react';
import { Plus, Edit, Trash2, Download, TrendingUp, DollarSign, PieChart, Eye, Filter, Search } from 'lucide-react';
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const EXPENSE_CATEGORIES = [
  { id: 'rent', name: 'Office Rent', icon: '🏢', color: '#FF6B6B' },
  { id: 'salaries', name: 'Salaries & Payroll', icon: '👥', color: '#4ECDC4' },
  { id: 'utilities', name: 'Utilities', icon: '💡', color: '#45B7D1' },
  { id: 'marketing', name: 'Marketing & Ads', icon: '📢', color: '#FFA07A' },
  { id: 'transport', name: 'Transport & Fuel', icon: '🚗', color: '#98D8C8' },
  { id: 'supplies', name: 'Office Supplies', icon: '📎', color: '#F7DC6F' },
  { id: 'technology', name: 'Technology & Software', icon: '💻', color: '#BB8FCE' },
  { id: 'insurance', name: 'Insurance', icon: '🛡️', color: '#85C1E2' },
  { id: 'maintenance', name: 'Maintenance & Repairs', icon: '🔧', color: '#F8B195' },
  { id: 'training', name: 'Training & Development', icon: '📚', color: '#A8E6CF' },
  { id: 'legal', name: 'Legal & Compliance', icon: '⚖️', color: '#FFD3B6' },
  { id: 'other', name: 'Other', icon: '📦', color: '#C7CEEA' },
];

const MOCK_EXPENSES = [
  { id: 1, category: 'rent', amount: 5000, date: '2026-03-20', description: 'Monthly office rent', payment: 'Bank Transfer', status: 'paid' },
  { id: 2, category: 'salaries', amount: 12000, date: '2026-03-20', description: 'March salaries', payment: 'Bank Transfer', status: 'paid' },
  { id: 3, category: 'marketing', amount: 2500, date: '2026-03-18', description: 'Facebook & Google Ads', payment: 'Credit Card', status: 'paid' },
  { id: 4, category: 'utilities', amount: 800, date: '2026-03-15', description: 'Electricity & Water', payment: 'Auto-debit', status: 'paid' },
  { id: 5, category: 'transport', amount: 600, date: '2026-03-14', description: 'Fuel & Vehicle Maintenance', payment: 'Cash', status: 'paid' },
  { id: 6, category: 'supplies', amount: 450, date: '2026-03-12', description: 'Office stationery & equipment', payment: 'Credit Card', status: 'pending' },
  { id: 7, category: 'technology', amount: 1200, date: '2026-03-10', description: 'Software licenses & subscriptions', payment: 'Bank Transfer', status: 'paid' },
  { id: 8, category: 'insurance', amount: 3000, date: '2026-03-01', description: 'Monthly insurance premium', payment: 'Bank Transfer', status: 'paid' },
];

export default function FranchiseOwnerBizExpenses() {
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newExpense, setNewExpense] = useState({
    category: 'supplies',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    payment: 'Cash',
  });

  const filtered = expenses.filter(exp => {
    const categoryMatch = filterCategory === 'all' || exp.category === filterCategory;
    const statusMatch = filterStatus === 'all' || exp.status === filterStatus;
    const searchMatch = !searchQuery || exp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && statusMatch && searchMatch;
  });

  const categoryTotals = EXPENSE_CATEGORIES.map(cat => {
    const total = expenses.filter(e => e.category === cat.id).reduce((sum, e) => sum + e.amount, 0);
    return { name: cat.name, value: total, color: cat.color };
  }).filter(c => c.value > 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const paidExpenses = expenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);

  const monthlyData = [
    { month: 'Jan', total: 18000 },
    { month: 'Feb', total: 21500 },
    { month: 'Mar', total: 25850 },
    { month: 'Apr', total: 23200 },
    { month: 'May', total: 26000 },
  ];

  const handleAddExpense = () => {
    if (newExpense.amount && newExpense.description) {
      setExpenses([...expenses, {
        id: Math.max(...expenses.map(e => e.id), 0) + 1,
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        status: 'pending',
      }]);
      setShowForm(false);
      setNewExpense({
        category: 'supplies',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        payment: 'Cash',
      });
    }
  };

  const getCategoryName = (id) => EXPENSE_CATEGORIES.find(c => c.id === id)?.name || 'Unknown';
  const getCategoryIcon = (id) => EXPENSE_CATEGORIES.find(c => c.id === id)?.icon || '📦';

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">💸 Expenses</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage all business expenses</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-red-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-red-700">
          <Plus size={18} /> Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Total Expenses</p>
              <p className="text-3xl font-black text-gray-900 mt-2">${totalExpenses.toLocaleString()}</p>
            </div>
            <span className="text-3xl">💸</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Paid</p>
              <p className="text-3xl font-black text-green-600 mt-2">${paidExpenses.toLocaleString()}</p>
            </div>
            <span className="text-3xl">✅</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Pending</p>
              <p className="text-3xl font-black text-orange-600 mt-2">${pendingExpenses.toLocaleString()}</p>
            </div>
            <span className="text-3xl">⏳</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Total Records</p>
              <p className="text-3xl font-black text-blue-600 mt-2">{expenses.length}</p>
            </div>
            <span className="text-3xl">📊</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">Monthly Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="total" fill="#EF4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">Expenses by Category</h2>
          {categoryTotals.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RechartsChart>
                <Pie
                  data={categoryTotals}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                >
                  {categoryTotals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </RechartsChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">No expenses yet</div>
          )}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryTotals.map((cat, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-gray-600 truncate">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">Search</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400"
            >
              <option value="all">All Categories</option>
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 text-sm">
              <Download size={14} /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Category</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Description</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Amount</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Date</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Payment</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(expense => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getCategoryIcon(expense.category)}</span>
                    <span className="font-medium text-gray-900">{getCategoryName(expense.category)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{expense.description}</td>
                <td className="px-6 py-4 font-bold text-gray-900">${expense.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-600">{expense.date}</td>
                <td className="px-6 py-4 text-gray-600 text-xs">{expense.payment}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    expense.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {expense.status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedExpense(expense)} className="p-2 hover:bg-gray-100 rounded text-blue-600"><Eye size={16} /></button>
                    <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Edit size={16} /></button>
                    <button className="p-2 hover:bg-gray-100 rounded text-red-600"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Expense Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Add New Expense</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Category *</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-red-400"
                >
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Description *</label>
                <input
                  type="text"
                  placeholder="What is this expense for?"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Amount (₦) *</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Payment Method</label>
                <select
                  value={newExpense.payment}
                  onChange={(e) => setNewExpense({ ...newExpense, payment: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-red-400"
                >
                  <option>Cash</option>
                  <option>Credit Card</option>
                  <option>Bank Transfer</option>
                  <option>Cheque</option>
                  <option>Auto-debit</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={handleAddExpense} className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-lg hover:bg-red-700">Add Expense</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Expense Details</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 font-medium mb-1">Category</p>
                <p className="font-bold text-gray-900 text-lg">{getCategoryIcon(selectedExpense.category)} {getCategoryName(selectedExpense.category)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 font-medium mb-1">Description</p>
                <p className="font-bold text-gray-900">{selectedExpense.description}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 font-medium mb-1">Amount</p>
                <p className="font-black text-red-600 text-2xl">${selectedExpense.amount.toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 font-medium mb-1">Date</p>
                  <p className="font-bold text-gray-900">{selectedExpense.date}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 font-medium mb-1">Payment</p>
                  <p className="font-bold text-gray-900 text-sm">{selectedExpense.payment}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 font-medium mb-1">Status</p>
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                  selectedExpense.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {selectedExpense.status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                </span>
              </div>
              <button onClick={() => setSelectedExpense(null)} className="w-full border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}