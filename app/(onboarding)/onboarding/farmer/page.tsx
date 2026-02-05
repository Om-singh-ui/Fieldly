// app/(onboarding)/onboarding/farmer/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  farmerOnboardingSchema, 
  type FarmerOnboardingInput 
} from "@/lib/validations/onboarding";
import { completeFarmerOnboarding } from "@/actions/onboarding.actions";
import { motion } from "framer-motion";
import { 
  Leaf, 
  Calendar, 
  MapPin, 
  Crop, 
  Award, 
  Droplets,
  Tractor,
  CheckCircle,
  User
} from "lucide-react";

const CROPS = [
  "Wheat", "Rice", "Maize", "Sugarcane", "Cotton", "Soybean",
  "Pulses", "Oilseeds", "Vegetables", "Fruits", "Spices", "Flowers",
  "Tea", "Coffee", "Rubber", "Jute", "Tobacco", "Medicinal Plants"
];

const FARMING_TYPES = [
  { value: "SUBSISTENCE", label: "Subsistence Farming", desc: "Growing food for family consumption" },
  { value: "COMMERCIAL", label: "Commercial Farming", desc: "Large-scale farming for profit" },
  { value: "ORGANIC", label: "Organic Farming", desc: "Chemical-free, sustainable practices" },
  { value: "MIXED", label: "Mixed Farming", desc: "Combination of crops and livestock" },
];

