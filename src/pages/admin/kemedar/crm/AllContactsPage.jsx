import { useState } from "react";
import { Search, Plus, Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import CRMKanban from "@/components/admin/kemedar/crm/CRMKanban";

const mockContacts = [
  { id: 1, name: "Ahmed Hassan", role: "Agent", phone: "+201001234567", email: "ahmed@example.com", properties: 12, status: "hot", salesPerson: "Fatima", notes: "", lastContact: "2024-03-20", nextAction: "" },
  { id: 2, name: "Layla Mohamed", role: "Investor", phone: "+201101234567", email: "layla@example.com", properties: 5, status: "interested", salesPerson: "Omar", notes: "", lastContact: "2024-03-18", nextAction: "" },
  { id: 3, name: "Omar Khalil", role: "Agency", phone: "+201201234567", email: "omar@example.com", properties: 25, status: "converted", salesPerson: "Fatima", notes: "", lastContact: "2024-03-15", nextAction: "" },
];

export default function AllContactsPage() {
  const [view, setView] = useState("kanban");
  const [contacts, setContacts] = useState(mockContacts);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMove = (id, newStatus) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleAction = (id, actionType) => {
    const contact = contacts.find(c => c.id === id);
    console.log(`${actionType.toUpperCase()} action on ${contact.name}`);
    // Log action with timestamp
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">All Contacts</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your CRM contacts and sales pipeline</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700">
          <Plus size={16} /> Add Contact
        </button>
      </div>

      {/* View Toggle & Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setView("table")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              view === "table"
                ? "bg-orange-100 text-orange-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            📊 Table
          </button>
          <button
            onClick={() => setView("kanban")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              view === "kanban"
                ? "bg-orange-100 text-orange-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            🗂 Kanban
          </button>
        </div>

        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Kanban View */}
      {view === "kanban" && (
        <CRMKanban contacts={filtered} onMove={handleMove} onAction={handleAction} />
      )}

      {/* Table View */}
      {view === "table" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Phone</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Role</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Properties</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Sales Person</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Last Contact</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(contact => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-gray-900">{contact.name}</td>
                    <td className="px-4 py-3 text-gray-600">{contact.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{contact.email}</td>
                    <td className="px-4 py-3 text-gray-600">{contact.role}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{contact.properties}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">{contact.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{contact.salesPerson}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{contact.lastContact}</td>
                    <td className="px-4 py-3 flex gap-1">
                      <button className="p-1 hover:bg-gray-200 rounded text-blue-600">
                        <Eye size={14} />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded text-gray-600">
                        <Edit size={14} />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}