// components/dashboard/RecentApplications.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ApplicationWithFarmer } from "@/lib/queries/landowner";
import { formatDistanceToNow } from "date-fns";

interface RecentApplicationsProps {
  applications: ApplicationWithFarmer[];
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800"
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="flex items-start space-x-4 p-4 rounded-lg border">
                <Avatar>
                  <AvatarImage src={app.farmer.imageUrl || ''} />
                  <AvatarFallback>
                    {app.farmer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">
                      {app.farmer.name}
                    </p>
                    <Badge variant="outline" className={getStatusBadge(app.status)}>
                      {app.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Proposed Rent: ₹{app.proposedRent?.toLocaleString() || 'Not specified'}
                  </p>
                  <div className="flex items-center pt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(app.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}