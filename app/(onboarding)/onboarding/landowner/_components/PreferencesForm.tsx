"use client";

import {
  Bell,
  Calendar,
  MessageSquare,
  Mail,
  Phone,
  AlertCircle,
  Check,
  type LucideIcon,
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import {
  LandownerOnboardingInput,
  paymentFrequencies,
  contactMethods,
} from "@/lib/validations/onboarding";
import { motion } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";

interface PreferencesFormProps {
  form: UseFormReturn<LandownerOnboardingInput>;
}

export function PreferencesForm({ form }: PreferencesFormProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const paymentFrequency = watch("preferredPaymentFrequency");
  const contactMethod = watch("preferredContactMethod");
  const emailNotifications = watch("emailNotifications");
  const whatsappNotifications = watch("whatsappNotifications");

  // ✅ Properly typed icon map (no `any`)
  const iconMap: Record<string, LucideIcon> = {
    Call: Phone,
    WhatsApp: MessageSquare,
    "App Chat": Bell,
    Email: Mail,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -25 }}
      transition={{ duration: 0.35 }}
      className="space-y-12"
    >
      {/* ================= HEADER ================= */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-[#b7cf8a]/25 rounded-2xl shadow-sm mb-5"
        >
          <Image
            src="/onboarding/preference.png"
            alt="Preferences Icon"
            width={48}
            height={48}
            className="object-contain"
          />
        </motion.div>

        <h2 className="text-3xl font-semibold text-gray-900">
          Your Preferences
        </h2>

        <p className="text-gray-600 text-sm max-w-md mx-auto mt-2">
          Customize how you receive payments and farmer communications.
        </p>
      </div>

      {/* ================= PAYMENT FREQUENCY ================= */}
      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#5f7e37]" />
            Payment Frequency
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Select how often you prefer rental payouts.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {paymentFrequencies.map((freq) => {
            const active = paymentFrequency === freq;

            return (
              <motion.button
                key={freq}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() =>
                  setValue("preferredPaymentFrequency", freq, {
                    shouldValidate: true,
                  })
                }
                className={clsx(
                  "relative px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                  active
                    ? "bg-[#b7cf8a] text-[#3e5324] border-[#b7cf8a] shadow-sm"
                    : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                )}
              >
                {active && (
                  <Check className="absolute top-2 right-2 h-4 w-4" />
                )}
                {freq}
              </motion.button>
            );
          })}
        </div>

        {errors.preferredPaymentFrequency && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.preferredPaymentFrequency.message}
          </div>
        )}
      </div>

      {/* ================= CONTACT METHOD ================= */}
      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#5f7e37]" />
            Preferred Contact Method
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Choose how farmers can reach you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {contactMethods.map((method) => {
            const active = contactMethod === method;
            const Icon = iconMap[method];

            return (
              <motion.button
                key={method}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setValue("preferredContactMethod", method, {
                    shouldValidate: true,
                  })
                }
                className={clsx(
                  "relative p-5 rounded-2xl border text-left transition-all",
                  active
                    ? "border-[#b7cf8a] bg-[#b7cf8a]/10"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                {active && (
                  <Check className="absolute top-3 right-3 h-5 w-5 text-[#6c8f3f]" />
                )}

                <div className="flex items-center gap-4">
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      active
                        ? "bg-[#b7cf8a]/30"
                        : "bg-gray-100"
                    )}
                  >
                    <Icon
                      className={clsx(
                        "h-5 w-5",
                        active
                          ? "text-[#6c8f3f]"
                          : "text-gray-600"
                      )}
                    />
                  </div>

                  <div className="font-medium text-gray-900">
                    {method}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {errors.preferredContactMethod && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.preferredContactMethod.message}
          </div>
        )}
      </div>

      {/* ================= NOTIFICATION TOGGLES ================= */}
      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#5f7e37]" />
            Notification Preferences
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Control how you receive updates.
          </p>
        </div>

        {[
          {
            name: "emailNotifications",
            title: "Email Notifications",
            desc: "Receive updates via email",
            icon: Mail,
            value: emailNotifications,
          },
          {
            name: "whatsappNotifications",
            title: "WhatsApp Updates",
            desc: "Instant alerts on WhatsApp",
            icon: MessageSquare,
            value: whatsappNotifications,
          },
        ].map((item) => (
          <label
            key={item.name}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">
                  {item.title}
                </p>
                <p className="text-sm text-gray-500">
                  {item.desc}
                </p>
              </div>
            </div>

            {/* Modern Toggle */}
            <div className="relative">
              <input
                type="checkbox"
                {...register(
                  item.name as
                    | "emailNotifications"
                    | "whatsappNotifications"
                )}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-[#b7cf8a] transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-5" />
            </div>
          </label>
        ))}
      </div>

      {/* ================= INFO CARD ================= */}
      <div className="bg-[#b7cf8a]/20 border border-[#b7cf8a]/40 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#b7cf8a]/40 flex items-center justify-center">
            <Bell className="h-5 w-5 text-[#5f7e37]" />
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Stay in Control
            </h4>
            <p className="text-sm text-gray-700">
              You can update your preferences anytime from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}