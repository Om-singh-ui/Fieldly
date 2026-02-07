  "use client";

  import { ArrowUpRight } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import Image from "next/image";
  import { useRouter } from "next/navigation";
  import { motion } from "framer-motion";

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
          <div className="group z-10 ml-auto w-full max-w-[448px] min-h-[280px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[555px] overflow-hidden rounded-[24px] sm:rounded-[28px] transition-all duration-300 lg:-translate-y-14 hover:shadow-[0_28px_90px_rgba(255,205,70,0.6),0_0_0_1px_rgba(255,205,70,0.4)]">
            <div className="relative h-full w-full pt-12 sm:pt-16 md:pt-20">
              <Image
                src="/hero.jpg"
                alt="Cultivated farmland"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              {/* TEXT OVERLAY - APPEARS ON HOVER */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 text-white z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-black/40 backdrop-blur-lg border border-white/25 rounded-2xl p-6 transform translate-y-6 group-hover:translate-y-0 transition-all duration-300">
                  {/* LIVE INDICATOR WITH FRAMER MOTION BLINKING DOT */}
                  <div className="flex items-center gap-2 text-sm font-medium mb-3">
                    <div className="relative h-4 w-4">
                      {/* Pulsing outer ring - GREEN */}
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

                      {/* Blinking inner dot - BRIGHTER GREEN */}
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
                    4,000+ farmers trust&apos;s us here at Fieldly
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
