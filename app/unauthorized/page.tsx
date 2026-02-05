// app/unauthorized/page.tsx
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🚫</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-8">
          You don&apos;t have permission to access this page. 
          Please contact support if you believe this is an error.
        </p>
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Homepage
          </Link>
          <Link
            href="/post-auth"
            className="inline-block w-full py-3 px-4 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}