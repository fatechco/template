import { useState } from "react";
import { MapPin, DollarSign, Clock, Eye, Filter } from "lucide-react";

const CATEGORY = "Finishing & Interior Design";

const MOCK_TASKS = [
  { id: 1, title: "Kitchen Renovation Project", budget: 5000, location: "Cairo", posted: "2 days ago", bids: 8, description: "Complete kitchen overhaul needed", difficulty: "High" },
  { id: 2, title: "Bathroom Tile Installation", budget: 2500, location: "New Cairo", posted: "1 day ago", bids: 5, description: "Professional tile work required", difficulty: "Medium" },
  { id: 3, title: "Wall Painting & Finishing", budget: 1500, location: "Giza", posted: "3 days ago", bids: 12, description: "Interior wall painting service", difficulty: "Easy" },
  { id: 4, title: "Flooring Installation", budget: 3500, location: "Cairo", posted: "1 week ago", bids: 6, description: "Quality flooring installation", difficulty: "High" },
];

const difficultyColors = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
};

export default function CompanyTasksInCategoryPage() {
  const [sortBy, setSortBy] = useState("recent");
  const [selectedTask, setSelectedTask] = useState(null);

  const sorted = [...MOCK_TASKS].sort((a, b) => {
    if (sortBy === "budget-high") return b.budget - a.budget;
    if (sortBy === "budget-low") return a.budget - b.budget;
    return 0;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">📂 Tasks in my Category</h1>
        <p className="text-sm text-gray-500 mt-1">{CATEGORY}</p>
      </div>

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{sorted.length} tasks available</p>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-400">
            <option value="recent">Most Recent</option>
            <option value="budget-high">Highest Budget</option>
            <option value="budget-low">Lowest Budget</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {sorted.map(task => (
          <div key={task.id} onClick={() => setSelectedTask(task)}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-black text-gray-900">{task.title}</h3>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${difficultyColors[task.difficulty]}`}>
                    {task.difficulty}
                  </span>
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
                </div>
              </div>
              <button className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold text-sm transition-colors flex-shrink-0">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-4">{selectedTask.title}</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${difficultyColors[selectedTask.difficulty]}`}>
                  {selectedTask.difficulty} Difficulty
                </span>
                <span className="text-sm text-gray-600">Posted {selectedTask.posted}</span>
              </div>
              
              <p className="text-gray-600">{selectedTask.description}</p>
              
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Budget</p>
                  <p className="font-black text-green-600 text-lg">${selectedTask.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="font-bold text-gray-900">{selectedTask.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Bids</p>
                  <p className="font-black text-pink-600 text-lg">{selectedTask.bids}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSelectedTask(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg font-bold text-gray-900 hover:bg-gray-50 text-sm">
                Close
              </button>
              <button className="flex-1 px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold text-sm transition-colors">
                Submit Bid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}