"use client";

import { FileText, PencilLine, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

interface LandDescriptionProps {
  description: string | null;
  landId?: string;
  isEditable?: boolean;
}

export function LandDescription({
  description,
  landId,
  isEditable = false,
}: LandDescriptionProps) {
  const cleanDescription =
    typeof description === "string" ? description.trim() : "";

  const hasDescription = cleanDescription.length > 0;

  return (
    <div className="relative mt-6">

      {/* CAPSULE CONTAINER (MATCHES STATS & FEATURES) */}
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
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl tracking-tight">
            Description
          </h2>

          {isEditable && landId && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-full px-4"
            >
              <Link href={`/landowner/land/${landId}/edit`}>
                <PencilLine className="h-3.5 w-3.5 mr-1" />
                {hasDescription ? "Edit" : "Add"}
              </Link>
            </Button>
          )}
        </div>

        {/* ================= EMPTY STATE ================= */}
        {!hasDescription ? (
          <div className="space-y-6">

            {/* Alert */}
            <Alert className="bg-white/40 dark:bg-white/5 border-white/20 backdrop-blur-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm text-muted-foreground">
                No description provided.
                {isEditable && " Add details to improve listing quality."}
              </AlertDescription>
            </Alert>

            {/* Empty Card */}
            <div
              className="
              p-10 rounded-2xl border border-dashed
              bg-white/40 dark:bg-white/5
              backdrop-blur-md
              text-center
              transition-all
              hover:border-primary/30
            "
            >
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-60" />

              <p className="text-muted-foreground mb-2 font-medium">
                No description yet
              </p>

              {isEditable && (
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Add soil quality, irrigation, location benefits, and nearby
                  facilities to attract better farmers.
                </p>
              )}
            </div>
          </div>
        ) : (
          /* ================= CONTENT ================= */
          <div
            className="
            p-8 rounded-2xl
            bg-white/40 dark:bg-white/5
            backdrop-blur-md
            border border-white/20
            shadow-sm
            transition-all
            hover:shadow-md
          "
          >
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-[15px]">
              {cleanDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}