"use client";
// @ts-nocheck
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

export default function CelebrationModal({ journey, property, onClose }) {
  const router = useRouter();
  const [moveInDate, setMoveInDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetMoveInDate = async (date) => {
    if (!date) return;
    setMoveInDate(date);
    
    try {
      setLoading(true);
      await apiClient.post('/api/v1/ai/setMoveInDate', {
        journeyId: journey.id,
        moveInDate: date
      });
    } catch (error) {
      console.error('Failed to set move-in date:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConcierge = async () => {
    try {
      // Mark modal as shown
      await apiClient.put("/api/v1/conciergejourney/", journey.id, {
        celebrationModalShown: true
      });
      router.push(`/dashboard/concierge/${journey.id}`);
    } catch (error) {
      console.error('Failed to navigate:', error);
    }
  };

  const handleRemindLater = async () => {
    try {
      await apiClient.put("/api/v1/conciergejourney/", journey.id, {
        celebrationModalDismissed: true
      });
      onClose();
    } catch (error) {
      console.error('Failed to dismiss modal:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(10, 22, 40, 0.85)' }}>
      {/* Animated Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: ['#FF6B00', '#14B8A6', '#F59E0B'][i % 3],
              left: `${Math.random() * 100}%`,
              top: '-10px',
              animation: `float ${2 + Math.random() * 2}s ease-in forwards`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(${(Math.random() - 0.5) * 200}px);
            opacity: 0;
          }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        .bounce-animation {
          animation: bounce 2s infinite;
        }
      `}</style>

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-9 max-w-md w-full">
        {/* Key Icon with Bouncing Animation */}
        <div className="flex justify-center mb-6">
          <div
            className="bounce-animation text-5xl flex items-center justify-center w-20 h-20 rounded-full"
            style={{ backgroundColor: '#F59E0B20' }}
          >
            🗝️
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Congratulations on your new home!
        </h2>

        {/* Subtitle */}
        <p className="text-center text-gray-600 text-sm leading-relaxed mb-4">
          The hard part is over. Let Kemedar handle the move, the cleaning, and the furnishing.
        </p>

        {/* Property Mini Card */}
        <div className="bg-gray-50 rounded-2xl p-3 mb-6 flex gap-3">
          <img
            src={property.featured_image}
            alt={property.title}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{property.title}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              📍 {property.city_name}, {property.district_name}
            </p>
            <span className="inline-block text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full mt-1">
              ✅ {journey.journeyType}
            </span>
          </div>
        </div>

        {/* Move-In Date Input */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            When are you planning to move in?
          </label>
          <input
            type="date"
            value={moveInDate}
            onChange={(e) => handleSetMoveInDate(e.target.value)}
            placeholder="Select your move-in date"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <p className="text-xs text-gray-500 mt-2">
            We'll send you reminders at the right time for each step
          </p>
        </div>

        {/* Primary Button */}
        <button
          onClick={handleOpenConcierge}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-2xl text-base transition-colors mb-3"
        >
          🚀 Open My Move-In Concierge
        </button>

        {/* Secondary Link */}
        <button
          onClick={handleRemindLater}
          className="w-full text-center text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          Remind me later
        </button>
      </div>
    </div>
  );
}