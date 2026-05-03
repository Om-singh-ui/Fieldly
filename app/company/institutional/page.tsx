import React from "react";
import HeroSection from "./_components/hero";
import FAQSection from "./_components/FAQSection";
import FieldlyInvestmentBentoCards from "./_components/FieldlyInvestmentBentoCards";
;

const page = () => {
  return (
    <div>
      <HeroSection />
      <FieldlyInvestmentBentoCards />
      <FAQSection />
    </div>
  );
};

export default page;
