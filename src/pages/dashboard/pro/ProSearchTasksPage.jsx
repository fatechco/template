import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, DollarSign, Clock, Eye, Camera, Package } from "lucide-react";
import SnapAndFixBadge from "@/components/snap-and-fix/SnapAndFixBadge";

const MOCK_TASKS = [
  { id: 1, title: "Kitchen Renovation Project", category: "Renovation", budget: 5000, location: "Cairo", posted: "2 days ago", bids: 8, description: "Complete kitchen overhaul needed" },
  { id: 2, title: "Bathroom Tile Installation", category: "Tiling", budget: 2500, location: "New Cairo", posted: "1 day ago", bids: 5, description: "Professional tile work required" },
  { id: 3, title: "Wall Painting & Finishing", category: "Painting", budget: 1500, location: "Giza", posted: "3 days ago", bids: 12, description: "Interior wall painting service" },
  { id: 4, title: "Flooring Installation", category: "Flooring", budget: 3500, location: "Cairo", posted: "1 week ago", bids: 6, description: "Quality flooring installation" },
];

export default function ProSearchTasksPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Renovation", "Tiling", "Painting", "Flooring", "Carpentry"];

  const filtered = MOCK_TASKS.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-900">🔍 Search Tasks</h1>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400" />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                selectedCategory === cat
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No tasks found</p>
          </div>
        ) : (
          filtered.map(task => (
            <div key={task.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer overflow-hidden"
              style={{ borderLeft: task.isSnapAndFix ? "4px solid #14B8A6" : "4px solid #F59E0B" }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {task.isSnapAndFix && <SnapAndFixBadge compact />}
                    <h3 className="font-black text-gray-900">{task.title}</h3>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">{task.category}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  <div className="flex items-center gap-6 text-xs text-gray-500 flex-wrap">
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} className="text-green-600" /> ${task.budget.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-blue-600" /> {task.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-gray-600" /> Posted {task.posted}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={14} className="text-gray-600" /> {task.bids} bids
                    </div>
                    {task.isSnapAndFix && (
                      <>
                        <div className="flex items-center gap-1 text-teal-600 font-semibold">
                          <Camera size={12} /> Photo available
                        </div>
                        {task._snapData?.requiredMaterials?.length > 0 && (
                          <div className="flex items-center gap-1 text-blue-600 font-semibold">
                            <Package size={12} /> {task._snapData.requiredMaterials.length} materials identified
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <button onClick={() => navigate(`/kemework/task/${task.id}`)} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-sm transition-colors flex-shrink-0 ml-3">
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>


    </div>
  );
}