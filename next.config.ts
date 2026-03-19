/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nxfepetnabafrqurgsir.supabase.co",
      },
      {
        protocol: "https",
        hostname: "thelandapp.com",
      },
    ],
  },
};

module.exports = nextConfig;