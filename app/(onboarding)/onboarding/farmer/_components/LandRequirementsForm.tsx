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

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -25 }}
      transition={{ duration: 0.35 }}
      className="space-y-10"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center justify-center w-20 h-20  rounded-2xl shadow-sm mb-5"
        >
          <Image
            src="/onboarding/landreq.png"
            alt="Farming Icon"
            width={36}
            height={36}
            className="object-contain"
          />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Land Requirements
        </h2>

        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Specify your preferred land size and leasing duration.
        </p>
      </div>

      {/* Land Size Card */}
      <div className="rounded-2xl border border-[#b7cf8a]/40 bg-[#b7cf8a]/10 p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              Land Size Needed
            </h3>
            <p className="text-sm text-gray-600">
              Minimum cultivable area required
            </p>
          </div>

          <div className="text-right">
            <div className="text-4xl font-bold text-[#5f7e37]">{landSize}</div>
            <div className="text-xs text-gray-500">Acres</div>
          </div>
        </div>

        {/* Slider */}
        <div className="mb-8">
          <input
            type="range"
            min="0.1"
            max="100"
            step="0.1"
            value={landSize}
            onChange={(e) =>
              setValue("requiredLandSize", parseFloat(e.target.value))
            }
            className="w-full h-2 bg-[#b7cf8a]/40 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[#6c8f3f]
            [&::-webkit-slider-thumb]:border-4
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow"
          />

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0.1 Acre</span>
            <span>100 Acres</span>
          </div>
        </div>

        {/* Presets */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Common Sizes
          </h4>

          <div className="flex flex-wrap gap-3">
            {landSizePresets.map((size) => {
              const active = landSize === size;

              return (
                <motion.button
                  key={size}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setValue("requiredLandSize", size)}
                  className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition ${
                    active
                      ? "bg-[#b7cf8a] text-[#3e5324] shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {active && <Check className="h-4 w-4" />}
                  {size} Acre{size !== 1 && "s"}
                </motion.button>
              );
            })}
          </div>
        </div>

        {errors.requiredLandSize && (
          <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.requiredLandSize.message}
          </div>
        )}
      </div>

      {/* Lease Duration */}
      <div className="rounded-2xl border border-[#b7cf8a]/40 bg-[#b7cf8a]/10 p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-5 w-5 text-[#5f7e37]" />
              <h3 className="font-semibold text-gray-900">Lease Duration</h3>
            </div>
            <p className="text-sm text-gray-600">Preferred leasing period</p>
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
          <input
            type="range"
            min="1"
            max="120"
            value={leaseDuration}
            onChange={(e) =>
              setValue("leaseDuration", parseInt(e.target.value))
            }
            className="w-full h-2 bg-[#b7cf8a]/40 rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[#6c8f3f]
            [&::-webkit-slider-thumb]:border-4
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow"
          />

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
                onClick={() => setValue("leaseDuration", duration.months)}
                className={`px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition ${
                  active
                    ? "bg-[#b7cf8a] text-[#3e5324] shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {active && <Check className="h-4 w-4" />}
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

      {/* Info Card */}
      <div className="rounded-2xl bg-[#b7cf8a]/15 border border-[#b7cf8a]/30 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#b7cf8a]/40 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-[#5f7e37]" />
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Flexible Options
            </h4>

            <p className="text-sm text-gray-700">
              You can update these preferences later. We’ll recommend land
              options that match both your minimum and ideal requirements.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
