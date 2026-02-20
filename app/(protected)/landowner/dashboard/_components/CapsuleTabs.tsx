// app/(protected)/landowner/dashboard/_components/CapsuleTabs.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface CapsuleTabsProps {
  stats: {
    pendingApplications: number;
    activeLeases: number;
  };
}

export function CapsuleTabs({ stats }: CapsuleTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: "/icons/dashb.png",
      alt: "Overview Icon",
    },
    {
      id: "lands",
      label: "My Lands",
      icon: "/onboarding/landreq.png",
      alt: "Lands Icon",
    },
    {
      id: "applications",
      label: "Applications",
      icon: "/onboarding/review.png",
      alt: "Applications Icon",
      badge: stats.pendingApplications > 0 ? stats.pendingApplications : null,
    },
    {
      id: "leases",
      label: "Active Leases",
      icon: "/onboarding/user-man-account-person.png",
      alt: "Leases Icon",
      badge: stats.activeLeases > 0 ? stats.activeLeases : null,
    },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);

    // Hide all sections
    document
      .querySelectorAll('[id="overview"], [id="lands"], [id="applications"], [id="leases"]')
      .forEach((section) => section.classList.add("hidden"));

    // Show selected section
    const selectedSection = document.getElementById(tabId);
    if (selectedSection) selectedSection.classList.remove("hidden");
  };

  return (
    <div className="flex justify-start mt-8">
      <div className="inline-flex h-14 items-center justify-start rounded-full bg-transparent p-1.5 gap-1.5 w-auto shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className="relative inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 group"
          >
            {/* Active capsule background */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-[#b7cf8a] rounded-full"
                transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              />
            )}

            {/* Tab content */}
            <span
              className={`relative flex items-center gap-2.5 z-10 transition-colors duration-200 ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200"
              }`}
            >
              {/* Icon */}
              <div className="relative w-6 h-6">
                <Image src={tab.icon} alt={tab.alt} fill className="object-contain" sizes="20px" />
              </div>

              {/* Label */}
              <span className="hidden sm:inline">{tab.label}</span>

              {/* Badge */}
              {tab.badge && (
                <span
                  className={`inline-flex items-cxenter justify-center min-w-[22px] h-5 px-1.5 text-xs font-medium rounded-full ${
                    activeTab === tab.id
                      ? "bg-white text-[#b7cf8a]"
                      : "bg-[#b7cf8a]/10 text-[#b7cf8a]"
                  } border-0 shadow-sm ml-0.5`}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}