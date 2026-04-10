// hooks/admin/useAdminAuth.ts
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useAdminAuth() {
  const { user, isLoaded } = useUser();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function verifyAdmin() {
      if (!isLoaded || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/admin/auth/verify");
        const data = await res.json();

        if (data.authenticated) {
          setAdmin(data.admin);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Admin verification failed:", error);
      } finally {
        setIsLoading(false);
      }
    }

    verifyAdmin();
  }, [isLoaded, user]);

  const logout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    admin,
    isLoading,
    isAuthenticated,
    logout,
  };
}