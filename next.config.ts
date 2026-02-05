// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Fix image errors
  },
  turbopack: {
    // Resolve the lockfile warning
    resolveAlias: {
      // You might need to adjust this based on your project structure
    }
  }
};

module.exports = nextConfig;