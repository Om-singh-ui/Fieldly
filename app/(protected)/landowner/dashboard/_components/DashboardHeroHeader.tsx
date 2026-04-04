    "use client";

    import { motion } from "framer-motion";
    import { Download, Plus } from "lucide-react";
    import { Button } from "@/components/ui/button";
    import { useState, useEffect } from "react";
    import { useRouter } from "next/navigation";

    interface Props {
      name: string;
    }

    export function DashboardHeroHeader({ name }: Props) {
      const [isLoading, setIsLoading] = useState(true);
      const router = useRouter();

      useEffect(() => {
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 1200); // reduced for better UX
        return () => clearTimeout(timer);
      }, []);

      const handleAddLand = () => {
        router.push("/landowner/land/new");
      };

      if (isLoading) {
        return (
          <section className="relative mb-12 mt-16">
            <div
              className="
                relative
                flex flex-col md:flex-row
                items-start md:items-center
                justify-between
                gap-6 md:gap-8
                px-8 md:px-12
                py-6 md:py-7
                rounded-full
                border border-gray-200/80
                shadow-[0_8px_24px_rgba(0,0,0,0.06)]
                backdrop-blur-md
                overflow-hidden
                animate-pulse
              "
            >
              <div className="flex-1 space-y-3">
                <div className="h-9 bg-gray-200 rounded w-72" />
                <div className="h-4 bg-gray-200 rounded w-96" />
                <div className="h-4 bg-gray-200 rounded w-64" />
              </div>

              <div className="flex gap-3">
                <div className="h-10 w-24 bg-gray-200 rounded-full" />
                <div className="h-10 w-28 bg-gray-200 rounded-full" />
              </div>
            </div>
          </section>
        );
      }

      return (
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative mb-12 mt-16"
        >
          <motion.div
            whileHover={{ y: -3, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className="
              relative
              flex flex-col md:flex-row
              items-start md:items-center
              justify-between
              gap-6 md:gap-8
              px-8 md:px-12
              py-6 md:py-7
              rounded-full
              border border-gray-200/80
              shadow-[0_8px_24px_rgba(0,0,0,0.06)]
              hover:shadow-[0_18px_48px_rgba(0,0,0,0.10)]
              backdrop-blur-md
              transition-shadow
              overflow-hidden
            "
          >
            {/* LEFT */}
            <div className="relative z-10">
              <h1 className="text-[22px] md:text-[34px] font-semibold tracking-tight text-gray-900">
                Welcome back, <span className="font-bold text-black">{name}</span>
              </h1>

              <p className="mt-1.5 text-sm md:text-base text-gray-600 max-w-xl">
                A unified workspace to manage your lands, track earnings, and
                oversee applications with clarity.
              </p>
            </div>

            {/* RIGHT */}
            <div className="relative z-10 flex items-center gap-3">
              <motion.div
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  variant="outline"
                  className="rounded-full px-5 h-10 hover:bg-white shadow-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ y: -1, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  onClick={handleAddLand}
                  className="
                    rounded-full
                    px-6
                    h-10
                    bg-[#b7cf8a]
                    hover:bg-[#a9c87a]
                    text-gray-900
                    font-medium
                    border border-[#a9c87a]
                    shadow-[0_4px_12px_rgba(0,0,0,0.10)]
                    hover:shadow-[0_8px_20px_rgba(0,0,0,0.14)]
                    transition-all
                  "
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Land
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>
      );
    }