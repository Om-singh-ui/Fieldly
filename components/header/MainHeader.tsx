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
  DollarSign,
  Satellite,
  TrendingUp,
  Target,
  LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useHeaderVisibility } from "./HeaderVisibility";
import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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
  feature?: {
    title: string;
    desc: string;
    button: string;
    href: string;
  };
}

type NavKey = "farmers" | "institutional" | "resources" | "more";

const NAV_DATA: Record<NavKey, NavSection> = {
  farmers: {
    label: "Farmers",
    items: [
      {
        label: "Agri Loans",
        desc: "Flexible financial support for farmers",
        icon: DollarSign,
        href: "/farmers/agri-loans",
      },
      {
        label: "Green Loans",
        desc: "Sustainable agriculture financing",
        icon: Leaf,
        href: "/farmers/green-loans",
      },
      {
        label: "Carbon Farming",
        desc: "Earn through regenerative farming",
        icon: Satellite,
        href: "/farmers/carbon",
      },
    ],
    feature: {
      title: "Farmers",
      desc: "Financial solutions that support farmers on their journey towards regenerative agriculture.",
      button: "Get A Loan",
      href: "/farmers",
    },
  },
  institutional: {
    label: "Institutional Investors",
    items: [
      {
        label: "Investment Opportunities",
        desc: "Farmland portfolio access",
        icon: TrendingUp,
        href: "/institutional/investments",
      },
      {
        label: "Portfolio Management",
        desc: "Track farmland assets",
        icon: BarChart,
        href: "/institutional/portfolio",
      },
      {
        label: "Impact Reporting",
        desc: "Transparent ESG metrics",
        icon: Target,
        href: "/institutional/impact",
      },
    ],
    feature: {
      title: "Institutional Investors",
      desc: "Access farmland investment opportunities and climate-positive portfolios.",
      button: "Explore Investments",
      href: "/institutional",
    },
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
        href: "/resources/mrv",
      },
      {
        label: "FAQ",
        icon: HelpCircle,
        href: "/resources/faq",
      },
    ],
    feature: {
      title: "Resources",
      desc: "Insights, research and knowledge from the Fieldly ecosystem.",
      button: "Insights From Fieldly",
      href: "/resources/insights",
    },
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
        label: "Fieldly Finance",
        icon: DollarSign,
        href: "/company/Finance",
      },
    ],
    feature: {
      title: "Company",
      desc: "Learn more about our mission and team.",
      button: "About Fieldly",
      href: "/company/about",
    },
  },
};

// ================= AUTH CTA COMPONENT =================
function AuthCTA() {
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();
  const { userId, isLoaded } = useAuth();

  const handleDashboardRedirect = async () => {
    if (!isLoaded) return;

    if (!userId) {
      router.push("/sign-in");
      return;
    }

    setIsChecking(true);

    try {
      const response = await fetch(`/api/user/status?userId=${userId}`, {
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();

        if (!data.user.role) {
          router.push("/onboarding/role");
        } else if (!data.user.isOnboarded) {
          const onboardingPath =
            data.user.role === "FARMER"
              ? "/onboarding/farmer"
              : "/onboarding/landowner";

          router.push(onboardingPath);
        } else {
          const dashboardPath =
            data.user.role === "FARMER"
              ? "/farmer/dashboard"
              : "/landowner/dashboard";

          router.push(dashboardPath);
        }
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error navigating to dashboard:", error);
      router.push("/dashboard");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDashboardRedirect}
        disabled={isChecking}
        aria-busy={isChecking}
        className="flex items-center justify-center gap-2 rounded-lg bg-[#b7cf8a] px-4 py-2 text-sm font-medium hover:bg-[#a8c07a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isChecking ? (
          <span className="inline-block size-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            Dashboard
            <ArrowUpRight className="h-4 w-4" />
          </>
        )}
      </button>

      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-8 w-8",
            userButtonAvatarBox: "h-8 w-8",
          },
        }}
      />
    </div>
  );
}

