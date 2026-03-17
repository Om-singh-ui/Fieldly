import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LandListingForm } from "../_components/LandListingForm";

export default async function NewLandPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-6xl px-4 mt-18 sm:px-6 lg:px-8 pt-16 pb-20">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            List your land
          </h1>

          <p className="mt-3 text-base text-gray-600 dark:text-gray-400 max-w-2xl">
            Provide accurate and detailed land information so farmers can
            confidently evaluate suitability, lease terms, and availability.
          </p>
        </div>

        {/* FORM */}
        <div className="mt-6">
          <LandListingForm />
        </div>
      </main>
    </div>
  );
}
