"use client";

import { useState, useCallback, useMemo, useRef, startTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

import { formSchema, FormValues } from "./schema";
import { STEPS } from "./types";
import {
  StepIndicator,
  BasicInfoStep,
  LocationStep,
  AmenitiesStep,
  FarmingDetailsStep,
  LeaseTermsStep,
  PricingStep,
  ReviewStep,
} from "./FormSteps";

const pageVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export function LandListingForm() {
  const router = useRouter();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  
  // ✅ FIX 3: Submit mutex lock to prevent double submissions
  const submittingRef = useRef(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      landType: "AGRICULTURAL",
      size: 0.1,
      soilType: "",
      village: "",
      district: "",
      state: "",
      latitude: null,
      longitude: null,
      irrigationAvailable: false,
      electricityAvailable: false,
      roadAccess: false,
      fencingAvailable: false,
      storageAvailable: false,
      waterSource: "",
      soilReportAvailable: false,
      allowedCropTypes: [],
      allowsInfrastructureModification: false,
      allowsOrganicFarming: true,
      allowsSubleasing: false,
      previousCrops: [],
      minLeaseDuration: 12,
      maxLeaseDuration: 60,
      expectedRentMin: null,
      expectedRentMax: null,
      depositAmount: null,
      preferredPaymentFrequency: undefined,
      listingType: "OPEN_BIDDING",
      basePrice: 0,
      reservePrice: null,
      buyNowPrice: null,
      listingStartDate: new Date(),
      listingEndDate: new Date(Date.now() + 30 * 86400000),
      paymentFrequency: "MONTHLY",
      securityDepositRequired: true,
      additionalTerms: "",
      inspectionRequired: false,
      insuranceRequired: false,
    },
  });

  // ✅ FIX 2 & 3: Proper submit handler with mutex lock
  const onSubmit: SubmitHandler<FormValues> = useCallback(
    async (data) => {
      // Prevent double submission
      if (submittingRef.current) return;
      submittingRef.current = true;
      setIsSubmitting(true);

      try {
        const fd = new FormData();

        Object.entries(data).forEach(([k, v]) => {
          if (v instanceof Date) fd.append(k, v.toISOString());
          else if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
          else if (v != null) fd.append(k, String(v));
        });

        images.forEach((img) => fd.append("images", img));

        const res = await fetch("/api/landowner/lands", {
          method: "POST",
          body: fd,
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to create listing");

        toast({
          title: "Success",
          description: "Your land has been listed successfully",
        });

        // ✅ FIX 5: Use startTransition to prevent navigation freeze
        startTransition(() => {
          router.replace("/landowner/dashboard#lands");
        });
      } catch (err) {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to create listing",
          variant: "destructive",
        });
      } finally {
        // Release mutex lock
        submittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [images, router, toast]
  );

  // ✅ FIX 6: Proper step validation with focus
  const goNext = async () => {
    if (isSubmitting) return;

    const validations: Record<number, (keyof FormValues)[]> = {
      1: ["title", "landType", "size"],
      2: ["village", "district", "state"],
      4: ["allowedCropTypes"],
      5: ["minLeaseDuration", "maxLeaseDuration"],
      6: ["listingType", "basePrice"],
    };

    const fields = validations[currentStep];
    if (fields) {
      const valid = await form.trigger(fields, { shouldFocus: true });
      if (!valid) return;
    }

    setCurrentStep((s) => Math.min(s + 1, STEPS.length));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => {
    if (isSubmitting) return;
    setCurrentStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stepComponent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep form={form} />;
      case 2:
        return <LocationStep form={form} />;
      case 3:
        return <AmenitiesStep form={form} />;
      case 4:
        return <FarmingDetailsStep form={form} />;
      case 5:
        return <LeaseTermsStep form={form} />;
      case 6:
        return <PricingStep form={form} />;
      case 7:
        return (
          <ReviewStep form={form} images={images} onImagesChange={setImages} />
        );
      default:
        return null;
    }
  }, [currentStep, form, images]);

  const isLastStep = currentStep === STEPS.length;

  return (
    <Form {...form}>
      {/* ✅ FIX 1 & 2: Complete form submission control */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // Only allow submission on last step
          if (isLastStep) {
            form.handleSubmit(onSubmit)(e);
          }
        }}
        onKeyDown={(e) => {
          // ✅ FIX 1: Prevent Enter key from submitting
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        noValidate
      >
        <StepIndicator currentStep={currentStep} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
                <CardDescription>
                  Step {currentStep} of {STEPS.length}
                </CardDescription>
              </CardHeader>
              <CardContent>{stepComponent}</CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          {/* ✅ FIX 4: All navigation buttons are type="button" */}
          <Button
            type="button"
            onClick={goPrev}
            disabled={currentStep === 1 || isSubmitting}
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {!isLastStep ? (
            <Button
              type="button" // ✅ CRITICAL: Not submit
              onClick={goNext}
              disabled={isSubmitting}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit" // ✅ Only last step button is submit
              disabled={isSubmitting || images.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Listing
                </>
              )}
            </Button>
          )}
        </div>

        {/* Optional: Show image requirement on last step */}
        {isLastStep && images.length === 0 && (
          <p className="text-sm text-amber-600 text-center mt-2">
            Please upload at least one image before creating the listing
          </p>
        )}
      </form>
    </Form>
  );
}