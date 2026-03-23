"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  FileText,
  ClipboardList,
  FileCheck,
  MessageSquare,
  Calendar,
  TrendingUp,
  Star,
  LucideIcon,
} from "lucide-react";

interface Action {
  label: string;
  icon: LucideIcon;
  href: string;
  description: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

const iconVariants: Variants = {
  hover: {
    rotate: 6,
    scale: 1.15,
    transition: { type: "spring", stiffness: 300, damping: 14 },
  },
  tap: { scale: 0.94 },
};

const ACTIONS: Action[] = [
  {
    label: "Find Land",
    icon: Search,
    href: "/farmer/lands",
    description: "Browse lands",
  },
  {
    label: "New Application",
    icon: FileText,
    href: "/farmer/applications/new",
    description: "Apply lease",
  },
  {
    label: "Applications",
    icon: ClipboardList,
    href: "/farmer/applications",
    description: "Track requests",
  },
  {
    label: "My Leases",
    icon: FileCheck,
    href: "/farmer/leases",
    description: "Active leases",
  },
  {
    label: "Messages",
    icon: MessageSquare,
    href: "/farmer/messages",
    description: "Chat owners",
  },
  {
    label: "Schedule",
    icon: Calendar,
    href: "/farmer/schedule",
    description: "Plan work",
  },
  {
    label: "Bids",
    icon: TrendingUp,
    href: "/farmer/bids",
    description: "Your offers",
  },
  {
    label: "Reviews",
    icon: Star,
    href: "/farmer/reviews",
    description: "Your ratings",
  },
];

const QuickActionItem = memo(({ action }: { action: Action }) => {
  const Icon = action.icon;

  return (
    <motion.div variants={itemVariants} className="h-full">
      <Button
        asChild
        variant="outline"
        className="
          relative h-auto w-full flex-col gap-2 p-4 rounded-xl
          border-black/10 dark:border-white/10
          bg-black/[0.02] dark:bg-white/[0.04]
          hover:bg-black/[0.05] dark:hover:bg-white/[0.08]
          text-black dark:text-white
          transition-all duration-200
          shadow-sm hover:shadow-md
          group overflow-hidden
        "
      >
        <Link href={action.href} className="flex flex-col items-center gap-2 w-full">
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={iconVariants}
            className="
              p-2.5 rounded-xl
              bg-black/5 dark:bg-white/10
              transition
            "
          >
            <Icon className="h-5 w-5" />
          </motion.div>

          <div className="text-center">
            <span className="text-xs font-semibold tracking-tight block">
              {action.label}
            </span>
            <span className="text-[10px] opacity-60 block">
              {action.description}
            </span>
          </div>

          {/* subtle shine */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/5"
            initial={{ x: "-100%", opacity: 0 }}
            whileHover={{
              x: "100%",
              opacity: 1,
              transition: { duration: 0.5 },
            }}
          />
        </Link>
      </Button>
    </motion.div>
  );
});

QuickActionItem.displayName = "QuickActionItem";

export const FarmerQuickActions = memo(function FarmerQuickActions() {
  const items = useMemo(
    () => ACTIONS.map((a) => <QuickActionItem key={a.label} action={a} />),
    []
  );

  return (
    <Card className="border-black/10 dark:border-white/10 bg-white dark:bg-black shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold tracking-tight">
          Quick Actions
        </CardTitle>
      </CardHeader>

      <CardContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {items}
        </motion.div>
      </CardContent>
    </Card>
  );
});