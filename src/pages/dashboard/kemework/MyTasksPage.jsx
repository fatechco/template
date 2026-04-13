import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, ChevronRight } from "lucide-react";

const TABS = ["All", "Open", "In Progress", "Completed", "Cancelled"];

const STATUS_STYLES = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-gray-100 text-gray-500",
};

const MOCK_TASKS = [
  { id: 1, title: "Full Kitchen Renovation with New Cabinets", category: "Remodeling", status: "Open", budgetMin: 3000, budgetMax: 6000, currency: "USD", bids: 7, posted: "2026-03-10", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=70" },
  { id: 2, title: "Apartment Electrical Rewiring - 3 Bedrooms", category: "Electrical", status: "In Progress", budgetMin: 800, budgetMax: 1500, currency: "USD", bids: 3, posted: "2026-03-05", image: null },
  { id: 3, title: "Bathroom Tiles Installation - 2 Bathrooms", category: "Tiling", status: "Open", budgetMin: 300, budgetMax: 600, currency: "USD", bids: 9, posted: "2026-03-01", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200&q=70" },
  { id: 4, title: "Garden Landscaping & Irrigation System", category: "Landscaping", status: "Completed", budgetMin: 2000, budgetMax: 5000, currency: "USD", bids: 4, posted: "2026-02-15", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=70" },
  { id: 5, title: "Interior Painting - Full Villa 4 Bedrooms", category: "Painting", status: "Cancelled", budgetMin: 1200, budgetMax: 2500, currency: "USD", bids: 0, posted: "2026-02-01", image: null },
];

const MOCK_BIDS = [
  { id: 1, taskId: 1, pro: "Ahmed Hassan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=70", rating: 4.9, amount: 4500, currency: "USD", days: 21, message: "I've done over 50 kitchen renovations and can guarantee top quality cabinets..." },
  { id: 2, taskId: 1, pro: "Kareem Saad", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=70", rating: 4.6, amount: 3800, currency: "USD", days: 28, message: "Experienced carpenter with 9 years. I can source quality materials at competitive prices..." },
  { id: 3, taskId: 1, pro: "Tariq Al-Farsi", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&q=70", rating: 4.7, amount: 5200, currency: "USD", days: 18, message: "I lead a team of 5 craftsmen and can complete this project within 18 days..." },
];

export default function MyTasksPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  const filtered = MOCK_TASKS.filter(t =>
    (activeTab === "All" || t.status === activeTab) &&
    (search === "" || t.title.toLowerCase().includes(search.toLowerCase()))
  );

  const bids = MOCK_BIDS.filter(b => b.taskId === selectedTask?.id);

  return (
    <div className="min-h-screen" style={{ background: "#F8F5F0" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-5">
        <div className="max-w-[900px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-900">My Tasks</h1>
            <p className="text-sm text-gray-500">{MOCK_TASKS.length} tasks total</p>
          </div>
          <Link to="/kemework/post-task" className="px-4 py-2 rounded-xl text-white text-sm font-bold" style={{ background: "#C41230" }}>
            + Post Task
          </Link>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-5">
        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
              style={{ background: activeTab === t ? "#0D9488" : "#fff", color: activeTab === t ? "#fff" : "#374151", border: activeTab === t ? "none" : "1px solid #e5e7eb" }}>
              {t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 mb-4">
          <Search size={16} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search my tasks..." className="flex-1 text-sm outline-none" />
          {search && <button onClick={() => setSearch("")}><X size={14} className="text-gray-400" /></button>}
        </div>

        {/* Task list */}
        <div className="flex flex-col gap-3">
          {filtered.map(task => (
            <div key={task.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                {task.image ? <img src={task.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🔧</div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900 text-sm mb-1 line-clamp-1">{task.title}</p>
                <div className="flex flex-wrap gap-1 mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{task.category}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[task.status]}`}>{task.status}</span>
                </div>
                <p className="text-xs text-gray-400">{task.bids} bids · ${task.budgetMin}–${task.budgetMax} {task.currency} · Posted {task.posted}</p>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button onClick={() => setSelectedTask(task)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors">
                  View Bids ({task.bids})
                </button>
                <button className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50">Edit</button>
                <button className="px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200 text-red-600 hover:bg-red-50">Close</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-2">📋</p>
              <p className="text-gray-500 font-semibold">No tasks found</p>
            </div>
          )}
        </div>
      </div>

      {/* Bids Slide Panel */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedTask(null)} />
          <div className="relative bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
              <div>
                <p className="font-black text-gray-900 text-sm">Bids Received</p>
                <p className="text-xs text-gray-500 line-clamp-1">{selectedTask.title}</p>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {bids.length === 0 && <p className="text-center text-gray-400 py-8">No bids yet for this task.</p>}
              {bids.map(bid => (
                <div key={bid.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={bid.avatar} alt={bid.pro} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="font-black text-gray-900 text-sm">{bid.pro}</p>
                      <p className="text-xs text-gray-400">⭐ {bid.rating} rating</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm" style={{ color: "#C41230" }}>${bid.amount}</p>
                      <p className="text-xs text-gray-400">{bid.days} days</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3 italic">"{bid.message}"</p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-lg text-xs font-bold text-white" style={{ background: "#0D9488" }}>Accept Bid</button>
                    <Link to={`/kemework/freelancer/${bid.pro.toLowerCase().replace(" ", "-")}`} className="flex-1 py-2 rounded-lg text-xs font-bold text-center border border-gray-300 text-gray-700 hover:bg-gray-50">View Profile</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}