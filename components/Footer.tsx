"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, Linkedin, Twitter, Github } from "lucide-react";
import { motion, Variants } from "framer-motion";

/* ================= ANIMATION VARIANTS ================= */

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function Footer() {
  const platformRoutes = [
    { name: "Land Leasing", path: "/platform/land-leasing" },
    { name: "Soil Monitoring", path: "/platform/soil-monitoring" },
    { name: "Verification System", path: "/platform/verification" },
    { name: "Pricing", path: "/pricing" },
  ];

  const companyRoutes = [
    { name: "About Fieldly", path: "/about" },
    { name: "DOCS", path: "/docs" },
    { name: "Careers", path: "/careers" },
    { name: "Contact", path: "/contact" },
  ];

  const legalRoutes = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Compliance", path: "/compliance" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/footeri.jpg"
          alt="Fieldly farmland background"
          fill
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative mx-auto max-w-[1400px] px-6 py-16 sm:py-20"
      >
        <div className="grid grid-cols-1 gap-14 md:grid-cols-5">

          {/* ================= BRAND ================= */}
          <motion.div variants={fadeUp} className="md:col-span-2">

            <Link href="/" className="flex items-center gap-2">
              <Image src="/hicon.png" alt="Fieldlylogo" width={32} height={32} />
              <span className="text-2xl font-semibold tracking-tight text-black">
                Fieldly
              </span>
            </Link>

            <p className="mt-5 max-w-md text-[16px] leading-7 text-black/85">
              Fieldly enables transparent, broker-free agricultural land leasing
              empowering farmers, protecting soil health, and unlocking idle
              land responsibly.
            </p>

            {/* Contact */}
            <div className="mt-6 space-y-3 text-[15px] text-black">
              <FooterContact icon={<Mail size={16} />} text="support@fieldly.io" />
              <FooterContact icon={<Phone size={16} />} text="+91 9XXXX XXXXX" />
            </div>

            {/* Social */}
            <div className="mt-7 flex items-center gap-4">
              <SocialIcon href="https://linkedin.com/company/fieldly" icon={<Linkedin size={18} />} />
              <SocialIcon href="https://twitter.com/fieldly" icon={<Twitter size={18} />} />
              <SocialIcon href="https://github.com/fieldly" icon={<Github size={18} />} />
            </div>

          </motion.div>

          {/* ================= COLUMNS ================= */}
          <FooterColumn title="Platform" links={platformRoutes} />
          <FooterColumn title="Company" links={companyRoutes} />
          <FooterColumn title="Legal" links={legalRoutes} />

        </div>
      </motion.div>
    </footer>
  );
}

/* ================= FOOTER COLUMN ================= */

interface FooterLink {
  name: string;
  path: string;
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <motion.div variants={fadeUp}>
      <h4 className="text-[16px] font-semibold text-black">{title}</h4>

      <ul className="mt-5 space-y-3">
        {links.map((link, index) => (
          <motion.li
            key={link.path}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={link.path}
              className="text-[15px] text-black transition hover:text-zinc-900 hover:underline"
            >
              {link.name}
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ================= CONTACT ROW ================= */

function FooterContact({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <motion.div
      whileHover={{ x: 3 }}
      className="flex items-center gap-3"
    >
      {icon}
      <span>{text}</span>
    </motion.div>
  );
}

/* ================= SOCIAL ICON ================= */

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }}>
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 backdrop-blur-md text-black transition hover:bg-white/80"
      >
        {icon}
      </Link>
    </motion.div>
  );
}
