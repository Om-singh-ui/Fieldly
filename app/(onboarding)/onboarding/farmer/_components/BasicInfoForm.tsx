"use client";

import { MapPin, Phone, AlertCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FarmerOnboardingInput } from "@/lib/validations/onboarding";
import { motion } from "framer-motion";
import Image from "next/image";

interface BasicInfoFormProps {
  form: UseFormReturn<FarmerOnboardingInput>;
}

const STATES = [
  "Maharashtra",
  "Punjab",
  "Haryana",
  "Uttar Pradesh",
  "Rajasthan",
  "Madhya Pradesh",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "West Bengal",
  "Bihar",
  "Andhra Pradesh",
  "Telangana",
  "Kerala",
  "Odisha",
];

export function BasicInfoForm({ form }: BasicInfoFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

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
          className="inline-flex items-center justify-center w-20 h-20 bg-[#b7cf8a]/25 rounded-2xl shadow-sm mb-5"
        >
          <Image
            src="/onboarding/user-man-account-person.png"
            alt="Farming Icon"
            width={36}
            height={36}
            className="object-contain"
          />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Basic Information
        </h2>

        <p className="text-gray-600 max-w-md mx-auto text-sm">
          Provide your contact details and location to help us match you with
          farmland opportunities.
        </p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            <Phone className="inline h-4 w-4 mr-1" />
            Mobile Number *
          </label>

          <div className="relative rounded-xl border border-gray-300 bg-white shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-[#b7cf8a] focus-within:border-[#b7cf8a]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
              +91
            </span>

            <input
              type="tel"
              {...register("phone")}
              maxLength={10}
              placeholder="98765 43210"
              className="pl-14 pr-4 py-3.5 w-full bg-transparent rounded-xl focus:outline-none text-sm"
            />
          </div>

          {errors.phone && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.phone.message}
            </div>
          )}
        </div>

        {/* State Dropdown */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            State *
          </label>

          <div className="relative rounded-xl border border-gray-300 bg-white shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-[#b7cf8a] focus-within:border-[#b7cf8a] hover:border-gray-400">
            {/* Left Icon */}
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />

            <select
              {...register("state")}
              className="w-full appearance-none bg-transparent pl-11 pr-10 py-3.5 rounded-xl text-sm font-medium focus:outline-none cursor-pointer"
            >
              <option value="">Select your state</option>
              {STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            {/* Arrow */}
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.div>
          </div>

          {errors.state && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.state.message}
            </div>
          )}
        </div>

        {/* District */}
        <div className="md:col-span-2 group">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            District *
          </label>

          <div className="rounded-xl border border-gray-300 bg-white shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-[#b7cf8a] focus-within:border-[#b7cf8a]">
            <input
              type="text"
              {...register("district")}
              placeholder="Enter your district"
              className="px-4 py-3.5 w-full bg-transparent rounded-xl focus:outline-none text-sm"
            />
          </div>

          {errors.district && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.district.message}
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="md:col-span-2 group">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Farming Experience & Background
            <span className="text-gray-500 font-normal ml-1">(Optional)</span>
          </label>

          <div className="rounded-xl border border-gray-300 bg-white shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-[#b7cf8a] focus-within:border-[#b7cf8a]">
            <textarea
              {...register("bio")}
              rows={4}
              placeholder="Share your farming experience, techniques, or achievements..."
              className="px-4 py-3.5 w-full bg-transparent rounded-xl focus:outline-none text-sm resize-none"
            />
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Helps us recommend better land and agricultural opportunities.
          </p>
        </div>
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#b7cf8a]/20 border border-[#b7cf8a]/40 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#b7cf8a]/40 flex items-center justify-center">
            <Phone className="h-5 w-5 text-[#5f7e37]" />
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Why this information matters
            </h4>

            <p className="text-sm text-gray-700">
              Your contact and location details allow us to match you with
              verified landowners and farmland opportunities in your region.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
