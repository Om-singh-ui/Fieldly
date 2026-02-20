"use client";

import { motion } from "framer-motion";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  name: string;
}

export function DashboardHeroHeader({ name }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1], // smoother than easeOut
      }}
      className="relative mb-12 mt-16"
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
        className="
          group
          relative

          flex
          flex-col md:flex-row
          items-start md:items-center
          justify-between

          gap-6 md:gap-8

          px-8 md:px-12
          py-6 md:py-7

          rounded-full
          border border-gray-200/80

          shadow-[0_8px_24px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)]
          hover:shadow-[0_18px_48px_rgba(0,0,0,0.10),0_6px_16px_rgba(0,0,0,0.06)]

          backdrop-blur-md

          transition-shadow duration-300

          will-change-transform
          overflow-hidden
        "
      >
        {/* Inner highlight stroke */}
        <div
          className="
            pointer-events-none
            absolute inset-[1px]
            rounded-full
            border border-white/50
          "
        />

        {/* Smooth light sweep on hover only */}
        <motion.div
          initial={{ x: "-120%", opacity: 0 }}
          whileHover={{ x: "120%", opacity: 1 }}
          transition={{
            duration: 1.8,
            ease: "easeInOut",
          }}
          className="
            pointer-events-none
            absolute inset-0
          "
        >
          <div
            className="
              w-1/3
              h-full
              bg-gradient-to-r
              from-transparent
              via-white/40
              to-transparent
              skew-x-12
            "
          />
        </motion.div>

        {/* LEFT SIDE */}
        <div className="relative z-10 flex flex-col justify-center">
          <h1
            className="
              text-[22px] md:text-[34px]
              font-semibold
              tracking-tight
              text-gray-900
              leading-tight
            "
          >
            Welcome back,{" "}
            <span className="font-bold text-black">{name}</span>
          </h1>

          <p
            className="
              mt-1.5
              text-sm md:text-base
              text-gray-600
              leading-relaxed
            "
          >
            A unified workspace to manage your lands, track earnings, and
            oversee applications with clarity.{" "}
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div
          className="
            relative z-10
            flex items-center
            gap-3
            shrink-0
          "
        >
          <motion.div
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            <Button
              variant="outline"
              className="
                rounded-full
                px-5
                h-10
                hover:bg-white
                shadow-sm
                transition-all duration-200
              "
            >
              <Download className="w-4 h-4 mr-2" />
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
              className="
                rounded-full
                px-6
                h-10

                bg-[#b7cf8a]
                hover:bg-[#a9c87a]

                text-gray-900
                font-medium

                border border-[#a9c87a]

                shadow-[0_4px_12px_rgba(0,0,0,0.10)]
                hover:shadow-[0_8px_20px_rgba(0,0,0,0.14)]

                transition-all duration-200
              "
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Land
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}
