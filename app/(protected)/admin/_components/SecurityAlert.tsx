// app/(protected)/admin/_components/SecurityAlert.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SecurityAlert {
  id: string;
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  message: string;
  createdAt: string;
}

export function SecurityAlert() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    const fetchSecurityAlerts = async () => {
      try {
        const res = await fetch("/api/admin/security/alerts");
        const data = await res.json();
        if (isMounted.current) {
          setAlerts(data.alerts || []);
        }
      } catch {
        // Silently fail - not critical
      }
    };

    fetchSecurityAlerts();
    const interval = setInterval(fetchSecurityAlerts, 30000);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, []);

  const visibleAlerts = alerts.filter(alert => !dismissed.includes(alert.id));

  if (visibleAlerts.length === 0) return null;

  const handleDismiss = (alertId: string) => {
    setDismissed(prev => [...prev, alertId]);
  };

  return (
    <div className="space-y-2 mb-4">
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          className={cn(
            "flex items-center justify-between p-3 rounded-lg border",
            alert.severity === "CRITICAL" && "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800",
            alert.severity === "HIGH" && "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800",
            alert.severity === "MEDIUM" && "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800",
            alert.severity === "LOW" && "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800"
          )}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className={cn(
              "h-5 w-5",
              alert.severity === "CRITICAL" && "text-red-600 dark:text-red-400",
              alert.severity === "HIGH" && "text-orange-600 dark:text-orange-400",
              alert.severity === "MEDIUM" && "text-yellow-600 dark:text-yellow-400",
              alert.severity === "LOW" && "text-blue-600 dark:text-blue-400"
            )} />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{alert.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(alert.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDismiss(alert.id)}
            className="hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}