import React from "react";

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
