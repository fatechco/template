import { useState } from 'react';
import MobileTopBar from '@/components/mobile-v2/MobileTopBar';
import KemeworkProfessionalDrawer from '@/components/kemework/KemeworkProfessionalDrawer';
import { Menu, MapPin, DollarSign } from 'lucide-react';

export default function KemeworkProfessionalDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [available, setAvailable] = useState(true);

  const stats = {
    activeJobs: 3,
    thisMonth: 12,
    rating: 4.8,
    earnings: 2450,
  };

  const newJobs = [
    { id: 1, title: 'Electrical wiring apartment', category: '⚡', budget: '$150', location: 'Maadi', posted: '2h ago' },
    { id: 2, title: 'Bathroom tiles installation', category: '🔨', budget: '$200', location: 'Heliopolis', posted: '4h ago' },
    { id: 3, title: 'Paint exterior wall', category: '🎨', budget: '$120', location: 'Downtown', posted: '6h ago' },
  ];

  const activeJobs = [
    { id: 1, title: 'Kitchen renovation', client: 'Client', deadline: 'Mar 25', budget: '$500', status: 'In Progress' },
    { id: 2, title: 'Plumbing repair', client: 'Client', deadline: 'Mar 22', budget: '$300', status: 'In Progress' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileTopBar
        title="Kemework"
        rightAction={
          <button onClick={() => setDrawerOpen(true)} className="p-1">
            <Menu size={22} className="text-gray-700" />
          </button>
        }
      />
      <KemeworkProfessionalDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Professional</p>
            <p className="text-lg font-black text-gray-900">Handyman</p>
          </div>
          <div className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold">
            Professional
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center justify-between">
          <div className="flex-1">
            <p className="font-bold text-gray-900">Available for new jobs</p>
            <p className="text-xs text-gray-500 mt-1">{available ? '🟢 Accepting' : '🔴 Not accepting'}</p>
          </div>
          <button
            onClick={() => setAvailable(!available)}
            className={`w-12 h-7 rounded-full transition-colors ${
              available ? 'bg-green-500' : 'bg-gray-300'
            } flex items-center ${available ? 'justify-end' : 'justify-start'} px-1`}
          >
            <div className="w-5 h-5 bg-white rounded-full" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-2xl font-black text-gray-900">{stats.activeJobs}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">Active Jobs</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-2xl font-black text-gray-900">{stats.thisMonth}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">This Month</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-2xl font-black text-gray-900">⭐ {stats.rating}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">My Rating</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-2xl font-black text-gray-900">${stats.earnings}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">This Month</p>
          </div>
        </div>

        {/* New Jobs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-base font-black text-gray-900">New Jobs Near You</p>
            <button className="text-xs font-bold text-teal-600">View All →</button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {newJobs.map((job) => (
              <div key={job.id} className="flex-shrink-0 w-56 bg-white rounded-2xl p-4 border border-gray-200">
                <div className="flex items-start justify-between">
                  <p className="font-bold text-gray-900 text-sm leading-tight flex-1">{job.title}</p>
                  <span className="text-xl">{job.category}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <MapPin size={12} className="inline mr-1" />
                  {job.location} • {job.posted}
                </p>
                <p className="font-black text-orange-600 text-sm mt-2">{job.budget}</p>
                <button className="w-full mt-3 text-xs font-bold text-white bg-teal-600 py-2 rounded-lg">
                  View Job
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Jobs */}
        <div>
          <p className="text-base font-black text-gray-900 mb-3">In Progress</p>
          <div className="space-y-3">
            {activeJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-bold text-gray-900 text-sm">{job.title}</p>
                  <span className="text-xs font-bold px-2 py-1 bg-orange-100 text-orange-700 rounded-lg">
                    {job.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{job.client} • Deadline: {job.deadline}</p>
                <p className="font-black text-teal-600 text-sm mb-3">{job.budget}</p>
                <button className="w-full text-xs font-bold text-teal-600 border border-teal-600 py-2 rounded-lg">
                  Update Status
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}