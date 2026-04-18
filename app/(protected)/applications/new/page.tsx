// app/(protected)/applications/new/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  CreateApplicationInput,
  createApplicationSchema,
} from "@/lib/validations/application.schema";
import { ContactProtectionBanner } from "../_components/contact-protection-banner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Loader2,
  IndianRupee,
  Calendar,
  FileText,
  MessageSquare,
  MapPin,
  Sprout,
  Clock,
  TrendingUp,
  Shield,
  ChevronRight,
  CheckCircle2,
  Eye,
  X,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface Land {
  id: string;
  title: string;
  size: number;
  landType: string;
  village: string | null;
  district: string | null;
  state: string | null;
  minLeaseDuration: number;
  maxLeaseDuration: number;
  expectedRentMin: number | null;
  expectedRentMax: number | null;
  allowedCropTypes: string[];
  isActive: boolean;
  isArchived: boolean;
}

const DURATION_OPTIONS = [3, 6, 12, 24, 36, 60];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

function NewApplicationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLand, setSelectedLand] = useState<Land | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLand, setIsLoadingLand] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const landId = searchParams.get("landId");
  const ownerId = searchParams.get("ownerId");

  const form = useForm<CreateApplicationInput>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: {
      landId: landId || "",
      duration: 12,
      proposedRent: undefined,
      cropPlan: "",
      message: "",
    },
    mode: "onChange",
  });

  const watchDuration = form.watch("duration");
  const watchRent = form.watch("proposedRent");

  const calculateTotalValue = () => {
    if (!watchRent || !watchDuration) return null;
    return watchRent * watchDuration;
  };

  useEffect(() => {
    const fetchLandDetails = async (id: string) => {
      setIsLoadingLand(true);
      try {
        const res = await fetch(`/api/landowner/lands/${id}`);

        if (!res.ok) {
          const listRes = await fetch(
            `/api/landowner/lands?ownerId=${ownerId}&isActive=true`,
          );
          const listData = await listRes.json();
          const land = listData.lands?.find((l: Land) => l.id === id);

          if (land) {
            setSelectedLand(land);
            form.setValue("landId", land.id);
          } else {
            toast.error("Land not found");
          }
        } else {
          const data = await res.json();
          setSelectedLand(data.land);
          form.setValue("landId", data.land.id);
        }
      } catch (error) {
        console.error("Failed to fetch land:", error);
        toast.error("Failed to load land details");
      } finally {
        setIsLoadingLand(false);
      }
    };

    if (landId) {
      fetchLandDetails(landId);
    }
  }, [landId, ownerId, form]);

  const onSubmit = async (data: CreateApplicationInput) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      toast.success("Application submitted successfully!");
      router.push(`/applications/${result.application.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingLand) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#b7cf8a] to-[#8fb855] rounded-full blur-xl opacity-20 pointer-events-none" />
            <Loader2 className="h-8 w-8 animate-spin text-[#8fb855] relative" />
          </div>
          <p className="text-muted-foreground">Loading land details...</p>
        </motion.div>
      </div>
    );
  }

  if (!selectedLand) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl mx-auto">
          <Link
            href="/marketplace"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Marketplace
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Land Not Found</CardTitle>
              <CardDescription>
                The selected land could not be found. Please select a land from
                the marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/marketplace">Browse Marketplace</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 mt-16 bg-gradient-to-br">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href={ownerId ? `/profile/${ownerId}` : "/marketplace"}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 group"
          >
            <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            {ownerId ? "Back to Profile" : "Back to Marketplace"}
          </Link>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#b7cf8a]/20 to-[#8fb855]/20 rounded-xl">
              <Sprout className="h-6 w-6 text-[#8fb855]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900  bg-clip-text text-gray-900">
                New Application
              </h1>
              <p className="text-muted-foreground mt-1">
                Submit your application to lease land. All communication is
                platform-protected.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Protection Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ContactProtectionBanner />
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left Column - Land Details */}
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <Card className="sticky top-24 border-0 shadow-xl overflow-hidden">
                  {/* FIXED: Added pointer-events-none */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#b7cf8a]/5 to-transparent pointer-events-none" />
                  <CardHeader className="pb-3 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-[#b7cf8a] text-white hover:bg-[#b7cf8a]">
                        Selected Land
                      </Badge>
                    </div>
                    <CardTitle className="text-xl flex items-start gap-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-[#b7cf8a] to-[#8fb855] rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                        <span className="text-2xl">🌾</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">
                          {selectedLand.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">
                            {[
                              selectedLand.village,
                              selectedLand.district,
                              selectedLand.state,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="space-y-4">
                      {/* Land Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100"
                        >
                          <p className="text-xs text-muted-foreground mb-1">
                            Size
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedLand.size}{" "}
                            <span className="text-sm font-normal text-muted-foreground">
                              acres
                            </span>
                          </p>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100"
                        >
                          <p className="text-xs text-muted-foreground mb-1">
                            Land Type
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedLand.landType}
                          </p>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 col-span-2"
                        >
                          <p className="text-xs text-muted-foreground mb-1">
                            Lease Duration Range
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedLand.minLeaseDuration} -{" "}
                            {selectedLand.maxLeaseDuration}{" "}
                            <span className="text-sm font-normal text-muted-foreground">
                              months
                            </span>
                          </p>
                        </motion.div>
                      </div>

                      {/* Expected Rent */}
                      {selectedLand.expectedRentMin && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-amber-600" />
                            <p className="text-sm font-medium text-amber-900">
                              Expected Rent Range
                            </p>
                          </div>
                          <p className="text-2xl font-bold text-amber-900">
                            ₹
                            {selectedLand.expectedRentMin.toLocaleString(
                              "en-IN",
                            )}
                            {selectedLand.expectedRentMax && (
                              <>
                                {" "}
                                - ₹
                                {selectedLand.expectedRentMax.toLocaleString(
                                  "en-IN",
                                )}
                              </>
                            )}
                            <span className="text-sm font-normal text-amber-700 ml-1">
                              /month
                            </span>
                          </p>
                        </motion.div>
                      )}

                      {/* Allowed Crops */}
                      {selectedLand.allowedCropTypes &&
                        selectedLand.allowedCropTypes.length > 0 && (
                          <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-xs font-medium text-muted-foreground mb-2">
                              Allowed Crop Types
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {selectedLand.allowedCropTypes.map((crop) => (
                                <Badge
                                  key={crop}
                                  variant="secondary"
                                  className="bg-white"
                                >
                                  {crop}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Right Column - Application Form */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-2 space-y-6"
              >
                {/* Lease Details Card */}
                <Card className="border-0 shadow-xl overflow-hidden">
                  {/* FIXED: Added pointer-events-none */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      Lease Proposal
                    </CardTitle>
                    <CardDescription>
                      Set your preferred lease terms
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Duration Field */}
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              Lease Duration
                            </FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(parseInt(value))
                              }
                              value={field.value?.toString() || "12"}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 bg-white">
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {DURATION_OPTIONS.map((months) => (
                                  <SelectItem
                                    key={months}
                                    value={months.toString()}
                                    disabled={
                                      months < selectedLand.minLeaseDuration ||
                                      months > selectedLand.maxLeaseDuration
                                    }
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span>{months} months</span>
                                      <span className="text-xs text-muted-foreground">
                                        {months === 12
                                          ? "1 year"
                                          : months === 24
                                            ? "2 years"
                                            : months === 36
                                              ? "3 years"
                                              : months === 60
                                                ? "5 years"
                                                : ""}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Rent Field */}
                      <FormField
                        control={form.control}
                        name="proposedRent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <IndianRupee className="h-4 w-4 text-muted-foreground" />
                              Proposed Monthly Rent (₹)
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                  ₹
                                </div>
                                <Input
                                  type="number"
                                  placeholder="e.g., 15000"
                                  className="pl-8 h-12 bg-white"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value
                                      ? parseFloat(e.target.value)
                                      : undefined;
                                    field.onChange(value);
                                  }}
                                  value={field.value ?? ""}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              {selectedLand.expectedRentMin &&
                              selectedLand.expectedRentMax ? (
                                <span className="text-xs">
                                  Expected: ₹
                                  {selectedLand.expectedRentMin.toLocaleString(
                                    "en-IN",
                                  )}{" "}
                                  - ₹
                                  {selectedLand.expectedRentMax.toLocaleString(
                                    "en-IN",
                                  )}
                                </span>
                              ) : (
                                <span className="text-xs">
                                  Optional - Leave empty if flexible
                                </span>
                              )}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Total Value Display */}
                    <AnimatePresence>
                      {calculateTotalValue() && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6"
                        >
                          <div className="p-4 bg-gradient-to-r from-[#b7cf8a]/10 to-[#8fb855]/10 rounded-xl border border-[#b7cf8a]/30">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-[#b7cf8a]/20 rounded-lg">
                                  <IndianRupee className="h-4 w-4 text-[#5a7a3a]" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                  Total Lease Value
                                </span>
                              </div>
                              <motion.span
                                key={calculateTotalValue()}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="text-2xl font-bold text-[#5a7a3a]"
                              >
                                ₹
                                {calculateTotalValue()?.toLocaleString("en-IN")}
                              </motion.span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>

                {/* Crop Plan & Message Card */}
                <Card className="border-0 shadow-xl overflow-hidden">
                  {/* FIXED: Added pointer-events-none */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent pointer-events-none" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-100 rounded-lg">
                        <FileText className="h-4 w-4 text-emerald-600" />
                      </div>
                      Additional Information
                    </CardTitle>
                    <CardDescription>
                      Tell the landowner about your plans
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="grid grid-cols-1 gap-6">
                      {/* Crop Plan */}
                      <FormField
                        control={form.control}
                        name="cropPlan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Sprout className="h-4 w-4 text-muted-foreground" />
                              Crop Plan
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe what crops you plan to grow, farming methods, and any sustainable practices..."
                                className="min-h-[120px] bg-white resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Be specific about your farming approach to
                              increase approval chances
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Additional Message */}
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              Additional Message (Optional)
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any additional information you'd like to share with the landowner..."
                                className="min-h-[100px] bg-white resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Security Notice */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative overflow-hidden rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4"
                >
                  {/* FIXED: Added pointer-events-none */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative flex items-start gap-3 z-10">
                    <div className="p-2 bg-amber-100 rounded-full shrink-0">
                      <Shield className="h-5 w-5 text-amber-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-semibold text-amber-900">
                          Platform Protection Active
                        </p>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              Learn More
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] mx-auto max-h-[90vh] flex flex-col p-0">
                            {" "}
                            {/* Added max-h and flex layout */}
                            <DialogHeader className="px-6 pt-6 pb-4 border-b">
                              {" "}
                              {/* Added border and padding */}
                              <DialogTitle className="flex items-center gap-2 text-xl">
                                <Shield className="h-5 w-5 text-amber-600 shrink-0" />
                                <span className="break-words">
                                  Platform Communication Protection
                                </span>
                              </DialogTitle>
                              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                              </DialogClose>
                            </DialogHeader>
                            {/* Scrollable content area */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                Fieldly protects your privacy by masking all
                                contact information during the application
                                process.
                              </p>
                              <div className="bg-amber-50 p-4 rounded-lg space-y-3">
                                <p className="font-medium text-amber-900">
                                  What this means:
                                </p>
                                <ul className="space-y-2 text-sm text-amber-800">
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                                    <span className="break-words">
                                      Your phone number and email remain private
                                    </span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                                    <span className="break-words">
                                      All communication happens through our
                                      secure platform
                                    </span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                                    <span className="break-words">
                                      Contact details are only shared after
                                      application approval
                                    </span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                                    <span className="break-words">
                                      We monitor messages to prevent
                                      off-platform deals
                                    </span>
                                  </li>
                                </ul>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                This protection ensures a safe and transparent
                                leasing process for everyone involved.
                              </p>
                            </div>
                            {/* Fixed footer with button */}
                            <div className="px-6 py-4 border-t bg-white/50">
                              <div className="flex justify-end">
                                <Button
                                  onClick={() => setDialogOpen(false)}
                                  className="bg-amber-600 hover:bg-amber-700 text-white"
                                >
                                  Got it
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <p className="text-sm text-amber-700 leading-relaxed">
                        <strong>⚠️ Important:</strong> Do not include phone
                        numbers, email addresses, or social media handles in
                        your application.
                      </p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0" />
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-3 pt-4"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => router.back()}
                    className="flex-1 md:flex-none"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="flex-1 bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function NewApplicationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#8fb855]" />
            <p className="text-muted-foreground">Loading application form...</p>
          </div>
        </div>
      }
    >
      <NewApplicationContent />
    </Suspense>
  );
}
