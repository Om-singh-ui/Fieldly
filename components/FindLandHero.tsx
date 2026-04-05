"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FindLandHero() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRouting, setIsRouting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (isRouting) return;

    setIsRouting(true);

    setTimeout(() => {
      router.push("/marketplace");
    }, 600);
  };

  if (isLoading) {
    return (
      <section className="relative w-full bg-white overflow-hidden font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-6 sm:space-y-8 z-10 animate-pulse">
            <div className="space-y-3 sm:space-y-4">
              <div className="h-12 sm:h-14 lg:h-16 bg-gray-200 rounded-lg w-3/4"></div>
              <div className="h-12 sm:h-14 lg:h-16 bg-gray-200 rounded-lg w-2/3"></div>
            </div>

            <div className="space-y-2 sm:space-y-3 max-w-lg">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>

            <div className="w-fit">
              <div className="h-12 sm:h-14 bg-gray-200 rounded-full w-48 sm:w-56 lg:w-64"></div>
            </div>
          </div>

          <div className="relative flex items-center justify-center min-h-[400px] sm:min-h-[500px] lg:min-h-[650px] mt-8 lg:mt-0 animate-pulse">
            <div className="relative w-[280px] sm:w-[380px] lg:w-[520px] h-[180px] sm:h-[240px] lg:h-[340px] rounded-[30px] sm:rounded-[35px] lg:rounded-[40px] bg-gray-200 shadow-xl"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full bg-white overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="space-y-6 sm:space-y-8 z-10 text-center lg:text-left">
          <h1 className="text-[32px] sm:text-[40px] lg:text-[56px] font-semibold tracking-[-0.02em] leading-[1.2] sm:leading-[1.15] lg:leading-[1.08] text-gray-900">
            Discover Farmland <br className="hidden sm:block" />
            Near Your Location
          </h1>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
            Explore verified farmland listings and agricultural plots available
            for lease or investment. Fieldly connects farmers and landowners
            directly, enabling transparent access to farmland across regions.
          </p>

          <div className="flex justify-center lg:justify-start">
            <button
              onClick={handleClick}
              className="inline-flex items-center justify-between gap-3 sm:gap-4 bg-[#9DB66F] hover:bg-[#8faa61] text-black pl-5 sm:pl-6 pr-2.5 sm:pr-3 py-2.5 sm:py-3 rounded-full text-base sm:text-lg font-medium transition duration-300 shadow-md"
            >
              <Image
                src="/icons/map.png"
                alt="Land Icon"
                width={20}
                height={20}
                className="object-contain sm:w-[22px] sm:h-[22px]"
              />

              <span>Find Land Near You</span>

              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white">
                {isRouting ? (
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
                )}
              </div>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center min-h-[400px] sm:min-h-[500px] lg:min-h-[650px] lg:mt-0">
          {/* Background map image */}
          <div className="relative w-[280px] sm:w-[380px] lg:w-[520px] h-[180px] sm:h-[240px] lg:h-[340px] rounded-[30px] sm:rounded-[35px] lg:rounded-[40px] overflow-hidden shadow-xl bg-white">
            <Image
              src="/landmap.gif"
              alt="Map"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 380px, 520px"
            />
          </div>

          {/* Overlapping phone mockup */}
          <div className="absolute w-[220px] sm:w-[300px] lg:w-[420px] h-[460px] sm:h-[580px] lg:h-[760px] -top-16 sm:-top-20 lg:-top-28 z-10">
            <Image
              src="/map.png"
              alt="Fieldly App"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 640px) 220px, (max-width: 1024px) 300px, 420px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}