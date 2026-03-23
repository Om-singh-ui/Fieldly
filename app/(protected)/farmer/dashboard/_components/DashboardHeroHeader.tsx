"use client";

import { motion } from "framer-motion";
import { Download, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  name: string;
}

export function DashboardHeroHeader({ name }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <section className="relative">
        <div className="group relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 px-8 md:px-12 py-6 md:py-7 rounded-full border border-gray-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] backdrop-blur-md overflow-hidden animate-pulse">
          <div className="absolute inset-[1px] rounded-full border border-white/50" />

          <div className="relative z-10 flex flex-col justify-center flex-1">
            <div className="space-y-2">
              <div className="h-8 md:h-10 bg-gray-200 rounded w-64 md:w-80"></div>
              <div className="h-4 md:h-5 bg-gray-200 rounded w-48 md:w-56"></div>
            </div>

            <div className="mt-1.5 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full max-w-md"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 max-w-sm"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6 max-w-xs"></div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 shrink-0">
            <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative"
    >
      <motion.div
        whileHover={{
          y: -3,
          scale: 1.012,
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 20,
          mass: 0.6,
        }}
        className="group relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 px-8 md:px-12 py-6 md:py-7 rounded-full border border-gray-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_48px_rgba(0,0,0,0.10),0_6px_16px_rgba(0,0,0,0.06)] backdrop-blur-md transition-shadow duration-300 will-change-transform overflow-hidden"
      >
        <div className="absolute inset-[1px] rounded-full border border-white/50" />

        <motion.div
          initial={{ x: "-120%", opacity: 0 }}
          whileHover={{ x: "120%", opacity: 1 }}
          transition={{
            duration: 1.8,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute inset-0"
        >
          <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
        </motion.div>

        {/* LEFT */}
        <div className="relative z-10 flex flex-col justify-center">
          <h1 className="text-[22px] md:text-[34px] font-semibold tracking-tight text-gray-900 leading-tight">
            Welcome back, <span className="font-bold text-black">{name}</span>
          </h1>

          <p className="mt-1.5 text-sm md:text-base text-gray-600 leading-relaxed">
            A unified workspace to manage your lands, track earnings, and oversee applications with clarity.
          </p>
        </div>

        {/* RIGHT */}
        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <motion.div
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            <Button
              variant="outline"
              className="rounded-full px-5 h-10 hover:bg-white shadow-sm transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-0.5" />
              Export
            </Button>
          </motion.div>

          <motion.div
            whileHover={{
              y: -1,
              scale: 1.035,
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            <Button
              onClick={() => router.push("/marketplace")}
              className="rounded-full px-6 h-10 bg-[#b7cf8a] hover:bg-[#a9c87a] text-gray-900 font-medium border border-[#a9c87a] shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.14)] transition-all duration-200"
            >
              <MapPin className="w-4 h-4 mr-0.5" />
              Explore Land&apos;s
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}