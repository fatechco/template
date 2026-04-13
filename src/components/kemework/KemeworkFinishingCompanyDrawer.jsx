import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, BarChart3, Building2, Users, Briefcase, CheckCircle, DollarSign, Star, MessageSquare } from 'lucide-react';

export default function KemeworkFinishingCompanyDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: BarChart3, label: 'Company Dashboard', path: '/m/dashboard/company-dashboard' },
    { icon: Building2, label: 'Company Profile', path: '/m/dashboard/company-profile' },
    {
      icon: Users,
      label: 'My Professionals',
      path: '/m/dashboard/my-professionals',
      submenu: [
        { label: 'All Professionals', path: '/m/dashboard/my-professionals' },
        { label: 'Add Professional', path: '/m/dashboard/my-professionals/add' },
        { label: 'Performance', path: '/m/dashboard/professionals-performance' },
      ],
    },
    { icon: Briefcase, label: 'Company Services', path: '/m/dashboard/company-services' },
    { icon: Briefcase, label: 'Active Projects', path: '/m/dashboard/company-jobs' },
    { icon: CheckCircle, label: 'Completed Projects', path: '/m/dashboard/completed-company-jobs' },
    { icon: DollarSign, label: 'Revenue', path: '/m/dashboard/company-revenue' },
    { icon: Star, label: 'Reviews', path: '/m/dashboard/company-reviews' },
    { icon: MessageSquare, label: 'Messages', path: '/m/messages' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-black text-gray-900">🏢 MY COMPANY</h2>
        </div>
        <div className="p-4 space-y-1">
          {menuItems.map((item) => (
            <div key={item.label}>
              <button
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-semibold transition-colors ${
                  isActive(item.path)
                    ? 'bg-amber-100 text-amber-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                <span className="flex-1">{item.label}</span>
                {item.submenu && <ChevronRight size={18} />}
              </button>
              {item.submenu && (
                <div className="pl-8 space-y-1">
                  {item.submenu.map((sub) => (
                    <button
                      key={sub.label}
                      onClick={() => handleNavigate(sub.path)}
                      className="w-full text-left text-sm text-gray-600 px-4 py-2 hover:text-amber-700 font-medium"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}