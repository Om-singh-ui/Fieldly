"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const cards = [
  {
    id: "01",
    title: "Physical Soil\nCarbon Verification",
    image: "/soilsample.jpg",
    icon: "/icons/map.png",
    dark: false,
    description:
      "Direct field-level soil sampling ensures every parcel listed on CultiLand meets baseline soil health standards, protecting both farmers and landowners from long-term degradation.",
  },
  {
    id: "02",
    title: "Laboratory\nAnalysis",
    image: "/lab.jpg",
    icon: "/icons/lab-comments-lab-icon-11563543413l1wi3meotr.png",
    dark: false,
    description:
      "Certified laboratory testing validates soil composition, fertility indicators, and organic matter levels to support transparent, data-backed land leasing.",
  },
  {
    id: "03",
    title: "Satellite\nIntelligence",
    image: "/stl.jpg",
    icon: "/icons/stl.png",
    dark: true,
    description:
      "Satellite imagery combined with ground data enables continuous monitoring of land usage, crop cycles, and soil impact across regions.",
  },
  {
    id: "04",
    title: "Independent\nVerification",
    image: "/sunset-handshake-farmers-tractor-min.webp",
    icon: "/icons/5290058.png",
    dark: false,
    description:
      "Third-party verification ensures every lease aligns with CultiLand's soil-first standards and long-term land productivity goals.",
  },
];

export default function MultiModalMonitoring() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bg-[#fafafa] py-24">
      <div className="mx-auto max-w-[1400px] px-6">
        {/* HEADING */}
        {loading ? (
          <div className="mb-14">
            <div className="mb-4 h-12 w-80 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-12 w-64 rounded-full bg-gray-200 animate-pulse" />
          </div>
        ) : (
          <h2 className="mb-14 max-w-xl text-[36px] sm:text-[40px] lg:text-[44px] font-semibold leading-tight text-zinc-900">
            Multi-Modal Monitoring
            <br />
            System
          </h2>
        )}

        {/* CARDS CONTAINER */}
        <div
          className={cn(
            "gap-4",
            "grid grid-cols-1",
            "sm:grid-cols-2",
            "lg:flex"
          )}
        >
          {loading
            ? [...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="relative h-[300px] sm:h-[340px] md:h-[380px] lg:h-[420px] overflow-hidden rounded-[28px] bg-gray-200 animate-pulse"
                >
                  <div className="relative z-10 flex h-full flex-col justify-between p-6">
                    <div className="flex items-center justify-between">
                      <div className="h-11 w-11 rounded-full bg-gray-300" />
                      <div className="h-5 w-6 rounded-full bg-gray-300" />
                    </div>

                    <div>
                      <div className="mb-4 h-8 w-48 rounded-full bg-gray-300" />
                      <div className="mb-2 h-4 w-full rounded-full bg-gray-300" />
                      <div className="h-4 w-3/4 rounded-full bg-gray-300" />
                    </div>
                  </div>
                </div>
              ))
            : cards.map((card) => (
                <div
                  key={card.id}
                  className={cn(
                    "group relative overflow-hidden rounded-[28px]",
                    "transition-all duration-500 ease-out",

                    // Height responsiveness
                    "h-[300px] sm:h-[340px] md:h-[380px] lg:h-[420px]",

                    // Desktop expansion only
                    "lg:flex-1",
                    "lg:hover:flex-[2.4]"
                  )}
                >
                  {/* BACKGROUND IMAGE */}
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    priority={card.id === "01"}
                    className={cn(
                      "object-cover transition-transform duration-700",
                      "group-hover:scale-[1.05]",
                      "contrast-[1.05] saturate-[1.05]"
                    )}
                  />

                  {/* OVERLAY */}
                  <div
                    className={cn(
                      "absolute inset-0 transition-colors duration-500",
                      card.dark
                        ? "bg-black/50 group-hover:bg-black/60"
                        : "bg-black/25 group-hover:bg-black/40"
                    )}
                  />

                  {/* BOTTOM GRADIENT */}
                  <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                  {/* CONTENT */}
                  <div className="relative z-10 flex h-full flex-col justify-between p-6">
                    {/* TOP ROW */}
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md",
                          card.dark ? "bg-white/15" : "bg-white/85"
                        )}
                      >
                        <Image
                          src={card.icon}
                          alt=""
                          width={20}
                          height={20}
                          className={cn(
                            "object-contain",
                            card.dark && "invert"
                          )}
                        />
                      </div>

                      <span className="text-sm font-medium text-white/80">
                        {card.id}
                      </span>
                    </div>

                    {/* BOTTOM TEXT */}
                    <div>
                      <h3 className="whitespace-pre-line text-[20px] sm:text-[21px] lg:text-[22px] font-semibold leading-snug text-white">
                        {card.title}
                      </h3>

                      <p
                        className={cn(
                          "mt-4 max-w-md text-sm leading-6 text-white/90",
                          "opacity-100 lg:opacity-0",
                          "transition-all duration-500",
                          "lg:group-hover:opacity-100"
                        )}
                      >
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
