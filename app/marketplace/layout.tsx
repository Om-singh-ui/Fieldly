// app/(marketplace)/layout.tsx
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Marketplace - Fieldly",
  description: "Browse and bid on agricultural land listings",
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </main>
    </div>
  );
}