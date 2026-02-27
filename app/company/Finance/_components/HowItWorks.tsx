"use client";

import { motion, Variants } from "framer-motion";

const steps = [
  {
    id: "01",
    title: "Sign Up as an Investor",
    description:
      "Create your Fieldly Finance account using secure authentication. Your identity is verified to maintain a trusted investment ecosystem.",
  },
  {
    id: "02",
    title: "Choose Your Investment Role",
    description:
      "Select whether you want to fund farmers directly, support landowners, or explore sustainable agricultural opportunities curated by Fieldly.",
  },
  {
    id: "03",
    title: "Complete Investor Onboarding",
    description:
      "Submit your verification documents and financial preferences through our guided onboarding process, ensuring compliance and transparency.",
  },
  {
    id: "04",
    title: "Start Investing with Confidence",
    description:
      "Browse verified agricultural projects, fund farmers, monitor your investments, and earn stable returns while supporting sustainable agriculture.",
  },
];

const containerVariant: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const cardClasses = `
  relative rounded-[28px] border border-[#edf2e4] bg-white
  px-10 py-12 shadow-[0_8px_25px_rgba(0,0,0,0.04)]
  transition-all duration-500 will-change-transform
`;

export default function HowItWorksSection() {
  return (
    <section className="relative py-28 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight"
        >
          How Fieldly Finance Works
        </motion.h2>

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
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
              aria-label={`Step ${step.id}: ${step.title}`}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-6 top-1/2 w-12 h-[1px]" />
              )}

              {/* Card */}
              <div className={cardClasses}>
                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

                {/* Step Badge */}
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.05 }}
                  className="absolute top-6 right-6 flex items-center justify-center h-11 w-11 rounded-full bg-[#b7cf8a] text-black font-medium"
                >
                  {step.id}
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 leading-tight">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed max-w-md">{step.description}</p>

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