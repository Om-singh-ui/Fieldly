// app/(protected)/landowner/land/new/_components/FormSteps/StepIndicator.tsx
"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STEPS } from "../types";

interface StepIndicatorProps {
  currentStep: number;
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

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step) => {
          const StepIcon = iconMap[step.icon as keyof typeof iconMap];
          return (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  currentStep > step.id
                    ? "bg-[#b7cf8a] border-[#b7cf8a] text-white"
                    : currentStep === step.id
                    ? "border-[#b7cf8a] text-[#b7cf8a]"
                    : "border-gray-300 text-gray-300"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{StepIcon}</span>
                )}
              </div>
              {step.id < STEPS.length && (
                <div
                  className={cn(
                    "w-16 h-0.5 mx-2",
                    currentStep > step.id ? "bg-[#b7cf8a]" : "bg-gray-300"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2">
        {STEPS.map((step) => (
          <span
            key={step.id}
            className={cn(
              "text-xs font-medium",
              currentStep >= step.id ? "text-[#b7cf8a]" : "text-gray-400"
            )}
          >
            {step.title}
          </span>
        ))}
      </div>
    </div>
  );
}