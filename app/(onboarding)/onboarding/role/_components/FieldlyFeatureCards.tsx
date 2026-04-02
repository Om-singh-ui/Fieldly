"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const containerVariant = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariant = {
  show: { opacity: 1, y: 0 },
};



export default function FieldlyFeatureCards() {
  return (
    <section className="mt-12 px-4 sm:px-6">
      <motion.div
        variants={containerVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="space-y-4"
      >
        {/* ---------- Card 1 ---------- */}
        <motion.div
          variants={cardVariant}
          whileHover={{ y: -6 }}
          className="group max-w-3xl mx-auto relative"
        >
          <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all duration-300 group-hover:shadow-xl">
            {/* Glow Hover */}
            <div className="absolute -inset-[1px] rounded-xl  opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex items-start gap-4">
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.08, rotate: 2 }}
                transition={{ type: "spring", stiffness: 260 }}
                className="flex-shrink-0"
              >
                <div className="w-18 h-18 rounded-lg border border-emerald-100  p-2.5 shadow-sm">
                  <Image
                    src="/icons/google-map-icon.webp"
                    alt="Role switching"
                    className="w-full h-full object-contain"
                    width={72}
                    height={72}
                  />
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900 mb-1">
                  Flexible Role Switching
                </h4>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Start with one role and switch anytime. Your data remains
                  securely preserved while transitioning between farmer and
                  landowner profiles.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---------- Card 2 ---------- */}
        <motion.div
          variants={cardVariant}
          whileHover={{ y: -6 }}
          className="group max-w-3xl mx-auto relative"
        >
          <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all duration-300 group-hover:shadow-xl">
            {/* Glow Hover */}
            <div className="absolute -inset-[1px] rounded-xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex items-start gap-4">
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.08, rotate: -2 }}
                transition={{ type: "spring", stiffness: 260 }}
                className="flex-shrink-0"
              >
                <div className="w-18 h-18 rounded-lg border border-emerald-100  p-2.5 shadow-sm">
                  <Image
                    src="/icon.png"
                    alt="Verification"
                    className="w-full h-full object-contain"
                    width={72}
                    height={72}
                  />
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900 mb-1">
                  Verified Profiles & Land Listings
                </h4>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Fieldly verifies users, land ownership, and legal documents to
                  ensure safe and transparent agreements between farmers and
                  landowners.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        {/* ---------- Card 3 ---------- */}
        <motion.div
          variants={cardVariant}
          whileHover={{ y: -6 }}
          className="group max-w-3xl mx-auto relative"
        >
          <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all duration-300 group-hover:shadow-xl">
            <div className="absolute -inset-[1px] rounded-xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex items-start gap-4">
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.08, rotate: 2 }}
                transition={{ type: "spring", stiffness: 260 }}
                className="flex-shrink-0"
              >
                <div className="w-18 h-18 rounded-lg border border-emerald-100 p-2.5 shadow-sm">
                  <Image
                    src="/icons/sponsor-npci.png"
                    alt="Secure Payments"
                    className="w-full h-full object-contain"
                    width={72}
                    height={72}
                  />
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900 mb-1">
                  Secure Payments & Digital Agreements
                </h4>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Manage lease payments, contracts, and financial transactions
                  through Fieldly’s secure digital system designed to protect
                  both farmers and landowners.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
