import { useState } from 'react';
import { Plus, Eye, FileText, MessageCircle } from 'lucide-react';

const EMPLOYEES = [
  { id: 1, name: "Sara Mohamed", position: "Sales Manager", department: "Sales", status: "active", location: "onsite", tasks: 8, completed: 5, avatar: "SM" },
  { id: 2, name: "Omar Hassan", position: "Accountant", department: "Finance", status: "active", location: "remote", tasks: 5, completed: 4, avatar: "OH" },
  { id: 3, name: "Fatima Ali", position: "Admin", department: "Operations", status: "leave", location: "onsite", tasks: 3, completed: 2, avatar: "FA" },
];

const DEPARTMENTS = { Sales: "from-blue-500 to-blue-600", Finance: "from-green-500 to-green-600", Operations: "from-purple-500 to-purple-600" };

export default function FranchiseOwnerBizEmployees() {
  const [showAddEmployee, setShowAddEmployee] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="border-l-4 border-orange-600 pl-4">
          <h1 className="text-3xl font-black text-gray-900">Employees</h1>
        </div>
        <button onClick={() => setShowAddEmployee(true)} className="flex items-center gap-2 bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-orange-700">
          <Plus size={18} /> Add Employee
        </button>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-3 gap-6">
        {EMPLOYEES.map(emp => (
          <div key={emp.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Color Strip */}
            <div className={`h-16 bg-gradient-to-r ${DEPARTMENTS[emp.department]}`} />

            {/* Content */}
            <div className="p-6 text-center -mt-8 relative pb-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-3 border-4 border-white shadow-md">
                {emp.avatar}
              </div>

              <h3 className="text-lg font-black text-gray-900 mb-1">{emp.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{emp.position}</p>

              {/* Department Badge */}
              <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-700 mb-4">
                {emp.department}
              </span>

              {/* Status Row */}
              <div className="flex items-center justify-center gap-3 text-xs font-bold mb-4 py-3 border-y border-gray-100">
                <span className={emp.status === "active" ? "text-green-600" : "text-red-600"}>
                  {emp.status === "active" ? "🟢" : "🔴"} {emp.status === "active" ? "Active" : "On Leave"}
                </span>
                <span className="text-gray-600">
                  {emp.location === "onsite" ? "📍 Onsite" : "🏠 Remote"}
                </span>
              </div>

              {/* Stats */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs">
                <p className="text-gray-600">Active Tasks: <span className="font-bold text-gray-900">{emp.tasks}</span></p>
                <p className="text-gray-600">Completed: <span className="font-bold text-green-600">{emp.completed}</span></p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-orange-50 text-orange-600 font-bold text-xs rounded-lg hover:bg-orange-100 flex items-center justify-center gap-1">
                  <Eye size={14} /> Profile
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-600 font-bold text-xs rounded-lg hover:bg-gray-200 flex items-center justify-center gap-1">
                  <FileText size={14} /> Tasks
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-600 font-bold text-xs rounded-lg hover:bg-gray-200 flex items-center justify-center gap-1">
                  <MessageCircle size={14} /> Chat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Add Employee</h2>

            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-3xl mx-auto cursor-pointer hover:bg-orange-200 transition-colors">
                  📷
                </div>
                <p className="text-xs text-gray-600 mt-2">Click to upload photo</p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Name</label>
                <input type="text" placeholder="Full name" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Position</label>
                <input type="text" placeholder="Job title" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Department</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400">
                  <option>Sales</option>
                  <option>Finance</option>
                  <option>Operations</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Phone</label>
                <input type="tel" placeholder="+20 100 1234567" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Email</label>
                <input type="email" placeholder="email@example.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Start Date</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddEmployee(false)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={() => setShowAddEmployee(false)} className="flex-1 bg-orange-600 text-white font-bold py-2.5 rounded-lg hover:bg-orange-700">Save Employee</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}