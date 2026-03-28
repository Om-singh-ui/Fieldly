// app/(protected)/landowner/land/[id]/_components/EmptyState.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-xl border bg-muted/20 text-center">
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      {action && (
        <Button asChild variant="outline" size="sm" className="gap-1">
          <Link href={action.href}>
            <Plus className="h-4 w-4" />
            {action.label}
          </Link>
        </Button>
      )}
    </div>
  );
}