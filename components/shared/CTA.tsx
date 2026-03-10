"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// Skeleton Loader Component
function CTASkeleton() {
  return (
    <section className="relative mt-66 px-6">
      <div className="relative mx-auto max-w-[1200px] rounded-[32px] bg-[#ffffff] px-10 py-10 overflow-visible shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
        <div className="relative z-10 max-w-[520px]">
          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-12 w-[400px] bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-12 w-[350px] bg-gray-200 rounded-lg animate-pulse" />
          </div>

          {/* Description skeleton */}
          <div className="mt-3 space-y-2">
            <div className="h-4 w-[450px] bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-[420px] bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Buttons skeleton */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="h-12 w-[180px] bg-gray-200 rounded-full animate-pulse" />
            <div className="h-12 w-[120px] bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Image skeleton */}
        <div className="absolute right-8 top-0 -translate-y-1/2 pointer-events-none">
          <div className="relative w-[420px] h-[469px] rounded-[999px] bg-gray-200 animate-pulse shadow-[0_40px_60px_rgba(0,0,0,0.35)]" />
        </div>
      </div>
    </section>
  );
}

export default function CTA() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for skeleton demo
    // In production, this could be replaced with actual image loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <CTASkeleton />;
  }

  return (
    <section className="relative mt-66 px-6">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="
          relative
          mx-auto
          max-w-[1200px]
          rounded-[32px]
          bg-[#ffffff]
          px-10
          py-10
          overflow-visible
          shadow-[0_30px_80px_rgba(0,0,0,0.25)]
        "
      >
        {/* CONTENT */}
        <div className="relative z-10 max-w-[520px]">
          <h2 className="text-[40px] font-semibold leading-tight tracking-tight text-black">
            Unlock Farmland
            <br />
            Opportunities with Fieldly
          </h2>

          <p className="mt-3 text-[16px] leading-relaxed text-black/80">
            Discover cultivable farmland, connect directly with landowners, and
            simplify agricultural land leasing through Fieldly&apos;s digital
            marketplace.
          </p>

          {/* CTA BUTTONS */}
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/sign-up"
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-black
                px-6
                py-3
                text-sm
                font-medium
                text-white
                hover:bg-zinc-800
                active:scale-95
                transition-all
                duration-200
                focus:outline-none
                focus:ring-2
                focus:ring-black/50
                focus:ring-offset-2
              "
            >
              Start Using Fieldly
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <Link
              href="/company/about"
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-black/40
                px-6
                py-3
                text-sm
                font-medium
                text-black
                hover:bg-black/5
                active:scale-95
                transition-all
                duration-200
                focus:outline-none
                focus:ring-2
                focus:ring-black/50
                focus:ring-offset-2
              "
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* FLOATING PHONE IMAGE (TOP OVERFLOW) */}
        <div
          className="
            absolute
            right-8
            top-0
            -translate-y-1/2
            pointer-events-none
            hidden
            lg:block
          "
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="
              relative
              w-[420px]
              h-[469px]
              rounded-[999px]
              overflow-hidden
              shadow-[0_40px_60px_rgba(0,0,0,0.35)]
              group
            "
          >
            <Image
              src="/cta.png"
              alt="Fieldly farmland - Discover agricultural opportunities"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
              sizes="(max-width: 1024px) 0px, 420px"
              quality={90}
              onLoad={() => setIsLoading(false)}
              onError={(e) => {
                console.error('Image failed to load:', e);
                setIsLoading(false);
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}   