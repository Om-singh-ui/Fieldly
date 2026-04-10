// app/(protected)/admin/_components/RecentActivity.tsx
"use client";

import { User, Home, FileText, CreditCard, AlertTriangle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: string;
  user: string;
  action: string;
  timestamp: string;
}

const activityIcons: Record<string, React.ElementType> = {
  USER: User,
  LISTING: Home,
  APPLICATION: FileText,
  PAYMENT: CreditCard,
  DISPUTE: AlertTriangle,
};

export function RecentActivity({ activities }: { activities: Activity[] }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activityIcons[activity.type] || Clock;
        return (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shrink-0">
              <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>
                {" "}
                <span className="text-gray-600 dark:text-gray-400">{activity.action}</span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}