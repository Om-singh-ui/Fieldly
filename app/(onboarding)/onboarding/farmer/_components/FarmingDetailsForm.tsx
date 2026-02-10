"use client";

import { Crop, Calendar, AlertCircle, Check, } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FarmerOnboardingInput } from "@/lib/validations/onboarding";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface FarmingDetailsFormProps {
  form: UseFormReturn<FarmerOnboardingInput>;
}

// Crops organized by season
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
    ]
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
    ]
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
    ]
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
    ]
  }
};

const FARMING_TYPES = [
  { 
    value: "ORGANIC", 
    label: "Organic Farming", 
    desc: "Chemical-free, sustainable practices",
    icon: "🌿"
  },
  { 
    value: "COMMERCIAL", 
    label: "Commercial Farming", 
    desc: "Large-scale farming for profit",
    icon: "💰"
  },
  { 
    value: "SUBSISTENCE", 
    label: "Subsistence Farming", 
    desc: "Growing food for family consumption",
    icon: "🏠"
  },
  { 
    value: "MIXED", 
    label: "Mixed Farming", 
    desc: "Combination of crops and livestock",
    icon: "🐄"
  },
];

export function FarmingDetailsForm({ form }: FarmingDetailsFormProps) {
  const [selectedSeason, setSelectedSeason] = useState<string>("rabi");
  const { register, watch, setValue, formState: { errors } } = form;

  const selectedCrops = watch("primaryCrops");
  const farmingExperience = watch("farmingExperience");
  const farmingType = watch("farmingType");

  const toggleCrop = (cropName: string) => {
    const newCrops = selectedCrops.includes(cropName)
      ? selectedCrops.filter((c: string) => c !== cropName)
      : [...selectedCrops, cropName];
    setValue("primaryCrops", newCrops);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl mb-5">
          <Crop className="h-9 w-9 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Farming Details
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Tell us about your crops, experience, and farming style
        </p>
      </div>

      {/* Crop Selection */}
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Crop Selection</h3>
            <p className="text-sm text-gray-600 mt-1">
              Select crops based on seasons you cultivate in
            </p>
          </div>
          <div className="px-4 py-2 bg-emerald-50 rounded-xl">
            <span className="text-emerald-700 font-medium">
              {selectedCrops.length} crop{selectedCrops.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Season Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(CROPS_BY_SEASON).map(([key, season]) => (
            <button
              key={key}
              onClick={() => setSelectedSeason(key)}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedSeason === key
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">{season.icon}</span>
              {season.name}
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
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
          >
            {CROPS_BY_SEASON[selectedSeason as keyof typeof CROPS_BY_SEASON].crops.map((crop) => (
              <button
                key={crop.name}
                type="button"
                onClick={() => toggleCrop(crop.name)}
                className={`p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-3 relative ${
                  selectedCrops.includes(crop.name)
                    ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                <span className="text-3xl">{crop.icon}</span>
                <span className={`font-medium ${
                  selectedCrops.includes(crop.name) ? 'text-emerald-700' : 'text-gray-700'
                }`}>
                  {crop.name}
                </span>
                {selectedCrops.includes(crop.name) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Check className="h-4 w-4 text-white" />
                  </motion.div>
                )}
              </button>
            ))}
          </motion.div>
        </AnimatePresence>
        {errors.primaryCrops && (
          <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.primaryCrops.message}
          </div>
        )}
      </div>

      {/* Experience Slider */}
      <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-900">Farming Experience</h3>
            </div>
            <p className="text-sm text-gray-600">Years of agricultural experience</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">{farmingExperience}</div>
            <div className="text-sm text-gray-500">years</div>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="60"
          step="1"
          value={farmingExperience}
          onChange={(e) => setValue("farmingExperience", parseInt(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-emerald-100 to-emerald-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
        />

        <div className="flex justify-between text-sm text-gray-500 mt-4">
          <div className="text-center">
            <div className="font-medium">Beginner</div>
            <div className="text-xs">0-5 years</div>
          </div>
          <div className="text-center">
            <div className="font-medium">Intermediate</div>
            <div className="text-xs">6-15 years</div>
          </div>
          <div className="text-center">
            <div className="font-medium">Expert</div>
            <div className="text-xs">16+ years</div>
          </div>
        </div>
      </div>

      {/* Farming Type */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Farming Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FARMING_TYPES.map((type) => (
            <label
              key={type.value}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                farmingType === type.value
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-emerald-300'
              }`}
            >
              <input
                type="radio"
                {...register("farmingType")}
                value={type.value}
                className="sr-only"
              />
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  farmingType === type.value ? 'bg-emerald-100' : 'bg-gray-100'
                }`}>
                  {type.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{type.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{type.desc}</div>
                </div>
                {farmingType === type.value && (
                  <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );
}