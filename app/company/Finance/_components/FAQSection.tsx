"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const faqs = [
  {
    id: "01",
    question: "What is Fieldly Finance and how does it work?",
    answer:
      "Fieldly Finance connects investors with verified farmers and sustainable projects. Fund loans, monitor your investments, and earn returns while supporting agriculture.",
  },
  {
    id: "02",
    question: "Who can invest on Fieldly Finance?",
    answer:
      "Retail and institutional investors can participate after completing identity verification and compliance checks.",
  },
  {
    id: "03",
    question: "How are farmers and projects verified?",
    answer:
      "All projects and farmers undergo multi-layer verification including document checks, farm inspections, and financial eligibility assessments.",
  },
  {
    id: "04",
    question: "Are my investments secure?",
    answer:
      "Fieldly Finance uses secure payments, escrow, and real-time tracking. Funds are tied to project milestones to ensure transparency and safety.",
  },
  {
    id: "05",
    question: "Can I monitor the performance of my investments?",
    answer:
      "Investors can track projects, view repayments, and receive real-time updates on agricultural progress to make informed decisions.",
  },
];

const FAQSection = () => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="w-full py-12">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">FAQ</h2>
          <p className="max-w-2xl text-gray-600 text-base md:text-lg leading-relaxed">
            Find answers to common questions about investing with Fieldly Finance. Learn how our platform works and how you can start supporting sustainable agriculture.
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
                      <span className="text-lg font-medium text-gray-900 w-8">{faq.id}</span>
                      <span className="h-5 w-px bg-gray-300" />
                      <span className="text-lg md:text-xl text-gray-900">{faq.question}</span>
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
                className="group h-9 sm:h-10 rounded-full px-5 sm:px-6 text-sm md:text-base "
              >
                Start Investing
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