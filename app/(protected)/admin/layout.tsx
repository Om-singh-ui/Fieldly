// app/(protected)/admin/layout.tsx

// Force dynamic rendering to avoid static generation errors
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { requireAdmin } from "@/lib/server/admin-guard";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./_components/AdminSidebar";
import { AdminHeader } from "./_components/AdminHeader";
import { AdminGuard } from "./_components/AdminGuard";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("[AdminLayout] Starting admin verification...");
  
  let admin;
  
  try {
    admin = await requireAdmin();
    console.log("[AdminLayout] ✅ Admin verified:", admin.email, admin.role);
  } catch (error) {
    console.error("[AdminLayout] ❌ Admin verification failed:", error);
    redirect("/");
  }

  if (!admin) {
    console.error("[AdminLayout] ❌ Admin is null after verification");
    redirect("/");
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <AdminHeader admin={admin} />
        <div className="flex">
          <AdminSidebar adminRole={admin.role} />
          <main className="flex-1 lg:pl-64">
            <div className="p-4 lg:p-8 pt-20">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}