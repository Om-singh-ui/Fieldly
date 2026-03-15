"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STEPS } from "../types";

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const iconMap = {
  Landmark: "📍",
  MapPin: "📍",
  Zap: "⚡",
  Sprout: "🌱",
  Calendar: "📅",
  Banknote: "💰",
  Check: "✅",
};

export function StepIndicator({
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="mb-12">
      {/* Capsule Container */}
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="relative rounded-full p-[2px] shadow-[0_18px_45px_-12px_rgba(0,0,0,0.22)]"
      >
        {/* Inner Capsule */}
        <div className="relative rounded-full backdrop-blur-xl px-10 py-6 border border-white/60 bg-white/60">
          <div className="relative flex items-center justify-between">
            {/* Progress Rail */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[4px] bg-gray-100 rounded-full">
              <motion.div
                className="h-full bg-[#b7cf8a] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const clickable = step.id <= currentStep;
              const icon = iconMap[step.icon as keyof typeof iconMap];

              return (
                <div
                  key={step.id}
                  className="relative z-20 flex flex-col items-center flex-1"
                >
                  {/* halo */}
                  <div className="absolute w-16 h-16 bg-white/80 backdrop-blur-md rounded-full -z-10" />

                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    whileHover={clickable ? { scale: 1.08 } : {}}
                    onClick={() => clickable && onStepClick?.(step.id)}
                    disabled={!clickable}
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
                      isCompleted
                        ? "bg-[#b7cf8a] border border-[#b7cf8a] text-white shadow-md"
                        : isActive
                        ? "bg-white border border-[#b7cf8a] text-[#b7cf8a] shadow-md ring-4 ring-[#b7cf8a]/20"
                        : "bg-gray-50 border border-gray-200 text-gray-300 opacity-70"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-lg">{icon}</span>
                    )}
                  </motion.button>

                  <span
                    className={cn(
                      "mt-2 text-xs font-medium tracking-wide transition",
                      isActive || isCompleted
                        ? "text-gray-900"
                        : "text-gray-400"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}