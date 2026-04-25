// app/(protected)/admin/users/[userId]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Ban } from "lucide-react";
import { toast } from "sonner";

import type { UserDetails, ActivityItem } from "./_types";
import {
  UserProfileCard,
  UserStatsGrid,
  UserActivityTabs,
  UserDetailsSkeleton,
} from "./_components";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [activityTimeline, setActivityTimeline] = useState<ActivityItem[]>([]);

  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${params.userId}`);
      const data = await res.json();
      setUser(data.user);
      setActivityTimeline(data.activityTimeline || []);
    } catch {
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  }, [params.userId]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const getRoleBadge = (role: string | null) => {
    const config: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      SUPER_ADMIN: { label: "Super Admin", variant: "destructive" },
      ADMIN: { label: "Admin", variant: "default" },
      LANDOWNER: { label: "Landowner", variant: "secondary" },
      FARMER: { label: "Farmer", variant: "outline" },
    };

    return config[role || ""] || { label: "No Role", variant: "outline" as const };
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 mt-12">
        <UserDetailsSkeleton />
      </div>
    );
  }

  // Not found state
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 
          flex items-center justify-center mb-4">
          <ArrowLeft className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          User not found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The user you&apos;re looking for doesn&apos;t exist or has been removed
        </p>
        <Button onClick={() => router.back()} className="rounded-xl">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const roleBadge = getRoleBadge(user.role);

  return (
    <div className="space-y-8 p-6 mt-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" className="rounded-xl">
            <Ban className="h-4 w-4 mr-2" />
            Ban
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <UserProfileCard user={user} roleBadge={roleBadge} />

        {/* Stats & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <UserStatsGrid user={user} />

          {/* Activity Tabs */}
          <UserActivityTabs activityTimeline={activityTimeline} />
        </div>
      </div>
    </div>
  );
}