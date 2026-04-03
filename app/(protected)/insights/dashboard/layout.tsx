"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // 🔐 Replace with your auth logic (Clerk / custom)
  const isAuthenticated = true; // TODO

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-[#f9fafb] flex">
      {children}
    </div>
  );
}