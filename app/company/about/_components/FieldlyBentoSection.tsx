"use client";

import { motion } from "framer-motion";
import {
  Globe,
  HandCoins,
  BookOpen,
  Activity,
  Sprout,
} from "lucide-react";
import { useState, useEffect } from "react";

const cards = [
  {
    number: "01",
    icon: Globe,
    title: "Land Marketplace",
    desc: "Fieldly enables landowners to list agricultural land while farmers discover verified farmland ready for cultivation.",
  },
  {
    number: "02",
    icon: HandCoins,
    title: "Flexible Leasing",
    desc: "Farmers can access land through transparent leasing agreements designed to support productive agricultural partnerships.",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Farmer Access",
    desc: "Farmers can explore verified listings, apply directly, and connect with landowners through a simple digital workflow.",
  },
  {
    number: "04",
    icon: Activity,
    title: "Monitoring & Verification",
    desc: "All listings on Fieldly go through verification processes to ensure reliable land data and transparent agreements.",
  },
  {
    number: "05",
    icon: Sprout,
    title: "Productive Land Use",
    desc: "By connecting farmers and landowners, Fieldly unlocks unused farmland and increases agricultural productivity.",
  },
];

export default function FieldlyBentoCards() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Skeleton card component
  const SkeletonCard = () => (
    <div className="relative bg-[#fff] rounded-[36px] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.08)] animate-pulse">
      {/* ICON + NUMBER SKELETON */}
      <div className="flex items-start justify-between mb-8">
        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
        <div className="w-8 h-6 bg-gray-200 rounded"></div>
      </div>

      {/* TITLE SKELETON */}
      <div className="space-y-3 mb-4">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-8 bg-gray-200 rounded w-2/3"></div>
      </div>

      {/* DESCRIPTION SKELETON */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <section className="w-full py-24">
        <div className="mx-auto max-w-[1240px] px-6">
          {/* ROW 1 SKELETON */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          {/* ROW 2 SKELETON */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[4, 5].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-24">
      <div className="mx-auto max-w-[1240px] px-6">

        {/* ================= ROW 1 ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {cards.slice(0, 3).map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="relative bg-[#fff] rounded-[36px] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)] transition-all duration-300"
              >
                {/* ICON + NUMBER */}
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 rounded-full bg-[#b7cf8a] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-lg text-gray-400 font-medium">
                    {card.number}
                  </span>
                </div>

                {/* TITLE */}
                <h3 className="text-[34px] leading-[1.15] font-semibold text-[#222] mb-4">
                  {card.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-[16px] text-gray-900 leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* ================= ROW 2 ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.slice(3, 5).map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="relative bg-[#fff] rounded-[36px] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)] transition-all duration-300"
              >
                {/* ICON + NUMBER */}
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 rounded-full bg-[#b7cf8a] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-lg text-gray-400 font-medium">
                    {card.number}
                  </span>
                </div>

                {/* TITLE */}
                <h3 className="text-[34px] leading-[1.15] font-semibold text-[#222] mb-4">
                  {card.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-[16px] text-gray-900 leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}