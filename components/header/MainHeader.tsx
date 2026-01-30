"use client";

import {
  ChevronDown,
  Globe,
  ArrowUpRight,
  Menu,
  X,
  BookOpen,
  BarChart,
  HelpCircle,
  Leaf,
  Users,
  Building,
  Shield,
  Map,
  DollarSign,
  Satellite,
  TrendingUp,
  Target,
  LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useHeaderVisibility } from "./HeaderVisibility";

/* ================= TYPES & DATA ================= */

interface NavItem {
  label: string;
  desc?: string;
  icon: LucideIcon;
  href: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

type NavKey = "farmers" | "institutional" | "resources" | "more";

const NAV_DATA: Record<NavKey, NavSection> = {
  farmers: {
    label: "Farmers",
    items: [
      {
        label: "Land Leasing",
        desc: "Broker-free farmland access",
        icon: Map,
        href: "/farmers/land-leasing",
      },
      {
        label: "Soil Monitoring",
        desc: "Physical + satellite insights",
        icon: Leaf,
        href: "/farmers/soil-monitoring",
      },
      {
        label: "MRV Technology",
        desc: "AI-powered measurement",
        icon: Satellite,
        href: "/farmers/mrv-technology",
      },
      {
        label: "Financial Support",
        desc: "Loans & subsidies",
        icon: DollarSign,
        href: "/farmers/financial-support",
      },
    ],
  },
  institutional: {
    label: "Institutional Investors",
    items: [
      {
        label: "Investment Opportunities",
        desc: "Farmland portfolio options",
        icon: TrendingUp,
        href: "/institutional/investments",
      },
      {
        label: "Portfolio Management",
        desc: "Asset performance tracking",
        icon: BarChart,
        href: "/institutional/portfolio",
      },
      {
        label: "Risk Assessment",
        desc: "ESG compliance & reporting",
        icon: Shield,
        href: "/institutional/risk-assessment",
      },
      {
        label: "Impact Reporting",
        desc: "Transparent metrics dashboard",
        icon: Target,
        href: "/institutional/impact-reporting",
      },
    ],
  },
  resources: {
    label: "Resources",
    items: [
      {
        label: "News",
        icon: BookOpen,
        href: "/resources/news",
      },
      {
        label: "MRV Technology",
        icon: Satellite,
        href: "/resources/mrv-technology",
      },
      {
        label: "FAQ",
        icon: HelpCircle,
        href: "/resources/faq",
      },
      {
        label: "Insights From InSoil",
        icon: Leaf,
        href: "/resources/insights",
      },
    ],
  },
  more: {
    label: "More",
    items: [
      {
        label: "About Us",
        icon: Building,
        href: "/company/about",
      },
      {
        label: "Careers",
        icon: Users,
        href: "/company/careers",
      },
      {
        label: "Contact",
        icon: ArrowUpRight,
        href: "/company/contact",
      },
      {
        label: "Compliance",
        icon: Shield,
        href: "/company/compliance",
      },
    ],
  },
};

export default function MainHeader() {
  const { mainVisible } = useHeaderVisibility();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<NavKey | null>(null);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState<NavKey | null>(null);
  const [desktopLanguageOpen, setDesktopLanguageOpen] = useState(false);
  
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const desktopLanguageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [mobileOpen]);

  // Close mobile dropdowns when menu closes
  useEffect(() => {
    if (!mobileOpen) {
      Promise.resolve().then(() => {
        setMobileActiveDropdown(null);
        setLanguageOpen(false);
      });
    }
  }, [mobileOpen]);

