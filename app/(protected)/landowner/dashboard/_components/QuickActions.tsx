// components/dashboard/QuickActions.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  FileText,
  Users,
  BarChart3,
  Settings,
  HelpCircle
} from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      label: "Add New Land",
      icon: Plus,
      variant: "default" as const,
      href: "/landowner/lands/new"
    },
    {
      label: "View Applications",
      icon: FileText,
      variant: "outline" as const,
      href: "/landowner/applications"
    },
    {
      label: "Manage Leases",
      icon: Users,
      variant: "outline" as const,
      href: "/landowner/leases"
    },
    {
      label: "Analytics",
      icon: BarChart3,
      variant: "outline" as const,
      href: "/landowner/analytics"
    },
    {
      label: "Settings",
      icon: Settings,
      variant: "outline" as const,
      href: "/landowner/settings"
    },
    {
      label: "Help & Support",
      icon: HelpCircle,
      variant: "outline" as const,
      href: "/support"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant={action.variant}
                className="h-auto flex-col gap-2 p-4"
                asChild
              >
                <a href={action.href}>
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{action.label}</span>
                </a>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}