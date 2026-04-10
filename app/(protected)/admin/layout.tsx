// app/(protected)/admin/layout.tsx

import { requireAdmin } from "@/lib/server/admin-guard";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./_components/AdminSidebar";
import { AdminHeader } from "./_components/AdminHeader";
import { AdminGuard } from "./_components/AdminGuard";

async function verifyAdminAccess() {
  try {
    const admin = await requireAdmin();
    console.log("[AdminLayout] ✅ Admin verified:", admin.email, admin.role);
    return admin;
  } catch (error) {
    console.error("[AdminLayout] ❌ Admin verification failed:", error);
    redirect("/");
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await verifyAdminAccess();

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