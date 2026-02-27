"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { useState } from "react";

export default function HeroSection() {
  const router = useRouter();

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

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  /* ---------- Framer Variants (FIXED TYPES) ---------- */

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

  return (
    <section className="relative mx-auto max-w-[1440px] px-4 sm:px-6 md:px-7 pt-6 sm:pt-16 md:pt-[64px] -mt-6 sm:-mt-10 md:mt-0">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-y-10 gap-x-6 lg:gap-x-8 lg:grid-cols-[1.15fr_0.85fr]"
      >
        {/* ================= LEFT ================= */}

        <motion.div
          variants={fadeUp}
          className="relative mt-24 sm:mt-12 lg:mt-16 w-full max-w-[1240px] self-start rounded-[28px] bg-gradient-to-br from-white via-white/95 to-white px-6 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-7 md:py-8  shadow-[0_12px_40px_rgba(0,0,0,0.2),0_4px_10px_rgba(0,0,0,0.1)]"
        >
          <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-tr from-[#b7cf8a]/15 via-transparent to-transparent" />

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="relative max-w-3xl text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-semibold leading-tight sm:leading-[1.15] tracking-tight text-zinc-900"
          >
            Grow your wealth <span className="text-[#9fb86d]">with us...</span>
            <br />
            <span className="text-zinc-900">
              In the Domain of Agriculture...
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="relative mt-3 sm:mt-4 max-w-3xl text-sm sm:text-[15px] md:text-[16.5px] leading-6 sm:leading-7 text-zinc-600"
          >
            Invest in sustainable agricultural loans. Support farmers. Earn
            stable returns.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            className="relative mt-4 sm:mt-6 flex flex-wrap gap-3"
          >
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
              <Button
                onClick={() => router.push("/sign-up")}
                className="group h-10 sm:h-11 rounded-full bg-gradient-to-r from-[#b7cf8a] to-[#9fb86d] px-5 sm:px-6 text-sm font-medium text-black shadow-[0_6px_18px_rgba(183,207,138,0.35)] hover:from-[#a8c47a] hover:to-[#93ae63]"
              >
                Sign UP
                <span className="ml-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white">
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
              <Button
                onClick={() => router.push("/sign-in")}
                variant="outline"
                className="group h-10 sm:h-11 rounded-full border-zinc-200 px-5 sm:px-6 text-sm hover:bg-zinc-50"
              >
                Explore Fieldly
                <span className="ml-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#b7cf8a]">
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Investors Trust */}
          <motion.div variants={fadeUp} className="relative mt-8">
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              {/* Avatars */}
              <div className="flex -space-x-3">
                {investors.map((src, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.08 }}
                    className="relative h-10 w-10 rounded-full  overflow-hidden shadow-sm"
                  >
                    {imageErrors[index] ? (
                      <div className="h-full w-full flex items-center justify-center text-white text-xs font-semibold">
                        {index + 1}
                      </div>
                    ) : (
                      <Image
                        src={src}
                        alt="Investor"
                        width={40}
                        height={40}
                        className="object-cover h-full w-full"
                        onError={() => handleImageError(index)}
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-zinc-700">
                <span className="font-semibold text-black">
                  1000+ investors
                </span>{" "}
                have trusted Fieldly.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* ================= RIGHT ================= */}

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="group z-10 ml-auto w-full max-w-[448px] min-h-[280px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[555px] overflow-hidden rounded-[24px] sm:rounded-[28px] transition-all duration-300 lg:-translate-y-14 shadow-[0_12px_40px_rgba(0,0,0,0.2),0_4px_10px_rgba(0,0,0,0.1)]"
        >
          <div className="relative h-full w-full pt-12 sm:pt-16 md:pt-20">
            <Image
              src="/cornfield-under-sky-stockcake.webp"
              alt="Cultivated farmland"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />

             {/* Overlay Glass Card */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              className="absolute bottom-0 left-0 right-0 p-6 text-white"
            >
              <div className="bg-black/40 backdrop-blur-xl border border-white/25 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-sm mb-3">
                  <motion.div
                    className="h-3 w-3 rounded-full bg-green-400"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  />
                  LIVE
                </div>

                <h3 className="text-2xl font-semibold">
                  Bridging Farmers & Landowners Across India
                </h3>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
