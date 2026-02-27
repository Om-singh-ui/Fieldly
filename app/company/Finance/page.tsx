"use client";
import { motion } from "framer-motion";
import React from "react";
import HeroSection from "./_components/hero";
import WhatWeDoSection from "./_components/WhatWeDoSection";
import HowitWorks from "./_components/HowItWorks";
import FAQSection from "./_components/FAQSection";

const Page = () => {
  return (
    <motion.div>
      {/* Hero Section */}
      <section>
        <HeroSection />
      </section>

      {/* How It Works Section */}
      <section className="mt-16 sm:mt-20 md:mt-24 lg:mt-28 px-4 sm:px-6 md:px-0">
        <HowitWorks />
      </section>

      {/* What We Do Section */}
      <section className="mt-20 sm:mt-24 md:mt-28 lg:mt-32 px-4 sm:px-6 md:px-0">
        <WhatWeDoSection />
      </section>
      <section className="mt-20 sm:mt-24 md:mt-28 lg:mt-32 px-4 sm:px-6 md:px-0">
        <FAQSection />
      </section>
    </motion.div>
  );
};

export default Page;