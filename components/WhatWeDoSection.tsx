"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function WhatWeDoSection() {
  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-20 text-black">
      
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/fb01b073e7d70cc8bcbc.jpg" 
          alt="Agricultural land background"
          fill
          className="object-cover"
          priority={false}
        />
        {/* Brand overlay */}
        <div className="absolute inset-0 bg-[#b7cf8a]/65" />
      </div>

      {/* CONTENT */}
      <div className="relative z-20 mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-[1.3fr_0.7fr]">

          {/* LEFT */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-6 bg-black/40" />
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-black/70">
                What we do
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="max-w-2xl text-[42px] sm:text-[48px] font-semibold leading-[1.05] tracking-[-0.01em]">
                Connecting Landowners{" "}
                <span className="text-white">with Farmers</span>
              </h2>
              <h2 className="max-w-2xl text-[42px] sm:text-[48px] font-semibold leading-[1.05] tracking-[-0.01em]">
                to Enable Cultivation{" "}
                <span className="text-black">with ease.</span>
              </h2>
            </div>

            <p className="max-w-xl text-[18px] leading-[1.8] text-black/85">
              A trust-first platform that unlocks idle land and enables farmers
              to cultivate with clarity and confidence.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex justify-start lg:justify-end">
            <div className="space-y-5">
              <button className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg">
                <span className="relative z-10">Contact Us</span>
                <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#b7cf8a] text-black transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>

              <p className="max-w-[200px] text-[13px] leading-relaxed text-black/60">
                Schedule a consultation with our agricultural experts.
              </p>

              <div className="pt-4">
                <div className="inline-flex items-center gap-2.5 rounded-full bg-black/5 px-4 py-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10">
                    <span className="text-xs font-semibold">✓</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">
                      4,000+ Farmers
                    </p>
                    <p className="text-xs text-black/50">
                      Already connected
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
