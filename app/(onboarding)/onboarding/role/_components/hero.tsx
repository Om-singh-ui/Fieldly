"use client";

import { ArrowUpRight, Sparkles, Users, Shield } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {

  return (
    <section className="relative mx-auto max-w-[1440px] px-4 sm:px-6 md:px-7 pt-6 sm:pt-16 md:pt-[64px] -mt-6 sm:-mt-10 md:mt-0">
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 lg:gap-x-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* LEFT */}
        <div className="relative mt-24 sm:mt-12 lg:mt-16 w-full max-w-[1240px] self-start rounded-[28px] bg-gradient-to-br from-white via-white/95 to-white px-6 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-7 md:py-8 shadow-[0_22px_60px_rgba(183,207,138,0.5),0_0_0_1px_rgba(183,207,138,0.35)]">
          <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-tr from-[#b7cf8a]/15 via-transparent to-transparent" />

          {/* Badge */}
          <div className="relative inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#b7cf8a]/10 border border-[#b7cf8a]/20">
            <Sparkles className="w-4 h-4 text-[#9fb86d]" />
            <span className="text-sm font-medium text-[#7f9a4f]">Choose Your Path</span>
          </div>

          <h1 className="relative max-w-3xl text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-semibold leading-tight sm:leading-[1.15] tracking-tight text-zinc-900">
            Start Your Agricultural
            <br />
            <span className="bg-gradient-to-r from-[#b7cf8a] to-[#9fb86d] bg-clip-text text-transparent">
              Success Story
            </span>
          </h1>

          <p className="relative mt-3 sm:mt-4 max-w-3xl text-sm sm:text-[15px] md:text-[16.5px] leading-6 sm:leading-7 text-zinc-600">
            Fieldly connects farmers and landowners through a transparent, trust-first platform. 
            Whether you cultivate crops or own farmland, begin your journey by choosing your primary role below.
          </p>

          {/* Quick Stats */}
          <div className="relative mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100">
              <Users className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-sm font-semibold text-gray-900">5,200+</div>
                <div className="text-xs text-gray-600">Active Members</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
              <Shield className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-sm font-semibold text-gray-900">94%</div>
                <div className="text-xs text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

        

          <div className="relative mt-6 sm:mt-8">
          
            
            {/* Scroll Indicator */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 text-sm text-[#9fb86d] font-medium"
            >
              <span>Choose your role below</span>
              <ArrowUpRight className="w-4 h-4 rotate-90" />
            </motion.div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="group z-10 ml-auto w-full max-w-[448px] min-h-[280px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[555px] overflow-hidden rounded-[24px] sm:rounded-[28px] transition-all duration-300 lg:-translate-y-14 hover:shadow-[0_28px_90px_rgba(183,207,138,0.4),0_0_0_1px_rgba(183,207,138,0.3)]">
          <div className="relative h-full w-full pt-12 sm:pt-16 md:pt-20">
            <Image
              src="/hero.jpg"
              alt="Modern farmers and landowners collaborating"
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
                      className="absolute inset-1 rounded-full bg-[#b7cf8a] shadow-lg shadow-[#b7cf8a]/50"
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
                    COMMUNITY HIGHLIGHT
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-semibold leading-tight mb-4">
                  Join 5,200+ Successful Members
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                    <div className="text-2xl font-bold text-white">$2.4M+</div>
                    <div className="text-sm text-white/90">Total Value Leased</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                    <div className="text-2xl font-bold text-white">25K+</div>
                    <div className="text-sm text-white/90">Acres Cultivated</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-sm text-white/90">
                    &quot;Fieldly helped me find perfect land for my organic farm. The process was seamless!&quot;
                  </p>
                  <div className="text-xs text-white/70 mt-2">- Rajesh Kumar, Farmer</div>
                </div>
              </div>
            </div>

            {/* Top Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#b7cf8a] to-[#9fb86d] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Trusted Platform
            </div>
            
            {/* Bottom Badge */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Secure & Verified
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}