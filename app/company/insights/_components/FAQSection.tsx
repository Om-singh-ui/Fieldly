"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    id: "01",
    question: "What are Fieldly Insights?",
    answer:
      "Fieldly Insights is a knowledge hub that brings together research, data, and real-world trends from the agricultural land ecosystem. It helps users understand how land markets, leasing, and farming practices are evolving.",
  },
  {
    id: "02",
    question: "Who are these insights for?",
    answer:
      "Insights are designed for farmers, landowners, agri-entrepreneurs, and anyone interested in understanding agricultural land markets, trends, and data-driven decision making.",
  },
  {
    id: "03",
    question: "What kind of content is included?",
    answer:
      "Fieldly Insights includes market reports, leasing trends, case studies, policy updates, and analysis based on real usage patterns within the Fieldly ecosystem.",
  },
  {
    id: "04",
    question: "How is the data generated?",
    answer:
      "Insights are derived from platform activity, verified land listings, user interactions, and aggregated ecosystem data, combined with research and industry observations.",
  },
  {
    id: "05",
    question: "Why are these insights important?",
    answer:
      "They help farmers and landowners make informed decisions by understanding market demand, land utilization trends, and emerging opportunities in agriculture.",
  },
];

export default function FAQSection() {
  const [active, setActive] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRedirect = () => {
    if (redirecting) return;
    setRedirecting(true);
    window.location.href = "/insights/dashboard";
  };

  if (isLoading) {
    return (
      <section className="w-full py-12">
        <div className="max-w-[1100px] mx-auto px-4 md:px-8">
          <div className="mb-8 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="space-y-2 max-w-2xl">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>

          <div className="rounded-[28px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] px-6 py-6 sm:px-8 sm:py-8 animate-pulse">
            <div className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <div key={index} className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-6 w-8 bg-gray-200 rounded"></div>
                      <div className="h-5 w-px bg-gray-200" />
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <div className="h-10 w-40 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
            Insights FAQ
          </h2>
          <p className="max-w-2xl text-gray-600 text-base md:text-lg leading-relaxed">
            Understand how Fieldly Insights works, what data it provides, and how it helps you stay informed about agricultural land markets.
          </p>
        </div>

        <div className="rounded-[28px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] px-6 py-6 sm:px-8 sm:py-8">
          <div className="divide-y divide-gray-200">
            {faqs.map((faq, index) => {
              const isOpen = active === index;

              return (
                <div key={faq.id} className="py-3">
                  <button
                    onClick={() => setActive(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-medium text-gray-900 w-8">
                        {faq.id}
                      </span>
                      <span className="h-5 w-px bg-gray-300" />
                      <span className="text-lg md:text-xl text-gray-900">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-900 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-2 ml-[64px] text-gray-500 text-base md:text-lg leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* CTA BUTTON */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleRedirect}
              disabled={redirecting}
              variant="outline"
              className="group h-10 rounded-full px-6 text-sm md:text-base"
            >
              Explore Insights
              <span className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#b7cf8a]">
                {redirecting ? (
                  <span className="size-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowUpRight className="h-4 w-4" />
                )}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}