/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",            // شعارك
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com", // صور المواد
      },
      // لو تضيفين دومينات ثانية بعدين، حطيها هنا
    ],
  },
};

module.exports = nextConfig;