export default function FarmerOnboardingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FarmerOnboardingInput>({
    resolver: zodResolver(farmerOnboardingSchema),
    defaultValues: {
      primaryCrops: [],
      farmingExperience: 0,
      farmingType: "COMMERCIAL",
      requiredLandSize: 1,
      leaseDuration: 12,
      phone: "",
      state: "",
      district: "",
      bio: "",
      irrigationNeeded: false,
      equipmentAccess: false,
    },
  });

  const selectedCrops = watch("primaryCrops");
  const landSize = watch("requiredLandSize");
  const leaseDuration = watch("leaseDuration");
  const farmingExperience = watch("farmingExperience");
  
  // Get current values for boolean fields
  const irrigationNeeded = getValues("irrigationNeeded");
  const equipmentAccess = getValues("equipmentAccess");

  const toggleCrop = (crop: string) => {
    const newCrops = selectedCrops.includes(crop)
      ? selectedCrops.filter((c: string) => c !== crop)
      : [...selectedCrops, crop];
    setValue("primaryCrops", newCrops);
  };

  const onSubmit = async (data: FarmerOnboardingInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert numeric fields to strings to match FarmerFormData type
      const formDataForAction = {
        ...data,
        farmingExperience: data.farmingExperience.toString(),
        requiredLandSize: data.requiredLandSize.toString(),
        leaseDuration: data.leaseDuration.toString(),
      };
      
      await completeFarmerOnboarding(formDataForAction);
      // AUTOMATIC REDIRECT after successful onboarding
      router.push("/post-auth");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle range inputs properly
  const handleRangeChange = (field: keyof FarmerOnboardingInput, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setValue(field, numValue);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <Leaf className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Complete Your Farmer Profile
          </h1>
          <p className="text-gray-600">
            Tell us about your farming needs to find the perfect land match
          </p>
          <div className="mt-6 w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <motion.div 
              className="h-full bg-green-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Basic Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">+91</span>
                  </div>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="pl-14 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register("state")}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Maharashtra"
                  />
                </div>
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District *
                </label>
                <input
                  type="text"
                  {...register("district")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Pune"
                />
                {errors.district && (
                  <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  {...register("bio")}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Tell us about your farming journey..."
                />
              </div>
            </div>
          </motion.div>

          {/* Section 2: Farming Expertise */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Crop className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Farming Expertise
              </h2>
            </div>

            <div className="space-y-6">
              {/* Primary Crops */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What crops do you specialize in? *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {CROPS.map((crop) => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => toggleCrop(crop)}
                      className={`
                        px-4 py-3 rounded-lg border transition-all duration-200 text-sm
                        ${selectedCrops.includes(crop)
                          ? "bg-green-50 border-green-500 text-green-700"
                          : "bg-gray-50 border-gray-200 hover:border-green-300"
                        }
                      `}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
                {errors.primaryCrops && (
                  <p className="mt-2 text-sm text-red-600">{errors.primaryCrops.message}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Selected: {selectedCrops.length} crop{selectedCrops.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Farming Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Farming Experience *
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="1"
                    value={farmingExperience}
                    onChange={(e) => handleRangeChange("farmingExperience", e.target.value)}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="w-24 text-center">
                    <span className="text-2xl font-bold text-green-600">
                      {farmingExperience}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">years</span>
                  </div>
                </div>
                {errors.farmingExperience && (
                  <p className="mt-1 text-sm text-red-600">{errors.farmingExperience.message}</p>
                )}
              </div>

              {/* Farming Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What type of farming do you practice? *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {FARMING_TYPES.map((type) => (
                    <label
                      key={type.value}
                      className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                        ${watch("farmingType") === type.value
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        {...register("farmingType")}
                        value={type.value}
                        className="sr-only"
                      />
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                          watch("farmingType") === type.value
                            ? "border-green-500 bg-green-500"
                            : "border-gray-400"
                        }`}>
                          {watch("farmingType") === type.value && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{type.label}</div>
                          <div className="text-sm text-gray-600 mt-1">{type.desc}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 3: Land Requirements */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Land Requirements
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Land Size */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Required Land Size (acres) *
                  </label>
                  <span className="text-2xl font-bold text-purple-600">
                    {landSize} acres
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1000"
                  step="0.1"
                  value={landSize}
                  onChange={(e) => handleRangeChange("requiredLandSize", e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>0.1 acre</span>
                  <span>1000 acres</span>
                </div>
                {errors.requiredLandSize && (
                  <p className="mt-1 text-sm text-red-600">{errors.requiredLandSize.message}</p>
                )}
              </div>

              {/* Lease Duration */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Preferred Lease Duration (months) *
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold text-purple-600">
                      {leaseDuration} months
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="120"
                  step="1"
                  value={leaseDuration}
                  onChange={(e) => handleRangeChange("leaseDuration", e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>1 month</span>
                  <span>10 years</span>
                </div>
                {errors.leaseDuration && (
                  <p className="mt-1 text-sm text-red-600">{errors.leaseDuration.message}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Section 4: Infrastructure Needs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Droplets className="h-5 w-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Infrastructure & Equipment Needs
              </h2>
            </div>

            <div className="space-y-6">
              {/* Irrigation Needs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Do you need irrigation facilities on the land? *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={irrigationNeeded === true}
                      onChange={() => setValue("irrigationNeeded", true)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      irrigationNeeded === true
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}>
                      {irrigationNeeded === true && (
                        <CheckCircle className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className="text-gray-700">Yes, I need irrigation</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={irrigationNeeded === false}
                      onChange={() => setValue("irrigationNeeded", false)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      irrigationNeeded === false
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}>
                      {irrigationNeeded === false && (
                        <CheckCircle className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className="text-gray-700">No, I have my own irrigation</span>
                  </label>
                </div>
                {errors.irrigationNeeded && (
                  <p className="mt-2 text-sm text-red-600">{errors.irrigationNeeded.message}</p>
                )}
              </div>

              {/* Equipment Access */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Do you have access to farming equipment? *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={equipmentAccess === true}
                      onChange={() => setValue("equipmentAccess", true)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      equipmentAccess === true
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}>
                      {equipmentAccess === true && (
                        <Tractor className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className="text-gray-700">Yes, I have equipment</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={equipmentAccess === false}
                      onChange={() => setValue("equipmentAccess", false)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      equipmentAccess === false
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}>
                      {equipmentAccess === false && (
                        <Tractor className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className="text-gray-700">No, I need equipment access</span>
                  </label>
                </div>
                {errors.equipmentAccess && (
                  <p className="mt-2 text-sm text-red-600">{errors.equipmentAccess.message}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Benefits you&apos;ll get as a Fieldly Farmer:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Land Matching</div>
                  <div className="text-sm text-gray-600">Find land that matches your crop needs</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Lease Support</div>
                  <div className="text-sm text-gray-600">Legal agreements & documentation</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Droplets className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Soil Monitoring</div>
                  <div className="text-sm text-gray-600">AI-powered soil health reports</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Financial Support</div>
                  <div className="text-sm text-gray-600">Access to loans & subsidies</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Submit Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Setting up your farm profile...
                </>
              ) : (
                <>
                  <Leaf className="h-6 w-6" />
                  Complete Farmer Onboarding
                </>
              )}
            </button>

            <p className="mt-4 text-sm text-gray-500">
              After submission, you&apos;ll be automatically redirected to your farmer dashboard
            </p>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}