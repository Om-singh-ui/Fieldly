"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  Phone, 
  User,
  Bell,
  Shield,
  CheckCircle,
  ArrowRight,
  Loader2,
  Mail,
  MessageSquare,
  Calendar,
  Users,
  Award,
  Sparkles,
  AlertCircle,
  ChevronLeft
} from "lucide-react";

import { 
  landownerOnboardingSchema, 
  type LandownerOnboardingInput,
  ownershipTypes,
  paymentFrequencies,
  contactMethods
} from "@/lib/validations/onboarding";
import { completeLandownerOnboarding } from "@/actions/onboarding.actions";

// Form steps
const STEPS = [
  { id: 1, title: "Contact", icon: Phone },
  { id: 2, title: "Profile", icon: User },
  { id: 3, title: "Preferences", icon: Bell },
  { id: 4, title: "Review", icon: CheckCircle },
] as const;

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LandownerOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<LandownerOnboardingInput>({
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

  // Check user status and redirect if needed
  useEffect(() => {
    const checkStatus = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/user/status');
        const data = await response.json();

        if (!response.ok) {
          if (data.needsAuth) {
            router.push('/sign-in?redirect=/onboarding/landowner');
            return;
          }
          throw new Error(data.error || 'Failed to check user status');
        }

        // If user doesn't exist or needs role, redirect to role selection
        if (!data.exists || data.status === 'needs_role') {
          router.push('/onboarding/role');
          return;
        }

        // If user is not a landowner, redirect to role selection
        if (data.user?.role !== 'LANDOWNER') {
          toast.error('Access Denied', {
            description: 'This page is only for landowners',
          });
          router.push('/onboarding/role');
          return;
        }

        // If already onboarded, redirect to dashboard
        if (data.status === 'complete') {
          router.push('/dashboard/landowner');
          return;
        }

        // Pre-fill form with existing user data
        if (data.user) {
          setValue('phone', data.user.phone || '');
          setValue('state', data.user.state || '');
          setValue('district', data.user.district || '');
          setValue('bio', data.user.bio || '');
        }

      } catch (err) {
        console.error('Error checking user status:', err);
        setError(err instanceof Error ? err.message : 'Failed to verify user status');
        toast.error('Error', {
          description: 'Failed to verify your account status',
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [router, setValue]);

  const handleNext = async () => {
    let fieldsToValidate: (keyof LandownerOnboardingInput)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["phone", "state", "district"];
        break;
      case 2:
        fieldsToValidate = ["bio", "ownershipType"];
        break;
      case 3:
        fieldsToValidate = [
          "preferredPaymentFrequency",
          "preferredContactMethod",
          "emailNotifications",
          "whatsappNotifications",
        ];
        break;
      case 4:
        fieldsToValidate = ["termsAccepted", "privacyPolicyAccepted"];
        break;
    }
    
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = async (data: LandownerOnboardingInput) => {
    setIsSubmitting(true);

    try {
      const result = await completeLandownerOnboarding(data);
      
      if (result.success) {
        toast.success("🎉 Onboarding Complete!", {
          description: "Your landowner profile has been created successfully.",
          duration: 5000,
        });
        
        // Small delay to show success message
        setTimeout(() => {
          router.push(result.redirectTo || "/dashboard/landowner");
        }, 1000);
      } else {
        toast.error("Onboarding Failed", {
          description: result.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your profile...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we verify your account</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const progressWidth = `${(currentStep / STEPS.length) * 100}%`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mb-6 shadow-lg shadow-green-200"
          >
            <Building2 className="h-10 w-10 text-white" />
          </motion.div>
          <motion.h1 
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
          >
            Complete Your Profile
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Set up your landowner profile in just a few steps and start listing your lands
          </motion.p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          variants={fadeInUp}
          className="mb-8 bg-white p-6 rounded-2xl shadow-sm"
        >
          <div className="flex justify-between mb-3 text-sm">
            <span className="font-medium text-gray-700">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-green-600 font-medium">
              {Math.round((currentStep / STEPS.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
              initial={{ width: "0%" }}
              animate={{ width: progressWidth }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Step Navigation */}
        <motion.div 
          variants={fadeInUp}
          className="flex justify-between mb-8 overflow-x-auto pb-2"
        >
          {STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => step.id < currentStep && setCurrentStep(step.id)}
              className={`flex flex-col items-center min-w-[80px] transition-all ${
                step.id < currentStep ? "cursor-pointer" : "cursor-default"
              }`}
              disabled={step.id > currentStep}
              type="button"
            >
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                ${step.id === currentStep 
                  ? "bg-green-600 text-white ring-4 ring-green-100 scale-110" 
                  : step.id < currentStep 
                  ? "bg-green-500 text-white" 
                  : "bg-gray-100 text-gray-400"
                }
              `}>
                {step.id < currentStep ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className={`
                text-xs font-medium whitespace-nowrap
                ${step.id === currentStep ? "text-green-700" : "text-gray-500"}
              `}>
                {step.title}
              </span>
            </button>
          ))}
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">+91</span>
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      className="pl-14 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="9876543210"
                      maxLength={10}
                      aria-invalid={errors.phone ? "true" : "false"}
                    />
                  </div>
                  {errors.phone && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-600"
                      role="alert"
                    >
                      {errors.phone.message}
                    </motion.p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="state"
                        type="text"
                        {...register("state")}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Maharashtra"
                        aria-invalid={errors.state ? "true" : "false"}
                      />
                    </div>
                    {errors.state && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                        role="alert"
                      >
                        {errors.state.message}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                      District <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="district"
                      type="text"
                      {...register("district")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Pune"
                      aria-invalid={errors.district ? "true" : "false"}
                    />
                    {errors.district && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                        role="alert"
                      >
                        {errors.district.message}
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Professional Profile */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Professional Profile
              </h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    About You / Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="bio"
                    {...register("bio")}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all"
                    placeholder="Tell us about your land ownership experience, how many acres you own, what type of farming you prefer, and what you're looking for in tenants..."
                    aria-invalid={errors.bio ? "true" : "false"}
                  />
                  {errors.bio && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-600"
                      role="alert"
                    >
                      {errors.bio.message}
                    </motion.p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Minimum 20 characters. This helps farmers understand your expectations.
                  </p>
                </div>

                <div>
                  <label htmlFor="ownershipType" className="block text-sm font-medium text-gray-700 mb-2">
                    Ownership Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="ownershipType"
                    {...register("ownershipType")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    aria-invalid={errors.ownershipType ? "true" : "false"}
                  >
                    {ownershipTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.ownershipType && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-600"
                      role="alert"
                    >
                      {errors.ownershipType.message}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Preferences */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Bell className="h-5 w-5 text-green-600" />
                Your Preferences
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="paymentFrequency" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Payment Frequency <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="paymentFrequency"
                      {...register("preferredPaymentFrequency")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      aria-invalid={errors.preferredPaymentFrequency ? "true" : "false"}
                    >
                      {paymentFrequencies.map((freq) => (
                        <option key={freq} value={freq}>{freq}</option>
                      ))}
                    </select>
                    {errors.preferredPaymentFrequency && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                        role="alert"
                      >
                        {errors.preferredPaymentFrequency.message}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contactMethod" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Contact Method <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="contactMethod"
                      {...register("preferredContactMethod")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      aria-invalid={errors.preferredContactMethod ? "true" : "false"}
                    >
                      {contactMethods.map((method) => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                    {errors.preferredContactMethod && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                        role="alert"
                      >
                        {errors.preferredContactMethod.message}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Email Notifications</p>
                          <p className="text-sm text-gray-500">Receive updates via email</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        {...register("emailNotifications")}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">WhatsApp Updates</p>
                          <p className="text-sm text-gray-500">Get instant updates on WhatsApp</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        {...register("whatsappNotifications")}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Review & Submit
              </h2>

              <div className="space-y-6">
                <div className="bg-green-50 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="h-6 w-6 text-green-600" />
                    <h3 className="font-semibold text-green-900">You're almost there!</h3>
                  </div>
                  <p className="text-green-800 text-sm">
                    Review your information and accept the terms to complete your profile setup.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      {...register("termsAccepted")}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500 mt-0.5"
                    />
                    <div>
                      <p className="font-medium text-gray-900">I accept the Terms of Service</p>
                      <p className="text-sm text-gray-500">
                        By checking this, you agree to our terms of service, privacy policy, and the rules for land leasing on our platform.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      {...register("privacyPolicyAccepted")}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500 mt-0.5"
                    />
                    <div>
                      <p className="font-medium text-gray-900">I accept the Privacy Policy</p>
                      <p className="text-sm text-gray-500">
                        I understand how my data will be used and protected as outlined in the privacy policy.
                      </p>
                    </div>
                  </label>
                </div>

                {(errors.termsAccepted || errors.privacyPolicyAccepted) && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-600 text-center"
                    role="alert"
                  >
                    Please accept both terms to continue
                  </motion.p>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <Shield className="h-6 w-6 text-blue-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Verified Platform</h4>
                    <p className="text-xs text-gray-600">All farmers are background verified</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <Calendar className="h-6 w-6 text-green-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Secure Payments</h4>
                    <p className="text-xs text-gray-600">Escrow protected transactions</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <Users className="h-6 w-6 text-purple-600 mb-2" />
                    <h4 className="font-medium text-gray-900">24/7 Support</h4>
                    <p className="text-xs text-gray-600">Dedicated relationship manager</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <motion.div 
            variants={fadeInUp}
            className="flex justify-between gap-4 pt-4"
          >
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 sm:px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                <ChevronLeft className="h-5 w-5" />
                Back
              </button>
            )}
            
            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 sm:px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 ml-auto shadow-lg shadow-green-200"
              >
                Continue
                <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 sm:px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 ml-auto shadow-lg shadow-green-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Setting up your profile...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Complete Setup
                  </>
                )}
              </button>
            )}
          </motion.div>
        </form>

        {/* Post-Onboarding Info */}
        <motion.div
          variants={fadeInUp}
          className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-green-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">What happens next?</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-700 font-medium">1</span>
              </div>
              <p className="text-gray-600">Access your landowner dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-700 font-medium">2</span>
              </div>
              <p className="text-gray-600">List your first land parcel</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-700 font-medium">3</span>
              </div>
              <p className="text-gray-600">Connect with verified farmers</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}