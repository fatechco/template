"use client";
// @ts-nocheck
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export default function AccountTabHandler() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiClient.get("/api/auth/session"),
    retry: false,
  });

  useEffect(() => {
    const handleAccountTab = async () => {
      setIsChecking(true);

      // Check if user is authenticated
      if (!user) {
        // Not logged in → go to guest page
        router.push('/m/account/guest');
      } else {
        // Logged in → go to dashboard
        // The dashboard will read the user role and show appropriate menu
        router.push('/m/dashboard');
      }

      setIsChecking(false);
    };

    if (!isChecking) {
      handleAccountTab();
    }
  }, [user, navigate, isChecking]);

  return null;
}