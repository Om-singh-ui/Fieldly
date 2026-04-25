// app/(protected)/admin/users/[userId]/_components/UserProfileCard.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import type { UserDetails } from "../_types";

interface UserProfileCardProps {
  user: UserDetails;
  roleBadge: {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
}

export function UserProfileCard({ user, roleBadge }: UserProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card
        className="rounded-3xl overflow-hidden
        bg-white/80 dark:bg-gray-900/80
        backdrop-blur-xl
        border border-gray-200/50 dark:border-gray-700/50
        shadow-lg"
      >
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Profile Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Outer soft glow ring */}
              <div
                className="absolute inset-0 rounded-full 
      bg-gradient-to-br from-white/40 to-gray-200/20
      blur-md opacity-70"
              />

              {/* Avatar container */}
              <div
                className="
        relative h-28 w-28 rounded-full
        bg-gradient-to-br from-white/70 to-gray-200/30
        dark:from-white/10 dark:to-white/5
        backdrop-blur-xl
        flex items-center justify-center
        overflow-hidden
        border border-white/40 dark:border-white/10
        shadow-[0_10px_30px_rgba(0,0,0,0.08)]
      "
              >
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.name}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 px-2">
            <div
              className="flex items-center gap-3 p-2.5 rounded-xl
              bg-gray-50/50 dark:bg-gray-800/50
              hover:bg-gray-100/50 dark:hover:bg-gray-800/80
              transition-colors duration-200"
            >
              <div
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700
                flex items-center justify-center"
              >
                <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {user.email}
              </span>
            </div>

            {user.phone && (
              <div
                className="flex items-center gap-3 p-2.5 rounded-xl
                bg-gray-50/50 dark:bg-gray-800/50
                hover:bg-gray-100/50 dark:hover:bg-gray-800/80
                transition-colors duration-200"
              >
                <div
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700
                  flex items-center justify-center"
                >
                  <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user.phone}
                </span>
              </div>
            )}

            {(user.state || user.district) && (
              <div
                className="flex items-center gap-3 p-2.5 rounded-xl
                bg-gray-50/50 dark:bg-gray-800/50
                hover:bg-gray-100/50 dark:hover:bg-gray-800/80
                transition-colors duration-200"
              >
                <div
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700
                  flex items-center justify-center"
                >
                  <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {[user.district, user.state].filter(Boolean).join(", ")}
                </span>
              </div>
            )}

            <div
              className="flex items-center gap-3 p-2.5 rounded-xl
              bg-gray-50/50 dark:bg-gray-800/50
              hover:bg-gray-100/50 dark:hover:bg-gray-800/80
              transition-colors duration-200"
            >
              <div
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700
                flex items-center justify-center"
              >
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Joined {format(new Date(user.createdAt), "MMMM d, yyyy")}
              </span>
            </div>
          </div>

          {/* Role & Status */}
          <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Role
              </span>
              <Badge
                variant={roleBadge.variant}
                className="rounded-lg px-3 py-1"
              >
                {roleBadge.label}
              </Badge>
            </div>

            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </span>
              {user.isOnboarded ? (
                <Badge
                  className="rounded-lg px-3 py-1
                  bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400
                  border border-green-200/50 dark:border-green-800/50"
                >
                  <CheckCircle className="h-3 w-3 mr-1.5" />
                  Onboarded
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="rounded-lg px-3 py-1
                  bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400
                  border border-gray-200/50 dark:border-gray-700/50"
                >
                  <XCircle className="h-3 w-3 mr-1.5" />
                  Pending
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
