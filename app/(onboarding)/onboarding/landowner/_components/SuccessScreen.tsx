"use client";

import {
  CheckCircle,
  ArrowRight,
  Shield,
  TrendingUp,
  Award,
  Users,
} from "lucide-react";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface SuccessScreenProps {
  role?: "farmer" | "landowner";
  onContinue?: () => void;
}

export function SuccessScreen({
  role = "landowner",
  onContinue,
}: SuccessScreenProps) {
  const router = useRouter();

  /* ============================================================
     HANDLE CONTINUE (PRODUCTION SAFE NAVIGATION)
  ============================================================ */

  const handleContinue = () => {
    try {
      // Allow override if provided
      if (onContinue) {
        onContinue();
        return;
      }

      // Correct dashboard routes
      if (role === "landowner") {
        router.replace("/landowner/dashboard");
      } else {
        router.replace("/farmer/dashboard");
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  /* ============================================================
     BENEFITS DATA
  ============================================================ */

  const benefits =
    role === "landowner"
      ? [
          {
            icon: Shield,
            title: "Profile Verified",
            description:
              "Your landowner profile is now active and verified.",
          },
          {
            icon: TrendingUp,
            title: "Listing Enabled",
            description:
              "You can now list your land parcels for leasing.",
          },
          {
            icon: Award,
            title: "Access Unlocked",
            description:
              "Premium features and verified farmers are available.",
          },
          {
            icon: Users,
            title: "Landowner Network",
            description:
              "You are now part of our verified landowner community.",
          },
        ]
      : [
          {
            icon: Shield,
            title: "Profile Verified",
            description:
              "Your farmer profile is now active and verified.",
          },
          {
            icon: TrendingUp,
            title: "Smart Matching Enabled",
            description:
              "We are identifying land opportunities suited to you.",
          },
          {
            icon: Award,
            title: "Access Unlocked",
            description:
              "Premium resources and verified listings are available.",
          },
          {
            icon: Users,
            title: "Farmer Network",
            description:
              "You are now part of our verified farmer ecosystem.",
          },
        ];

  /* ============================================================
     NEXT STEPS DATA
  ============================================================ */

  const nextSteps =
    role === "landowner"
      ? [
          "Your profile is now active",
          "You can start listing your land parcels",
          "Receive applications from verified farmers",
          "Connect with farmers and schedule visits",
        ]
      : [
          "Matching engine processes your requirements",
          "Your profile is now verified",
          "You receive curated land recommendations",
          "Connect with landowners and schedule visits",
        ];

  /* ============================================================
     UI
  ============================================================ */

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-12 space-y-12"
    >
      {/* Success Indicator */}

      <div className="text-center">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-[#b7cf8a]/20 flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-[#6c8f3f]" />
        </div>

        <h2 className="text-2xl font-semibold text-gray-900">
          Profile Completed Successfully
        </h2>

        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Your onboarding is complete.{" "}
          {role === "landowner"
            ? "Start listing your lands and connect with farmers."
            : "We are preparing personalized farmland matches for you."}
        </p>
      </div>

      {/* Status Badge */}

      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#b7cf8a]/40 bg-[#b7cf8a]/10">
          <span className="w-2 h-2 rounded-full bg-[#6c8f3f] animate-pulse" />

          <span className="text-sm font-medium text-[#5f7e37]">
            {role === "landowner"
              ? "Ready to list your lands"
              : "Matching lands based on your profile"}
          </span>
        </div>
      </div>

      {/* Benefits */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-sm transition-shadow"
          >
            <div className="w-10 h-10 rounded-lg bg-[#b7cf8a]/20 flex items-center justify-center mb-3">
              <benefit.icon className="h-5 w-5 text-[#6c8f3f]" />
            </div>

            <h3 className="font-medium text-gray-900">
              {benefit.title}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {benefit.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Next Steps */}

      <div className="max-w-xl mx-auto border border-gray-200 rounded-xl p-6 bg-white">
        <h3 className="font-medium text-gray-900 mb-4 text-center">
          What Happens Next
        </h3>

        <div className="space-y-3">
          {nextSteps.map((step, index) => (
            <div key={step} className="flex gap-3">
              <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                {index + 1}
              </div>

              <span className="text-sm text-gray-600">
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}

      <div className="text-center">
        <button
          type="button"
          onClick={handleContinue}
          className="
            inline-flex items-center gap-2 px-6 py-2.5 rounded-lg
            bg-[#b7cf8a] text-[#2f3d1c] font-medium
            hover:bg-[#a9c57a]
            active:scale-[0.98]
            transition-all duration-200
            shadow-sm hover:shadow
          "
        >
          {role === "landowner"
            ? "Go to Landowner Dashboard"
            : "Go to Farmer Dashboard"}

          <ArrowRight className="h-4 w-4" />
        </button>

        <p className="text-xs text-gray-400 mt-3">
          You can update your profile anytime from your dashboard.
        </p>
      </div>
    </motion.div>
  );
}
