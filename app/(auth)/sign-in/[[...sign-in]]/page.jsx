"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignInPage() {
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
      {/* GRID - Added mt-16 for mobile, removed on desktop */}
      <div className="mx-auto min-h-screen pt-16 lg:pt-0 lg:grid lg:max-w-[1550px] lg:grid-cols-[0.85fr_1.15fr]">
        {/* LEFT — BRAND / VALUE */}
        <motion.div
          className="relative flex flex-col justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-16 lg:mt-26 lg:py-0"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Desktop Back Button (Hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block absolute left-12 top-6"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-black hover:text-zinc-600 transition-colors"
            >
              ← Back
            </Link>
          </motion.div>

          <motion.div
            className="w-full max-w-xl mx-auto lg:mx-0"
            variants={containerVariants}
          >
            <motion.div
              className="mb-6 lg:mb-10 flex items-center gap-3"
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
              className="text-2xl sm:text-3xl lg:text-[42px] font-semibold leading-tight tracking-tight text-zinc-900"
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
              className="mt-4 lg:mt-8 space-y-3 lg:space-y-4 text-sm sm:text-[15px] leading-relaxed text-zinc-600"
              variants={containerVariants}
            >
              {points.map((text, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3"
                  variants={itemVariants}
                >
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#b7cf8a]/20 text-[#7f9a4f]">
                    ✓
                  </span>
                  <span className="flex-1">{text}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>

        {/* RIGHT — IMAGE + AUTH */}
        <motion.div
          className="relative flex items-center justify-center px-4 py-4 sm:px-6 sm:py-8 lg:px-0 lg:py-0 lg:pl-76"
          initial="hidden"
          animate="visible"
        >
          {/* IMAGE - Only show on desktop, background color on mobile */}
          <motion.div
            className="absolute inset-0 lg:block hidden"
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

          {/* Mobile Background Color */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white lg:hidden" />

          {/* SignIn Card - Responsive sizing with adjusted margins */}
          <motion.div
            className="relative z-10 w-full max-w-md mx-auto lg:mx-0 lg:mt-14"
            variants={cardVariants}
          >
            <div className="lg:rounded-2xl lg:p-2">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full mx-auto",
                    card: "w-full bg-white lg:bg-transparent lg:shadow-lg lg:border lg:border-gray-100 rounded-xl lg:rounded-2xl",
                    headerTitle: "text-xl sm:text-2xl",
                    headerSubtitle: "text-sm sm:text-base",
                    formFieldInput: "text-sm sm:text-base",
                    formButtonPrimary: "text-sm sm:text-base",
                    footerActionText: "text-sm sm:text-base",
                    socialButtonsBlock__button: "text-sm sm:text-base",
                  },
                }}
              />
            </div>

            {/* Mobile-only sign-up suggestion */}
            <div className="mt-4 text-center lg:hidden">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="text-[#7f9a4f] font-medium hover:text-[#6b8840] transition-colors">
                  Sign up here
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}