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
  const values = useMemo(() => form.getValues(), [form]);

  return (
    <div className="space-y-10">

      {/* IMAGE SECTION */}
      <div className="space-y-4">
        <h3 className="text-lg md:text-xl font-semibold tracking-tight">
          Upload land images
        </h3>

        <div className="rounded-xl border border-gray-200 dark:border-neutral-800 p-4 md:p-6 bg-white dark:bg-neutral-900">
          <ImageUpload images={images} onImagesChange={onImagesChange} />
        </div>
      </div>

      <Separator />

      {/* SUMMARY */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold tracking-tight">
            Review listing details
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Verify information before publishing
          </p>
        </div>

        {/* SUMMARY CARD */}
        <div className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

            <Info label="Title" value={values.title} />
            <Info label="Village" value={values.village} />
            <Info label="District" value={values.district} />

            <Info label="Land Type" value={values.landType} />
            <Info label="Size" value={`${values.size} acres`} />
            <Info
              label="Lease Duration"
              value={`${values.minLeaseDuration} - ${values.maxLeaseDuration} months`}
            />

            <Info
              label="Expected Rent"
              value={`₹${values.expectedRentMin?.toLocaleString() ?? 0} - ₹${values.expectedRentMax?.toLocaleString() ?? 0}`}
              highlight
            />
          </div>
        </div>

        {/* CROPS */}
        {values.allowedCropTypes?.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Allowed crops
            </p>

            <div className="flex flex-wrap gap-2">
              {values.allowedCropTypes.map((crop) => (
                <Badge
                  key={crop}
                  className="bg-[#f3f7ea] text-[#5f7a2b] hover:bg-[#e8f0d8] border border-[#e1e9c9]"
                >
                  {crop}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number | undefined;
  highlight?: boolean;
}) {
  return (
    <div className="p-4 md:p-5 border-b sm:border-b border-gray-100 dark:border-neutral-800 last:border-b-0 lg:border-r lg:last:border-r-0">
      <p className="text-xs text-gray-500 uppercase tracking-wide">
        {label}
      </p>

      <p
        className={`mt-1 text-sm md:text-base font-semibold ${
          highlight
            ? "text-[#7a9a3a]"
            : "text-gray-900 dark:text-gray-100"
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}