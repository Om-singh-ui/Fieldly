// app/(protected)/landowner/land/[id]/_components/LeasesSection.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ExternalLink, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "./EmptyState";

interface Lease {
  id: string;
  status: string;
  startDate: Date | string;
  endDate: Date | string;
  rentAmount?: number | null;
  farmer?: {
    name: string;
    email: string;
  } | null;
}

interface LeasesSectionProps {
  leases: Lease[];
}

function getStatusColor(status: string) {
  switch (status) {
    case "ACTIVE":
      return "bg-green-500 text-white";
    case "PENDING":
      return "bg-yellow-500 text-white";
    case "COMPLETED":
      return "bg-blue-500 text-white";
    case "CANCELLED":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

function LeaseCard({ lease }: { lease: Lease }) {
  return (
    <div className="p-4 rounded-xl border bg-card hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <Badge className={getStatusColor(lease.status)}>
              {lease.status}
            </Badge>
            {lease.rentAmount && (
              <Badge variant="outline">
                ₹{lease.rentAmount.toLocaleString()}/month
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {formatDate(lease.startDate)} → {formatDate(lease.endDate)}
              </span>
            </div>
            {lease.farmer && (
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span>{lease.farmer.name}</span>
              </div>
            )}
          </div>
        </div>

        <Button variant="ghost" size="sm" asChild>
          <Link href={`/leases/${lease.id}`}>
            View Details
            <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function LeasesSection({ leases }: LeasesSectionProps) {
  const activeLeases = leases.filter(l => l.status === "ACTIVE");
  const otherLeases = leases.filter(l => l.status !== "ACTIVE");

  return (
    <div>
      <h2 className="font-semibold text-lg mb-4">Leases</h2>

      {leases.length === 0 ? (
        <EmptyState
          title="No active leases"
          description="Your land will appear here when it gets rented"
          icon={<FileText className="h-12 w-12 text-muted-foreground" />}
        />
      ) : (
        <div className="space-y-4">
          {activeLeases.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Active Leases
              </h3>
              <div className="space-y-3">
                {activeLeases.map((lease) => (
                  <LeaseCard key={lease.id} lease={lease} />
                ))}
              </div>
            </div>
          )}

          {otherLeases.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Past Leases
              </h3>
              <div className="space-y-3">
                {otherLeases.map((lease) => (
                  <LeaseCard key={lease.id} lease={lease} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}