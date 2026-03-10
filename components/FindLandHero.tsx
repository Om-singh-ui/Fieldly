"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function FindLandHero() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for images/content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <section className="relative w-full bg-white overflow-hidden font-sans">
        <div className="max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-2 gap-16 items-center">
          {/* ================= LEFT CONTENT SKELETON ================= */}
          <div className="space-y-8 z-10 animate-pulse">
            {/* Heading Skeleton */}
            <div className="space-y-4">
              <div className="h-16 bg-gray-200 rounded-lg w-3/4"></div>
              <div className="h-16 bg-gray-200 rounded-lg w-2/3"></div>
            </div>

            {/* Description Skeleton */}
            <div className="space-y-3 max-w-lg">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>

            {/* Button Skeleton */}
            <div className="w-fit">
              <div className="h-14 bg-gray-200 rounded-full w-64"></div>
            </div>
          </div>

          {/* ================= RIGHT VISUAL SKELETON ================= */}
          <div className="relative flex items-center justify-center min-h-[650px] animate-pulse">
            {/* Map Card Skeleton */}
            <div className="relative w-[520px] h-[340px] rounded-[40px] bg-gray-200 shadow-xl"></div>

            {/* Phone Overlay Skeleton */}
            <div className="absolute w-[360px] lg:w-[420px] h-[640px] lg:h-[760px] -top-28 z-10">
              <div className="w-full h-full bg-gray-300 rounded-[60px] shadow-2xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full bg-white overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-2 gap-16 items-center">
        {/* ================= LEFT CONTENT ================= */}
        <div className="space-y-8 z-10">
          {/* Heading */}
          <h1
            className="
              text-[40px]
              sm:text-[48px]
              lg:text-[56px]
              font-semibold
              tracking-[-0.02em]
              leading-[1.08]
              text-gray-900
            "
          >
            Discover Farmland <br />
            Near Your Location
          </h1>

          {/* Description */}
          <p
            className="
              text-gray-600
              text-lg
              leading-relaxed
              max-w-lg
            "
          >
            Explore verified farmland listings and agricultural plots available
            for lease or investment. Fieldly connects farmers and landowners
            directly, enabling transparent access to farmland across regions.
          </p>

          {/* Button */}
          <button
            className="
              inline-flex
              items-center
              justify-between
              gap-4
              bg-[#9DB66F]
              hover:bg-[#8faa61]
              text-black
              pl-6
              pr-3
              py-3
              rounded-full
              text-lg
              font-medium
              transition
              duration-300
              shadow-md
              w-fit
            "
          >
            {/* Left Icon */}
            <Image
              src="/icons/map.png"
              alt="Land Icon"
              width={22}
              height={22}
              className="object-contain"
            />

            <span>Find Land Near You</span>

            {/* Right Arrow Circle */}
            <div
              className="
                flex
                items-center
                justify-center
                w-8
                h-8
                rounded-full
                bg-white
              "
            >
              <ArrowUpRight className="w-4 h-4 text-black" />
            </div>
          </button>
        </div>

        {/* ================= RIGHT VISUAL ================= */}
        <div className="relative flex items-center justify-center min-h-[650px]">
          {/* Map Card */}
          <div
            className="
              relative
              w-[520px]
              h-[340px]
              rounded-[40px]
              overflow-hidden
              shadow-xl
              bg-white
            "
          >
            <Image
              src="/mainmap.png"
              alt="Map"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Phone Overlay */}
          <div
            className="
              absolute
              w-[360px] lg:w-[420px]
              h-[640px] lg:h-[760px]
              -top-28
              z-10
            "
          >
            <Image
              src="/mainmaplap.png"
              alt="Fieldly App"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
