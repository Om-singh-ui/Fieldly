"use client";

import { Calendar, AlertCircle, Check, Search } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FarmerOnboardingInput } from "@/lib/validations/onboarding";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import Image from "next/image";

interface FarmingDetailsFormProps {
  form: UseFormReturn<FarmerOnboardingInput>;
}

/* =========================================================
   DATA (ALL LOWERCASE — PRODUCTION SAFE)
========================================================= */

const CROPS_BY_SEASON = {
  rabi: {
    name: "Rabi (Winter)",
    icon: "/onboarding/winter.png",
    crops: [
      { name: "Wheat", icon: "/onboarding/wheat-sack.png" },
      { name: "Barley", icon: "/onboarding/barley.png" },
      { name: "Mustard", icon: "/onboarding/mustard.png" },
      { name: "Peas", icon: "/onboarding/pea.png" },
      { name: "Gram", icon: "/onboarding/gramchickpea.png" },
      { name: "Potato", icon: "/onboarding/potato.png" },
    ],
  },
  kharif: {
    name: "Kharif (Monsoon)",
    icon: "/onboarding/monsoon.png",
    crops: [
      { name: "Rice", icon: "/onboarding/rice.png" },
      { name: "Maize", icon: "/onboarding/maize.png" },
      { name: "Cotton", icon: "/onboarding/cotton.png" },
      { name: "Soybean", icon: "/onboarding/soy.png" },
      { name: "Groundnut", icon: "/onboarding/groundnut.png" },
      { name: "Turmeric", icon: "/onboarding/turmeric.png" },
    ],
  },
  zaid: {
    name: "Zaid (Summer)",
    icon: "/onboarding/summers.png",
    crops: [
      { name: "Watermelon", icon: "/onboarding/watermelon.png" },
      { name: "Cucumber", icon: "/onboarding/cucumber.png" },
      { name: "Sunflower", icon: "/onboarding/sunflower.png" },
      { name: "Pumpkin", icon: "/onboarding/pumpkin.png" },
      { name: "Muskmelon", icon: "/onboarding/muskmelon.png" },
      { name: "Fodder Crops", icon: "/onboarding/foddercrops.png" },
    ],
  },
};

const FARMING_TYPES = [
  {
    value: "ORGANIC",
    label: "Organic Farming",
    desc: "Chemical-free sustainable practices",
    icon: "/onboarding/organic.png",
  },
  {
    value: "COMMERCIAL",
    label: "Commercial Farming",
    desc: "Large-scale profit-driven cultivation",
    icon: "/onboarding/commercial.png",
  },
  {
    value: "SUBSISTENCE",
    label: "Subsistence Farming",
    desc: "Food grown for family consumption",
    icon: "/onboarding/subsistence.png",
  },
  {
    value: "MIXED",
    label: "Mixed Farming",
    desc: "Combination of crops and livestock",
    icon: "/onboarding/mixed.png",
  },
];

/* ========================================================= */

