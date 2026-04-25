// app/(protected)/admin/users/[userId]/_components/UserActivityTabs.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History } from "lucide-react";
import { format } from "date-fns";
import type { ActivityItem } from "../_types";

interface UserActivityTabsProps {
  activityTimeline: ActivityItem[];
}

export function UserActivityTabs({ activityTimeline }: UserActivityTabsProps) {
  const tabs = [
    { value: "activity", label: "Activity" },
    { value: "applications", label: "Applications" },
    { value: "listings", label: "Listings" },
    { value: "leases", label: "Leases" },
    { value: "payments", label: "Payments" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <Card className="rounded-3xl overflow-hidden
        bg-white/80 dark:bg-gray-900/80
        backdrop-blur-xl
        border border-gray-200/50 dark:border-gray-700/50
        shadow-lg">
        <Tabs defaultValue="activity" className="w-full">
          <CardHeader className="pb-0">
            <TabsList className="bg-gray-100/50 dark:bg-gray-800/50 
              rounded-2xl p-1 gap-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-xl px-4 py-2 text-sm font-medium
                    data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700
                    data-[state=active]:shadow-sm
                    transition-all duration-200"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </CardHeader>
          
          <CardContent className="pt-6">
            <TabsContent value="activity" className="space-y-3 mt-0">
              {activityTimeline.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No activity yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Activity will appear here when the user performs actions
                  </p>
                </div>
              ) : (
                activityTimeline.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-4 
                      bg-gray-50/50 dark:bg-gray-800/50
                      hover:bg-gray-100/50 dark:hover:bg-gray-800/80
                      rounded-2xl transition-colors duration-200
                      border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700
                      flex items-center justify-center shrink-0 mt-0.5">
                      <History className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {format(new Date(activity.createdAt), "MMM d, yyyy • h:mm a")}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="applications" className="mt-0">
              <EmptyTabState icon={History} label="Applications" />
            </TabsContent>
            
            <TabsContent value="listings" className="mt-0">
              <EmptyTabState icon={History} label="Listings" />
            </TabsContent>
            
            <TabsContent value="leases" className="mt-0">
              <EmptyTabState icon={History} label="Leases" />
            </TabsContent>
            
            <TabsContent value="payments" className="mt-0">
              <EmptyTabState icon={History} label="Payments" />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </motion.div>
  );
}

function EmptyTabState({ 
  icon: Icon, 
  label 
}: { 
  icon: React.ElementType; 
  label: string;
}) {
  return (
    <div className="text-center py-12">
      <Icon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
      <p className="text-gray-500 dark:text-gray-400">{label} will appear here</p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
        This feature is coming soon
      </p>
    </div>
  );
}