"use client";

import {
  Calendar,
  MessageSquare,
  Bell,
  AlertCircle,
  Check,
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

/* ================= CONFIG MAPS ================= */

const contactImageMap: Record<string, string> = {
  Call: "/icons/call.png",
  WhatsApp: "/icons/whatsapp.png",
  "App Chat": "/icons/msgpng.png",
  Email: "/icons/email.png",
};

const paymentImageMap: Record<string, string> = {
  Monthly: "/icons/monthley.png",
  Quarterly: "/icons/quaterly.png",
  "Half-Yearly": "/icons/first-quarter.png", 
  Annual: "/icons/annual.png", 
};

// Define a fallback image
const fallbackImage = "/icons/fallback.png";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-14 bg-gradient-to-b from-white to-[#f9fbf4] p-6 md:p-10 rounded-3xl"
    >
      {/* ================= HEADER ================= */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#b7cf8a]/25 rounded-2xl shadow-sm mb-6">
          <Image
            src="/onboarding/preference.png"
            alt="Preferences"
            width={48}
            height={48}
          />
        </div>

        <h2 className="text-3xl font-semibold text-gray-900">
          Your Preferences
        </h2>
        <p className="text-gray-600 text-sm max-w-md mx-auto mt-2">
          Customize how you receive payments and farmer communications.
        </p>
      </div>

      {/* ================= PAYMENT SECTION ================= */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#5f7e37]" />
            Payment Frequency
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Select how often you prefer rental payouts.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {paymentFrequencies.map((freq) => {
            const active = paymentFrequency === freq;

            return (
              <motion.button
                key={freq}
                type="button"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  setValue("preferredPaymentFrequency", freq, {
                    shouldValidate: true,
                  })
                }
                className={clsx(
                  "relative p-6 rounded-2xl border transition-all duration-300 group",
                  active
                    ? "bg-white border-[#b7cf8a] shadow-[0_0_0_3px_rgba(183,207,138,0.25)]"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-sm"
                )}
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={clsx(
                      "w-14 h-14 rounded-xl flex items-center justify-center transition",
                      active ? "bg-[#b7cf8a]/20" : "bg-white shadow-sm"
                    )}
                  >
                    <Image
                      src={paymentImageMap[freq] || fallbackImage}
                      alt={freq}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>

                  <span className="text-sm font-semibold text-gray-800">
                    {freq}
                  </span>
                </div>

                {active && (
                  <Check className="absolute top-3 right-3 h-5 w-5 text-[#6c8f3f]" />
                )}
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
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#5f7e37]" />
            Preferred Contact Method
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Choose how farmers can reach you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {contactMethods.map((method) => {
            const active = contactMethod === method;

            return (
              <motion.button
                key={method}
                type="button"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setValue("preferredContactMethod", method, {
                    shouldValidate: true,
                  })
                }
                className={clsx(
                  "relative p-6 rounded-2xl border transition-all duration-300 group text-left",
                  active
                    ? "border-[#b7cf8a] bg-white shadow-[0_0_0_3px_rgba(183,207,138,0.25)]"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-sm"
                )}
              >
                {active && (
                  <Check className="absolute top-3 right-3 h-5 w-5 text-[#6c8f3f]" />
                )}

                <div className="flex items-center gap-4">
                  <div
                    className={clsx(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition",
                      active
                        ? "bg-[#b7cf8a]/20 scale-105"
                        : "bg-gray-100 group-hover:bg-gray-200"
                    )}
                  >
                    <Image
                      src={contactImageMap[method] || fallbackImage}
                      alt={method}
                      width={30}
                      height={30}
                      className="object-contain"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">{method}</p>
                    <p className="text-sm text-gray-500">
                      Fast & secure communication
                    </p>
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

      {/* ================= NOTIFICATIONS (NEW TOGGLE) ================= */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
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
            icon: "/icons/email.png",
            value: emailNotifications,
          },
          {
            name: "whatsappNotifications",
            title: "WhatsApp Updates",
            desc: "Instant alerts on WhatsApp",
            icon: "/icons/whatsapp.png",
            value: whatsappNotifications,
          },
        ].map((item) => (
          <label
            key={item.name}
            className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={22}
                  height={22}
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>

            {/* Fancy sliding toggle */}
            <div className="relative">
              <input
                type="checkbox"
                {...register(
                  item.name as "emailNotifications" | "whatsappNotifications"
                )}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-gray-300 rounded-full transition peer-checked:bg-gradient-to-r peer-checked:from-[#b7cf8a] peer-checked:to-[#8fae5a]" />
              <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition peer-checked:translate-x-5" />
            </div>
          </label>
        ))}
      </div>

      {/* ================= INFO CARD ================= */}
      <div className="rounded-3xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#b7cf8a]/40 flex items-center justify-center">
            <Bell className="h-5 w-5 text-[#5f7e37]" />
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Stay in Control</h4>
            <p className="text-sm text-gray-700">
              You can update your preferences anytime from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}