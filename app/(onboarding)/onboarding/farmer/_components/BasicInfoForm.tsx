"use client";

import { User, MapPin, Phone, AlertCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FarmerOnboardingInput } from "@/lib/validations/onboarding";
import { motion } from "framer-motion";

interface BasicInfoFormProps {
  form: UseFormReturn<FarmerOnboardingInput>;
}

const STATES = [
  "Maharashtra", "Punjab", "Haryana", "Uttar Pradesh", "Rajasthan",
  "Madhya Pradesh", "Karnataka", "Tamil Nadu", "Gujarat", "West Bengal",
  "Bihar", "Andhra Pradesh", "Telangana", "Kerala", "Odisha"
];

export function BasicInfoForm({ form }: BasicInfoFormProps) {
  const { register, formState: { errors } } = form;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl mb-5">
          <User className="h-9 w-9 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Basic Information
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Let&apos;s start with your contact details and location information
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            <Phone className="inline h-4 w-4 mr-1" />
            Mobile Number *
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-600 text-sm font-medium">+91</span>
            </div>
            <input
              type="tel"
              {...register("phone")}
              className="pl-14 w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="98765 43210"
              maxLength={10}
            />
          </div>
          {errors.phone && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.phone.message}
            </div>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            State *
          </label>
          <div className="relative">
            <select
              {...register("state")}
              className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
            >
              <option value="">Select your state</option>
              {STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45"></div>
            </div>
          </div>
          {errors.state && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.state.message}
            </div>
          )}
        </div>

        {/* District */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            District *
          </label>
          <input
            type="text"
            {...register("district")}
            className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Enter your district name"
          />
          {errors.district && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.district.message}
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Farming Experience & Background
            <span className="text-gray-500 font-normal ml-1">(Optional)</span>
          </label>
          <textarea
            {...register("bio")}
            rows={4}
            className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
            placeholder="Tell us about your farming journey, experience, achievements, or special techniques you use..."
          />
          <p className="mt-2 text-sm text-gray-500">
            This helps us understand your expertise and provide better recommendations
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mt-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Phone className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Why we need this?</h4>
            <p className="text-sm text-gray-600">
              Your contact information helps us connect you with landowners in your preferred area. 
              Location details ensure we match you with suitable agricultural land nearby.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}