// ================= MOBILE AUTH SECTION =================
function MobileAuthSection({ onClose }: { onClose: () => void }) {
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();
  const { userId, isLoaded } = useAuth();

  const handleDashboardRedirect = async () => {
    if (!isLoaded) return;

    if (!userId) {
      router.push("/sign-in");
      onClose();
      return;
    }

    setIsChecking(true);

    try {
      const response = await fetch(`/api/user/status?userId=${userId}`, {
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();

        if (!data.user.role) {
          router.push("/onboarding/role");
        } else if (!data.user.isOnboarded) {
          const onboardingPath =
            data.user.role === "FARMER"
              ? "/onboarding/farmer"
              : "/onboarding/landowner";

          router.push(onboardingPath);
        } else {
          const dashboardPath =
            data.user.role === "FARMER"
              ? "/farmer/dashboard"
              : "/landowner/dashboard";

          router.push(dashboardPath);
        }
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error navigating to dashboard:", error);
      router.push("/dashboard");
    } finally {
      setIsChecking(false);
      onClose();
    }
  };

  return (
    <div className="mt-6">
      <SignedOut>
        <Link
          href="/sign-in"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#b7cf8a] py-3 text-sm font-medium text-black hover:bg-[#a8c07a] transition-colors"
        >
          Sign In
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center gap-4">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
                userButtonAvatarBox: "h-10 w-10",
              },
            }}
          />
          <button
            onClick={handleDashboardRedirect}
            disabled={isChecking}
            aria-busy={isChecking}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#b7cf8a] py-3 text-sm font-medium text-black hover:bg-[#a8c07a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChecking ? (
              <span className="inline-block size-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Go to Dashboard
                <ArrowUpRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </SignedIn>
    </div>
  );
}

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
    }, 0);
    
    return () => {
      document.body.style.overflow = "";
      clearTimeout(timer);
    };
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
        <div className="pointer-events-auto flex items-center justify-between h-14 md:h-16 border-b border-black/10 bg-white/95 px-4 md:px-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)] backdrop-blur-md">
          {/* LEFT — Brand with home redirect */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            {loading ? (
              <>
                <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-4 w-16 rounded-full bg-gray-200 animate-pulse" />
              </>
            ) : (
              <>
                <Image src="/hicon.png" alt="Fieldly" width={28} height={28} className="h-7 w-7 md:h-8 md:w-8" />
                <span className="text-sm md:text-base font-semibold tracking-tight text-zinc-900">Fieldly</span>
              </>
            )}
          </Link>

          {/* CENTER — Nav (Desktop with enhanced dropdowns) */}
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
                {(Object.keys(NAV_DATA) as NavKey[]).map((key) => {
                  const section = NAV_DATA[key];
                  
                  return (
                    <div
                      key={key}
                      className="relative"
                      onMouseEnter={() => handleDesktopDropdownEnter(key)}
                      onMouseLeave={handleDesktopDropdownLeave}
                    >
                      <button className="desktop-dropdown-trigger flex items-center gap-1 text-sm font-medium text-black hover:text-black transition-colors">
                        {section.label}
                        <ChevronDown className={`h-4 w-4 opacity-60 transition-transform ${activeDesktopDropdown === key ? "rotate-180" : ""}`} />
                      </button>

                      {/* Desktop Dropdown Menu - Enhanced UI */}
                      {activeDesktopDropdown === key && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          onMouseEnter={() => setActiveDesktopDropdown(key)}
                          onMouseLeave={handleDesktopDropdownLeave}
                          className="desktop-dropdown-content absolute left-1/2 top-full mt-7 -translate-x-1/2 w-[640px] rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100/50 p-5 z-50"
                        >
                          <div className="grid grid-cols-2 gap-5">
                            {/* Left Column - Navigation Links */}
                            <div className="space-y-1">
                              {section.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setActiveDesktopDropdown(null)}
                                    className="group flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200"
                                  >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white transition-colors">
                                      <Icon className="h-4 w-4 text-gray-600 group-hover:text-black" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-sm text-gray-900 group-hover:text-black">
                                        {item.label}
                                      </div>
                                      {item.desc && (
                                        <div className="text-xs text-gray-500 mt-0.5">
                                          {item.desc}
                                        </div>
                                      )}
                                    </div>
                                    <ArrowUpRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                  </Link>
                                );
                              })}
                            </div>

                            {/* Right Column - Feature Card */}
                            {section.feature && (
                              <div className="bg-[#b7cf8a] rounded-xl p-5 flex flex-col justify-between min-h-[240px]">
                                <div>
                                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                                    {section.feature.title}
                                  </h3>
                                  <p className="text-xs text-gray-700 leading-relaxed">
                                    {section.feature.desc}
                                  </p>
                                </div>

                                <Link
                                  href={section.feature.href}
                                  onClick={() => setActiveDesktopDropdown(null)}
                                  className="group mt-4 flex items-center justify-between bg-black text-white rounded-full px-4 py-2.5 text-xs font-medium hover:bg-gray-900 transition-colors"
                                >
                                  <span>{section.feature.button}</span>
                                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-[#b7cf8a] text-black group-hover:bg-[#a8c07a] transition-colors">
                                    <ArrowUpRight size={12} />
                                  </span>
                                </Link>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
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
                    <button 
                      onClick={toggleDesktopLanguage} 
                      className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-black/5 transition-colors"
                      aria-expanded={desktopLanguageOpen}
                    >
                      <Globe className="h-5 w-5" />
                    </button>
                    
                    {desktopLanguageOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 left-0.5 top-full mt-2 w-48 rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden z-50"
                      >
                        <button 
                          onClick={() => setDesktopLanguageOpen(false)} 
                          className="w-full px-4 py-3 text-left text-sm text-zinc-700 hover:bg-gray-50 hover:text-black transition-colors"
                        >
                          English (EN)
                        </button>
                        <button 
                          onClick={() => setDesktopLanguageOpen(false)} 
                          className="w-full px-4 py-3 text-left text-sm text-zinc-700 hover:bg-gray-50 hover:text-black border-t border-gray-100 transition-colors"
                        >
                          Español (ES)
                        </button>
                      </motion.div>
                    )}
                  </div>

                  <ChevronDown className="h-4 w-4 opacity-60" />

                  <span className="text-sm font-medium text-black whitespace-nowrap">Retail Investors</span>

                  {/* Desktop Auth Section */}
                  <div className="ml-1">
                    <SignedOut>
                      <Link
                        href="/sign-in"
                        className="flex items-center gap-2 rounded-lg bg-[#b7cf8a] px-4 py-2 text-sm font-medium text-black hover:bg-[#a8c07a] transition-colors"
                      >
                        Sign In
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </SignedOut>
                    <SignedIn>
                      <AuthCTA />
                    </SignedIn>
                  </div>
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
                  <SignedOut>
                    <Link
                      href="/sign-in"
                      className="flex h-9 items-center gap-1 rounded-lg bg-[#b7cf8a] px-3 text-xs font-medium text-black hover:bg-[#a8c07a] transition-colors"
                    >
                      Sign In
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "h-8 w-8",
                          userButtonAvatarBox: "h-8 w-8",
                        },
                      }}
                    />
                  </SignedIn>

                  <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-black/10 transition-colors"
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
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
                {/* Navigation Dropdowns with Enhanced UI */}
                <div className="space-y-2">
                  {(Object.keys(NAV_DATA) as NavKey[]).map((key) => {
                    const section = NAV_DATA[key];
                    
                    return (
                      <div key={key} className="border-b border-gray-100 pb-2 last:border-b-0">
                        <button
                          onClick={() => toggleMobileDropdown(key)}
                          className="flex w-full items-center justify-between py-4 px-2 text-base font-medium text-black hover:text-black transition-colors"
                          aria-expanded={mobileActiveDropdown === key}
                        >
                          {section.label}
                          <ChevronDown className={`h-5 w-5 opacity-60 transition-transform duration-200 ${mobileActiveDropdown === key ? "rotate-180" : ""}`} />
                        </button>

                        {/* Mobile Dropdown Content - Enhanced UI */}
                        {mobileActiveDropdown === key && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pb-4 pl-2 pr-2">
                              {/* Feature Card for Mobile */}
                              {section.feature && (
                                <div className="bg-[#b7cf8a] rounded-xl p-4 mb-4">
                                  <h4 className="font-semibold text-base mb-1 text-gray-900">
                                    {section.feature.title}
                                  </h4>
                                  <p className="text-xs text-gray-700 mb-3">
                                    {section.feature.desc}
                                  </p>
                                  <Link
                                    href={section.feature.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="inline-flex items-center gap-1 text-xs font-medium bg-black text-white rounded-full px-4 py-2 hover:bg-gray-900 transition-colors"
                                  >
                                    {section.feature.button}
                                    <ArrowUpRight className="h-3 w-3" />
                                  </Link>
                                </div>
                              )}

                              {/* Navigation Items */}
                              {section.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-zinc-600 hover:bg-gray-50 hover:text-black mb-1 last:mb-0 transition-colors"
                                  >
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50">
                                      <Icon className="h-3.5 w-3.5 text-gray-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium truncate">
                                        {item.label}
                                      </div>
                                      {item.desc && (
                                        <div className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
                                          {item.desc}
                                        </div>
                                      )}
                                    </div>
                                    <ArrowUpRight className="h-3.5 w-3.5 opacity-50" />
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Language Dropdown */}
                <div className="mt-6 mb-4">
                  <button
                    onClick={toggleLanguageDropdown}
                    className="flex w-full items-center justify-between py-3 px-4 rounded-lg bg-gray-50 text-sm font-medium text-zinc-700 hover:bg-gray-100 transition-colors"
                    aria-expanded={languageOpen}
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
                      className="mt-2 overflow-hidden"
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
                <div className="mt-4 mb-6 px-2">
                  <span className="text-sm font-medium text-zinc-600">Retail Investors</span>
                </div>

                {/* Mobile Auth Section */}
                <MobileAuthSection onClose={() => setMobileOpen(false)} />
              </>
            )}
          </motion.div>
        </>
      )}
    </>
  );
}