import React from "react";
import HeroSection from "./_components/hero";
import WhatWeDoSection from "./_components/WhatWeDoSection";
import FieldlyBentoSection from "./_components/FieldlyBentoSection";
import ProblemSolutionSection from "./_components/ProblemSolutionSection";
import FAQSection from "./_components/FAQSection";

const page = () => {
  return (
    <div>
      <HeroSection />
      <ProblemSolutionSection />
      <WhatWeDoSection />
      <FieldlyBentoSection />
      <FAQSection />
    </div>
  );
};

export default page;
