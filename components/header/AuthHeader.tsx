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
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useHeaderVisibility } from "./HeaderVisibility";

/* ================= TYPES ================= */

interface NavItem {
  label: string;
  desc?: string; // Make desc optional
  icon: LucideIcon;
  href: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

type NavKey = "farmers" | "institutional" | "resources" | "more";

/* ================= DATA ================= */

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

export default function AuthHeader() {
  const { scrollY } = useScroll();
  const { setAuthHidden, mainVisible } = useHeaderVisibility();
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<NavKey | null>(null);
  const [languageOpen, setLanguageOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // Mobile dropdown state
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<NavKey | null>(null);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
      if (
        languageOpen &&
        !(event.target as Element).closest(".language-container")
      ) {
        setLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown, languageOpen]);

  // Scroll hide/show logic
  useMotionValueEvent(scrollY, "change", (latest) => {
    const scrollDirection = latest > lastScrollY.current ? "down" : "up";
    lastScrollY.current = latest;

    const shouldHide = scrollDirection === "down" && latest > 400;
    const shouldShow = scrollDirection === "up" && latest < 100;

    if (shouldHide) {
      setHidden(true);
      setAuthHidden(true);
    } else if (shouldShow || !mainVisible) {
      setHidden(false);
      setAuthHidden(false);
    }
  });

  // Desktop hover handlers
  const handleMouseEnter = (key: NavKey) => {
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (
        !document.querySelector(".dropdown-content:hover") &&
        !document.querySelector(".dropdown-trigger:hover")
      ) {
        setActiveDropdown(null);
      }
    }, 100);
  };

  const toggleDesktopDropdown = (key: NavKey) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  // Mobile dropdown handlers
  const toggleMobileDropdown = (key: NavKey) => {
    setMobileActiveDropdown(mobileActiveDropdown === key ? null : key);
  };

  const handleLanguageToggle = () => {
    setLanguageOpen(!languageOpen);
  };

  // Close all dropdowns when mobile menu closes
  useEffect(() => {
    if (!mobileOpen) {
      setTimeout(() => setMobileActiveDropdown(null), 0);
    }
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={false}
        animate={hidden && !mobileOpen ? "hidden" : "visible"}
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -80, opacity: 0 },
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-4 inset-x-0 z-50"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
          {/* ========== MOBILE ========== */}
          <div className="flex md:hidden items-center justify-between rounded-full bg-white/90 px-4 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-md">
            {loading ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-5 w-20 rounded-full bg-gray-200 animate-pulse" />
                </div>
                <div className="flex items-center gap-1 rounded-full bg-black/5 p-1">
                  <div className="h-9 w-16 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Image
                    src="/CultiLand.png"
                    alt="Fieldly"
                    width={28}
                    height={28}
                  />
                  <span className="text-base font-semibold">Fieldly</span>
                </div>

                <div className="flex items-center gap-1 rounded-full bg-black/5 p-1">
                  <Link
                    href="/login"
                    className="flex h-9 items-center gap-1 rounded-full bg-[#b7cf8a] px-3 text-xs font-medium"
                  >
                    Sign In <ArrowUpRight className="h-3 w-3" />
                  </Link>
                  <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/10"
                  >
                    {mobileOpen ? <X /> : <Menu />}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ========== DESKTOP ========== */}
          <div className="hidden md:flex items-center justify-between gap-8">
            {/* ========== CONTAINER 1: LOGO ========== */}
            {loading ? (
              <div className="flex h-16 items-center rounded-full bg-gray-100 px-8 shadow-xl backdrop-blur-md animate-pulse">
                <div className="h-8 w-8 rounded-full bg-gray-300" />
                <div className="ml-3 h-6 w-24 rounded-full bg-gray-300" />
              </div>
            ) : (
              <div className="flex h-16 items-center rounded-full bg-white/90 px-8 shadow-xl backdrop-blur-md">
                <Image
                  src="/CultiLand.png"
                  alt="CultiLand"
                  width={32}
                  height={32}
                />
                <span className="ml-1 text-xl font-semibold">Fieldly</span>
              </div>
            )}

            {/* ========== CONTAINER 2: NAVIGATION ========== */}
            {loading ? (
              <div className="flex h-16 items-center gap-12 rounded-full bg-gray-100 px-8 shadow-xl backdrop-blur-md animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-4 w-20 rounded-full bg-gray-300" />
                    <div className="h-4 w-4 rounded-full bg-gray-300" />
                  </div>
                ))}
              </div>
            ) : (
              <nav
                className="relative flex h-16 items-center gap-12 rounded-full bg-white/90 px-8 shadow-xl backdrop-blur-md"
                ref={dropdownRef}
              >
                {(Object.keys(NAV_DATA) as NavKey[]).map((key) => (
                  <div
                    key={key}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(key)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => toggleDesktopDropdown(key)}
                      className="dropdown-trigger flex items-center gap-2 text-base font-medium text-black hover:text-black"
                    >
                      {NAV_DATA[key].label}
                      <ChevronDown
                        className={`h-5 w-5 opacity-70 transition-transform ${activeDropdown === key ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Desktop Dropdown Menu */}
                    {activeDropdown === key && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="dropdown-content absolute left-1/2 top-full mt-6 -translate-x-1/2 w-64 rounded-xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100 z-50"
                        onMouseEnter={() => setActiveDropdown(key)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="p-2">
                          {NAV_DATA[key].items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setActiveDropdown(null)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                <Icon className="h-4 w-4" />
                                <div>
                                  <div className="font-medium">
                                    {item.label}
                                  </div>
                                  {item.desc && (
                                    <div className="text-xs text-zinc-500 mt-0.5">
                                      {item.desc}
                                    </div>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </nav>
            )}

            {/* ========== CONTAINER 3: CTA ========== */}
            {loading ? (
              <div className="flex h-16 items-center gap-6 rounded-full bg-gray-100 px-12 shadow-xl backdrop-blur-md animate-pulse">
                <div className="h-5 w-5 rounded-full bg-gray-300" />
                <div className="h-4 w-4 rounded-full bg-gray-300" />
                <div className="h-4 w-32 rounded-full bg-gray-300" />
                <div className="h-10 w-32 rounded-full bg-gray-300" />
              </div>
            ) : (
              <div className="flex h-16 items-center gap-4 rounded-full bg-white/90 px-12 shadow-xl backdrop-blur-md">
                {/* Language Dropdown */}
                <div className="language-container relative">
                  <button
                    onClick={handleLanguageToggle}
                    className="flex items-center gap-2 text-base font-medium text-black hover:text-black"
                  >   
                    <Globe className="h-5 w-5" />
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {languageOpen && (
                    <div className="absolute left-0 top-full mt-6 w-48 rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden z-50">
                      <button
                        onClick={() => setLanguageOpen(false)}
                        className="w-full px-4 py-3 text-left text-sm text-zinc-700 hover:bg-gray-50 hover:text-black"
                      >
                        English (EN)
                      </button>
                      <button
                        onClick={() => setLanguageOpen(false)}
                        className="w-full px-4 py-3 text-left text-sm text-zinc-700 hover:bg-gray-50 hover:text-black border-t border-gray-100"
                      >
                        Español (ES)
                      </button>
                    </div>
                  )}
                </div>

                {/* Retail Investors Text */}
                <span className="text-base font-medium text-black min-w-[140px]">
                  Retail Investors
                </span>

                {/* Login Button */}
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-full bg-[#b7cf8a] px-6 py-2.5 text-sm font-medium min-w-[120px] justify-center"
                >
                  Sign IN<ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />

          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-24 left-4 right-4 z-50 rounded-2xl bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.18)] md:hidden max-h-[80vh] overflow-y-auto"
          >
            {loading ? (
              <div className="space-y-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-5 w-32 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-4 w-4 rounded-full bg-gray-200 animate-pulse" />
                  </div>
                ))}
                <div className="mt-8 w-full h-12 rounded-xl bg-gray-200 animate-pulse" />
              </div>
            ) : (
              <>
                {/* Mobile Navigation with Dropdowns */}
                <div className="space-y-2">
                  {(Object.keys(NAV_DATA) as NavKey[]).map((key) => (
                    <div
                      key={key}
                      className="border-b border-gray-100 pb-2 last:border-b-0"
                    >
                      <button
                        onClick={() => toggleMobileDropdown(key)}
                        className="flex w-full items-center justify-between py-4 px-2 text-base font-medium text-black hover:text-black"
                      >
                        {NAV_DATA[key].label}
                        <ChevronDown
                          className={`h-5 w-5 opacity-70 transition-transform ${mobileActiveDropdown === key ? "rotate-180" : ""}`}
                        />
                      </button>

                      {/* Mobile Dropdown Content */}
                      {mobileActiveDropdown === key && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-4 pl-2 pr-2">
                            {NAV_DATA[key].items.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.label}
                                  href={item.href}
                                  onClick={() => {
                                    setMobileOpen(false);
                                    setMobileActiveDropdown(null);
                                  }}
                                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-zinc-600 hover:bg-gray-50 hover:text-black mb-1 last:mb-0"
                                >
                                  <Icon className="h-4 w-4 flex-shrink-0" />
                                  <div className="flex-1">
                                    <div className="font-medium">{item.label}</div>
                                    {item.desc && (
                                      <div className="text-xs text-zinc-500 mt-0.5">
                                        {item.desc}
                                      </div>
                                    )}
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile Language Selector */}
                <div className="mt-6 mb-4">
                  <button
                    onClick={handleLanguageToggle}
                    className="flex w-full items-center justify-between py-3 px-4 rounded-lg bg-gray-50 text-sm font-medium text-zinc-700"
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Language
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${languageOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  
                  {languageOpen && (
                    <div className="mt-2 rounded-lg bg-gray-50 overflow-hidden">
                      <button
                        onClick={() => {
                          setLanguageOpen(false);
                          // Handle language change
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-zinc-700 hover:bg-gray-100"
                      >
                        English (EN)
                      </button>
                      <button
                        onClick={() => {
                          setLanguageOpen(false);
                          // Handle language change
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-zinc-700 hover:bg-gray-100 border-t border-gray-200"
                      >
                        Español (ES)
                      </button>
                    </div>
                  )}
                </div>

                {/* Retail Investors Text (Mobile) */}
                <div className="mt-4 mb-6 px-2">
                  <span className="text-sm font-medium text-zinc-600">
                    Retail Investors
                  </span>
                </div>

                {/* Mobile Login Button */}
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="
                    flex w-full items-center justify-center gap-2
                    rounded-xl
                    bg-[#b7cf8a]
                    py-3
                    text-sm font-medium text-black
                  "
                >
                  Sign In
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </motion.div>
        </>
      )}
    </>
  );
}