"use client";

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";

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

import { FormValues, SOIL_TYPES } from "../types";

interface BasicInfoStepProps {
  form: UseFormReturn<FormValues>;
}

const fieldAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  return (
    <div className="space-y-8">
      {/* SECTION HEADER */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">
          Basic Information
        </h3>
        <p className="text-sm text-slate-500">
          Provide essential details about your land listing.
        </p>
      </div>

      {/* TITLE */}
      <motion.div variants={fieldAnim} initial="initial" animate="animate">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Land Title</FormLabel>

              <FormControl>
                <Input
                  placeholder="e.g. Fertile Agricultural Land in Sonipat"
                  className="h-11 bg-white/70 backdrop-blur-sm border-slate-200 focus-visible:ring-2 focus-visible:ring-[#b7cf8a]"
                  {...field}
                />
              </FormControl>

              <FormDescription>
                This will be shown to farmers browsing listings.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      {/* DESCRIPTION */}
      <motion.div variants={fieldAnim} initial="initial" animate="animate">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Description</FormLabel>

              <FormControl>
                <Textarea
                  placeholder="Describe soil quality, irrigation access, nearby roads, previous crops, etc."
                  className="min-h-[130px] resize-none bg-white/70 backdrop-blur-sm border-slate-200 focus-visible:ring-2 focus-visible:ring-[#b7cf8a]"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>

              <FormDescription>
                Detailed descriptions increase farmer trust.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      {/* GRID SECTION */}
      <motion.div
        variants={fieldAnim}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* LAND TYPE */}
        <FormField
          control={form.control}
          name="landType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Land Type</FormLabel>

              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11 bg-white/70 backdrop-blur-sm border-slate-200">
                    <SelectValue placeholder="Select land type" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="AGRICULTURAL">Agricultural</SelectItem>
                  <SelectItem value="FALLOW">Fallow</SelectItem>
                  <SelectItem value="ORCHARD">Orchard</SelectItem>
                  <SelectItem value="PASTURE">Pasture</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* SIZE */}
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Size (Acres)
              </FormLabel>

              <FormControl>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="5.0"
                  className="h-11 bg-white/70 backdrop-blur-sm border-slate-200 focus-visible:ring-2 focus-visible:ring-[#b7cf8a]"
                  value={field.value || ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                />
              </FormControl>

              <FormDescription>Specify total usable land area.</FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      {/* SOIL TYPE */}
      <motion.div variants={fieldAnim} initial="initial" animate="animate">
        <FormField
          control={form.control}
          name="soilType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Soil Type</FormLabel>

              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="h-11 bg-white/70 backdrop-blur-sm border-slate-200">
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {SOIL_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormDescription>
                Helps farmers evaluate crop suitability.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>
    </div>
  );
}
