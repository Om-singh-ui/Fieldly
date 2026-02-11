"use client";

import {
  Droplets,
  Tractor,
  AlertCircle,
  Check,
  CloudRain,
  Toolbox,
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FarmerOnboardingInput } from "@/lib/validations/onboarding";
import { motion } from "framer-motion";
import React from "react";

interface InfrastructureFormProps {
  form: UseFormReturn<FarmerOnboardingInput>;
}

/* ---------- Reusable Option Card ---------- */

interface OptionCardProps {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function OptionCard({
  active,
  icon,
  title,
  description,
  onClick,
}: OptionCardProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative w-full p-5 rounded-xl border text-left
        transition-all duration-200
        ${
          active
            ? "border-[#b7cf8a] bg-[#b7cf8a]/10"
            : "border-gray-200 hover:border-gray-300 bg-white"
        }
      `}
    >
      <div className="flex items-start gap-4">
        <div
          className={`
            w-10 h-10 rounded-lg flex items-center justify-center
            ${active ? "bg-[#b7cf8a]/30" : "bg-gray-100"}
          `}
        >
          {icon}
        </div>

        <div className="flex-1">
          <div className="font-medium text-gray-900">{title}</div>
          <div className="text-sm text-gray-500 mt-1">{description}</div>
        </div>

        {active && (
          <Check className="h-5 w-5 text-[#6c8f3f]" />
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#b7cf8a]/20 rounded-xl mb-4">
          <Droplets className="h-7 w-7 text-[#6c8f3f]" />
        </div>

        <h2 className="text-xl font-semibold text-gray-900">
          Infrastructure & Equipment
        </h2>

        <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
          Tell us about irrigation and equipment availability.
        </p>
      </div>

      {/* Irrigation Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            Irrigation
          </h3>

          <p className="text-sm text-gray-500">
            Does the land require irrigation facilities?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <OptionCard
            active={irrigationNeeded === true}
            icon={<Droplets className="h-5 w-5 text-gray-700" />}
            title="Irrigation Required"
            description="Land must include water infrastructure."
            onClick={() =>
              setValue("irrigationNeeded", true, { shouldValidate: true })
            }
          />

          <OptionCard
            active={irrigationNeeded === false}
            icon={<CloudRain className="h-5 w-5 text-gray-700" />}
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
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            Equipment Access
          </h3>

          <p className="text-sm text-gray-500">
            Do you have access to farming machinery?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <OptionCard
            active={equipmentAccess === true}
            icon={<Tractor className="h-5 w-5 text-gray-700" />}
            title="Equipment Available"
            description="Machinery is already available."
            onClick={() =>
              setValue("equipmentAccess", true, { shouldValidate: true })
            }
          />

          <OptionCard
            active={equipmentAccess === false}
            icon={<Toolbox className="h-5 w-5 text-gray-700" />}
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
      <div className="rounded-xl border border-gray-200 p-5">
        <div className="flex gap-3">
          <Tractor className="h-5 w-5 text-gray-500 mt-1" />

          <p className="text-sm text-gray-600">
            Equipment and irrigation preferences help us recommend suitable land
            and support services.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
