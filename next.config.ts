/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Make the API key available to the client-side code
  // Note: This will expose your API key in the client!
  env: {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
  },
}

export default nextConfig;
