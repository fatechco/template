import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

export default function QuickPreviewPopup({ user, isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen || !user) return null;

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  const firstName = user?.full_name?.split(' ')[0] || 'User';

  const handleOpenDashboard = () => {
    navigate('/m/dashboard');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Popup Card */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-3">
            {initials}
          </div>
          <h2 className="text-xl font-black text-gray-900">Welcome, {firstName}!</h2>
          <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-black text-blue-600">3</p>
            <p className="text-xs text-gray-600 font-medium mt-1">Listings</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-black text-green-600">12</p>
            <p className="text-xs text-gray-600 font-medium mt-1">Saved</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-black text-purple-600">28</p>
            <p className="text-xs text-gray-600 font-medium mt-1">Views</p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleOpenDashboard}
          className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-colors active:scale-95 flex items-center justify-center gap-2"
        >
          Open Dashboard →
        </button>
      </div>
    </div>
  );
}