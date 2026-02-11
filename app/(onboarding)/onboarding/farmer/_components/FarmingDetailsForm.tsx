"use client";

import { Calendar, AlertCircle, Check } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FarmerOnboardingInput } from "@/lib/validations/onboarding";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

interface FarmingDetailsFormProps {
  form: UseFormReturn<FarmerOnboardingInput>;
}

const CROPS_BY_SEASON = {
  rabi: {
    name: "Rabi (Winter)",
    icon: "❄️",
    crops: [
      { name: "Wheat", icon: "🌾" },
      { name: "Barley", icon: "🌾" },
      { name: "Mustard", icon: "🟡" },
      { name: "Peas", icon: "🫛" },
      { name: "Gram", icon: "🥜" },
      { name: "Potato", icon: "🥔" },
    ],
  },
  kharif: {
    name: "Kharif (Monsoon)",
    icon: "🌧️",
    crops: [
      { name: "Rice", icon: "🍚" },
      { name: "Maize", icon: "🌽" },
      { name: "Cotton", icon: "🧵" },
      { name: "Soybean", icon: "🫘" },
      { name: "Groundnut", icon: "🥜" },
      { name: "Turmeric", icon: "🟡" },
    ],
  },
  zaid: {
    name: "Zaid (Summer)",
    icon: "☀️",
    crops: [
      { name: "Watermelon", icon: "🍉" },
      { name: "Cucumber", icon: "🥒" },
      { name: "Sunflower", icon: "🌻" },
      { name: "Pumpkin", icon: "🎃" },
      { name: "Muskmelon", icon: "🍈" },
      { name: "Fodder Crops", icon: "🌱" },
    ],
  },
  perennial: {
    name: "Perennial",
    icon: "🔄",
    crops: [
      { name: "Sugarcane", icon: "🎋" },
      { name: "Coffee", icon: "☕" },
      { name: "Tea", icon: "🍃" },
      { name: "Rubber", icon: "🛞" },
      { name: "Fruits", icon: "🍎" },
      { name: "Spices", icon: "🌶️" },
    ],
  },
};

const FARMING_TYPES = [
  {
    value: "ORGANIC",
    label: "Organic Farming",
    desc: "Chemical-free sustainable practices",
    icon: "🌿",
  },
  {
    value: "COMMERCIAL",
    label: "Commercial Farming",
    desc: "Large-scale profit-driven cultivation",
    icon: "💰",
  },
  {
    value: "SUBSISTENCE",
    label: "Subsistence Farming",
    desc: "Food grown for family consumption",
    icon: "🏠",
  },
  {
    value: "MIXED",
    label: "Mixed Farming",
    desc: "Combination of crops and livestock",
    icon: "🐄",
  },
];

export function FarmingDetailsForm({ form }: FarmingDetailsFormProps) {
  const [selectedSeason, setSelectedSeason] = useState("rabi");

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const selectedCrops = watch("primaryCrops") || [];
  const farmingExperience = watch("farmingExperience") || 0;
  const farmingType = watch("farmingType");

  const toggleCrop = (crop: string) => {
    const updated = selectedCrops.includes(crop)
      ? selectedCrops.filter((c: string) => c !== crop)
      : [...selectedCrops, crop];

    setValue("primaryCrops", updated);
  };

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
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-sm mb-5"
        >
          <Image
            src="/onboarding/wheaticon.png"
            alt="Farming Icon"
            width={50}
            height={50}
            className="object-contain"
          />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Farming Details
        </h2>

        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Share your crop preferences, experience level, and farming approach.
        </p>
      </div>

      {/* Crop Selection */}
      <div className="space-y-7">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Crop Selection
            </h3>
            <p className="text-sm text-gray-600">
              Choose crops cultivated during different seasons
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-[#b7cf8a]/20 border border-[#b7cf8a]/40">
            <span className="text-[#5f7e37] font-semibold text-sm">
              {selectedCrops.length} Selected
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(CROPS_BY_SEASON).map(([key, season]) => (
            <button
              key={key}
              onClick={() => setSelectedSeason(key)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                selectedSeason === key
                  ? "bg-[#b7cf8a] text-[#3e5324] shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {season.icon} {season.name}
            </button>
          ))}
        </div>

        {/* Crops Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSeason}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {CROPS_BY_SEASON[
              selectedSeason as keyof typeof CROPS_BY_SEASON
            ].crops.map((crop) => {
              const active = selectedCrops.includes(crop.name);

              return (
                <motion.button
                  key={crop.name}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => toggleCrop(crop.name)}
                  className={`relative p-5 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                    active
                      ? "border-[#b7cf8a] bg-[#b7cf8a]/20 shadow-sm"
                      : "border-gray-200 bg-white hover:border-[#b7cf8a]/60 hover:shadow-md"
                  }`}
                >
                  <span className="text-3xl">{crop.icon}</span>

                  <span
                    className={`font-medium text-sm ${
                      active ? "text-[#4d672c]" : "text-gray-700"
                    }`}
                  >
                    {crop.name}
                  </span>

                  {active && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#b7cf8a] flex items-center justify-center shadow"
                    >
                      <Check className="h-4 w-4 text-[#3e5324]" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {errors.primaryCrops && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.primaryCrops.message}
          </div>
        )}
      </div>

      {/* Experience */}
      <div className="rounded-2xl border border-[#b7cf8a]/40 bg-[#b7cf8a]/10 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-5 w-5 text-[#5f7e37]" />
              <h3 className="font-semibold text-gray-900">
                Farming Experience
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Total years of agricultural practice
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-[#5f7e37]">
              {farmingExperience}
            </div>
            <div className="text-xs text-gray-500">Years</div>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="60"
          value={farmingExperience}
          onChange={(e) =>
            setValue("farmingExperience", Number(e.target.value))
          }
          className="w-full h-2 rounded-lg appearance-none bg-[#b7cf8a]/40 cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-6
          [&::-webkit-slider-thumb]:w-6
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-[#6c8f3f]
          [&::-webkit-slider-thumb]:border-4
          [&::-webkit-slider-thumb]:border-white
          [&::-webkit-slider-thumb]:shadow"
        />
      </div>

      {/* Farming Type */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Farming Type
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {FARMING_TYPES.map((type) => {
            const active = farmingType === type.value;

            return (
              <label
                key={type.value}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  active
                    ? "border-[#b7cf8a] bg-[#b7cf8a]/20"
                    : "border-gray-200 hover:border-[#b7cf8a]/60"
                }`}
              >
                <input
                  type="radio"
                  {...register("farmingType")}
                  value={type.value}
                  className="hidden"
                />

                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                      active ? "bg-[#b7cf8a]/40" : "bg-gray-100"
                    }`}
                  >
                    {type.icon}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {type.label}
                    </div>
                    <div className="text-sm text-gray-600">{type.desc}</div>
                  </div>

                  {active && (
                    <div className="w-6 h-6 rounded-full bg-[#b7cf8a] flex items-center justify-center">
                      <Check className="h-4 w-4 text-[#3e5324]" />
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
