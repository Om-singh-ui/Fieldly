// app/(protected)/landowner/land/new/_components/FormSteps/FarmingDetailsStep.tsx
"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { FormValues, CROP_TYPES } from "../types";

interface FarmingDetailsStepProps {
  form: UseFormReturn<FormValues>;
}

export function FarmingDetailsStep({ form }: FarmingDetailsStepProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="allowedCropTypes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Crop Types Allowed</FormLabel>
            <FormDescription>
              Select the types of crops that can be grown
            </FormDescription>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {CROP_TYPES.map((crop) => (
                <div key={crop} className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value?.includes(crop)}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), crop]
                        : (field.value || []).filter((c) => c !== crop);
                      field.onChange(updatedValue);
                    }}
                  />
                  <label className="text-sm">{crop}</label>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <Separator />

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="allowsInfrastructureModification"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Infrastructure Modification</FormLabel>
                <FormDescription>
                  Allow farmers to build/modify structures?
                </FormDescription>
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

        <FormField
          control={form.control}
          name="allowsOrganicFarming"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Organic Farming</FormLabel>
                <FormDescription>
                  Allow organic farming practices?
                </FormDescription>
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

        <FormField
          control={form.control}
          name="allowsSubleasing"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Subleasing</FormLabel>
                <FormDescription>
                  Allow farmers to sublease the land?
                </FormDescription>
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
      </div>
    </div>
  );
}