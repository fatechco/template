"use client";
// @ts-nocheck
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { X, ChevronDown } from 'lucide-react';
import { useModules } from '@/lib/module-context';

const MODULES = [
  { key: 'kemedar', emoji: '🏠', name: 'Kemedar', path: '/m/dashboard' },
  { key: 'kemetro', emoji: '📦', name: 'Kemetro', path: '/m/dashboard/kemetro-buyer' },
  { key: 'kemework', emoji: '✏️', name: 'Kemework', path: '/m/dashboard/kemework-customer' },
];

const ROLES = [
  { label: 'Buyer', path: '/m/dashboard' },
  { label: 'Seller', path: '/m/dashboard/seller-dashboard' },
  { label: 'Agent', path: '/m/dashboard/agent' },
  { label: 'Agency', path: '/m/dashboard/agency' },
  { label: 'Developer', path: '/m/dashboard/developer' },
  { label: 'Professional', path: '/m/dashboard/pro-dashboard' },
  { label: 'Company', path: '/m/dashboard/company-dashboard' },
  { label: 'Franchise Owner', path: '/m/dashboard/franchise' },
];

const ROLE_MENUS = {
  kemedar: {
    Buyer: [
      { label: 'My Properties', path: '/m/dashboard/my-properties' },
      { label: 'Saved Properties', path: '/m/dashboard/favorites' },
      { label: 'Buy Requests', path: '/m/dashboard/buyer-organizer' },
      { label: 'Messages', path: '/m/dashboard/messages' },
    ],
    Seller: [
      { label: 'My Properties', path: '/m/dashboard/my-properties' },
      { label: 'Property Requests', path: '/m/dashboard/seller-organizer' },
      { label: 'Analytics', path: '/m/dashboard/performance' },
      { label: 'Messages', path: '/m/dashboard/messages' },
    ],
    Agent: [
      { label: 'My Listings', path: '/m/dashboard/my-properties' },
      { label: 'Clients', path: '/m/dashboard/clients' },
      { label: 'Appointments', path: '/m/dashboard/appointments' },
      { label: 'Analytics', path: '/m/dashboard/performance' },
    ],
    Agency: [
      { label: 'My Agents', path: '/m/dashboard/my-agents' },
      { label: 'Properties', path: '/m/dashboard/my-properties' },
      { label: 'Team Analytics', path: '/m/dashboard/performance' },
      { label: 'Messages', path: '/m/dashboard/messages' },
    ],
    Developer: [
      { label: 'My Projects', path: '/m/dashboard/my-projects' },
      { label: 'Project Sales', path: '/m/dashboard/project-sales' },
      { label: 'Analytics', path: '/m/dashboard/performance' },
      { label: 'Messages', path: '/m/dashboard/messages' },
    ],
  },
  kemetro: {
    Buyer: [
      { label: 'My Orders', path: '/m/dashboard/kemetro-orders' },
      { label: 'Wishlist', path: '/m/dashboard/wishlist' },
      { label: 'Addresses', path: '/m/dashboard/addresses' },
      { label: 'Messages', path: '/m/dashboard/messages' },
    ],
    Seller: [
      { label: 'My Orders', path: '/m/dashboard/seller-orders' },
      { label: 'My Products', path: '/m/dashboard/seller-products' },
      { label: 'Earnings', path: '/m/dashboard/seller-earnings' },
      { label: 'Analytics', path: '/m/dashboard/seller-analytics' },
    ],
  },
  kemework: {
    'Buyer': [
      { label: 'My Tasks', path: '/m/dashboard/kemework-tasks' },
      { label: 'My Professionals', path: '/m/dashboard/my-professionals' },
      { label: 'Messages', path: '/m/dashboard/messages' },
      { label: 'Reviews', path: '/m/dashboard/my-reviews' },
    ],
    'Professional': [
      { label: 'Available Tasks', path: '/m/dashboard/available-tasks' },
      { label: 'My Jobs', path: '/m/dashboard/my-jobs' },
      { label: 'Earnings', path: '/m/dashboard/pro-earnings' },
      { label: 'Reviews', path: '/m/dashboard/pro-reviews' },
    ],
    'Company': [
      { label: 'My Jobs', path: '/m/dashboard/company-jobs' },
      { label: 'My Professionals', path: '/m/dashboard/my-professionals' },
      { label: 'Revenue', path: '/m/dashboard/company-revenue' },
      { label: 'Reviews', path: '/m/dashboard/company-reviews' },
    ],
  },
};

export default function ModuleSwitcher({ isOpen, onClose }) {
  const router = useRouter();
  const { activeGlobalModules } = useModules();
  const activeModule = activeGlobalModules[0] || 'kemedar';
  const [currentRole, setCurrentRole] = useState('Buyer');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiClient.get("/api/auth/session"),
  });

  const handleNavigate = (path, role) => {
    if (role) setCurrentRole(role);
    router.push(path);
    onClose();
  };

  if (!isOpen) return null;

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  const firstName = user?.full_name?.split(' ')[0] || 'User';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
      <div className="w-full bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header - Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-end">
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {/* User Profile Card */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-lg">
                {initials}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">{firstName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button className="text-xs text-blue-600 font-bold hover:underline">Edit Profile →</button>
          </div>

          {/* Current Role with Badge */}
          <div className="flex items-center gap-2 px-4 py-2">
            <span className="inline-block px-3 py-1 bg-gray-700 text-white text-xs font-bold rounded-full">
              {currentRole}
            </span>
          </div>

          {/* Role Menu for Current Module */}
          {ROLE_MENUS[activeModule]?.[currentRole] && (
            <div className="space-y-1">
              {ROLE_MENUS[activeModule][currentRole].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavigate(item.path)}
                  className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm text-gray-900"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* Account Section */}
          <div className="border-t border-gray-200 pt-2">
            <button
              onClick={() => handleNavigate('/m/dashboard/profile')}
              className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm text-gray-900"
            >
              Account
            </button>
          </div>

          {/* Role Selector Dropdown */}
          <div className="relative pb-2">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-left text-sm font-medium text-gray-900 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span>{currentRole}</span>
              <ChevronDown size={16} className={`transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showRoleDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {ROLES.map((role, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleNavigate(role.path, role.label);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium border-b border-gray-100 last:border-0 transition-colors ${
                      currentRole === role.label
                        ? 'bg-blue-100 text-blue-900 font-bold'
                        : 'text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}