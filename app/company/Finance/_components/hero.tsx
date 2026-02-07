"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react"; // Add useState

export default function HeroSection() {
  const router = useRouter();
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {},
  ); // Track image errors

  // Investors data
  const investors = [
    "/testimonials/image3.jpg",
    "/testimonials/image2.jpg",
    "/testimonials/image4.jpeg",
    "/testimonials/images.jpg",
    "/testimonials/9.avif",
  ];

  // Handle image error
  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <section className="relative mx-auto max-w-[1440px] px-4 sm:px-6 md:px-7 pt-6 sm:pt-16 md:pt-[64px] -mt-6 sm:-mt-10 md:mt-0">
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 lg:gap-x-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* LEFT */}
        <div className="relative mt-24 sm:mt-12 lg:mt-16 w-full max-w-[1240px] self-start rounded-[28px] bg-gradient-to-br from-white via-white/95 to-white px-6 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-7 md:py-8 shadow-[0_22px_60px_rgba(183,207,138,0.5),0_0_0_1px_rgba(183,207,138,0.35)]">
          <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-tr from-[#b7cf8a]/15 via-transparent to-transparent" />

          <h1 className="relative max-w-3xl text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-semibold leading-tight sm:leading-[1.15] tracking-tight text-zinc-900">
            Grow your wealth <span className="text-[#9fb86d]">with us...</span>
            <br />
            <span className="text-zinc-900">
              In the Domain of Agriculture...
            </span>
          </h1>

          <p className="relative mt-3 sm:mt-4 max-w-3xl text-sm sm:text-[15px] md:text-[16.5px] leading-6 sm:leading-7 text-zinc-600">
            Invest in sustainable agricultural loans. Support farmers. Earn
            stable returns.
          </p>

          <div className="relative mt-4 sm:mt-6 flex flex-wrap gap-3">
            {/* For Landowners */}
            <Button
              onClick={() => router.push("/sign-up")}
              className="group h-10 sm:h-11 rounded-full bg-gradient-to-r from-[#b7cf8a] to-[#9fb86d] px-5 sm:px-6 text-sm font-medium text-black shadow-[0_6px_18px_rgba(183,207,138,0.35)] hover:from-[#a8c47a] hover:to-[#93ae63]"
            >
              Sign UP
              <span className="ml-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white">
                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </span>
            </Button>

            {/* For Farmers */}
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
          </div>

          {/* INVESTORS TRUST COMPONENT - FIXED */}
          <div className="relative mt-6 sm:mt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gradient-to-r from-zinc-50/80 to-white px-5 py-4 rounded-xl border border-zinc-100 shadow-sm">
              {/* Avatars - SIMPLIFIED AND SAFER */}
              <div className="flex -space-x-3">
                {investors.map((src, index) => (
                  <div
                    key={index}
                    className="relative h-10 w-10 rounded-full border-2 border-white overflow-hidden shadow-sm bg-gradient-to-br from-[#b7cf8a] to-[#9fb86d]"
                  >
                    {/* Show fallback if image failed */}
                    {imageErrors[index] ? (
                      <div className="h-full w-full flex items-center justify-center text-white text-xs font-semibold">
                        {index + 1}
                      </div>
                    ) : (
                      // Image component with safe error handling
                      <Image
                        src={src}
                        alt={`Investor ${index + 1}`}
                        width={40}
                        height={40}
                        className="object-cover h-full w-full"
                        onError={() => handleImageError(index)}
                      />
                    )}

                    {/* Online indicator dot */}
                    {index === 0 && (
                      <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border border-white"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className="text-sm sm:text-base text-zinc-700">
                  <span className="font-semibold text-zinc-900">
                    x+ investors
                  </span>{" "}
                  have trusted us.{" "}
                  <button
                    onClick={() => router.push("/investors")}
                    className="ml-1 font-medium text-[#9fb86d] hover:text-[#8caa5c] cursor-pointer hover:underline transition-colors"
                  >
                    Join investors community today.
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="group z-10 ml-auto w-full max-w-[448px] min-h-[280px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[555px] overflow-hidden rounded-[24px] sm:rounded-[28px] transition-all duration-300 lg:-translate-y-14 hover:shadow-[0_28px_90px_rgba(255,205,70,0.6),0_0_0_1px_rgba(255,205,70,0.4)]">
          <div className="relative h-full w-full pt-12 sm:pt-16 md:pt-20">
            <Image
              src="/cornfield-under-sky-stockcake.webp"
              alt="Cultivated farmland"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="bg-black/40 backdrop-blur-lg border border-white/25 rounded-2xl p-6 transform translate-y-6 group-hover:translate-y-0 transition-all duration-300">
                <div className="flex items-center gap-2 text-sm font-medium mb-3">
                  <div className="relative h-4 w-4">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    <motion.div
                      className="absolute inset-1 rounded-full bg-green-400 shadow-lg shadow-green-400/50"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                  <span className="tracking-wider text-white font-semibold">
                    LIVE
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold leading-tight">
                  Pioneering Indian Agriculture by Bridging Farmers & Landowners
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
