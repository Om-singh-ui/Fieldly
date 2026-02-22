"use client";

import { motion, Variants } from "framer-motion";
import { 
  Leaf, 
  Calendar, 
  MapPin, 
  Landmark, 
  Droplets,
  Wheat,
  Sprout,
  Edit3,
  CheckCircle
} from "lucide-react";

interface FarmerProfile {
  primaryCrops: string[];
  farmingExperience: number;
  requiredLandSize: number;
  leaseDuration: number;
  farmingType?: string;
  irrigationNeeded?: boolean;
  isVerified?: boolean;
}

interface ProfileCardProps {
  profile: FarmerProfile;
}

export function FarmerProfileCard({ profile }: ProfileCardProps) {
  const profileItems = [
    {
      icon: Wheat,
      label: "Primary Crops",
      value: profile.primaryCrops.join(", "),
      color: "text-green-600",
      bg: "bg-green-100",
      darkBg: "dark:bg-green-900/30",
    },
    {
      icon: Calendar,
      label: "Experience",
      value: `${profile.farmingExperience} years`,
      color: "text-blue-600",
      bg: "bg-blue-100",
      darkBg: "dark:bg-blue-900/30",
    },
    {
      icon: MapPin,
      label: "Required Land",
      value: `${profile.requiredLandSize} acres`,
      color: "text-purple-600",
      bg: "bg-purple-100",
      darkBg: "dark:bg-purple-900/30",
    },
    {
      icon: Landmark,
      label: "Lease Duration",
      value: `${profile.leaseDuration} months`,
      color: "text-orange-600",
      bg: "bg-orange-100",
      darkBg: "dark:bg-orange-900/30",
    },
    {
      icon: Sprout,
      label: "Farming Type",
      value: profile.farmingType || "Conventional",
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      darkBg: "dark:bg-indigo-900/30",
    },
    {
      icon: Droplets,
      label: "Irrigation",
      value: profile.irrigationNeeded ? "Required" : "Not Required",
      color: "text-cyan-600",
      bg: "bg-cyan-100",
      darkBg: "dark:bg-cyan-900/30",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="rounded-2xl p-8 bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            {profile.isVerified && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-4 border-white dark:border-gray-800"
              >
                <CheckCircle className="h-4 w-4 text-white" />
              </motion.div>
            )}
          </motion.div>
          
          <div>
            <motion.h2 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              Your Farming Profile
            </motion.h2>
            <motion.p 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              Complete your profile to get better matches
            </motion.p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        >
          <Edit3 className="h-4 w-4" />
          <span className="font-medium">Edit Profile</span>
        </motion.button>
      </div>

      {/* Profile Stats */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {profileItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 group cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 15 }}
                className={`p-2 rounded-lg ${item.bg} ${item.darkBg} group-hover:scale-110 transition-transform`}
              >
                <Icon className={`h-5 w-5 ${item.color}`} />
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {item.label}
                </p>
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {item.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Profile Strength */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Profile Strength</span>
          <span className="text-sm font-semibold text-green-600">85%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "85%" }}
            transition={{ delay: 1, duration: 1, type: "spring", stiffness: 50 }}
            className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full"
          />
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-xs text-gray-500 dark:text-gray-400 mt-2"
        >
          Add more details to reach 100%
        </motion.p>
      </motion.div>
    </motion.div>
  );
}