import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Camera, ChevronDown } from 'lucide-react';

export default function MobileDashboardProfile() {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const [expanded, setExpanded] = useState({
    personal: true,
    location: false,
    social: false,
    password: false,
    notifications: false,
  });

  const [formData, setFormData] = useState({
    firstName: user?.full_name?.split(' ')[0] || '',
    lastName: user?.full_name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    whatsapp: '',
    bio: '',
    notifications: {
      matches: true,
      messages: true,
      promotions: false,
      updates: true,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => alert('Profile updated successfully!'),
  });

  const handleSave = () => {
    updateMutation.mutate({
      full_name: `${formData.firstName} ${formData.lastName}`.trim(),
    });
  };

  const toggleSection = (section) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Cover & Avatar */}
      <div className="relative">
        <div className="h-24 bg-gradient-to-r from-orange-400 to-orange-500 relative">
          <button className="absolute top-2 right-2 bg-white/80 p-2 rounded-lg hover:bg-white transition-colors">
            <Camera size={18} className="text-orange-600" />
          </button>
        </div>

        <div className="px-4 -mt-10 mb-4 relative z-10">
          <div className="w-20 h-20 bg-white rounded-full border-4 border-orange-600 flex items-center justify-center text-3xl shadow-lg">
            👤
          </div>
          <button className="absolute bottom-0 right-4 bg-orange-600 text-white p-2 rounded-full shadow-lg hover:bg-orange-700 transition-colors">
            <Camera size={16} />
          </button>
        </div>
      </div>

      {/* View Public Profile Link */}
      <div className="px-4 pb-4">
        <button className="text-orange-600 font-bold text-xs hover:underline">
          View Public Profile →
        </button>
      </div>

      {/* Form Sections */}
      <div className="px-4 space-y-2">
        {/* Personal Information */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection('personal')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="font-bold text-gray-900">Personal Information</span>
            <ChevronDown
              size={18}
              className={`transition-transform ${expanded.personal ? 'rotate-180' : ''}`}
            />
          </button>

          {expanded.personal && (
            <div className="border-t border-gray-200 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                disabled
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
              <input
                type="tel"
                placeholder="WhatsApp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
              <textarea
                placeholder="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 min-h-20"
              />
            </div>
          )}
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection('notifications')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="font-bold text-gray-900">Notifications</span>
            <ChevronDown
              size={18}
              className={`transition-transform ${expanded.notifications ? 'rotate-180' : ''}`}
            />
          </button>

          {expanded.notifications && (
            <div className="border-t border-gray-200 p-4 space-y-3">
              {Object.entries(formData.notifications).map(([key, value]) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, [key]: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <button
          onClick={handleSave}
          className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}