// app/(protected)/admin/_components/AdminGuard.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
  requiredRole?: "ADMIN" | "SUPER_ADMIN";
}

export function AdminGuard({ children, requiredRole }: AdminGuardProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const checkAccess = useCallback(async () => {
    if (!isLoaded || !user) return;

    try {
      const res = await fetch("/api/admin/auth/verify");
      const data = await res.json();

      if (data.authenticated) {
        if (requiredRole && data.admin.role !== requiredRole && data.admin.role !== "SUPER_ADMIN") {
          router.replace("/admin");
        } else {
          setIsAuthorized(true);
        }
      } else {
        router.replace("/");
      }
    } catch {
      router.replace("/");
    } finally {
      setIsChecking(false);
    }
  }, [isLoaded, user, router, requiredRole]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#b7cf8a]" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}