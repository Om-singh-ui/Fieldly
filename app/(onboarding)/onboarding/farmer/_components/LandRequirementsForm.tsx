"use client";

import { Calendar, AlertCircle, Check } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FarmerOnboardingInput } from "@/lib/validations/onboarding";
import { motion } from "framer-motion";
import Image from "next/image";

interface LandRequirementsFormProps {
  form: UseFormReturn<FarmerOnboardingInput>;
}

export function LandRequirementsForm({ form }: LandRequirementsFormProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const landSize = watch("requiredLandSize") || 1;
  const leaseDuration = watch("leaseDuration") || 12;

  const landSizePresets = [1, 5, 10, 20, 50];

  const leasePresets = [
    { months: 12, label: "1 Year" },
    { months: 36, label: "3 Years" },
    { months: 60, label: "5 Years" },
    { months: 120, label: "10 Years" },
  ];

  const landProgress = (landSize / 100) * 100;
  const leaseProgress = (leaseDuration / 120) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-12"
    >
      {/* HEADER */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl  shadow-sm mb-6"
        >
          <Image
            src="/onboarding/landreq.png"
            alt="Land Requirements"
            width={38}
            height={38}
            className="object-contain"
          />
        </motion.div>

        <h2 className="text-3xl font-bold text-gray-900">
          Land Requirements
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Define your preferred land size and lease duration.
        </p>
      </div>

      {/* LAND SIZE */}
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Land Size Needed
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Minimum cultivable area required
            </p>
          </div>

          <div className="text-right">
            <div className="text-4xl font-bold text-[#5f7e37]">
              {landSize}
            </div>
            <div className="text-xs text-gray-500">Acres</div>
          </div>
        </div>

        {/* Slider */}
        <div className="mb-8">
          <div className="relative h-2 rounded-full bg-gray-200">
            <div
              className="absolute h-2 rounded-full bg-[#b7cf8a]"
              style={{ width: `${landProgress}%` }}
            />
            <input
              type="range"
              min="0.1"
              max="100"
              step="0.1"
              value={landSize}
              onChange={(e) =>
                setValue(
                  "requiredLandSize",
                  parseFloat(e.target.value),
                  { shouldValidate: true }
                )
              }
              className="absolute top-0 left-0 w-full h-2 appearance-none bg-transparent cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:w-6
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[#6c8f3f]
              [&::-webkit-slider-thumb]:border-4
              [&::-webkit-slider-thumb]:border-white
              [&::-webkit-slider-thumb]:shadow-md"
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0.1 Acre</span>
            <span>100 Acres</span>
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-3">
          {landSizePresets.map((size) => {
            const active = landSize === size;

            return (
              <motion.button
                key={size}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() =>
                  setValue("requiredLandSize", size, {
                    shouldValidate: true,
                  })
                }
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-[#b7cf8a] text-[#2f3d1c] shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {active && <Check className="inline w-4 h-4 mr-1" />}
                {size} Acre{size !== 1 && "s"}
              </motion.button>
            );
          })}
        </div>

        {errors.requiredLandSize && (
          <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.requiredLandSize.message}
          </div>
        )}
      </div>

      {/* LEASE DURATION */}
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Lease Duration
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Preferred leasing period
            </p>
          </div>

          <div className="text-right">
            <div className="text-4xl font-bold text-[#5f7e37]">
              {leaseDuration}
            </div>
            <div className="text-xs text-gray-500">Months</div>
          </div>
        </div>

        {/* Slider */}
        <div className="mb-8">
          <div className="relative h-2 rounded-full bg-gray-200">
            <div
              className="absolute h-2 rounded-full bg-[#b7cf8a]"
              style={{ width: `${leaseProgress}%` }}
            />
            <input
              type="range"
              min="1"
              max="120"
              value={leaseDuration}
              onChange={(e) =>
                setValue(
                  "leaseDuration",
                  parseInt(e.target.value),
                  { shouldValidate: true }
                )
              }
              className="absolute top-0 left-0 w-full h-2 appearance-none bg-transparent cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:w-6
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[#6c8f3f]
              [&::-webkit-slider-thumb]:border-4
              [&::-webkit-slider-thumb]:border-white
              [&::-webkit-slider-thumb]:shadow-md"
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>1 Month</span>
            <span>10 Years</span>
          </div>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {leasePresets.map((duration) => {
            const active = leaseDuration === duration.months;

            return (
              <motion.button
                key={duration.months}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() =>
                  setValue("leaseDuration", duration.months, {
                    shouldValidate: true,
                  })
                }
                className={`px-4 py-3 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-[#b7cf8a] text-[#2f3d1c] shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {active && <Check className="inline w-4 h-4 mr-1" />}
                {duration.label}
              </motion.button>
            );
          })}
        </div>

        {errors.leaseDuration && (
          <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.leaseDuration.message}
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="rounded-3xl border border-[#b7cf8a]/30 bg-[#f6faef] p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#b7cf8a]/30 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-[#5f7e37]" />
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Flexible Options
            </h4>
            <p className="text-sm text-gray-600">
              You can modify these preferences later. We’ll match you with land
              options aligned to your minimum and ideal requirements.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}