"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { 
  Search, 
  FileText, 
  ClipboardList, 
  FileCheck,
  MessageSquare,
  Calendar,
  TrendingUp,
  Star,
  LucideIcon
} from "lucide-react";

interface Action {
  label: string;
  href: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  darkBg: string;
  description: string;
}

export function FarmerQuickActions() {
  const actions: Action[] = [
    {
      label: "Find Land",
      href: "/farmer/lands",
      icon: Search,
      color: "text-green-600",
      bg: "bg-green-100",
      darkBg: "dark:bg-green-900/30",
      description: "Browse available lands",
    },
    {
      label: "New Application",
      href: "/farmer/applications/new",
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100",
      darkBg: "dark:bg-blue-900/30",
      description: "Apply for land lease",
    },
    {
      label: "Applications",
      href: "/farmer/applications",
      icon: ClipboardList,
      color: "text-purple-600",
      bg: "bg-purple-100",
      darkBg: "dark:bg-purple-900/30",
      description: "Track your applications",
    },
    {
      label: "My Leases",
      href: "/farmer/leases",
      icon: FileCheck,
      color: "text-orange-600",
      bg: "bg-orange-100",
      darkBg: "dark:bg-orange-900/30",
      description: "Manage active leases",
    },
    {
      label: "Messages",
      href: "/farmer/messages",
      icon: MessageSquare,
      color: "text-pink-600",
      bg: "bg-pink-100",
      darkBg: "dark:bg-pink-900/30",
      description: "Chat with landowners",
    },
    {
      label: "Schedule",
      href: "/farmer/schedule",
      icon: Calendar,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      darkBg: "dark:bg-indigo-900/30",
      description: "Plan your activities",
    },
    {
      label: "Bids",
      href: "/farmer/bids",
      icon: TrendingUp,
      color: "text-cyan-600",
      bg: "bg-cyan-100",
      darkBg: "dark:bg-cyan-900/30",
      description: "View your bids",
    },
    {
      label: "Reviews",
      href: "/farmer/reviews",
      icon: Star,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      darkBg: "dark:bg-yellow-900/30",
      description: "Manage reviews",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
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
      className="rounded-2xl p-8 bg-white dark:bg-gray-800 shadow-xl border border-green-100 dark:border-green-900"
    >
      <motion.h2 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
      >
        Quick Actions
      </motion.h2>
      <motion.p 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-gray-600 dark:text-gray-400 mb-6"
      >
        Frequently used actions and shortcuts
      </motion.p>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.label}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={action.href}
                className="relative block p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-green-200 dark:hover:border-green-800 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className={`p-3 rounded-xl ${action.bg} ${action.darkBg} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`h-5 w-5 ${action.color}`} />
                  </motion.div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {action.label}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {action.description}
                    </p>
                  </div>
                </div>

                {/* Animated Arrow */}
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}