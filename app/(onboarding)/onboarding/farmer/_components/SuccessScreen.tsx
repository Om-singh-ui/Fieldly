"use client";

import { CheckCircle, ArrowRight, Shield, TrendingUp, Award, Users } from "lucide-react";
import { motion } from "framer-motion";

interface SuccessScreenProps {
  onContinue?: () => void;
}

export function SuccessScreen({ onContinue }: SuccessScreenProps) {
  const benefits = [
    {
      icon: Shield,
      title: "Profile Verified",
      description: "Your profile is now verified and active"
    },
    {
      icon: TrendingUp,
      title: "Smart Matching",
      description: "Finding lands that match your criteria"
    },
    {
      icon: Award,
      title: "Access Granted",
      description: "Unlocked premium farming resources"
    },
    {
      icon: Users,
      title: "Community",
      description: "Join our network of verified farmers"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-12"
    >
      {/* Success Animation */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-500 rounded-3xl flex items-center justify-center mx-auto">
          <CheckCircle className="h-16 w-16 text-white" />
        </div>
        
        {/* Animated Rings */}
        <motion.div
          className="absolute inset-0 rounded-3xl border-4 border-emerald-300"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      {/* Success Message */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Profile Complete! 🎉
        </h2>
        <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
          Your farmer profile has been successfully created and is now active.
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-8">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-emerald-700 font-medium">Processing your matches...</span>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center mb-4">
              <benefit.icon className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
            <p className="text-sm text-gray-600">{benefit.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 max-w-2xl mx-auto mb-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          What&apos;s Next?
        </h3>
        <div className="space-y-3">
          {[
            "Land matching algorithm is finding suitable properties",
            "Verification team will review your profile (24-48 hours)",
            "You'll receive curated land recommendations",
            "Schedule site visits with landowners"
          ].map((step, index) => (
            <div key={step} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
              </div>
              <span className="text-gray-700">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="text-center">
        <button
          onClick={onContinue}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
        >
          Continue to Dashboard
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-sm text-gray-500 mt-4">
          You&apos;ll be redirected to your farmer dashboard
        </p>
      </div>
    </motion.div>
  );
}