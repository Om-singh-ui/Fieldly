// app/(protected)/landowner/land/new/_components/FormSteps/ReviewStep.tsx
"use client";

import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FormValues } from "../types";
import { ImageUpload } from "../ImageUpload";

interface ReviewStepProps {
  form: UseFormReturn<FormValues>;
  images: File[];
  onImagesChange: (images: File[]) => void;
}

export function ReviewStep({ form, images, onImagesChange }: ReviewStepProps) {
  // ✅ Use useMemo to prevent unnecessary recalculations
  const values = useMemo(() => form.getValues(), [form]);

  return (
    <div className="space-y-6">
      <ImageUpload images={images} onImagesChange={onImagesChange} />

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Summary</h3>

        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Title</p>
            <p className="font-medium">{values.title}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">
              {values.village}, {values.district}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Land Type</p>
            <p className="font-medium">{values.landType}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Size</p>
            <p className="font-medium">{values.size} acres</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Lease Duration</p>
            <p className="font-medium">
              {values.minLeaseDuration} - {values.maxLeaseDuration} months
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Expected Rent</p>
            <p className="font-medium">
              ₹{values.expectedRentMin?.toLocaleString() ?? 0} - ₹{values.expectedRentMax?.toLocaleString() ?? 0}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {values.allowedCropTypes?.map((crop) => (
            <Badge key={crop} variant="secondary">{crop}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}