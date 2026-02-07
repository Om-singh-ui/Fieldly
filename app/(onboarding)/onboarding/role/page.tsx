"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setUserRole, getOrCreateUser } from "@/actions/onboarding.actions";
import { motion } from "framer-motion";
import { CheckCircle, Leaf, Building, ArrowRight, Sparkles, Star, Calendar, Users, MapPin } from "lucide-react";

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"FARMER" | "LANDOWNER" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRoleSelect = async (role: "FARMER" | "LANDOWNER") => {
    setSelectedRole(role);
    setError(null);

    startTransition(async () => {
      try {
        await getOrCreateUser();
        await setUserRole(role);

        router.push(
          role === "FARMER"
            ? "/onboarding/farmer"
            : "/onboarding/landowner"
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to save your role. Please try again."
        );
        setSelectedRole(null);
      }
    });
  };

  const roles = [
    {
      id: "FARMER",
      title: "Farmer",
      subtitle: "Agricultural Producer",
      description: "Looking for land to lease, monitor soil health and access agriculture financing.",
      icon: <Leaf className="w-8 h-8 text-emerald-600" />,
      gradient: "from-emerald-400 via-emerald-500 to-emerald-600",
      color: "emerald",
      features: [
        "Discover available farmland",
        "AI soil monitoring insights",
        "Loans & government subsidy access",
        "Crop planning tools"
      ],
      buttonText: "Start Farming Journey",
      emoji: "👨‍🌾",
      rating: 4.8,
      stats: "500+ Farmers Connected",
      duration: "Flexible Leasing",
      imageBg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      badge: "Most Popular"
    },
    {
      id: "LANDOWNER",
      title: "Landowner",
      subtitle: "Property Owner",
      description: "Lease your farmland, find verified farmers and receive secure rental income.",
      icon: <Building className="w-8 h-8 text-blue-600" />,
      gradient: "from-blue-400 via-blue-500 to-blue-600",
      color: "blue",
      features: [
        "List land for leasing",
        "Match with trusted farmers",
        "Secure & automated payments",
        "Property management tools"
      ],
      buttonText: "Start Leasing Land",
      emoji: "🏢",
      rating: 4.7,
      stats: "200+ Landowners Registered",
      duration: "Guaranteed Income",
      imageBg: "bg-gradient-to-br from-blue-50 to-blue-100",
      badge: "Guest Favorite"
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_10%,transparent_100%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-6xl"
      >
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-gray-700">Welcome to Fieldly</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Path to
            <span className="block mt-2 text-emerald-600">Agricultural Success</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your primary role to unlock personalized features tailored for modern agriculture.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {roles.map((role) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: role.id === "FARMER" ? 0.4 : 0.6 }}
              whileHover={{ y: -4 }}
              className="group"
            >
              {/* Card Container */}
              <div
                className={`
                  relative rounded-2xl overflow-hidden
                  bg-white border border-gray-200
                  shadow-lg hover:shadow-2xl
                  transition-all duration-300
                  ${selectedRole === role.id ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}
                `}
              >
                {/* Image/Header Section */}
                <div className={`relative h-48 ${role.imageBg} p-6`}>
                  {/* Badge */}
                  {role.badge && (
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                      role.id === "FARMER" 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {role.badge}
                    </div>
                  )}

                  {/* Role Icon and Title */}
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-white shadow-md ${
                      role.id === "FARMER" ? 'border-emerald-200' : 'border-blue-200'
                    } border`}>
                      {role.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{role.title}</h3>
                      <p className="text-gray-600">{role.subtitle}</p>
                    </div>
                  </div>

                  {/* Stats Badges */}
                  <div className="flex gap-3 mt-6">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold text-gray-900">{role.rating}</span>
                      <span className="text-xs text-gray-500">(500+)</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-900">{role.stats}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Description */}
                  <p className="text-gray-600 mb-6">{role.description}</p>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {role.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className={`w-5 h-5 mt-0.5 ${
                          role.id === "FARMER" ? 'text-emerald-500' : 'text-blue-500'
                        }`} />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-6" />

                  {/* Bottom Section with Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-5 h-5 ${
                        role.id === "FARMER" ? 'text-emerald-500' : 'text-blue-500'
                      }`} />
                      <span className="text-sm font-medium text-gray-900">{role.duration}</span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRoleSelect(role.id as "FARMER" | "LANDOWNER")}
                      disabled={isPending && selectedRole !== role.id}
                      className={`
                        px-6 py-3 rounded-xl font-semibold
                        flex items-center gap-2
                        transition-all duration-300
                        ${selectedRole === role.id
                          ? `bg-gradient-to-r ${role.gradient} text-white shadow-lg`
                          : `bg-gray-900 text-white hover:bg-gray-800`
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      {isPending && selectedRole === role.id ? (
                        <>
                          <div className={`w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin`} />
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
                    <div className="relative">
                      <div className={`absolute inset-0 w-6 h-6 rounded-full ${
                        role.id === "FARMER" ? 'bg-emerald-500' : 'bg-blue-500'
                      } animate-ping opacity-75`} />
                      <div className={`relative w-6 h-6 rounded-full ${
                        role.id === "FARMER" ? 'bg-emerald-600' : 'bg-blue-600'
                      } flex items-center justify-center`}>
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
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
              className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">!</span>
              </div>
              <div>
                <p className="text-red-700 font-medium">{error}</p>
                <p className="text-red-600 text-sm mt-1">Please try again or contact support if the issue persists.</p>
              </div>
            </motion.div>
          )}

          {/* Info Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-100">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Flexible Role Management</h4>
                  <p className="text-gray-600 text-sm">
                    Start with one role and switch anytime. Many users manage both farmer and landowner profiles 
                    to maximize their agricultural opportunities. Your data and preferences will be preserved.
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Switch roles anytime</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span>Dual profiles supported</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                      <span>Data synchronization</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}