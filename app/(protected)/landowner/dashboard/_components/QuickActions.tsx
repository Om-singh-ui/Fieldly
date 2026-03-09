"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  FileText,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export function QuickActions() {
  const actions = [
    { label: "Add New Land", icon: Plus, href: "/landowner/lands/new" },
    { label: "Applications", icon: FileText, href: "/landowner/applications" },
    { label: "Leases", icon: Users, href: "/landowner/leases" },
    { label: "Analytics", icon: BarChart3, href: "/landowner/analytics" },
    { label: "Settings", icon: Settings, href: "/landowner/settings" },
    { label: "Support", icon: HelpCircle, href: "/support" },
  ];

  return (
    <Card className="border-muted/40 shadow-sm backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">
          Quick Actions
        </CardTitle>
      </CardHeader>

      <CardContent>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3"
        >
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <motion.div
                key={action.label}
                variants={item}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                <Button
                  asChild
                  variant="outline"
                  className="
                  relative h-auto w-full flex-col gap-2 p-4 rounded-xl
                  text-black border-none shadow-md
                  hover:shadow-xl hover:scale-[1.03]
                  transition-all duration-300 group overflow-hidden
                  "
                >
                  <a
                    href={action.href}
                    className="flex flex-col items-center gap-2"
                  >
                    {/* animated icon container */}
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.18 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="
                      relative p-2 rounded-lg
                      bg-white/30 backdrop-blur
                      "
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>

                    {/* label */}
                    <span className="text-xs font-semibold tracking-tight">
                      {action.label}
                    </span>

                    {/* hover glow */}
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-white/10"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.25 }}
                      transition={{ duration: 0.3 }}
                    />
                  </a>
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
}