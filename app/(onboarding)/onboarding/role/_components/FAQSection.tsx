"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
const faqs = [
  {
    id: "01",
    question: "What is Fieldly and how does the platform work?",
    answer:
      "Fieldly is a digital land leasing and agricultural finance platform that connects verified landowners with farmers seeking cultivable land. The platform enables transparent agreements, secure payments, and verified land listings while ensuring soil health and sustainable farming practices.",
  },
  {
    id: "02",
    question: "Who can use Fieldly?",
    answer:
      "Fieldly is designed for landowners looking to lease unused agricultural land, farmers seeking cultivation opportunities, and agricultural investors supporting farming projects. Every user must complete identity and verification checks before accessing marketplace features.",
  },
  {
    id: "03",
    question: "How does Fieldly verify land and user authenticity?",
    answer:
      "Fieldly follows a multi-layer verification system including document validation, land ownership checks, optional field inspections, and soil data validation. This helps maintain trust and ensures all marketplace listings meet platform safety and compliance standards.",
  },
  {
    id: "04",
    question: "Are payments and transactions secure on Fieldly?",
    answer:
      "Yes. Fieldly uses secure payment integrations and transaction tracking to ensure rent payments, investment flows, and agreement settlements are recorded and protected. Payment milestones are tied to lease agreements to maintain financial transparency for all parties.",
  },
];

const FAQSection = () => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="w-full bg-[#ffffff] py-20">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-semibold text-gray-900 mb-4">FAQ</h2>
          <p className="max-w-2xl text-gray-600 leading-relaxed">
            We created an easy and intuitive climate mitigation platform
            suitable for both farmers and investors. We also have many answers
            to the questions that might arise while familiarising yourself with
            our products.
          </p>
        </div>

        {/* FAQ Card */}
        <div className="rounded-[28px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] px-10 py-10">
          <div className="divide-y divide-gray-200">
            {faqs.map((faq, index) => {
              const isOpen = active === index;

              return (
                <div key={faq.id} className="py-6">
                  <button
                    onClick={() => setActive(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-6">
                      {/* Number */}
                      <span className="text-xl font-medium text-gray-900 w-10">
                        {faq.id}
                      </span>

                      {/* Divider */}
                      <span className="h-6 w-px bg-gray-300" />

                      {/* Question */}
                      <span className="text-lg text-gray-900">
                        {faq.question}
                      </span>
                    </div>

                    {/* Chevron */}
                    <ChevronDown
                      className={`h-5 w-5 text-gray-700 transition-transform duration-300 ${
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
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 ml-[76px] max-w-3xl text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-6">
            <Link href="/company/about">
              <Button
                variant="outline"
                className="group h-10 mb-4 sm:h-11 rounded-full border-zinc-200 px-5 sm:px-6 text-sm hover:bg-zinc-50"
              >
                For Farmers
                <span className="ml-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#b7cf8a]">
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
