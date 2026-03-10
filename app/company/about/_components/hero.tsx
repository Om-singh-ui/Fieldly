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
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

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
          {/* Left Skeleton */}
          <div className="rounded-[28px] bg-white p-10 animate-pulse">
            <div className="h-32 sm:h-40 bg-gray-200 rounded-2xl mb-6" />
            <div className="h-10 bg-gray-200 rounded-full w-48 mb-8" />
            <div className="flex gap-3">
              <div className="h-10 w-32 bg-gray-200 rounded-full" />
              <div className="h-10 w-32 bg-gray-200 rounded-full" />
            </div>
            <div className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full bg-gray-200" />
                ))}
              </div>
              <div className="h-4 w-48 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Right Skeleton */}
          <div className="rounded-[28px] bg-gray-200 animate-pulse h-[360px] lg:h-[555px] lg:-translate-y-14" />
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
            Unlock the potential of{" "}
            <span className="text-[#9fb86d]">agricultural land</span>
            <br />
            through a trusted{" "}
            <span className="text-zinc-900">
              leasing marketplace
            </span>
          </motion.h1>

          {/* CTA BUTTONS */}
          <motion.div
            variants={fadeUp}
            className="relative mt-2 sm:mt-6 flex flex-wrap gap-3"
          >
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
              <Button
                onClick={() => router.push("/sign-up")}
                className="group h-10 sm:h-11 rounded-full bg-gradient-to-r from-[#b7cf8a] to-[#9fb86d] px-5 sm:px-6 text-sm font-medium text-black shadow-[0_6px_18px_rgba(183,207,138,0.35)] hover:from-[#a8c47a] hover:to-[#93ae63]"
              >
                List Your Land
                <span className="ml-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white">
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
              <Button
                onClick={() => router.push("/marketplace")}
                variant="outline"
                className="group h-10 sm:h-11 rounded-full border-zinc-200 px-5 sm:px-6 text-sm hover:bg-zinc-50"
              >
                Explore Farmland
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
                  1200+ farmers & landowners
                </span>{" "}
                are already building productive partnerships on Fieldly.
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
                  ACTIVE LAND MARKETPLACE
                </div>

                <h3 className="text-2xl font-semibold leading-tight mb-4">
                  Connecting Landowners and Farmers for Productive Agriculture
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/20 rounded-xl p-3">
                    <div className="text-lg font-bold">4K+ Acres</div>
                    <div className="text-xs text-white/80">
                      Land Listed
                    </div>
                  </div>

                  <div className="bg-white/20 rounded-xl p-3">
                    <div className="text-lg font-bold">1500+</div>
                    <div className="text-xs text-white/80">
                      Farmers Connected
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/20">
                  <p className="text-xs text-white/85 leading-relaxed">
                    Fieldly simplifies agricultural land leasing with verified
                    listings, transparent agreements, and tools that help
                    farmers access productive land while enabling landowners to
                    utilize their property efficiently.
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