  // Close desktop dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target as Node)) {
        setActiveDesktopDropdown(null);
      }
      if (desktopLanguageRef.current && !desktopLanguageRef.current.contains(event.target as Node)) {
        setDesktopLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileDropdown = (key: NavKey) => {
    setMobileActiveDropdown(mobileActiveDropdown === key ? null : key);
    if (languageOpen) setLanguageOpen(false);
  };

  const toggleLanguageDropdown = () => {
    setLanguageOpen(!languageOpen);
    if (mobileActiveDropdown) setMobileActiveDropdown(null);
  };

  const handleDesktopDropdownEnter = (key: NavKey) => {
    setActiveDesktopDropdown(key);
  };

  const handleDesktopDropdownLeave = () => {
    setTimeout(() => {
      if (!document.querySelector(".desktop-dropdown-content:hover") && 
          !document.querySelector(".desktop-dropdown-trigger:hover")) {
        setActiveDesktopDropdown(null);
      }
    }, 100);
  };

  const toggleDesktopLanguage = () => {
    setDesktopLanguageOpen(!desktopLanguageOpen);
  };

  return (
    <>
      <motion.header
        animate={mainVisible && !mobileOpen ? "visible" : "hidden"}
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -64, opacity: 0 },
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 inset-x-0 z-40"
      >
        {/* ================= EDGE-TO-EDGE HEADER STRAP ================= */}
        <div
          className="pointer-events-auto flex items-center justify-between h-14 md:h-16 border-b border-black/10 bg-white/95 px-4 md:px-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)] backdrop-blur-md"
        >
          {/* LEFT — Brand */}
          <div className="flex items-center gap-2">
            {loading ? (
              <>
                <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-4 w-16 rounded-full bg-gray-200 animate-pulse" />
              </>
            ) : (
              <>
                <Image src="/CultiLand.png" alt="InSoil" width={28} height={28} className="h-7 w-7 md:h-8 md:w-8" />
                <span className="text-sm md:text-base font-semibold tracking-tight text-zinc-900">Fieldly</span>
              </>
            )}
          </div>

          {/* CENTER — Nav (Desktop with dropdowns) */}
          <nav ref={desktopDropdownRef} className="hidden md:flex items-center gap-8 relative">
            {loading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="h-4 w-20 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-4 w-4 rounded-full bg-gray-200 animate-pulse" />
                  </div>
                ))}
              </>
            ) : (
              <>
                {(Object.keys(NAV_DATA) as NavKey[]).map((key) => (
                  <div
                    key={key}
                    className="relative"
                    onMouseEnter={() => handleDesktopDropdownEnter(key)}
                    onMouseLeave={handleDesktopDropdownLeave}
                  >
                    <button className="desktop-dropdown-trigger flex items-center gap-1 text-sm font-medium text-black hover:text-black transition-colors">
                      {NAV_DATA[key].label}
                      <ChevronDown className={`h-4 w-4 opacity-60 transition-transform ${activeDesktopDropdown === key ? "rotate-180" : ""}`} />
                    </button>

                    {/* Desktop Dropdown Menu */}
                    {activeDesktopDropdown === key && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onMouseEnter={() => setActiveDesktopDropdown(key)}
                        onMouseLeave={handleDesktopDropdownLeave}
                        className="desktop-dropdown-content absolute left-1/2 top-full mt-7 -translate-x-1/2 w-64 rounded-xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100 z-50"
                      >
                        <div className="p-2">
                          {NAV_DATA[key].items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <a
                                key={item.label}
                                href={item.href}
                                onClick={() => setActiveDesktopDropdown(null)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                <Icon className="h-4 w-4" />
                                <div>
                                  <div className="font-medium">{item.label}</div>
                                  {item.desc && (
                                    <div className="text-xs text-zinc-500 mt-0.5">{item.desc}</div>
                                  )}
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </>
            )}
          </nav>

          {/* RIGHT — Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {loading ? (
                <>
                  <div className="h-9 w-9 rounded-lg bg-gray-200 animate-pulse" />
                  <div className="h-4 w-4 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-4 w-28 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-9 w-20 rounded-lg bg-gray-200 animate-pulse" />
                </>
              ) : (
                <>
                  {/* Desktop Language Dropdown */}
                  <div ref={desktopLanguageRef} className="relative">
                    <button onClick={toggleDesktopLanguage} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-black/5">
                      <Globe className="h-5 w-5" />
                    </button>
                    
                    {desktopLanguageOpen && (
                      <div className="absolute right-0 left-0.5 top-full mt-5 w-48 rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden z-50">
                        <button onClick={() => setDesktopLanguageOpen(false)} className="w-full px-4 py-3 text-left text-sm text-zinc-700 hover:bg-gray-50 hover:text-black">
                          English (EN)
                        </button>
                        <button onClick={() => setDesktopLanguageOpen(false)} className="w-full px-4 py-3 text-left text-sm text-zinc-700 hover:bg-gray-50 hover:text-black border-t border-gray-100">
                          Español (ES)
                        </button>
                      </div>
                    )}
                  </div>

                  <ChevronDown className="h-4 w-4 opacity-60" />

                  <span className="text-sm font-medium text-black">Retail Investors</span>

                  <a
                    href="/login"
                    className="ml-1 flex h-9 items-center gap-2 rounded-lg bg-[#b7cf8a] px-4 text-sm font-medium text-black transition hover:bg-[#a8c47a]"
                  >
                    Sign IN
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </>
              )}
            </div>

            {/* Mobile */}
            <div className="flex md:hidden items-center gap-1">
              {loading ? (
                <>
                  <div className="h-9 w-16 rounded-lg bg-gray-200 animate-pulse" />
                  <div className="h-9 w-9 rounded-lg bg-gray-200 animate-pulse" />
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="flex h-9 items-center gap-1 rounded-lg bg-[#b7cf8a] px-3 text-xs font-medium text-black"
                  >
                    Sign IN
                    <ArrowUpRight className="h-3 w-3" />
                  </a>

                  <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-black/10"
                  >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />

          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-24 left-4 right-4 z-40 rounded-2xl bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.18)] md:hidden max-h-[80vh] overflow-y-auto"
          >
            {loading ? (
              <div>
                <div className="space-y-5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="h-5 w-40 rounded-full bg-gray-200 animate-pulse" />
                      <div className="h-4 w-4 rounded-full bg-gray-200 animate-pulse" />
                    </div>
                  ))}
                </div>
                <div className="mt-8 w-full h-12 rounded-xl bg-gray-200 animate-pulse" />
              </div>
            ) : (
              <>
                {/* Navigation Dropdowns */}
                <div className="space-y-2">
                  {(Object.keys(NAV_DATA) as NavKey[]).map((key) => (
                    <div key={key} className="border-b border-gray-100 pb-2 last:border-b-0">
                      <button
                        onClick={() => toggleMobileDropdown(key)}
                        className="flex w-full items-center justify-between py-4 px-2 text-base font-medium text-black hover:text-black transition-colors"
                      >
                        {NAV_DATA[key].label}
                        <ChevronDown className={`h-5 w-5 opacity-60 transition-transform duration-200 ${mobileActiveDropdown === key ? "rotate-180" : ""}`} />
                      </button>

                      {/* Mobile Dropdown Content - TRANSPARENT BG */}
                      {mobileActiveDropdown === key && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-4 pl-2 pr-2 bg-transparent">
                            {NAV_DATA[key].items.map((item) => {
                              const Icon = item.icon;
                              return (
                                <a
                                  key={item.label}
                                  href={item.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-zinc-600 hover:bg-gray-50 hover:text-black mb-1 last:mb-0 transition-colors"
                                >
                                  <Icon className="h-4 w-4 flex-shrink-0" />
                                  <div className="flex-1">
                                    <div className="font-medium">{item.label}</div>
                                    {item.desc && (
                                      <div className="text-xs text-zinc-500 mt-0.5">{item.desc}</div>
                                    )}
                                  </div>
                                </a>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Language Dropdown - TRANSPARENT BG */}
                <div className="mt-6 mb-4 bg-transparent">
                  <button
                    onClick={toggleLanguageDropdown}
                    className="flex w-full items-center justify-between py-3 px-4 rounded-lg bg-gray-50 text-sm font-medium text-zinc-700 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Language
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${languageOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  {languageOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 overflow-hidden bg-transparent"
                    >
                      <div className="rounded-lg bg-gray-50">
                        <button
                          onClick={() => setLanguageOpen(false)}
                          className="w-full px-4 py-3 text-left text-sm text-zinc-700 hover:bg-gray-100 transition-colors"
                        >
                          English (EN)
                        </button>
                        <button
                          onClick={() => setLanguageOpen(false)}
                          className="w-full px-4 py-3 text-left text-sm text-zinc-700 hover:bg-gray-100 border-t border-gray-200 transition-colors"
                        >
                          Español (ES)
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Retail Investors Text */}
                <div className="mt-4 mb-6 px-2 bg-transparent">
                  <span className="text-sm font-medium text-zinc-600">Retail Investors</span>
                </div>

                {/* Login Button */}
                <a
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center rounded-xl bg-[#b7cf8a] py-3 text-sm font-medium text-black transition hover:bg-[#a8c47a]"
                >
                  Sign IN
                </a>
              </>
            )}
          </motion.div>
        </>
      )}
    </>
  );
}