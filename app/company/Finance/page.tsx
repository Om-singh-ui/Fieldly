"use client";
import { motion } from "framer-motion";
import React from "react";
import HeroSection from "./_components/hero";
import WhatWeDoSection from "./_components/WhatWeDoSection";

const page = () => {
  return (
    <motion.div>
      <section>
        <HeroSection />
      </section>
      <section className="mt-16 sm:mt-20 md:mt-24 lg:mt-28 px-4 sm:px-6 md:px-0">
        <WhatWeDoSection />
      </section>
    </motion.div>
  );
};

export default page;
