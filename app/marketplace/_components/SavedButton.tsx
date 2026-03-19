// app/(marketplace)/_components/SavedButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SavedButtonProps {
  listingId: string;
  initialSaved?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost";
  className?: string;
  onToggle?: (saved: boolean) => void;
}

export function SavedButton({
  listingId,
  initialSaved = false,
  size = "icon",
  variant = "outline",
  className,
  onToggle,
}: SavedButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/marketplace/saved", {
        method: isSaved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });

      if (!response.ok) throw new Error("Failed to toggle save");

      const newSavedState = !isSaved;
      setIsSaved(newSavedState);

      toast({
        title: newSavedState
          ? "Saved to collection"
          : "Removed from collection",
        description: newSavedState
          ? "Listing has been added to your saved items"
          : "Listing has been removed from your saved items",
      });

      onToggle?.(newSavedState);
    } catch {
      toast({
        title: "Error",
        description: "Failed to save listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (size === "icon") {
    return (
      <Button
        size="icon"
        variant={variant}
        onClick={handleToggle}
        disabled={isLoading}
        className={cn("relative", className)}
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-all",
            isSaved && "fill-red-500 text-red-500",
            isLoading && "opacity-50",
          )}
        />
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </span>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={isLoading}
      className={cn("gap-2", className)}
    >
      <Heart
        className={cn("h-4 w-4", isSaved && "fill-red-500 text-red-500")}
      />
      {isSaved ? "Saved" : "Save"}
      {isLoading && (
        <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
    </Button>
  );
}
