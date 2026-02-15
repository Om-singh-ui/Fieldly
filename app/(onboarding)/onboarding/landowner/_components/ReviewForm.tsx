"use client";

import { Shield, Calendar, Users, Sparkles } from "lucide-react"; // Removed unused imports
import { UseFormReturn } from "react-hook-form";
import { LandownerOnboardingInput } from "@/lib/validations/onboarding";
import { motion } from "framer-motion";
import Image from "next/image";

interface ReviewFormProps {
  form: UseFormReturn<LandownerOnboardingInput>;
}

export function ReviewForm({ form }: ReviewFormProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  // These are used in the JSX for checkbox states
  watch("termsAccepted");
  watch("privacyPolicyAccepted");
  
  const phone = watch("phone");
  const state = watch("state");
  const district = watch("district");
  const bio = watch("bio");
  const ownershipType = watch("ownershipType");
  const paymentFrequency = watch("preferredPaymentFrequency");
  const contactMethod = watch("preferredContactMethod");

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
            src="/onboarding/review.png"
            alt="Review Icon"
            width={48}
            height={48}
            className="object-contain"
          />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review & Submit
        </h2>

        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Please review your information before submitting
        </p>
      </div>

      {/* Success Message */}
      <div className="bg-green-50 p-6 rounded-xl border border-green-100">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-6 w-6 text-green-600" />
          <h3 className="font-semibold text-green-900">You&apos;re almost there!</h3> {/* Fixed unescaped character */}
        </div>
        <p className="text-green-800 text-sm">
          Review your information and accept the terms to complete your profile setup.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-xl p-5 bg-white">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#b7cf8a]/20 flex items-center justify-center">
              <span className="text-xs text-[#5f7e37]">1</span>
            </div>
            Contact Information
          </h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Phone:</span> +91 {phone || "Not provided"}</p>
            <p><span className="text-gray-500">Location:</span> {district || "Not provided"}, {state || "Not provided"}</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 bg-white">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#b7cf8a]/20 flex items-center justify-center">
              <span className="text-xs text-[#5f7e37]">2</span>
            </div>
            Professional Profile
          </h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Ownership:</span> {ownershipType || "Not selected"}</p>
            <p className="truncate"><span className="text-gray-500">Bio:</span> {bio ? bio.substring(0, 50) + "..." : "Not provided"}</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 bg-white">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#b7cf8a]/20 flex items-center justify-center">
              <span className="text-xs text-[#5f7e37]">3</span>
            </div>
            Preferences
          </h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Payment:</span> {paymentFrequency || "Not selected"}</p>
            <p><span className="text-gray-500">Contact:</span> {contactMethod || "Not selected"}</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 bg-white">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#b7cf8a]/20 flex items-center justify-center">
              <span className="text-xs text-[#5f7e37]">4</span>
            </div>
            Notifications
          </h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Email:</span> {watch("emailNotifications") ? "✅ Enabled" : "❌ Disabled"}</p>
            <p><span className="text-gray-500">WhatsApp:</span> {watch("whatsappNotifications") ? "✅ Enabled" : "❌ Disabled"}</p>
          </div>
        </div>
      </div>

      {/* Terms Acceptance */}
      <div className="space-y-4 border-t border-gray-200 pt-6">
        <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            {...register("termsAccepted")}
            className="w-5 h-5 text-[#b7cf8a] rounded focus:ring-[#b7cf8a] mt-0.5"
          />
          <div>
            <p className="font-medium text-gray-900">I accept the Terms of Service</p>
            <p className="text-sm text-gray-500">
              By checking this, you agree to our terms of service, privacy policy, and the rules for land leasing on our platform.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            {...register("privacyPolicyAccepted")}
            className="w-5 h-5 text-[#b7cf8a] rounded focus:ring-[#b7cf8a] mt-0.5"
          />
          <div>
            <p className="font-medium text-gray-900">I accept the Privacy Policy</p>
            <p className="text-sm text-gray-500">
              I understand how my data will be used and protected as outlined in the privacy policy.
            </p>
          </div>
        </label>
      </div>

      {(errors.termsAccepted || errors.privacyPolicyAccepted) && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-600 text-center"
          role="alert"
        >
          Please accept both terms to continue
        </motion.p>
      )}

      {/* Benefits Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
          <Shield className="h-6 w-6 text-blue-600 mb-2" />
          <h4 className="font-medium text-gray-900">Verified Platform</h4>
          <p className="text-xs text-gray-600">All farmers are background verified</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
          <Calendar className="h-6 w-6 text-green-600 mb-2" />
          <h4 className="font-medium text-gray-900">Secure Payments</h4>
          <p className="text-xs text-gray-600">Escrow protected transactions</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
          <Users className="h-6 w-6 text-purple-600 mb-2" />
          <h4 className="font-medium text-gray-900">24/7 Support</h4>
          <p className="text-xs text-gray-600">Dedicated relationship manager</p>
        </div>
      </div>
    </motion.div>
  );
}