"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function WhatWeDoSection() {
  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-20 text-black">
      {/* BACKGROUND IMAGE */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Image
          src="/fb01b073e7d70cc8bcbc.jpg"
          alt="Agricultural land background"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-[#b7cf8a]/65" />
      </motion.div>

      {/* CONTENT */}
      <div className="relative z-20 mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-[1.3fr_0.7fr]">
          {/* LEFT */}
          <motion.div
            className="space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            <motion.div
              className="flex items-center gap-3"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="h-1.5 w-6 bg-black/40" />
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-black/70">
                Fieldly Finance
              </p>
            </motion.div>

            <motion.div
              className="space-y-3"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <h2 className="max-w-2xl text-[42px] sm:text-[48px] font-semibold leading-[1.05] tracking-[-0.01em]">
                Invest in Agriculture{" "}
                <span className="text-white">With Confidence</span>
              </h2>

              <h2 className="max-w-2xl text-[42px] sm:text-[48px] font-semibold leading-[1.05] tracking-[-0.01em]">
                Empower Farmers{" "}
                <span className="text-black">Through Capital</span>
              </h2>
            </motion.div>

            <motion.p
              className="max-w-xl text-[18px] leading-[1.8] text-black/85"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              Fieldly enables investors to fund verified agricultural
              opportunities while helping farmers access financial resources to
              cultivate land, scale production, and build sustainable
              livelihoods.
            </motion.p>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            className="flex justify-start lg:justify-end"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="space-y-5">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg"
              >
                <span className="relative z-10">
                  Explore Investment Opportunities
                </span>

                <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#b7cf8a] text-black transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowUpRight className="h-4 w-4" />
                </span>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </motion.button>

              <motion.p
                className="max-w-[220px] text-[13px] leading-relaxed text-black/60"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Discover stable agricultural investment opportunities curated
                and verified by Fieldly.
              </motion.p>

              <motion.div
                className="pt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2.5 rounded-full bg-black/5 px-4 py-2.5">
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
