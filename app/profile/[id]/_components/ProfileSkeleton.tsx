"use client";

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">

      {/* HEADER SKELETON */}
      <div className="rounded-[32px] border p-6 flex items-center gap-5">

        <div className="h-16 w-16 rounded-full bg-muted" />

        <div className="flex-1 space-y-2">
          <div className="h-5 w-48 bg-muted rounded" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>

        <div className="flex gap-2">
          <div className="h-10 w-24 bg-muted rounded-full" />
          <div className="h-10 w-24 bg-muted rounded-full" />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-muted rounded-xl" />
        ))}
      </div>

      {/* LISTINGS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-xl" />
        ))}
      </div>
    </div>
  );
}