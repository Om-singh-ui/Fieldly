"use client";

import Image from "next/image";
import {
  AlertCircle,
  Check,
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FarmerOnboardingInput } from "@/lib/validations/onboarding";
import { motion } from "framer-motion";
import React from "react";

interface InfrastructureFormProps {
  form: UseFormReturn<FarmerOnboardingInput>;
}

/* ---------- Reusable Premium Option Card ---------- */

interface OptionCardProps {
  active: boolean;
  imageSrc: string;
  title: string;
  description: string;
  onClick: () => void;
}

function OptionCard({
  active,
  imageSrc,
  title,
  description,
  onClick,
}: OptionCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`
        relative w-full p-6 rounded-2xl text-left
        border transition-all duration-300
        backdrop-blur-sm
        ${
          active
            ? "border-[#6c8f3f] bg-[#f4f8ec] shadow-md"
            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
        }
      `}
    >
      <div className="flex items-start gap-5">
        {/* Image Icon Container */}
        <div
          className={`
            relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0
            ${active ? "ring-2 ring-[#6c8f3f]" : ""}
          `}
        >
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="font-semibold text-gray-900 text-sm">
            {title}
          </div>
          <div className="text-sm text-gray-500 mt-1 leading-relaxed">
            {description}
          </div>
        </div>

        {active && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 right-4"
          >
            <Check className="h-5 w-5 text-[#6c8f3f]" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

/* ---------- Main Form ---------- */

export function InfrastructureForm({ form }: InfrastructureFormProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const irrigationNeeded = watch("irrigationNeeded");
  const equipmentAccess = watch("equipmentAccess");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-14"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center justify-center w-20 h-20  rounded-2xl shadow-sm mb-6"
        >
          <Image
            src="/onboarding/maininfraicon.png"
            alt="Infrastructure"
            width={74}
            height={74}
          />
        </motion.div>

        <h2 className="text-2xl font-semibold text-gray-900">
          Infrastructure & Equipment
        </h2>

        <p className="text-sm text-gray-500 mt-3 max-w-md mx-auto">
          Help us understand irrigation and machinery availability
          to provide better land recommendations.
        </p>
      </div>

      {/* Irrigation Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Irrigation
          </h3>
          <p className="text-sm text-gray-500">
            Does the land require irrigation facilities?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <OptionCard
            active={irrigationNeeded === true}
            imageSrc="/onboarding/waterirrigation.png"
            title="Irrigation Required"
            description="Land must include water infrastructure support."
            onClick={() =>
              setValue("irrigationNeeded", true, { shouldValidate: true })
            }
          />

          <OptionCard
            active={irrigationNeeded === false}
            imageSrc="/onboarding/selfirrigation.webp"
            title="Self Managed"
            description="I manage irrigation independently."
            onClick={() =>
              setValue("irrigationNeeded", false, { shouldValidate: true })
            }
          />
        </div>

        {errors.irrigationNeeded && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.irrigationNeeded.message}
          </div>
        )}
      </div>

      {/* Equipment Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Equipment Access
          </h3>
          <p className="text-sm text-gray-500">
            Do you have access to farming machinery?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <OptionCard
            active={equipmentAccess === true}
            imageSrc="/onboarding/Commercial.png"
            title="Equipment Available"
            description="Machinery is already available."
            onClick={() =>
              setValue("equipmentAccess", true, { shouldValidate: true })
            }
          />

          <OptionCard
            active={equipmentAccess === false}
            imageSrc="/onboarding/selfmannaged.jpg"
            title="Need Equipment"
            description="Require access to farming tools."
            onClick={() =>
              setValue("equipmentAccess", false, { shouldValidate: true })
            }
          />
        </div>

        {errors.equipmentAccess && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.equipmentAccess.message}
          </div>
        )}
      </div>

      {/* Info Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <p className="text-sm text-gray-600 leading-relaxed">
          Infrastructure preferences allow us to match you with land
          that fits your operational capacity and long-term farming goals.
        </p>
      </motion.div>
    </motion.div>
  );
}