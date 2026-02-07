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

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">

      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/40 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/40 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-5xl"
      >
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Welcome to <span className="text-emerald-600">Fieldly</span> 🌱
          </h1>

          <p className="mt-4 text-gray-600 text-lg max-w-xl mx-auto">
            Let’s personalize your experience. Choose your primary role to get
            started.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Farmer Card */}
          <motion.button
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelect("FARMER")}
            disabled={isPending && selectedRole !== "FARMER"}
            className={`group relative rounded-3xl p-[1px] transition-all duration-300 ${
              selectedRole === "FARMER"
                ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                : "bg-transparent"
            }`}
          >
            <div
              className={`
                backdrop-blur-xl rounded-3xl p-8 h-full
                border border-gray-200 bg-white/80
                transition-all duration-300
                group-hover:shadow-xl
                ${
                  selectedRole === "FARMER"
                    ? "shadow-2xl border-emerald-200"
                    : ""
                }
              `}
            >
              <div className="flex flex-col items-center text-center">

                {/* Icon */}
                <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6 text-4xl shadow-inner">
                  👨‍🌾
                </div>

                <h3 className="text-2xl font-semibold text-gray-900">
                  I’m a Farmer
                </h3>

                <p className="mt-3 text-gray-600">
                  Looking for land to lease, monitor soil health and access
                  agriculture financing.
                </p>

                <ul className="mt-6 space-y-2 text-sm text-gray-700 text-left w-full max-w-xs">
                  <li>• Discover available farmland</li>
                  <li>• AI soil monitoring insights</li>
                  <li>• Loans & government subsidy access</li>
                </ul>

                {selectedRole === "FARMER" && isPending && (
                  <div className="mt-6 flex items-center gap-2 text-emerald-600">
                    <div className="h-5 w-5 animate-spin border-b-2 border-emerald-600 rounded-full" />
                    Setting up your farmer profile...
                  </div>
                )}
              </div>
            </div>
          </motion.button>

          {/* Landowner Card */}
          <motion.button
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelect("LANDOWNER")}
            disabled={isPending && selectedRole !== "LANDOWNER"}
            className={`group relative rounded-3xl p-[1px] transition-all duration-300 ${
              selectedRole === "LANDOWNER"
                ? "bg-gradient-to-r from-blue-400 to-blue-600"
                : "bg-transparent"
            }`}
          >
            <div
              className={`
                backdrop-blur-xl rounded-3xl p-8 h-full
                border border-gray-200 bg-white/80
                transition-all duration-300
                group-hover:shadow-xl
                ${
                  selectedRole === "LANDOWNER"
                    ? "shadow-2xl border-blue-200"
                    : ""
                }
              `}
            >
              <div className="flex flex-col items-center text-center">

                {/* Icon */}
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-6 text-4xl shadow-inner">
                  🏢
                </div>

                <h3 className="text-2xl font-semibold text-gray-900">
                  I’m a Landowner
                </h3>

                <p className="mt-3 text-gray-600">
                  Lease your farmland, find verified farmers and receive secure
                  rental income.
                </p>

                <ul className="mt-6 space-y-2 text-sm text-gray-700 text-left w-full max-w-xs">
                  <li>• List land for leasing</li>
                  <li>• Match with trusted farmers</li>
                  <li>• Secure & automated payments</li>
                </ul>

                {selectedRole === "LANDOWNER" && isPending && (
                  <div className="mt-6 flex items-center gap-2 text-blue-600">
                    <div className="h-5 w-5 animate-spin border-b-2 border-blue-600 rounded-full" />
                    Setting up your landowner profile...
                  </div>
                )}
              </div>
            </div>
          </motion.button>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 bg-red-50 border border-red-200 rounded-xl p-4 text-center"
          >
            <p className="text-red-600">{error}</p>
          </motion.div>
        )}

        <p className="mt-12 text-center text-sm text-gray-500">
          You can change your role later from settings.
        </p>
      </motion.div>
    </div>
  );
}
