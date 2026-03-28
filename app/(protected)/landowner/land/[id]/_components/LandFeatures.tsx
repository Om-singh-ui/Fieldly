// app/(protected)/landowner/land/[id]/_components/LandFeatures.tsx

import Image from "next/image";
import { Droplets, Zap, Truck, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* =========================
   FEATURE ITEM
========================= */

interface FeatureItemProps {
  label: string;
  available: boolean | null;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
}

function FeatureItem({
  label,
  available,
  activeIcon,
  inactiveIcon,
}: FeatureItemProps) {
  const isAvailable = available === true;

  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 cursor-default",
        "hover:shadow-lg hover:-translate-y-[3px]",
        isAvailable
          ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800"
          : "bg-white/40 dark:bg-white/5 border-white/30 backdrop-blur-sm hover:border-primary/30"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "p-2.5 rounded-xl transition-all",
          isAvailable
            ? "bg-green-100 dark:bg-green-900/30"
            : "bg-muted/60 group-hover:bg-muted/80"
        )}
      >
        {isAvailable ? activeIcon : inactiveIcon}
      </div>

      {/* Text */}
      <div className="flex-1">
        <p className="font-medium text-sm">{label}</p>
        <p
          className={cn(
            "text-xs mt-0.5",
            isAvailable
              ? "text-green-600 dark:text-green-400"
              : "text-muted-foreground"
          )}
        >
          {isAvailable ? "Available" : "Not available"}
        </p>
      </div>

      {isAvailable && (
        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
      )}
    </div>
  );
}

/* =========================
   MAIN COMPONENT
========================= */

interface LandFeaturesProps {
  irrigationAvailable: boolean | null;
  electricityAvailable: boolean | null;
  roadAccess: boolean | null;
  fencingAvailable: boolean | null;
}

export function LandFeatures({
  irrigationAvailable,
  electricityAvailable,
  roadAccess,
  fencingAvailable,
}: LandFeaturesProps) {
  const features = [
    {
      label: "Irrigation",
      available: irrigationAvailable,
      activeIcon: <Droplets className="h-5 w-5 text-green-600" />,
      inactiveIcon: <Droplets className="h-5 w-5 text-muted-foreground" />,
    },
    {
      label: "Electricity",
      available: electricityAvailable,
      activeIcon: <Zap className="h-5 w-5 text-yellow-500" />,
      inactiveIcon: <Zap className="h-5 w-5 text-muted-foreground" />,
    },
    {
      label: "Road Access",
      available: roadAccess,
      activeIcon: <Truck className="h-5 w-5 text-blue-500" />,
      inactiveIcon: <Truck className="h-5 w-5 text-muted-foreground" />,
    },
    {
      label: "Fencing",
      available: fencingAvailable,
      activeIcon: <Lock className="h-5 w-5 text-purple-500" />,
      inactiveIcon: <Lock className="h-5 w-5 text-muted-foreground" />,
    },
  ];

  return (
    <div className="relative mt-6">

      {/* 🔥 CAPSULE CONTAINER (MATCHES STATS) */}
      <div
        className="
          absolute inset-0 rounded-[70px]
          border border-[#b7cf8a]/20
          shadow-[0_18px_48px_rgba(0,0,0,0.10),0_6px_16px_rgba(0,0,0,0.06)]
          backdrop-blur-2xl
          bg-white/30 dark:bg-white/5
        "
      />

      {/* CONTENT */}
      <div className="relative z-10 px-6 md:px-10 py-10 md:py-12 space-y-6">

        {/* ===== HEADER ===== */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl flex items-center justify-center ">
            <Image
              src="/onboarding/landreq.png"
              alt="Land features"
              width={26}
              height={26}
              className="opacity-90"
            />
          </div>

          <h2 className="font-semibold text-xl tracking-tight">
            Land Features
          </h2>
        </div>

        {/* ===== GRID ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {features.map((feature) => (
            <FeatureItem key={feature.label} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
}