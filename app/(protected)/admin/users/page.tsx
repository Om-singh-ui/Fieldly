// app/(protected)/admin/users/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download, UserPlus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import type { AdminUser, PaginationState, UserStats, UserFilters as UserFiltersType } from "./_types";
import {
  UserStatsCards,
  UserFilters,
  UsersTable,
  UserPagination,
  BanUserDialog,
  BulkActionDialog,
} from "./_components";

export default function AdminUsersPage() {
  const router = useRouter();
  
  // State
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [filters, setFilters] = useState<UserFiltersType>({
    search: "",
    role: "all",
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // Dialog states
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [bulkAction, setBulkAction] = useState("");
  const [banReason, setBanReason] = useState("");

  // Data fetching
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.role !== "all" && { role: filters.role }),
        ...(filters.status !== "all" && {
          isOnboarded: filters.status === "onboarded" ? "true" : "false",
        }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch users");

      setUsers(data.users || []);
      setStats(data.stats);
      setPagination({
        ...data.pagination,
        hasNext: data.pagination.page < data.pagination.totalPages,
        hasPrev: data.pagination.page > 1,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // API Actions
  async function handleBulkAction() {
    if (!bulkAction || selectedUsers.length === 0) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: selectedUsers,
          action: bulkAction,
          data: bulkAction === "bulk_update_role" ? { role: "FARMER" } : {},
        }),
      });

      if (!res.ok) throw new Error();

      toast.success(`Successfully updated ${selectedUsers.length} users`);
      setSelectedUsers([]);
      setShowBulkDialog(false);
      setBulkAction("");
      fetchUsers();
    } catch {
      toast.error("Failed to perform bulk action");
    }
  }

  async function handleBanUser() {
    if (!selectedUser || !banReason.trim()) {
      toast.error("Please provide a reason for the ban");
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}/ban`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: banReason }),
      });

      if (!res.ok) throw new Error();

      toast.success("User banned successfully");
      setShowBanDialog(false);
      setSelectedUser(null);
      setBanReason("");
      fetchUsers();
    } catch {
      toast.error("Failed to ban user");
    }
  }

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    setSelectedUsers(checked ? users.map((u) => u.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedUsers((prev) =>
      checked ? [...prev, id] : prev.filter((uid) => uid !== id)
    );
  };

  // Navigation handlers
  const handleViewUser = (id: string) => router.push(`/admin/users/${id}`);
  const handleEditUser = (user: AdminUser) => router.push(`/admin/users/${user.id}/edit`);
  const handleDeleteUser = (user: AdminUser) => toast.info(`Delete functionality coming soon for ${user.name}`);

  // Dialog handlers
  const handleOpenBanDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setBanReason("");
    setShowBanDialog(true);
  };

  return (
    <div className="space-y-8 p-6 mt-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">Manage platform users</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => router.push("/admin/users/new")}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && <UserStatsCards stats={stats} />}

      {/* Filters */}
      <UserFilters
        filters={filters}
        selectedCount={selectedUsers.length}
        onFiltersChange={setFilters}
        onFetch={fetchUsers}
        onBulkAction={() => setShowBulkDialog(true)}
      />

      {/* Users Table */}
      <UsersTable
        users={users}
        selectedUsers={selectedUsers}
        loading={loading}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onView={handleViewUser}
        onEdit={handleEditUser}
        onBan={handleOpenBanDialog}
        onDelete={handleDeleteUser}
      />

      {/* Pagination */}
      <UserPagination
        pagination={pagination}
        onPageChange={(page) => setPagination({ ...pagination, page })}
      />

      {/* Dialogs */}
      <BulkActionDialog
        open={showBulkDialog}
        onOpenChange={setShowBulkDialog}
        count={selectedUsers.length}
        bulkAction={bulkAction}
        onBulkActionChange={setBulkAction}
        onConfirm={handleBulkAction}
      />

      <BanUserDialog
        open={showBanDialog}
        onOpenChange={setShowBanDialog}
        selectedUser={selectedUser}
        banReason={banReason}
        onBanReasonChange={setBanReason}
        onConfirm={handleBanUser}
      />
    </div>
  );
}