"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, Linkedin, Twitter, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative  overflow-hidden">
      {/* ================= BACKGROUND IMAGE ================= */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/footeri.jpg"
          alt="Fieldly farmland background"
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />

        {/* Overlay for readability */}
        <div className="absolute inset-0 backdrop-blur-none" />

        {/* Soft top fade (nice transition from page) */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative mx-auto max-w-[1400px] px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-5">
          {/* BRAND */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <Image
                src="/Fieldly.png"
                alt="Fieldlylogo"
                width={32}
                height={32}
              />
              <span className="text-2xl font-semibold tracking-tight text-black">
                Fieldly
              </span>
            </div>

            <p className="mt-5 max-w-md text-[16px] leading-7 text-black/85">
              Fieldly enables transparent, broker-free agricultural land leasing
              empowering farmers, protecting soil health, and unlocking idle
              land responsibly.
            </p>

            {/* Contact */}
            <div className="mt-6 space-y-3 text-[15px] text-black">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-black" />
                <span>support@fieldly.io</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-black" />
                <span>+91 9XXXX XXXXX</span>
              </div>
            </div>

            {/* Social */}
            <div className="mt-7 flex items-center gap-4">
              <SocialIcon href="#" icon={<Linkedin size={18} />} />
              <SocialIcon href="#" icon={<Twitter size={18} />} />
              <SocialIcon href="#" icon={<Github size={18} />} />
            </div>
          </div>

          {/* COLUMNS */}
          <FooterColumn
            title="Platform"
            links={[
              "Land Leasing",
              "Soil Monitoring",
              "Verification System",
              "Pricing",
            ]}
          />

          <FooterColumn
            title="Company"
            links={["About Fieldly", "Blog", "Careers", "Contact"]}
          />

          <FooterColumn
            title="Legal"
            links={["Privacy Policy", "Terms of Service", "Compliance"]}
          />
        </div>
      </div>
    </footer>
  );
}

/* ================= FOOTER COLUMN ================= */

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-[16px] font-semibold text-black">{title}</h4>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link}>
            <Link
              href="#"
              className="text-[15px] text-black transition hover:text-zinc-900"
            >
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ================= SOCIAL ICON ================= */

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 backdrop-blur-md text-black transition hover:bg-white/80"
    >
      {icon}
    </Link>
  );
}
