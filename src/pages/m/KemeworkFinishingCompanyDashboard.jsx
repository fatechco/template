import { useState } from 'react';
import MobileTopBar from '@/components/mobile-v2/MobileTopBar';
import ModuleSwitcher from '@/components/mobile-v2/ModuleSwitcher';
import KemeworkFinishingCompanyDrawer from '@/components/kemework/KemeworkFinishingCompanyDrawer';
import { Menu, Users, Briefcase } from 'lucide-react';

export default function KemeworkFinishingCompanyDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showModuleSwitcher, setShowModuleSwitcher] = useState(false);

  const stats = {
    professionals: 8,
    activeJobs: 5,
    thisMonth: 24,
    revenue: 12500,
    rating: 4.9,
    pendingReviews: 3,
  };

  const professionals = [
    { id: 1, name: 'Ahmed Hassan', role: 'Plumber', active: 2, rating: 4.8 },
    { id: 2, name: 'Fatima Al-Zahra', role: 'Electrician', active: 1, rating: 4.9 },
    { id: 3, name: 'Mohammad Ali', role: 'Painter', active: 2, rating: 4.7 },
  ];

  const pendingJobs = [
    { id: 1, title: 'Full kitchen renovation', location: 'Maadi', budget: '$1200', posted: '2h ago' },
    { id: 2, title: 'Bathroom remodeling', location: 'Heliopolis', budget: '$900', posted: '4h ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileTopBar
        title="Kemework"
        rightAction={
          <button onClick={() => setShowModuleSwitcher(true)} className="p-1">
            <Menu size={22} className="text-gray-700" />
          </button>
        }
      />
      <KemeworkFinishingCompanyDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <ModuleSwitcher isOpen={showModuleSwitcher} onClose={() => setShowModuleSwitcher(false)} />

      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Finishing Co</p>
            <p className="text-lg font-black text-gray-900">Elite Construction</p>
          </div>
          <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
            Finishing Co
          </div>
        </div>

        {/* Company Status Card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-lg">
              🏢
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-sm">Elite Construction</p>
              <p className="text-xs text-gray-500">
                <Users size={12} className="inline mr-1" />
                {stats.professionals} Professionals • ✅ Verified
              </p>
            </div>
          </div>
          <button className="w-full text-xs font-bold text-amber-600 py-2 rounded-lg border border-amber-200">
            Manage Company →
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-2xl font-black text-gray-900">{stats.professionals}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">Total Pro</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-2xl font-black text-gray-900">{stats.activeJobs}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">Active Jobs</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-2xl font-black text-gray-900">{stats.thisMonth}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">This Month</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-2xl font-black text-gray-900">${stats.revenue}k</p>
            <p className="text-xs text-gray-500 font-medium mt-1">Revenue</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-2xl font-black text-gray-900">⭐ {stats.rating}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">Avg Rating</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <p className="text-2xl font-black text-orange-600">{stats.pendingReviews}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">Pending Reviews</p>
          </div>
        </div>

        {/* Pending Jobs */}
        <div>
          <p className="text-base font-black text-gray-900 mb-3">Pending Job Requests</p>
          <div className="space-y-3">
            {pendingJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl p-4 border border-gray-200">
                <p className="font-bold text-gray-900 text-sm">{job.title}</p>
                <p className="text-xs text-gray-500 mt-1">{job.location} • {job.posted}</p>
                <p className="font-black text-amber-600 text-sm mt-2">{job.budget}</p>
                <button className="w-full mt-3 text-xs font-bold text-white bg-amber-600 py-2 rounded-lg">
                  Assign Professional
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Professionals Performance */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-base font-black text-gray-900">Team Performance</p>
            <button className="text-xs font-bold text-amber-600">View All →</button>
          </div>
          <div className="space-y-2">
            {professionals.map((pro) => (
              <div key={pro.id} className="bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-900">{pro.name}</p>
                  <p className="text-xs text-gray-500">{pro.role}</p>
                </div>
                <p className="text-xs font-bold text-gray-900">{pro.active} jobs</p>
                <p className="text-xs font-bold text-amber-600">⭐ {pro.rating}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}