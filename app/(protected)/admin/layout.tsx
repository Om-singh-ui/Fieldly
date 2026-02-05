"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId, isLoaded } = useAuth();

  // If not loaded yet, show loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not authenticated, redirect to sign-in
  if (!userId) {
    redirect("/sign-in");
  }

  // TODO: Check if user is admin

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header/navigation could go here */}
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}