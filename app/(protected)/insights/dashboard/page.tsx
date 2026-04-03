"use client";

export default function InsightsDashboard() {
  return (
    <div className="flex w-full">
      <div className="flex-1 flex flex-col">
        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* RIGHT: FUTURE WIDGETS */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold mb-2">Trending Topics</h3>
                <p className="text-sm text-gray-500">(Coming soon)</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold mb-2">Market Signals</h3>
                <p className="text-sm text-gray-500">(Coming soon)</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
