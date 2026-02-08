/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setUserRole, getOrCreateUser } from "@/actions/onboarding.actions";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Leaf,
  Building,
  ArrowRight,
  Star,
  Calendar,
  Users,
} from "lucide-react";
import HeroSection from "./_components/hero";

type RoleType = "FARMER" | "LANDOWNER";
type RoleColor = "emerald" | "blue";

interface RoleData {
  id: RoleType;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  color: RoleColor;
  features: string[];
  buttonText: string;
  emoji: string;
  rating: number;
  stats: string;
  duration: string;
  imageBg: string;
  badge: string;
  badgeColor: string;
}

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
      icon: <Leaf className="w-8 h-8 text-emerald-600" />,
      gradient: colorClasses.emerald.glow,
      color: "emerald",
      features: [
        "Discover available farmland",
        "AI soil monitoring insights",
        "Loans & government subsidy access",
        "Crop planning tools",
      ],
      buttonText: "Start Farming Journey",
      emoji: "👨‍🌾",
      rating: 4.8,
      stats: "500+ Farmers Connected",
      duration: "Flexible Leasing",
      imageBg:
        "bg-gradient-to-br from-emerald-50/80 to-emerald-100/80 backdrop-blur-sm",
      badge: "Most Popular",
      badgeColor: "bg-emerald-600 text-white", // Updated to use emerald-600
    },
    {
      id: "LANDOWNER",
      title: "Landowner",
      subtitle: "Property Owner",
      description:
        "Lease your farmland, find verified farmers and receive secure rental income.",
      icon: <Building className="w-8 h-8 text-blue-600" />,
      gradient: colorClasses.blue.glow,
      color: "blue",
      features: [
        "List land for leasing",
        "Match with trusted farmers",
        "Secure & automated payments",
        "Property management tools",
      ],
      buttonText: "Start Leasing Land",
      emoji: "🏢",
      rating: 4.7,
      stats: "200+ Landowners Registered",
      duration: "Guaranteed Income",
      imageBg:
        "bg-gradient-to-br from-blue-50/80 to-blue-100/80 backdrop-blur-sm",
      badge: "Guest Favorite",
      badgeColor: "bg-blue-600 text-white", // Updated to use blue-600
    },
  ];

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
                      {/* Badge - Updated to use colorClass */}
                      {role.badge && (
                        <div
                          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${colorClass.badgeBg} ${colorClass.badgeText} shadow-lg`}
                        >
                          {role.badge}
                        </div>
                      )}

                      {/* Role Icon and Title */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl bg-white/90 backdrop-blur-sm shadow-md border ${colorClass.border}/30`}
                        >
                          {role.icon}
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
                      <div className="flex items-center justify-between">
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

            {/* Enhanced Info Card */}
  <div className="max-w-3xl mx-auto">
    <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 via-transparent to-blue-50/20" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start gap-8">
          
          {/* Icon Container with Enhanced Styling */}
          <div className="relative flex-shrink-0">
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-white to-gray-50 border-2 border-emerald-200/50 shadow-lg p-4 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 to-blue-100/20" />
              
              {/* Icon with Shadow */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-12 h-12 rounded-xl bg-white shadow-inner p-2.5">
                  <img 
                    src="/icons/google-map-icon.webp" 
                    alt="Map icon"
                    className="w-full h-full object-contain drop-shadow-sm"
                  />
                </div>
              </div>
              
              {/* Decorative Corner */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500/10 rounded-full blur-sm" />
            </div>
            
            {/* Animated Ring */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -inset-3 rounded-full border border-emerald-300/30"
            />
          </div>
          
          {/* Content Section */}
          <div className="flex-1">
            {/* Header with Badge */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-700">Flexibility</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900">
                Manage Multiple Roles with Ease
              </h4>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              Start with one role and seamlessly switch between farmer and landowner profiles 
              anytime. Many successful users leverage both roles to m aximize their agricultural 
              opportunities while maintaining complete data separation and preferences.
            </p>
            
            
            {/* Additional Note */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded bg-amber-50 border border-amber-100 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-amber-600">!</span>
                </div>
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-600">Note:</span> Your existing connections, listings, and preferences remain intact when switching roles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>  
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
