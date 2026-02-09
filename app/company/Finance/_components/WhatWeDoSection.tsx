"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

export default function WhatWeDoSection() {
  /* ---------- Animation Variants ---------- */

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-20 text-black">
      {/* ================= BACKGROUND ================= */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src="/fb01b073e7d70cc8bcbc.jpg"
          alt="Agricultural land background"
          fill
          className="object-cover"
        />

        {/* Soft color overlay */}
        <div className="absolute inset-0 bg-[#b7cf8a]/65" />

        {/* Elegant gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5" />
      </motion.div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-20 mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-[1.3fr_0.7fr]">
          {/* ================= LEFT ================= */}
          <motion.div
            className="space-y-4"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Section Label */}
            <motion.div className="flex items-center gap-3" variants={fadeUp}>
              <div className="h-1.5 w-6 bg-black/40" />
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-black/70">
                Fieldly Finance
              </p>
            </motion.div>

            {/* Headlines */}
            <motion.div className="space-y-3" variants={fadeUp}>
              <h2 className="max-w-2xl text-[42px] sm:text-[48px] font-semibold leading-[1.05] tracking-[-0.01em]">
                Invest in Agriculture{" "}
                <span className="text-white">With Confidence</span>
              </h2>

              <h2 className="max-w-2xl text-[42px] sm:text-[48px] font-semibold leading-[1.05] tracking-[-0.01em]">
                Empower Farmers{" "}
                <span className="text-black">Through Capital</span>
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="max-w-xl text-[18px] leading-[1.8] text-black/85"
            >
              Fieldly enables investors to fund verified agricultural
              opportunities while helping farmers access financial resources to
              cultivate land, scale production, and build sustainable
              livelihoods.
            </motion.p>
          </motion.div>

          {/* ================= RIGHT ================= */}
          <motion.div
            className="flex justify-start lg:justify-end"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="space-y-5">
              {/* CTA BUTTON */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-black px-8 py-4 text-sm font-medium text-white shadow-md transition-all duration-300"
              >
                {/* Subtle surface reflection */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-t from-white/10 to-transparent opacity-60" />

                <span className="relative z-10">
                  Explore Investment Opportunities
                </span>

                <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#b7cf8a] text-black transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowUpRight className="h-4 w-4" />
                </span>

                {/* Shimmer Sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </motion.button>

              {/* CTA Helper Text */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="max-w-[220px] text-[13px] leading-relaxed text-black/60"
              >
                Discover stable agricultural investment opportunities curated
                and verified by Fieldly.
              </motion.p>

              {/* Trust Badge */}
              <motion.div
                className="pt-4"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2.5 rounded-full bg-black/5 backdrop-blur-md px-4 py-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10">
                    <span className="text-xs font-semibold">✓</span>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-black">
                      4,000+ Farmers Funded
                    </p>
                    <p className="text-xs text-black/50">
                      Growing Through Fieldly Capital
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
