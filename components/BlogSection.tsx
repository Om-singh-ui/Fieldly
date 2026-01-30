"use client";

import Image from "next/image";
import Link from "next/link";

export default function BlogSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8">
        {/* HEADER */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h2 className="text-[36px] font-semibold tracking-tight text-black">
              Fieldly Blog
            </h2>
            <p className="mt-2 text-[15px] text-zinc-600">
              Insights on sustainable farming, land leasing, and soil-first agriculture
            </p>
          </div>

          <Link
            href="/blog"
            className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium text-black hover:bg-zinc-100 transition"
          >
            Read All Blogs
          </Link>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
          {/* LEFT FEATURED CARD */}
          <article className="group relative overflow-hidden rounded-[24px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)] cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-[#b7cf8a]/0 via-[#b7cf8a]/0 to-[#b7cf8a]/0 group-hover:via-[#b7cf8a]/5 group-hover:to-[#b7cf8a]/10 transition-all duration-500 z-10" />

            <div className="relative h-[220px] w-full overflow-hidden">
              <Image
                src="/bwheat.jpg"
                alt="Sustainable farmland"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>

            <div className="p-6 relative z-20">
              <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 group-hover:bg-[#b7cf8a]/20 transition-colors">
                Fieldly INSIGHTS
              </span>

              <h3 className="mt-3 text-[22px] font-semibold leading-snug text-black">
                Fieldly Enables Broker-Free Access to Cultivable Land Across Regions
              </h3>

              <p className="mt-2 text-[15px] leading-6 text-zinc-600">
                Our digital land-leasing platform connects landowners directly with farmers unlocking idle land, improving soil health, and enabling transparent cultivation without intermediaries.
              </p>

              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm text-zinc-500">4 min read</p>
                <span className="text-sm font-medium text-[#b7cf8a] opacity-0 group-hover:opacity-100 transition-opacity">
                  Read article →
                </span>
              </div>
            </div>
          </article>

          {/* RIGHT STACKED CARDS */}
          <div className="flex flex-col gap-5">
            {[
              {
                img: "/revitalizing.png",
                tag: "SOIL & SUSTAINABILITY",
                title: "Why Soil Health Is Central to CultiLand's Leasing Model",
                time: "3 min read",
              },
              {
                img: "/farmer.jpg",
                tag: "FARMER EMPOWERMENT",
                title: "How CultiLand Helps Farmers Scale Without Owning Land",
                time: "5 min read",
              },
              {
                img: "/bh.jpg",
                tag: "PRODUCT & PLATFORM",
                title:
                  "Inside CultiLand's Transparent Land Leasing Infrastructure",
                time: "5 min read",
              },
            ].map((card, i) => (
              <article
                key={i}
                className="group relative flex overflow-hidden rounded-[20px] bg-white shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-400 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(0,0,0,0.1)] cursor-pointer"
              >
                {/* Accent overlay */}
                <div className="absolute inset-0 bg-[#b7cf8a]/0 group-hover:bg-[#b7cf8a]/5 transition-colors duration-300" />

                <div className="relative h-[140px] w-[140px] shrink-0 overflow-hidden">
                  <Image
                    src={card.img}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="relative p-5 flex flex-col justify-center">
                  <span className="inline-flex w-fit rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 group-hover:bg-[#b7cf8a]/20 transition-colors">
                    {card.tag}
                  </span>

                  <h4 className="mt-2 text-[16px] font-semibold leading-snug text-black">
                    {card.title}
                  </h4>

                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-sm text-zinc-500">{card.time}</p>
                    <span className="text-sm font-medium text-[#b7cf8a] opacity-0 group-hover:opacity-100 transition-opacity">
                      Read →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
