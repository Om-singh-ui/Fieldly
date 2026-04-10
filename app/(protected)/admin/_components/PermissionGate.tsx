// app/(protected)/admin/_components/PermissionGate.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface PermissionGateProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const { user } = useUser();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    async function checkPermission() {
      if (!user) return;

      try {
        const res = await fetch("/api/admin/auth/verify");
        const data = await res.json();

        if (data.authenticated) {
          const role = data.admin.role;
          if (role === "SUPER_ADMIN") {
            setHasPermission(true);
          } else {
            const permRes = await fetch(`/api/admin/permissions/check?permission=${permission}`);
            const permData = await permRes.json();
            setHasPermission(permData.hasPermission);
          }
        }
      } catch {
        setHasPermission(false);
      }
    }

    checkPermission();
  }, [user, permission]);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}