"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface StepItem {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  image: string;
}

interface ProgressStepperProps {
  currentStep: number;
  steps: StepItem[];
  onStepClick?: (step: number) => void;
}

export function ProgressStepper({
  currentStep,
  steps,
  onStepClick,
}: ProgressStepperProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="mb-12">
      {/* Capsule Container */}
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="
    relative rounded-full p-[2px]
shadow-[0_18px_45px_-12px_rgba(0,0,0,0.22)]
    transition-all duration-300
  "
      >
        {/* Inner Capsule */}
        <div className="relative rounded-full backdrop-blur-xl px-10 py-6 border border-white/60">
          {/* Steps Row */}
          <div className="relative flex items-center justify-between">
            {/* ---------- Masked Progress Rail ---------- */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[4px] bg-gray-100 rounded-full">
              <motion.div
                className="h-full bg-[#b7cf8a] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const clickable = index <= currentStep;

              return (
                <div
                  key={step.title}
                  className="relative z-20 flex flex-col items-center flex-1"
                >
                  {/* ---------- Icon Halo Mask ---------- */}
                  <div className="absolute w-16 h-16 bg-white/80 backdrop-blur-md rounded-full -z-10" />

                  {/* Step Button */}
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    whileHover={clickable ? { scale: 1.08 } : {}}
                    onClick={() => onStepClick?.(index)}
                    disabled={!clickable}
                    className={`
                      w-14 h-14 rounded-full flex items-center justify-center
                      transition-all duration-300
                      ${
                        isActive || isCompleted
                          ? "bg-white border border-emerald-300 shadow-md"
                          : "bg-gray-50 border border-gray-200 opacity-60"
                      }
                      ${isActive ? "ring-4 ring-emerald-100/2" : ""}
                    `}
                  >
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={26}
                      height={26}
                      className={`
                        object-contain transition duration-300
                        ${!isActive && !isCompleted ? "grayscale opacity-70" : ""}
                      `}
                      priority={isActive}
                    />
                  </motion.button>

                  {/* Label */}
                  <span
                    className={`mt-2 text-xs font-medium tracking-wide ${
                      isActive || isCompleted
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
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
