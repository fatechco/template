import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function AccountTabHandler() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  useEffect(() => {
    const handleAccountTab = async () => {
      setIsChecking(true);

      // Check if user is authenticated
      if (!user) {
        // Not logged in → go to guest page
        navigate('/m/account/guest');
      } else {
        // Logged in → go to dashboard
        // The dashboard will read the user role and show appropriate menu
        navigate('/m/dashboard');
      }

      setIsChecking(false);
    };

    if (!isChecking) {
      handleAccountTab();
    }
  }, [user, navigate, isChecking]);

  return null;
}