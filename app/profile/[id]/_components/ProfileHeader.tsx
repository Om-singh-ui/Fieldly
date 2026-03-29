"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Star, Shield } from "lucide-react";
import { ProfileUser } from "@/types/profile";

interface Props {
  user: ProfileUser & {
    avgRating?: number;
    totalReviews?: number;
  };
}

export function ProfileHeader({ user }: Props) {
  const joinDate = new Date(user.joinedAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/*CAPSULE */}
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="group relative flex flex-col gap-4 px-8 md:px-12 py-5 
        rounded-full border border-border/60 
        bg-card/70 backdrop-blur-xl
        shadow-[0_8px_24px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)]
        hover:shadow-[0_18px_48px_rgba(0,0,0,0.10)]
        overflow-hidden mt-16"
      >
        {/* inner stroke */}
        <div className="absolute inset-[1px] rounded-full border border-white/40 pointer-events-none" />

        {/* shine sweep */}
        <motion.div
          initial={{ x: "-120%", opacity: 0 }}
          whileHover={{ x: "120%", opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
        </motion.div>

        {/* 🔹 MAIN ROW */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          {/* LEFT */}
          <div className="flex items-center gap-4 flex-1">

            {/* Avatar */}
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary border border-primary/20 shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            {/* TEXT */}
            <div className="flex flex-col gap-1">

              {/* Name */}
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg md:text-xl font-semibold">
                  {user.name}
                </h1>

                {user.isVerified && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 px-2 py-0.5">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}

                {user.avgRating && user.avgRating > 0 && (
                  <Badge variant="outline" className="px-2 py-0.5">
                    <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
                    {user.avgRating.toFixed(1)}
                  </Badge>
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">

                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {user.location}
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {joinDate}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex gap-2 shrink-0">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="rounded-full px-4 h-9 bg-primary text-primary-foreground text-sm font-medium"
            >
              Contact
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="rounded-full px-4 h-9 border text-sm font-medium"
            >
              Share
            </motion.button>
          </div>
        </div>

        {user.bio && (
          <p className="relative z-10 text-sm text-muted-foreground leading-relaxed">
            {user.bio}
          </p>
        )}
      </motion.div>
    </motion.section>
  );
}