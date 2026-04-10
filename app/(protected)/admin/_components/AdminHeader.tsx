// app/(protected)/admin/_components/AdminHeader.tsx
"use client";

import { UserButton } from "@clerk/nextjs";
import { Shield, Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebar } from "./AdminSidebar";

interface AdminHeaderProps {
  admin: {
    name: string;
    email: string;
    role: string | null;
  };
}

export function AdminHeader({ admin }: AdminHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 mt-14 border-b bg-white/95 backdrop-blur-md dark:bg-gray-900/95">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <AdminSidebar adminRole={admin.role} />
            </SheetContent>
          </Sheet>

          <Shield className="h-6 w-6 text-[#b7cf8a]" />
          <span className="font-semibold text-lg hidden sm:block">Fieldly Admin</span>
          {admin.role === "SUPER_ADMIN" && (
            <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
              Super Admin
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-64 pl-9 bg-gray-50 dark:bg-gray-800"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{admin.name}</p>
              <p className="text-xs text-gray-500">{admin.email}</p>
            </div>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}