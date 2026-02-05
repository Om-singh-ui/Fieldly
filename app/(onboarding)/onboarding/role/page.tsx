// app/(onboarding)/onboarding/role/page.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setUserRole, getOrCreateUser } from "@/actions/onboarding.actions";
import { motion } from "framer-motion";

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
        // Get or create user
        await getOrCreateUser();
        
        // Save role to database
        await setUserRole(role);
        
        // AUTOMATIC REDIRECT to appropriate onboarding
        router.push(
          role === "FARMER"
            ? "/onboarding/farmer"
            : "/onboarding/landowner"
        );
      } catch (err) {
        console.error("Role selection error:", err);
        setError(err instanceof Error ? err.message : "Failed to save your role. Please try again.");
        setSelectedRole(null);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Fieldly 🌱
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tell us about yourself so we can tailor your experience.
            Choose the role that best describes you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Farmer Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => handleRoleSelect("FARMER")}
              disabled={isPending && selectedRole !== "FARMER"}
              className={`
                w-full p-8 rounded-2xl border-3 transition-all duration-300
                ${selectedRole === "FARMER"
                  ? "border-green-500 bg-green-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"
                }
                ${isPending && selectedRole !== "FARMER" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                flex flex-col items-center text-left
              `}
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">👨‍🌾</span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                I&lsquo;m a Farmer
              </h3>
              
              <p className="text-gray-600 mb-6">
                Looking for agricultural land to lease for cultivation. 
                You want to grow crops, need farm infrastructure, and 
                want access to financial support.
              </p>

              <div className="space-y-3 text-left w-full">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Find available land</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Get soil monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Access loans & subsidies</span>
                </div>
              </div>

              {selectedRole === "FARMER" && isPending && (
                <div className="mt-6 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                  <span className="text-sm text-green-600">Setting up your farmer profile...</span>
                </div>
              )}
            </button>
          </motion.div>

          {/* Landowner Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => handleRoleSelect("LANDOWNER")}
              disabled={isPending && selectedRole !== "LANDOWNER"}
              className={`
                w-full p-8 rounded-2xl border-3 transition-all duration-300
                ${selectedRole === "LANDOWNER"
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                }
                ${isPending && selectedRole !== "LANDOWNER" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                flex flex-col items-center text-left
              `}
            >
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">🏢</span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                I&lsquo;m a Landowner
              </h3>
              
              <p className="text-gray-600 mb-6">
                Own agricultural land and want to lease it to farmers. 
                You&lsquo;re looking for reliable tenants, proper documentation, 
                and regular rental income.
              </p>

              <div className="space-y-3 text-left w-full">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">List your land for lease</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Find verified farmers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Get secure payments</span>
                </div>
              </div>

              {selectedRole === "LANDOWNER" && isPending && (
                <div className="mt-6 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-blue-600">Setting up your landowner profile...</span>
                </div>
              )}
            </button>
          </motion.div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <p className="text-red-600 text-center">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setSelectedRole(null);
              }}
              className="mt-2 text-sm text-red-500 hover:text-red-700 underline mx-auto block"
            >
              Try again
            </button>
          </motion.div>
        )}

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            You can change your role later from settings if needed.
          </p>
        </div>
      </motion.div>
    </div>
  );
}