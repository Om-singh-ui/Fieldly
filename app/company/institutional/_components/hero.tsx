"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {},
  );

  const investors = [
    "/testimonials/image3.jpg",
    "/testimonials/image2.jpg",
    "/testimonials/image4.jpeg",
    "/testimonials/images.jpg",
    "/testimonials/9.avif",
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 35 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  if (isLoading) {
    return (
      <section className="relative mx-auto max-w-[1440px] px-4 sm:px-6 md:px-7 pt-6 sm:pt-16 md:pt-[64px]">
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* LEFT SKELETON - FIXED TEXT CONTAINER */}
          <div className="relative mt-24 sm:mt-12 lg:mt-16 w-full max-w-[1240px] self-start rounded-[28px] bg-gradient-to-br from-white via-white/95 to-white px-6 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-7 md:py-8 shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
            <div className="max-w-3xl space-y-4">
              {/* First line - longer */}
              <div className="h-8 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
              {/* Second line - medium */}
              <div className="h-8 bg-gray-200 rounded-lg w-2/3 animate-pulse"></div>
              {/* Third line - shorter */}
              <div className="h-8 bg-gray-200 rounded-lg w-1/2 animate-pulse"></div>

              {/* Subtext skeleton */}
              <div className="space-y-2 pt-4">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
              </div>

              {/* CTA buttons skeleton */}
              <div className="flex flex-wrap gap-3 pt-4">
                <div className="h-10 sm:h-11 w-40 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-10 sm:h-11 w-36 bg-gray-200 rounded-full animate-pulse"></div>
              </div>

              {/* Trust section skeleton */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"
                    ></div>
                  ))}
                </div>
                <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* RIGHT SKELETON */}
          <div className="ml-auto w-full max-w-[448px] min-h-[280px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[555px] bg-gray-200 rounded-[24px] sm:rounded-[28px] animate-pulse"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative mx-auto max-w-[1440px] px-4 sm:px-6 md:px-7 pt-6 sm:pt-16 md:pt-[64px]">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-y-10 gap-x-6 lg:gap-x-8 lg:grid-cols-[1.15fr_0.85fr]"
      >
        {/* LEFT */}
        <motion.div
          variants={fadeUp}
          className="relative mt-24 sm:mt-12 lg:mt-16 w-full max-w-[1240px] self-start rounded-[28px] bg-gradient-to-br from-white via-white/95 to-white px-6 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-7 md:py-8 shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
        >
          <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-tr from-[#b7cf8a]/15 via-transparent to-transparent" />

          {/* YC HEADLINE */}
          <motion.h1
            variants={fadeUp}
            className="relative max-w-3xl text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-semibold leading-tight sm:leading-[1.15] tracking-tight text-zinc-900"
          >
            Turn idle farmland into a{" "}
            <span className="text-[#9fb86d]">
              predictable income-generating asset
            </span>
          </motion.h1>

          {/* YC SUBTITLE */}
          <motion.p
            variants={fadeUp}
            className="relative mt-3 sm:mt-4 max-w-3xl text-sm sm:text-[15px] md:text-[16.5px] leading-6 sm:leading-7 text-zinc-600"
          >
            Fieldly provides structured leasing infrastructure with verified
            farmer matching, digital contracts, and ongoing performance
            oversight.
          </motion.p>
          
          {/* CTA */}
          <motion.div
            variants={fadeUp}
            className="relative mt-2 sm:mt-6 flex flex-wrap gap-3"
          >
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
              <Button
                onClick={() => router.push("/institutional/onboard")}
                className="group h-10 sm:h-11 rounded-full bg-gradient-to-r from-[#b7cf8a] to-[#9fb86d] px-5 sm:px-6 text-sm font-medium text-black shadow-[0_6px_18px_rgba(183,207,138,0.35)]"
              >
                Start Listing Your Land
                <span className="ml-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white">
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
              <Button
                onClick={() => router.push("/yield-model")}
                variant="outline"
                className="group h-10 sm:h-11 rounded-full border-zinc-200 px-5 sm:px-6 text-sm hover:bg-zinc-50"
              >
                Investment Model
                <span className="ml-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#b7cf8a]">
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* TRUST SECTION */}
          <motion.div variants={fadeUp} className="relative mt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex -space-x-3">
                {investors.map((src, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.08 }}
                    className="relative h-10 w-10 rounded-full overflow-hidden shadow-sm"
                  >
                    {imageErrors[index] ? (
                      <div className="h-full w-full flex items-center justify-center bg-gray-300 text-white text-xs font-semibold">
                        {index + 1}
                      </div>
                    ) : (
                      <Image
                        src={src}
                        alt="User"
                        width={40}
                        height={40}
                        className="object-cover h-full w-full"
                        onError={() => handleImageError(index)}
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              <p className="text-sm text-zinc-700">
                <span className="font-semibold text-black">
                  Early institutional partners onboarding
                </span>{" "}
                to activate agricultural land as a structured income-generating
                asset.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="group z-10 ml-auto w-full max-w-[448px] min-h-[280px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[555px] overflow-hidden rounded-[24px] sm:rounded-[28px] transition-all duration-300 lg:-translate-y-14 shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
        >
          <div className="relative h-full w-full">
            <Image
              src="/investmenthero.png"
              alt="Institutional farmland"
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              <div className="bg-black/50 border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-sm mb-3 tracking-wide">
                  <motion.div
                    className="h-3 w-3 rounded-full bg-[#b7cf8a]"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  LAND PERFORMANCE
                </div>

                <h3 className="text-2xl font-semibold mb-4">
                  Operational leasing infrastructure for agricultural assets
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/20 rounded-xl p-3">
                    <div className="text-lg font-bold">12–18%</div>
                    <div className="text-xs text-white/80">Expected Yield</div>
                  </div>

                  <div className="bg-white/20 rounded-xl p-3">
                    <div className="text-lg font-bold">4K+ Acres</div>
                    <div className="text-xs text-white/80">Activated</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/20">
                  <p className="text-xs text-white/85">
                    Verified farmer matching, compliance workflows, and digital
                    lease execution enable farmland to function as a modern
                    income-producing asset class.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
