"use client";

import { motion } from "framer-motion";
import {
  Globe,
  HandCoins,
  BookOpen,
  Activity,
  Sprout,
} from "lucide-react";
import { useState, useEffect, memo, useMemo } from "react";

interface Card {
  number: string;
  icon: React.ElementType;
  title: string;
  desc: string;
}

const cards: readonly Card[] = [
  {
    number: "01",
    icon: Globe,
    title: "Market Intelligence",
    desc: "Stay ahead with real-time insights into agricultural land markets, pricing trends, and regional demand patterns across the Fieldly ecosystem.",
  },
  {
    number: "02",
    icon: HandCoins,
    title: "Leasing Trends",
    desc: "Understand how farmland leasing is evolving with data on agreements, usage patterns, and emerging opportunities for farmers and landowners.",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Research & Reports",
    desc: "Access in-depth reports, case studies, and expert-backed analysis on agricultural productivity, land utilization, and policy shifts.",
  },
  {
    number: "04",
    icon: Activity,
    title: "Data & Analytics",
    desc: "Explore structured insights powered by Fieldly data from land usage behavior to performance metrics across different regions.",
  },
  {
    number: "05",
    icon: Sprout,
    title: "Agri Innovation",
    desc: "Discover new ideas, technologies, and practices shaping the future of agriculture and improving how land is used and managed.",
  },
];

const SkeletonCard = () => (
  <div className="relative bg-[#fff] rounded-[36px] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.08)] animate-pulse">
    <div className="flex items-start justify-between mb-8">
      <div className="w-12 h-12 rounded-full bg-gray-200" />
      <div className="w-8 h-6 bg-gray-200 rounded" />
    </div>
    <div className="space-y-3 mb-4">
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      <div className="h-8 bg-gray-200 rounded w-2/3" />
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-4 bg-gray-200 rounded w-4/6" />
    </div>
  </div>
);

const BentoCard = memo(({ card, index }: { card: Card; index: number }) => {
  const Icon = card.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -6 }}
      className="relative bg-[#fff] rounded-[36px] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)] transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="w-12 h-12 rounded-full bg-[#b7cf8a] flex items-center justify-center">
          <Icon className="w-5 h-5 text-black" aria-hidden="true" />
        </div>
        <span className="text-lg text-gray-400 font-medium">
          {card.number}
        </span>
      </div>

      <h3 className="text-[34px] leading-[1.15] font-semibold text-[#222] mb-4">
        {card.title}
      </h3>

      <p className="text-[16px] text-gray-900 leading-relaxed">
        {card.desc}
      </p>
    </motion.div>
  );
});

BentoCard.displayName = "BentoCard";

export default function FieldlyBentoCards() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const firstRowCards = useMemo(() => cards.slice(0, 3), []);
  const secondRowCards = useMemo(() => cards.slice(3, 5), []);

  if (isLoading) {
    return (
      <section className="w-full py-24" aria-label="Loading insights">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
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
    <section className="w-full py-24" aria-label="Fieldly insights">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {firstRowCards.map((card, index) => (
            <BentoCard key={card.title} card={card} index={index} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {secondRowCards.map((card, index) => (
            <BentoCard key={card.title} card={card} index={index + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}