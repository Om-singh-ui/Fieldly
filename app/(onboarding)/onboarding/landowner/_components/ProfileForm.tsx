"use client";

import { User, Building2, AlertCircle, Check } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { LandownerOnboardingInput, ownershipTypes } from "@/lib/validations/onboarding";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProfileFormProps {
  form: UseFormReturn<LandownerOnboardingInput>;
}

export function ProfileForm({ form }: ProfileFormProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const ownershipType = watch("ownershipType");
  const bio = watch("bio") || "";

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
            alt="Profile Icon"
            width={48}
            height={48}
            className="object-contain"
          />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Professional Profile
        </h2>

        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Tell us about your land ownership experience and preferences.
        </p>
      </div>

      {/* Bio Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            About You
          </h3>
          <p className="text-sm text-gray-600">
            Share your experience as a landowner
          </p>
        </div>

        <div className="rounded-xl border border-gray-300 bg-white shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-[#b7cf8a] focus-within:border-[#b7cf8a]">
          <textarea
            {...register("bio")}
            rows={5}
            maxLength={500}
            placeholder="Tell us about your land ownership experience, how many acres you own, what type of farming you prefer, and what you're looking for in tenants..."
            className="px-4 py-3.5 w-full bg-transparent rounded-xl focus:outline-none text-sm resize-none"
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Minimum 20 characters
          </span>
          <span
            className={`text-xs font-medium ${
              bio.length >= 20 ? "text-green-600" : "text-gray-400"
            }`}
          >
            {bio.length}/500
          </span>
        </div>

        {errors.bio && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.bio.message}
          </div>
        )}
      </div>

      {/* Ownership Type */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Ownership Type
          </h3>
          <p className="text-sm text-gray-600">
            Select the type of land ownership
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {ownershipTypes.map((type) => {
            const active = ownershipType === type;

            return (
              <motion.button
                key={type}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setValue("ownershipType", type, { shouldValidate: true })
                }
                className={`relative p-5 rounded-xl border text-left transition-all duration-200
                  ${
                    active
                      ? "border-[#b7cf8a] bg-[#b7cf8a]/10 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition
                      ${
                        active
                          ? "bg-[#b7cf8a]/30"
                          : "bg-gray-100"
                      }
                    `}
                  >
                    <Building2
                      className={`h-5 w-5 ${
                        active ? "text-[#6c8f3f]" : "text-gray-600"
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {type}
                    </div>
                  </div>

                  {active && (
                    <Check className="h-5 w-5 text-[#6c8f3f]" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {errors.ownershipType && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.ownershipType.message}
          </div>
        )}
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
            <User className="h-5 w-5 text-[#5f7e37]" />
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Build Trust with Farmers
            </h4>

            <p className="text-sm text-gray-700">
              A complete profile helps farmers understand your expectations and
              builds trust before they apply to lease your land.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}