/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add webpack configuration to handle file system issues
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
  // Disable file system cache
  generateEtags: false,
  // Add additional security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  // Add experimental features to handle file system issues
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/**',
      ],
    },
  },
};

module.exports = nextConfig; 