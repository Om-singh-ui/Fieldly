// app/(protected)/admin/_components/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Home,
  FileText,
  CreditCard,
  AlertTriangle,
  BarChart,
  Settings,
  Shield,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  adminRole: string | null;
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Listings", href: "/admin/listings", icon: Home },
  { name: "Applications", href: "/admin/applications", icon: FileText },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Disputes", href: "/admin/disputes", icon: AlertTriangle },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: History },
  { name: "Security", href: "/admin/security", icon: Shield },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ adminRole }: AdminSidebarProps) {
  const pathname = usePathname();
  const isSuperAdmin = adminRole === "SUPER_ADMIN";

  return (
    <aside className="fixed top-16 left-0 z-30 hidden h-[calc(100vh-4rem)] w-64 border-r bg-white dark:bg-gray-900 lg:block overflow-y-auto">
      <nav className="flex flex-col h-full p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          
          if ((item.name === "Settings" || item.name === "Security") && !isSuperAdmin) {
            return null;
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#b7cf8a] text-black"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}