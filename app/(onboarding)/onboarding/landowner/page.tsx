"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { 
  Phone, 
  User,
  Bell,
  CheckCircle,
  ChevronRight,
  AlertCircle,
  Award,
} from "lucide-react";

import { completeLandownerOnboarding } from "@/actions/onboarding.actions";
import { 
  landownerOnboardingSchema, 
  type LandownerOnboardingInput 
} from "@/lib/validations/onboarding";

import { ProgressStepper } from "./_components/ProgressStepper";
import { ContactInfoForm } from "./_components/ContactInfoForm";
import { ProfileForm } from "./_components/ProfileForm";
import { PreferencesForm } from "./_components/PreferencesForm";
import { ReviewForm } from "./_components/ReviewForm";
import { SuccessScreen } from "./_components/SuccessScreen";

const STEPS = [
  {
    title: "Contact",
    icon: Phone,
    image: "/onboarding/contact.png",
  },
  {
    title: "Profile",
    icon: User,
    image: "/onboarding/user-man-account-person.png",
  },
  {
    title: "Preferences",
    icon: Bell,
    image: "/onboarding/preference.png",
  },
  {
    title: "Review",
    icon: CheckCircle,
    image: "/onboarding/review.png",
  },
  {
    title: "Complete",
    icon: Award,
    image: "/onboarding/5290058.png",
  },
];

const STEP_FIELDS: Record<number, readonly FieldPath<LandownerOnboardingInput>[]> = {
  0: ["phone", "state", "district"],
  1: ["bio", "ownershipType"],
  2: ["preferredPaymentFrequency", "preferredContactMethod", "emailNotifications", "whatsappNotifications"],
  3: ["termsAccepted", "privacyPolicyAccepted"],
};

export default function LandownerOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LandownerOnboardingInput>({
    resolver: zodResolver(landownerOnboardingSchema),
    defaultValues: {
      phone: "",
      state: "",
      district: "",
      bio: "",
      ownershipType: "Individual",
      preferredPaymentFrequency: "Monthly",
      preferredContactMethod: "WhatsApp",
      emailNotifications: true,
      whatsappNotifications: true,
      termsAccepted: false,
      privacyPolicyAccepted: false,
    },
    mode: "onChange",
  });

  // Check user status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/user/status');
        const data = await response.json();

        if (!response.ok) {
          if (data.needsAuth) {
            router.push('/sign-in?redirect=/onboarding/landowner');
            return;
          }
          throw new Error(data.error || 'Failed to check user status');
        }

        // Redirect if not landowner
        if (data.user?.role && data.user.role !== 'LANDOWNER') {
          toast.error('Access Denied', {
            description: 'This page is only for landowners',
          });
          router.push('/onboarding/role');
          return;
        }

        // Redirect if already onboarded
        if (data.status === 'complete') {
          router.push('/dashboard/landowner');
          return;
        }

        // Pre-fill form with existing user data
        if (data.user) {
          form.setValue('phone', data.user.phone || '');
          form.setValue('state', data.user.state || '');
          form.setValue('district', data.user.district || '');
          form.setValue('bio', data.user.bio || '');
        }

      } catch (err) {
        console.error('Error checking user status:', err);
        toast.error('Error', {
          description: 'Failed to verify your account status',
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [router, form]);

  const handleNextStep = async () => {
    const fields = STEP_FIELDS[currentStep] ?? [];
    const isValid = await form.trigger(fields);

    if (!isValid) return;

    setError(null);
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
      setError(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmitForm = async (data: LandownerOnboardingInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await completeLandownerOnboarding(data);

      if (result.success) {
        setCurrentStep(4);
        toast.success("🎉 Onboarding Complete!", {
          description: "Your landowner profile has been created successfully.",
          duration: 5000,
        });

        setTimeout(() => {
          router.push(result.redirectTo || "/dashboard/landowner");
        }, 2500);
      } else {
        setError(result.error || "Failed to complete onboarding");
        toast.error("Onboarding Failed", {
          description: result.error || "Something went wrong",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
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
        return <ContactInfoForm form={form} />;
      case 1:
        return <ProfileForm form={form} />;
      case 2:
        return <PreferencesForm form={form} />;
      case 3:
        return <ReviewForm form={form} />;
      case 4:
        return <SuccessScreen role="landowner" onContinue={() => router.push("/dashboard/landowner")} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#b7cf8a] mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your profile...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we verify your account</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 mt-18">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Complete Your Landowner Profile
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Set up your profile to start listing land and connecting with verified farmers
          </p>
        </motion.div>

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between items-center pt-6"
          >
            {/* Back Button */}
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className={`
                px-5 py-2.5 rounded-lg font-medium flex items-center gap-2
                transition-all duration-200
                ${
                  currentStep === 0
                    ? "opacity-0 pointer-events-none"
                    : "text-gray-700 hover:bg-gray-100 hover:scale-105"
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
                  hover:bg-[#a9c57a] hover:scale-105
                  transition-all duration-200 shadow-md hover:shadow-lg
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
                  hover:bg-[#a9c57a] hover:scale-105
                  transition-all duration-200 shadow-md hover:shadow-lg
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                "
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  <>
                    Complete Profile
                    <CheckCircle className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}