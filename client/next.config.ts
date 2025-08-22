// client/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: '(?<shopName>.*)\\.localhost:3000',
          },
        ],
        destination: '/shop/:shopName',
      },
    ];
  },
};

module.exports = nextConfig;