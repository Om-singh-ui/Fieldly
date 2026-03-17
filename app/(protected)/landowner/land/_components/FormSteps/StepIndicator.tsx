"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STEPS } from "../types";

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full mb-8 md:mb-14">
      {/* Capsule Container */}
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="relative rounded-full p-[2px] shadow-[0_20px_55px_-15px_rgba(0,0,0,0.25)]"
      >
        <div className="absolute inset-0 rounded-full" />

        {/* Inner Capsule */}
        <div className="relative rounded-full backdrop-blur-xl px-3 sm:px-6 md:px-10 lg:px-14 py-3 sm:py-4 md:py-6 border border-white/60 bg-white/70">
          <div className="relative flex items-center justify-between">
            {/* Progress Rail */}
            <div className="absolute left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 top-1/3 -translate-y-1/2 h-[3px] sm:h-[4px] md:h-[5px] bg-gray-100 rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-[#b7cf8a] to-[#9fba6f] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.55 }}
              />
            </div>

            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const clickable = step.id <= currentStep;

              return (
                <div
                  key={step.id}
                  className="relative z-20 flex flex-col items-center flex-1 group"
                >
                  {/* Halo */}
                  <div className="hidden sm:block absolute w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-white/80 backdrop-blur-md rounded-full -z-10" />

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={clickable ? { scale: 1.08 } : {}}
                    onClick={() => clickable && onStepClick?.(step.id)}
                    disabled={!clickable}
                    className={cn(
                      "rounded-full flex items-center justify-center transition-all duration-300",
                      "w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14",
                      isCompleted
                        ? "bg-[#b7cf8a] border border-[#b7cf8a] shadow-lg"
                        : isActive
                        ? "bg-white border border-[#b7cf8a] shadow-lg ring-2 sm:ring-4 ring-[#b7cf8a]/20"
                        : "bg-white border border-gray-200 opacity-60"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                    ) : (
                      <Image
                        src={step.image}
                        alt={step.title}
                        width={32}
                        height={32}
                        className={cn(
                          "transition duration-300",
                          "w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6",
                          isActive ? "opacity-100 scale-110" : "opacity-70"
                        )}
                      />
                    )}
                  </motion.button>

                  {/* Desktop label */}
                  <span
                    className={cn(
                      "hidden md:block mt-3 text-sm font-semibold text-center leading-tight",
                      isActive || isCompleted
                        ? "text-gray-900"
                        : "text-gray-400"
                    )}
                  >
                    {step.title}
                  </span>

                  {/* Speech Bubble Tooltip (xs + sm) */}
                  <div
                    className="
                      absolute bottom-full mb-4
                      opacity-0 group-hover:opacity-100
                      translate-y-2 group-hover:translate-y-0
                      transition-all duration-200
                      pointer-events-none
                      md:hidden
                    "
                  >
                    <div className="relative bg-black text-white text-xs font-medium px-3 py-2 rounded-xl whitespace-nowrap shadow-xl">
                      {step.title}

                      {/* triangle pointer */}
                      <div
                        className="
                          absolute left-1/2 -bottom-2
                          -translate-x-1/2
                          w-0 h-0
                          border-l-[6px] border-l-transparent
                          border-r-[6px] border-r-transparent
                          border-t-[8px] border-t-black
                        "
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}