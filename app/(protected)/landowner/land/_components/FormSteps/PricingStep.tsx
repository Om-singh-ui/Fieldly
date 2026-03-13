// app/(protected)/landowner/land/new/_components/FormSteps/PricingStep.tsx
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormValues } from "../types";

interface PricingStepProps {
  form: UseFormReturn<FormValues>;
}

export function PricingStep({ form }: PricingStepProps) {
  const listingType = form.watch("listingType");

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="listingType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Listing Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select listing type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="OPEN_BIDDING">Open Bidding</SelectItem>
                <SelectItem value="FIXED_PRICE">Fixed Price</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              {field.value === "OPEN_BIDDING" 
                ? "Farmers can bid on your land" 
                : "Set a fixed price for your land"}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="basePrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Base Price (₹/acre/year)</FormLabel>
            <FormControl>
              <Input 
                type="number"
                placeholder="30000"
                value={field.value || ''}
                onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </FormControl>
            <FormDescription>
              Starting price for bidding or minimum acceptable price
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {listingType === "OPEN_BIDDING" && (
        <FormField
          control={form.control}
          name="reservePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reserve Price (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="35000"
                  value={field.value || ''}
                  onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </FormControl>
              <FormDescription>
                Minimum price you&apos;ll accept (if different from base price)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {listingType === "FIXED_PRICE" && (
        <FormField
          control={form.control}
          name="buyNowPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fixed Price</FormLabel>
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
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="paymentFrequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Frequency</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="HALF_YEARLY">Half Yearly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="securityDepositRequired"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Security Deposit</FormLabel>
                <FormDescription>
                  Require security deposit from farmers?
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

      <FormField
        control={form.control}
        name="additionalTerms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Terms & Conditions (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Any specific terms or conditions for the lease..."
                className="min-h-[100px]"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}