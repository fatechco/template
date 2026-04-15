"use client";
// @ts-nocheck
import { useState, useEffect } from 'react';
import { useRouter, useLocation } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Settings, Search, Plus, Tag, User } from 'lucide-react';

const TABS = [
  { id: 'settings', label: 'Settings', icon: Settings, path: '/m/settings' },
  { id: 'find',     label: 'Find',     icon: Search,   path: '/m/find' },
  { id: 'add',      label: 'Add',      icon: Plus,     path: '/m/add', fab: true },
  { id: 'buy',      label: 'Buy',      icon: Tag,      path: '/m/buy' },
  { id: 'account',  label: 'Account',  icon: User,     path: '/m/account' },
];

export default function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiClient.get("/api/auth/session").then(setUser).catch(() => setUser(null));
  }, []);

  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const isActive = (tab) => {
    if (tab.id === 'settings') return pathname === '/m/settings';
    if (tab.id === 'account') return pathname.startsWith('/m/account') || pathname.startsWith('/m/dashboard');
    return pathname.startsWith(tab.path);
  };

  const handleTabPress = (tab) => {
    if (tab.id === 'account') {
      router.push('/m/account/guest');
    } else {
      router.push(tab.path);
    }
  };

  return (
    <>
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-200 flex items-end z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', minHeight: 64 }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab);

          if (tab.fab) {
            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.path)}
                className="flex-1 flex flex-col items-center justify-end pb-2"
                style={{ minHeight: 64 }}
              >
                <div
                  className="w-14 h-14 rounded-full bg-[#FF6B00] flex items-center justify-center -mt-5"
                  style={{ boxShadow: '0 4px 20px rgba(255,107,0,0.45)' }}
                >
                  <Icon size={26} color="white" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-medium text-[#6B7280] mt-1">{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => handleTabPress(tab)}
              className="flex-1 flex flex-col items-center justify-center py-2 transition-colors"
              style={{ minHeight: 64 }}
            >
              {tab.id === 'account' && user ? (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[10px] font-bold">
                  {getInitials(user.full_name)}
                </div>
              ) : (
                <Icon
                  size={24}
                  color={active ? '#FF6B00' : '#9CA3AF'}
                  strokeWidth={active ? 2.5 : 1.8}
                />
              )}
              <span className={`text-[10px] mt-0.5 font-medium ${active ? 'text-[#FF6B00]' : 'text-[#9CA3AF]'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}