export function FarmingDetailsForm({ form }: FarmingDetailsFormProps) {
  const [selectedSeason, setSelectedSeason] = useState("rabi");
  const [search, setSearch] = useState("");

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const selectedCrops: string[] = watch("primaryCrops") || [];
  const farmingExperience: number = watch("farmingExperience") || 0;
  const farmingType: string | undefined = watch("farmingType");

  const toggleCrop = (crop: string) => {
    const updated = selectedCrops.includes(crop)
      ? selectedCrops.filter((c) => c !== crop)
      : [...selectedCrops, crop];

    setValue("primaryCrops", updated, { shouldValidate: true });
  };

  const filteredCrops = useMemo(() => {
    return CROPS_BY_SEASON[
      selectedSeason as keyof typeof CROPS_BY_SEASON
    ].crops.filter((crop) =>
      crop.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [selectedSeason, search]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      {/* HEADER */}
      <div className="text-center">
        <div className="mx-auto w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg mb-6">
          <Image
            src="/onboarding/wheaticon.png"
            alt="Farming"
            width={55}
            height={55}
            priority
          />
        </div>

        <h2 className="text-3xl font-bold text-gray-900">
          Farming Details
        </h2>

        <p className="text-gray-500 mt-2">
          Select your crops, experience level, and farming type.
        </p>
      </div>

      {/* Crop Section */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">
            Crop Selection
          </h3>

          <div className="px-4 py-2 rounded-full bg-[#b7cf8a]/20 text-[#4d672c] text-sm font-medium">
            {selectedCrops.length} Selected
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search crops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#b7cf8a] focus:ring-2 focus:ring-[#b7cf8a]/30 outline-none text-sm"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          {Object.entries(CROPS_BY_SEASON).map(([key, season]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedSeason(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition ${
                selectedSeason === key
                  ? "bg-[#b7cf8a] text-[#2f3d1c] shadow"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <Image src={season.icon} alt={season.name} width={18} height={18} />
              {season.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSeason}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {filteredCrops.map((crop) => {
              const active = selectedCrops.includes(crop.name);

              return (
                <motion.button
                  key={crop.name}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -4 }}
                  onClick={() => toggleCrop(crop.name)}
                  className={`relative p-6 rounded-3xl border transition ${
                    active
                      ? "border-[#b7cf8a] bg-[#b7cf8a]/20 shadow-md"
                      : "border-gray-200 bg-white hover:shadow-lg"
                  }`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <Image
                      src={crop.icon}
                      alt={crop.name}
                      width={40}
                      height={40}
                      loading="lazy"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {crop.name}
                    </span>
                  </div>

                  {active && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#b7cf8a] flex items-center justify-center shadow">
                      <Check className="h-4 w-4 text-[#2f3d1c]" />
                    </div>
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
      <div className="rounded-2xl border border-[#b7cf8a]/40 bg-[#b7cf8a]/10 p-6 transition hover:shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <Calendar className="h-4 w-4 text-[#5f7e37]" />
            </div>

            <h3 className="text-base font-semibold text-gray-900">
              Farming Experience
            </h3>
          </div>

          <div className="text-right">
            <div className="text-2xl font-semibold text-[#5f7e37]">
              {farmingExperience}
            </div>
            <div className="text-xs text-gray-500">Years</div>
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={60}
          value={farmingExperience}
          {...register("farmingExperience", { valueAsNumber: true })}
          onChange={(e) =>
            setValue("farmingExperience", Number(e.target.value), {
              shouldValidate: true,
            })
          }
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#b7cf8a]/40"
        />
      </div>

      {/* Farming Type */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Farming Type</h3>

        <div className="grid md:grid-cols-2 gap-5">
          {FARMING_TYPES.map((type) => {
            const active = farmingType === type.value;

            return (
              <label
                key={type.value}
                className={`cursor-pointer p-6 rounded-3xl border transition ${
                  active
                    ? "border-[#b7cf8a] bg-[#b7cf8a]/20 shadow-md"
                    : "border-gray-200 bg-white hover:shadow-lg"
                }`}
              >
                <input
                  type="radio"
                  value={type.value}
                  {...register("farmingType", { required: true })}
                  className="hidden"
                />

                <div className="flex items-center gap-4">
                  <Image
                    src={type.icon}
                    alt={type.label}
                    width={42}
                    height={42}
                  />

                  <div>
                    <div className="font-semibold text-gray-900">
                      {type.label}
                    </div>
                    <div className="text-sm text-gray-500">
                      {type.desc}
                    </div>
                  </div>

                  {active && (
                    <div className="ml-auto w-6 h-6 rounded-full bg-[#b7cf8a] flex items-center justify-center">
                      <Check className="h-4 w-4 text-[#2f3d1c]" />
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        {errors.farmingType && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            Please select a farming type.
          </div>
        )}
      </div>
    </motion.div>
  );
}