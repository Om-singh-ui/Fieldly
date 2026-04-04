"use client";

import { motion } from "framer-motion";
import { 
  MapPin, 
  Calendar, 
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
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="
        group relative flex flex-col gap-4 px-8 md:px-12 py-5
        rounded-full border border-gray-200
        bg-white/80 backdrop-blur-xl
        shadow-[0_8px_24px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)]
        hover:shadow-[0_18px_48px_rgba(0,0,0,0.10)]
        overflow-visible mt-16
        "
      >
        <div className="absolute inset-[1px] rounded-full border border-white/40 pointer-events-none" />

        {/* MAIN */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* LEFT */}
          <div className="flex items-center gap-4 flex-1">
            <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center text-lg font-semibold text-black border border-gray-200 shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                {user.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
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

          {/* RIGHT BUTTONS */}
          <div className="flex gap-3 shrink-0 mt-7 lg:mt-0">
            
            {/* CONTACT */}
            <div 
              className="relative"
              onMouseEnter={() => setShowContactTooltip(true)}
              onMouseLeave={() => setShowContactTooltip(false)}
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="
                  rounded-full px-5 h-10
                  bg-white/90 backdrop-blur-xl
                  border border-gray-200
                  text-gray-900 text-sm font-medium
                  shadow-[0_6px_18px_rgba(0,0,0,0.08)]
                  hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)]
                  transition-all duration-300
                "
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Contact
                </div>
              </motion.button>

              {/* TOOLTIP */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: showContactTooltip ? 1 : 0 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50"
              >
                <div className="relative bg-black text-white text-xs rounded-lg py-2 px-3 shadow-lg whitespace-nowrap">
                  This message will be sent to the land owner
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
                </div>
              </motion.div>
            </div>

            {/* SHARE */}
            <div 
              className="relative"
              onMouseEnter={() => setShowShareTooltip(true)}
              onMouseLeave={() => setShowShareTooltip(false)}
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                disabled={isSharing}
                className="
                  rounded-full px-5 h-10
                  bg-white/90 backdrop-blur-xl
                  border border-gray-200
                  text-gray-900 text-sm font-medium
                  shadow-[0_6px_18px_rgba(0,0,0,0.08)]
                  hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)]
                  transition-all duration-300
                "
              >
                <div className="flex items-center gap-2">
                  {isSharing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      Share
                    </>
                  )}
                </div>
              </motion.button>

              {/* TOOLTIP */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: showShareTooltip ? 1 : 0 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50"
              >
                <div className="relative bg-black text-white text-xs rounded-lg py-2 px-3 shadow-lg whitespace-nowrap">
                  Share this profile with others
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* BIO */}
        {user.bio && (
          <p className="text-sm text-gray-900 max-w-2xl pt-3 border-t border-gray-200">
            {user.bio}
          </p>
        )}
      </motion.div>
    </motion.section>
  );
}