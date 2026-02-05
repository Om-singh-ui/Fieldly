// app/(onboarding)/onboarding/landowner/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  landownerOnboardingSchema, 
  type LandownerOnboardingInput 
} from "@/lib/validations/onboarding";
import { completeLandownerOnboarding } from "@/actions/onboarding.actions";
import { motion } from "framer-motion";
import { 
  Building, 
  MapPin, 
  FileText, 
  Landmark,
  Shield,
  DollarSign,
  Users,
  CheckCircle,
  Phone,
  Home,
  Banknote
} from "lucide-react";

export default function LandownerOnboardingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LandownerOnboardingInput>({
    resolver: zodResolver(landownerOnboardingSchema),
    defaultValues: {
      phone: "",
      state: "",
      district: "",
      bio: "",
    },
  });

  const onSubmit = handleSubmit(async (data: LandownerOnboardingInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await completeLandownerOnboarding(data);
      // AUTOMATIC REDIRECT after successful onboarding
      router.push("/post-auth");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <Building className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Complete Your Landowner Profile
          </h1>
          <p className="text-gray-600">
            Set up your profile to start listing land and connecting with verified farmers
          </p>
          <div className="mt-6 w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          {/* Section 1: Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Contact Information
              </h2>
            </div>

            <div className="space-y-6">
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
                    className="pl-14 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Pune"
                  />
                  {errors.district && (
                    <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 2: Professional Background */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Professional Background
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tell us about your land ownership experience
              </label>
              <textarea
                {...register("bio")}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Share details about your land portfolio, previous leasing experience, management style, or any specific requirements you have for tenants..."
              />
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Previous leasing experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Land management practices</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Tenant preferences</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Future land plans</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 3: What You Can List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Landmark className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                What You Can List on Fieldly
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/70 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Home className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Agricultural Land</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Crop-ready farmland with clear documentation</p>
                </div>
                
                <div className="p-4 bg-white/70 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Orchards</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Fruit orchards, plantation crops, and specialty farms</p>
                </div>
                
                <div className="p-4 bg-white/70 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Banknote className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Pasture Land</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Grazing land for livestock and dairy farming</p>
                </div>
              </div>
              
              <div className="p-4 bg-white/80 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">After completing your profile</span>, you&apos;ll be able to add detailed information about each land parcel including exact location, size, soil quality, irrigation facilities, and expected rental terms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 4: Platform Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-8 border border-blue-200"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Why Choose Fieldly for Land Leasing?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/80 rounded-xl">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Verified Farmers</h4>
                <p className="text-sm text-gray-600">
                  All farmers undergo background checks, experience validation, and crop suitability assessments
                </p>
              </div>
              <div className="text-center p-6 bg-white/80 rounded-xl">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Secure Payments</h4>
                <p className="text-sm text-gray-600">
                  Guaranteed monthly payments with digital contracts, escrow protection, and automated reminders
                </p>
              </div>
              <div className="text-center p-6 bg-white/80 rounded-xl">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Full Support</h4>
                <p className="text-sm text-gray-600">
                  Dedicated relationship manager, dispute resolution, and regular farm monitoring reports
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-blue-200">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">24-48 Hours</div>
                  <div className="text-sm text-gray-600">Average time to find tenants</div>
                </div>
                <div className="h-8 w-px bg-blue-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">95%</div>
                  <div className="text-sm text-gray-600">On-time payment rate</div>
                </div>
                <div className="h-8 w-px bg-blue-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-700">₹5-15K</div>
                  <div className="text-sm text-gray-600">Avg. monthly rent per acre</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Submit Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Setting up your landowner profile...
                </>
              ) : (
                <>
                  <Building className="h-6 w-6" />
                  Complete Landowner Onboarding
                </>
              )}
            </button>

            <p className="mt-4 text-sm text-gray-500">
              After submission, you&apos;ll be automatically redirected to your landowner dashboard
            </p>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                By completing your profile, you agree to our Terms of Service and Privacy Policy. 
                All information provided will be verified before your land listings go live.
              </p>
            </div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}