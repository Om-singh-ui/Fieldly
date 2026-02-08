/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setUserRole, getOrCreateUser } from "@/actions/onboarding.actions";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Star, Calendar, Users } from "lucide-react";
import HeroSection from "./_components/hero";
import FAQSection from "./_components/FAQSection";
import HowItWorks from "./_components/HowItWorks";
import { ArrowUpRight } from "lucide-react";

type RoleType = "FARMER" | "LANDOWNER";
type RoleColor = "emerald" | "blue";

interface RoleData {
  id: RoleType;
  title: string;
  subtitle: string;
  description: string;
  iconSrc: string;
  gradient: string;
  color: RoleColor;
  features: string[];
  buttonText: string;
  rating: number;
  stats: string;
  duration: string;
  imageBg: string;
  badge: string;
}

// Skeleton Components
const HeroSkeleton = () => (
  <section className="relative mx-auto max-w-[1440px] px-4 sm:px-6 md:px-7 pt-6 sm:pt-16 md:pt-[64px] -mt-6 sm:-mt-10 md:mt-0">
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 lg:gap-x-8 lg:grid-cols-[1.15fr_0.85fr]">
      {/* Left Skeleton */}
      <div className="relative mt-24 sm:mt-12 lg:mt-16 w-full max-w-[1240px] self-start rounded-[28px] bg-gradient-to-br from-white via-white/95 to-white px-6 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-7 md:py-8 shadow-[0_25px_50px_rgba(0,0,0,0.08)]">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse mt-6" />
          <div className="h-4 bg-gray-200 rounded-lg w-2/3 animate-pulse" />
          <div className="flex gap-4 mt-6">
            <div className="h-12 bg-gray-200 rounded-lg w-32 animate-pulse" />
            <div className="h-12 bg-gray-200 rounded-lg w-32 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Right Skeleton */}
      <div className="group z-10 ml-auto w-full max-w-[448px] min-h-[280px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[555px] overflow-hidden rounded-[24px] sm:rounded-[28px] bg-gray-200 animate-pulse" />
    </div>
  </section>
);

const RoleCardSkeleton = () => (
  <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-lg">
    <div className="relative h-48 bg-gray-100 p-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-gray-200 animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse" />
        <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse" />
      </div>
    </div>
    <div className="p-6">
      <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-4" />
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse mb-6" />
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 my-6" />
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
        <div className="h-12 bg-gray-200 rounded-xl w-36 animate-pulse" />
      </div>
    </div>
  </div>
);

