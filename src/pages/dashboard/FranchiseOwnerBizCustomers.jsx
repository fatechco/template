import { useState } from 'react';
import { Plus, Search, Eye, Upload } from 'lucide-react';

const CUSTOMERS = [
  { id: 1, name: "Ahmed Hassan", phone: "+20 100 1234567", email: "ahmed@email.com", company: "Tech Solutions", spent: 5000, lastOrder: "2026-03-20", status: "active" },
  { id: 2, name: "Fatima Ali", phone: "+20 100 1234568", email: "fatima@email.com", company: "Design Studio", spent: 3500, lastOrder: "2026-03-18", status: "active" },
  { id: 3, name: "Mohamed Samir", phone: "+20 100 1234569", email: "mohamed@email.com", company: "Construction Co", spent: 8000, lastOrder: "2026-03-15", status: "inactive" },
];

export default function FranchiseOwnerBizCustomers() {
  const [customers, setCustomers] = useState(CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkUploadMessage, setBulkUploadMessage] = useState("");

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBulkUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result;
        const lines = csv.split('\n').filter(l => l.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const newCustomers = lines.slice(1).map((line, idx) => {
          const values = line.split(',').map(v => v.trim());
          return {
            id: Math.max(...customers.map(c => c.id), 0) + idx + 1,
            name: values[headers.indexOf('name')] || 'Unknown',
            phone: values[headers.indexOf('phone')] || '',
            email: values[headers.indexOf('email')] || '',
            company: values[headers.indexOf('company')] || '',
            spent: parseInt(values[headers.indexOf('spent')]) || 0,
            lastOrder: values[headers.indexOf('lastorder')] || new Date().toISOString().split('T')[0],
            status: 'active',
          };
        });

        setCustomers(prev => [...prev, ...newCustomers]);
        setBulkUploadMessage(`✅ Successfully imported ${newCustomers.length} customers`);
        setTimeout(() => {
          setShowBulkUpload(false);
          setBulkUploadMessage("");
        }, 2000);
      } catch (error) {
        setBulkUploadMessage('❌ Error parsing CSV. Columns: name, phone, email, company, spent, lastorder');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">👥 Customers</h1>
          <p className="text-gray-500 text-sm mt-1">Total: {customers.length} customers</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowBulkUpload(true)} className="flex items-center gap-2 bg-green-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors">
            <Upload size={18} /> Bulk Import
          </button>
          <button className="flex items-center gap-2 bg-rose-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-rose-700">
            <Plus size={18} /> Add Customer
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search customers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-rose-400"
        />
      </div>

      {/* Bulk Upload Modal */}
      {showBulkUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-black text-gray-900 mb-2">📤 Bulk Import Customers</h2>
            <p className="text-sm text-gray-600 mb-6">Upload a CSV file (columns: name, phone, email, company, spent, lastorder)</p>

            <div className="mb-6">
              <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all">
                <Upload size={24} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-700">Click to select CSV file</span>
                <span className="text-xs text-gray-500">or drag and drop</span>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleBulkUpload}
                  className="hidden"
                />
              </label>
            </div>

            {bulkUploadMessage && (
              <div className="mb-6 p-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-900">
                {bulkUploadMessage}
              </div>
            )}

            <button
              onClick={() => setShowBulkUpload(false)}
              className="w-full border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Phone</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Company</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Total Spent</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Last Order</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(cust => (
                <tr key={cust.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-3">
                    <p className="font-bold text-gray-900">{cust.name}</p>
                    <p className="text-xs text-gray-600">{cust.email}</p>
                  </td>
                  <td className="px-6 py-3 text-gray-700">{cust.phone}</td>
                  <td className="px-6 py-3 text-gray-700">{cust.company}</td>
                  <td className="px-6 py-3 font-bold text-gray-900">${cust.spent.toLocaleString()}</td>
                  <td className="px-6 py-3 text-gray-600">{cust.lastOrder}</td>
                  <td className="px-6 py-3">
                    <button onClick={() => setSelectedCustomer(cust)} className="p-2 hover:bg-gray-100 rounded text-rose-600 font-bold">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail Panel */}
        {selectedCustomer && (
          <div className="w-80 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-black text-gray-900 mb-4">{selectedCustomer.name}</h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Phone</p>
                <p className="font-bold text-gray-900">{selectedCustomer.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Email</p>
                <p className="font-bold text-gray-900">{selectedCustomer.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Company</p>
                <p className="font-bold text-gray-900">{selectedCustomer.company}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Spent</p>
                <p className="font-bold text-green-600 text-lg">${selectedCustomer.spent.toLocaleString()}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs font-bold text-gray-700 mb-2">Recent Orders</p>
                <div className="space-y-2">
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-xs font-bold text-gray-900">Invoice KFO-001</p>
                    <p className="text-xs text-gray-600">$5,000 - Mar 20</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 border border-gray-200 text-gray-900 font-bold py-2 rounded-lg hover:bg-gray-50">Edit Customer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}