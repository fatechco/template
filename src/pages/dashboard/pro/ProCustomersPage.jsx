import { useState } from "react";
import { Search, MessageCircle, Phone, FileText, Star, X } from "lucide-react";

const MOCK_CUSTOMERS = [
  { id: 1, name: "Ahmed Hassan", email: "ahmed.hassan@email.com", phone: "+20 100 123 4567", city: "Cairo", totalOrders: 3, totalSpent: 5200, rating: 5, lastOrder: "Mar 18, 2026", avatar: "AH" },
  { id: 2, name: "Sara Mohamed", email: "sara.m@email.com", phone: "+20 101 234 5678", city: "New Cairo", totalOrders: 1, totalSpent: 1200, rating: 4, lastOrder: "Mar 20, 2026", avatar: "SM" },
  { id: 3, name: "Karim Ali", email: "karim.ali@email.com", phone: "+971 50 345 6789", city: "Dubai", totalOrders: 2, totalSpent: 2800, rating: 5, lastOrder: "Mar 10, 2026", avatar: "KA" },
  { id: 4, name: "Layla Nour", email: "layla.n@email.com", phone: "+966 55 456 7890", city: "Riyadh", totalOrders: 1, totalSpent: 1800, rating: 4, lastOrder: "Mar 22, 2026", avatar: "LN" },
  { id: 5, name: "Omar Khalid", email: "omar.k@email.com", phone: "+20 112 567 8901", city: "Giza", totalOrders: 4, totalSpent: 7400, rating: 5, lastOrder: "Feb 28, 2026", avatar: "OK" },
];

export default function ProCustomersPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = MOCK_CUSTOMERS.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">👥 My Customers</h1>
          <p className="text-sm text-gray-500 mt-1">Clients who have worked with you</p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400 w-52" />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">Total Customers</p>
          <p className="text-2xl font-black text-blue-700 mt-1">{MOCK_CUSTOMERS.length}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-xs font-bold text-green-600 uppercase tracking-wide">Total Revenue</p>
          <p className="text-2xl font-black text-green-700 mt-1">${MOCK_CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wide">Avg. Rating</p>
          <p className="text-2xl font-black text-amber-700 mt-1">
            {(MOCK_CUSTOMERS.reduce((s, c) => s + c.rating, 0) / MOCK_CUSTOMERS.length).toFixed(1)} ⭐
          </p>
        </div>
      </div>

      {/* Customer List + Detail */}
      <div className="flex gap-5">
        {/* List */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Customer", "City", "Orders", "Total Spent", "Last Order", "Rating", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(c => (
                <tr key={c.id}
                  onClick={() => setSelected(c)}
                  className={`cursor-pointer transition-colors ${selected?.id === c.id ? "bg-orange-50" : "hover:bg-gray-50"}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-xs font-black text-orange-600 flex-shrink-0">
                        {c.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{c.city}</td>
                  <td className="px-5 py-4 font-bold text-gray-700">{c.totalOrders}</td>
                  <td className="px-5 py-4 font-black text-gray-900">${c.totalSpent.toLocaleString()}</td>
                  <td className="px-5 py-4 text-gray-500">{c.lastOrder}</td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star size={12} className="fill-amber-400" /> {c.rating}.0
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-green-600 transition-colors" title="WhatsApp"><MessageCircle size={15} /></button>
                      <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Call"><Phone size={15} /></button>
                      <button className="text-gray-400 hover:text-orange-500 transition-colors" title="Create Invoice"><FileText size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail Panel */}
         {selected && (
           <div className="w-64 flex-shrink-0 bg-white rounded-xl border border-gray-200 p-5 space-y-4 self-start relative">
             <div className="flex items-center justify-between mb-3">
               <h3 className="font-black text-gray-900 text-sm">Customer Details</h3>
               <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                 <X size={16} className="text-gray-400" />
               </button>
             </div>
             <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-xl font-black text-orange-600 mx-auto mb-3">
                {selected.avatar}
              </div>
              <p className="font-black text-gray-900">{selected.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{selected.city}</p>
              <div className="flex items-center justify-center gap-1 mt-1 text-amber-500">
                {[...Array(selected.rating)].map((_, i) => <Star key={i} size={12} className="fill-amber-400" />)}
              </div>
            </div>
            <div className="space-y-2 text-sm border-t border-gray-100 pt-4 text-center">
               <p className="text-gray-500 text-xs">Email</p>
               <p className="font-medium text-gray-700 text-xs">{selected.email}</p>
               <p className="text-gray-500 text-xs mt-2">Phone</p>
               <p className="font-medium text-gray-700 text-xs">{selected.phone}</p>
               <p className="text-gray-500 text-xs mt-2">Orders</p>
               <p className="font-black text-gray-900">{selected.totalOrders}</p>
               <p className="text-gray-500 text-xs mt-2">Total Spent</p>
               <p className="font-black text-green-600">${selected.totalSpent.toLocaleString()}</p>
               <p className="text-gray-500 text-xs mt-2">Last Order</p>
               <p className="font-medium text-gray-700 text-xs">{selected.lastOrder}</p>
            </div>
            <div className="space-y-2 pt-2">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors">
                <MessageCircle size={13} /> WhatsApp
              </button>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors">
                <FileText size={13} /> Create Invoice
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}