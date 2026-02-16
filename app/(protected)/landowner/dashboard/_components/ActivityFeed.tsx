// components/dashboard/ActivityFeed.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  FileCheck, 
  CreditCard,
  Clock 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  type: 'application' | 'lease' | 'payment';
  id: string;
  message: string;
  timestamp: Date;
  amount?: number;
  status?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'lease':
        return <FileCheck className="h-4 w-4 text-green-600" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-purple-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'application':
        return 'bg-blue-50';
      case 'lease':
        return 'bg-green-50';
      case 'payment':
        return 'bg-purple-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={`${activity.type}-${activity.id}`} className="flex gap-4">
                <div className={`p-2 rounded-lg ${getBgColor(activity.type)}`}>
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </span>
                    {activity.amount && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs font-medium">
                          ₹{activity.amount.toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}