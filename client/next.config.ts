// client/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Only enable subdomain rewrites in production
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: '(?<shopName>.*)\\.yourdomain\\.com',  // Replace with your actual domain
            },
          ],
          destination: '/shop/:shopName',
        },
      ];
    }

    // In development, no subdomain rewrites
    return [];
  },
};

module.exports = nextConfig;