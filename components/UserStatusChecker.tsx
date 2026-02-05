// components/UserStatusChecker.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserStatusChecker() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user?.id) {
      const checkAndRedirect = async () => {
        try {
          const response = await fetch(`/api/user/status?userId=${user.id}`);
          if (response.ok) {
            const data = await response.json();
            
            if (data?.user) {
              if (!data.user.role) {
                router.push('/onboarding/role');
              } else if (!data.user.isOnboarded) {
                const onboardingPath = data.user.role === 'FARMER' 
                  ? '/onboarding/farmer' 
                  : '/onboarding/landowner';
                router.push(onboardingPath);
              } else {
                const dashboardPath = data.user.role === 'FARMER'
                  ? '/farmer/dashboard'
                  : '/landowner/dashboard';
                router.push(dashboardPath);
              }
            }
          }
        } catch (error) {
          console.error('Error checking user status:', error);
        }
      };

      checkAndRedirect();
    }
  }, [isLoaded, user, router]);

  return null; // This component doesn't render anything
}