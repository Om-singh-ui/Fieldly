"use client";

import { Bell, Calendar, MessageSquare, Mail, Phone, AlertCircle, Check } from "lucide-react"; // Added Phone import
import { UseFormReturn } from "react-hook-form";
import { 
  LandownerOnboardingInput, 
  paymentFrequencies, 
  contactMethods 
} from "@/lib/validations/onboarding";
import { motion } from "framer-motion";
import Image from "next/image";

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
  // These are used in the JSX for checkbox states
  watch("emailNotifications");
  watch("whatsappNotifications");

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
            src="/onboarding/preference.png"
            alt="Preferences Icon"
            width={48}
            height={48}
            className="object-contain"
          />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Preferences
        </h2>

        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Set your preferred payment frequency and communication methods.
        </p>
      </div>

      {/* Payment Frequency */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            <Calendar className="inline h-5 w-5 mr-2 text-[#5f7e37]" />
            Payment Frequency
          </h3>
          <p className="text-sm text-gray-600">
            How often do you prefer to receive rental payments?
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {paymentFrequencies.map((freq) => {
            const active = paymentFrequency === freq;

            return (
              <motion.button
                key={freq}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setValue("preferredPaymentFrequency", freq)}
                className={`
                  px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition
                  ${active
                    ? "bg-[#b7cf8a] text-[#3e5324] shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {active && <Check className="h-4 w-4" />}
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

      {/* Contact Method */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            <MessageSquare className="inline h-5 w-5 mr-2 text-[#5f7e37]" />
            Preferred Contact Method
          </h3>
          <p className="text-sm text-gray-600">
            How would you like to be contacted by farmers?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {contactMethods.map((method) => {
            const active = contactMethod === method;

            return (
              <motion.button
                key={method}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => setValue("preferredContactMethod", method)}
                className={`
                  relative p-5 rounded-xl border text-left
                  transition-all duration-200
                  ${active
                    ? "border-[#b7cf8a] bg-[#b7cf8a]/10"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${active ? "bg-[#b7cf8a]/30" : "bg-gray-100"}
                  `}>
                    {method === "Call" && <Phone className={`h-5 w-5 ${active ? "text-[#6c8f3f]" : "text-gray-600"}`} />}
                    {method === "WhatsApp" && <MessageSquare className={`h-5 w-5 ${active ? "text-[#6c8f3f]" : "text-gray-600"}`} />}
                    {method === "App Chat" && <Bell className={`h-5 w-5 ${active ? "text-[#6c8f3f]" : "text-gray-600"}`} />}
                    {method === "Email" && <Mail className={`h-5 w-5 ${active ? "text-[#6c8f3f]" : "text-gray-600"}`} />}
                  </div>

                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{method}</div>
                  </div>

                  {active && (
                    <Check className="h-5 w-5 text-[#6c8f3f]" />
                  )}
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

      {/* Notification Preferences */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            <Bell className="inline h-5 w-5 mr-2 text-[#5f7e37]" />
            Notification Preferences
          </h3>
          <p className="text-sm text-gray-600">
            Choose how you want to receive updates
          </p>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
            </div>
            <input
              type="checkbox"
              {...register("emailNotifications")}
              className="w-5 h-5 text-[#b7cf8a] rounded focus:ring-[#b7cf8a]"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">WhatsApp Updates</p>
                <p className="text-sm text-gray-500">Get instant updates on WhatsApp</p>
              </div>
            </div>
            <input
              type="checkbox"
              {...register("whatsappNotifications")}
              className="w-5 h-5 text-[#b7cf8a] rounded focus:ring-[#b7cf8a]"
            />
          </label>
        </div>
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#b7cf8a]/20 border border-[#b7cf8a]/40 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#b7cf8a]/40 flex items-center justify-center">
            <Bell className="h-5 w-5 text-[#5f7e37]" />
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Stay in Control
            </h4>

            <p className="text-sm text-gray-700">
              Set your preferences to receive timely updates about applications, 
              payments, and farmer communications.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}