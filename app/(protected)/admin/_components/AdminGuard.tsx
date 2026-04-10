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
  const [error, setError] = useState<string | null>(null);

  const checkAccess = useCallback(async () => {
    if (!isLoaded) return;

    if (!user) {
      console.log("[AdminGuard] No user found, redirecting to sign-in");
      router.replace("/sign-in");
      return;
    }

    try {
      console.log("[AdminGuard] Checking admin access...");
      const res = await fetch("/api/admin/auth/verify");
      const data = await res.json();

      console.log("[AdminGuard] Verify response:", {
        status: res.status,
        isAdmin: data.isAdmin,
        role: data.role,
      });

      if (res.ok && data.isAdmin) {
        // Check required role if specified
        if (
          requiredRole &&
          data.role !== requiredRole &&
          data.role !== "SUPER_ADMIN"
        ) {
          console.log("[AdminGuard] Insufficient role, redirecting to /admin");
          router.replace("/admin");
        } else {
          console.log("[AdminGuard] ✅ Access granted");
          setIsAuthorized(true);
        }
      } else {
        console.log("[AdminGuard] ❌ Not authorized, redirecting to /");
        router.replace("/");
      }
    } catch (err) {
      console.error("[AdminGuard] Error checking access:", err);
      setError("Failed to verify access");
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
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#b7cf8a]" />
        <p className="text-sm text-gray-500">Verifying access...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-blue-500 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
