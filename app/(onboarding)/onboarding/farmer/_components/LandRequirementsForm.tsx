"use client";

import { MapPin, Calendar, AlertCircle, Check } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FarmerOnboardingInput } from "@/lib/validations/onboarding";
import { motion } from "framer-motion";

interface LandRequirementsFormProps {
  form: UseFormReturn<FarmerOnboardingInput>;
}

export function LandRequirementsForm({ form }: LandRequirementsFormProps) {
  const {watch, setValue, formState: { errors } } = form;
  const landSize = watch("requiredLandSize");
  const leaseDuration = watch("leaseDuration");

  const landSizePresets = [1, 5, 10, 20, 50];
  const leasePresets = [
    { months: 12, label: '1 Year' },
    { months: 36, label: '3 Years' },
    { months: 60, label: '5 Years' },
    { months: 120, label: '10 Years' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl mb-5">
          <MapPin className="h-9 w-9 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Land Requirements
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Specify the land size and lease duration you need
        </p>
      </div>

      {/* Land Size Card */}
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Land Size Needed</h3>
            <p className="text-sm text-gray-600 mt-1">Minimum cultivable area required</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600">{landSize}</div>
            <div className="text-sm text-gray-500">acres</div>
          </div>
        </div>

        {/* Range Slider */}
        <div className="mb-8">
          <input
            type="range"
            min="0.1"
            max="100"
            step="0.1"
            value={landSize}
            onChange={(e) => setValue("requiredLandSize", parseFloat(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-purple-100 to-purple-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0.1 acre</span>
            <span>100 acres</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Common sizes</h4>
          <div className="flex flex-wrap gap-3">
            {landSizePresets.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setValue("requiredLandSize", size)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  landSize === size
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {landSize === size && <Check className="h-4 w-4" />}
                {size} acre{size !== 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>

        {errors.requiredLandSize && (
          <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.requiredLandSize.message}
          </div>
        )}
      </div>

      {/* Lease Duration Card */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Lease Duration</h3>
            </div>
            <p className="text-sm text-gray-600">Preferred leasing period</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">{leaseDuration}</div>
            <div className="text-sm text-gray-500">months</div>
          </div>
        </div>

        {/* Range Slider */}
        <div className="mb-8">
          <input
            type="range"
            min="1"
            max="120"
            step="1"
            value={leaseDuration}
            onChange={(e) => setValue("leaseDuration", parseInt(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>1 month</span>
            <span>10 years</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Common durations</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {leasePresets.map((duration) => (
              <button
                key={duration.months}
                type="button"
                onClick={() => setValue("leaseDuration", duration.months)}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  leaseDuration === duration.months
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {leaseDuration === duration.months && <Check className="h-4 w-4" />}
                {duration.label}
              </button>
            ))}
          </div>
        </div>

        {errors.leaseDuration && (
          <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.leaseDuration.message}
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Flexible Options</h4>
            <p className="text-sm text-gray-600">
              Don&apos;t worry about getting this perfect. You can always adjust your requirements later, 
              and we&apos;ll show you lands that match both your minimum and preferred sizes.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}