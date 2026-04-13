import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Trash2, TrendingUp } from 'lucide-react';
import QRGeneratorWidget from '@/components/qr/QRGeneratorWidget';
import { base44 } from "@/api/base44Client";

export default function ProductsDesktop() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const products = [
    { id: 1, name: 'Wireless Headphones Pro', sku: 'WHP-001', price: '$89.99', stock: 45, sales: 234, rating: 4.8, status: 'active' },
    { id: 2, name: 'USB-C Cable 2m', sku: 'USB-002', price: '$12.99', stock: 156, sales: 892, rating: 4.5, status: 'active' },
    { id: 3, name: 'Phone Case (Blue)', sku: 'PC-003', price: '$24.99', stock: 0, sales: 156, rating: 4.6, status: 'out_of_stock' },
    { id: 4, name: 'Screen Protector Pack', sku: 'SP-004', price: '$9.99', stock: 89, sales: 445, rating: 4.7, status: 'active' },
    { id: 5, name: 'Power Bank 20000mAh', sku: 'PB-005', price: '$34.99', stock: 23, sales: 127, rating: 4.4, status: 'low_stock' },
    { id: 6, name: 'Laptop Stand Aluminum', sku: 'LS-006', price: '$49.99', stock: 12, sales: 89, rating: 4.9, status: 'low_stock' },
  ];

  const filtered = products.filter(p => {
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = filterStatus === 'all' || p.status === filterStatus;
    return searchMatch && statusMatch;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">My Products</h1>
          <p className="text-gray-600">Manage and track all your products</p>
        </div>
        <button onClick={() => navigate('/kemetro/seller/add-product')} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Product</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">SKU</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Price</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Stock</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Sales</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Rating</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    <div>
                      <p className="font-bold text-gray-900">{product.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{product.sku}</td>
                  <td className="px-6 py-3 font-bold text-gray-900">{product.price}</td>
                  <td className="px-6 py-3">
                    <span className={`font-bold ${product.stock > 50 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1 text-gray-700">
                      <TrendingUp size={14} className="text-blue-600" />
                      {product.sales}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-yellow-600 font-bold">⭐ {product.rating}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      product.status === 'active' ? 'bg-green-100 text-green-700' :
                      product.status === 'low_stock' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.status === 'active' ? 'Active' : product.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2 items-center">
                      <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Eye size={16} /></button>
                      <button onClick={() => navigate(`/kemetro/seller/products/${product.id}/edit`)} className="p-2 hover:bg-gray-100 rounded text-blue-600"><Edit size={16} /></button>
                      <button className="p-2 hover:bg-gray-100 rounded text-red-600"><Trash2 size={16} /></button>
                      <QRGeneratorWidget targetType="product" targetId={String(product.id)} targetTitle={product.name} mode="compact" />
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