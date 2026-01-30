"use client";

import HeroSection from "@/components/Hero";
import WhatWeDoSection from "@/components/WhatWeDoSection";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import BlogSection from "@/components/BlogSection";
import { useState, useEffect } from "react";
import MultiModalMonitoring from "@/components/MultiModalMonitoring";
import { Plus, Minus } from "lucide-react";

// FAQ Data
const faqs = [
  {
    q: "How does Fieldly leasing work?",
    a: "Fieldly connects landowners and farmers directly through a transparent, broker-free leasing process. Lease terms, usage conditions, and soil responsibilities are clearly defined before agreements are finalized.",
  },
  {
    q: "Is Fieldly completely broker-free?",
    a: "Yes. Fieldly removes middlemen entirely. This ensures fair pricing, direct communication, and higher trust between farmers and landowners.",
  },
  {
    q: "How is soil health monitored and protected?",
    a: "We integrate soil monitoring, reporting, and verification mechanisms to ensure responsible land use. Soil data helps maintain long-term productivity and sustainability.",
  },
  {
    q: "Who can lease land on Fieldly?",
    a: "Individual farmers, farmer groups, and verified agricultural organizations can lease land, subject to identity and compliance checks.",
  },
  {
    q: "How does verification and compliance work?",
    a: "All participants go through identity verification. Lease activities and soil commitments are tracked to ensure regulatory and environmental compliance.",
  },
  {
    q: "What happens at the end of a lease term?",
    a: "At lease completion, soil condition reports are reviewed and land is returned based on agreed terms. Renewals can be initiated seamlessly on the platform.",
  },
  {
    q: "Is Fieldly suitable for small farmers and landowners?",
    a: "Absolutely. Fieldly is designed to support small and medium farmers by providing access to land, trust, and data without high entry barriers.",
  },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  // Simulate loading for the page
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <HeroSection />

      {/* Trusted By Section - Responsive */}
      <section className="mx-auto mt-16 sm:mt-20 md:mt-24 lg:mt-4 px-4 sm:px-6 md:px-8 max-w-[1400px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 md:gap-8">
          {/* Left label */}
          {loading ? (
            <div className="shrink-0 h-5 w-24 rounded-full bg-gray-200 animate-pulse" />
          ) : (
            <span className="shrink-0 text-sm md:text-base font-medium text-zinc-600">
              Trusted by:
            </span>
          )}

          {/* Pill container */}
          <div className="w-full rounded-2xl sm:rounded-full bg-white px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:shadow-[0_12px_40px_rgba(0,0,0,0.1)] lg:shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
            {/* Logos grid - responsive layout */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 items-center justify-items-center">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center w-full"
                  >
                    <div className="h-6 sm:h-7 md:h-8 w-24 sm:w-28 md:w-32 rounded-lg bg-gray-200 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 items-center justify-items-center">
                {/* Logo 1 */}
                <div className="flex items-center justify-center w-full">
                  <Image
                    src="/logos/key-carbon.svg"
                    alt="Key Carbon"
                    width={100}
                    height={28}
                    className="h-6 sm:h-7 md:h-8 w-auto object-contain"
                  />
                </div>

                {/* Logo 2 */}
                <div className="flex items-center justify-center w-full">
                  <Image
                    src="/logos/abatable.svg"
                    alt="Abatable"
                    width={120}
                    height={28}
                    className="h-6 sm:h-7 md:h-8 w-auto object-contain"
                  />
                </div>

                {/* Logo 3 */}
                <div className="flex items-center justify-center w-full">
                  <Image
                    src="/logos/multitude.svg"
                    alt="Multitude"
                    width={120}
                    height={28}
                    className="h-6 sm:h-7 md:h-8 w-auto object-contain"
                  />
                </div>

                {/* Logo 4 */}
                <div className="flex items-center justify-center w-full col-span-2 sm:col-span-3 lg:col-span-1">
                  <Image
                    src="/logos/european-investment-fund.svg"
                    alt="European Investment Fund"
                    width={160}
                    height={28}
                    className="h-6 sm:h-7 md:h-8 w-auto object-contain"
                  />
                </div>

                {/* Logo 5 */}
                <div className="flex items-center justify-center w-full col-span-2 sm:col-span-3 lg:col-span-1">
                  <Image
                    src="/logos/co2-effect.svg"
                    alt="CO2 Effect"
                    width={100}
                    height={28}
                    className="h-6 sm:h-7 md:h-8 w-auto object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* News & Image Cards Section - Responsive */}
      <section className="mx-auto mt-16 sm:mt-20 md:mt-24 lg:mt-28 px-4 sm:px-6 md:px-8 max-w-[1400px]">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {/* Left Card Skeleton */}
            <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] rounded-2xl sm:rounded-3xl lg:rounded-[32px] bg-gray-200 animate-pulse" />
            {/* Right Card Skeleton */}
            <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] rounded-2xl sm:rounded-3xl lg:rounded-[32px] bg-gray-200 animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {/* LEFT — Text Card (Independent Height) */}
            <Link
              href="https://medium.com/@cultiland/cultiland-digital-leasing-platform"
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full"
            >
              <div className="cursor-pointer rounded-2xl sm:rounded-3xl lg:rounded-[32px] border border-black/5 bg-white px-6 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 md:py-10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:shadow-[0_15px_40px_rgba(0,0,0,0.08)] lg:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] sm:group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.14)] lg:group-hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
                <span className="inline-flex items-center rounded-full bg-[#b7cf8a] px-3 py-1 sm:px-4 sm:py-1.5 text-xs font-medium uppercase tracking-wide text-zinc-700">
                  Company News
                </span>

                <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-semibold leading-tight sm:leading-[1.15] tracking-tight text-zinc-900">
                  Fieldly&apos;s Digital Leasing Platform Successfully
                  <span className="hidden sm:inline">
                    <br />
                    Enables Broker-Free Farmland Access
                  </span>
                  <span className="inline sm:hidden">
                    {" "}
                    Enables Broker-Free Farmland Access
                  </span>
                </h2>

                <p className="mt-3 sm:mt-4 md:mt-5 text-sm sm:text-base md:text-[16.5px] leading-6 sm:leading-7 text-zinc-600">
                  The rollout confirms that CultiLand&apos;s transparent
                  land-leasing system empowers farmers and landowners to connect
                  directly, unlocking idle agricultural land while ensuring
                  trust, compliance, and fair access across regions.
                </p>

                <p className="mt-4 sm:mt-5 md:mt-7 text-xs sm:text-sm text-zinc-500">
                  6 min read
                </p>
              </div>
            </Link>

            {/* RIGHT — Image Card (Own Natural Size) */}
            <Link
              href="https://medium.com/@cultiland/cultiland-verification-trust"
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full"
            >
              <div className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[32px] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] sm:group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.18)]">
                <Image
                  src="/cnews.jpg"
                  alt="CultiLand farmland"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/45 transition group-hover:bg-black/55" />

                {/* Text on image */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 text-center">
                  <p className="text-sm sm:text-base md:text-lg font-medium tracking-wide text-white/90">
                    Fieldly Digital Leasing Platform
                  </p>

                  <h3 className="mt-2 sm:mt-3 md:mt-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight text-white">
                    Verified by
                    <br />
                    Trusted Landowners & Farmers
                  </h3>
                </div>
              </div>
            </Link>
          </div>
        )}
      </section>

      {/* MultiModal Monitoring Section */}
      <section className="mt-16 sm:mt-20 md:mt-24 lg:mt-28 px-4 sm:px-6 md:px-0">
        <MultiModalMonitoring />
      </section>

      {/* What We Do Section */}
      <section className="mt-16 sm:mt-20 md:mt-24 lg:mt-28 px-4 sm:px-6 md:px-0">
        <WhatWeDoSection />
      </section>

      {/* Mission Section with Background Image */}
      <section className="relative w-full overflow-hidden py-16 mt-16 sm:mt-20 md:mt-24 lg:mt-28">
        {loading ? (
          <div className="relative z-10 mx-auto max-w-[1600px] px-6">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="relative h-[160px] w-full max-w-[440px] rounded-full bg-gray-200 animate-pulse"
                />
              ))}
            </div>
            <div className="mx-auto mt-16 max-w-4xl text-center">
              <div className="h-6 w-full rounded-full bg-gray-200 animate-pulse" />
              <div className="mt-3 h-6 w-3/4 mx-auto rounded-full bg-gray-200 animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="/fb01b073e7d70cc8bcbc.jpg"
                alt="CultiLand background"
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Main content */}
            <div className="relative z-10 mx-auto max-w-[1600px] px-6">
              {/* MAIN BRAND STRIP */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col lg:flex-row items-center justify-center gap-10"
              >
                {[
                  {
                    img: "/icon.png",
                    title: "We at Fieldly",
                    hover: "Pioneering sustainable agriculture",
                    dark: false,
                  },
                  {
                    img: "/images.jpg",
                    title: "Providing cultivable land",
                    hover: "Direct access to fertile farmland",
                    dark: true,
                  },
                  {
                    img: "/two-framers-using-technology-do-260nw-2297266531.jpg",
                    title: "For farmers worldwide",
                    hover: "Connecting growers across regions",
                    dark: true,
                  },
                  {
                    img: "/csi-ltr6-environmental-stewardship-trend.jpg",
                    title: "Sustainable Future",
                    hover: "Environmental stewardship for generations",
                    dark: true,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group relative h-[160px] w-full max-w-[440px] overflow-hidden rounded-full shadow-[0_18px_45px_rgba(0,0,0,0.28)] cursor-pointer"
                  >
                    {/* Number badge */}
                    <div className="absolute -top-3 -right-3 z-20 w-12 h-12 rounded-full bg-white border-4 border-[#b7cf8a] flex items-center justify-center shadow-lg">
                      <span className="text-lg font-bold text-black">
                        {i + 1}
                      </span>
                    </div>

                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      priority={i === 0}
                    />

                    {/* Overlay */}
                    <div
                      className={`absolute inset-0 transition-colors duration-300 ${
                        item.dark ? "bg-black/45 group-hover:bg-black/55" : ""
                      }`}
                    />

                    {/* DEFAULT TEXT (shifted DOWN) */}
                    <div className="absolute inset-0 flex items-center justify-center pt-6 transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-3">
                      {i === 0 ? (
                        <div className="rounded-full bg-white/90 px-10 py-4 backdrop-blur-md shadow-lg">
                          <span className="text-[26px] font-semibold tracking-tight text-zinc-800">
                            {item.title}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[26px] font-semibold tracking-tight text-white">
                          {item.title}
                        </span>
                      )}
                    </div>

                    {/* HOVER TEXT (same size, same alignment) */}
                    <div className="absolute inset-0 flex items-center justify-center pt-6 opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      <p className="max-w-[320px] text-center text-[26px] font-semibold leading-tight text-white">
                        {item.hover}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* SUPPORTING COPY */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="mx-auto mt-16 max-w-4xl text-center"
              >
                <p className="text-[20px] leading-8 text-white">
                  CultiLand safeguards agricultural land through transparent,
                  broker-free leasing empowering farmers, protecting soil
                  health, and ensuring long-term productivity at scale.
                </p>
              </motion.div>
            </div>
          </>
        )}
      </section>

      {/* Blog Section */}
      <section className="mt-16 sm:mt-20 md:mt-24 lg:mt-28 px-4 sm:px-6 md:px-0">
        <BlogSection />
      </section>

      {/* FAQ Section */}
      <section className="relative z-0 mt-16 sm:mt-20 md:mt-24 lg:mt-28 py-16 sm:py-20 md:py-24 overflow-hidden">
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/fb01b073e7d70cc8bcbc.jpg"
            alt="Farmers using technology"
            fill
            className="object-cover"
            priority={false}
          />

          {/* Overlay (lighter so image is visible) */}
          <div className="absolute inset-0 bg-[#b7cf8a]/65" />
        </div>

        {/* CONTENT */}
        <div className="relative z-20 mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8">
          {loading ? (
            <div className="grid gap-16 md:grid-cols-2">
              {/* Left skeleton */}
              <div>
                <div className="h-10 w-3/4 rounded-lg bg-white/40 animate-pulse mb-4" />
                <div className="h-6 w-full rounded-lg bg-white/40 animate-pulse mb-2" />
                <div className="h-6 w-2/3 rounded-lg bg-white/40 animate-pulse" />
              </div>

              {/* Right skeleton */}
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 rounded-xl bg-white/40 animate-pulse"
                  />
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="grid gap-12 md:gap-20 md:grid-cols-2"
            >
              {/* LEFT — TITLE */}
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-[#1f3b1f]">
                  Questions?
                  <br />
                  We’re here to help.
                </h2>

                <p className="mt-5 max-w-md text-[16px] leading-7 text-black/80">
                  Clear answers build trust. Here are some common questions
                  about how Fieldly works and how we protect farmers, land, and
                  soil.
                </p>
              </div>

              {/* RIGHT — FAQ LIST */}
              <div className="space-y-4">
                {faqs.map((faq, i) => {
                  const isOpen = faqOpenIndex === i;

                  return (
                    <div
                      key={faq.q}
                      className={`
                  rounded-2xl border transition-all
                  ${
                    isOpen
                      ? "border-emerald-300 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
                      : "border-black/10 bg-white hover:border-emerald-200"
                  }
                `}
                    >
                      <button
                        onClick={() => setFaqOpenIndex(isOpen ? null : i)}
                        className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left"
                      >
                        <h3 className="text-[16px] font-medium text-[#1f3b1f]">
                          {faq.q}
                        </h3>

                        <span
                          className={`
                      flex h-8 w-8 items-center justify-center rounded-full
                      border transition-all shrink-0
                      ${
                        isOpen
                          ? "border-emerald-500 text-emerald-600"
                          : "border-black/15 text-zinc-600"
                      }
                    `}
                        >
                          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                        </span>
                      </button>

                      <motion.div
                        initial={false}
                        animate={{
                          height: isOpen ? "auto" : 0,
                          opacity: isOpen ? 1 : 0,
                        }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-[15.5px] leading-7 text-zinc-600">
                          {faq.a}
                        </p>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </section>  
    </main>
  );
}
