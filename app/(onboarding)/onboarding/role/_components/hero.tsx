"use client";

import { ArrowUpRight, Users, Shield } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative mx-auto max-w-[1440px] px-4 sm:px-6 md:px-7 pt-6 sm:pt-16 md:pt-[64px] -mt-6 sm:-mt-10 md:mt-0">
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 lg:gap-x-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* LEFT CONTAINER */}
        <div
          className="
  relative mt-24 sm:mt-12 lg:mt-16 
  w-full max-w-[1240px] self-start
  
  rounded-[28px]
  bg-gradient-to-br from-white via-white/95 to-white

  px-6 sm:px-8 md:px-10 lg:px-12
  py-6 sm:py-7 md:py-8

  border border-gray-200

  shadow-[0_25px_70px_rgba(0,0,0,0.12)]

  transition-all duration-300
"
        >
          {/* Soft Depth Glow (Permanent, Not Hover Based) */}
          <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-gray-200/20 via-transparent to-gray-300/10" />
          <h1 className="relative max-w-3xl text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-semibold leading-tight tracking-tight text-zinc-900">
            Start Your Agricultural
            <br />
            <span className="bg-gradient-to-r from-[#b7cf8a] to-[#9fb86d] bg-clip-text text-transparent">
              Success Story
            </span>
          </h1>

          <p className="relative mt-4 max-w-3xl text-sm sm:text-[15px] md:text-[16.5px] leading-7 text-black">
            Fieldly connects farmers and landowners through a transparent,
            trust-first platform. Whether you cultivate crops or own farmland,
            begin your journey by choosing your primary role below.
          </p>

          {/* Stats */}
          <div className="relative mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm">
              <Users className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  5,200+
                </div>
                <div className="text-xs text-gray-600">Active Members</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm">
              <Shield className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-sm font-semibold text-gray-900">94%</div>
                <div className="text-xs text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="relative mt-8">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 text-sm text-black font-medium"
            >
              <span>Choose your role below</span>
              <ArrowUpRight className="w-4 h-4 rotate-90" />
            </motion.div>
          </div>
        </div>

        {/* RIGHT IMAGE CONTAINER */}
        <div
          className="group z-10 ml-auto w-full max-w-[448px] min-h-[280px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[555px] overflow-hidden rounded-[28px] 
          
          border border-[#b7cf8a]/40
          shadow-[0_25px_60px_rgba(0,0,0,0.1),
                  0_0_0_1px_rgba(0,0,0,0.04),
                  0_15px_45px_rgba(183,207,138,0.22)]
          hover:shadow-[0_35px_90px_rgba(0,0,0,0.12),
                        0_0_0_1px_rgba(183,207,138,0.45),
                        0_22px_60px_rgba(183,207,138,0.35)]
          transition-all duration-500 lg:-translate-y-14
        "
        >
          <div className="relative h-full w-full pt-12 sm:pt-16 md:pt-20">
            <Image
              src="/testimonials/image3.jpg"
              alt="Modern farmers and landowners collaborating"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />

            {/* Overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent 
p-4 sm:p-5 md:p-6 lg:p-6 text-white z-10 
opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <div
                className="
    bg-black/40 backdrop-blur-lg border border-white/25 rounded-2xl
    
    p-4 sm:p-5 md:p-6 lg:p-6
    
    transform translate-y-3 sm:translate-y-4 md:translate-y-6 lg:translate-y-6
    group-hover:translate-y-0
    
    transition-all duration-300
  "
              >
                {/* Live Indicator */}
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                  <div className="relative h-3 w-3 sm:h-4 sm:w-4">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />

                    <motion.div
                      className="absolute inset-1 rounded-full bg-[#b7cf8a] shadow-lg shadow-[#b7cf8a]/50"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>

                  <span className="tracking-wider font-semibold">
                    COMMUNITY HIGHLIGHT
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-semibold mb-3 sm:mb-4">
                  Join 5,200+ Successful Members
                </h3>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5 sm:p-3">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                      $2.4M+
                    </div>
                    <div className="text-xs sm:text-sm text-white/90">
                      Total Value Leased
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5 sm:p-3">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                      25K+
                    </div>
                    <div className="text-xs sm:text-sm text-white/90">
                      Acres Cultivated
                    </div>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20">
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                    &quot;Fieldly helped me find perfect land for my organic
                    farm. The process was seamless!&quot;
                  </p>

                  <div className="text-[11px] sm:text-xs text-white/70 mt-2">
                    - Rajesh Kumar, Farmer
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
