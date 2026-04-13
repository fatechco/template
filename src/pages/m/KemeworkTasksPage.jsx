import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileTopBar from '@/components/mobile-v2/MobileTopBar';
import { MapPin, DollarSign } from 'lucide-react';

const TABS = ['All', 'Open', 'Assigned', 'In Progress', 'Done', 'Cancelled'];

const MOCK_TASKS = [
  {
    id: 1,
    title: 'Fix kitchen tap leak',
    location: 'Maadi, Cairo',
    budget: '$150',
    status: 'in_progress',
    bids: 0,
    professional: { name: 'Ahmed Hassan', avatar: '👨' },
  },
  {
    id: 2,
    title: 'Paint bedroom walls',
    location: 'Heliopolis, Cairo',
    budget: '$200',
    status: 'assigned',
    bids: 0,
    professional: { name: 'Fatima Al-Zahra', avatar: '👩' },
  },
  {
    id: 3,
    title: 'AC maintenance and cleaning',
    location: 'Downtown, Cairo',
    budget: '$120',
    status: 'open',
    bids: 3,
    professional: null,
  },
  {
    id: 4,
    title: 'Install ceiling fan',
    location: 'New Cairo, Cairo',
    budget: '$180',
    status: 'open',
    bids: 5,
    professional: null,
  },
  {
    id: 5,
    title: 'Bathroom tile replacement',
    location: 'Nasr City, Cairo',
    budget: '$300',
    status: 'done',
    bids: 0,
    professional: { name: 'Mohammad Ali', avatar: '👨' },
  },
];

export default function KemeworkTasksPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  const filteredTasks = MOCK_TASKS.filter((task) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Open') return task.status === 'open';
    if (activeTab === 'Assigned') return task.status === 'assigned';
    if (activeTab === 'In Progress') return task.status === 'in_progress';
    if (activeTab === 'Done') return task.status === 'done';
    if (activeTab === 'Cancelled') return task.status === 'cancelled';
    return true;
  });

  const getStatusBadge = (status) => {
    const config = {
      open: { bg: 'bg-green-100', text: 'text-green-700', label: 'Open' },
      assigned: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Assigned' },
      in_progress: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'In Progress' },
      done: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Done' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
    };
    const c = config[status] || config.open;
    return { ...c };
  };

  const categoryIcons = {
    default: '🔨',
    plumbing: '🔧',
    electrical: '⚡',
    painting: '🎨',
    cleaning: '🧹',
    ac: '❄️',
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-[480px] mx-auto">
      <MobileTopBar title="My Tasks" showBack />

      {/* Filter Tabs */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-200">
        <div className="flex overflow-x-auto no-scrollbar px-4 py-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-2 font-bold text-sm rounded-lg mr-2 transition-colors ${
                activeTab === tab
                  ? 'bg-teal-100 text-teal-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="px-4 py-4 space-y-3 pb-24">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-medium">No tasks found</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const statusBadge = getStatusBadge(task.status);
            return (
              <div
                key={task.id}
                onClick={() => navigate(`/m/dashboard/tasks/${task.id}`)}
                className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm active:shadow-md transition-shadow"
              >
                {/* Top row: icon, title, status */}
                <div className="flex gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                    {categoryIcons.default}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{task.title}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 ${statusBadge.bg} ${statusBadge.text}`}>
                    {statusBadge.label}
                  </span>
                </div>

                {/* Location and budget */}
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-3 ml-13">
                  <MapPin size={14} />
                  <span>{task.location}</span>
                  <span className="text-gray-400">•</span>
                  <DollarSign size={14} />
                  <span className="font-bold text-gray-900">{task.budget}</span>
                </div>

                {/* Professional or Bids info */}
                {task.professional ? (
                  <div className="text-xs text-gray-600 mb-2 ml-13">
                    {task.professional.avatar} <strong>{task.professional.name}</strong> accepted
                  </div>
                ) : task.bids > 0 ? (
                  <div className="text-xs font-bold text-orange-600 mb-2 ml-13">
                    📩 {task.bids} bids received
                  </div>
                ) : null}

                {/* Action button */}
                <button className="w-full text-sm font-bold text-teal-600 border border-teal-600 py-2 rounded-lg">
                  View Task
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}