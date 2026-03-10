"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const faqs = [
  {
    id: "01",
    question: "What is Fieldly?",
    answer:
      "Fieldly is a digital marketplace that connects landowners with farmers. Landowners can list cultivable land, and farmers can discover verified farmland available for agricultural leasing.",
  },
  {
    id: "02",
    question: "Who can use the Fieldly platform?",
    answer:
      "Fieldly is designed for landowners who want to lease agricultural land and farmers who are looking for cultivable farmland. Both parties can connect through a transparent digital workflow.",
  },
  {
    id: "03",
    question: "How does farmland listing work?",
    answer:
      "Landowners can list their farmland by providing location details, land size, and cultivation information. Farmers can browse listings, review details, and apply directly through the platform.",
  },
  {
    id: "04",
    question: "How does Fieldly ensure trustworthy listings?",
    answer:
      "Fieldly implements a verification process for land listings that includes documentation checks and basic validation to help ensure that the farmland information shared on the platform is reliable.",
  },
  {
    id: "05",
    question: "What problem is Fieldly solving?",
    answer:
      "Across many regions, productive farmland remains unused while farmers struggle to access land. Fieldly bridges this gap by enabling transparent farmland discovery and simplifying agricultural leasing.",
  },
];

const FAQSection = () => {
  const [active, setActive] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <section className="w-full py-12">
        <div className="max-w-[1100px] mx-auto px-4 md:px-8">
          {/* Header Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-10 md:h-12 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="space-y-2 max-w-2xl">
              <div className="h-4 md:h-5 bg-gray-200 rounded w-full"></div>
              <div className="h-4 md:h-5 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 md:h-5 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>

          {/* FAQ Cards Skeleton */}
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

            {/* CTA Button Skeleton */}
            <div className="flex justify-center mt-8">
              <div className="h-9 sm:h-10 w-36 sm:w-40 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
            FAQ
          </h2>
          <p className="max-w-2xl text-gray-600 text-base md:text-lg leading-relaxed">
            Find answers to common questions about investing with Fieldly
            Finance. Learn how our platform works and how you can start
            supporting sustainable agriculture.
          </p>
        </div>

        {/* FAQ Cards */}
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

                  {/* Answer */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="mt-2 ml-[64px] text-gray-400 text-base md:text-lg leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mt-4">
            <Link href="/investor/get-started">
              <Button
                variant="outline"
                className="group h-9 sm:h-10 rounded-full px-5 sm:px-6 text-sm md:text-base"
              >
                Start Exploring
                <span className="ml-2 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-[#b7cf8a]">
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
