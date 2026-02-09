"use client";

import { motion, Variants } from "framer-motion";

const steps = [
  {
    id: "01",
    title: "Create Your Fieldly Account",
    description:
      "Sign up using your email or secure authentication. Fieldly ensures identity validation to maintain a trusted agricultural ecosystem.",
  },
  {
    id: "02",
    title: "Select Your Role",
    description:
      "Choose whether you are a Farmer, Landowner, or Agricultural Investor. Fieldly customizes your platform experience based on your role.",
  },
  {
    id: "03",
    title: "Complete Smart Onboarding",
    description:
      "Submit verification documents, land details, or farming preferences through our guided onboarding engine designed for compliance and transparency.",
  },
  {
    id: "04",
    title: "Access the Fieldly Platform",
    description:
      "Start exploring verified land listings, partnerships, financing opportunities, and sustainable agricultural workflows tailored to your profile.",
  },
];

const containerVariant: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // ✅ TS SAFE easing
    },
  },
};

export default function HowItWorksSection() {
  return (
    <section className="relative py-28 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight">
            How It Works
          </h2>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="relative grid md:grid-cols-2 gap-12"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={cardVariant}
              whileHover={{
                y: -10,
                scale: 1.01,
              }}
              className="group relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-6 top-1/2 w-12 h-[1px] bg-gradient-to-r from-[#c9d8a8] to-transparent" />
              )}

              {/* Card */}
              <div
                className="
                  relative
                  rounded-[28px]
                  border border-[#edf2e4]
                  bg-white
                  px-10 py-12
                  shadow-[0_8px_25px_rgba(0,0,0,0.04)]
                  transition-all duration-500
                  group-hover:shadow-[0_20px_60px_rgba(183,207,138,0.25)]
                "
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none bg-gradient-to-tr from-[#b7cf8a]/10 via-transparent to-transparent" />

                {/* Step Badge */}
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.05 }}
                  className="
                    absolute top-6 right-6
                    flex items-center justify-center
                    h-11 w-11
                    rounded-full
                    bg-[#b7cf8a]
                    text-black
                  "
                >
                  {step.id}
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 leading-tight">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed max-w-md">
                  {step.description}
                </p>

                {/* Bottom Accent Animation */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4 }}
                  className="h-[2px] mt-8 bg-gradient-to-r from-[#b7cf8a] to-transparent rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
