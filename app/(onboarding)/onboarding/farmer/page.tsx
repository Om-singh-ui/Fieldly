"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldPath } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

import {
  User,
  Wheat,
  MapPin,
  Droplets,
  CheckCircle,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import { completeFarmerOnboarding } from "@/actions/onboarding.actions";

import { ProgressStepper } from "./_components/ProgressStepper";
import { BasicInfoForm } from "./_components/BasicInfoForm";
import { FarmingDetailsForm } from "./_components/FarmingDetailsForm";
import { LandRequirementsForm } from "./_components/LandRequirementsForm";
import { InfrastructureForm } from "./_components/InfrastructureForm";
import { SuccessScreen } from "./_components/SuccessScreen";

import type { FarmerOnboardingInput } from "./types";
import { toast } from "sonner";

const STEPS = [
  {
    title: "Basic Info",
    icon: User,
    image: "/onboarding/user-man-account-person.png",
  },
  {
    title: "Farming Details",
    icon: Wheat,
    image: "/onboarding/wheaticon.png",
  },
  {
    title: "Land Needs",
    icon: MapPin,
    image: "/onboarding/landreq.png",
  },
  {
    title: "Infrastructure",
    icon: Droplets,
    image: "/onboarding/waterirrigation.png",
  },
  {
    title: "Complete",
    icon: CheckCircle,
    image: "/onboarding/5290058.png",
  },
];

export default function FarmerOnboardingPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FarmerOnboardingInput>({
    defaultValues: {
      phone: "",
      state: "",
      district: "",
      bio: "",
      primaryCrops: [],
      farmingExperience: 5,
      farmingType: "COMMERCIAL",
      requiredLandSize: 5,
      leaseDuration: 36,
      irrigationNeeded: true,
      equipmentAccess: false,
    },
    mode: "onChange",
  });

  const STEP_FIELDS: Record<
    number,
    readonly FieldPath<FarmerOnboardingInput>[]
  > = {
    0: ["phone", "state", "district"],
    1: ["primaryCrops", "farmingExperience", "farmingType"],
    2: ["requiredLandSize", "leaseDuration"],
    3: ["irrigationNeeded", "equipmentAccess"],
  };

  const handleNextStep = async () => {
    const fields = STEP_FIELDS[currentStep] ?? [];
    const isValid = await form.trigger(fields);

    if (!isValid) return;

    setError(null);
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handlePrevStep = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
      setError(null);
    }
  };

  const handleSubmitForm = async (data: FarmerOnboardingInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Data is already validated and typed correctly by Zod
      // No need to convert anything - data already has numbers
      const result = await completeFarmerOnboarding(data);

      if (result.success) {
        setCurrentStep(4);
        toast.success("🎉 Onboarding Complete!", {
          description: "Your farmer profile has been created successfully.",
          duration: 5000,
        });

        setTimeout(() => {
          router.push(result.redirectTo || "/dashboard/farmer");
        }, 2500);
      } else {
        setError(result.error || "Failed to complete onboarding");
        toast.error("Onboarding Failed", {
          description: result.error || "Something went wrong",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(errorMessage);
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoForm form={form} />;
      case 1:
        return <FarmingDetailsForm form={form} />;
      case 2:
        return <LandRequirementsForm form={form} />;
      case 3:
        return <InfrastructureForm form={form} />;
      case 4:
        return <SuccessScreen onContinue={() => router.push("/post-auth")} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b mt-18 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Complete Your Farmer Profile
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tell us about your farming needs to get matched with the perfect
            land
          </p>
        </div>

        {/* Stepper */}
        <ProgressStepper
          currentStep={currentStep}
          steps={STEPS}
          onStepClick={handleStepClick}
        />

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8 mb-8"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-600 font-medium">{error}</span>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex justify-between items-center pt-6">
            {/* Back Button */}
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className={`
        px-5 py-2.5 rounded-lg font-medium flex items-center gap-2
        transition-colors duration-200
        ${
          currentStep === 0
            ? "opacity-0 pointer-events-none"
            : "text-gray-700 hover:bg-gray-100"
        }
      `}
            >
              <ChevronRight className="rotate-180 h-4 w-4" />
              Back
            </button>

            {/* Primary Action */}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="
          px-6 py-2.5 rounded-lg font-medium flex items-center gap-2
          bg-[#b7cf8a] text-[#2f3d1c]
          hover:bg-[#a9c57a]
          transition-colors duration-200
        "
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={form.handleSubmit(handleSubmitForm)}
                disabled={isSubmitting}
                className="
          px-6 py-2.5 rounded-lg font-medium flex items-center gap-2
          bg-[#b7cf8a] text-[#2f3d1c]
          hover:bg-[#a9c57a]
          transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
        "
              >
                {isSubmitting ? "Creating Profile..." : "Complete Profile"}
                <CheckCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
