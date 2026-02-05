"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative mx-auto max-w-[1440px] px-4 sm:px-6 md:px-7 pt-6 sm:pt-16 md:pt-[64px] -mt-6 sm:-mt-10 md:mt-0">
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 lg:gap-x-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* LEFT */}
        <div className="relative mt-24 sm:mt-12 lg:mt-16 w-full max-w-[1240px] self-start rounded-[28px] bg-gradient-to-br from-white via-white/95 to-white px-6 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-7 md:py-8 shadow-[0_22px_60px_rgba(183,207,138,0.5),0_0_0_1px_rgba(183,207,138,0.35)]">
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
              onClick={() => router.push("/sign-in")}
              className="group h-10 sm:h-11 rounded-full bg-gradient-to-r from-[#b7cf8a] to-[#9fb86d] px-5 sm:px-6 text-sm font-medium text-black shadow-[0_6px_18px_rgba(183,207,138,0.35)] hover:from-[#a8c47a] hover:to-[#93ae63]"
            >
              For Landowners
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
              For Farmers
              <span className="ml-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#b7cf8a]">
                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </span>
            </Button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="z-10 ml-auto w-full max-w-[448px] min-h-[280px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[555px] overflow-hidden rounded-[24px] sm:rounded-[28px] transition-all duration-300 lg:-translate-y-14 hover:shadow-[0_28px_90px_rgba(255,205,70,0.6),0_0_0_1px_rgba(255,205,70,0.4)]">
          <div className="group relative h-full w-full pt-12 sm:pt-16 md:pt-20">
            <Image
              src="/hero.jpg"
              alt="Cultivated farmland"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
