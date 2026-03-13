// app/(protected)/landowner/land/new/_components/FormSteps/LeaseTermsStep.tsx
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
import { Input } from "@/components/ui/input";
import { FormValues } from "../types";

interface LeaseTermsStepProps {
  form: UseFormReturn<FormValues>;
}

export function LeaseTermsStep({ form }: LeaseTermsStepProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="minLeaseDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Lease Duration (months)</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  value={field.value || ''}
                  onChange={e => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxLeaseDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Lease Duration (months)</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  value={field.value || ''}
                  onChange={e => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="expectedRentMin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Rent (Min) - ₹/acre/year</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="25000"
                  value={field.value || ''}
                  onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expectedRentMax"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Rent (Max) - ₹/acre/year</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="35000"
                  value={field.value || ''}
                  onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="depositAmount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Security Deposit (Optional) - ₹</FormLabel>
            <FormControl>
              <Input 
                type="number"
                placeholder="50000"
                value={field.value || ''}
                onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </FormControl>
            <FormDescription>
              Suggested: 3-6 months of rent
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}