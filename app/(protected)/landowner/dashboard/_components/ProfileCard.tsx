    // components/dashboard/ProfileCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";

interface ProfileCardProps {
  user: {
    name: string;
    email: string;
    phone: string | null;
    state: string | null;
    district: string | null;
    createdAt: Date;
    landownerProfile: {
      isVerified: boolean;
      verificationLevel: number;
    };
  };
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={user.landownerProfile.isVerified ? "default" : "secondary"}>
            {user.landownerProfile.isVerified ? "Verified" : "Unverified"}
          </Badge>
          {user.landownerProfile.verificationLevel > 0 && (
            <Badge variant="outline">
              Level {user.landownerProfile.verificationLevel}
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
          
          {user.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{user.phone}</span>
            </div>
          )}
          
          {(user.district || user.state) && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                {[user.district, user.state].filter(Boolean).join(", ")}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}