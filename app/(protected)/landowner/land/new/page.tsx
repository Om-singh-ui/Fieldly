// app/(protected)/landowner/land/new/page.tsx

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LandListingForm } from "../_components/LandListingForm";

export default async function NewLandPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen mt-14">
      <main className="w-full px-8 lg:px-16 pt-20 pb-20">
        {/* LEFT ALIGNED HEADER */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            List your land
          </h1>

          <p className="mt-3 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Provide accurate and detailed land information so farmers can
            confidently evaluate suitability, lease terms, and availability.
          </p>
        </div>
        {/* CENTERED FORM */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <section className="rounded-2xl p-6 md:p-10">
              <LandListingForm />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