const InfoCardSkeleton = () => (
  <div className="max-w-3xl mx-auto">
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-gray-200 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

const FAQSectionSkeleton = () => (
  <section className="relative w-full bg-white py-16 sm:py-20 px-4 sm:px-6 overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* Left Content Skeleton */}
        <div className="lg:w-1/2">
          <div className="mb-10">
            <div className="h-8 bg-gray-200 rounded-full w-32 animate-pulse mb-4" />
            <div className="h-12 bg-gray-200 rounded w-3/4 animate-pulse mb-4" />
            <div className="h-12 bg-gray-200 rounded w-1/2 animate-pulse mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse mb-6" />
            <div className="h-12 bg-gray-200 rounded-full w-36 animate-pulse" />
          </div>
        </div>

        {/* Right FAQ Skeleton */}
        <div className="lg:w-1/2">
          <div className="rounded-[28px] bg-white shadow-lg p-8 sm:p-10">
            <div className="space-y-1">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="rounded-lg bg-gray-50 p-4 mb-2">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded w-full animate-pulse" />
                    <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Reduced from 1500ms for better UX

    return () => clearTimeout(timer);
  }, []);

  const handleRoleSelect = async (role: RoleType) => {
    setSelectedRole(role);
    setError(null);

    startTransition(async () => {
      try {
        await getOrCreateUser();
        await setUserRole(role);

        router.push(
          role === "FARMER" ? "/onboarding/farmer" : "/onboarding/landowner",
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to save your role. Please try again.",
        );
        setSelectedRole(null);
      }
    });
  };

  // Define color mappings with proper typing
  const colorClasses: Record<
    RoleColor,
    {
      glow: string;
      text: string;
      soft: string;
      border: string;
      bg: string;
      badgeBg: string;
      badgeText: string;
    }
  > = {
    emerald: {
      glow: "from-emerald-400 via-emerald-500 to-emerald-600",
      text: "text-emerald-500",
      soft: "bg-emerald-100/50 border-emerald-200/30",
      border: "border-emerald-200",
      bg: "bg-emerald-500",
      badgeBg: "bg-emerald-600",
      badgeText: "text-black",
    },
    blue: {
      glow: "from-blue-400 via-blue-500 to-blue-600",
      text: "text-blue-500",
      soft: "bg-blue-100/50 border-blue-200/30",
      border: "border-blue-200",
      bg: "bg-blue-500",
      badgeBg: "bg-blue-600",
      badgeText: "text-white",
    },
  };

  const roles: RoleData[] = [
    {
      id: "FARMER",
      title: "Farmer",
      subtitle: "Agricultural Producer",
      description:
        "Looking for land to lease, monitor soil health and access agriculture financing.",
      iconSrc: "/ilsfarmer.png",
      gradient: colorClasses.emerald.glow,
      color: "emerald",
      features: [
        "Discover available farmland",
        "AI soil monitoring insights",
        "Loans & government subsidy access",
        "Crop planning tools",
      ],
      buttonText: "Start Farming Journey",
      rating: 4.8,
      stats: "500+ Farmers Connected",
      duration: "Flexible Leasing",
      imageBg: "bg-white",
      badge: "Most Popular",
    },
    {
      id: "LANDOWNER",
      title: "Landowner",
      subtitle: "Property Owner",
      description:
        "Lease your farmland, find verified farmers and receive secure rental income.",
      iconSrc: "/landownersicon.png",
      gradient: colorClasses.blue.glow,
      color: "blue",
      features: [
        "List land for leasing",
        "Match with trusted farmers",
        "Secure & automated payments",
        "Property management tools",
      ],
      buttonText: "Start Leasing Land",
      rating: 4.7,
      stats: "200+ Landowners Registered",
      duration: "Guaranteed Income",
      imageBg: "bg-white",
      badge: "Guest Favorite",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <HeroSkeleton />
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12 bg-gradient-to-br from-gray-50 via-white to-emerald-50/20">
          <div className="relative z-10 w-full max-w-6xl">
            {/* Header Skeleton */}
            <div className="text-center mb-12">
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse" />
            </div>

            {/* Cards Grid Skeleton */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <RoleCardSkeleton />
              <RoleCardSkeleton />
            </div>

            {/* Info Card Skeleton */}
            <InfoCardSkeleton />

            {/* FAQ Section Skeleton */}
            <div className="mt-12">
              <FAQSectionSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section at the top of the page */}
      <HeroSection />

      {/* Role Selection Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12 bg-gradient-to-br from-background via-background to-emerald-50/20">
        {/* Background Pattern - Subtler */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.646_0.222_41.116)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.6_0.118_184.704)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_10%,transparent_100%)]" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-100/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 30, 0],
              x: [0, -20, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-100/10 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-6xl"
        >
          {/* Header Section */}
          <div className="text-center mb-12">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select your primary role to unlock personalized features tailored
              for modern agriculture.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {roles.map((role) => {
              const colorClass = colorClasses[role.color];

              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: role.id === "FARMER" ? 0.4 : 0.6 }}
                  whileHover={{
                    y: -8,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                  className="group"
                >
                  {/* Card Container */}
                  <div
                    className={`
                      relative rounded-2xl overflow-hidden
                      bg-card border border-border/50
                      shadow-lg hover:shadow-2xl
                      transition-all duration-300
                      hover:${colorClass.border}/50
                      ${selectedRole === role.id ? "ring-2 ring-emerald-500 ring-offset-2" : ""}
                    `}
                  >
                    {/* Image/Header Section */}
                    <div className={`relative h-48 ${role.imageBg} p-6`}>
                      {/* Badge */}
                      {role.badge && (
                        <div
                          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${colorClass.badgeBg} ${colorClass.badgeText} shadow-lg`}
                        >
                          {role.badge}
                        </div>
                      )}

                      {/* Role Icon and Title */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 p-2.5">
                          <img
                            src={role.iconSrc}
                            alt={`${role.title} icon`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-card-foreground">
                            {role.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {role.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Stats Badges */}
                      <div className="flex gap-3 mt-6">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg border border-border/50">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold text-card-foreground">
                            {role.rating}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            (500+)
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg border border-border/50">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-semibold text-card-foreground">
                            {role.stats}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      {/* Description */}
                      <p className="text-muted-foreground mb-6">
                        {role.description}
                      </p>

                      {/* Features Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {role.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index + 0.2 }}
                            className="flex items-start gap-2"
                          >
                            <CheckCircle
                              className={`w-5 h-5 mt-0.5 ${colorClass.text}`}
                            />
                            <span className="text-sm text-card-foreground">
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Divider */}
                      <div className="border-t border-border my-6" />

                      {/* Bottom Section with Button */}
                      <div className="flex items-center mt-4 justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-5 h-5 ${colorClass.text}`} />
                          <span className="text-sm font-medium text-card-foreground">
                            {role.duration}
                          </span>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRoleSelect(role.id)}
                          disabled={isPending && selectedRole !== role.id}
                          className={`
                            px-6 py-3 rounded-xl font-semibold
                            flex items-center gap-2
                            transition-all duration-300
                            cursor-pointer
                            ${
                              selectedRole === role.id
                                ? `bg-gradient-to-r ${colorClass.glow} text-primary-foreground shadow-lg`
                                : `bg-primary text-primary-foreground hover:bg-primary/90`
                            }
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                        >
                          {isPending && selectedRole === role.id ? (
                            <>
                              <div
                                className={`w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin`}
                              />
                              Processing...
                            </>
                          ) : (
                            <>
                              {role.buttonText}
                              <ArrowRight className="w-5 h-5" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {selectedRole === role.id && (
                      <div className="absolute top-4 left-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="relative"
                        >
                          <div
                            className={`absolute inset-0 w-6 h-6 rounded-full ${colorClass.bg} animate-ping opacity-75`}
                          />
                          <div
                            className={`relative w-6 h-6 rounded-full ${colorClass.bg} flex items-center justify-center`}
                          >
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {/* Glow Effect on Hover */}
                    <div
                      className={`absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${colorClass.glow} blur-xl -z-10`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Info Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-destructive flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-destructive-foreground text-xs">!</span>
                </div>
                <div>
                  <p className="text-destructive font-medium">{error}</p>
                  <p className="text-destructive/80 text-sm mt-1">
                    Please try again or contact support if the issue persists.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Minimal Horizontal Info Card */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-lg bg-emerald-50 border border-emerald-100 p-2.5">
                      <img
                        src="/icons/google-map-icon.webp"
                        alt="Map"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 mb-1">
                      Flexible Role Switching
                    </h4>
                    <p className="text-sm text-gray-600">
                      Start with one role, switch anytime. Your data stays safe
                      when changing between farmer and landowner profiles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <section className="mt-12">
              <HowItWorks />
            </section>
            <section className="py-24">
              <div className="mx-auto max-w-[1300px] px-6">
                {/* Section Heading */}
                <h2 className="text-[36px] font-semibold tracking-tight text-black mb-16">
                  Connecting Farmers & Landowners Seamlessly
                </h2>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  {/* LEFT IMAGE */}
                  <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="w-full"
                  >
                    <div className="relative w-full h-[420px] rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12 p-6">
                      {/* Fixed Image */}
                      <img
                        src="/rolecompare.png"
                        alt="Farmer and Landowner Connection"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </motion.div>

                  {/* RIGHT CONTENT */}
                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-[40px] font-semibold tracking-tight text-[#2c3328] mb-6 leading-tight">
                      Built Around Trust, Access & Opportunity
                    </h3>

                    <p className="text-gray-700 text-[17px] leading-[1.7] max-w-xl mb-10">
                      Fieldly bridges the gap between landowners and farmers
                      through a verified digital ecosystem. Whether you&apos;re
                      looking to lease unused agricultural land or searching for
                      cultivable farmland, our platform ensures secure
                      onboarding, transparent agreements, and streamlined
                      financial access.
                    </p>

                    <p className="text-gray-600 text-[16px] leading-[1.7] max-w-xl mb-10">
                      By simplifying land discovery and verification workflows,
                      Fieldly empowers farmers to scale cultivation while
                      helping landowners unlock the true potential of their
                      assets.
                    </p>

                    <button className="group inline-flex items-center gap-3 bg-[#b7cf8a] text-black font-medium px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all">
                      Choose Your Role
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white group-hover:translate-x-1 transition">
                        <ArrowUpRight size={16} />
                      </span>
                    </button>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mt-12">
              <FAQSection />
            </section>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
