// client/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Development: Handle localhost subdomains
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: '(?<shopName>.*)\\.localhost:3001',
            },
          ],
          destination: '/shop/:shopName',
        },
      ];
    }

    // Production: Handle custom domain subdomains (if you have one)
    // For Vercel default domains, we use path-based routing in the dashboard
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: '(?<shopName>.*)\\.(?!.*vercel\\.app).*',  // Any subdomain except vercel.app
          },
        ],
        destination: '/shop/:shopName',
      },
    ];
  },
};

module.exports = nextConfig;