// app/(protected)/admin/users/[userId]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  History,
  Home,
  FileText,
  CreditCard,
  Sprout,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

// Type definitions
interface UserDetails {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  state?: string | null;
  district?: string | null;
  imageUrl?: string | null;
  role: string | null;
  isOnboarded: boolean;
  createdAt: string;
  _count?: {
    applications: number;
    listingsOwned: number;
    leasesAsFarmer: number;
    leasesAsOwner: number;
    payments: number;
  };
}

interface ActivityItem {
  id: string;
  action: string;
  createdAt: string;
}

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          <div className="lg:col-span-2 h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 mx-auto text-gray-400" />
        <h2 className="text-xl font-semibold mt-4">User not found</h2>
        <Button className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const roleBadge = getRoleBadge(user.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive">
            <Ban className="h-4 w-4 mr-2" />
            Ban
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {user.imageUrl ? (
                  <Image 
                    src={user.imageUrl} 
                    alt={user.name} 
                    width={96} 
                    height={96} 
                    className="h-24 w-24 object-cover" 
                  />
                ) : (
                  <User className="h-12 w-12 text-gray-500" />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{user.phone}</span>
                </div>
              )}
              {(user.state || user.district) && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {[user.district, user.state].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  Joined {format(new Date(user.createdAt), "MMMM d, yyyy")}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Role</span>
                <Badge variant={roleBadge.variant}>{roleBadge.label}</Badge>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-500">Status</span>
                {user.isOnboarded ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Onboarded
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <p className="text-sm text-gray-500">Applications</p>
                </div>
                <p className="text-2xl font-bold">{user._count?.applications || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Home className="h-4 w-4 text-green-500" />
                  <p className="text-sm text-gray-500">Listings</p>
                </div>
                <p className="text-2xl font-bold">{user._count?.listingsOwned || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sprout className="h-4 w-4 text-purple-500" />
                  <p className="text-sm text-gray-500">Leases</p>
                </div>
                <p className="text-2xl font-bold">
                  {(user._count?.leasesAsFarmer || 0) + (user._count?.leasesAsOwner || 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="h-4 w-4 text-amber-500" />
                  <p className="text-sm text-gray-500">Payments</p>
                </div>
                <p className="text-2xl font-bold">{user._count?.payments || 0}</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Card>
            <Tabs defaultValue="activity" className="w-full">
              <CardHeader className="pb-0">
                <TabsList>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                  <TabsTrigger value="listings">Listings</TabsTrigger>
                  <TabsTrigger value="leases">Leases</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-4">
                <TabsContent value="activity" className="space-y-3">
                  {activityTimeline.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">No activity yet</p>
                  ) : (
                    activityTimeline.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <History className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(activity.createdAt), "MMM d, yyyy • h:mm a")}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                <TabsContent value="applications">
                  <p className="text-center py-8 text-gray-500">Applications will appear here</p>
                </TabsContent>
                <TabsContent value="listings">
                  <p className="text-center py-8 text-gray-500">Listings will appear here</p>
                </TabsContent>
                <TabsContent value="leases">
                  <p className="text-center py-8 text-gray-500">Leases will appear here</p>
                </TabsContent>
                <TabsContent value="payments">
                  <p className="text-center py-8 text-gray-500">Payments will appear here</p>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}