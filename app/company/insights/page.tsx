"use client";

import React from "react";
import HeroSection from "./_components/hero";
import FieldlyBentoCards from "./_components/FieldlyBentoSection";
import FAQSection from "./_components/FAQSection";
import WhatWeDoSection from "./_components/WhatWeDoSection";

const InsightsPage = () => {
  return (
    <main className="relative w-full bg-[#f9fafb] overflow-hidden">
      
      {/* BACKGROUND ACCENT (SUBTLE PREMIUM TOUCH) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f3f7ea] via-transparent to-transparent opacity-60" />

      {/* HERO */}
      <section className="relative z-10">
        <HeroSection />
      </section>

      {/* INSIGHTS CARDS */}
      <section className="relative z-10 mt-6 md:mt-10">
        <FieldlyBentoCards />
      </section>
      
      {/* WhatWeDoSection */}
      <section className="relative z-10 mt-6 md:mt-10 pb-16">
        <WhatWeDoSection />
      </section>

      {/* FAQ */}
      <section className="relative z-10 mt-6 md:mt-10 pb-16">
        <FAQSection />
      </section>

    </main>
  );
};

export default InsightsPage;