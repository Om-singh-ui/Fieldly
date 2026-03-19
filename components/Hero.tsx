"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HeroSection() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading time for images/content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <section className="relative mx-auto max-w-[1440px] px-4 sm:px-6 md:px-7 pt-6 sm:pt-16 md:pt-[64px] -mt-6 sm:-mt-10 md:mt-0">
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 lg:gap-x-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* LEFT SKELETON */}
          <div className="relative mt-24 sm:mt-12 lg:mt-16 w-full max-w-[1240px] self-start rounded-[28px] bg-gradient-to-br from-white via-white/95 to-white px-6 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-7 md:py-8 shadow-[0_12px_40px_rgba(0,0,0,0.2),0_4px_10px_rgba(0,0,0,0.1)] animate-pulse">
            <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-tr from-[#b7cf8a]/15 via-transparent to-transparent" />

            {/* Heading Skeleton */}
            <div className="max-w-3xl space-y-3">
              <div className="h-8 sm:h-10 md:h-12 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 sm:h-10 md:h-12 bg-gray-200 rounded w-2/3"></div>
              <div className="h-8 sm:h-10 md:h-12 bg-gray-200 rounded w-1/2"></div>
            </div>

            {/* Description Skeleton */}
            <div className="mt-3 sm:mt-4 max-w-3xl space-y-2">
              <div className="h-4 sm:h-5 bg-gray-200 rounded w-full"></div>
              <div className="h-4 sm:h-5 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 sm:h-5 bg-gray-200 rounded w-4/6"></div>
            </div>

            {/* Buttons Skeleton */}
            <div className="relative mt-4 sm:mt-6 flex flex-wrap gap-3">
              <div className="h-10 sm:h-11 w-36 sm:w-40 bg-gray-200 rounded-full"></div>
              <div className="h-10 sm:h-11 w-32 sm:w-36 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          {/* RIGHT SKELETON */}
          <div className="group z-10 ml-auto w-full max-w-[448px] min-h-[280px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[555px] overflow-hidden rounded-[24px] sm:rounded-[28px] transition-all duration-300 lg:-translate-y-14 animate-pulse">
            <div className="relative h-full w-full pt-12 sm:pt-16 md:pt-20">
              {/* Image Placeholder */}
              <div className="absolute inset-0 bg-gray-200"></div>

              {/* Text Overlay Placeholder - Hidden in skeleton */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 lg:p-6 z-10 opacity-0">
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/25 rounded-2xl p-4 sm:p-5 md:p-6 lg:p-6 shadow-[0_15px_45px_rgba(0,0,0,0.35), inset_0_1px_0_rgba(255,255,255,0.18)]">
                  <div className="flex items-center gap-2 text-sm font-medium mb-3">
                    <div className="relative h-4 w-4">
                      <div className="absolute inset-0 rounded-full bg-gray-300"></div>
                    </div>
                    <div className="h-4 w-12 bg-gray-300 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative mx-auto max-w-[1440px] px-4 sm:px-6 md:px-7 pt-6 sm:pt-16 md:pt-[64px] -mt-6 sm:-mt-10 md:mt-0">
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 lg:gap-x-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* LEFT */}
        <div className="relative mt-24 sm:mt-12 lg:mt-16 w-full max-w-[1240px] self-start rounded-[28px] bg-gradient-to-br from-white via-white/95 to-white px-6 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-7 md:py-8 shadow-[0_12px_40px_rgba(0,0,0,0.2),0_4px_10px_rgba(0,0,0,0.1)]">
          <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-tr from-[#b7cf8a]/15 via-transparent to-transparent" />

          <h1 className="relative max-w-3xl text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-semibold leading-tight sm:leading-[1.15] tracking-tight text-zinc-900">
            We Enable Farmers <span className="text-[#9fb86d]">to</span>
            <br />
            <span className="bg-gradient-to-r from-[#b7cf8a] to-[#9fb86d] bg-clip-text text-transparent">
              Access Land & Cultivate
            </span>
          </h1>

          <p className="relative mt-3 sm:mt-4 max-w-3xl text-sm sm:text-[15px] md:text-[16.5px] leading-6 sm:leading-7 text-zinc-600">
            Fieldly connects landowners and farmers through a transparent,
            trust-first leasing platform unlocking idle land and enabling
            cultivation without brokers.
          </p>

          <div className="relative mt-4 sm:mt-6 flex flex-wrap gap-3">
            {/* For Landowners */}
            <Button
              onClick={() => router.push("/post-auth")}
              className="group h-10 sm:h-11 rounded-full bg-gradient-to-r from-[#b7cf8a] to-[#9fb86d] px-5 sm:px-6 text-sm font-medium text-black shadow-[0_6px_18px_rgba(183,207,138,0.35)] hover:from-[#a8c47a] hover:to-[#93ae63]"
            >
              For Landowners
              <span className="ml-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white">
                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </span>
            </Button>

            {/* For Farmers */}
            <Button
              onClick={() => router.push("/post-auth")}
              variant="outline"
              className="group h-10 sm:h-11 rounded-full border-zinc-200 px-5 sm:px-6 text-sm hover:bg-zinc-50"
            >
              For Farmers
              <span className="ml-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#b7cf8a]">
                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </span>
            </Button>
          </div>
        </div>

        {/* RIGHT */}
        <div
          className="group z-10 ml-auto w-full max-w-[448px] min-h-[280px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[555px] overflow-hidden rounded-[24px] sm:rounded-[28px] transition-all duration-500 lg:-translate-y-14
hover:shadow-[0_30px_90px_rgba(183,207,138,0.45),0_0_0_1px_rgba(183,207,138,0.35)]"
        >
          <div className="relative h-full w-full pt-12 sm:pt-16 md:pt-20">
            <Image
              src="/herro.jpg"
              alt="Global land collaboration"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />

            {/* OVERLAY */}
            <div
              className="
      absolute bottom-0 left-0 right-0
      bg-gradient-to-t from-black/75 via-black/30 to-transparent
      p-4 sm:p-5 md:p-6 lg:p-6
      text-white z-10
      opacity-100 sm:opacity-0 sm:group-hover:opacity-100
      transition-all duration-300
      "
            >
              <div
                className="
        relative
        bg-black/40 backdrop-blur-xl
        border border-white/20
        rounded-2xl
        p-4 sm:p-5 md:p-6
        shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.2)]
        transform translate-y-2 sm:translate-y-6
        sm:group-hover:translate-y-0
        transition-all duration-400
        "
              >
                {/* LIVE INDICATOR */}
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold mb-3 tracking-wide">
                  <div className="relative h-4 w-4">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />

                    <motion.div
                      className="absolute inset-1 rounded-full bg-[#b7cf8a] shadow-lg shadow-[#b7cf8a]/60"
                      animate={{ scale: [1, 1.25, 1], opacity: [1, 0.6, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>

                  <span className="tracking-wider text-white/90">
                    LIVE NETWORK
                  </span>
                </div>

                {/* HEADLINE */}
                <h3 className="text-xl sm:text-2xl font-semibold leading-tight mb-4">
                  4,000+ members discovering land opportunities
                </h3>

                {/* METRICS */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                    <div className="text-lg font-bold">4K+</div>

                    <div className="text-xs text-white/80">Active Members</div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                    <div className="text-lg font-bold">20K+</div>

                    <div className="text-xs text-white/80">Land Listings</div>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="mt-4 pt-3 border-t border-white/20">
                  <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                    Connecting landowners and individuals globally through a
                    transparent and accessible digital platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
