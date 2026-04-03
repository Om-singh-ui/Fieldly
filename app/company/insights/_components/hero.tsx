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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 35 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  if (isLoading) {
    return (
      <section className="relative mx-auto max-w-[1440px] px-4 sm:px-6 md:px-7 pt-6 sm:pt-16 md:pt-[64px]">
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* LEFT SKELETON - Matches the actual left container structure */}
          <div className="relative mt-24 sm:mt-12 lg:mt-16 w-full max-w-[1240px] self-start rounded-[28px] bg-gradient-to-br from-white via-white/95 to-white px-6 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-7 md:py-8 shadow-[0_12px_40px_rgba(0,0,0,0.2),0_4px_10px_rgba(0,0,0,0.1)] animate-pulse">
            <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-tr from-[#b7cf8a]/15 via-transparent to-transparent" />

            {/* Heading Skeleton - 3 lines for the heading */}
            <div className="max-w-3xl space-y-3">
              <div className="h-8 sm:h-10 md:h-12 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 sm:h-10 md:h-12 bg-gray-200 rounded w-2/3"></div>
              <div className="h-8 sm:h-10 md:h-12 bg-gray-200 rounded w-1/2"></div>
            </div>

            {/* CTA Buttons Skeleton - Two buttons */}
            <div className="relative mt-6 sm:mt-6 flex flex-wrap gap-3">
              <div className="h-10 sm:h-11 w-36 sm:w-40 bg-gray-200 rounded-full"></div>
              <div className="h-10 sm:h-11 w-36 sm:w-40 bg-gray-200 rounded-full"></div>
            </div>

            {/* Trust Section Skeleton - Avatars + text */}
            <div className="relative mt-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Avatar circles */}
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full bg-gray-200"
                    />
                  ))}
                </div>
                {/* Text line */}
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          {/* RIGHT SKELETON - Matches the actual image container */}
          <div className="group z-10 ml-auto w-full max-w-[448px] min-h-[280px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[555px] overflow-hidden rounded-[24px] sm:rounded-[28px] transition-all duration-300 lg:-translate-y-14 shadow-[0_12px_40px_rgba(0,0,0,0.2),0_4px_10px_rgba(0,0,0,0.1)] animate-pulse">
            <div className="relative h-full w-full bg-gray-200">
              {/* Overlay content skeleton - hidden but maintains structure */}
              <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0">
                <div className="bg-black/50 border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-3 w-3 rounded-full bg-gray-300" />
                    <div className="h-4 w-32 bg-gray-300 rounded" />
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-6 bg-gray-300 rounded w-3/4" />
                    <div className="h-6 bg-gray-300 rounded w-2/3" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-16 bg-gray-300 rounded-xl" />
                    <div className="h-16 bg-gray-300 rounded-xl" />
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
    <section className="relative mx-auto max-w-[1440px] px-4 sm:px-6 md:px-7 pt-6 sm:pt-16 md:pt-[64px]">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-y-10 gap-x-6 lg:gap-x-8 lg:grid-cols-[1.15fr_0.85fr]"
      >
        {/* LEFT CONTAINER */}
        <motion.div
          variants={fadeUp}
          className="relative mt-24 sm:mt-12 lg:mt-16 w-full max-w-[1240px] self-start rounded-[28px] bg-gradient-to-br from-white via-white/95 to-white px-6 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-7 md:py-8 shadow-[0_12px_40px_rgba(0,0,0,0.2),0_4px_10px_rgba(0,0,0,0.1)]"
        >
          <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-tr from-[#b7cf8a]/15 via-transparent to-transparent" />

          {/* HERO HEADING */}
          <motion.h1
            variants={fadeUp}
            className="relative max-w-3xl text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-semibold leading-tight sm:leading-[1.15] tracking-tight text-zinc-900"
          >
            Insights shaping the{" "}
            <span className="text-[#9fb86d]">future of agriculture</span>
            <br />
            and land markets
          </motion.h1>

          {/* SUBTEXT (NEW - IMPORTANT) */}
          <motion.p
            variants={fadeUp}
            className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base text-zinc-600"
          >
            Explore the latest research, market trends, and data-driven insights
            from the Fieldly ecosystem&apos;s built for farmers, landowners, and
            agri-builders making smarter decisions.
          </motion.p>

          {/* CTA BUTTONS */}
          <motion.div
            variants={fadeUp}
            className="relative mt-4 sm:mt-6 flex flex-wrap gap-3"
          >
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
              <Button
                onClick={() => router.push("/insights/dashboard")}
                className="group h-10 sm:h-11 rounded-full bg-gradient-to-r from-[#b7cf8a] to-[#9fb86d] px-5 sm:px-6 text-sm font-medium text-black shadow-[0_6px_18px_rgba(183,207,138,0.35)] hover:from-[#a8c47a] hover:to-[#93ae63]"
              >
                Explore Insights
                <span className="ml-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white">
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
              <Button
                onClick={() => router.push("/insights/reports")}
                variant="outline"
                className="group h-10 sm:h-11 rounded-full border-zinc-200 px-5 sm:px-6 text-sm hover:bg-zinc-50"
              >
                Read Reports
                <span className="ml-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#b7cf8a]">
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* TRUST / SOCIAL PROOF */}
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
                        alt="Contributor"
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
                  500+ contributors & experts
                </span>{" "}
                share insights, research, and real-world trends across the
                Fieldly ecosystem.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="group z-10 ml-auto w-full max-w-[448px] min-h-[280px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[555px] overflow-hidden rounded-[24px] sm:rounded-[28px] transition-all duration-300 lg:-translate-y-14 shadow-[0_12px_40px_rgba(0,0,0,0.2),0_4px_10px_rgba(0,0,0,0.1)]"
        >
          <div className="relative h-full w-full">
            <Image
              src="/abouthero.png"
              alt="Cultivated farmland"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />

            {/* MARKETPLACE OVERLAY */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
              <div className="bg-black/50 border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-sm mb-3 tracking-wide">
                  <motion.div
                    className="h-3 w-3 rounded-full bg-[#b7cf8a]"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  Fieldly Insights Hub
                </div>

                <h3 className="text-2xl font-semibold leading-tight mb-4">
                  Research, trends & intelligence shaping modern agriculture
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/20 rounded-xl p-3">
                    <div className="text-lg font-bold">120+</div>
                    <div className="text-xs text-white/80">
                      Reports & Case Studies
                    </div>
                  </div>

                  <div className="bg-white/20 rounded-xl p-3">
                    <div className="text-lg font-bold">50K+</div>
                    <div className="text-xs text-white/80">Monthly Readers</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/20">
                  <p className="text-xs text-white/85 leading-relaxed">
                    Explore deep insights from the Fieldly ecosystem — including
                    land usage trends, leasing patterns, farmer behavior, and
                    policy shifts. Built to help landowners, farmers, and
                    agri-builders make smarter, data-driven decisions.
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
