"use client";
// @ts-nocheck
import { Menu, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export default function MobileDashboardTopBar({ title, onMenuClick }) {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiClient.get("/api/auth/session"),
  });

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div 
      className="sticky top-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between px-4"
      style={{ height: 56 }}
    >
      {/* Left: Hamburger */}
      <button 
        onClick={onMenuClick}
        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Menu size={24} className="text-gray-900" />
      </button>

      {/* Center: Breadcrumb */}
      <div className="flex-1 text-center px-4">
        <div className="flex items-center justify-center gap-1">
          <span className="text-red-600 font-black text-base">K</span>
          <span className="text-gray-400 text-sm">/</span>
          <span className="text-gray-900 font-bold text-sm truncate">{title}</span>
        </div>
      </div>

      {/* Right: Search + Avatar */}
      <div className="flex items-center gap-2">
        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <Search size={22} className="text-gray-700" />
        </button>
        <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
      </div>
    </div>
  );
}