// app/(protected)/admin/users/[userId]/_components/UserDetailsSkeleton.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function UserDetailsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card skeleton */}
        <Card className="rounded-3xl overflow-hidden
          bg-white/80 dark:bg-gray-900/80
          border border-gray-200/50 dark:border-gray-700/50">
          <CardHeader className="pb-4">
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="h-28 w-28 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-3">
              <div className="flex items-center justify-between px-2">
                <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </div>
              <div className="flex items-center justify-between px-2">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Activity skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="rounded-2xl overflow-hidden
                bg-white/80 dark:bg-gray-900/80
                border border-gray-200/50 dark:border-gray-700/50">
                <CardContent className="p-5 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-7 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="rounded-3xl overflow-hidden
            bg-white/80 dark:bg-gray-900/80
            border border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 p-4">
                  <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}