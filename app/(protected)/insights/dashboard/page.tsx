import { InsightsHeroHeader } from "./_components/InsightsHeroHeader";
import { currentUser } from "@clerk/nextjs/server";

export default async function InsightsDashboard() {
  const user = await currentUser();

  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User";

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 ">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <InsightsHeroHeader name={fullName} />

      </main>
    </div>
  );
}