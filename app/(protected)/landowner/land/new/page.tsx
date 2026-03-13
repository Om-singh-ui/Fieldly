// app/(protected)/landowner/land/new/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LandListingForm } from "../_components/LandListingForm";

export default async function NewLandPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            List Your Land
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Provide detailed information about your land to attract potential farmers
          </p>
        </div>
        
        <LandListingForm />
      </main>
    </div>
  );
}