// app/(protected)/landowner/land/new/_components/FormSteps/AmenitiesStep.tsx
"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { FormValues } from "../types";

interface AmenitiesStepProps {
  form: UseFormReturn<FormValues>;
}

export function AmenitiesStep({ form }: AmenitiesStepProps) {
  const amenities = [
    {
      name: "irrigationAvailable" as const,
      label: "Irrigation",
      description: "Is irrigation facility available?",
    },
    {
      name: "electricityAvailable" as const,
      label: "Electricity",
      description: "Is electricity connection available?",
    },
    {
      name: "roadAccess" as const,
      label: "Road Access",
      description: "Is the land accessible by road?",
    },
    {
      name: "fencingAvailable" as const,
      label: "Fencing",
      description: "Is the land fenced?",
    },
    {
      name: "storageAvailable" as const,
      label: "Storage",
      description: "Is there storage facility?",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {amenities.map(({ name, label, description }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">{label}</FormLabel>
                  <FormDescription>{description}</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}