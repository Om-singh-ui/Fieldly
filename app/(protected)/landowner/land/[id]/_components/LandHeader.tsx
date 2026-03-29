"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, ExternalLink, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface LandHeaderProps {
  title: string;
  location: string;
  locationData: {
    village: string | null;
    district: string | null;
    state: string | null;
    pincode: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  landId: string;
}

export function LandHeader({
  title,
  location,
  locationData,
  landId,
}: LandHeaderProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const hasCoordinates = locationData.latitude && locationData.longitude;
  const hasLocation = location !== "Location not specified";

  const handleViewOnMap = () => {
    if (hasCoordinates) {
      const url = `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (hasLocation) {
      const searchQuery = encodeURIComponent(location);
      const url = `https://www.google.com/maps/search/${searchQuery}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      toast({
        title: "Location unavailable",
        description: "Map location is not available for this land",
        variant: "destructive",
      });
    }
  };

  const handleGetDirections = () => {
    if (hasCoordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${locationData.latitude},${locationData.longitude}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (hasLocation) {
      const destination = encodeURIComponent(location);
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      toast({
        title: "Directions unavailable",
        description: "Cannot get directions for this location",
        variant: "destructive",
      });
    }
  };

  /* =========================
     PREMIUM SKELETON
  ========================= */

  if (isLoading) {
    return (
      <section className="relative mb-10 mt-8">
        <div
          className="
          flex flex-col md:flex-row items-start md:items-center justify-between
          gap-6 md:gap-8
          px-8 md:px-12 py-6 md:py-7
          rounded-full
          border border-gray-200/70
          backdrop-blur-md
          bg-white/40 dark:bg-muted/20
          shadow-[0_8px_24px_rgba(0,0,0,0.06)]
          animate-pulse
        "
        >
          {/* LEFT */}
          <div className="flex-1 space-y-4 w-full">
            {/* Title */}
            <div className="h-8 w-64 rounded-md bg-muted/50" />

            {/* Location row */}
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full bg-muted/50" />
              <div className="h-4 w-40 rounded-md bg-muted/50" />
            </div>

            {/* Buttons row */}
            <div className="flex gap-2">
              <div className="h-8 w-24 rounded-full bg-muted/50" />
              <div className="h-8 w-20 rounded-full bg-muted/50" />
            </div>

            {/* Subtext */}
            <div className="h-3 w-72 rounded-md bg-muted/40" />
          </div>

          {/* RIGHT BUTTON */}
          <div className="h-10 w-36 rounded-full bg-muted/50" />
        </div>
      </section>
    );
  }

  /* =========================
     MAIN UI
  ========================= */

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative mb-10 mt-8"
    >
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className="
        relative
        flex flex-col md:flex-row
        items-start md:items-center justify-between
        gap-6 md:gap-8
        px-8 md:px-12 py-6 md:py-7
        rounded-full
        border border-gray-200/80
        shadow-[0_8px_24px_rgba(0,0,0,0.06)]
        hover:shadow-[0_18px_48px_rgba(0,0,0,0.10)]
        backdrop-blur-md
        transition-all
        overflow-hidden
      "
      >
        {/* LEFT */}
        <div className="relative z-10">
          <h1 className="text-[22px] md:text-[32px] font-semibold tracking-tight text-gray-900">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {location || "Location not specified"}
              </span>
            </div>

            {(hasCoordinates || hasLocation) && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGetDirections}
                  className="h-8 rounded-full px-3 text-gray-700 hover:bg-gray-100"
                >
                  <Navigation className="h-3.5 w-3.5 mr-1" />
                  Directions
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewOnMap}
                  className="h-8 rounded-full px-3 text-gray-700 hover:bg-gray-100"
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  Map
                </Button>
              </div>
            )}
          </div>

          <p className="mt-2 text-sm text-gray-500 max-w-xl">
            View land insights, manage listings, and track leasing activity
            seamlessly.
          </p>
        </div>

        {/* RIGHT */}
        <div className="relative z-10 flex items-center gap-3">
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }}>
            <Button
              asChild
              className="
              rounded-full px-6 h-10
              bg-[#b7cf8a]
              hover:bg-[#a9c87a]
              text-gray-900
              border border-[#a9c87a]
              shadow-[0_4px_12px_rgba(0,0,0,0.10)]
              hover:shadow-[0_8px_20px_rgba(0,0,0,0.14)]
            "
            >
              <Link href={`/landowner/land/${landId}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Land
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}