/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nxfepetnabafrqurgsir.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;