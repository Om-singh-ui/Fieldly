"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  Star, 
  Shield, 
  Share2,
  MessageSquare,
  Loader2
} from "lucide-react";
import { ProfileUser } from "@/types/profile";
import { useState } from "react";

interface Props {
  user: ProfileUser & {
    avgRating?: number;
    totalReviews?: number;
  };
}

export function ProfileHeader({ user }: Props) {
  const [isSharing, setIsSharing] = useState(false);
  const [showContactTooltip, setShowContactTooltip] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const joinDate = new Date(user.joinedAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${user.name} - Profile`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Profile link copied!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative z-10"
    >
      {/* CAPSULE */}
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="group relative flex flex-col gap-4 px-8 md:px-12 py-5 
        rounded-full border border-border/60 
        bg-card/70 backdrop-blur-xl
        shadow-[0_8px_24px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)]
        hover:shadow-[0_18px_48px_rgba(0,0,0,0.10)]
        overflow-visible mt-16"
        style={{ overflow: "visible" }}
      >
        {/* inner stroke */}
        <div className="absolute inset-[1px] rounded-full border border-white/40 pointer-events-none" />

        {/* shine */}
        <motion.div
          initial={{ x: "-120%", opacity: 0 }}
          whileHover={{ x: "120%", opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="w-1/3 h-full skew-x-12" />
        </motion.div>

        {/* MAIN ROW */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* LEFT */}
          <div className="flex items-center gap-4 flex-1">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold text-black border border-primary/20 shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col gap-1">
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

          {/* RIGHT - Premium Gradient Buttons */}
          <div className="flex gap-3 shrink-0 mt-7 lg:mt-0">
            {/* Contact Button with Tooltip */}
            <div 
              className="relative"
              onMouseEnter={() => setShowContactTooltip(true)}
              onMouseLeave={() => setShowContactTooltip(false)}
              style={{ isolation: "isolate" }}
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="group relative rounded-full px-5 h-10 bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Border glow effect */}
                <div className="absolute inset-0 rounded-full ring-1 ring-white/20 group-hover:ring-white/40 transition-all" />
                
                <div className="relative z-10 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-black" />
                  <span className="text-black">Contact</span>
                </div>
              </motion.button>

              {/* Tooltip for Contact Button - Higher z-index */}
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ 
                  opacity: showContactTooltip ? 1 : 0,
                  y: showContactTooltip ? -8 : -4,
                  scale: showContactTooltip ? 1 : 0.95,
                  visibility: showContactTooltip ? "visible" : "hidden"
                }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[100] pointer-events-none"
                style={{ 
                  position: "absolute",
                  top: "auto",
                  bottom: "100%",
                }}
              >
                <div className="relative bg-black text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                  This message will be sent to the land owner
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black"></div>
                </div>
              </motion.div>
            </div>

            {/* Share Button with Tooltip */}
            <div 
              className="relative"
              onMouseEnter={() => setShowShareTooltip(true)}
              onMouseLeave={() => setShowShareTooltip(false)}
              style={{ isolation: "isolate" }}
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                disabled={isSharing}
                className="group relative rounded-full px-5 h-10 bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-black text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              > 
                <div className="relative z-10 flex items-center gap-2">
                  {isSharing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-4 h-4" />
                      </motion.div>
                      <span>Sharing...</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 transition-transform group-hover:rotate-12" />
                      <span>Share</span>
                    </>
                  )}
                </div>
              </motion.button>

              {/* Tooltip for Share Button - Higher z-index */}
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ 
                  opacity: showShareTooltip ? 1 : 0,
                  y: showShareTooltip ? -8 : -4,
                  scale: showShareTooltip ? 1 : 0.95,
                  visibility: showShareTooltip ? "visible" : "hidden"
                }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[100] pointer-events-none"
                style={{ 
                  position: "absolute",
                  top: "auto",
                  bottom: "100%",
                }}
              >
                <div className="relative bg-black text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                  Share this profile with others
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* BIO */}
        {user.bio && (
          <p
            className="
              relative z-10 
              text-sm leading-relaxed 
              text-zinc-900
              max-w-2xl
              -mt-1 pt-3
              border-t border-border/50
              before:absolute before:inset-x-0 before:-top-3 before:h-6
              before:bg-gradient-to-b before:from-card/80 before:to-transparent
              before:pointer-events-none
            "
          >
            {user.bio}
          </p>
        )}
      </motion.div>
    </motion.section>
  );
}