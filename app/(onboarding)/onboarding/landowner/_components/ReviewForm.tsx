"use client";

import { Shield, Calendar, Users, Sparkles, CheckCircle2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { LandownerOnboardingInput } from "@/lib/validations/onboarding";
import { motion } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";

interface ReviewFormProps {
  form: UseFormReturn<LandownerOnboardingInput>;
}

export function ReviewForm({ form }: ReviewFormProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const phone = watch("phone");
  const state = watch("state");
  const district = watch("district");
  const bio = watch("bio");
  const ownershipType = watch("ownershipType");
  const paymentFrequency = watch("preferredPaymentFrequency");
  const contactMethod = watch("preferredContactMethod");
  const emailNotifications = watch("emailNotifications");
  const whatsappNotifications = watch("whatsappNotifications");

  const truncate = (text?: string, length = 100) =>
    text && text.length > length
      ? text.slice(0, length) + "..."
      : text || "Not provided";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative space-y-16"
    >
      {/* === HEADER === */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-[#b7cf8a]/25 rounded-2xl shadow-sm mb-5"
        >
          <Image
            src="/onboarding/review.png"
            alt="Preferences Icon"
            width={48}
            height={48}
            className="object-contain"
          />
        </motion.div>

        <div>
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900">
            Final Review
          </h2>
          <p className="text-gray-600 mt-2 max-w-lg mx-auto">
            Carefully review your details before activating your landowner
            profile.
          </p>
        </div>
      </div>

      {/* === SUCCESS BANNER === */}
      <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-xl p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#b7cf8a]/20 to-transparent opacity-60" />

        <div className="relative flex items-start gap-4">
          <Sparkles className="w-7 h-7 text-[#5f7e37]" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              You&apos;re almost done
            </h3>
            <p className="text-gray-600 mt-1 text-sm">
              Accept the agreements below to complete your onboarding.
            </p>
          </div>
        </div>
      </div>

      {/* === SUMMARY GRID === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            title: "Contact Information",
            items: [
              `Phone: +91 ${phone || "—"}`,
              `Location: ${district || "—"}, ${state || "—"}`,
            ],
          },
          {
            title: "Professional Profile",
            items: [
              `Ownership: ${ownershipType || "—"}`,
              `Bio: ${truncate(bio)}`,
            ],
          },
          {
            title: "Preferences",
            items: [
              `Payment: ${paymentFrequency || "—"}`,
              `Contact: ${contactMethod || "—"}`,
            ],
          },
          {
            title: "Notifications",
            items: [
              `Email: ${emailNotifications ? "Enabled" : "Disabled"}`,
              `WhatsApp: ${whatsappNotifications ? "Enabled" : "Disabled"}`,
            ],
          },
        ].map((section, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            className="rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-lg p-8 transition-all"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-6">
              {section.title}
            </h4>

            <div className="space-y-3 text-sm text-gray-700">
              {section.items.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#5f7e37] mt-1" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* === TERMS SECTION === */}
      <div className="space-y-6">
        {[
          {
            name: "termsAccepted",
            title: "I agree to the Terms of Service",
            desc: "You agree to platform rules, leasing policies, and service guidelines.",
          },
          {
            name: "privacyPolicyAccepted",
            title: "I agree to the Privacy Policy",
            desc: "You understand how your data is securely managed.",
          },
        ].map((item) => (
          <label
            key={item.name}
            className={clsx(
              "flex items-start gap-5 p-6 rounded-3xl border transition-all cursor-pointer",
              "bg-white/70 backdrop-blur-lg shadow-md",
              errors[item.name as keyof typeof errors]
                ? "border-red-400"
                : "border-white/40 hover:border-[#b7cf8a]/60",
            )}
          >
            <input
              type="checkbox"
              {...register(
                item.name as "termsAccepted" | "privacyPolicyAccepted",
              )}
              className="mt-1 w-6 h-6 accent-[#b7cf8a]"
            />

            <div>
              <p className="font-semibold text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
            </div>
          </label>
        ))}

        {(errors.termsAccepted || errors.privacyPolicyAccepted) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm text-center"
          >
            Please accept both agreements to proceed.
          </motion.p>
        )}
      </div>

      {/* === TRUST BADGES === */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            icon: Shield,
            title: "Verified Farmers",
            text: "Strict background verification process",
          },
          {
            icon: Calendar,
            title: "Secure Escrow",
            text: "Protected financial transactions",
          },
          {
            icon: Users,
            title: "Dedicated Support",
            text: "Relationship manager assistance",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-3xl p-6 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl shadow-lg border border-white/40 text-center"
          >
            <item.icon className="w-6 h-6 text-[#5f7e37] mx-auto mb-3" />
            <h5 className="font-semibold text-gray-900">{item.title}</h5>
            <p className="text-xs text-gray-600 mt-1">{item.text}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
