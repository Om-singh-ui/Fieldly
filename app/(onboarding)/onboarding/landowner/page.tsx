"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Loader2,
  Phone,
  User,
  Bell,
  CheckCircle,
  ChevronRight,
  AlertCircle,
  Award,
} from "lucide-react";

import {
  completeLandownerOnboarding,
    finalizeOnboarding,
} from "@/actions/onboarding.actions";

import {
  landownerOnboardingSchema,
  type LandownerOnboardingInput,
} from "@/lib/validations/onboarding";

import { ProgressStepper } from "./_components/ProgressStepper";
import { ContactInfoForm } from "./_components/ContactInfoForm";
import { ProfileForm } from "./_components/ProfileForm";
import { PreferencesForm } from "./_components/PreferencesForm";
import { ReviewForm } from "./_components/ReviewForm";
import { SuccessScreen } from "./_components/SuccessScreen";

/* ============================================================
   SUCCESS AUTO REDIRECT COMPONENT 🔥 (FINAL)
============================================================ */

function SuccessAutoRedirect({ role }: { role: "landowner" | "farmer" }) {
  const router = useRouter();
  const [hasRun, setHasRun] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (hasRun) return;

    let timeout: NodeJS.Timeout;

    const run = async () => {
      try {
        setHasRun(true);
        setIsRedirecting(true);

        await finalizeOnboarding();

        timeout = setTimeout(() => {
          router.replace(
            role === "landowner"
              ? "/landowner/dashboard"
              : "/farmer/dashboard"
          );
        }, 2500);
      } catch (err) {
        console.error("Finalize error:", err);
        setIsRedirecting(false);
      }
    };

    run();

    return () => {
      if (timeout) clearTimeout(timeout); // ✅ cleanup
    };
  }, [hasRun, router, role]);

  return (
    <>
      <SuccessScreen role={role} />
      {isRedirecting && (
        <p className="text-center text-sm text-gray-400 mt-4">
          Redirecting to your dashboard...
        </p>
      )}
    </>
  );
}

/* ============================================================
   STEPS
============================================================ */

const STEPS = [
  { title: "Contact", icon: Phone, image: "/onboarding/contact.png" },
  {
    title: "Profile",
    icon: User,
    image: "/onboarding/user-man-account-person.png",
  },
  { title: "Preferences", icon: Bell, image: "/onboarding/preference.png" },
  { title: "Review", icon: CheckCircle, image: "/onboarding/review.png" },
  { title: "Complete", icon: Award, image: "/onboarding/5290058.png" },
];

const STEP_FIELDS: Record<
  number,
  readonly FieldPath<LandownerOnboardingInput>[]
> = {
  0: ["phone", "state", "district"],
  1: ["bio", "ownershipType"],
  2: [
    "preferredPaymentFrequency",
    "preferredContactMethod",
    "emailNotifications",
    "whatsappNotifications",
  ],
  3: ["termsAccepted", "privacyPolicyAccepted"],
};

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function LandownerOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmitForm = async (data: LandownerOnboardingInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await completeLandownerOnboarding(data);

      if (!result.success) {
        throw new Error(result.error || "Failed to complete onboarding");
      }

      setCurrentStep(4);

      toast.success("🎉 Onboarding Complete!", {
        description: "Your landowner profile has been created successfully.",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast.error(message);
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
        return <SuccessAutoRedirect role="landowner" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 mt-18">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Complete Your Landowner Profile
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Set up your profile to start listing land and connecting with
            verified farmers
          </p>
        </motion.div>

        <ProgressStepper
          currentStep={currentStep}
          steps={STEPS}
          onStepClick={(s) => s <= currentStep && setCurrentStep(s)}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8 mb-8"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-600 font-medium">{error}</span>
            </div>
          </motion.div>
        )}

        {currentStep < 4 && (
          <div className="flex justify-between pt-6">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 ${
                currentStep === 0
                  ? "opacity-0 pointer-events-none"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronRight className="rotate-180 h-4 w-4" />
              Back
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 bg-[#b7cf8a] text-[#2f3d1c] hover:bg-[#a9c57a]"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={form.handleSubmit(handleSubmitForm)}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 bg-[#b7cf8a] text-[#2f3d1c] disabled:opacity-50"
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
          </div>
        )}
      </div>
    </div>
  );
}