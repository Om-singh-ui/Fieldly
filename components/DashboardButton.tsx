"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ArrowUpRight } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";

interface DashboardButtonProps {
  variant?: "desktop" | "mobile";
  onClose?: () => void;
}

export function DashboardButton({
  variant = "desktop",
  onClose,
}: DashboardButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { isRedirecting, setRedirecting } = useDashboard();

  // prevent stale state issues
  const redirectingRef = useRef(isRedirecting);

  useEffect(() => {
    redirectingRef.current = isRedirecting;
  }, [isRedirecting]);

  // reset loading when reaching final pages
  useEffect(() => {
    const isFinalDestination =
      pathname === "/farmer/dashboard" ||
      pathname === "/landowner/dashboard" ||
      pathname === "/onboarding/role" ||
      pathname === "/onboarding/farmer" ||
      pathname === "/onboarding/landowner";

    if (redirectingRef.current && isFinalDestination) {
      setRedirecting(false);
    }
  }, [pathname, setRedirecting]);

  const handleDashboardRedirect = async () => {
    if (!isSignedIn || redirectingRef.current) return;

    setRedirecting(true);

    try {
      // call API instead of navigating to /post-auth
      const res = await fetch("/api/post-auth-check", {
        cache: "no-store",
      });

      const data = await res.json();

      let destination = "/";

      // not signed in
      if (data.needsAuth) {
        destination = "/sign-in";
      }
      // new user
      else if (!data.exists || data.needsOnboarding) {
        destination = "/onboarding/role";
      }
      // existing user
      else {
        const { role, isOnboarded } = data.user;

        if (!role) {
          destination = "/onboarding/role";
        } else if (!isOnboarded) {
          destination =
            role === "FARMER"
              ? "/onboarding/farmer"
              : "/onboarding/landowner";
        } else {
          destination =
            role === "FARMER"
              ? "/farmer/dashboard"
              : "/landowner/dashboard";
        }
      }

      // direct navigation (no /post-auth ever)
      router.replace(destination);

      if (onClose) onClose();

      // safety reset
      setTimeout(() => {
        if (redirectingRef.current) {
          setRedirecting(false);
        }
      }, 5000);
    } catch (error) {
      console.error("Dashboard redirect error:", error);
      setRedirecting(false);
    }
  };

  // ================= MOBILE =================
  if (variant === "mobile") {
    return (
      <button
        onClick={handleDashboardRedirect}
        disabled={isRedirecting}
        aria-busy={isRedirecting}
        className="
          flex-1 flex items-center justify-center gap-2
          rounded-full
          bg-[#b7cf8a]
          py-3
          text-sm font-medium text-black
          hover:bg-[#a8c07a]
          transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {isRedirecting ? (
          <span className="inline-block size-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            Go to Dashboard
            <ArrowUpRight className="h-4 w-4" />
          </>
        )}
      </button>
    );
  }

  // ================= DESKTOP =================
  return (
    <button
      onClick={handleDashboardRedirect}
      disabled={isRedirecting}
      aria-busy={isRedirecting}
      className="
        flex items-center justify-center
        rounded-full
        bg-[#b7cf8a]
        px-6 py-2.5
        text-sm font-medium
        min-w-[44px]
        hover:bg-[#a8c07a]
        transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      {isRedirecting ? (
        <span className="inline-block size-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
      ) : (
        <Image
          src="/icons/dashb.png"
          alt="Dashboard"
          width={18}
          height={18}
          className="object-contain"
        />
      )}
    </button>
  );
}