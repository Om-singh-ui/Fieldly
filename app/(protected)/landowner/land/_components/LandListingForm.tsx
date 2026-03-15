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
  initial: { opacity: 0, x: 40, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -40, scale: 0.98 },
};

export function LandListingForm() {
  const router = useRouter();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
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

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    async (data) => {
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
          title: "Listing Created",
          description: "Your land is now live on the marketplace.",
        });

        startTransition(() => {
          router.replace("/landowner/dashboard#lands");
        });
      } catch (err) {
        toast({
          title: "Submission Failed",
          description:
            err instanceof Error
              ? err.message
              : "Unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        submittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [images, router, toast]
  );

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
    const commonClass = "space-y-6";

    switch (currentStep) {
      case 1:
        return <div className={commonClass}><BasicInfoStep form={form} /></div>;
      case 2:
        return <div className={commonClass}><LocationStep form={form} /></div>;
      case 3:
        return <div className={commonClass}><AmenitiesStep form={form} /></div>;
      case 4:
        return <div className={commonClass}><FarmingDetailsStep form={form} /></div>;
      case 5:
        return <div className={commonClass}><LeaseTermsStep form={form} /></div>;
      case 6:
        return <div className={commonClass}><PricingStep form={form} /></div>;
      case 7:
        return (
          <div className={commonClass}>
            <ReviewStep form={form} images={images} onImagesChange={setImages} />
          </div>
        );
      default:
        return null;
    }
  }, [currentStep, form, images]);

  const isLastStep = currentStep === STEPS.length;

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0" />

      <div className="relative max-w-5xl mx-auto px-6 pt-12 pb-20">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isLastStep) form.handleSubmit(onSubmit)(e);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
            noValidate
          >
            <div className="mb-10">
              <StepIndicator currentStep={currentStep} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  duration: 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Card className="relative border border-slate-200/60 bg-white/70 backdrop-blur-2xl shadow-[0_10px_40px_rgba(2,6,23,0.08)] rounded-2xl overflow-hidden">
                  <CardHeader className="px-8 py-7 border-b border-slate-200/60 bg-gradient-to-b from-white/80 to-transparent">
                    <CardTitle className="text-[26px] font-semibold tracking-tight text-slate-900">
                      {STEPS[currentStep - 1].title}
                    </CardTitle>
                    <CardDescription className="text-slate-500 mt-1">
                      Step {currentStep} of {STEPS.length}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-8 pt-8 pb-10">
                    {stepComponent}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="mt-2 pt-6 flex items-center justify-between">
              <Button
                type="button"
                onClick={goPrev}
                disabled={currentStep === 1 || isSubmitting}
                variant="outline"
                className="h-11 px-6 rounded-xl border-slate-300 bg-white/60 hover:bg-white shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {!isLastStep ? (
                <Button
                  type="button"
                  onClick={goNext}
                  disabled={isSubmitting}
                  className="h-11 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-[0_6px_20px_rgba(15,23,42,0.25)] transition-all"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || images.length === 0}
                  className="h-11 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-[0_6px_20px_rgba(15,23,42,0.25)]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Creating Listing...
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

            {isLastStep && images.length === 0 && (
              <p className="text-sm text-amber-500 font-medium text-center mt-3">
                Upload at least one image to publish listing
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}