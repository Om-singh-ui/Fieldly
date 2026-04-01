// contexts/DashboardContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface DashboardContextType {
  isRedirecting: boolean;
  setRedirecting: (value: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const pathname = usePathname();
  const isResettingRef = useRef(false);

  // Global reset when reaching final destination (works across all components)
  useEffect(() => {
    const isFinalDestination = 
      pathname === "/farmer/dashboard" || 
      pathname === "/landowner/dashboard" ||
      pathname === "/onboarding/role" ||
      pathname === "/onboarding/farmer" ||
      pathname === "/onboarding/landowner";
    
    // Only reset if we're redirecting and reached final destination, and not already resetting
    if (isRedirecting && isFinalDestination && !isResettingRef.current) {
      isResettingRef.current = true;
      // Use setTimeout to avoid cascading renders
      setTimeout(() => {
        setIsRedirecting(false);
        isResettingRef.current = false;
      }, 0);
    }
  }, [pathname, isRedirecting]);

  return (
    <DashboardContext.Provider value={{ isRedirecting, setRedirecting: setIsRedirecting }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}