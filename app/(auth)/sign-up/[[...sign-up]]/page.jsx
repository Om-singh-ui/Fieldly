"use client";

import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignUpPage() {
  // Clean animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 1.05, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.2
      }
    }
  };

  const points = [
    "Transparent land leasing with verified ownership",
    "Asset-backed agricultural investment returns",
    "No brokers trust-first, direct platform",
    "Designed for landowners and modern farmers"
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* GRID */}
      <div className="mx-auto grid min-h-screen max-w-[1550px] grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
        {/* LEFT — BRAND / VALUE */}
        <motion.div 
          className="relative flex mt-26 flex-col justify-center px-6 sm:px-10 lg:px-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/"
              className="absolute left-14 top-6 inline-flex items-center gap-1 text-sm text-black hover:text-zinc-600 transition-colors"
            >
              ← Back
            </Link>
          </motion.div>

          <motion.div 
            className="max-w-xl"
            variants={containerVariants}
          >
            <motion.div 
              className="mb-10 flex items-center gap-3"
              variants={itemVariants}
            >
              <div className="relative h-10 w-10 overflow-hidden rounded-xl">
                <Image
                  src="/hicon.png"
                  alt="Fieldly logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-semibold tracking-tight text-zinc-900">
                Fieldly
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1 
              className="text-3xl sm:text-4xl lg:text-[42px] font-semibold leading-tight tracking-tight text-zinc-900"
              variants={itemVariants}
            >
              Grow your wealth.
              <br />
              <span className="text-black">
                Invest in sustainable agriculture
              </span>
            </motion.h1>

            {/* Supporting points */}
            <motion.ul 
              className="mt-8 space-y-4 text-[15px] leading-relaxed text-zinc-600"
              variants={containerVariants}
            >
              {points.map((text, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start gap-3"
                  variants={itemVariants}
                >
                  <span className="mt-[3px] flex h-5 w-5 items-center justify-center rounded-full bg-[#b7cf8a]/20 text-[#7f9a4f]">
                    ✓
                  </span>
                  {text}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>

        {/* RIGHT — IMAGE + AUTH */}
        <motion.div 
          className="relative flex items-center justify-center pl-76"
          initial="hidden"
          animate="visible"
        >
          {/* IMAGE */}
          <motion.div 
            className="absolute inset-0"
            variants={imageVariants}
          >
            <Image
              src="/auth.jpg"
              alt="Cultivated farmland"
              fill
              priority
              className="object-cover"
            />
          </motion.div>

          {/* SignUp Card - Smaller container */}
          <motion.div 
            className="relative mt-14 z-10 max-w-[400px] w-full mx-4" // Smaller width + margin
            variants={cardVariants}
          >
            <div className="px-2"> {/* Reduced padding */}
              <SignUp
                appearance={{
                  elements: {
                    card: "shadow-lg border border-gray-200 w-full", // Full width of container
                    rootBox: "w-full",
                    headerTitle: "text-xl", // Slightly smaller title
                    headerSubtitle: "text-sm", // Smaller subtitle
                    formButtonPrimary: "text-sm", // Smaller button text
                    footerActionText: "text-sm", // Smaller footer text
                  },
                }}
                redirectUrl="/post-auth" 
                afterSignUpUrl="/post-auth" 
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}