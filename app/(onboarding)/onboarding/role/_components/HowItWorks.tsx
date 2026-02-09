"use client";

import { motion } from "framer-motion";

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

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-[1200px] px-6">

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-14">
          How It Works
        </h2>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-10 justify-items-center">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="
                group
                relative
                w-full
                max-w-[560px]
                min-h-[220px]

                rounded-[30px]
                bg-white
                px-10 py-12

                border border-[#e8eddc]

                shadow-[0_10px_30px_rgba(0,0,0,0.04)]
                hover:shadow-[0_20px_60px_rgba(183,207,138,0.25)]

                transition-all duration-500
              "
            >
              {/* Glow Border Effect */}
              <div className="absolute inset-0 rounded-[30px] p-[1px] bg-gradient-to-tr from-[#b7cf8a]/50 via-transparent to-[#dbe6c2]/50 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
                <div className="w-full h-full rounded-[30px] bg-white" />
              </div>

              {/* Accent Background Glow */}
              <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-gradient-to-tr from-[#b7cf8a]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

              {/* Step Number */}
              <span className="absolute top-6 right-6 text-lg text-gray-400 font-medium">
                {step.id}
              </span>

              {/* Content */}
              <h3 className="text-3xl font-semibold text-black mb-4 relative">
                {step.title}
              </h3>

              <p className="text-gray-600 leading-relaxed max-w-sm relative">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
